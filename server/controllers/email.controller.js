import express from "express";
import { RFP } from "../models/rfp.model.js";
import transporter from "../utils/email.js";
import imaps from "imap-simple";
import { simpleParser } from "mailparser";

import dotenv from "dotenv"
import { imapConfig } from "../configs/imap.config.js";
import { handleIncomingEmail } from "../services/emailHandler.js";
import { Proposal } from "../models/proposal.model.js";
import parseProposalWithAI from "../services/ai.service.js";
import { Vendor } from "../models/vendor.model.js";
import path from "path";
import fs from "fs";
import { RfpEmailLog } from "../models/inboxLog.model.js";


dotenv.config()


export const sendEmail = async (req, res) => {
  try {
    const rfp = await RFP.findById(req.params.id).populate("assignedVendors");
    if (!rfp) {
      return res.status(404).json({ success: false, error: "RFP not found" });
    }

    if (!rfp.assignedVendors || rfp.assignedVendors.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No vendors assigned to this RFP"
      });
    }

    const vendorEmails = rfp.assignedVendors.map(v => v.email);

    const emailBody = `
Hello Vendor,

You are invited to participate in the following Request for Proposal (RFP).

----------------------------------------
RFP ID      : ${rfp._id}
Title       : ${rfp.title}
Budget      : ${rfp.structured?.budget?.amount || "N/A"}
Delivery    : ${rfp.structured?.delivery?.days || "N/A"} days
Payment     : ${rfp.structured?.payment_terms || "N/A"}
Warranty    : ${rfp.structured?.warranty || "N/A"}
----------------------------------------

Items Required:
${rfp.structured.items
        .map(i => `• ${i.name} — Quantity: ${i.quantity}`)
        .join("\n")}

Instructions:
• Please reply directly to this email with your quotation.
• You may include item-wise pricing, delivery timeline, and warranty details.
• Attach product images or documents if applicable.

Thank you for your time.

Regards,
Procurement Team
`;

    const mailOptions = {
      from: `"Procurement Team" <${process.env.EMAIL_USER}>`,
      to: vendorEmails,
      subject: `RFP-${rfp._id} | ${rfp.title}`,
      text: emailBody
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "RFP invitation email sent successfully",
      rfpId: rfp._id,
      vendorsNotified: vendorEmails.length
    });

  } catch (err) {
    console.error("Send RFP Email Error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to send RFP email"
    });
  }
};



function isRfpEmail(subject) {
  if (!subject) return false;
  return subject.includes("RFP-");
}

function extractRfpId(subject) {
  const match = subject.match(/RFP-([a-f0-9]{24})/i);
  return match ? match[1] : null;
}

export const fetchUnreadEmails = async () => {
  let totalUnread = 0;
  let rfpMatched = 0;
  let proposalsCreated = 0;
  let skipped = 0;

  try {
    const connection = await imaps.connect(imapConfig);
    await connection.openBox("INBOX", true);

    const since = new Date();
    since.setDate(since.getDate() - 1);

    const searchCriteria = ["UNSEEN", ["SINCE", since]];
    const fetchOptions = {
      bodies: ["HEADER.FIELDS (FROM SUBJECT DATE)"],
      struct: true,
      markSeen: false,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    totalUnread = messages.length;
    console.log(totalUnread)

    for (const item of messages) {
      const headerPart = item.parts.find(p => p.which.includes("HEADER"));
      if (!headerPart) {
        skipped++;
        continue;
      }

      const headers = headerPart.body || {};
      const subject =
        headers.subject?.[0] ||
        headers.Subject?.[0] ||
        "";

      if (!isRfpEmail(subject)) {
        skipped++;
        continue;
      }

      rfpMatched++;

      const rfpId = extractRfpId(subject);
      if (!rfpId) {
        await RfpEmailLog.create({
          subject,
          status: "INVALID_RFP",
          receivedAt: new Date(),
        });
        skipped++;
        continue;
      }

      const fullMessages = await connection.search(
        [["UID", item.attributes.uid]],
        { bodies: [""], struct: true, markSeen: false }
      );

      if (!fullMessages.length) {
        skipped++;
        continue;
      }

      const fullEmailPart = fullMessages[0].parts.find(p => p.which === "");
      if (!fullEmailPart) {
        skipped++;
        continue;
      }

      const parsed = await simpleParser(fullEmailPart.body);
      const vendorEmail = parsed.from?.value?.[0]?.address;
 console.log("📤 From vendor email:", vendorEmail);
      const vendor = await Vendor.findOne({ email: vendorEmail });
      if (!vendor) {
        await RfpEmailLog.create({
          subject,
          fromEmail: vendorEmail,
          rfpId,
          status: "UNKNOWN_VENDOR",
          receivedAt: new Date(),
        });
        skipped++;
        continue;
      }

      const proposal = await Proposal.create({
        rfpId,
        vendor: {
          id: vendor._id,
          name: vendor.name,
          email: vendor.email,
        },
        responseContent: {
          rawText: parsed.text || "",
          hasImages: parsed.attachments?.some(a =>
            a.contentType.startsWith("image")
          ),
          hasAttachments: parsed.attachments?.length > 0,
        },
        status: "RECEIVED",
      });

      proposalsCreated++;

      const uploadDir = path.join("uploads", "proposals", String(proposal._id));
      fs.mkdirSync(uploadDir, { recursive: true });

      for (const file of parsed.attachments || []) {
        fs.writeFileSync(
          path.join(uploadDir, file.filename),
          file.content
        );
      }

      await RfpEmailLog.create({
        subject,
        fromEmail: vendorEmail,
        rfpId,
        proposalId: proposal._id,
        status: "PROPOSAL_CREATED",
        receivedAt: new Date(),
      });

      parseProposalWithAI(proposal._id);
      await connection.addFlags(item.attributes.uid, ["\\Seen"]);
    }

    connection.end();
  console.log("✅ proposalsCreated:", proposalsCreated);
    return {
      totalUnread,
      rfpMatched,
      proposalsCreated,
      skipped,
    };
  } catch (err) {
    throw err;
  }
};





export const getRfpEmailLogs = async (req, res) => {
  try {
    const logs = await RfpEmailLog.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch RFP email history",
    });
  }
};
