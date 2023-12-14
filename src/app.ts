import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import AppError from "./utils/appError";
import globalErrorHandler from "./utils/globalErrorHandle";
import userRouter from "./routes/userRoutes";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { logger } from "./logger/winstonLogger";

const app = express();

// GLOBAL MIDDLEWARE
app.use(helmet());

app.use(ExpressMongoSanitize());

if (process.env["NODE_ENV"] === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use(
  express.json({
    limit: "10kb",
  })
);

// ROUTES
app.use("/api/v1/users", userRouter);

// ERROR ROUTES
app.all("*", (req: Request, _res: Response, next: NextFunction) => {
  logger.error("Can't find this requested route: " + req.originalUrl);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
