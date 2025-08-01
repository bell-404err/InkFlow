import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const TEST_USER = process.env.SEED_TEST_USER_SUB || 'auth0|test-user';

export async function comments() {
    await prisma.comment.createMany({
        data: [
            { id: 'c1', content: 'Отличная статья!',           postId: 'post1', authorId: TEST_USER },
            { id: 'c2', content: 'Добавлю пару фактов…',       postId: 'post2', authorId: TEST_USER },
            { id: 'c3', content: 'Спасибо за дополнение!',     postId: 'post2', authorId: TEST_USER, parentId: 'c2' },
        ],
        skipDuplicates: true,
    });
}
