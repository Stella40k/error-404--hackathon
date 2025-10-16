import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // --- CAMPOS CORREGIDOS ---
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    // --- FIN DE LA CORRECCIÓN ---
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      trim: true,
      default: "Ciudadano comprometido con mejorar mi comunidad.",
    },
    role: {
      type: String,
      enum: ["User", "Pro"],
      default: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
