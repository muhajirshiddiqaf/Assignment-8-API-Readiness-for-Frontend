const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const { initDatabase } = require('./database/init');

// Import routes
const authRoutes = require('./routes/auth');
const listsRoutes = require('./routes/lists');
const tasksRoutes = require('./routes/tasks');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with your frontend domain
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/tasks', tasksRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Todo List API',
    version: '1.0.0',
    baseUrl: `${req.protocol}://${req.get('host')}/api`,
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      lists: {
        getAll: 'GET /api/lists',
        getOne: 'GET /api/lists/:id',
        create: 'POST /api/lists',
        update: 'PUT /api/lists/:id',
        delete: 'DELETE /api/lists/:id'
      },
      tasks: {
        getByList: 'GET /api/tasks/list/:listId',
        getOne: 'GET /api/tasks/:id',
        create: 'POST /api/tasks',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id',
        updateStatus: 'PATCH /api/tasks/:id/status'
      }
    },
    authentication: 'Bearer Token required for all endpoints except /api/auth/*'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: '/api'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    console.log('Database initialized successfully');
    
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📚 API Documentation: http://localhost:${config.port}/api`);
      console.log(`🏥 Health Check: http://localhost:${config.port}/health`);
      console.log(`🔐 Auth Endpoints: http://localhost:${config.port}/api/auth`);
      console.log(`📋 Lists Endpoints: http://localhost:${config.port}/api/lists`);
      console.log(`✅ Tasks Endpoints: http://localhost:${config.port}/api/tasks`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 