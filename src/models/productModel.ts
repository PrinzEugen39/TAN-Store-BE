import moment from "moment-timezone";
import mongoose, { Query } from "mongoose";

interface IProduct {
  name: string;
  price: number;
  description: string;
  image: string[];
  qty: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductDoc extends IProduct, mongoose.Document {}

const productSchema: mongoose.Schema = new mongoose.Schema(
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
    createdAt: Date,
    updatedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Product = mongoose.model<IProductDoc>("Product", productSchema);

productSchema.pre(
  "findOneAndUpdate",
  function (this: Query<IProductDoc, IProductDoc>, next: any) {
    this.set({ updatedAt: moment().tz("UTC").toDate() });
    next();
  }
);

export default Product;
