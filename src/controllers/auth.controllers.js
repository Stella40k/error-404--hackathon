import { PersonModel } from "../models/person.model.js";
import { UserModel } from "../models/user.model.js";
import { generateToken } from "../utils/jwt.util.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({
    where: { username, password },
    include: {
      model: PersonModel,
      attributes: ["name", "lastname"],
      as: "person",
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = generateToken({
    id: user.id,
    name: user.person.name,
    lastname: user.person.lastname,
  });

  /* res.cookie("token", token, {
    httpOnly: true,
    // secure: false,
    // sameSite: "strict",
    maxAge: 1000 * 60 * 60, // 1h
  });

  return res.json({ message: "Login exitoso" }); */

  return res.json({ message: "Login exitoso", token });
};

export const register = async (req, res) => {
  try {
    const { name, lastname, username, email, password } = req.body;

    const persona = await PersonModel.create({
      name,
      lastname,
    });

    await UserModel.create({
      username,
      email,
      password,
      person_id: persona.dataValues.id,
    });

    return res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al registrar usuario", error });
  }
};

export const profile = (req, res) => {
  return res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      lastname: req.user.lastname,
    },
  });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logout exitoso" });
};
