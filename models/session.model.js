const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    loggedInAt: Date,
    loggedOutAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("session", sessionSchema);
