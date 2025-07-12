const express = require('express');
const morgan = require('morgan');
const healthRoutes = require('./routes/health.routes');

const app = express();

app.use(express.json()); 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); 
}

app.use('/api', healthRoutes); 

module.exports = app;