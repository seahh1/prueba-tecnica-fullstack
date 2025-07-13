const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/database');

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});