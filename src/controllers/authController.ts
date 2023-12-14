import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import { config } from "dotenv";

config();

interface CookieOptions {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
}

const signToken = (id) =>
  jwt.sign({ id: id }, process.env["JWT_SECRET"]!, {
    expiresIn: process.env["JWT_EXPIRE"],
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env["JWT_COOKIE_EXPIRES_IN"]!) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  user.passwordChangedAt = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, _next) => {}
);
