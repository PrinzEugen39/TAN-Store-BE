import { NextFunction, Request, Response } from "express";
import Product from "../models/productModel";
import catchAsync from "../utils/catchAsync";
import APIFeatures from "../utils/APIFeatures";
import AppError from "../utils/appError";
import moment from "moment-timezone";

export const getAllProducts = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const features = new APIFeatures(Product, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;

    return res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  }
);

export const createProduct = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const newProduct = await Product.create({
      ...req.body,
      createdAt: moment().tz("UTC").toDate(),
    });

    res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  }
);

export const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(
        new AppError(`No product found with ID ${req.params.id}`, 404)
      );
    }

    return res.status(200).json({
      status: "success",
      data: {
        data: product,
      },
    });
  }
);

export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(
        new AppError(`No product found with ID ${req.params.id}`, 404)
      );
    }

    res.status(204).json({
      status: "delete success",
      data: null,
    });
  }
);
