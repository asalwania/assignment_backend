const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name required"],
    },
    email: {
      type: String,
      required: [true, "Email required"],
      unique: true,
      dropDups: true
    },
    saltSecret: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: [true, "Password required"],
    },
    phone: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = function (password) {
  this.saltSecret = crypto.randomBytes(16).toString("hex");
  this.password = crypto
    .pbkdf2Sync(password, this.saltSecret, 1000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.validPassword = function (inputPassword) {
  var inputPassword = crypto
    .pbkdf2Sync(inputPassword, this.saltSecret, 1000, 64, "sha512")
    .toString("hex");
  return this.password === inputPassword;
};
userSchema.methods.generateJwt = function () {
return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      role: this.role,
    },
    "secret",
    {
      expiresIn: "24h",
    }
  );

};

module.exports = mongoose.model("user", userSchema);
