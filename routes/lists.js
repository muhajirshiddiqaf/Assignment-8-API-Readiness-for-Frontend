const express = require('express');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all lists for the authenticated user
router.get('/', (req, res) => {
  const userId = req.user.userId;

  db.all('SELECT * FROM lists WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, lists) => {
    if (err) {
      return res.status(500).json({
        error: 'Database error',
        message: 'Error fetching lists'
      });
    }

    res.json({
      message: 'Lists retrieved successfully',
      data: lists
    });
  });
});

// Get a specific list by ID
router.get('/:id', (req, res) => {
  const userId = req.user.userId;
  const listId = req.params.id;

  db.get('SELECT * FROM lists WHERE id = ? AND user_id = ?', [listId, userId], (err, list) => {
    if (err) {
      return res.status(500).json({
        error: 'Database error',
        message: 'Error fetching list'
      });
    }

    if (!list) {
      return res.status(404).json({
        error: 'List not found',
        message: 'The requested list does not exist or you do not have access to it'
      });
    }

    res.json({
      message: 'List retrieved successfully',
      data: list
    });
  });
});

// Create a new list
router.post('/', (req, res) => {
  const userId = req.user.userId;
  const { title, description } = req.body;

  // Validation
  if (!title) {
    return res.status(400).json({
      error: 'Missing required field',
      message: 'Title is required'
    });
  }

  db.run(
    'INSERT INTO lists (user_id, title, description) VALUES (?, ?, ?)',
    [userId, title, description || null],
    function(err) {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error creating list'
        });
      }

      // Get the created list
      db.get('SELECT * FROM lists WHERE id = ?', [this.lastID], (err, list) => {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error fetching created list'
          });
        }

        res.status(201).json({
          message: 'List created successfully',
          data: list
        });
      });
    }
  );
});

// Update a list
router.put('/:id', (req, res) => {
  const userId = req.user.userId;
  const listId = req.params.id;
  const { title, description } = req.body;

  // Validation
  if (!title) {
    return res.status(400).json({
      error: 'Missing required field',
      message: 'Title is required'
    });
  }

  // First check if the list exists and belongs to the user
  db.get('SELECT * FROM lists WHERE id = ? AND user_id = ?', [listId, userId], (err, list) => {
    if (err) {
      return res.status(500).json({
        error: 'Database error',
        message: 'Error checking list ownership'
      });
    }

    if (!list) {
      return res.status(404).json({
        error: 'List not found',
        message: 'The requested list does not exist or you do not have access to it'
      });
    }

    // Update the list
    db.run(
      'UPDATE lists SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [title, description || null, listId, userId],
      function(err) {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error updating list'
          });
        }

        // Get the updated list
        db.get('SELECT * FROM lists WHERE id = ?', [listId], (err, updatedList) => {
          if (err) {
            return res.status(500).json({
              error: 'Database error',
              message: 'Error fetching updated list'
            });
          }

          res.json({
            message: 'List updated successfully',
            data: updatedList
          });
        });
      }
    );
  });
});

// Delete a list
router.delete('/:id', (req, res) => {
  const userId = req.user.userId;
  const listId = req.params.id;

  // First check if the list exists and belongs to the user
  db.get('SELECT * FROM lists WHERE id = ? AND user_id = ?', [listId, userId], (err, list) => {
    if (err) {
      return res.status(500).json({
        error: 'Database error',
        message: 'Error checking list ownership'
      });
    }

    if (!list) {
      return res.status(404).json({
        error: 'List not found',
        message: 'The requested list does not exist or you do not have access to it'
      });
    }

    // Delete the list (tasks will be deleted automatically due to CASCADE)
    db.run('DELETE FROM lists WHERE id = ? AND user_id = ?', [listId, userId], function(err) {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error deleting list'
        });
      }

      res.json({
        message: 'List deleted successfully',
        data: { id: listId }
      });
    });
  });
});

module.exports = router; 