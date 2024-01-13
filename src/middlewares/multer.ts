import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import Product from "../models/productModel";
import AppError from "../utils/appError";

const UploadFile = (fieldName: string) => {
  const storage = multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb) => {
      cb(null, "src/libs/uploads");
    },
    filename: (_req: Request, file: Express.Multer.File, cb) => {
      cb(null, `${Date.now()}-${file.fieldname}.png`);
    },
  });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      return cb(new AppError("Only .png, .jpg and .jpeg format allowed!", 400));
    }
    Product.findOne({ name: req.body.name }).then((user) => {
      if (user) {
        cb(null, false);
        return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      }
    });
  };

  const uploadFile = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    uploadFile.array(fieldName, 4)(req, res, function (err: any) {
      if (err) {
        return res
          .status(400)
          .json({ Error: `${err}`, Detail: "Maximum of 4 images are allowed" });
      }
      next();
    });
  };
};

export default UploadFile;
