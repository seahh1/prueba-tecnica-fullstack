const express = require('express');
const morgan = require('morgan');
const healthRoutes = require('./routes/health.routes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', healthRoutes);

app.use('/api', healthRoutes);

app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;