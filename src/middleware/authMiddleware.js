import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
  console.log("Auth middleware called");
  let token;

  // Read token from request header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  // check if token is valid

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }
    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
