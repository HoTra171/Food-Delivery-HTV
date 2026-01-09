import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import voucherRouter from "./routes/voucherRoute.js"
import { errorHandler } from "./middleware/errorHandler.js"
import dotenv from "dotenv";

// load bien moi truong 
dotenv.config();



// app config 
const app = express()
const port = process.env.PORT || 4000

// middleware 
app.use(express.json())

// CORS configuration for production
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174', 
    'https://food-delivery-frontend-wheat.vercel.app',
    'https://food-delivery-admin-wheat.vercel.app'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))

// db connection
connectDB()

// api endpoints
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/voucher", voucherRouter)


app.get("/", (req, res) => {
    res.send("API working")
})

// Global error handler - must be last
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})

// mongodb+srv://trabn1712003:<trabn1712003>@cluster0.eu5pnre.mongodb.net/?