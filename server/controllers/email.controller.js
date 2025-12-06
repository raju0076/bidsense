import express from "express";
import { RFP } from "../models/rfp.model.js";



export const sendEmail=async (req, res) => {
  try {
    const rfp = await RFP.findById(req.params.id).populate("assignedVendors");
    if (!rfp) return res.status(404).json({ error: "RFP not found" });

    const emails = rfp.assignedVendors.map(v => v.email);

    const emailBody = `
Hello Vendor,

We invite you to respond to the following RFP:

Title: ${rfp.title}
Budget: ${rfp.structured.budget?.amount || "N/A"}
Delivery: ${rfp.structured.delivery?.days || "N/A"} days
Payment Terms: ${rfp.structured.payment_terms}
Warranty: ${rfp.structured.warranty}

Items Required:
${rfp.structured.items.map(i => `• ${i.name} (${i.quantity})`).join("\n")}

Please reply to this email with your quotation.

Regards,
Procurement Team
`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emails,
      subject: `RFP Invitation: ${rfp.title}`,
      text: emailBody
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "RFP email sent successfully to selected vendors",
      sentTo: emails
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send RFP email" });
  }
}