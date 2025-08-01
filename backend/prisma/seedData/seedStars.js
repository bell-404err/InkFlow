import { PrismaClient } from '@prisma/client';
import { usersData } from './userAndCategories.js';
const prisma = new PrismaClient();

export async function seedStars() {
    const dbPostIds = (await prisma.post.findMany({ select: { id: true } })).map(p => p.id);
    let id = 1;
    for (let user of usersData) {
        for (let postId of dbPostIds) {
            if (Math.random() < 0.2) {
                await prisma.star.create({
                    data: {
                        id: `star-${id++}`,
                        userId: user.id,
                        postId,
                    }
                });
            }
        }
    }
    console.log("Seeded stars (likes)!");
}

seedStars().finally(() => prisma.$disconnect());
