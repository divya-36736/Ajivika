// File: backend/src/controllers/locationController.js
const locationModel = require("../models/location.model");

const createJobPost = async (req, res) => {
    try {
        // 1. Frontend se aane wala data receive karna
        const { hirerId, lat, lng, nal, wages } = req.body;

        // 2. Check karna ki koi field khali toh nahi hai
        if (!hirerId || !lat || !lng || !nal || !wages) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        // 3. Naya Job Post (Location) create karna
        const newLocation = new locationModel({
            hirerId,
            lat,
            lng,
            nal,
            wages
        });

        // 4. Database mein save karna
        await newLocation.save();

        // 5. Frontend ko success message bhejna
        res.status(201).json({
            success: true,
            message: "Job posted successfully",
            data: newLocation
        });

    } catch (error) {
        console.error("Error creating job post:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};

const getAllLocations = async (req, res) => {
    try {
        // Sirf wahi jobs bhejo jahan nal > 0 hai
        const locations = await locationModel.find({ nal: { $gt: 0 } });
        res.status(200).json({ success: true, locations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching locations" });
    }
};


module.exports = { createJobPost, getAllLocations };
