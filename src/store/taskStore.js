const { randomUUID } = require('node:crypto');

// Simple in-memory store. Swap this module for a real database later.
const tasks = new Map();

module.exports = {
  findAll({ completed } = {}) {
    let list = [...tasks.values()];
    if (completed !== undefined) list = list.filter((t) => t.completed === completed);
    return list;
  },

  findById(id) {
    return tasks.get(id) || null;
  },

  create({ title, description = '' }) {
    const now = new Date().toISOString();
    const task = { id: randomUUID(), title, description, completed: false, createdAt: now, updatedAt: now };
    tasks.set(task.id, task);
    return task;
  },

  update(id, changes) {
    const task = tasks.get(id);
    if (!task) return null;
    const updated = { ...task, ...changes, id, updatedAt: new Date().toISOString() };
    tasks.set(id, updated);
    return updated;
  },

  remove(id) {
    return tasks.delete(id);
  },

  clear() {
    tasks.clear();
  },
};
