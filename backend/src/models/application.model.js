const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
  applyingAs: { type: String, required: true }, // 'individual' or 'contractor'
  numberOfLabourers: { type: Number, required: true },
  name: { type: String, required: true },
  uidNo: { type: String, required: true },
  mobileNo: { type: String, required: true }
}, { timestamps: true });

const applicationModel = mongoose.model("Application", applicationSchema);
module.exports = applicationModel;