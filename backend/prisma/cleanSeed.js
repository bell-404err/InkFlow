import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clean() {
    await prisma.star.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();
    console.log("Database cleaned!");
}

clean().finally(() => prisma.$disconnect());
