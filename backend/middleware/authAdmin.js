import jwt from "jsonwebtoken";

// Admin Authentication middleware

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({
        success: false,
        message: "Not authorized. Please login again.",
      });
    }
    
      const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
     if(token_decode !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
        return res.json({
          success: false,
        message: "Not authorized. Please login again.",
        });
    }
    next();
  } catch (error) {
    // Don't log JWT errors to console - they're expected when tokens are invalid/expired
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.json({ success: false, message: "Invalid or expired token. Please login again." });
    }
    console.error('Auth Admin Error:', error);
    res.json({ success: false, message: "Authentication failed" });
  }
};

export default authAdmin;
