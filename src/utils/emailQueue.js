import sendEmail from "../config/emailConfiguration.js";
import logger from "../config/logger.js";

const queue = [];
let isProcessing = false;

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 2000;

function enqueueEmail(recipient, subject, data, name) {
    queue.push({recipient, subject, data, name, retries: 0});
    logger.info(`Queued email for ${name}: ${recipient}`)

    processQueue();
};

async function processQueue() {
    if (isProcessing) return;
    isProcessing = true;

    while (queue.length > 0) {
        const job = queue.shift();

        try {
            await sendEmail(job.recipient, job.subject, job.data, job.name);
            logger.info(`Email sent to ${job.recipient}`);

        } catch (error) {
            logger.error(`Failed to send email to ${job.recipient}`, error.message);

            if (job.retries < MAX_RETRIES) {
                job.retries++;
                const delay = BASE_DELAY_MS * Math.pow(2, job.retries - 1);
                logger.info(`Retrying in ${delay / 1000}seconds (attempt ${job.retries})`);
                
                setTimeout(() => {
                    queue.push(job);
                    processQueue();
                }, delay);
            } else {
                logger.error(`Giving up on email to ${job.recipient} after ${MAX_RETRIES} attempts`);
            }
        }
    }

    isProcessing = false;
};

export default enqueueEmail;