const passport = require("passport");
const User = require("../../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/api/v1/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;

          // First, check if a user already exists with that email
          let user = await User.findOne({ email });

          if (user) {
            let updated = false;

            if (!user.googleId) {
              user.googleId = profile.id;
              updated = true;
            }

            if (!user.profileImageUrl) {
              user.profileImageUrl = profile.photos[0].value;
              updated = true;
            }

            if (!user.isAccountVerified) {
              user.isAccountVerified = true;
              updated = true;
            }

            if (updated) {
              await user.save();
            }

            return done(null, user);
          }
          // Otherwise, create new user
          user = await User.create({
            googleId: profile.id,
            fullName: profile.displayName,
            email,
            profileImageUrl: profile.photos[0].value,
            password: "google-auth", // optional placeholder, since you're not using password for Google login
            isAccountVerified: true,
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};
