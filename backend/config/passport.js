const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google Profile:', {
          id: profile.id,
          email: profile.emails?.[0]?.value,
          displayName: profile.displayName
        });

        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });
        console.log('Existing user:', user);

        if (!user) {
          console.log('Creating new user...');
          // Create new user with a test habit
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
            habits: []
          });
          console.log('New user created with test habit:', user);
        } else {
          console.log('Updating existing user...');
          // Update existing user
          user = await User.findOneAndUpdate(
            { googleId: profile.id },
            {
              email: profile.emails[0].value,
              username: profile.displayName
            },
            { new: true }
          );
          console.log('User updated:', user);
        }

        return done(null, user);
      } catch (error) {
        console.error('Passport Strategy Error:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log('Deserialized user:', user);
    done(null, user);
  } catch (error) {
    console.error('Deserialize Error:', error);
    done(error, null);
  }
});

module.exports = passport; 