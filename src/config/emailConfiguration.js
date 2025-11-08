import APP_CONFIG from './APP_CONFIG.js';
import logger from './logger.js';
import Mailjet from 'node-mailjet';

function sendEmail(recipient, subject, data, name) {
  const mailjet = new Mailjet({
    apiKey: APP_CONFIG.MAILJET_API_KEY,
    apiSecret:APP_CONFIG.MAILJET_SECRET_KEY
  });

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
              TextPart: "Checking the diff",
              HTMLPart: "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
            }
          ]
        })

request
    .then((result) => {
        console.log(result.body)
    })
    .catch((err) => {
        console.log(err.statusCode)
    })
  
  
}

// sendEmail("easydatabundle@gmail.com", "Testing", "hello", "Osas")

export default sendEmail;





// import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';

// const transactionalEmailsApi = new TransactionalEmailsApi();
// transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, APP_CONFIG.BREVO_API_KEY);

// async function sendEmail(recipient, subject, data, name) {
//   try {
//     const result = await transactionalEmailsApi.sendTransacEmail({
//       to: [
//         { email: recipient, name },
//       ],
//       subject,
//       htmlContent: data,
//       textContent: 'This is a transactional email sent using the Brevo SDK.',
//       sender: { email: APP_CONFIG.EMAIL_SERVICE_USER, name: 'SafeTrip' },
//     });
//     logger.info('Email sent! Message ID:', result.body.messageId);
//   } catch (error) {
//     console.error('Failed to send email:', error);
//   }
// }

// sendEmail("easydatabundle", "testing email", "<h2>hello</h2>", "Osas"); 

// export default sendEmail;
