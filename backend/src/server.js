const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./config/logger');


dotenv.config();

connectDB();

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => { // Usamos 'server' para el unhandledRejection
  logger.info(`Backend server listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
});


process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection: ${err.message}`, { stack: err.stack, promise });
  server.close(() => process.exit(1));
});