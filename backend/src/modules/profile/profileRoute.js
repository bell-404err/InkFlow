// routes/profile.js
import express from 'express';
import { getMyPosts, getStarredPosts } from './profileController.js';
import { checkAuth } from '../auth/authMiddleware.js';

const router = express.Router();

router.get('/profile/posts', checkAuth, getMyPosts);
router.get('/profile/starred', checkAuth, getStarredPosts);

export default router;
