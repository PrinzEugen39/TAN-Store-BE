import express from "express";
import {
  createUser,
  getAllUsers,
  deleteUser,
  getUser,
  getMe,
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

userRouter.use(AuthCheck);

userRouter.get("/me", getMe, getUser);

userRouter.use(restrictTo("admin"));

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).delete(deleteUser);

export default userRouter;
