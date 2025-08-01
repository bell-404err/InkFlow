import prisma from '../../db/prismaClient.js';
import slugify from 'slugify';
import { ensureUserExists } from '../user/userService.js';

export const createPost = async ({ title, content, categoryId, authorId, userName }) => {
    if (!title || !content || !categoryId || !authorId || !userName) {
        throw new Error('Missing required fields');
    }
    await ensureUserExists(authorId, userName);

    const slug = slugify(title, { lower: true, strict: true, trim: true });
    return prisma.post.create({
        data: {
            title,
            content,
            slug,
            category: { connect: { id: categoryId } },
            author:   { connect: { id: authorId } },
        },
    });
};

export const getAllPosts = async ({ categoryId, sortBy } = {}) => {
    const orderBy =
        sortBy === 'oldest'
            ? { createdAt: 'asc' }
            : sortBy === 'top'
                ? { stars: { _count: 'desc' } }
                : { createdAt: 'desc' };

    return prisma.post.findMany({
        where: categoryId ? { categoryId } : {},
        orderBy,
        include: {
            author:   { select: { id: true, name: true } },
            category: { select: { id: true, name: true } },
            comments: true,
            stars:    true,
        },
    });
};

export const getOnePost = async (id) => {
    return prisma.post.findUnique({
        where: { id },
        include: {
            author:   { select: { id: true, name: true } },
            category: { select: { id: true, name: true } },
            comments: true,
            stars:    true,
        },
    });
};

export const getStarForUser = async (postId, userId) => {
    if (!postId || !userId) return null;
    return prisma.star.findUnique({
        where: { userId_postId: { userId, postId } },
    });
};

export const deletePost = async (id) => {
    return prisma.post.delete({
        where: { id }
    });
};
