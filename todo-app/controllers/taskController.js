// controllers/taskController.js
const Task = require('../models/Task');

// Получение всех задач
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Создание новой задачи
exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Удаление задачи
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

// Обновление статуса задачи
exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateTaskTitle = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true });
    res.json(task);
  } catch (error) {
    res.status(400).send(error);
  }
};
