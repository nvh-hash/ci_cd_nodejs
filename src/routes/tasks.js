const express = require('express');
const store = require('../store/taskStore');
const { HttpError } = require('../middleware/errorHandler');

const router = express.Router();

function validateTask(body, { partial = false } = {}) {
  const errors = [];
  if (!partial || body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      errors.push('title is required and must be a non-empty string');
    }
  }
  if (body.description !== undefined && typeof body.description !== 'string') {
    errors.push('description must be a string');
  }
  if (body.completed !== undefined && typeof body.completed !== 'boolean') {
    errors.push('completed must be a boolean');
  }
  if (errors.length) throw new HttpError(400, 'Validation failed', errors);
}

// GET /api/tasks?completed=true
router.get('/', (req, res) => {
  console.log("PORT",process.env.PORT)
  const { completed } = req.query;
  const filter = completed === undefined ? {} : { completed: completed === 'true' };
  res.json(store.findAll(filter));
});

// GET /api/tasks/:id
router.get('/:id', (req, res) => {
  const task = store.findById(req.params.id);
  if (!task) throw new HttpError(404, 'Task not found');
  res.json(task);
});

// POST /api/tasks
router.post('/', (req, res) => {
  validateTask(req.body);
  const task = store.create({ title: req.body.title.trim(), description: req.body.description });
  res.status(201).json(task);
});

// PATCH /api/tasks/:id
router.patch('/:id', (req, res) => {
  validateTask(req.body, { partial: true });
  const { title, description, completed } = req.body;
  const changes = Object.fromEntries(
    Object.entries({ title: title?.trim(), description, completed }).filter(([, v]) => v !== undefined)
  );
  const task = store.update(req.params.id, changes);
  if (!task) throw new HttpError(404, 'Task not found');
  res.json(task);
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  if (!store.remove(req.params.id)) throw new HttpError(404, 'Task not found');
  res.status(204).end();
});

module.exports = router;
