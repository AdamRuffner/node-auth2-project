const router = require("express").Router();

const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware.js");

function roleChecker(role) {
  return function (req, res, next) {
    if (req.decodedJwt.role === role) {
      next();
    } else {
      res.status(401).json({ message: "You do not have acess" });
    }
  };
}

router.get("/", restricted, roleChecker(1), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.send(err));
});

module.exports = router;