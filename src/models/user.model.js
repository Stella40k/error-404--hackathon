import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Datos de persona embebidos
    person: {
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
    },
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
