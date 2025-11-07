// Pino configuration
import pino, { destination } from 'pino';
import path from 'path';
import APP_CONFIG from './APP_CONFIG.js';

const __dirname = import.meta.dirname;
const logPath = path.join(__dirname, '../..', 'logs', 'app.log');
const isProd = APP_CONFIG.NODE_ENV === "production";

const transport = pino.transport({
    targets: [{
        level: APP_CONFIG.PINO_LOG_LEVEL_FILE || 'trace',
        target: 'pino-roll',
        options: {  
            file: logPath,
            mkdir: true,
            symlink: false,
            size: '5m',
            frequency: 'daily',
            limit: { count: 5, removeOldFiles: true },
            dateFormat: 'yyyy-MM-dd',
            colorize: true,
        },
        
    }, isProd
    ? {}:{
        level: APP_CONFIG.PINO_LOG_LEVEL_CONSOLE || 'info',
        target: 'pino-pretty',
        options: { colorize: true },
    }],
})


const logger = pino(
    {timestamp: pino.stdTimeFunctions.isoTime},
    transport
);

export default logger;