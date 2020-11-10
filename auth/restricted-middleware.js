const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./secrets");

module.exports = (req, res, next) => {
  // add code here to verify users are logged in
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "We need a token" });
    return;
  }
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "bad token" });
      return;
    }
    console.log("decoded token -->", decoded);
    req.decodedJwt = decoded;
    next();
  });
};