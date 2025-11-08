import sendEmail from "../config/emailConfiguration.js"
import ejs from 'ejs';
import path from 'path';
import logger from "../config/logger.js";
import enqueueEmail from "../utils/emailQueue.js";


const __dirname = import.meta.dirname;

const sendOtp = async (recipient, subject='Verify Your Account', username, otp, otpTime) => {
    try {
        const templatePath = path.join(__dirname, '../..', 'views', 'verifyOtp.ejs');
        console.log(templatePath);
        
        const htmlData = await ejs.renderFile(templatePath, {user: username, otp: otp, otpTimeMins: otpTime});
        
        // queue email
        enqueueEmail(recipient, subject, htmlData, username);

        logger.info(`Otp sent to ${username} successfully.`);
    } catch (error) {
        logger.error(`Error sending Otp: ${error}`)
    };
};

const sendWelcomeEmail = async (recipient, subject='Welcome to Safe Trip App!', username) => {
    try {
        const templatePath = path.join(__dirname, '../..', 'views', 'welcomeMessage.ejs');
        console.log(templatePath);
        
        const htmlData = await ejs.renderFile(templatePath, {user: username});
        
        // queue email
        enqueueEmail(recipient, subject, htmlData, username);

        logger.info(`Welcome email sent to ${username} successfully.`);
    } catch (error) {
        logger.error(`Error sending welcome message: ${error}`)
    };
};

const sendPasswordRecoveryEmail = async (recipient, subject='Password Reset Request', username, otp, otpTimeMins) => {
    try {
        const templatePath = path.join(__dirname, '../..', 'views', 'passwordRecovery.ejs');
        console.log(templatePath);
        
        const htmlData = await ejs.renderFile(templatePath, {user: username, otp, otpTimeMins});
        
        // queue email
        enqueueEmail(recipient, subject, htmlData, username);

        logger.info(`Password reset link sent to ${username} successfully.`);
    } catch (error) {
        logger.error(`Error sending password reset link: ${error}`)
    };
};

export default {
    sendOtp,
    sendWelcomeEmail,
    sendPasswordRecoveryEmail,
};
