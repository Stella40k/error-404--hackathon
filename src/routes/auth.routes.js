import { Router } from "express";
import {
  login,
  logout,
  profile,
  register,
  updateProfile,
  updateProfileAvatar,
  updateAccountCredentials,
  deleteAccount,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import  uploadMiddleware  from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);

router.get("/profile", authMiddleware, profile);
router.patch("/profile", authMiddleware, updateProfile);
router.patch("/account/credentials", authMiddleware, updateAccountCredentials);

router.patch(
  "/profile/avatar",
  authMiddleware,
  uploadMiddleware.single("avatar"), 
  updateProfileAvatar
);

// --- RUTA NUEVA PARA ELIMINAR LA CUENTA ---
router.delete("/account", authMiddleware, deleteAccount);

router.post("/logout", logout);

export default router;
