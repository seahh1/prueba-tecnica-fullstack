const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const healthRoutes = require('./routes/health.routes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');


const app = express();

app.use(helmet()); 
app.use(cors()); 

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);


app.use(express.json()); 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); 
}

app.use('/api', healthRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use(errorHandler);