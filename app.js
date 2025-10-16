// app.js

import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/database.js";
import authRoutes from "./src/routes/auth.routes.js";
import taskRoutes from "./src/routes/task.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// --- INICIO DEL CAMBIO ---
// Le decimos a CORS que permita peticiones desde dos orígenes:
// el que tenías antes (5500) y el que usa Live Server (5501).
const allowedOrigins = ["http://localhost:5500", "http://127.0.0.1:5501"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
// --- FIN DEL CAMBIO ---

app.use(morgan("dev"));
app.use(cookieParser());

// Rutas
app.use("/api", authRoutes);
app.use("/api", taskRoutes);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
