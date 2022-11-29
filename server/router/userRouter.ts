import express from 'express';
import { register, login, setAvator, getAllUser } from '../controllers/userController';
const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/setAvator', setAvator)

router.get('/alluser/:uid', getAllUser)

export default router