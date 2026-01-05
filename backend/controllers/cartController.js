import userModel from "../models/userModel.js";

// add items to user cart
const addToCart = async (req, res) => {
    try {
        if (!req.body.itemId) {
            return res.status(400).json({success: false, message: "Item ID is required"});
        }
        
        let userData = await userModel.findById(req.userId);
        if (!userData) {
            return res.status(404).json({success: false, message: "User not found"});
        }
        
        let cartData = userData.cartData;
        if(!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        }
        else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.userId, { cartData: cartData });
        res.status(200).json({success: true, message: "Added to cart"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Failed to add to cart"});
    }
}

// remove items from user cart
const removeFromCart = async (req, res) => {    
    try {
        if (!req.body.itemId) {
            return res.status(400).json({success: false, message: "Item ID is required"});
        }
        
        let userData = await userModel.findById(req.userId);
        if (!userData) {
            return res.status(404).json({success: false, message: "User not found"});
        }
        
        let cartData = userData.cartData;
        if(cartData[req.body.itemId]>0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.userId, { cartData: cartData });
        res.status(200).json({success: true, message: "Removed from cart"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Failed to remove from cart"});
    }
}

// fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.userId);
        if (!userData) {
            return res.status(404).json({success: false, message: "User not found"});
        }
        
        let cartData = userData.cartData;
        res.status(200).json({success: true, cartData});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Failed to fetch cart"});
    }
}

export { addToCart, removeFromCart, getCart };

