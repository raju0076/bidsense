import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function testGemini() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not loaded");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // ✅ CORRECT MODEL NAME
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash"
  });

  const result = await model.generateContent("Say hello in one sentence");
  console.log("✅ Gemini response:", result.response.text());
}

testGemini().catch(err => {
  console.error("❌ Gemini Error:", err.message);
});
