import express from 'express';
import { getAllPosts, createPost, deletePost } from '../controllers/postController.js';
import { checkAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllPosts);
router.post('/', checkAuth, createPost);
router.delete('/:id', checkAuth, deletePost);

router.get('/test-protected', checkAuth, (req, res) => {
    res.json({ message: `Valid token. User: ${req.user.sub}` });
});

export default router;