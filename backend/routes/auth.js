const express = require('express');
const { getProfile } = require('../controllers/authController');
const { checkAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', checkAuth, getProfile); // Получить профиль авторизованного пользователя

module.exports = router;
