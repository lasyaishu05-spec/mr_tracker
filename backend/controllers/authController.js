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