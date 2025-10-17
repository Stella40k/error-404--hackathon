import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.util.js";
import bcrypt from "bcryptjs";

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

    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ message: "Tu cuenta ha sido eliminada exitosamente." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
