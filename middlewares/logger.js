const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports:
    process.env.NODE_ENV == 'development'
      ? [
          new winston.transports.Console(),
          new winston.transports.File({ filename: 'logs.log', dirname: './logs' }),
        ]
      : [new winston.transports.Console()],
});

module.exports = logger;
