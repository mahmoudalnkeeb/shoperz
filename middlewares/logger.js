const { format, createLogger, transports } = require('winston');
const { combine, timestamp, label, prettyPrint, colorize } = format;
require('winston-daily-rotate-file');

const fileRotateTransport = new transports.DailyRotateFile({
  filename: 'logs/rotate-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});

const logger = createLogger({
  level: 'debug',
  format: combine(
    label({ label: 'custom logger' }),
    timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    prettyPrint(),
    colorize()
  ),
  transports: [
    fileRotateTransport,
    new transports.File({
      level: 'error',
      filename: 'logs/error.log',
    }),
    new transports.Console(),
  ],
});

module.exports = logger;
