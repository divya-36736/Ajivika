const Review = require("../models/review.model");
const Application = require("../models/application.model");

// 1. Add a New Review (Rating Dena)
const addReview = async (req, res) => {
    try {
        const { reviewerId, reviewerType, revieweeId, revieweeType, applicationId, rating, feedback } = req.body;

        // Validation
        if (!reviewerId || !reviewerType || !revieweeId || !revieweeType || !applicationId || !rating) {
            return res.status(400).json({ success: false, message: "All required fields must be provided" });
        }

        // Cross-check: Kya sach mein in dono ne is job par kaam kiya hai?
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, message: "Job Application not found" });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ reviewerId, applicationId });
        if (existingReview) {
            return res.status(400).json({ success: false, message: "You have already reviewed this work experience." });
        }

        const newReview = new Review({
            reviewerId, reviewerType, revieweeId, revieweeType, applicationId, rating, feedback
        });

        await newReview.save();

        res.status(201).json({ success: true, message: "Review submitted successfully!", data: newReview });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// 2. Get User Profile Reviews (Kisko kitni rating mili)
const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params; // Jiske reviews dekhne hain uski ID

        // Database se us user ke saare reviews nikalo
        const reviews = await Review.find({ revieweeId: userId })
            .populate('reviewerId', 'name') // Review dene wale ka naam attach karo
            .sort({ createdAt: -1 }); // Naye reviews upar dikhayenge

        // Average Rating Calculate karna
        let totalRating = 0;
        let averageRating = 0;

        if (reviews.length > 0) {
            reviews.forEach(r => { totalRating += r.rating; });
            averageRating = (totalRating / reviews.length).toFixed(1); // e.g., 4.2
        }

        res.status(200).json({
            success: true,
            stats: {
                totalReviews: reviews.length,
                averageRating: parseFloat(averageRating)
            },
            reviews
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

module.exports = { addReview, getUserReviews };