const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const Users = require("../users/users-model");
const { isValid } = require("../users/users-service");
const { jwtSecret } = require("./secrets");

router.post("/register", (req, res) => {
  const credentials = req.body;
  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;

    Users.add(credentials)
      .then((user) => {
        res.status(200).json({ data: user });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(500).json({ message: "Please provide username and password" });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = makeToken(user);
          res.status(200).json({ message: "Welcome to this API", token });
        } else {
          res.status(401).json({ message: "invalid credentials" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({ message: "please provide username and password" });
  }
});

function makeToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role,
  };
  const options = {
    expiresIn: "60 seconds",
  };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
