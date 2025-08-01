import express from 'express';
import * as commentController from './commentController.js';
import { checkAuth } from '../auth/authMiddleware.js';

const router = express.Router();

// Получить все комментарии к посту
router.get('/get/:postId', commentController.getByPost);

// Добавить комментарий (только авторизованным)
router.post('/create/:postId', checkAuth, commentController.create);

// Удалить комментарий (только авторизованным)
router.delete('/delete/:id', checkAuth, commentController.remove);

export default router;
