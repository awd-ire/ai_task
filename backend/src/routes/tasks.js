const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  generateTaskDescription,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All task routes require authentication
router.use(protect);

const taskValidation = [
  body('title').trim().isLength({ min: 2, max: 100 }).withMessage('Title must be 2-100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('status').optional().isIn(['Todo', 'In Progress', 'Completed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
];

router.get('/', getTasks);
router.post('/generate-description', generateTaskDescription);
router.get('/:id', getTask);
router.post('/', taskValidation, validate, createTask);
router.put('/:id', taskValidation, validate, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
