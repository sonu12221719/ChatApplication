import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { sendMessage, getMessage, getAllChats } from '../controllers/messageController.js';

const router = express.Router();

router.get('/get/all', protect, getAllChats);
router.post('/send/:id',protect,sendMessage);
router.get('/get/:id',protect,getMessage);

export default router;

