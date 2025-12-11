import { Proposal } from "../models/proposal.model.js";
import dotenv from "dotenv";
dotenv.config()
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
- Use INR as currency
- If value is missing, set it to null
- Extract only factual data
- Output valid JSON only
- No markdown, no backticks

Vendor Proposal Text:
"""${proposal.responseContent.rawText}"""
`;

  try {
    console.log("🧠 Sending proposal parsing prompt to Gemini...");

    const model = genAI.getGenerativeModel({
     model: "gemini-2.0-flash"
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    let content = response.text();
    console.log("📄 Gemini raw response:", content);

    if (!content) {
      throw new Error("Empty Gemini response");
    }

    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    let aiResult;
    try {
      aiResult = JSON.parse(content);
    } catch (e) {
      console.error("❌ Gemini returned invalid JSON:", content);
      return;
    }

    proposal.items = (aiResult.items || []).map(item => ({
      name: item.name,
      quantityQuoted: item.quantityQuoted ?? null,
      pricing: {
        unitPrice: item.pricing?.unitPrice ?? null,
        currency: item.pricing?.currency || "INR",
        total: item.pricing?.total ?? null
      },
      media: { images: [] }
    }));

    proposal.pricingSummary = {
      subTotal: aiResult.pricingSummary?.subTotal ?? null,
      tax: {
        type: "GST",
        percentage: aiResult.pricingSummary?.tax?.percentage ?? null,
        amount: aiResult.pricingSummary?.tax?.amount ?? null
      },
      grandTotal: aiResult.pricingSummary?.grandTotal ?? null,
      currency: "INR"
    };

    proposal.commercialTerms = {
      deliveryDays: aiResult.commercialTerms?.deliveryDays ?? null,
      paymentTerms: aiResult.commercialTerms?.paymentTerms ?? null,
      warranty: aiResult.commercialTerms?.warranty ?? null,
      quoteValidity: aiResult.commercialTerms?.quoteValidity ?? null
    };

    proposal.aiExtraction = {
      confidenceScore: aiResult.confidenceScore ?? 0.9,
      missingFields: [],
      notes: "Parsed automatically from vendor email (Gemini)"
    };

    proposal.status = "PARSED";

    await proposal.save();

    console.log(`✅ AI parsing completed for proposal ${proposalId}`);

  } catch (err) {
    console.error("❌ Gemini proposal parsing error:", err.message);
    console.error(err.stack);
  }
}

export default parseProposalWithAI;

