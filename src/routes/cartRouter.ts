import express from "express";
import { AuthCheck, restrictTo } from "../controllers/authController";
import {
  addProductToCart,
  deleteCart,
  getUserCart,
  setProductAndUserId,
  updateCart,
} from "../controllers/cartController";

const cartRouter = express.Router({ mergeParams: true });

cartRouter.use(AuthCheck);

cartRouter
  .route("/")
  .get(getUserCart)
  .post(restrictTo("user"), setProductAndUserId, addProductToCart);

cartRouter
  .route("/:id")
  .patch(restrictTo("user"), updateCart)
  .delete(restrictTo("user"), deleteCart);

export default cartRouter;
