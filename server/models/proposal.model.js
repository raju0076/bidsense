import mongoose from "mongoose";

const AttachmentSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["PRODUCT_IMAGE", "QUOTE_DOCUMENT", "OTHER"],
      default: "OTHER",
    },
    storage: {
      provider: {
        type: String,
        enum: ["LOCAL"],
        default: "LOCAL",
      },
      path: { type: String, required: true },
    },
    aiProcessing: {
      visionUsed: { type: Boolean, default: false },
      extractedText: { type: String },
      confidence: { type: Number, min: 0, max: 1 },
    },
  },
  { _id: false }
);

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    requestedSpecs: { type: String },
    quantityRequested: { type: Number },
    quantityQuoted: { type: Number },

    pricing: {
      unitPrice: { type: Number },
      currency: { type: String, default: "INR" },
      total: { type: Number },
    },

    media: {
      images: [AttachmentSchema],
    },
  },
  { _id: false }
);

const ProposalSchema = new mongoose.Schema(
  {
    rfpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rfp",
      required: true,
    },

    vendor: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
      },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },

    responseContent: {
      rawText: { type: String },
      hasImages: { type: Boolean, default: false },
      hasAttachments: { type: Boolean, default: false },
    },

    items: [ItemSchema],

    pricingSummary: {
      subTotal: { type: Number },
      tax: {
        type: {
          type: String,
          default: "GST",
        },
        percentage: { type: Number },
        amount: { type: Number },
      },
      grandTotal: { type: Number },
      currency: { type: String, default: "INR" },
    },

    commercialTerms: {
      deliveryDays: { type: Number },
      paymentTerms: { type: String },
      warranty: { type: String },
      quoteValidity: { type: String },
    },

    aiExtraction: {
      confidenceScore: { type: Number, min: 0, max: 1 },
      missingFields: [{ type: String }],
      notes: { type: String },
    },

    evaluation: {
      autoScore: { type: Number, min: 0, max: 100 },
      strengths: [{ type: String }],
      risks: [{ type: String }],
      recommended: { type: Boolean, default: false },
      reason: { type: String },
    },

    status: {
      type: String,
      enum: ["RECEIVED", "PARSED", "REVIEW_REQUIRED", "EVALUATED"],
      default: "RECEIVED",
    },
  },
  {
    timestamps: true,
  }
);

export const Proposal = mongoose.model("Proposal", ProposalSchema);
