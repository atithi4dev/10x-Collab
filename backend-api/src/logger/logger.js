import {createLogger, format, transports} from "winston";
const {combine, timestamp, json, colorize} = format;

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message}`;
  })
);

const fileLogFormat = combine(
  timestamp(),
  json()
);

// Create a Winston logger
const logger = createLogger({
  level: "info",
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({
      filename: "logs/app.log",
      format: fileLogFormat,
    }),
  ],
});

 
export default logger;