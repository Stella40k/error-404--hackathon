import { Router } from "express";
import {
  login,
  logout,
  profile,
  register,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRoutes = Router();

// loguearse
authRoutes.post("/login", login);

// registrarse
authRoutes.post("/register", register);

// // ver perfil del logueado
authRoutes.get("/profile", authMiddleware, profile);

// // desloguearse;
authRoutes.post("/logout", logout);
