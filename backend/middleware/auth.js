import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.headers.token || req.headers['authorization'];
    if(!token) {
        return res.status(401).json({success: false, message: "Not Authorized - Login Required"});
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({success: false, message: "Invalid or expired token"});
    }
}

export default authMiddleware;