import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/productController";
import UploadFile from "../middlewares/multer";
import { AuthCheck, restrictTo } from "../controllers/authController";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(getAllProducts)
  .post(AuthCheck, restrictTo("admin"), UploadFile("image"), createProduct);

productRouter.use(AuthCheck, restrictTo("admin"));
productRouter
  .route("/:id")
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

export default productRouter;
