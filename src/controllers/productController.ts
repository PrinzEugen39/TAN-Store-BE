import { NextFunction, Request, Response } from "express";
import fs from "fs";
import moment from "moment-timezone";
import slugify from "slugify";
import cloudinaryConfig from "../libs/cloudinary";
import { logger } from "../logger/winstonLogger";
import Product, { IProduct } from "../models/productModel";
import APIFeatures from "../utils/APIFeatures";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

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

export const getProductbySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return next(
        new AppError(
          `No product found with slug name of ${req.params.slug}`,
          404
        )
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

export const duplicateCheck = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Masuk");
    console.log(req.body);
    const existingProduct = await Product.findOne({ name: req.body.name });
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Product with this name already exists" });
    }
    // if (existingProduct) {
    //   return next(new AppError("Duplicate FOund", 400));
    // }
  }
);

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingProduct = await Product.findOne({ name: req.body.name });
    if (existingProduct) {
      return next(
        new AppError(`Product with ${existingProduct.name} already exist`, 400)
      );
    }
    cloudinaryConfig.upload();
    const result: string[] = await cloudinaryConfig.destination(req);

    const newProduct = await Product.create({
      ...req.body,
      image: result,
      slug: slugify(req.body.name, { lower: true }),
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
    const product: IProduct | null = await Product.findByIdAndDelete(
      req.params.id
    ).lean();

    if (!product) {
      return next(
        new AppError(`No product found with ID ${req.params.id}`, 404)
      );
    }

    const imagesToDelete = product.image.map((image) => {
      const imageURL = image.split("/").pop()?.split(".")[0];
      return `TAN-Store/${imageURL}`;
    });

    if (imagesToDelete.length > 0) {
      await cloudinaryConfig.deleteImages(imagesToDelete);
    }

    res.status(204).json({
      status: "delete success",
      data: null,
    });
  }
);
