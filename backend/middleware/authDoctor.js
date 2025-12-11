import jwt from "jsonwebtoken";

// doctor Authentication middleware

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({
        success: false,
        message: "Not authorized. Please login again.",
      });
    } 
    const tokenData = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.body.docId = tokenData.id;
    next();
  } catch (error) {
    // Don't log JWT errors to console - they're expected when tokens are invalid/expired
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.json({ success: false, message: "Invalid or expired token. Please login again." });
    }
    console.error('Auth Doctor Error:', error);
    res.json({ success: false, message: "Authentication failed" });
  }
};

export default authDoctor;
