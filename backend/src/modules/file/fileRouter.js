import express from 'express';
import FileController from './fileController.js';

const router = express.Router();

router.post('/upload', FileController.saveFile);

export default router;
