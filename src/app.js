const express = require('express');
const taskRoutes = require('./routes/tasks');
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
require('dotenv').config(); // must be the very first line of your entry file

app.use(express.json());
app.use(logger);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/tasks', taskRoutes);
console.log("PORT", process.env.PORT);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
