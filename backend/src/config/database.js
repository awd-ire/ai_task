const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const dbPath = path.resolve(process.cwd(), process.env.DB_PATH || './data/ai-task-manager.sqlite');
const dbDirectory = path.dirname(dbPath);

if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ SQLite database connected: ${dbPath}`);

    const User = require('../models/User');
    const Task = require('../models/Task');

    User.hasMany(Task, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    Task.belongsTo(User, { foreignKey: 'user_id' });

    await sequelize.sync({ force: false, alter: false });
    console.log('✅ SQLite tables synchronized');
  } catch (error) {
    console.error('❌ SQLite connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
