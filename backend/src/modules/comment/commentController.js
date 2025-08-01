import * as commentService from './commentService.js';

export const getByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await commentService.getCommentsByPost(postId);
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const create = async (req, res) => {
    try {
        const { content, postId, parentId } = req.body;
        const authorId = req.user.sub;
        const comment = await commentService.createComment({ content, postId, parentId, authorId });
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.sub;
        const result = await commentService.deleteComment(id, userId);
        res.json(result);
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
};
