const jwt = require('jsonwebtoken');
const jwtKey = process.env.jwtKey;
exports.Authorize = (req, res, next) => {

    const token = req.cookies.token;
     // Assuming token is sent via cooki
    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, jwtKey);

        // Attach decoded user information to the request object
        
        req.user = decoded;

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(403).json({ message: "Invalid token" });
    }
};