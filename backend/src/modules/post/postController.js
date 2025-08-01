// backend/src/modules/post/postController.js
import {getAllPosts, getOnePost, createPost, getStarForUser, deletePost} from './postService.js';

class PostController {
    async getAll(req, res) {
        try {
            const { categoryId, sortBy } = req.query;
            const posts = await getAllPosts({ categoryId, sortBy });
            const result = posts.map(p => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                content: p.content,
                category: p.category,
                author: p.author,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                starsCount: p.stars.length,
                commentsCount: p.comments.length,
            }));
            res.json(result);
        } catch (err) {
            console.error('Error fetching posts:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // postController.js
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const p = await getOnePost(id);
            if (!p) return res.status(404).json({ message: 'Post not found' });

            let starred = false;
            // ⚡️ Стабильно: если есть req.user — ищем лайк, если нет — сразу false
            if (req.user && req.user.sub) {
                const star = await getStarForUser(id, req.user.sub);
                starred = !!star;
            }

            res.json({
                id: p.id,
                title: p.title,
                slug: p.slug,
                content: p.content,
                category: p.category,
                author: p.author,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                starsCount: p.stars.length,
                commentsCount: p.comments.length,
                comments: p.comments,
                starred, // <- всегда есть!
            });
        } catch (err) {
            console.error('Error fetching post:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    async create(req, res) {
        try {
            const post = await createPost(req.body);
            return res.status(201).json(post);
        } catch (error) {
            console.error('Error creating post:', error);
            return res.status(500).json({ message: error.message });
        }
    }

    // Пока просто 501 для заготовок:
    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, content, categoryId } = req.body;

            // Проверяем что пользователь залогинен
            if (!req.user || !req.user.sub) return res.status(403).json({ message: 'No permission' });

            // Проверяем, что пост принадлежит текущему пользователю
            const post = await getOnePost(id);
            if (!post) return res.status(404).json({ message: 'Post not found' });
            if (post.author.id !== req.user.sub) return res.status(403).json({ message: 'No permission' });

            // Обновляем пост
            const updated = await prisma.post.update({
                where: { id },
                data: { title, content, categoryId }
            });

            res.json(updated);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            // Только автор может удалить свой пост:
            if (!req.user || !req.user.sub) return res.status(403).json({ message: 'No permission' });

            // Проверяем, что пост существует и принадлежит этому пользователю
            const post = await getOnePost(id);
            if (!post) return res.status(404).json({ message: 'Post not found' });
            if (post.author.id !== req.user.sub) return res.status(403).json({ message: 'No permission' });

            // Удаляем пост
            await deletePost(id);

            res.status(204).end();
        } catch (error) {
            console.error('Error deleting post:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new PostController();
