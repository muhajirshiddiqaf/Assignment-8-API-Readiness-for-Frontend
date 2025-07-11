const express = require('express');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Helper function to check if user owns the list
const checkListOwnership = (userId, listId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM lists WHERE id = ? AND user_id = ?', [listId, userId], (err, list) => {
      if (err) {
        reject(err);
      } else {
        resolve(list);
      }
    });
  });
};

// Get all tasks for a specific list
router.get('/list/:listId', async (req, res) => {
  try {
    const userId = req.user.userId;
    const listId = req.params.listId;

    // Check if user owns the list
    const list = await checkListOwnership(userId, listId);
    if (!list) {
      return res.status(404).json({
        error: 'List not found',
        message: 'The requested list does not exist or you do not have access to it'
      });
    }

    db.all('SELECT * FROM tasks WHERE list_id = ? ORDER BY created_at DESC', [listId], (err, tasks) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error fetching tasks'
        });
      }

      res.json({
        message: 'Tasks retrieved successfully',
        data: tasks
      });
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: 'Internal server error'
    });
  }
});

// Get a specific task by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;

    // Get task with list ownership check
    db.get(`
      SELECT t.* FROM tasks t 
      JOIN lists l ON t.list_id = l.id 
      WHERE t.id = ? AND l.user_id = ?
    `, [taskId, userId], (err, task) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error fetching task'
        });
      }

      if (!task) {
        return res.status(404).json({
          error: 'Task not found',
          message: 'The requested task does not exist or you do not have access to it'
        });
      }

      res.json({
        message: 'Task retrieved successfully',
        data: task
      });
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: 'Internal server error'
    });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { listId, title, description, priority, dueDate } = req.body;

    // Validation
    if (!listId || !title) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'List ID and title are required'
      });
    }

    // Check if user owns the list
    const list = await checkListOwnership(userId, listId);
    if (!list) {
      return res.status(404).json({
        error: 'List not found',
        message: 'The requested list does not exist or you do not have access to it'
      });
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    const finalPriority = validPriorities.includes(priority) ? priority : 'medium';

    db.run(
      'INSERT INTO tasks (list_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)',
      [listId, title, description || null, finalPriority, dueDate || null],
      function(err) {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error creating task'
          });
        }

        // Get the created task
        db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, task) => {
          if (err) {
            return res.status(500).json({
              error: 'Database error',
              message: 'Error fetching created task'
            });
          }

          res.status(201).json({
            message: 'Task created successfully',
            data: task
          });
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: 'Internal server error'
    });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;
    const { title, description, status, priority, dueDate } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'Title is required'
      });
    }

    // Get task with list ownership check
    db.get(`
      SELECT t.* FROM tasks t 
      JOIN lists l ON t.list_id = l.id 
      WHERE t.id = ? AND l.user_id = ?
    `, [taskId, userId], (err, task) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error checking task ownership'
        });
      }

      if (!task) {
        return res.status(404).json({
          error: 'Task not found',
          message: 'The requested task does not exist or you do not have access to it'
        });
      }

      // Validate status and priority
      const validStatuses = ['pending', 'in_progress', 'completed'];
      const validPriorities = ['low', 'medium', 'high'];
      const finalStatus = validStatuses.includes(status) ? status : task.status;
      const finalPriority = validPriorities.includes(priority) ? priority : task.priority;

      // Update the task
      db.run(
        'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, description || null, finalStatus, finalPriority, dueDate || null, taskId],
        function(err) {
          if (err) {
            return res.status(500).json({
              error: 'Database error',
              message: 'Error updating task'
            });
          }

          // Get the updated task
          db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, updatedTask) => {
            if (err) {
              return res.status(500).json({
                error: 'Database error',
                message: 'Error fetching updated task'
              });
            }

            res.json({
              message: 'Task updated successfully',
              data: updatedTask
            });
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: 'Internal server error'
    });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;

    // Get task with list ownership check
    db.get(`
      SELECT t.* FROM tasks t 
      JOIN lists l ON t.list_id = l.id 
      WHERE t.id = ? AND l.user_id = ?
    `, [taskId, userId], (err, task) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error checking task ownership'
        });
      }

      if (!task) {
        return res.status(404).json({
          error: 'Task not found',
          message: 'The requested task does not exist or you do not have access to it'
        });
      }

      // Delete the task
      db.run('DELETE FROM tasks WHERE id = ?', [taskId], function(err) {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error deleting task'
          });
        }

        res.json({
          message: 'Task deleted successfully',
          data: { id: taskId }
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: 'Internal server error'
    });
  }
});

// Update task status only
router.patch('/:id/status', async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;
    const { status } = req.body;

    // Validation
    if (!status) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: pending, in_progress, completed'
      });
    }

    // Get task with list ownership check
    db.get(`
      SELECT t.* FROM tasks t 
      JOIN lists l ON t.list_id = l.id 
      WHERE t.id = ? AND l.user_id = ?
    `, [taskId, userId], (err, task) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error checking task ownership'
        });
      }

      if (!task) {
        return res.status(404).json({
          error: 'Task not found',
          message: 'The requested task does not exist or you do not have access to it'
        });
      }

      // Update the task status
      db.run(
        'UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, taskId],
        function(err) {
          if (err) {
            return res.status(500).json({
              error: 'Database error',
              message: 'Error updating task status'
            });
          }

          // Get the updated task
          db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, updatedTask) => {
            if (err) {
              return res.status(500).json({
                error: 'Database error',
                message: 'Error fetching updated task'
              });
            }

            res.json({
              message: 'Task status updated successfully',
              data: updatedTask
            });
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: 'Internal server error'
    });
  }
});

module.exports = router; 