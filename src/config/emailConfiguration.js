import logger from "./logger.js";
import sgMail from '@sendgrid/mail';
import APP_CONFIG from './APP_CONFIG.js';

async function sendEmail(recipient, subject, data, name) {
  sgMail.setApiKey(APP_CONFIG.SENDGRID_API_KEY);
  const msg = {
    to: {
      email: recipient,
      name
    }, 
    from: {
      email: APP_CONFIG.EMAIL_SERVICE_USER,
      name: "SafeTrip"
    },
    subject,
    html: data
  };

  (async () => {
    try {
      await sgMail.send(msg);
      logger.info(`Email sent successfully to ${name}: ${recipient}`)

    } catch (error) {
      logger.error(error);

      if (error.response) {
        logger.error(error.response.body)
      }
    }
  })();
}

export default sendEmail;