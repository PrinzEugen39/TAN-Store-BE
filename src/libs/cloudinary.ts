import { v2 as cloudinary } from "cloudinary";
import { logger } from "../logger/winstonLogger";

export default new (class CloudinaryConfig {
  upload() {
    cloudinary.config({
      cloud_name: process.env["CLOUDINARY_NAME"],
      api_key: process.env["CLOUDINARY_KEY"],
      api_secret: process.env["CLOUDINARY_SECRET"],
    });
  }

  async destination(image: any) {
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        "src/libs/uploads/" + image
      );
      return cloudinaryResponse.secure_url;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
})();
