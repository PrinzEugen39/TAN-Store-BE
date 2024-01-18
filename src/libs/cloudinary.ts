import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import { logger } from "../logger/winstonLogger";
import AppError from "../utils/appError";

export default new (class CloudinaryConfig {
  upload() {
    cloudinary.config({
      cloud_name: process.env["CLOUDINARY_NAME"],
      api_key: process.env["CLOUDINARY_KEY"],
      api_secret: process.env["CLOUDINARY_SECRET"],
    });
  }

  async destination(req: Request) {
    const uploadedFiles = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
          folder: "TAN-Store",
        });
        uploadedFiles.push(result.secure_url);
      }
    } else {
      throw new Error("No files uploaded");
    }
    return uploadedFiles;
  }

  async uploadUserPhoto(image: any) {
    try {
      const result = await cloudinary.uploader.upload(image, {
        resource_type: "auto",
        folder: "TAN-Store",
      });
      return result.secure_url;
    } catch (error: any) {
      console.log(error);
      throw new AppError(error.message, 400);
    }
  }

  async deleteImages(imageURL: string[]) {
    const result = await cloudinary.api.delete_resources(imageURL, {
      type: "upload",
      resource_type: "image",
    });

    logger.info(result);
    // if (imageURL.length > 0) {
    //   for (const url of imageURL) {
    //     await cloudinary.uploader.destroy(url);
    //   }
    // }
  }
})();
