import Reporte from "../models/reporte.model.js";

export const getAllReports = async (req, res) => {
  try {
    const reports = await Reporte.find({})
      .populate("author", "username") // Trae el username del autor
      .sort({ createdAt: -1 }); // Ordena del más nuevo al más antiguo
    res.json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener reportes", error: error.message });
  }
};

export const createReport = async (req, res) => {
  try {
    const { titulo, tipoProblema, subcategoria, descripcion } = req.body;
    const authorId = req.user.id; // Obtenido del token gracias al middleware

    if (!titulo || !tipoProblema || !subcategoria || !descripcion) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const nuevoReporte = new Reporte({
      titulo,
      tipoProblema,
      subcategoria,
      descripcion,
      author: authorId,
    });

    await nuevoReporte.save();

    // Devolvemos el reporte recién creado con la info del autor para mostrarlo dinámicamente
    const populatedReport = await Reporte.findById(nuevoReporte._id).populate(
      "author",
      "username"
    );

    res.status(201).json(populatedReport);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear reporte", error: error.message });
  }
};
