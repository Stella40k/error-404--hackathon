import mongoose from 'mongoose';

// Accedemos al modelo registrado 'Reporte'. 
// Esto asume que el archivo del modelo (Reporte.model.js) está siendo importado en app.js.
const Reporte = mongoose.model("Reporte");

/**
 * Endpoint: GET /api/stats/by_type
 * Genera estadísticas de reportes agrupados por tipo de problema (para Chart.js).
 */
export const getReportsByProblemType = async (req, res) => {
    try {

        console.log("📊 getReportsByProblemType ejecutándose");
        return res.status(200).json({ message: "Estadísticas generadas correctamente" });

        // Usamos agregación para agrupar por 'tipoProblema' y contar
        // CRÍTICO: Asegúrate de que el campo en la base de datos es 'tipoProblema' (camelCase).

        const results = await Reporte.aggregate([
            // CRÍTICO: Usamos '$tipoProblema' (camelCase) para coincidir con el modelo.
            { $group: { _id: "$tipoProblema", count: { $sum: 1 } } }, 
            { $sort: { count: -1 } }, // Opcional: ordena por el conteo más alto
        ]);

        console.log("✅ Resultados:", results);

        return res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener estadísticas por tipo:", error);
        return res
            .status(500)
            .json({ message: "Error al obtener estadísticas", error: error.message });
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
        return res
            .status(500)
            .json({ message: "Error al exportar reportes", error: error.message });
    }
};

/**
 * Endpoint: GET /api/stats/hourly_gravedad
 * Calcula la correlación entre la hora del día y la gravedad del incidente.
 * Usa agregación para extraer la hora y agrupar por hora y nivel de riesgo.
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
        return res
            .status(500)
            .json({ 
                message: "Error al calcular correlación hora-gravedad", 
                error: error.message 
            });
    }
};

/**
 * Endpoint: GET /api/stats/daily_gravedad
 * Calcula la correlación entre el día de la semana y la gravedad del incidente.
 * Usa agregación para extraer el día de la semana (1=Domingo, 7=Sábado) y agrupar por día y nivel de riesgo.
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
        return res
            .status(500)
            .json({ 
                message: "Error al calcular correlación día-gravedad", 
                error: error.message 
            });
    }
};
