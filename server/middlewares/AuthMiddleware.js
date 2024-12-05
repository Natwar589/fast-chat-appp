import jwt from 'jsonwebtoken';



const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt; // Get token from cookies (you might need to extract from headers if not found here)
  if (!token) {
    return res.status(403).json({ message: 'Authentication token is missing' });
  }
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Attach user info to the request object
    req.userId = decoded.userId;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token',error:error });
  }
};

export default authenticateJWT;
