import { Resend } from "resend";
import nodemailer from "nodemailer";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Fallback NodeMailer configuration
const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

export async function sendEmail({ to, subject, html }) {
  try {
    // Try sending with Resend first
    if (process.env.RESEND_API_KEY) {
      const data = await resend.emails.send({
        from: process.env.EMAIL_FROM || "no-reply@yourdomain.com",
        to,
        subject,
        html,
      });

      return { success: true, messageId: data.id };
    }

    // Fallback to NodeMailer if Resend is not configured
    const transporter = nodemailer.createTransport(smtpConfig);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "no-reply@yourdomain.com",
      to,
      subject,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);

    // Log the error but don't throw it to prevent breaking the main flow
    return {
      success: false,
      error: error.message,
    };
  }
}

// Email templates
export const emailTemplates = {
  welcome: (user) => ({
    subject: "Welcome to Our Platform",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Welcome ${user.name}! 👋</h1>
        <p style="color: #666; line-height: 1.6;">
          We're excited to have you on board. Your account has been created successfully.
        </p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Role:</strong> ${user.role}</p>
          <p style="margin: 10px 0 0;"><strong>Email:</strong> ${user.email}</p>
        </div>
        <p style="color: #666; line-height: 1.6;">
          If you have any questions, feel free to reach out to our support team.
        </p>
      </div>
    `,
  }),

  accountUpdate: (user) => {
    if (!user) {
      throw new Error("User data is required for email template");
    }

    return {
      subject: 'Account Updated',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Account Updated</h1>
          <p style="color: #666; line-height: 1.6;">
            Hi ${user.name || 'User'}, your account has been updated with the following details:
          </p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>New Role:</strong> ${user.role || 'N/A'}</p>
            <p style="margin: 10px 0 0;"><strong>Email:</strong> ${user.email || 'N/A'}</p>
          </div>
        </div>
      `,
    };
  },

  statusChange: (user) => ({
    subject: "Account Status Updated",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Account Status Changed</h1>
        <p style="color: #666; line-height: 1.6;">
          Hi ${user.name}, your account status has been updated.
        </p>
        <div style="background: ${
          user.active ? "#e8f5e9" : "#ffebee"
        }; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: ${user.active ? "#2e7d32" : "#c62828"};">
            Your account is now <strong>${
              user.active ? "ACTIVE" : "INACTIVE"
            }</strong>
          </p>
        </div>
      </div>
    `,
  }),

  accountDeletion: (user) => ({
    subject: "Account Deleted",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Account Deleted</h1>
        <p style="color: #666; line-height: 1.6;">
          Hi ${user.name}, your account has been deleted from our platform.
        </p>
        <div style="background: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #c62828;">
            All your data has been removed from our system.
          </p>
        </div>
        <p style="color: #666; line-height: 1.6;">
          If this was a mistake or you'd like to create a new account, please contact our support team.
        </p>
      </div>
    `,
  }),
};
