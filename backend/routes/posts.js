const express = require('express');
const { getAllPosts, createPost, deletePost } = require('../controllers/postController');
const { checkAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllPosts);
router.post('/', checkAuth, createPost);
router.delete('/:id', checkAuth, deletePost);

module.exports = router;
