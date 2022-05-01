const jwt = require("jsonwebtoken");

exports.validateToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if(!token){throw new Error("provide token")}

    const decoded = jwt.verify(token, "secret", {
      expiresIn: "24h",
    });
    if (decoded) {
      req.userId = decoded._id;
      req.userName = decoded.name;
      req.role = decoded.role;
      next();
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    res.send("Error: ", error.message);
  }
};
