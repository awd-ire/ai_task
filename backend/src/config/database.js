const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const dbPath = path.resolve(process.cwd(), process.env.DB_PATH || './data/ai-task-manager.sqlite');
const dbDirectory = path.dirname(dbPath);

if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions:
        process.env.NODE_ENV === 'production'
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            }
          : {},
      define: {
        timestamps: true,
        underscored: true,
      },
    })
  : new Sequelize({
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
    console.log(
      `✅ Database connected: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite'} | ${process.env.DATABASE_URL || dbPath}`
    );

    const User = require('../models/User');
    const Task = require('../models/Task');

    User.hasMany(Task, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    Task.belongsTo(User, { foreignKey: 'user_id' });

    await sequelize.sync({ force: false, alter: false });
    console.log('✅ Database tables synchronized');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
