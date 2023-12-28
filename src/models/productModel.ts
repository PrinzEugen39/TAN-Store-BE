import moment from "moment-timezone";
import mongoose, { Query } from "mongoose";
import AppError from "../utils/appError";

export interface IProduct {
  name: string;
  price: number;
  description: string;
  image: string[];
  qty: number;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
}

export interface IProductDoc extends IProduct, mongoose.Document {}

const productSchema: mongoose.Schema<IProductDoc> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      validate: [
        {
          validator: (value: string) => /^[a-zA-Z0-9\s]+$/.test(value),
          message: "Name only allowed letters, numbers, and spaces",
        },
      ],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [1000, "Price can not be less than Rp. 1000"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    image: {
      type: [String],
      required: [true, "Please add an image"],
    },
    qty: {
      type: Number,
      default: 1,
    },
    slug: String,
    createdAt: Date,
    updatedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre("save", async function (this: IProductDoc, next) {
  try {
    const existingProduct = await Product.findOne({ name: this.name });
    if (existingProduct) {
      return next(new AppError("Product already exists", 400));
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

productSchema.pre(
  "findOneAndUpdate",
  function (this: Query<IProductDoc, IProductDoc>, next) {
    this.set({ updatedAt: moment().tz("UTC").toDate() });
    next();
  }
);

const Product = mongoose.model<IProductDoc>("Product", productSchema);

export default Product;
