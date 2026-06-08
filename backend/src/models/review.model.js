const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  // Jisne review diya (Reviewer)
  reviewerId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'reviewerType' },
  reviewerType: { type: String, required: true, enum: ['Hirer', 'Laborer'] },

  // Jisko review mila (Reviewee)
  revieweeId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'revieweeType' },
  revieweeType: { type: String, required: true, enum: ['Hirer', 'Laborer'] },

  // Kis job ke liye ye rating di gayi hai (Fake reviews rokne ke liye)
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },

  // Rating and Feedback
  rating: { type: Number, required: true, min: 1, max: 5 }, // 1 to 5 stars
  feedback: { type: String, required: false } // Text review (optional)

}, { timestamps: true });

// Ek job (application) ke liye ek user sirf ek hi baar review de sakta hai
reviewSchema.index({ reviewerId: 1, applicationId: 1 }, { unique: true });

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;