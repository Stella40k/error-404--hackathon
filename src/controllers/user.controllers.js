import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    // Con el esquema embebido en Mongoose, devolvemos los usuarios sin el password
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
