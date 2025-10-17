import mongoose from 'mongoose';

const Reporte = mongoose.model("Reporte");

// Definir las categorías principales compatibles
const CATEGORIAS_PRINCIPALES = [
  "Delito / Robo",
  "Violencia / Acoso", 
  "Tránsito / Vía Pública",
  "Infraestructura de Riesgo"
];

/**
 * Endpoint: GET /api/stats/by_type
 * Genera estadísticas de reportes agrupados por tipo de problema.
 */
export const getReportsByProblemType = async (req, res) => {
    try {
        console.log("📊 getReportsByProblemType ejecutándose");

        const { categoria, fecha_inicio, fecha_fin } = req.query;
        
        // Validar categoría si se proporciona
        if (categoria && !CATEGORIAS_PRINCIPALES.includes(categoria)) {
            return res.status(400).json({
                message: "Categoría no válida",
                categorias_validas: CATEGORIAS_PRINCIPALES
            });
        }

        const pipeline = [];
        const matchStage = {};
        
        // Filtro por categoría
        if (categoria) {
            matchStage.categoria_principal = categoria;
        }
        
        // Filtro por fecha
        if (fecha_inicio || fecha_fin) {
            matchStage.fechaReporte = {};
            if (fecha_inicio) matchStage.fechaReporte.$gte = new Date(fecha_inicio);
            if (fecha_fin) matchStage.fechaReporte.$lte = new Date(fecha_fin);
        }
        
        // Agregar etapa de filtro si hay filtros
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }
        
        // Agrupación por tipo de problema
        pipeline.push(
            { $group: { 
                _id: "$tipoProblema", 
                count: { $sum: 1 },
                categoria: { $first: "$categoria_principal" },
                avgGravedad: { $avg: "$gravedad_objetiva" }
            }}, 
            { $sort: { count: -1 } }
        );

        const results = await Reporte.aggregate(pipeline);

        console.log("✅ Resultados por tipo:", results.length);

        return res.status(200).json({
            message: "Estadísticas por tipo generadas correctamente",
            data: results,
            filters: { categoria, fecha_inicio, fecha_fin },
            totalTipos: results.length,
            totalReportes: results.reduce((sum, item) => sum + item.count, 0)
        });
        
    } catch (error) {
        console.error("Error al obtener estadísticas por tipo:", error);
        return res.status(500).json({ 
            message: "Error al obtener estadísticas", 
            error: error.message 
        });
    }
};

/**
 * Endpoint: GET /api/stats/by_categoria
 * Genera estadísticas agrupadas por categoría principal
 */
export const getReportsByCategoria = async (req, res) => {
    try {
        console.log("📊 getReportsByCategoria ejecutándose");

        const { fecha_inicio, fecha_fin } = req.query;
        
        const pipeline = [];
        const matchStage = {};
        
        // Filtros de fecha
        if (fecha_inicio || fecha_fin) {
            matchStage.fechaReporte = {};
            if (fecha_inicio) matchStage.fechaReporte.$gte = new Date(fecha_inicio);
            if (fecha_fin) matchStage.fechaReporte.$lte = new Date(fecha_fin);
        }
        
        // Agregar etapa de filtro si hay filtros
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }
        
        // Agrupar por categoría principal
        pipeline.push(
            { $group: { 
                _id: "$categoria_principal", 
                count: { $sum: 1 },
                subcategorias: { 
                    $push: {
                        nombre: "$subcategoria",
                        gravedad: "$gravedad_objetiva"
                    }
                },
                avgGravedad: { $avg: "$gravedad_objetiva" },
                totalReportes: { $sum: 1 }
            }},
            { 
                $project: {
                    categoria: "$_id",
                    count: 1,
                    avgGravedad: { $round: ["$avgGravedad", 2] },
                    subcategorias: 1,
                    _id: 0
                }
            },
            { $sort: { count: -1 } }
        );

        const results = await Reporte.aggregate(pipeline);

        console.log("✅ Resultados por categoría:", results.length);

        return res.status(200).json({
            message: "Estadísticas por categoría generadas correctamente",
            data: results,
            categorias_totales: CATEGORIAS_PRINCIPALES,
            totalCategorias: results.length
        });
        
    } catch (error) {
        console.error("Error al obtener estadísticas por categoría:", error);
        return res.status(500).json({ 
            message: "Error al obtener estadísticas por categoría", 
            error: error.message 
        });
    }
};

/**
 * Endpoint: GET /api/stats/subcategorias
 * Obtiene todas las subcategorías disponibles por categoría principal
 */
export const getSubcategoriasByCategoria = async (req, res) => {
    try {
        const { categoria } = req.query;
        
        // Validar que se proporcionó categoría
        if (!categoria) {
            return res.status(400).json({
                message: "Parámetro 'categoria' requerido",
                categorias_validas: CATEGORIAS_PRINCIPALES
            });
        }

        // Validar categoría
        if (!CATEGORIAS_PRINCIPALES.includes(categoria)) {
            return res.status(400).json({
                message: "Categoría no válida",
                categorias_validas: CATEGORIAS_PRINCIPALES
            });
        }

        // Obtener subcategorías únicas
        const subcategorias = await Reporte.distinct("subcategoria", {
            categoria_principal: categoria
        });

        console.log("✅ Subcategorías para", categoria + ":", subcategorias.length);

        return res.status(200).json({
            categoria,
            subcategorias,
            total: subcategorias.length
        });
        
    } catch (error) {
        console.error("Error al obtener subcategorías:", error);
        return res.status(500).json({ 
            message: "Error al obtener subcategorías", 
            error: error.message 
        });
    }
};

/**
 * Endpoint: GET /api/stats/export_all
 * Busca y devuelve todos los reportes sin procesar (para el botón de exportar).
 */
export const getReportsForExport = async (req, res) => {
    try {
        console.log("📥 getReportsForExport ejecutándose");

        const allReports = await Reporte.find({});

        console.log("✅ Reportes encontrados:", allReports.length);

        return res.status(200).json(allReports);
    } catch (error) {
        console.error("Error al exportar reportes:", error);
        return res.status(500).json({ 
            message: "Error al exportar reportes", 
            error: error.message 
        });
    }
};

/**
 * Endpoint: GET /api/stats/hourly_gravedad
 * Calcula la correlación entre la hora del día y la gravedad del incidente.
 */
export const getHourlyGravedadCorrelation = async (req, res) => {
    try {
        console.log("🕐 getHourlyGravedadCorrelation ejecutándose");

        const results = await Reporte.aggregate([
            {
                $project: {
                    hour: { $hour: "$fechaReporte" },
                    gravedad: "$riesgoPercibido"
                }
            },
            {
                $group: {
                    _id: {
                        hour: "$hour",
                        gravedad: "$gravedad"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.hour": 1, "_id.gravedad": 1 }
            }
        ]);

        console.log("✅ Correlación hora-gravedad calculada:", results.length, "combinaciones");

        return res.status(200).json({
            message: "Correlación hora-gravedad calculada exitosamente",
            data: results,
            totalCombinations: results.length
        });
    } catch (error) {
        console.error("Error al calcular correlación hora-gravedad:", error);
        return res.status(500).json({ 
            message: "Error al calcular correlación hora-gravedad", 
            error: error.message 
        });
    }
};

/**
 * Endpoint: GET /api/stats/daily_gravedad
 * Calcula la correlación entre el día de la semana y la gravedad del incidente.
 */
export const getDailyGravedadCorrelation = async (req, res) => {
    try {
        console.log("📅 getDailyGravedadCorrelation ejecutándose");

        const results = await Reporte.aggregate([
            {
                $project: {
                    dayOfWeek: { $dayOfWeek: "$fechaReporte" },
                    gravedad: "$riesgoPercibido"
                }
            },
            {
                $group: {
                    _id: {
                        dayOfWeek: "$dayOfWeek",
                        gravedad: "$gravedad"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.dayOfWeek": 1, "_id.gravedad": 1 }
            }
        ]);

        console.log("✅ Correlación día-gravedad calculada:", results.length, "combinaciones");

        return res.status(200).json({
            message: "Correlación día de la semana-gravedad calculada exitosamente",
            data: results,
            totalCombinations: results.length,
            dayMapping: {
                1: "Domingo",
                2: "Lunes", 
                3: "Martes",
                4: "Miércoles",
                5: "Jueves",
                6: "Viernes",
                7: "Sábado"
            }
        });
    } catch (error) {
        console.error("Error al calcular correlación día-gravedad:", error);
        return res.status(500).json({ 
            message: "Error al calcular correlación día-gravedad", 
            error: error.message 
        });
    }
};