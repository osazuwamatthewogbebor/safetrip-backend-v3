import logger from "../config/logger.js";

//express allows you to take four arguments while handling error.
export default function errorHandler(err, req, res, next){
    const statusCode = err.statusCode && !isNaN(err.statusCode) ? err.statusCode : 500;

    logger.error(err.stack);

    if (statusCode >= 500){
        logger.fatal({
            message: err.message,
            stack: err.stack,
            statusCode,
        });
    } else {
        logger.warn({
        message: err.message,
        statusCode,
        data: err.data || null
        });
    }

    res.status(statusCode).json ({
        success: false, 
        message: err.message || "Internal Server Error",
    }); 
}