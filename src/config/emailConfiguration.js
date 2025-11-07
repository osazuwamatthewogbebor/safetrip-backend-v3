import nodemailer from "nodemailer";
import APP_CONFIG from "./APP_CONFIG.js";
import logger from "./logger.js";
import AppError from "../utils/AppError.js";

let transporter;

// === Create transporter depending on environment ===
async function initTransporter() {
  try {
    if (APP_CONFIG.NODE_ENV === "production") {
      transporter = nodemailer.createTransport({
        host: APP_CONFIG.EMAIL_SERVICE_SMTP_HOST || "smtp.gmail.com",
        port: APP_CONFIG.EMAIL_SERVICE_PORT || 465,
        secure: APP_CONFIG.EMAIL_SERVICE_SMTP_SECURE ?? true,
        auth: {
          user: APP_CONFIG.EMAIL_SERVICE_USER,
          pass: APP_CONFIG.EMAIL_SERVICE_APP_PASSWORD,
        },
      });
    } else {
      // Use Ethereal for local testing
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      logger.info(`Ethereal test account: ${testAccount.user}`);
    }

    await transporter.verify();
    logger.info("Email transporter ready.");
  } catch (err) {
    logger.error(`Email transporter setup failed: ${err.message}`);
  }
}

// Run setup on startup
initTransporter();

const sendEmail = async (recipient, subject, data) => {
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