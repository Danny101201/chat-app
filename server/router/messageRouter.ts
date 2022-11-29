import express from 'express';
import { addMessage, getAllMessage } from '../controllers/messageController';
const router = express.Router();

router.post('/getAllMessage', getAllMessage)
router.post('/addMessage', addMessage)

export default router