import foodModel from "../models/foodModel.js"
import fs from 'fs'

// add food item
const addFood = async (req, res) => {
    try{
        if (!req.file) {
            return res.status(400).json({success: false, message: "Image file is required"});
        }

        let image_filename = `${req.file.filename}`;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
            thoihansudung: req.body.thoihansudung,
        });

        await food.save();
        res.status(201).json({success:true, message:"Food Added"});
    } catch(error){
        console.log("CATEGORY:", req.body.category);
        console.log(error);
        res.status(500).json({success: false, message: "Failed to add food"});
    }
}


// all food list with pagination, search, and filter
const listFood = async (req, res) =>{
    try {
        const {
            page = 1,
            limit = 12,
            category,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build query
        const query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const foods = await foodModel
            .find(query)
            .sort(sort)
            .limit(parseInt(limit))
            .skip(skip);

        // Get total count for pagination
        const total = await foodModel.countDocuments(query);

        res.status(200).json({
            success: true,
            data: foods,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Failed to fetch foods"});
    }
}

// remove food item
const removeFood = async (req, res) =>{
    try {
        const food = await foodModel.findById(req.body.id);
        if(!food) {
            return res.status(404).json({success: false, message:"Food not found"});
        }
        fs.unlink(`uploads/${food.image}`,() => {});

        await foodModel.findByIdAndDelete(req.body.id);
        res.status(200).json({success: true, message:"Food Removed"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message:"Failed to remove food"});
    }
}

//update food item
const updateFood = async (req, res) => {
    try {
        const { id, name, category, description, price } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Missing food id' });
        }

        // Tìm và cập nhật
        const updatedFood = await foodModel.findByIdAndUpdate(
            id,
            { name, category, description, price },
            { new: true }
        );

        if (!updatedFood) {
            return res.status(404).json({ success: false, message: 'Food not found' });
        }

        res.status(200).json({ success: true, message: 'Food updated successfully', data: updatedFood });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update food' });
    }
} 


export {addFood, listFood, removeFood, updateFood}