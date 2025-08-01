import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function categories() {
    await prisma.category.createMany({
        data: [
            { id: 'gaming', name: 'Gaming',   description: 'All about video games' },
            { id: 'history', name: 'History', description: 'Historical articles' },
            { id: 'tech',    name: 'Tech',    description: 'Latest in technology' },
        ],
        skipDuplicates: true,
    });
}
