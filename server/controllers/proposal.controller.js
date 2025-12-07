import { Proposal } from "../models/proposal.model.js";
import mongoose from "mongoose";

export const getProposalsByRfp = async (req, res) => {
  try {
    const { rfpId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(rfpId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid RFP ID format",
      });
    }

    const proposals = await Proposal.find({ rfpId })
      .sort({ createdAt: -1 })
      .lean();

    if (!proposals.length) {
      return res.status(200).json({
        success: true,
        message: "No proposals found for this RFP",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals,
    });
  } catch (error) {
    console.error("getProposalsByRfp error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch proposals",
    });
  }
};


export const getProposalById = async (req, res) => {
  try {
    const { proposalId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(proposalId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid proposal ID format",
      });
    }

    const proposal = await Proposal.findById(proposalId).lean();

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: proposal,
    });
  } catch (error) {
    console.error("getProposalById error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch proposal",
    });
  }
};




