import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

/**
 * Passport Google OAuth 2.0 Strategy Configuration
 * * Note: This configuration mutates the global Passport singleton.
 * Any route utilizing passport.authenticate("google") will trigger this logic.
 */
export function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
        // Required for correct protocol detection when behind a Load Balancer/Reverse Proxy
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Normalize identity fields to prevent duplicate accounts via casing mismatches
          const email = profile.emails?.[0]?.value?.toLowerCase();
          const googleId = profile.id;
          const name = profile.displayName || "Google User";

          if (!email) {
            return done(null, false, {
              message:
                "OAuth Error: Google account does not provide a verified email address.",
            });
          }

          // Primary lookup: Check for existing OAuth link via Provider ID
          let user = await User.findOne({ googleId });

          if (!user) {
            /**
             * Account Linking Logic:
             * If a user exists with the same email (e.g., via Local strategy),
             * link the Google ID to the existing record to prevent account fragmentation.
             */
            user = await User.findOne({ email });

            if (user) {
              user.googleId = googleId;
              // Preserve original provider but ensure profile metadata is populated
              if (!user.name) user.name = name;
              await user.save();
            } else {
              /**
               * JIT (Just-In-Time) Provisioning:
               * Create a new user record for first-time OAuth login.
               */
              user = await User.create({
                name,
                email,
                provider: "google",
                googleId,
                // Passwords omitted for OAuth users to reduce attack surface
              });
            }
          }

          return done(null, user);
        } catch (err) {
          // Pass unexpected errors to the Passport error handler
          return done(err);
        }
      }
    )
  );
}
