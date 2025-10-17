import { Router } from "express";
import {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../controllers/categoriaController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas (sin autenticación)
router.get("/categorias", getAllCategorias);
router.get("/categorias/:id", getCategoriaById);

// Rutas protegidas (requieren autenticación)
router.post("/categorias", authMiddleware, createCategoria);
router.put("/categorias/:id", authMiddleware, updateCategoria);
router.delete("/categorias/:id", authMiddleware, deleteCategoria);

export default router;
