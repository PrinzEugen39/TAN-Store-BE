import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

export interface IUser {
  role: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
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
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 8,
  },
  avatar: {
    type: String,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
