import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  // Configure your email service here
  // Example for Gmail:
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendPitchStatusEmail(to, status, feedback, pitchTitle) {
  const statusMessages = {
    active: "has been approved",
    rejected: "has been rejected",
    under_review: "is under review",
    archived: "has been archived",
  };

  const emailContent = `
    <h2>Pitch Status Update</h2>
    <p>Your pitch "${pitchTitle}" ${
    statusMessages[status] || "has been updated"
  }.</p>
    ${feedback ? `<p><strong>Feedback:</strong> ${feedback}</p>` : ""}
    <p>You can view your pitch status in your dashboard.</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Pitch Status Update - ${pitchTitle}`,
      html: emailContent,
    });
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
}
