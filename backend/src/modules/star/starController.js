import * as starService from './starService.js';

export const starPost = async (req, res) => {
    try {
        const userId = req.user.sub;
        const { postId } = req.body;
        if (!postId) return res.status(400).json({ error: 'postId required' });

        const result = await starService.starPost(userId, postId);
        res.json(result);
    } catch (err) {
        console.error('Error in starPost:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const unstarPost = async (req, res) => {
    try {
        const userId = req.user.sub;
        const { postId } = req.body;
        if (!postId) return res.status(400).json({ error: 'postId required' });

        const result = await starService.unstarPost(userId, postId);
        res.json(result);
    } catch (err) {
        console.error('Error in unstarPost:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
