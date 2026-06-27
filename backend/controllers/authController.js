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

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

/* Login */
exports.login = async (req,res) => {

  try {

    const { email, password } = req.body;

    const result =
      await authService.loginUser(
        email,
        password
      );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user
    });

  } catch(error){

    res.status(400).json({
      success: false,
      message: error.message
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
    res.status(200).json({
      success: true,
      message: `Password reset successfully. Your temporary password is: ${tempPassword}. Please login and change it immediately.`
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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
    res.status(400).json({ success: false, message: error.message });
  }
};