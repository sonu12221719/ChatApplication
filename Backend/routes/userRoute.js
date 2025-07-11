import express from 'express';
import { getUserByEmailOrName, getUserById, loginUser, logoutUser, registerNewUser } from '../controllers/userController.js';
import {protect} from '../middleware/authMiddleware.js'
const router = express.Router();

// Route to register a new user
router.post('/register', registerNewUser);
router.post('/login', loginUser);
router.get('/user/:id', protect, getUserById);
router.get('/search', protect, getUserByEmailOrName);
router.post('/logout', logoutUser);

export default router;