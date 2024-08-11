const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
} = require("../controller/userController");
const validateJwtToken = require("../middleware/validateTokenHandler");

const router = express.Router();

// user routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateJwtToken, currentUser);

module.exports = router;
