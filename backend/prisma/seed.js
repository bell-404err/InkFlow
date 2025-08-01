import {PrismaClient} from '@prisma/client';
import {users} from './seedData/users.js';
import {categories} from './seedData/categories.js';
import {posts} from './seedData/posts.js';
import {comments} from './seedData/comments.js';
import {stars} from './seedData/stars.js';
import {seedStars} from './seedData/seedStars.js';
import {seedUsersAndCategories} from './seedData/userAndCategories.js';
import {seedComments} from './seedData/seedComments.js';
import {seedPosts} from './seedData/demoPosts.js';

const prisma = new PrismaClient();

async function seed() {
    await seedUsersAndCategories();       // ← вот здесь создаём тестового пользователя
    await seedPosts();
    await seedStars();
    await seedComments();
}

seed()
    .then(async () => {
        console.log('✅ Seed completed');
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
