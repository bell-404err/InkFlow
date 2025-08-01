import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Подставьте сюда ваш тестовый Auth0 sub, если нужно:
const TEST_USER = process.env.SEED_TEST_USER_SUB || 'auth0|test-user';

export async function posts() {
    await prisma.post.createMany({
        data: [
            {
                id: 'post1',
                title: 'Первый пост о гейминге',
                slug: 'pervyj-post-o-gejminge',
                content: { blocks: [{ type: 'paragraph', data: { text: 'Hello gaming world!' } }] },
                categoryId: 'gaming',
                authorId: TEST_USER,
            },
            {
                id: 'post2',
                title: 'История Второй мировой',
                slug: 'istoriya-vtoroj-mirovoj',
                content: { blocks: [{ type: 'paragraph', data: { text: 'WWII overview...' } }] },
                categoryId: 'history',
                authorId: TEST_USER,
            },
            {
                id: 'post3',
                title: 'Обзор нового смартфона',
                slug: 'obzor-novogo-smartfona',
                content: { blocks: [{ type: 'paragraph', data: { text: 'Specs and features.' } }] },
                categoryId: 'tech',
                authorId: TEST_USER,
            },
        ],
        skipDuplicates: true,
    });
}
