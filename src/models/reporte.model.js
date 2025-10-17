import mongoose from "mongoose";

const ReporteSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    tipoProblema: {
      type: String,
      required: true,
    },
    subcategoria: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Esto añade createdAt y updatedAt
  }
);

const Reporte = mongoose.model("Reporte", ReporteSchema);
export default Reporte;
