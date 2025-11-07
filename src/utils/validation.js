import { body } from "express-validator";
import AppError from "./AppError.js";

const registrationValidator = [
    body("username").notEmpty().withMessage("Username is required")
    .isLength({min:3}).withMessage("Username must be at least three characters long"),

    body("email").notEmpty().withMessage("Email is required")
    .isEmail().withMessage("invalid email format"),
    //.bail(),
    
    body("password").notEmpty().withMessage("Password is required")
    .isLength({min:6}).withMessage("Password must be at least 6 characters"),

    //Confirm password must match password
    body("confirmPassword").notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, {req})=>{
        if (req.body.password && value !== req.body.password) {
            throw new AppError ("Password did not match", 400);
        }
        return true;
    }),
    
    body("phoneNumber").optional().isMobilePhone()
    .withMessage("Invalid phone number"),
    //.bail(),

    body("gender").notEmpty().withMessage("Gender is required")
    .isIn(["male", "female", "others"])
    .withMessage("Gender should be male, female or others"),
];

const loginValidator = [
    body("email").notEmpty()
    .withMessage("Invalid Email or Password")
    .isEmail()
    .withMessage("Invalid Email or Password")
    .bail(),
    body("password").notEmpty().withMessage("Invalid Email or Password")
    .isLength({min:6})
    .withMessage("Password must be at least 6 characters")
];


const changePasswordValidator = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Old password is required')
    .isLength({ min:6 })
    .withMessage("Old password must be at least 6 characters"),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new AppError('Confirm password does not match new password', 400);
      }
      return true;
    })
];


const forgotPasswordValidator = [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
];

const resetPasswordValidator = [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
    // body("otp")
    // .notEmpty().withMessage("OTP is required")
    // .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 characters"),
    body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
];

const verifyEmailValidation = [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
    body("otp")
    .notEmpty().withMessage("OTP is required")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 characters"),
]

export {
    loginValidator,
    registrationValidator,
    changePasswordValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    verifyEmailValidation
} 
