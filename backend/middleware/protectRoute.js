import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    // Retrieve the JWT token from cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized access, no token provided" });
    }

    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) { // Ensure the decoded payload has the user ID
      return res.status(401).json({ error: "Invalid token" });
    }

    // Fetch the user based on the ID stored in the token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach the user to the request object for further use
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log("Error at protectRoute middleware:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};