import express from "express";
import { fetchUnreadEmails, sendEmail } from "../controllers/email.controller.js";


const EmailRouter = express.Router()

EmailRouter.post("/send-mail/:id",sendEmail)
EmailRouter.post('/fetch-emails', fetchUnreadEmails)

export default EmailRouter;