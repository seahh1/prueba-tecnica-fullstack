const winston = require('winston');

const consoleFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  if (stack) {
    return `${timestamp} ${level}: ${message}\n${stack}`;
  }
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', 
  
  levels: winston.config.npm.levels,

  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
    winston.format.errors({ stack: true }), 
    
    process.env.NODE_ENV === 'production'
      ? winston.format.json() 
      : winston.format.colorize(), 
    process.env.NODE_ENV === 'production' ? winston.format.json() : consoleFormat 
  ),

  
  transports: [
    new winston.transports.Console(),
  ],
  
  exitOnError: false, 
});

module.exports = logger;