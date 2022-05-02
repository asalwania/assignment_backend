const express = require("express");
const multer = require("multer");
const { validateToken } = require("../middlewares/auth.middleware");

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// **routes**
router.post("/login", login);
router.post("/", validateToken, addUser);
router.get("/", validateToken, getUsers);

router.post(
  "/add-product",
  validateToken,
  upload.single("productImg"),
  createProduct
);
router.get("/products", validateToken, getAllProducts);
router.get("/products/:userId", validateToken, getAllProductById);
router.put("/product", validateToken, updateProduct);
router.delete("/product", validateToken, deleteProduct);

module.exports = router;
