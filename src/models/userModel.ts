/* eslint-disable no-unused-vars */
import mongoose, { Document } from "mongoose";
import validatorAlpha from "validator";
import bcrypt from "bcrypt";

export interface IUser {
  role: string;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
  avatar?: string;
  passwordChangedAt?: Date | number;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

export interface IUserDocument extends Document, IUser {
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUserDocument>({
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [16, "Name can not be more than 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validatorAlpha.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (this: IUser, val: string): boolean {
        return val === this.password;
      },
      message: "Passwords do not match",
    },
  },
  avatar: {
    type: String,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;
