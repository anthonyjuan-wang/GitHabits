const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Google OAuth login route
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email }, // data
        process.env.JWT_SECRET, // secret
        { expiresIn: '24h' } // expiration
      );

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=true`);
    }
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.FRONTEND_URL);
});

module.exports = router; 