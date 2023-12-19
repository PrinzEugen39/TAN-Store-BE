import express from "express";
import {
  createUser,
  getAllUsers,
  deleteUser,
  getUser,
} from "../controllers/userController";
import {
  AuthCheck,
  login,
  restrictTo,
  signup,
} from "../controllers/authController";

const userRouter = express.Router();

userRouter.route("/login").post(login);
userRouter.route("/signup").post(signup);

userRouter.use(AuthCheck, restrictTo("admin"));

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).delete(deleteUser);

export default userRouter;
