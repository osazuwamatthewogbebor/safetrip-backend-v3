import { Op } from "sequelize";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import authHandler from "../utils/authHandler.js"
import bcrypt from "bcryptjs";


//for this services we need to check if users exists
async function createUser (userData) {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [
        { email: userData.email.toLowerCase() },
        { username: userData.username.toLowerCase() },
        { phoneNumber: userData.phoneNumber },
      ],
    },
  });

  if (existingUser) {
    throw new AppError("A user with this email, username or phone number already exists", 400);
  };

  
  const newUser = await User.create(userData);
    
  return newUser;
};


// Verify user OTP
async function verifyUser(email, otp) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new AppError("User account not found", 400);
  
  if (!user.otp || !user.otpTime) throw new AppError("OTP already used or missin", 400);
  
  if (user.otp !== otp) throw new AppError("Invalid OTP", 400);
  
  const otpExpiry = new Date(user.otpTime);
  if (isNaN(otpExpiry.getTime()) || otpExpiry.getTime() < Date.now()) {
    throw new AppError("Expired OTP", 400);
  };
  
  user.verified = true;
  user.otp = null;
  user.otpTime = null;

  await user.save();

  return user;
};


// Resend otp - for resend cases
async function resendOtpService(id, otp, otpTime) {
  const user = await User.findByPk( id );
  if (!user) return null;

  user.otp = otp;
  user.otpTime = otpTime;

  await user.save();

  return user;
};


async function loginUser(loginCrendentials) {
  const user = await User.findOne({where:
   { email:loginCrendentials.email }
  });
  if (!user) throw new AppError("Invalid Email or Password")

  //Check to see if password is valid
  const isMatch = await user.verifyPassword(loginCrendentials.password)
  if (!isMatch) throw new AppError("Invalid Email or Password")

  //manual way to bring in your jsonwebtoken
  const token = await authHandler.createtoken(user);
  const refreshToken = await authHandler.createRefreshToken(user, token);
  return {
      message: "Login successful",
      userUUID: user.user_UUID, 
      email: user.email, username:
      user.username, phone: user.phoneNumber || null,
      profilePicture: user.profilePicture || null, gender: user.gender,
      role: user.role, 
      token,
      refreshToken,
      }
};


async function refreshUserToken(refreshToken){
    const decoded = await authHandler.verifyRefreshToken(refreshToken)
    const user = await User.findOne({where: {user_UUID: decoded.id}});
    if(!user) throw new Error("User not found")
        
    const newToken = await authHandler.generatetoken(user);
    const newRefreshToken = await authHandler.generateRefreshToken(user, newToken)

    return{
        token: newToken,
        refreshToken: newRefreshToken,
    };
}


async function forgotPasswordService(email, otp, otptime){
  const user = await User.findOne({ where: { email } });
  if (!user) throw new AppError("User not found", 400);
  
  user.otp = otp;
  user.otpTime = otptime;
  
  await user.save();
  
  return user;
};


// Reset password using OTP
async function resetPasswordService(email, newPassword) {
  const user = await User.findOne({ where: { email } });

  
  
  // if (!user) throw new AppError("User account not found", 400);
  
  // if (!user.otp || !user.otpTime) throw new AppError("OTP already used", 400);
  
  // if (user.otp !== otp) throw new AppError("Invalid OTP", 400);
  
  // if (user.otpTime < new Date()) throw new AppError("Expired OTP", 400);

  const hashed = await bcrypt.hash(newPassword, 10);
  
  user.password = hashed;
  // user.otp = null;
  // user.otpTime = null;

  await user.save();
  return user;
};


async function changePassword (userId, oldPassword, newPassword) {
  const user = await User.findOne({where: {user_UUID: userId}});
  if (!user) throw new AppError('User not found', 400);

  // Check old password
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new AppError('Old password is incorrect', 400);

  // Hash and save new password
  const hashedNew = await bcrypt.hash(newPassword, 10);
  user.password = hashedNew;
  await user.save();

  return { message: 'Password changed successfully' };
};


//Note getuserprofile is a protected route and that brings us to caching $ middleware
async function getUserProfile(userUUID){
    const user = await User.findOne({where: {user_UUID: userUUID}})
    if(!user) throw new Error("User not found");
    delete user.password//before sending user profile to frontend, ensure you delete thier password
    return user;
}

export {
    createUser, 
    verifyUser,
    resendOtpService,
    loginUser,
    getUserProfile,
    refreshUserToken,
    forgotPasswordService,
    resetPasswordService,
    changePassword
};
