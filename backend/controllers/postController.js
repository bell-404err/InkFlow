let posts = [
    { id: 1, title: "Первый пост", content: "Это контент первого поста", authorId: "user1" },
    { id: 2, title: "Второй пост", content: "Это контент второго поста", authorId: "user2" },
];

const getAllPosts = (req, res) => {
    res.json(posts);
};

const createPost = (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.sub; // достаём ID юзера из токена

    const newPost = {
        id: posts.length + 1,
        title,
        content,
        authorId: userId,
    };

    posts.push(newPost);

    res.status(201).json(newPost);
};

const deletePost = (req, res) => {
    const postId = parseInt(req.params.id);
    const userId = req.user.sub;

    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ message: "Post didn't found" });
    }

    if (post.authorId !== userId) {
        return res.status(403).json({ message: "Access denied" });
    }

    posts = posts.filter(p => p.id !== postId);

    res.json({ message: "Post deleted" });
};

module.exports = {
    getAllPosts,
    createPost,
    deletePost,
};
