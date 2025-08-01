// scripts/seedUsersAndCategories.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const usersData = [
    { id: 'auth0|dev-user-1', name: 'Alice Johnson' },
    { id: 'auth0|dev-user-2', name: 'Bob Smith' },
    { id: 'auth0|dev-user-3', name: 'Charlie White' },
    { id: 'auth0|dev-user-4', name: 'Diana Green' },
    { id: 'auth0|dev-user-5', name: 'Ethan Brown' },
];

export const categoriesData = [
    { id: 'gaming', name: 'Gaming', description: 'Video games and industry news.' },
    { id: 'history', name: 'History', description: 'Historical facts and analysis.' },
    { id: 'tech', name: 'Tech', description: 'Technology and gadgets.' },
    { id: 'books', name: 'Books', description: 'Book reviews and recommendations.' },
    { id: 'movies', name: 'Movies', description: 'Movies, actors, and directors.' },
    { id: 'art', name: 'Art', description: 'Fine arts and digital art.' },
    { id: 'music', name: 'Music', description: 'Music trends, reviews, and artists.' },
    { id: 'science', name: 'Science', description: 'Discoveries and research.' },
    { id: 'travel', name: 'Travel', description: 'Destinations and travel guides.' },
    { id: 'life', name: 'Life', description: 'Lifestyle, stories, and more.' },
];

export async function seedUsersAndCategories() {
    for (const user of usersData) {
        await prisma.user.upsert({
            where: { id: user.id },
            update: {},
            create: user,
        });
    }
    await prisma.category.createMany({
        data: categoriesData,
        skipDuplicates: true,
    });
    console.log('Seeded users and categories!');
}

seedUsersAndCategories().finally(() => prisma.$disconnect());
