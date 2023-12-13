import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app";
import winston from "winston";
import moment from "moment-timezone";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => moment.tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "combined.log" }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "exceptions.log" }),
  ],
});

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...", { error: err });
  process.exit(1);
});

const DB = process.env["DATABASE"]!.replace(
  "<PASSWORD>",
  process.env["DATABASE_PASSWORD"]!
);

async function Mongoose() {
  await mongoose.connect(DB).then(() => {
    logger.info("Connection to Atlas successful");
  });
}

Mongoose().catch((err) => {
  logger.error("Mongoose connection error", { error: err });
});

const port = process.env["PORT"] || 3000;

const server = app.listen(port, () => {
  logger.info(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err: any) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...", { error: err });
  server.close(() => {
    process.exit(1);
  });
});
