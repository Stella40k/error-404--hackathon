import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/database.js";
import { personRoutes } from "./src/routes/person.routes.js";
import { userRoutes } from "./src/routes/user.routes.js";
import { authRoutes } from "./src/routes/auth.routes.js";
import { taskRoutes } from "./src/routes/task.routes.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5500", // o la URL de tu frontend
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", personRoutes);
app.use("/api", userRoutes);
app.use("/api", taskRoutes);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`servidor corriendo en el puerto ${PORT}`);
});
