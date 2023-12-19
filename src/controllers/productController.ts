import { NextFunction, Request, Response } from "express";
import Product from "../models/productModel";
import catchAsync from "../utils/catchAsync";
import APIFeatures from "../utils/APIFeatures";
import AppError from "../utils/appError";
import moment from "moment-timezone";
import cloudinaryConfig from "../libs/cloudinary";
import fs from "fs";
import { logger } from "../logger/winstonLogger";

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

export const getProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(
        new AppError(`No product found with ID ${req.params.id}`, 404)
      );
    }

    return res.status(200).json({
      status: "success",
      data: {
        product: product,
      },
    });
  }
);

export const createProduct = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    cloudinaryConfig.upload();
    const result: any = await cloudinaryConfig.destination(req);

    const newProduct = await Product.create({
      ...req.body,
      image: result,
      createdAt: moment().tz("UTC").toDate(),
      updatedAt: moment().tz("UTC").toDate(),
    });

    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (Array.isArray(req.files) && req.files[i]) {
          fs.unlink(
            `${(req.files[i] as Express.Multer.File).destination}/${
              (req.files[i] as Express.Multer.File).filename
            }`,
            (err) => {
              if (err) {
                logger.error("Error deleting file:", err);
              } else {
                logger.info("File deleted successfully");
              }
            }
          );
        }
      }
    }

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
