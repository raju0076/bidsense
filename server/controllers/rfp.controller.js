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
};




export const getSingleRfp = async (req, res) => {
  try {
    const { id } = req.params;

    const rfp = await RFP.findById(id)
      .populate("assignedVendors", "name email category")
      .lean();

    if (!rfp) {
      return res.status(404).json({
        success: false,
        message: "RFP not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rfp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch RFP details",
      error: error.message,
    });
  }
};