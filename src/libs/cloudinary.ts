import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";

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
})();
