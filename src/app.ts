import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import AppError from "./utils/appError";
import globalErrorHandler from "./utils/globalErrorHandle";
import userRouter from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";

import cors from "cors";
import cartRouter from "./routes/cartRouter";
import authRouter from "./routes/authRoutes";

// Enable All CORS Requests for simplicity in development

const app = express();

// GLOBAL MIDDLEWARE
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(ExpressMongoSanitize());
app.use(cookieParser());

if (process.env["NODE_ENV"] === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 2000,
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
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/auth", authRouter);

// ERROR ROUTES
app.all("*", (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
