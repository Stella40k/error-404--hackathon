import { Router } from "express";
import {
  login,
  logout,
  profile,
  register,
  updateProfile,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);

router.get("/profile", authMiddleware, profile);
router.patch("/profile", authMiddleware, updateProfile);

router.post("/logout", logout);

export default router;
