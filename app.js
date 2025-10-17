// app.js

import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Importa la conexión a la DB
import { connectDB } from "./src/config/database.js";

// Importa TODAS las rutas
import authRoutes from "./src/routes/auth.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import reporteRoutes from "./src/routes/reporteRoutes.js";
import userRoutes from "./src/routes/user.routes.js";
import statsRoutes from "./src/routes/stats.route.js";
import alertasRoutes from "./src/routes/alertas.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Rutas de la API - MONTAR TODAS
app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use("/api", reporteRoutes);
app.use("/api", userRoutes);
app.use("/api", statsRoutes); // ← Tu ruta de stats
app.use("/api", alertasRoutes);

// Ruta "Catch-All" para el Frontend - DEBE SER LA ÚLTIMA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Iniciar el servidor
app.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Servidor unificado corriendo en http://localhost:${PORT}`);
});