const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  hirerId: { type: mongoose.Schema.Types.ObjectId, ref: "Hirer", required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  nal: { type: Number, required: true }, // Number of labourers
  wages: { type: Number, required: true }
}, { timestamps: true });

const locationModel = mongoose.model("Location", locationSchema);
module.exports = locationModel;