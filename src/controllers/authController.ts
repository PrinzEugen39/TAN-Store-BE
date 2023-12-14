import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import moment from "moment-timezone";
import catchAsync from "../utils/catchAsync";
import { config } from "dotenv";
import User from "../models/userModel";

config();

// interface INewUser {
//   name: string;
//   email: string;
//   password: string;
//   passwordConfirm: string;
//   passwordChangedAt: Date;
//   role: string;
// }

interface CookieOptions {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
}

const signToken = (id: string) =>
  jwt.sign({ id: id }, process.env["JWT_SECRET"]!, {
    expiresIn: process.env["JWT_EXPIRE"],
  });

const createSendToken = (user: any, statusCode: number, res: Response) => {
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

export const signup = catchAsync(async (req: Request, res: Response, _next) => {
  const passwordChangedAt = req.body.passwordChangedAt
    ? moment(req.body.passwordChangedAt).tz("UTC").toDate()
    : moment().tz("UTC").toDate();

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: passwordChangedAt,
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
});
