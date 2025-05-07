import mongoose from 'mongoose'

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://trabn1712003:trabn1712003@cluster0.eu5pnre.mongodb.net/food-delivery-hvt').then(() => console.log("DB Connected"))
}