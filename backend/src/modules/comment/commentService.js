import prisma from '../../db/prismaClient.js';

export const getCommentsByPost = async (postId) => {
    return prisma.comment.findMany({
        where: { postId },
        include: {
            author: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'asc' }
    });
};

export const createComment = async ({ content, postId, parentId, authorId }) => {
    return prisma.comment.create({
        data: {
            content,
            post:   { connect: { id: postId } },
            author: { connect: { id: authorId } },
            parent: parentId ? { connect: { id: parentId } } : undefined,
        },
        include: {
            author: { select: { id: true, name: true } }
        }
    });
};


// Рекурсивно собирает все id дочерних комментариев
async function getAllChildCommentIds(parentId) {
    const children = await prisma.comment.findMany({
        where: { parentId },
        select: { id: true }
    });
    let ids = children.map(c => c.id);

    for (let child of children) {
        const subIds = await getAllChildCommentIds(child.id);
        ids = ids.concat(subIds);
    }
    return ids;
}

export const deleteComment = async (id, userId) => {
    // 1. Проверка что комментарий существует и userId — автор
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new Error('Комментарий не найден');
    if (comment.authorId !== userId) throw new Error('Нет прав для удаления');

    // 2. Находим все вложенные комментарии (любых авторов)
    const allChildIds = await getAllChildCommentIds(id);

    // 3. Удаляем всех потомков (если есть)
    if (allChildIds.length > 0) {
        await prisma.comment.deleteMany({ where: { id: { in: allChildIds } } });
    }
    // 4. Удаляем сам комментарий
    await prisma.comment.delete({ where: { id } });
    return { success: true, deleted: [id, ...allChildIds] };
};

