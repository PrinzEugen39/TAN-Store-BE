import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import moment from "moment-timezone";
import catchAsync from "../utils/catchAsync";
import { config } from "dotenv";
import User from "../models/userModel";
import AppError from "../utils/appError";
import { promisify } from "util";

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

// const signToken = (id: string) =>
//   jwt.sign({ id: id }, process.env["JWT_SECRET"]!, {
//     expiresIn: process.env["JWT_EXPIRE"],
//   });

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = jwt.sign({ id: user._id }, process.env["JWT_SECRET"]!, {
    expiresIn: process.env["JWT_EXPIRE"],
  });

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
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: moment().tz("UTC").toDate(),
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({
    email: email,
  });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  createSendToken(user, 200, res);
});

export const AuthCheck = catchAsync(async (req, res, next) => {
  // 1) getting token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
  // 2) verification token
  const decoded: any = await promisify(jwt.verify)(
    token,
    process.env["JWT_SECRET"]!
  );
  // console.log(decoded);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }

  // 3) Check if user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again", 401)
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});
