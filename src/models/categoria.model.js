import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  icono: {
    type: String,
    default: "📋", // Emoji por defecto
  },
  color: {
    type: String,
    default: "#3B82F6", // Color azul por defecto
  },
  activa: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Índice para búsquedas rápidas
categoriaSchema.index({ nombre: 1, activa: 1 });

const Categoria = mongoose.model("Categoria", categoriaSchema);
export default Categoria;
