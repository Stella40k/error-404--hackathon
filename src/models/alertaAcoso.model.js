import mongoose from "mongoose";

const AlertaAcosoSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  fechaAlerta: {
    type: Date,
    default: Date.now,
  },
});

// Índice geoespacial para consultas de ubicación
AlertaAcosoSchema.index({ location: "2dsphere" });

const AlertaAcoso = mongoose.models.AlertaAcoso || mongoose.model("AlertaAcoso", AlertaAcosoSchema);
export default AlertaAcoso;
