import mongoose from "mongoose";

interface IReview {
  review: string;
  rating: number;
  createdAt: Date;
  product: mongoose.Types.ObjectId | string;
  user: mongoose.Types.ObjectId | string;
}

export interface IReviewDoc extends IReview, mongoose.Document {}

const reviewSchema: mongoose.Schema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a Product!"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user!"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Review = mongoose.model<IReviewDoc>("Review", reviewSchema);

export default Review;
