import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
}, { timestamps: true });

export const Vendor = mongoose.model("Vendor", VendorSchema)
