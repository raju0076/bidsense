export async function handleIncomingEmail(email) {
  console.log("--------------- NEW EMAIL ----------------");
  console.log("FROM:", email.from?.text);
  console.log("SUBJECT:", email.subject);
  console.log("TEXT:", email.text || "(No text)");
  console.log("ATTACHMENTS:", email.attachments?.length || 0);

  email.attachments?.forEach(file => {
    console.log(" -", file.filename, file.contentType);
  });

  console.log("------------------------------------------");
}
