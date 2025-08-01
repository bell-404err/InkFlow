import { PrismaClient } from '@prisma/client';
import { usersData } from './userAndCategories.js';
const prisma = new PrismaClient();

const demoComments = [
    "Great post! Very insightful.",
    "Thanks for sharing this info.",
    "Can you tell more about this?",
    "Awesome, I learned something new.",
    "What do you think about ...?",
    "Looking forward to more posts like this!",
];

import { randomUUID } from 'crypto';

export async function seedComments() {
    await prisma.comment.deleteMany({}); // Очистка для чистого теста

    const dbPostIds = (await prisma.post.findMany({ select: { id: true } })).map(p => p.id);
    const dbUserIds = (await prisma.user.findMany({ select: { id: true } })).map(u => u.id);

    for (let postId of dbPostIds) {
        // 3 комментария от случайных пользователей
        for (let i = 0; i < 3; ++i) {
            const authorId = dbUserIds[Math.floor(Math.random() * dbUserIds.length)];
            const comment = await prisma.comment.create({
                data: {
                    id: randomUUID(), // уникальный id
                    content: demoComments[Math.floor(Math.random() * demoComments.length)],
                    postId,
                    authorId,
                }
            });

            // 50% комментариев имеют ответ (каскад)
            if (Math.random() < 0.5) {
                const replyAuthorId = dbUserIds[Math.floor(Math.random() * dbUserIds.length)];
                await prisma.comment.create({
                    data: {
                        id: randomUUID(),
                        content: "Reply: " + demoComments[Math.floor(Math.random() * demoComments.length)],
                        postId,
                        authorId: replyAuthorId,
                        parentId: comment.id,
                    }
                });
            }
        }
    }
    console.log("Seeded comments!");
}

seedComments().finally(() => prisma.$disconnect());
