
import express from 'express';
import APP_CONFIG from './config/APP_CONFIG.js';
import logger from './config/logger.js';
import sequelize from './config/sequelize.js';
import apiLimiter from "./middleware/rateLimiter.js";
import cors from 'cors';
import routes from './routes.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import errorHandler from "./middleware/errorHandlers.js";
import { startSelfPing } from './utils/selfPing.js';
import enqueueEmail from './utils/emailQueue.js';
import { initTransporter } from './config/emailConfiguration.js';


dotenv.config();

const app = express();
const port = APP_CONFIG.PORT;

app.use(cookieParser());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("SafeTrip API is running...");
});


app.get("/test-email/:email", (req, res) => {
    const {email} = req.params;
    enqueueEmail(email, "Testing with endpoint", `<h3>Welcome to SafeTrip. May the force be with you!`);
    
    res.send("Test email sent. Check your spam as well")
})

// app.use("/api", apiLimiter);
app.use('/api', routes);

//route default
app.use((req, res, next) => {
    res.status(404).json({success: false, message:"Route does not exist"})
})

app.use(errorHandler)


sequelize.sync()
    .then(() => {
        logger.info('Database synchronized successfully');
    })
    .catch((error) => {
        console.error('Error synchronizing database:', error);
    });

app.listen(port, async () => {
    logger.info(`Server is running on port ${port}`);
    await initTransporter();
    startSelfPing();
;});



