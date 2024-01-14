/* eslint-disable indent */
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import moment from "moment-timezone";
import catchAsync from "../utils/catchAsync";
import { config } from "dotenv";
import User from "../models/userModel";
import AppError from "../utils/appError";
import { promisify } from "util";
import { logger } from "../logger/winstonLogger";
import Email from "../utils/Email/email";
config();

interface IUser {
  _id?: string;
  name?: string;
  email: string;
  password: string | undefined;
  passwordChangedAt?: number | Date | undefined;
  role?: string;
}

type UserRole = "admin" | "user";

declare module "express" {
  export interface Request {
    user?: IUser;
  }
}

interface CookieOptions {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
}

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

  await new Email({ email: newUser.email, name: newUser.name }).signUpEmail();

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  createSendToken(user, 200, res);
});

export const logout = (req: Request, res: Response) => {
  console.log(req.cookies);
  res.clearCookie("jwt");
  res.status(200).json({ status: "success" });
};

export const AuthCheck = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) getting token and check if its there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access", 401)
      );
    }
    const verifyAsync = promisify<string, string>(jwt.verify);

    const decoded: any = await verifyAsync(token, process.env["JWT_SECRET"]!);
    logger.info(decoded);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist",
          401
        )
      );
    }
    // Grant access to protected route
    req.user = currentUser;
    next();
  }
);

export const restrictTo =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role as UserRole)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
