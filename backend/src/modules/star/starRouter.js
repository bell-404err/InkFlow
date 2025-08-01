import express from 'express';
import { starPost, unstarPost } from './starController.js'; // <-- обязательно .js!
import { checkAuth } from '../auth/authMiddleware.js';

const router = express.Router();

router.post('/star', checkAuth, starPost);
router.post('/unstar', checkAuth, unstarPost);

export default router;
