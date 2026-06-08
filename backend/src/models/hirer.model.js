const mongoose = require("mongoose");

const hirerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hiringLocation: { type: String, required: true },
  uid: { type: String , required:true}, // Optional: if you still want to collect this manually
}, { timestamps: true });
const hirerModel = mongoose.model("Hirer", hirerSchema);
module.exports = hirerModel;