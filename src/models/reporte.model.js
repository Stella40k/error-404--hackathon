    import mongoose from "mongoose";

    const ReporteSchema = new mongoose.Schema({
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
    tipoProblema: {
        type: String,
        required: true,
    },
    riesgoPercibido: {
        type: Number,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    fechaReporte: {
        type: Date,
        default: Date.now,
    },
    });

    ReporteSchema.index({ location: "2dsphere" });

    const Reporte = mongoose.model("Reporte", ReporteSchema);
    export default Reporte;
