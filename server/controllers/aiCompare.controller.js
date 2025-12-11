import { Proposal } from "../models/proposal.model.js";
import dotenv from "dotenv"
dotenv.config()
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const aiCompareProposals = async (req, res) => {
  try {
    const { rfpId } = req.params;

    const proposals = await Proposal.find({ rfpId })
      .populate("vendor", "name email");

    if (proposals.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least two proposals required for comparison",
      });
    }

    const proposalSummaries = proposals.map((p) => ({
      vendorName: p.vendor?.name,
      totalPrice: p.pricingSummary?.grandTotal || "Not specified",
      deliveryDays: p.commercialTerms?.deliveryDays || "Not specified",
      warranty: p.commercialTerms?.warranty || "Not specified",
      paymentTerms: p.commercialTerms?.paymentTerms || "Not specified",
      confidenceScore: p.aiExtraction?.confidenceScore || 0,
    }));

    const prompt = `
You are a procurement evaluation AI.

Below are vendor proposals for the same RFP.
Compare them and recommend the single best vendor.

Evaluation criteria:
- Lower total price is better
- Faster delivery is better
- Longer warranty is better
- Higher confidence score is better

Return STRICT JSON in this format only:
{
  "recommendedVendor": string,
  "reason": string,
  "comparison": [
    {
      "vendorName": string,
      "strengths": string[],
      "risks": string[],
      "overallScore": number
    }
  ]
}

Proposals:
${JSON.stringify(proposalSummaries, null, 2)}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    // Gemini sometimes wraps JSON in ```json
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const aiResult = JSON.parse(cleanJson);

    res.json({
      success: true,
      data: aiResult,
    });
  } catch (error) {
    console.error("❌ Gemini AI Error:", error);
    res.status(500).json({
      success: false,
      message: "AI comparison failed",
    });
  }
};
