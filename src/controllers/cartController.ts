import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Cart from "../models/cartModel";

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
    });
    res.status(201).json({
      status: "success",
      data: {
        cart,
      },
    });
  }
);
