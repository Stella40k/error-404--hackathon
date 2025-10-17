import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// --- Configuración de Rutas para ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define la ruta absoluta hacia la carpeta donde se guardarán las fotos.
// La ruta es: [Raíz del Proyecto]/frontend/assets/uploads/avatars
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'frontend', 'assets', 'uploads', 'avatars');

// Asegura que la carpeta exista. Si no existe, la crea.
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 1. Configuración de Almacenamiento (Disco)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Genera un nombre único: ID_USUARIO-TIMESTAMP.ext
    const ext = path.extname(file.originalname);
    const userId = req.user ? req.user.id : 'temp'; // Usa el ID del usuario del token
    cb(null, `${userId}-${Date.now()}${ext}`);
  },
});

// 2. Configuración de Multer (Límites y Filtros)
const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    // Lanza un error si el archivo no es un tipo de imagen permitido
    cb(new Error("Solo se permiten archivos de imagen (jpeg, jpg, png, gif)"));
  },
});

export default uploadMiddleware;