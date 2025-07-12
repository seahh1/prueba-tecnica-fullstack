const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
});