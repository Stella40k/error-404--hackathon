import { Router } from "express";
import {
  createPerson,
  deletePerson,
  getAllPeople,
  updatePerson,
} from "../controllers/person.controllers.js";
import {
  createPersonValidation,
  updatePersonValidation,
} from "../middlewares/validations/person.validations.js";
import { validator } from "../middlewares/validator.middleware.js";

const router = Router();

router.get("/people", getAllPeople);
router.post("/people", createPersonValidation, validator, createPerson);
router.put("/people/:id", updatePersonValidation, validator, updatePerson);
router.delete("/people/:id", deletePerson);

// Exportamos el router de una forma más estándar
export default router;
