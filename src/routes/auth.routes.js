import { Router } from "express";
import {
  login,
  logout,
  profile,
  register,
  updateProfile,
  updateAccountCredentials, // <-- Asegúrate de importar esto
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);

router.get("/profile", authMiddleware, profile);
router.patch("/profile", authMiddleware, updateProfile);

// --- RUTA NUEVA PARA ACTUALIZAR CREDENCIALES ---
router.patch("/account/credentials", authMiddleware, updateAccountCredentials);

router.post("/logout", logout);

export default router;
