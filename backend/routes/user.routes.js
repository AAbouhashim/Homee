import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, followUnfollowUser } from "../controllers/user.controller.js";


const router = express.Router();

router.get("/profile/:username", protectRoute,getUserProfile)
router.get("/suggestUsers", protectRoute, getUserProfile)
router.post("/follow/:id", protectRoute, followUnfollowUser)
// router.get("/update", protectRoute, updateUserProfile)


export default router;