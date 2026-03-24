import User from "../models/userModel.js";
import crypto from "crypto";
import { Resend } from "resend";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Authenticates user credentials and issues a JWT via specialized utility.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password field as it is typically excluded from base queries
    const user = await User.findOne({ email }).select("+password");

    // matchPassword handles bcrypt comparison internally on the model instance
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      // Avoid specifying whether email or password was the point of failure (Security best practice)
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(`[Auth Error] login: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Registers a new user and initializes their profile state.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Manual validation for password length; schema-level validation is also recommended
    if (password && password.length < 8) {
      res.status(400);
      throw new Error("Password must be at least 8 characters");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      generateToken(res, user._id);
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Invalidates the client-side JWT by clearing the associated cookie.
 */
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

/**
 * Retrieves profile data and handles "First-time login" state transitions.
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const wasNew = user.isNewUser;

    /**
     * Update isNewUser flag in the background.
     * We return the 'wasNew' value to the frontend to trigger onboarding/toasts.
     */
    if (wasNew) {
      user.isNewUser = false;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isNewUser: wasNew,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * Updates user metadata and fitness metrics.
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Basic account identity update
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Conditional update for fitness metrics to avoid overwriting with null/undefined
    if (req.body.weight !== undefined) user.weight = req.body.weight;
    if (req.body.height !== undefined) user.height = req.body.height;
    if (req.body.goal !== undefined) user.goal = req.body.goal;
    if (req.body.targets !== undefined) user.targets = req.body.targets;

    // Onboarding completion flag
    user.isNewUser = false;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      weight: updatedUser.weight,
      height: updatedUser.height,
      targets: updatedUser.targets,
      bmi: updatedUser.bmi, // Calculated via virtual/middleware in model
      goal: updatedUser.goal,
      isNewUser: updatedUser.isNewUser,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * Implements secure password reset flow.
 * Note: Uses a generic response to prevent User Enumeration attacks.
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const genericResponse = {
    message: "If that email exists, we’ve sent a password reset link.",
  };

  if (!email) return res.status(200).json(genericResponse);

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  // Do not disclose account existence; return success even if user not found
  if (!user) return res.status(200).json(genericResponse);

  /**
   * Tokenization:
   * Store a hashed version of the token in the DB to protect against DB leaks.
   * Send the raw (unhashed) token to the user via email.
   */
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetPasswordToken = tokenHash;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1-hour TTL
  await user.save({ validateBeforeSave: false });

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Sesh <onboarding@resend.dev>",
    to: user.email,
    subject: "Reset your Sesh password",
    html: `
    <p>Hi${user.name ? ` ${user.name}` : ""},</p>
    <p>You asked to reset your password. Click the link below to choose a new one:</p>
    <p><a href="${resetUrl}">Reset your password</a></p>
    <p>This link expires in 1 hour. If you didn’t request this, you can ignore this email.</p>
  `,
  });

  res.status(200).json(genericResponse);
});

/**
 * Validates reset token and updates the user's password.
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  // Hash the incoming token to compare against stored hash
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() }, // Check TTL
  });

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or expired." });
  }

  // Assign new password; model middleware handles rehashing before save
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password updated successfully." });
});

export {
  register,
  login,
  updateUserProfile,
  getUserProfile,
  forgotPassword,
  resetPassword,
  logoutUser,
};
