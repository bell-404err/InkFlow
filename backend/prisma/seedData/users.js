import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const TEST_USER = process.env.SEED_TEST_USER_SUB || 'auth0|test-user';

export async function users() {
    await prisma.user.upsert({
        where: { id: TEST_USER },
        create: {
            id: TEST_USER,
            name: 'Dev User',
        },
        update: {},
    });
}