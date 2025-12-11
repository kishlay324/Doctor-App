import jwt from "jsonwebtoken";

// user Authentication middleware

const authUser = async (req, res, next) => {
  try {
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not configured!');
      return res.json({
        success: false,
        message: "Server configuration error. Please contact administrator.",
      });
    }

    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not authorized. Please login again.",
      });
    }

    // Verify token
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token has required data
    if (!tokenData || !tokenData.id) {
      return res.json({
        success: false,
        message: "Invalid token format. Please login again.",
      });
    }

    req.body.userId = tokenData.id;
    next();
  } catch (error) {
    // Provide more specific error messages
    if (error.name === 'JsonWebTokenError') {
      console.log('⚠️  JWT Error: Invalid token format');
      return res.json({ 
        success: false, 
        message: "Invalid token. Please login again." 
      });
    }
    if (error.name === 'TokenExpiredError') {
      console.log('⚠️  JWT Error: Token expired');
      return res.json({ 
        success: false, 
        message: "Token expired. Please login again." 
      });
    }
    console.error('❌ Auth User Error:', error.name, error.message);
    res.json({ 
      success: false, 
      message: "Authentication failed. Please try logging in again." 
    });
  }
};

export default authUser;
