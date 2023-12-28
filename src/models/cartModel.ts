import mongoose, { Document, PopulatedDoc, Types } from "mongoose";
import { IUser } from "./userModel";
import { IProduct } from "./productModel";

interface ICart {
  user: Types.ObjectId | PopulatedDoc<Document & IUser>;
  product: Types.ObjectId | PopulatedDoc<Document & IProduct>;
  qty: number;
  totalPrice?: number;
}

interface ICartDoc extends ICart, Document {}

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Cart must belong to a user!"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Cart must have at least one product!"],
    },
    qty: {
      type: Number,
      default: 1,
    },
    totalPrice: Number,
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

cartSchema.index({ user: 1, product: 1 }, { unique: true });

// cartSchema.pre<ICartDoc>(/^find/, function (next) {
//   this.populate({
//     path: "user",
//     select: "name",
//   });
//   next();
// });

cartSchema.pre<ICartDoc>(/^find/, function (next) {
  this.populate({
    path: "product",
    select: "name description image",
  });
  next();
});

const Cart = mongoose.model<ICartDoc>("Cart", cartSchema);

export default Cart;
