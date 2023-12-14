import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/productController";

const productRouter = express.Router();

productRouter.route("/").get(getAllProducts).post(createProduct);
productRouter.route("/:id").patch(updateProduct).delete(deleteProduct);

export default productRouter;
