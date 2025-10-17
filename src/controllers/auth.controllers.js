import User from "../models/user.model.js";
import Reporte from "../models/reporte.model.js"; // Importar el modelo de Reporte
import { generateToken } from "../utils/jwt.util.js";
import bcrypt from "bcryptjs";
import fs from 'fs/promises'; 
import path from 'path';
import { fileURLToPath } from 'url';


// --- HELPERS PARA GESTIÓN DE ARCHIVOS (FUERA DE FUNCIONES) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Define la ruta base para la carpeta de uploads: /frontend/assets/uploads/avatars
const UPLOADS_FOLDER_PATH = path.join(__dirname, '..', '..', 'frontend', 'assets', 'uploads', 'avatars');


export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    const token = generateToken({
      id: user._id,
      username: user.username,
    });
    return res.json({ message: "Login exitoso", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "El email o username ya existe" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al registrar usuario", error: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    // El .select("-password") debe estar en el modelo User, y lo está.
    // Solo necesitamos asegurarnos que el campo avatarUrl sea incluido.
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.json({ user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

export const logout = (req, res) => {
  return res.json({ message: "Logout exitoso" });
};

export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, bio },
      { new: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({
      message: "Perfil actualizado exitosamente",
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya está en uso." });
    }
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

export const updateAccountCredentials = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword, email } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "La contraseña actual es incorrecta." });
    }
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res
          .status(400)
          .json({ message: "El correo electrónico ya está en uso." });
      }
      user.email = email;
    }
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "Las nuevas contraseñas no coinciden." });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    await user.save();
    res.status(200).json({ message: "Cuenta actualizada exitosamente." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;

  try {
    if (!password) {
      return res.status(400).json({
        message: "Se requiere la contraseña para eliminar la cuenta.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "La contraseña es incorrecta." });
    }

    // --- LÓGICA DE ELIMINACIÓN DE DATOS ASOCIADOS ---
    // 1. Eliminar todos los reportes asociados al usuario
    await Reporte.deleteMany({ author: userId });
    
    // 2. Eliminar la foto de perfil física si existe
    if (user.avatarUrl) {
      const filename = path.basename(user.avatarUrl);
      const filePath = path.join(UPLOADS_FOLDER_PATH, filename);
      try {
        await fs.unlink(filePath);
      } catch (e) {
        console.warn(`No se pudo eliminar el avatar físico antiguo: ${e.message}`);
      }
    }
    
    // 3. Eliminar el usuario de la DB
    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({
        message:
          "Tu cuenta y todos tus reportes han sido eliminados exitosamente.",
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// --- FUNCIÓN NUEVA: ACTUALIZAR AVATAR ---
export const updateProfileAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      // Si el usuario no existe, borra el archivo que Multer ya subió
      if (req.file) {
        await fs.unlink(req.file.path); 
      }
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (!req.file) {
      // Multer no subió nada
      return res.status(400).json({ message: "No se ha subido ningún archivo." });
    }
    
    // 1. Eliminar la foto antigua si existe
    if (user.avatarUrl) {
        const oldFilename = path.basename(user.avatarUrl);
        const oldFilePath = path.join(UPLOADS_FOLDER_PATH, oldFilename);
        
        try {
            // Intenta borrar el archivo físico (si existe en la ruta)
            await fs.unlink(oldFilePath);
        } catch (error) {
            console.warn(`No se pudo eliminar el archivo antiguo: ${oldFilePath}`);
        }
    }

    // 2. Construir la nueva URL pública (ej. /assets/uploads/avatars/...)
    const newAvatarUrl = `/assets/uploads/avatars/${req.file.filename}`;

    // 3. Actualizar la base de datos
    user.avatarUrl = newAvatarUrl;
    await user.save();

    res.status(200).json({
      message: "Foto de perfil actualizada exitosamente.",
      avatarUrl: newAvatarUrl,
    });

  } catch (error) {
    console.error("Error al actualizar el avatar:", error);
    
    // Si falla por error de DB o cualquier otra cosa, borra el archivo subido
    if (req.file) {
        await fs.unlink(req.file.path);
    }
    
    res.status(500).json({ 
        message: "Error interno del servidor al procesar la imagen.",
        error: error.message
    });
  }
};