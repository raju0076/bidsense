import mongoose, { model } from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  specs: Object
});

const rfpSchema = new mongoose.Schema({
  title: String,
  description: String,
  structured: {
    items: [itemSchema],
    budget: Object,
    delivery: Object,
    payment_terms: String,
    warranty: String,
    notes: String
  },
  status: { type: String, default: "draft" }
}, { timestamps: true });

export const RFP = mongoose.model("RFP",rfpSchema)
