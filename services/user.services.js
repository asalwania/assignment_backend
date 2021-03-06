const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const Product = require("../models/product");
const Session = require("../models/session.model");

// **** Common Services ***
// ----------->
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOneAndUpdate(
      { email },

      {
        $set: {
          isActive: true,
        },
      }
    );
    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = foundUser.validPassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    const session = new Session({
      _id: new mongoose.Types.ObjectId(),
    });
    session.userId = foundUser._id;
    session.isActive = true;
    session.loggedInAt = new Date().toISOString();
    const savedSession = await session.save();
    const token = foundUser.generateJwt(savedSession._id);

    res.send({
      name: foundUser.name,
      role: foundUser.role,
      token,
      sessionId: savedSession._id,
      email: foundUser.email,
      isActive: foundUser.isActive,
    });
  } catch (error) {
    res.status(400).send({ Error: error.message });
  }
};

exports.logout = async (req, res) => {
  const sessionId = req.body.sessionId;
  const email = req.body.email;
  const isActive = false;
  const now = new Date().toISOString();
  try {
    const session = await Session.findOneAndUpdate(
      { _id: sessionId },
      {
        $set: {
          loggedOutAt: now,
          isActive: false,
        },
      },
      {
        returnOriginal: false,
      }
    );
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: { isActive: false },
      },
      {
        returnOriginal: false,
      }
    );
    res.send({ success: true, user, session });
  } catch (error) {
    res.send({ error: error.message });
  }
};

// **** Admin Services ***
//----------->
exports.addUser = async (req, res) => {
  const { name, email, password, address, phone } = req.body;
  try {
    if (req.role !== "admin") {
      throw new Error("Not authorized");
    }
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      throw new Error("User already Exists");
    }

    const userModel = await new User({
      _id: new mongoose.Types.ObjectId(),
    });
    userModel.name = name;
    userModel.email = email;
    userModel.address = address;
    userModel.phone = phone;
    userModel.setPassword(password);

    const result = await userModel.save();
    res.send(result);
  } catch (error) {
    res.status(400).send({ Error: error.message });
  }
};

exports.getAllProductById = async (req, res) => {
  const userId = req.params.userId;
  try {
    if (req.role !== "admin") {
      throw new Error("Not authorized");
    }
    const products = await Product.find({ userId });
    res.send(products);
  } catch (error) {
    res.send("Error: ", error.message);
  }
};

exports.getUsers = async (req, res) => {
  try {
    if (req.role !== "admin") {
      throw new Error("Not authorized");
    }
    const users = await User.find({ role: "user" });
    res.send(users);
  } catch (error) {
    res.send(error);
  }
};

// **** User Services ***
//----------->
exports.createProduct = async (req, res) => {
  const { name, price, description, quantity } = req.body;
  try {
    if (req.role !== "user") {
      throw new Error("Not authorized");
    }
    const productModel = await new Product({
      _id: new mongoose.Types.ObjectId(),
      userId: req.userId,
      sessionId: req.sessionId,
      name,
      price: Number(price),
      description,
      quantity: +quantity,
      imageUrl: req.file.originalname,
    });
    const result = await productModel.save();
    res.send({ result });
  } catch (error) {
    res.send({ Error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  const userId = req.userId;
  try {
    if (req.role !== "user") {
      throw new Error("Not authorized");
    }
    const products = await Product.find({ userId });
    res.send(products);
  } catch (error) {
    res.send("Error: ", error.message);
  }
};

exports.getProductsBySession = async (req, res) => {
  const sessionId = req.params.sessionId;
  try {
    const products = await Product.find({ sessionId });
    res.send({ products });
  } catch (error) {
    res.send({ error: error.message });
  }
};

exports.getAllSessions = async (req, res) => {
  const userId = req.params.userId;
  try {
    const sessions = await Session.find({ userId });
    res.send({ sessions });
  } catch (error) {
    res.send({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { productId, name, price, quantity, description } = req.body;
  try {
    if (req.role !== "user") {
      throw new Error("Not authorized");
    }
    const product = await Product.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        $set: {
          name: name,
          price: price,
          quantity: quantity,
          description: description,
        },
      }
    );
    res.send(product);
  } catch (error) {
    res.send({ errror: error.message });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    if (req.role !== "user") {
      throw new Error("Not authorized");
    }
    const id = req.body.productId;
    const removeItem = await Product.findByIdAndRemove({ _id: id });
    if (removeItem) {
      res.send("deleted successfully");
    } else {
      throw new Error("Product no found");
    }
  } catch (error) {
    res.send("Error: ", error.message);
  }
};
