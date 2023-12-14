import mongoose from "mongoose";

interface IProduct {
  name: string;
  price: number;
  description: string;
  image: string[];
  qty: number;
  createdAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
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
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
