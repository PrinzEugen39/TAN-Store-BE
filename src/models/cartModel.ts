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
      unique: true,
    },
    qty: {
      type: Number,
      default: 1,
    },
    unitPrice: Number,
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

cartSchema.pre<ICartDoc>(/^find/, function (next) {
  this.populate({
    path: "product",
    select: "name description image",
  });
  next();
});

cartSchema.statics.calcTotalPrice = async function (cartID) {
  const total = await this.aggregate([
    {
      $match: { _id: cartID },
    },
    {
      $group: {
        _id: "$_id",
        nQty: { $sum: "$qty" },
        nUnitPrice: { $sum: "$unitPrice" },
        calcTotalPrice: { $sum: { $multiply: ["$qty", "$unitPrice"] } },
      },
    },
  ]);
  console.log("init toal", total);

  if (total[0].calcTotalPrice) {
    await Cart.findByIdAndUpdate(cartID, {
      totalPrice: total[0].calcTotalPrice,
    });
  }
};

cartSchema.post<any>("save", async function () {
  this.constructor.calcTotalPrice(this._id);
});

// cartSchema.pre<any>("findOneAndUpdate", async function (next) {
//   this.t = await this.clone().findOne();
//   next();
// });

// cartSchema.post<any>("findOneAndUpdate", async function () {
//   await this.t.constructor.calcTotalPrice(this.t._id);
// });

cartSchema.post<any>(/^findOneAnd/, async function (updateCart) {
  console.log("😁", updateCart);

  // await this.model.calcTotalPrice(updateCart);
});

const Cart = mongoose.model<ICartDoc>("Cart", cartSchema);

export default Cart;
