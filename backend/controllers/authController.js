const authService =
require("../services/authService");

/* Register */
exports.register = async (req,res) => {

  try {

    const user =
      await authService.registerUser(
        req.body
      );

    const { password, ...safeUser } = user;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: safeUser
    });

  } catch(error){

    let message = error.message;
    if (message === "User already exists") {
      message = "Registration failed. Please check your inputs or try logging in.";
    }

    res.status(400).json({
      success: false,
      message: message
    });

  }

};

/* Login */
const emailService = require("../services/emailService");

exports.login = async (req,res) => {
  const { email, password } = req.body;
  const loginAttemptsCache = req.loginAttemptsCache;
  let attemptsData = { count: 0, lockedUntil: null };

  if (loginAttemptsCache) {
    attemptsData = loginAttemptsCache.get(email) || { count: 0, lockedUntil: null };
  }

  try {
    const result = await authService.loginUser(email, password);

    // Login successful, reset attempts
    if (loginAttemptsCache) {
      loginAttemptsCache.del(email);
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user
    });

  } catch(error) {
    if (loginAttemptsCache) {
      attemptsData.count += 1;
      // Lock out after 5 consecutive failed attempts
      if (attemptsData.count >= 5) {
        attemptsData.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lock
        loginAttemptsCache.set(email, attemptsData);
        // Send email notification asynchronously
        emailService.sendLockoutEmail(email).catch(console.error);
      } else {
        loginAttemptsCache.set(email, attemptsData);
      }
    }
    
    // Always return a generic message so attackers don't know if email exists or if it's locked vs wrong pass
    res.status(401).json({
      success: false,
      message: "Incorrect email or password"
    });
  }
};

/* Forgot Password */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const tempPassword = await authService.forgotPassword(email);
    // Real implementation would email the temp password. Returning generic success message to prevent user enumeration.
    res.status(200).json({
      success: true,
      message: "If that email is registered, you'll receive a reset link"
    });
  } catch (error) {
    if (error.message === "No user found with this email") {
      return res.status(200).json({
        success: true,
        message: "If that email is registered, you'll receive a reset link"
      });
    }
    res.status(400).json({ success: false, message: "An error occurred during password reset" });
  }
};

/* PIN Login */
exports.pinLogin = async (req, res) => {
  try {
    const { email, pin } = req.body;
    if (!email || !pin) {
      return res.status(400).json({ success: false, message: "Email and PIN are required" });
    }
    const result = await authService.pinLogin(email, pin);
    res.status(200).json({
      success: true,
      message: "PIN Login successful",
      token: result.token,
      user: result.user
    });
  } catch (error) {
    let message = error.message;
    if (message === "No user found with this email" || message === "Invalid PIN") {
      message = "Incorrect email or password";
    }
    res.status(401).json({ success: false, message: message });
  }
};