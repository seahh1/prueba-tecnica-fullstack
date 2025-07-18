const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const healthRoutes = require('./routes/health.routes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./config/logger');


const app = express();


app.set('trust proxy', 1);

app.use(
  helmet({
    strictTransportSecurity: false,
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "upgrade-insecure-requests": null,
      },
    },
  })
);
app.use(cors());   
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);


app.use(express.json());
app.use(cookieParser());

const morganStream = {
  write: (message) => logger.http(message.trim()),
};

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev', { stream: morganStream }));
} else {
  app.use(morgan('combined', { stream: morganStream }));
}


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/api', healthRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;