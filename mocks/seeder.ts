import mongoose from "mongoose";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import Product from "../src/models/productModel";
import User from "../src/models/userModel";
import moment from "moment-timezone";

dotenv.config({ path: "./.env" });

const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection to DB successful");
  })
  .catch((err) => {
    console.log(err);
  });

const product = JSON.parse(readFileSync("./mocks/product.json", "utf-8"));
const user = JSON.parse(readFileSync("./mocks/user.json", "utf-8"));

const importData = async () => {
  try {
    // await Product.create(product);
    await User.create(
      { ...user, passwordChangedAt: moment().tz("UTC").toDate() },
      { validateBeforeSave: false }
    );
    console.log("Data imported successfully");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    // await Product.deleteMany();
    await User.deleteMany();
    console.log("Data successfully deleted");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

// ts-node mocks/seeder.ts --delete
// ts-node mocks/seeder.ts --import
