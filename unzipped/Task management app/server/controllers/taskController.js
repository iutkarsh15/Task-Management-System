const Task = require('../models/Task');

// @desc    Get all user tasks (supports search, filter, and sort)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { search, status, priority, sort } = req.query;

    // Build query object
    const query = { user: req.user._id };

    // Search query (title or description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Sorting options
    let sortOption = {};
    if (sort === 'dueDate') {
      sortOption = { dueDate: 1 }; // Soonest due date first
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 }; // Newest created first
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 }; // Oldest created first
    } else {
      sortOption = { createdAt: -1 }; // Default: newest first
    }

    const tasks = await Task.find(query).sort(sortOption);
    return res.json(tasks);
  } catch (error) {
    console.error('Get Tasks Error:', error.message);
    return res.status(500).json({ message: 'Server error retrieving tasks' });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!dueDate) {
      return res.status(400).json({ message: 'Due date is required' });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description: description || '',
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error('Create Task Error:', error.message);
    return res.status(500).json({ message: 'Server error creating task' });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure task belongs to the user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this task' });
    }

    return res.json(task);
  } catch (error) {
    console.error('Get Task Error:', error.message);
    return res.status(500).json({ message: 'Server error retrieving task' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure task belongs to the user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status !== undefined ? status : task.status;
    task.priority = priority !== undefined ? priority : task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

    const updatedTask = await task.save();
    return res.json(updatedTask);
  } catch (error) {
    console.error('Update Task Error:', error.message);
    return res.status(500).json({ message: 'Server error updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure task belongs to the user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    return res.json({ message: 'Task removed successfully' });
  } catch (error) {
    console.error('Delete Task Error:', error.message);
    return res.status(500).json({ message: 'Server error deleting task' });
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure task belongs to the user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    const updatedTask = await task.save();
    return res.json(updatedTask);
  } catch (error) {
    console.error('Update Task Status Error:', error.message);
    return res.status(500).json({ message: 'Server error updating task status' });
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus
};
