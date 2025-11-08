import express from 'express';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import sosRoutes from './routes/sosRoutes.js';
import tipRoutes from './routes/tipRoutes.js';
import checkinRoutes from './routes/checkinRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';
import helpRoutes from './routes/helpRoutes.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import adminRoutes from './routes/adminRoutes.js'


const router = express.Router();


router.use('/auth', authRoutes);
router.use('/contacts', authMiddleware, contactRoutes);
router.use('/sos',authMiddleware, sosRoutes);
router.use('/checkins',authMiddleware, checkinRoutes);
router.use('/timeline',authMiddleware, timelineRoutes);
router.use('/help',authMiddleware, helpRoutes);
router.use("/tips",authMiddleware, tipRoutes);
router.use('/admin',authMiddleware, adminRoutes)


export default router;
