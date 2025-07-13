module.exports = {
  testEnvironment: 'node',
  testTimeout: 10000,
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./tests/setup.js'],
};