import express from "express";
import { AuthCheck, restrictTo } from "../controllers/authController";
import {
  addProductToCart,
  getUserCart,
  setProductAndUserId,
} from "../controllers/cartController";

const cartRouter = express.Router({ mergeParams: true });

cartRouter.use(AuthCheck);

cartRouter
  .route("/")
  .get(getUserCart)
  .post(restrictTo("user"), setProductAndUserId, addProductToCart);

export default cartRouter;
