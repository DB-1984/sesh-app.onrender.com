import express from "express";
import passport from "passport";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

// Start OAuth flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect:
      process.env.NODE_ENV === "production"
        ? "/users/login?oauth=failed"
        : "http://localhost:5173/users/login?oauth=failed",
  }),
  (req, res) => {
    // ... generateToken logic ...
    generateToken(res, req.user._id);

    // Dynamic redirect based on environment
    if (process.env.NODE_ENV === "production") {
      // In production, the backend and frontend are the same origin
      res.redirect("/oauth-success");
    } else {
      // In development, we must jump from :5000 to :5173
      res.redirect("http://localhost:5173/oauth-success");
    }
  }
);

export default router;
