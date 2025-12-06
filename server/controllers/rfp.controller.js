
import express from "express";
import { RFP } from "../models/rfp.model.js";


export const AssignVendors = async (req, res) => {
  try {
    const { vendorIds } = req.body;

    const rfp = await RFP.findByIdAndUpdate(
      req.params.id,
      { assignedVendors: vendorIds },
      { new: true }
    ).populate("assignedVendors");

    res.json({
      success: true,
      message: "Vendors assigned successfully",
      rfp,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to assign vendors" });
  }
}