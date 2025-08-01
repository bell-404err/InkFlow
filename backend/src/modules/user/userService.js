import prisma from '../../db/prismaClient.js';

export const ensureUserExists = async (id, name) => {
    const existingUser = await prisma.user.findUnique({
        where: { id },
    });

    if (!existingUser) {
        await prisma.user.create({
            data: {
                id,
                name,
            },
        });
    }
};
