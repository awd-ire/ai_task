const Task = require('../models/Task');
const AppError = require('../utils/AppError');
const { generateDescription } = require('../services/aiService');
const { Op } = require('sequelize');

const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sortBy = 'createdAt', order = 'desc' } = req.query;

    const where = { user_id: req.user.id };

    if (status && status !== 'All') where.status = status;
    if (priority && priority !== 'All') where.priority = priority;
    if (search) where.title = { [Op.like]: `%${search}%` };

    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    const tasks = await Task.findAll({
      where,
      order: [[sortBy || 'createdAt', sortOrder]],
    });

    const allUserTasks = await Task.findAll({ where: { user_id: req.user.id } });
    const stats = {
      total: allUserTasks.length,
      completed: allUserTasks.filter((t) => t.status === 'Completed').length,
      inProgress: allUserTasks.filter((t) => t.status === 'In Progress').length,
      pending: allUserTasks.filter((t) => t.status === 'Todo').length,
    };

    res.status(200).json({ success: true, count: tasks.length, stats, tasks });
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!task) return next(new AppError('Task not found.', 404));

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      user_id: req.user.id,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority } = req.body;

    const task = await Task.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!task) return next(new AppError('Task not found.', 404));

    await task.update({ title, description, status, priority });

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!task) return next(new AppError('Task not found.', 404));

    await task.destroy();
    res.status(200).json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const generateTaskDescription = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || title.trim().length < 2) {
      return next(new AppError('Please provide a task title to generate a description.', 400));
    }

    const result = generateDescription(title.trim());
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, generateTaskDescription };
