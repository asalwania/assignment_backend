const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
      required: [true, "Name required"],
    },
    price: {
      type: Number,
      required: [true, "Price required"],
    },

    quantity: {
      type: Number,
      default: 1,
    },

    imageUrl: {
      type: String,
    },

    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
