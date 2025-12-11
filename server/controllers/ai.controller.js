
import { RFP } from "../models/rfp.model.js";
import dotenv from "dotenv"

dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export const createRFP = async (req, res) => {
  console.log("➡️ createRFP API called");

  const { text } = req.body;
  console.log("📥 Request body text:", text);

  console.log(
    "🔑 GEMINI KEY PREFIX:",
    process.env.GEMINI_API_KEY
      ? process.env.GEMINI_API_KEY.slice(0, 15)
      : "❌ NO KEY FOUND"
  );

  if (!text) {
    console.log("❌ Text missing in request");
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const prompt = `
Extract structured RFP details from this procurement text.
Return ONLY valid JSON with these fields:
title, items (name, quantity, specs), budget, deliveryDays, paymentTerms, warranty.

Rules:
- Output ONLY pure JSON
- No markdown
- No backticks
- No explanations

Text: ${text}
`;

    console.log("🧠 Sending prompt to Gemini...");
    console.log("Prompt preview:", prompt.slice(0, 200));

    const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    let content = response.text();
    console.log("📄 Gemini raw response:", content);

    if (!content) {
      console.log("❌ Gemini returned empty content");
      throw new Error("Empty Gemini response");
    }

    content = content.replace(/```json/g, "").replace(/```/g, "").trim();
    console.log("🧹 Cleaned JSON string:", content);

    let structured;
    try {
      structured = JSON.parse(content);
    } catch (err) {
      console.error("❌ JSON parse failed. Raw content:", content);
      throw new Error("Invalid JSON from Gemini");
    }

    console.log("✅ Parsed structured JSON:", structured);

    console.log("💾 Saving RFP to database...");
    const rfp = await RFP.create({
      title: structured.title,
      description: text,
      structured,
      status: "draft"
    });

    console.log("✅ RFP saved successfully:", rfp._id);

    return res.json({ success: true, rfp });

  } catch (err) {
    console.error("❌ Gemini RFP Creation Error:", err.message);
    console.error(err.stack);
    return res.status(500).json({
      error: "Failed to generate RFP",
      details: err.message
    });
  }
};



export const getAllRFP = async (req, res) => {
  try {
    const rfps = await RFP.find().sort({ createdAt: -1 }); 
    return res.json({
      success: true,
      count: rfps.length,
      rfps,
    });
  } catch (err) {
    console.error("Get All RFPs Error:", err);
    res.status(500).json({ error: "Failed to fetch RFPs" });
  }
};
