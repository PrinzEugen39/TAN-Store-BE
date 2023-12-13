import { Request, Response, NextFunction } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

// const catchAsync =
//   (fn: any) => (req: Request, res: Response, next: NextFunction) => {
//     fn(req, res, next).catch(next);
//   };

const catchAsync =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error) => {
      console.log("Error caught in catchAsync:", err);
      next(err);
    });
  };

export default catchAsync;
