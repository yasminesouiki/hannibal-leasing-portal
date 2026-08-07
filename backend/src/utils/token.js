const jwt = require("jsonwebtoken");

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

module.exports = { signToken };
