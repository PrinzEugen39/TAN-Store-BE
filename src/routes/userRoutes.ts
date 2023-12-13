import express from "express";
import {
  createUser,
  getAllUsers,
  deleteUser,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").delete(deleteUser);

export default userRouter;
