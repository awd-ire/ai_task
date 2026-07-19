const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
      validate: {
        len: [0, 1000],
      },
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'Todo',
      validate: {
        isIn: [['Todo', 'In Progress', 'Completed']],
      },
    },
    priority: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'Medium',
      validate: {
        isIn: [['Low', 'Medium', 'High']],
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    tableName: 'tasks',
    timestamps: true,
  }
);

module.exports = Task;
