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
      name: user.person?.name,
      lastname: user.person?.lastname,
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
    const { name, lastname, username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "El email o username ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      person: { name, lastname },
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
  // En un esquema basado en tokens JWT en el cliente, el logout
  // se maneja en el frontend eliminando el token.
  // Esta ruta puede ser simbólica o usarse para listas de tokens inválidos.
  return res.json({ message: "Logout exitoso" });
};
