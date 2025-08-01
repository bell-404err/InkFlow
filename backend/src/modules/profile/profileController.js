// controllers/profileController.js
import prisma from '../../db/prismaClient.js';

export const getMyPosts = async (req, res) => {
    const userId = req.user.sub; // Auth0 ID
    const posts = await prisma.post.findMany({
        where: { authorId: userId },
        include: {
            stars: true,
            author: true,
            category: true,
        },
        orderBy: { createdAt: 'desc' },
    });
    // Добавляем кол-во звезд
    const withStars = posts.map(post => ({
        ...post,
        starsCount: post.stars?.length || 0,
    }));
    res.json(withStars);
};

export const getStarredPosts = async (req, res) => {
    const userId = req.user.sub;
    // Сначала находим все postId, которые лайкнул пользователь
    const stars = await prisma.star.findMany({
        where: { userId },
        select: { postId: true }
    });
    const postIds = stars.map(s => s.postId);

    const posts = await prisma.post.findMany({
        where: { id: { in: postIds } },
        include: {
            stars: true,
            author: true,
            category: true,
        },
        orderBy: { createdAt: 'desc' },
    });
    const withStars = posts.map(post => ({
        ...post,
        starsCount: post.stars?.length || 0,
    }));
    res.json(withStars);
};
