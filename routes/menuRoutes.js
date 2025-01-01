const express = require("express");
const router = express.Router();
const MenuItem = require("../models/Menu");



router.post("/", async (req, res) => {
    try {
        const data = req.body;
        const menuItem = new MenuItem(data);
        await menuItem.save();
        if(menuItem){
            res.status(201).json({
                message: "Data saved successfully",
                success: true,
                data: menuItem
            });
        }
        else{
            res.status(500).json({
                message: "Error saving menuItem",
                success: false
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});

router.get("/", async(req, res) => {
    try {
        const menuItem = await MenuItem.find();
        if(menuItem){
            res.status(200).json({
                message: "Data fetched successfully",
                success: true,
                data: menuItem
            });
        }
        else{
            res.status(500).json({
                message: "Error fetching menuItem",
                success: false
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});


router.get("/:tasteAs", async (req, res) => {
    try {
        const tasteType = req.params.tasteAs;
        if(tasteType === "sweet" || tasteType === "spicy" || tasteType === "sour"){
            const tasteData = await MenuItem.find({taste: tasteType});
            // const tasteData = await MenuItem.find({$or: [{taste: tasteType}, {is_drink: tasteType}]});
            res.status(200).json({
                message: "Menu item fetched successfully",
                success: true,
                data: tasteData
            });
        }
        else{
            res.status(404).json({
                message: "Invalid taste type",
                success: false
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});




module.exports = router;