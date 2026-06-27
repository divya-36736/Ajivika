const Application = require("../models/application.model");
const Location = require("../models/location.model");

const applyForJob = async (req, res) => {
    try {
        // 1. Frontend se data receive karna
        const { locationId, applyingAs, numberOfLabourers, name, uidNo, mobileNo } = req.body;

        // 2. Basic Validation: Koi bhi zaruri field khali nahi honi chahiye
        if (!locationId || !applyingAs || !name || !uidNo || !mobileNo) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        // 3. Job Post (Location) ko database mein dhoondhna
        const jobPost = await Location.findById(locationId);
        if (!jobPost) {
            return res.status(404).json({ 
                success: false, 
                message: "Job location not found or already removed." 
            });
        }

        // 4. Decide karna ki kitne log apply kar rahe hain
        // Agar Individual hai toh automatically 1, warna Contractor ka dala hua number
        const workersToDeduct = applyingAs === 'Individual' ? 1 : Number(numberOfLabourers);

        // 5. OVERBOOKING CHECK: Kya utni post bachi hain?
        if (jobPost.nal < workersToDeduct) {
            return res.status(400).json({
                success: false,
                message: `Sorry, only ${jobPost.nal} posts are available. You cannot apply for ${workersToDeduct} workers.`
            });
        }

        // 6. Application ko create aur save karna
        const newApplication = new Application({
            locationId,
            applyingAs,
            numberOfLabourers: workersToDeduct,
            name,
            uidNo,
            mobileNo
        });

        await newApplication.save();

        // 7. MAGIC STEP: Location table mein 'nal' (Post Available) ko kam karna
        jobPost.nal = jobPost.nal - workersToDeduct;
        await jobPost.save();

        // 8. Frontend ko Success Response bhejna
        res.status(201).json({
            success: true,
            message: "Application submitted successfully!",
            data: newApplication,
            remainingPosts: jobPost.nal // Ye frontend ko bata dega ki ab kitni post bachi hain
        });

    } catch (error) {
        console.error("Application Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};

module.exports = { applyForJob };