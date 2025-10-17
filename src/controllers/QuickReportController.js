import mongoose from "mongoose";

// Verificar si el modelo ya existe para evitar errores
const Reporte = mongoose.models.Reporte || mongoose.model("Reporte");

/**
 * Endpoint: POST /quick
 * Reporte público de 1 clic con máxima gravedad.
 */
export const createQuickReport = async (req, res) => {
  try {
    const { location } = req.body;

    if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({
        message: "Ubicación requerida en formato GeoJSON Point",
      });
    }

    // Forzar campos según requerimiento para activar máxima gravedad
    const newReport = new Reporte({
      location: {
        type: "Point",
        coordinates: location.coordinates, // [lng, lat]
      },
      categoria_principal: "Delito / Robo",
      subcategoria: "Robo con Violencia",
      descripcion: "Alerta Rápida Geo (Botón de Pánico)",
      anonimo: true,
      gravedad_objetiva: 5, // ← CAMPO FALTANTE - máxima gravedad
      riesgoPercibido: 5,    // ← POSIBLE CAMPO FALTANTE (según tu modelo)
      tipoProblema: "Emergencia" // ← POSIBLE CAMPO FALTANTE
    });

    await newReport.save();

    return res.status(201).json({
      message: "Reporte rápido creado",
      reportId: newReport._id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear reporte rápido", error: error.message });
  }
};