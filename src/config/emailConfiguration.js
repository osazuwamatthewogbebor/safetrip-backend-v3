import APP_CONFIG from './APP_CONFIG.js';
import logger from './logger.js';
import Mailjet from 'node-mailjet';

function sendEmail(recipient, subject, data, name) {
  const mailjet = new Mailjet({
    apiKey: APP_CONFIG.MAILJET_API_KEY,
    apiSecret:APP_CONFIG.MAILJET_SECRET_KEY
  });

  logger.info(`Email server is sending email...`);

  const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: APP_CONFIG.EMAIL_SERVICE_USER,
                Name: "SafeTrip"
              },
              To: [
                {
                  Email: recipient,
                  Name: name
                }
              ],
              Subject: subject,
              HTMLPart: data
            }
          ]
        })

request
    .then((result) => {
        logger.info(result.body)
    })
    .catch((err) => {
        logger.error(err.statusCode)
    })
  
  
}

export default sendEmail;

