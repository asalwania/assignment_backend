const express = require("express");
const { validateToken } = require("../middlewares/auth.middleware");

const User = require("../models/user");
const {
  addUser,
  getUsers,
  login,
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getAllProductById,
} = require("../services/user.services");

const router = express.Router();

// **routes**
router.post("/login", login);
router.post("/", validateToken, addUser);
router.get("/", validateToken, getUsers);

router.post("/add-product", validateToken, createProduct);
router.get("/products", validateToken, getAllProducts);
router.get("/products/:userId", validateToken, getAllProductById);
router.put("/product", validateToken, updateProduct);
router.delete("/product", validateToken, deleteProduct);

module.exports = router;
