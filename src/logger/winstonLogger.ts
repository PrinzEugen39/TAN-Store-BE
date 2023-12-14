import winston from "winston";
import moment from "moment-timezone";
import DailyRotateFile from "winston-daily-rotate-file";

const timestampFormat = () =>
  moment.tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: timestampFormat }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: "info",
  format: customFormat,
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "logs/%DATE%-combined.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "5m",
      maxFiles: "14d",
    }),
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: "logs/exceptions-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "5m",
      maxFiles: "14d",
    }),
    new winston.transports.Console({ format: customFormat }), // Log exceptions to console with timestamp
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: "logs/rejections-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "5m",
      maxFiles: "14d",
    }),
    new winston.transports.Console({ format: customFormat }), // Log rejections to console with timestamp
  ],
});
