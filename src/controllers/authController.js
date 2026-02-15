import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import generateToken from "../utils/generateToken.js";

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  //   check if user exists
  const userExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  //   Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //   Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  //   Generate JWT Token
  const token = generateToken(user.id, res);
  try {
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid email / password" });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid user / password" });
  }

  //   Generate JWT Token
  const token = generateToken(user.id, res);

  res.status(201).json({
    status: "success",
    message: "User signed in successfully",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
    token,
  });
};

const signout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(201).json({ message: "User signed out successfully" });
};

export { signup, signin, signout };
