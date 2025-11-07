// export for all env credentials
import dotenv from 'dotenv';

dotenv.config();

 const APP_CONFIG =  {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT || 5000),

    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    DATABASE_DIALECT:process.env.DATABASE_DIALECT || "mysql",
    DATABASE_URL: process.env.DATABASE_URL,

    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN || 25200),
    JWT_OTP_SECRET: process.env.JWT_OTP_SECRET,
    VERIFICATION_TOKEN_EXPIRY_TIME: process.env.VERIFICATION_TOKEN_EXPIRY_TIME,

    EMAIL_SERVICE_SMTP_HOST: process.env.EMAIL_SERVICE_SMTP_HOST,
    EMAIL_SERVICE_USER: process.env.EMAIL_SERVICE_USER,
    EMAIL_SERVICE_APP_PASSWORD: process.env.EMAIL_SERVICE_APP_PASSWORD,
    EMAIL_SERVICE_PORT: Number(process.env.EMAIL_SERVICE_PORT || 465),
    EMAIL_SERVICE_SMTP_SECURE: process.env.EMAIL_SERVICE_SMTP_SECURE === "true",
    OTP_EXPIRY_TIME_MINS: Number(process.env.OTP_EXPIRY_TIME_MINS ) || 30,
    RESEND_EMAIL: process.env.RESEND_EMAIL || "onboarding@resend.dev",
    RESEND_API_KEY: process.env.RESEND_API_KEY,

    PINO_LOG_LEVEL_CONSOLE: process.env.PINO_LOG_LEVEL_CONSOLE,
    PINO_LOG_LEVEL_FILE: process.env.PINO_LOG_LEVEL_FILE,

    GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY,

    TYPICODE_BASE_URL: process.env.TYPICODE_BASE_URL || "https://jsonplaceholder.typicode.com",
    TYPICODE_BASE_API_KEY: process.env.TYPICODE_BASE_API_KEY || "",
    REDIS_TTL:Number(process.env.REDIS_TTL || 300),
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
};

export default APP_CONFIG;

