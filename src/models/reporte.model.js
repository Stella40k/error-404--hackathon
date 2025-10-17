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
  },
  categoria_principal: {
    type: String,
    required: true,
    enum: ["Delito / Robo", "Violencia / Acoso", "Tránsito / Vía Pública", "Infraestructura de Riesgo"]
  },
  subcategoria: {
    type: String,
    required: true,
    enum: [
      "Robo con Violencia",
      "Situación de Violencia de Género", 
      "Hurto",
      "Acoso / Hostigamiento",
      "Accidente Vial",
      "Pelea o Agresión",
      "Conducción Peligrosa",
      "Vandalismo y Daño",
      "Vía Pública en Mal Estado",
      "Obstrucción / Peligro Vial",
      "Mala Iluminación"
    ]
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  gravedad_objetiva: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  fechaReporte: {
    type: Date,
    default: Date.now,
  },
  anonimo: {
    type: Boolean,
    default: false
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // Opcional para reportes anónimos
  },
  estado: {
    type: String,
    enum: ["pendiente", "en_proceso", "resuelto", "cancelado"],
    default: "pendiente"
  },
  prioridad: {
    type: String,
    enum: ["mínima", "baja", "moderada", "alta", "máxima"],
    default: "moderada"
  }
}, {
  timestamps: true,
});

// Índices para optimizar consultas
ReporteSchema.index({ location: "2dsphere" });
ReporteSchema.index({ categoria_principal: 1, subcategoria: 1 });
ReporteSchema.index({ gravedad_objetiva: 1, estado: 1 });
ReporteSchema.index({ fechaReporte: -1 });
ReporteSchema.index({ usuario: 1 });
ReporteSchema.index({ anonimo: 1 });

const Reporte = mongoose.model("Reporte", ReporteSchema);
export default Reporte;
