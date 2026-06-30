const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const { registerValidation, loginValidation } = require("../middleware/validationMiddleware");

const { ipRateLimiter, accountLockoutLimiter } = require("../middleware/loginRateLimiter");

router.post(
  "/register",
  registerValidation,
  authController.register
);

router.post(
  "/login",
  ipRateLimiter,
  accountLockoutLimiter,
  loginValidation,
  authController.login
);

router.post(
  "/forgot-password",
  authController.forgotPassword
);

router.post(
  "/pin-login",
  authController.pinLogin
);

module.exports = router;