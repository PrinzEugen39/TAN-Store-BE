import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Cart from "../models/cartModel";
import AppError from "../utils/appError";

export const getUserCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.find({ user: req.user?._id });

    res.status(200).json({
      status: "success",
      data: {
        cart,
      },
    });
  }
);

export const setProductAndUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  req.body.user = req.user?._id;
  next();
};

export const addProductToCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.create({
      ...req.body,
      totalPrice: req.body.totalPrice,
      unitPrice: req.body.unitPrice,
    });
    res.status(201).json({
      status: "success",
      data: {
        cart,
      },
    });
  }
);

export const updateCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!cart) {
      return next(new AppError("No cart found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        cart,
      },
    });
  }
);

export const deleteCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) {
      return next(new AppError("No cart found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
