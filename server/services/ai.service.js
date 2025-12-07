import OpenAI from "openai";
import { Proposal } from "../models/proposal.model.js";
import dotenv from "dotenv";
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

async function parseProposalWithAI(proposalId) {
  console.log(`🧠 AI parsing started for proposal ${proposalId}`);

  const proposal = await Proposal.findById(proposalId);
  if (!proposal || !proposal.responseContent?.rawText) {
    console.log("⚠ Proposal or raw text missing");
    return;
  }

  const prompt = `
You are an AI system that converts vendor proposal emails into structured JSON
that matches a predefined MongoDB schema.

Return STRICT JSON ONLY — no explanations.

Schema to follow:

{
  "items": [{
    "name": string,
    "quantityQuoted": number | null,
    "pricing": {
      "unitPrice": number | null,
      "currency": "INR",
      "total": number | null
    }
  }],
  "pricingSummary": {
    "subTotal": number | null,
    "tax": {
      "type": "GST",
      "percentage": number | null,
      "amount": number | null
    },
    "grandTotal": number | null,
    "currency": "INR"
  },
  "commercialTerms": {
    "deliveryDays": number | null,
    "paymentTerms": string | null,
    "warranty": string | null,
    "quoteValidity": string | null
  },
  "confidenceScore": number
}

Rules:
- Use INR as currency.
- If any value is missing, set it to null.
- Extract only factual data from the text.
- Return valid JSON only.

Vendor Proposal Text:
"""${proposal.responseContent.rawText}"""
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  });

  let aiResult;
  try {
    aiResult = JSON.parse(response.choices[0].message.content);
  } catch (e) {
    console.error("❌ AI returned invalid JSON");
    return;
  }

  // ✅ Map AI output → Schema
  proposal.items = (aiResult.items || []).map(item => ({
    name: item.name,
    quantityQuoted: item.quantityQuoted,
    pricing: {
      unitPrice: item.pricing?.unitPrice,
      currency: item.pricing?.currency || "INR",
      total: item.pricing?.total
    },
    media: { images: [] }
  }));

  proposal.pricingSummary = {
    subTotal: aiResult.pricingSummary?.subTotal,
    tax: {
      type: "GST",
      percentage: aiResult.pricingSummary?.tax?.percentage,
      amount: aiResult.pricingSummary?.tax?.amount
    },
    grandTotal: aiResult.pricingSummary?.grandTotal,
    currency: "INR"
  };

  proposal.commercialTerms = {
    deliveryDays: aiResult.commercialTerms?.deliveryDays,
    paymentTerms: aiResult.commercialTerms?.paymentTerms,
    warranty: aiResult.commercialTerms?.warranty,
    quoteValidity: aiResult.commercialTerms?.quoteValidity
  };

  proposal.aiExtraction = {
    confidenceScore: aiResult.confidenceScore || 0.9,
    missingFields: [],
    notes: "Parsed automatically from vendor email"
  };

  proposal.status = "PARSED";

  await proposal.save();

  console.log(`✅ AI parsing completed for proposal ${proposalId}`);
}

export default parseProposalWithAI;
