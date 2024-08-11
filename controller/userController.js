const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { constants } = require("../constants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

function UserController(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({
      message: "No Authorization Header",
    });
  }
  try {
    const token = authorization.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Invalid Token Format",
      });
    }
    const decode = jwt.verify(token, SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Session Expired",
        error: error.message,
      });
    }
    if (error instanceof jwt.JsonWebTokenError || error instanceof TokenError) {
      return res.status(401).json({
        message: "Invalid Token",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "Internal server Error",
      error: error.message,
      stack: error.stack,
    });
  }
}

module.exports = UserController;

//@desc Register User
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All Fields are mandatory");
  }
  const userFound = await User.findOne({ email });

  if (userFound) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("Email Already taken.");
  }
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  User.create({
    username,
    email,
    password: hashedPassword,
  })
    .then((data) => {
      return res
        .status(200)
        .json({ status: true, data, message: "Registration Done." });
    })
    .catch((error) => {
      res.status(constants.SERVER_ERROR);
      throw new Error("User registration failed.");
    });
});

//@desc Login User
//@route POST /api/users/login
//@access public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All Fields are mandatory");
  }
  const user = User.findOne({ email }).then((userData) => {
    bcrypt.compare(password, userData.password).then((passwordCheck) => {
      if (user && passwordCheck) {
        const accessToken = jwt.sign(
          {
            user: {
              id: userData.id,
              username: userData.username,
              email: userData.email,
            },
          },
          process.env.SECRET_KEY,
          { expiresIn: "3600m" }
        );
        if (accessToken) {
          return res.status(200).json({
            status: true,
            message: "Login Done.",
            token: accessToken,
          });
        } else {
          return res.status(200).json({
            status: false,
            message: "Login failed.",
          });
        }
      } else {
        return res
          .status(200)
          .json({ status: false, message: "Login Failed." });
      }
    });
  });
});

//@desc Current User Information
//@route GET /api/users/current
//@access private

const currentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Current User Information.",
    data: req.user,
  });
});

module.exports = { registerUser, loginUser, currentUser };
