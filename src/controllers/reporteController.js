import Reporte from "../models/reporte.model.js";

export const getAllReports = async (req, res) => {
  try {
    const { type, minRisk, limit } = req.query;
    const filter = {};
    if (type) filter.tipoProblema = type;
    if (minRisk) filter.riesgoPercibido = { $gte: Number(minRisk) };
    const query = Reporte.find(filter);
    if (limit) query.limit(Number(limit));
    const reports = await query.exec();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reportes", error: error.message });
  }
};

export const createReport = async (req, res) => {
  try {
    const { tipoProblema, riesgoPercibido, descripcion, location } = req.body;
    if (!tipoProblema || !riesgoPercibido || !descripcion || !location) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    if (
      typeof riesgoPercibido !== "number" ||
      riesgoPercibido < 1 ||
      riesgoPercibido > 5
    ) {
      return res.status(400).json({ message: "El riesgoPercibido debe estar entre 1 y 5" });
    }

    // Aceptar tanto GeoJSON { type, coordinates } como { lat, lng }
    let geoLocation;
    if (Array.isArray(location.coordinates)) {
      const [lng, lat] = location.coordinates;
      geoLocation = {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      };
    } else if (
      Object.prototype.hasOwnProperty.call(location, "lat") &&
      Object.prototype.hasOwnProperty.call(location, "lng")
    ) {
      geoLocation = {
        type: "Point",
        coordinates: [Number(location.lng), Number(location.lat)],
      };
    } else {
      return res.status(400).json({
        message:
          "Formato de location inválido. Use { lat, lng } o GeoJSON { type, coordinates }",
      });
    }

    const nuevoReporte = new Reporte({
      tipoProblema,
      riesgoPercibido,
      descripcion,
      location: geoLocation,
    });
    await nuevoReporte.save();
    res.status(201).json(nuevoReporte);
  } catch (error) {
    res.status(500).json({ message: "Error al crear reporte", error: error.message });
  }
};
