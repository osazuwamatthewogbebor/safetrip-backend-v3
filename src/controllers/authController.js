import AppError from "../utils/AppError.js"
import  {
  createUser, 
  verifyUser,
  resendOtpService,
  forgotPasswordService, 
  resetPasswordService,
  loginUser, 
  changePassword,
} from "../services/userServices.js";
import { getOtp, getOtpExpiryTime } from "../utils/otpGen.js";
import APP_CONFIG from "../config/APP_CONFIG.js";
import logger from "../config/logger.js";
import emailService from "../services/emailService.js";
import authHandler from "../utils/authHandler.js";


async function registerUser (req, res){
  try {
      const {username, email, password, phoneNumber, gender, role = "user"} = req.body;
      
      const otp = getOtp();
      const otpTimeMins = APP_CONFIG.OTP_EXPIRY_TIME_MINS;
      const otpTime = getOtpExpiryTime(otpTimeMins);

      const user = await createUser({username, email, password, gender, phoneNumber: String(phoneNumber), role, otp, otpTime});

      await emailService.sendOtp(user.email, "Verify your account", user.username, otp, otpTimeMins);
      
      const token = await authHandler.createOTPtoken(user);

      res.status(201).json({Success: true, message:"Verification email sent to your inbox. Check your inbox, promotions and spam folders.", token})
      
    } catch (error) {
      logger.error("Registration Error:", error);
      throw new AppError(error || "Registration Failed")
    }
};

// Verify OTP
async function verifyEmail (req, res) {
  try {
    const { email, otp } = req.body;
    const user = await verifyUser(email, String(otp));

    if (!user) return res.status(400).json({ error: "User account not found" });
    if (user === "missing") return res.status(400).json({ error: "OTP already used or missing" });
    if (user === "invalid") return res.status(400).json({ error: "Invalid OTP" });
    if (user === "expired") return res.status(400).json({ error: "OTP Expired" });

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, 'Welcome to Safe Trip!', user.username);
    
    res.status(200).json({ message: "Account verification was successful" });

  } catch (error) {
    logger.error(error.message);
    throw new AppError(error.nessage, 500);
  };
};


// Resend otp
async function resendOtp(req, res) {
  const id = req.user.id;
  
  const otp = getOtp();
  const otpTimeMins = APP_CONFIG.OTP_EXPIRY_TIME_MINS;
  const otpTime = getOtpExpiryTime(otpTimeMins);

  const user = await resendOtpService(id, otp, otpTime);
  if (!user) return res.status(401).send("You are not registered yet! Go to the sign up page!");

  // Send otp email
  try {
    await emailService.sendOtp(user.email, "Your OTP Verification Code", user.name, otp, otpTimeMins);
  } catch (error) {
    logger.error(error.message);
    throw new AppError(error.nessage, 500);
  };

   res.status(201).json({ message: "OTP sent to your email. Check your inbox, promotions and spam folders." });
};


async function login (req, res){
    const {email, password} = req.body
    try {
        const user = await loginUser({email, password});
        res.status(200).json({Success: true, data: user});
    } catch (error) {
        throw new AppError(error || "Invalid Email or Password", 401)
    }
};



async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    // Generate OTP
    const otp = getOtp(); 
    const otpTimeMins = APP_CONFIG.OTP_EXPIRY_TIME_MINS;
    const otptime = getOtpExpiryTime(otpTimeMins);
    
    const user = await forgotPasswordService(email, otp, otptime);
    if (!user) {
      return res.send("If this email is registered, a password reset link will be sent. Check your inbox, promotions and spam folders.")   
    };

    await emailService.sendPasswordRecoveryEmail(user.email, "Password Reset Request", user.username, otp, otpTimeMins)

    res.status(200).json({ success: true, message: "Check your email. If this email is registered, a password reset email will be sent. Check your inbox, promotions and spam folders." });
  } catch (err) {
    next(err);
  }
};


// Reset password using OTP
async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await resetPasswordService(email, String(otp), newPassword);

    if (!user) return res.status(400).json({ error: "User account not found" });
    if (user === "missing") return res.status(400).json({ error: "OTP already used or missing" });
    if (user === "invalid") return res.status(400).json({ error: "Invalid OTP" });
    if (user === "expired") return res.status(400).json({ error: "OTP Expired" });
    
    res.status(201).json({message: "Password reset was successful."});

  } catch (error) {
    res.status(400).send(error.message);
  }
};


async function changePasswordController(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    await changePassword(userId, oldPassword, newPassword);

    res.status(201).json({
      success: true,
      message: 'Password changed successfully',
      user: {
        id: req.user.id, 
        username: req.user.username,
        role: req.user.role
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// Logout
// Clear tokens from frontend (for advanced systems, token blacklisting can be used)

async function logoutController(req, res) {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully. Please clear your token on the client.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
      error: err.message,
    });
  }
};


export {
    registerUser,
    verifyEmail,
    resendOtp,
    forgotPassword,
    resetPassword,
    login,
    changePasswordController,
    logoutController,
};
