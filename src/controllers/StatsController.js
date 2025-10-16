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
        const results = await Reporte.aggregate([
            // CRÍTICO: Usamos '$tipoProblema' (camelCase) para coincidir con el modelo.
            { $group: { _id: "$tipoProblema", count: { $sum: 1 } } }, 
            { $sort: { count: -1 } }, // Opcional: ordena por el conteo más alto
        ]);

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
        const allReports = await Reporte.find({});
        return res.status(200).json(allReports);
    } catch (error) {
        console.error("Error al exportar reportes:", error);
        return res
            .status(500)
            .json({ message: "Error al exportar reportes", error: error.message });
    }
};
