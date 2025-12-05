import { Vendor } from "../models/vendor.model.js";


export const createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.json({ success: true, vendor });
  } catch (err) {
    console.error("Vendor Create Error:", err);
    res.status(500).json({ error: "Failed to create vendor" });
  }
};

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json({ success: true, vendors });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete vendor" });
  }
};
