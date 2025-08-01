import prisma from '../../db/prismaClient.js';

export async function starPost(userId, postId) {
    const alreadyStarred = await prisma.star.findUnique({
        where: { userId_postId: { userId, postId } },
    });
    if (alreadyStarred) {
        return { success: false, message: 'Already starred' };
    }
    await prisma.star.create({ data: { userId, postId } });
    const starsCount = await prisma.star.count({ where: { postId } });
    return { success: true, starred: true, starsCount };
}

export async function unstarPost(userId, postId) {
    await prisma.star.deleteMany({ where: { userId, postId } });
    const starsCount = await prisma.star.count({ where: { postId } });
    return { success: true, starred: false, starsCount };
}
