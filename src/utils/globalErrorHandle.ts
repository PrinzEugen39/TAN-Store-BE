import { NextFunction, Request, Response } from "express";

interface CustomError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  // stack?: any;
}

const sendErrorDev = (err: CustomError, res: Response) => {
  res.status(err.statusCode).json({
    name: "error development",
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: CustomError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error prod 😭", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const globalErrorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env["NODE_ENV"] === "development") {
    sendErrorDev(err, res);
  } else if (process.env["NODE_ENV"] === "production") {
    sendErrorProd(err, res);
  }
};
// const globalErrorHandler = (
//   err: any,
//   req: Request,
//   res: Response,
//   _next: NextFunction
// ) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//     stack: err.stack,
//   });
// };

export default globalErrorHandler;
