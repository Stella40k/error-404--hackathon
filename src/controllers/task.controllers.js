import Task from "../models/task.model.js";

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate(
      "author",
      "username name lastname"
    );
    res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getAllTasksByUserId = async (req, res) => {
  const userLoggedId = req.user.id;

  try {
    const tasks = await Task.find({ author: userLoggedId }).populate(
      "author",
      "username name lastname"
    );
    res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const createTask = async (req, res) => {
  const userLoggedId = req.user.id;
  const { title, description, is_completed } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      is_completed,
      author: userLoggedId,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
