import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import APIFeatures from "../utils/APIFeatures";
import AppError from "../utils/appError";

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const features = new APIFeatures(User, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  return res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError(`No user found with ID ${req.params.id}`, 404));
    }

    return res.status(200).json({
      status: "success",
      data: {
        user: user,
      },
    });
  }
);

export const createUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  }
);

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params["id"]);

    if (!user) {
      return next(
        new AppError(`No user found with ID ${req.params["id"]}`, 404)
      );
    }

    res.status(204).json({
      status: "delete success",
      data: null,
    });
  }
);
