import express from "express";
import { fetchUnreadEmails, getRfpEmailLogs, sendEmail } from "../controllers/email.controller.js";


const EmailRouter = express.Router()

EmailRouter.post("/send-mail/:id",sendEmail)
EmailRouter.get("/rfp-email-logs", getRfpEmailLogs);


EmailRouter.post('/fetch-emails', async (req, res) => {
  try {
    const result = await fetchUnreadEmails();

    return res.status(200).json({
      success: true,
      message: "Email inbox synced successfully",
      data: result,
    });
  } catch (error) {
    console.error("🔥 /fetch-emails API ERROR");
    console.error(error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: "Failed to sync inbox",
      error: error.message, // ← TEMP: remove after debugging
    });
  }
});

export default EmailRouter;