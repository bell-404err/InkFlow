import express from 'express';

import PostController from './postController.js';
import {checkAuth, checkAuthOptional} from '../auth/authMiddleware.js';

const router = express.Router();

router.get('/posts', PostController.getAll);
router.get('/posts/:id', checkAuthOptional, PostController.getOne);
router.post('/posts', checkAuth, PostController.create);
router.put('/posts/:id', checkAuth, PostController.update);
router.delete('/posts/:id', checkAuth, PostController.delete);


router.get('/test-protected', checkAuth, (req, res) => {
    res.json({message: `Valid token. User: ${req.user.sub}`});
});

export default router;