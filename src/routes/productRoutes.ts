import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/productController";
import UploadFile from "../middlewares/multer";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(getAllProducts)
  .post(UploadFile("image"), createProduct);
productRouter
  .route("/:id")
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

export default productRouter;
