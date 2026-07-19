const classifyMongoError = (err) => {
  const message = err?.message || 'Unknown database error';
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes('econnrefused') ||
    lowerMessage.includes('querysrv') ||
    lowerMessage.includes('timed out') ||
    lowerMessage.includes('network') ||
    lowerMessage.includes('enotfound') ||
    lowerMessage.includes('dns') ||
    lowerMessage.includes('unreachable')
  ) {
    return {
      category: 'network',
      message: 'Database request failed due to a network issue.',
      details: message,
    };
  }

  if (
    lowerMessage.includes('authentication') ||
    lowerMessage.includes('auth failed') ||
    lowerMessage.includes('bad auth') ||
    lowerMessage.includes('not authorized') ||
    lowerMessage.includes('credential') ||
    lowerMessage.includes('username') ||
    lowerMessage.includes('password')
  ) {
    return {
      category: 'user',
      message: 'Database request failed because the database credentials are invalid.',
      details: message,
    };
  }

  return {
    category: 'database',
    message: 'Database request failed due to a server or database configuration issue.',
    details: message,
  };
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let category = 'server';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === 'MongoServerError' || err.name === 'MongoNetworkError' || err.name === 'MongooseError') {
    const dbError = classifyMongoError(err);
    category = dbError.category;
    message = dbError.message;
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    category,
    ...(process.env.NODE_ENV === 'development' && { details: err.message, stack: err.stack }),
  });
};

module.exports = errorHandler;
