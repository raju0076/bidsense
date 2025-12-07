
import mongoose from "mongoose";

const RfpEmailLogSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    fromEmail: { type: String },

    rfpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rfp",
      default: null,
    },

    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "PROPOSAL_CREATED",
        "INVALID_RFP",
        "UNKNOWN_VENDOR",
        "PARSE_ERROR",
      ],
      required: true,
    },

    receivedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const RfpEmailLog = mongoose.model(
  "RfpEmailLog",
  RfpEmailLogSchema
);
