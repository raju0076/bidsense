import dotenv from "dotenv"
dotenv.config()

export const imapConfig = {
  imap: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    authTimeout: 10000,
    tlsOptions: {
      rejectUnauthorized: false
    }
  }
};
