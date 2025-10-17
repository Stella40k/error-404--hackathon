import Categoria from "../models/categoria.model.js";

// Obtener todas las categorías activas
export const getAllCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find({ activa: true }).sort({ nombre: 1 });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener categorías", 
      error: error.message 
    });
  }
};

// Obtener una categoría por ID
export const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findById(id);
    
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener categoría", 
      error: error.message 
    });
  }
};

// Crear nueva categoría
export const createCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, icono, color } = req.body;
    
    // Verificar si ya existe una categoría con ese nombre
    const categoriaExistente = await Categoria.findOne({ nombre });
    if (categoriaExistente) {
      return res.status(400).json({ 
        message: "Ya existe una categoría con ese nombre" 
      });
    }
    
    const nuevaCategoria = new Categoria({
      nombre,
      descripcion,
      icono: icono || "📋",
      color: color || "#3B82F6",
    });
    
    await nuevaCategoria.save();
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al crear categoría", 
      error: error.message 
    });
  }
};

// Actualizar categoría
export const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, icono, color, activa } = req.body;
    
    const categoria = await Categoria.findById(id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    
    // Verificar si el nuevo nombre ya existe en otra categoría
    if (nombre && nombre !== categoria.nombre) {
      const categoriaExistente = await Categoria.findOne({ 
        nombre, 
        _id: { $ne: id } 
      });
      if (categoriaExistente) {
        return res.status(400).json({ 
          message: "Ya existe una categoría con ese nombre" 
        });
      }
    }
    
    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      id,
      { nombre, descripcion, icono, color, activa },
      { new: true, runValidators: true }
    );
    
    res.json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar categoría", 
      error: error.message 
    });
  }
};

// Eliminar categoría (soft delete)
export const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    
    const categoria = await Categoria.findById(id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    
    // Soft delete: marcar como inactiva
    await Categoria.findByIdAndUpdate(id, { activa: false });
    
    res.json({ message: "Categoría eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al eliminar categoría", 
      error: error.message 
    });
  }
};
