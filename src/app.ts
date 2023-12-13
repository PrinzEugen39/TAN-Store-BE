import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import AppError from "./utils/appError";
import globalErrorHandler from "./utils/globalErrorHandle";
import userRouter from "./routes/userRoutes";
import ExpressMongoSanitize from "express-mongo-sanitize";

const app = express();

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
  console.log("Q ERROr");
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  console.log("AW ERROR");
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.log(err.statusCode);
  console.log(err.status);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
// app.use(globalErrorHandler);

export default app;
