import express from "express";
import { protect } from "../utils/protect.js";

import {
  login,
  register,
  updateUserProfile,
  getUserProfile,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/login").post(login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.route("/logout").post(logoutUser);
router.route("/register").post(register);
router
  .route("/profile")
  .put(protect, updateUserProfile)
  .get(protect, getUserProfile);

export default router;
