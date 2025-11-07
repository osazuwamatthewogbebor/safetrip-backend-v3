import nodemailer from "nodemailer";
import { Resend } from "resend";
import APP_CONFIG from "./APP_CONFIG.js";
import logger from "./logger.js";
import AppError from "../utils/AppError.js";

let transporter;
let useResend = false;

// === Create transporter depending on environment ===
export async function initTransporter() {
  try {
    if (APP_CONFIG.NODE_ENV === "production") {
      // Use Resend in production
      useResend = true;
      logger.info("Using Resend email service for production.");
    } else {
      // Use local Gmail/Ethereal for development
      transporter = nodemailer.createTransport({
        host: APP_CONFIG.EMAIL_SERVICE_SMTP_HOST || "smtp.gmail.com",
        port: APP_CONFIG.EMAIL_SERVICE_PORT || 465,
        secure: APP_CONFIG.EMAIL_SERVICE_SMTP_SECURE ?? true,
        auth: {
          user: APP_CONFIG.EMAIL_SERVICE_USER,
          pass: APP_CONFIG.EMAIL_SERVICE_APP_PASSWORD,
        },
        logger: true,
        debug: true,
      });

      await transporter.verify();
      logger.info("Email transporter ready (SMTP).");
    }
  } catch (err) {
    logger.error(`Email transporter setup failed: ${err.message}`);
  }
}

// Run setup on startup
initTransporter();

const sendEmail = async (recipient, subject, data) => {
  if (useResend) {
    // Use Resend API instead of Nodemailer
    try {
      const resend = new Resend(APP_CONFIG.RESEND_API_KEY);

      const result = await resend.emails.send({
        from: `SafeTrip Safety App <${APP_CONFIG.RESEND_EMAIL || "noreply@safetrip.com"}>`,
        to: recipient,
        subject,
        html: data,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      logger.info(`Email sent via Resend: ${result.data?.id || "No ID"}`);
      return;
    } catch (err) {
      logger.error(`Resend send failed: ${err.message}`);
      throw new AppError("Failed to send email via Resend", 500);
    }
  }

  // === Fallback: SMTP (local/dev only)
  if (!transporter) {
    throw new AppError("Email transporter not initialized", 500);
  }

  const mailOptions = {
    from: `SafeTrip Safety App <${APP_CONFIG.EMAIL_SERVICE_USER}>`,
    to: recipient,
    subject,
    html: data,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    if (APP_CONFIG.NODE_ENV !== "production") {
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (err) {
    logger.error(`Email send failed: ${err.message}`);
    throw new AppError("Failed to send email", 500);
  }
};

export default sendEmail;
