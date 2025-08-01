import { PrismaClient } from '@prisma/client';
import { usersData, categoriesData } from './userAndCategories.js';
const prisma = new PrismaClient();

const demoPostsData = {
    gaming: [
        {
            title: "Why Indie Games Are Taking Over the World",
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.ign.com/", title: "IGN – Gaming News" },
            list: ["Unique mechanics", "Small creative teams", "Player-driven stories"]
        },
        {
            title: "The Rise of eSports: Not Just for Pros",
            image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.esports.com/", title: "eSports.com" },
            list: ["Global tournaments", "Big prize pools", "Anyone can compete"]
        },
        {
            title: "Retro Gaming: Why Old Consoles Still Matter",
            image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.reddit.com/r/retrogaming/", title: "Reddit: RetroGaming" },
            list: ["Nostalgia", "Simple gameplay", "Strong communities"]
        },
    ],
    history: [
        {
            title: "5 Events That Changed the Course of History",
            image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.history.com/", title: "History Channel" },
            list: ["Fall of Rome", "Discovery of America", "World War II"]
        },
        {
            title: "The Secrets Behind Ancient Civilizations",
            image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.nationalgeographic.com/history/", title: "National Geographic: History" },
            list: ["Egyptian pyramids", "Mayan culture", "Lost cities"]
        },
        {
            title: "Women Who Shaped Modern History",
            image: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.bbc.co.uk/history/historic_figures/", title: "BBC History: Historic Figures" },
            list: ["Marie Curie", "Rosa Parks", "Ada Lovelace"]
        },
    ],
    tech: [
        {
            title: "Top 3 Tech Trends in 2025",
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://techcrunch.com/", title: "TechCrunch" },
            list: ["AI everywhere", "Wearable devices", "Green energy"]
        },
        {
            title: "How 5G Is Changing the Internet",
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.verizon.com/about/our-company/5g", title: "Verizon: 5G Explained" },
            list: ["Faster downloads", "Smart cities", "IoT expansion"]
        },
        {
            title: "Building a Smart Home on a Budget",
            image: "https://images.unsplash.com/photo-1482062364825-616fd23b8fc1?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.cnet.com/home/smart-home/", title: "CNET: Smart Home" },
            list: ["Voice assistants", "Automated lights", "Security systems"]
        },
    ],
    books: [
        {
            title: "5 Must-Read Books of This Year",
            image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.goodreads.com/", title: "Goodreads" },
            list: ["Fiction & mystery", "Science & tech", "Self-improvement"]
        },
        {
            title: "Why Audiobooks Are So Popular Now",
            image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.audible.com/", title: "Audible" },
            list: ["Multitasking", "Accessibility", "Wide selection"]
        },
        {
            title: "How to Start Your Reading Habit",
            image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.nytimes.com/section/books", title: "NYTimes: Books" },
            list: ["Set goals", "Make time daily", "Track your progress"]
        },
    ],
    movies: [
        {
            title: "Oscar Winners You Can’t Miss",
            image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.imdb.com/", title: "IMDb" },
            list: ["Best Picture", "Best Director", "Best Actor"]
        },
        {
            title: "Why Marvel Changed Blockbusters",
            image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.marvel.com/", title: "Marvel" },
            list: ["Shared universe", "CGI effects", "Global fanbase"]
        },
        {
            title: "Documentaries That Will Blow Your Mind",
            image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b43?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.netflix.com/browse/genre/6839", title: "Netflix Documentaries" },
            list: ["Nature", "True crime", "Science"]
        },
    ],
    art: [
        {
            title: "Digital Art: How to Start Drawing Today",
            image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.artstation.com/", title: "ArtStation" },
            list: ["Choose a tablet", "Find your style", "Practice daily"]
        },
        {
            title: "Top 3 Art Movements of the 21st Century",
            image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.moma.org/", title: "MoMA" },
            list: ["Street Art", "Pop Art", "Digital Illustration"]
        },
        {
            title: "Street Artists Who Changed Cities",
            image: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.banksy.co.uk/", title: "Banksy" },
            list: ["Banksy", "Shepard Fairey", "RETNA"]
        },
    ],
    music: [
        {
            title: "How Streaming Changed Music Forever",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.spotify.com/", title: "Spotify" },
            list: ["Unlimited access", "Personalized playlists", "Discover new artists"]
        },
        {
            title: "Best Live Concerts of All Time",
            image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.billboard.com/", title: "Billboard" },
            list: ["Queen at Wembley", "Woodstock", "Live Aid"]
        },
        {
            title: "Making Music on Your Laptop: A Beginner’s Guide",
            image: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.ableton.com/", title: "Ableton" },
            list: ["Get DAW software", "Experiment with sounds", "Share your tracks"]
        },
    ],
    science: [
        {
            title: "5 Breakthroughs in Modern Science",
            image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.scientificamerican.com/", title: "Scientific American" },
            list: ["CRISPR", "Gravitational waves", "Artificial intelligence"]
        },
        {
            title: "Space Exploration: What’s Next?",
            image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.nasa.gov/", title: "NASA" },
            list: ["Moon base", "Mars missions", "Reusable rockets"]
        },
        {
            title: "Climate Change: Facts vs Myths",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://climate.nasa.gov/", title: "NASA Climate" },
            list: ["Rising temperatures", "Renewable energy", "Personal responsibility"]
        },
    ],
    travel: [
        {
            title: "Top 3 Cities to Visit in 2025",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.lonelyplanet.com/", title: "Lonely Planet" },
            list: ["Kyoto", "Reykjavik", "Cape Town"]
        },
        {
            title: "Backpacking Tips for Beginners",
            image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b43?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.reddit.com/r/backpacking/", title: "Reddit: Backpacking" },
            list: ["Pack light", "Plan routes", "Stay safe"]
        },
        {
            title: "How to Travel on a Budget",
            image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.nomadicmatt.com/", title: "Nomadic Matt" },
            list: ["Cheap flights", "Hostels", "Eat like a local"]
        },
    ],
    life: [
        {
            title: "How to Stay Motivated Every Day",
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://zenhabits.net/", title: "Zen Habits" },
            list: ["Set clear goals", "Celebrate small wins", "Take breaks"]
        },
        {
            title: "The Power of Morning Routines",
            image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://jamesclear.com/morning-routine", title: "James Clear: Morning Routine" },
            list: ["Wake up early", "Exercise", "Plan your day"]
        },
        {
            title: "Minimalism: Do You Really Need More?",
            image: "https://images.unsplash.com/photo-1482062364825-616fd23b8fc1?auto=format&fit=crop&w=600&q=80",
            link: { url: "https://www.becomingminimalist.com/", title: "Becoming Minimalist" },
            list: ["Declutter", "Buy less", "Value experiences"]
        },
    ],
};

// Универсальный генератор Editor.js контента:
function getDemoContent({ title, image, link, list }) {
    return {
        time: Date.now(),
        blocks: [
            { type: "header", data: { text: title, level: 2 } },
            { type: "paragraph", data: { text: "A featured post on this topic. Discover insights, tips, and resources for the InkFlow community!" } },
            { type: "image", data: { file: { url: image }, caption: "Featured Image", withBorder: false, withBackground: false, stretched: false } },
            { type: "list", data: { style: "unordered", items: list } },
            { type: "linkTool", data: { link: link.url, meta: { title: link.title } } }
        ],
        version: "2.30.0"
    };
}

export async function seedPosts() {
    let postId = 1;
    for (let c of categoriesData) {
        const demoList = demoPostsData[c.id];
        for (let i = 0; i < 3; ++i) {
            const user = usersData[i % usersData.length];
            const demo = demoList ? demoList[i % demoList.length] : {
                title: `${c.name} Demo Post #${i + 1}`,
                image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
                link: { url: "https://example.com", title: "Example" },
                list: ["Sample 1", "Sample 2", "Sample 3"]
            };
            await prisma.post.create({
                data: {
                    id: `post-${c.id}-${i + 1}`,
                    title: demo.title,
                    slug: `${c.id}-post-${i + 1}`,
                    content: getDemoContent(demo),
                    categoryId: c.id,
                    authorId: user.id,
                }
            });
            postId++;
        }
    }
    console.log("Seeded beautiful demo posts!");
}

seedPosts().finally(() => prisma.$disconnect());
