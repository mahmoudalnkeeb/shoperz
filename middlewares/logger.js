const { format, createLogger, transports } = require('winston');
const { combine, timestamp, label, prettyPrint, colorize } = format;
require('winston-daily-rotate-file');

let logger;

if (process.env.NODE_ENV == 'development') {
  const fileRotateTransport = new transports.DailyRotateFile({
    filename: 'logs/rotate-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
  });
  logger = createLogger({
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
} else {
  logger = createLogger({
    level: 'debug',
    format: combine(
      label({ label: 'custom logger' }),
      timestamp({
        format: 'MMM-DD-YYYY HH:mm:ss',
      }),
      prettyPrint(),
      colorize()
    ),
    transports: [new transports.Console()],
  });
}

module.exports = logger;
