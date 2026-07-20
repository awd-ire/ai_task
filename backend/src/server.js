require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const startServer = async () => {
  await connectDB();

  // CORS — allow requests from Angular dev server and production client
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:4200',
      credentials: true,
    })
  );

  // Body parsers
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  // Serve built Angular app
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
  });

  // Centralized error handler (must be last)
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});

app.use(express.static(path.join(process.cwd(), "public")));

app.get("*", (req, res) => {
    res.sendFile(
        path.join(process.cwd(), "public", "index.html")
    );
});

