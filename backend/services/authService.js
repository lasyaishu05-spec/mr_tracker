const prisma = require("../prismaClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* Register User */
const registerUser = async (data) => {

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword =
    await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || "MR"
    }
  });
};

/* Login User */
const loginUser = async (email, password) => {

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw new Error("Invalid Email or Password");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid Email or Password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("No user found with this email");
  }
  
  // Generate a random temporary password
  const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!";
  const hashedPassword = await bcrypt.hash(tempPassword, 10);
  
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });
  
  return tempPassword;
};

const pinLogin = async (email, pin) => {
  const masterPin = process.env.MASTER_PIN || "123456";
  if (pin !== masterPin) {
    throw new Error("Invalid PIN");
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("No user found with this email");
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  pinLogin
};