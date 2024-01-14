import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";
import { logger } from "./logger/winstonLogger";

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
  process.exit(1);
});

const port = process.env["PORT"] || 3000;

const server = app.listen(port, () => {
  logger.info(`App running on port ${port}...`);
  if (process.env.NODE_ENV === "production") {
    logger.info("Production mode");
  }
});

process.on("unhandledRejection", (err: any) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...", { error: err });
  server.close(() => {
    process.exit(1);
  });
});
