import prisma from '../../db/prismaClient.js';

export const getAllCategories = async () => {
    return prisma.category.findMany({
        orderBy: { createdAt: 'asc' },
        select: {
            id: true,
            name: true,
            description: true,
        },
    });
};
