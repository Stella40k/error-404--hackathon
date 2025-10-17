import mongoose from "mongoose";

const alertaAcosoSchema = new mongoose.Schema({
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
  tipo: {
    type: String,
    default: "acoso",
    enum: ["acoso"]
  },
  activa: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
});

// Índice 2dsphere obligatorio para consultas geográfi
alertaAcosoSchema.index({ location: "2dsphere" });
alertaAcosoSchema.index({ fechaAlerta: -1 });
alertaAcosoSchema.index({ activa: 1 });

const AlertaAcoso = mongoose.model("AlertaAcoso", alertaAcosoSchema);
export default AlertaAcoso;
