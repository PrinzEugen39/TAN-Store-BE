import express from "express";
import {
  createUser,
  getAllUsers,
  deleteUser,
  getUser,
  getMe,
  getAuth,
} from "../controllers/userController";
import {
  AuthCheck,
  login,
  logout,
  restrictTo,
  signup,
} from "../controllers/authController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.post("/login", login);
userRouter.post("/signup", signup);

userRouter.use(AuthCheck);

userRouter.get("/isauth", getAuth);
userRouter.get("/me", getMe, getUser);
userRouter.patch("/updateMe", getMe);

userRouter.use(restrictTo("admin"));

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).delete(deleteUser);

export default userRouter;
