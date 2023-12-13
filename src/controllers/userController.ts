import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import APIFeatures from "../utils/APIFeatures";
import AppError from "../utils/appError";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error,
    });
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("QQQQQ");
    const newUser = await User.create({
      role: req.body.role,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(201).json({
      status: "success",
      data: {
        tour: newUser,
      },
    });
  } catch (err) {
    console.log("QQQ");
    next();
  }
};

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params["id"]);

    if (!user) {
      return next(
        new AppError(`No tour found with ID ${req.params["id"]}`, 404)
      );
    }

    res.status(204).json({
      status: "delete success",
      data: null,
    });
  }
);
