const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const { registerValidation, loginValidation } = require("../middleware/validationMiddleware");

router.post(
  "/register",
  registerValidation,
  authController.register
);

router.post(
  "/login",
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