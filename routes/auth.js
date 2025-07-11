const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database/init');
const config = require('../config');

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Username, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password too short',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, user) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error checking user existence'
        });
      }

      if (user) {
        return res.status(409).json({
          error: 'User already exists',
          message: 'A user with this email or username already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function(err) {
          if (err) {
            return res.status(500).json({
              error: 'Database error',
              message: 'Error creating user'
            });
          }

          // Generate JWT token
          const token = jwt.sign(
            { userId: this.lastID, username, email },
            config.jwtSecret,
            { expiresIn: '24h' }
          );

          res.status(201).json({
            message: 'User registered successfully',
            user: {
              id: this.lastID,
              username,
              email
            },
            token
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: 'Internal server error during registration'
    });
  }
});

// User Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and password are required'
      });
    }

    // Find user
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error finding user'
        });
      }

      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      });
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: 'Internal server error during login'
    });
  }
});

// Get current user profile
router.get('/profile', (req, res) => {
  // This route should be protected by auth middleware
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  res.json({
    user: {
      id: req.user.userId,
      username: req.user.username,
      email: req.user.email
    }
  });
});

module.exports = router; 