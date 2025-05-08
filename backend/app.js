import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import postsRoutes from './routes/posts.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hey');
});

// const authRoutes = require('./routes/auth');

app.use('/api/posts', postsRoutes);
// app.use('/api/profile', authRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
