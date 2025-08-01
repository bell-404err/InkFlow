import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const TEST_USER = process.env.SEED_TEST_USER_SUB || 'auth0|test-user';

export async function stars() {
    await prisma.star.createMany({
        data: [
            { id: 's1', userId: TEST_USER, postId: 'post2' },
            { id: 's2', userId: TEST_USER, postId: 'post1' },
        ],
        skipDuplicates: true,
    });
}
