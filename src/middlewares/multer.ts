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

  const uploadFile = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  });

  return (req: Request, res: Response, next: NextFunction) => {
    uploadFile.array(fieldName, 4)(req, res, function (err: any) {
      if (err) {
        return res.status(400).json({ Error: `${err}` });
      }
      next();
    });
  };
};

export default UploadFile;
