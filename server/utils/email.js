// utils/email.js

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // OR your SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
