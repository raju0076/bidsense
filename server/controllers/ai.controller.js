
import OpenAI from "openai";
import { RFP } from "../models/rfp.model.js";
import dotenv from "dotenv"

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export const createRFP = async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const prompt = `
      Extract structured RFP details from this procurement text.
      Return ONLY valid JSON with these fields:
      title, items (name, quantity, specs), budget, deliveryDays, paymentTerms, warranty.

      Do NOT include backticks, markdown, comments, or explanations.
      Respond with pure JSON only.

      Text: ${text}
    `;

    const aiResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "Respond ONLY with raw JSON. No code blocks, no backticks, no markdown." 
        },
        { role: "user", content: prompt }
      ]
    });

    let content = aiResponse.choices[0].message.content.trim();

    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    const structured = JSON.parse(content);

    const rfp = await RFP.create({
      title: structured.title,
      description: text,
      structured,
      status: "draft"
    });

    return res.json({ success: true, rfp });

  } catch (err) {
    console.error("AI RFP Creation Error:", err);
    res.status(500).json({ error: "Failed to generate RFP" });
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
