const express = require('express');
const store = require('../store/taskStore');

const router = express.Router();

// GET /api/stats - summary counts of tasks
router.get('/', (req, res) => {
  const all = store.findAll();
  const completed = all.filter((t) => t.completed).length;
  res.json({
    total: all.length,
    completed,
    pending: all.length - completed,
    completionRate: all.length ? Math.round((completed / all.length) * 100) : 0,
  });
});

module.exports = router;
