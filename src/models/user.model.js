import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
    avatarUrl: {
      type: String,
      default: null, // Inicialmente no tienen foto
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
