import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;  // Attach user ID to the request
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};