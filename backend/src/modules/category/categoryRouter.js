import express from 'express';
import CategoryController from './categoryController.js';

const router = express.Router();

// GET /api/categories — все доступные категории
router.get('/categories', CategoryController.getAll);

export default router;
