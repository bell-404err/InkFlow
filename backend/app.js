const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

const postsRoutes = require('./routes/posts');
// const authRoutes = require('./routes/auth');

app.use('/api/posts', postsRoutes);
// app.use('/api/profile', authRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
