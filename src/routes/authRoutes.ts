import express from "express";
import { verifyEmail } from "../controllers/authController";

const authRouter = express.Router();

authRouter.get("/:id/verify/:token", verifyEmail);

export default authRouter;
