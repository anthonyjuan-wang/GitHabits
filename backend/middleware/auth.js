const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('Auth middleware - Request received');
  console.log('Request path:', req.path);
  console.log('All headers:', req.headers);
  
  // Get token from header
  const authHeader = req.header('Authorization');
  console.log('Authorization header:', authHeader);
  
  // Check if Authorization Header is present
  if (!authHeader) {
    console.log('No Authorization header found');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Check if it's a Bearer token
  if (!authHeader.startsWith('Bearer ')) {
    console.log('Invalid token format - missing Bearer prefix');
    return res.status(401).json({ message: 'Invalid token format' });
  }

  // Get the token without "Bearer "
  const token = authHeader.substring(7);
  console.log('Extracted token:', token);

  try {
    // Verify token
    console.log('Attempting to verify token with secret');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully');
    console.log('Decoded token data:', decoded);
    
    // Add user from token data
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 