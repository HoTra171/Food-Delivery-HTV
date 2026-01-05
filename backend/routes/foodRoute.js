import express from "express"
import { addFood, listFood, removeFood, updateFood } from "../controllers/foodController.js"
import multer from "multer"
import path from "path"
import authMiddleware from "../middleware/auth.js"
import adminMiddleware from "../middleware/adminMiddleware.js"

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        // Sanitize filename to prevent path traversal
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        return cb(null, `${Date.now()}-${sanitizedName}`);
    }
})

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PNG, JPG, JPEG and WEBP are allowed'), false);
    }
};

// Multer configuration with security
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1
    }
})

// Protected admin routes
foodRouter.post("/add", authMiddleware, adminMiddleware, upload.single("image"), addFood)
foodRouter.post("/remove", authMiddleware, adminMiddleware, removeFood)
foodRouter.post("/update", authMiddleware, adminMiddleware, updateFood)

// Public route
foodRouter.get("/list", listFood)


export default foodRouter