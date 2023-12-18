import { NextFunction, Request, Response } from "express";
import multer from "multer";

const UploadFile = (fieldName: string) => {
  const storage = multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, "src/libs/uploads");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.fieldname}.png`);
    },
  });

  const filter = (req: Request, file: any, cb: any) => {
    // To accept only certain file types, you can add a file filter
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."), false);
    }
  };

  const uploadFile = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 10,
    },
    fileFilter: filter,
  });

  return (req: Request, res: Response, next: NextFunction) => {
    uploadFile.single(fieldName)(req, res, function (err: any) {
      if (err) {
        return res.status(400).json({ Error: `${err}` });
      }
      if (req.file) {
        res.locals.filename = req.file.filename;
      }
      next();
    });
  };
};

export default UploadFile;
