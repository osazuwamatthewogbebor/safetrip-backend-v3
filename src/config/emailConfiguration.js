import nodemailer from "nodemailer";
import APP_CONFIG from "./APP_CONFIG.js";
import logger from "./logger.js";
import AppError from "../utils/AppError.js";


let transporter;


export async function initTransporter() {
  transporter = nodemailer.createTransport({
    host: APP_CONFIG.EMAIL_SERVICE_SMTP_HOST, 
    port: APP_CONFIG.EMAIL_SERVICE_PORT || 587,
    secure: APP_CONFIG.EMAIL_SERVICE_PORT === 465,
    auth: {
      user: "apikey",
      pass: APP_CONFIG.SENDGRID_API_KEY,
    },
  });

  try {
    await transporter.verify();
    logger.info('Email transporter verified and ready to send messages.');
  } catch (err) {
    logger.error('Email transporter verification failed:', err.message);
  }

}

async function sendEmail(recipient, subject, data, name) {

  if (!transporter) {
    throw new AppError("Email transporter not initialised", 500);
  };
  
  const mailOptions = {
    from: `"SafeTrip" <${APP_CONFIG.EMAIL_SERVICE_USER}>`,
    to: {
      name,
      address: recipient
    },
    subject,
    html: data
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${recipient}!`,info.message, );
  } catch (err) {
    logger.error(`Email send failed: ${err.message}`);
    throw new AppError("Failed to send email", 500);
  };

};

export default sendEmail;