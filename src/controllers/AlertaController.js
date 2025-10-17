import mongoose from "mongoose";

// Accedemos al modelo registrado 'AlertaAcoso'
const AlertaAcoso = mongoose.model("AlertaAcoso");

/**
 * Endpoint: POST /api/alerts/acoso
 * Registra una alerta silenciosa de acoso con ubicación geográfica.
 * Ruta PÚBLICA - no requiere autenticación.
 */
export const registerSilentAlert = async (req, res) => {
  try {
    console.log("🚨 registerSilentAlert ejecutándose");
    
    const { location } = req.body;

    // Validación básica de la ubicación
    if (!location || !location.coordinates || !Array.isArray(location.coordinates)) {
      return res.status(400).json({
        message: "Ubicación requerida con formato GeoJSON Point",
        error: "Formato de ubicación inválido"
      });
    }

    // Validar que las coordenadas sean válidas
    if (location.coordinates.length !== 2) {
      return res.status(400).json({
        message: "Las coordenadas deben ser [longitud, latitud]",
        error: "Formato de coordenadas inválido"
      });
    }

    // Crear nueva alerta
    const nuevaAlerta = new AlertaAcoso({
      location: {
        type: "Point",
        coordinates: location.coordinates
      }
    });

    await nuevaAlerta.save();

    console.log("✅ Alerta silenciosa registrada:", nuevaAlerta._id);

    return res.status(201).json({
      message: "Alerta silenciosa registrada exitosamente",
      alerta: {
        id: nuevaAlerta._id,
        location: nuevaAlerta.location,
        fechaAlerta: nuevaAlerta.fechaAlerta
      }
    });

  } catch (error) {
    console.error("Error al registrar alerta silenciosa:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
};
