import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import postRoutes from './src/modules/post/postRouter.js';
import linkRouter from './src/modules/linkParser/linkRouter.js'
import fileRouter from './src/modules/file/fileRouter.js';
import categoryRouter from './src/modules/category/categoryRouter.js';
import starRouter from './src/modules/star/starRouter.js';
import commentRoute from './src/modules/comment/commentRoute.js';
import profileRouter from './src/modules/profile/profileRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(fileUpload({ createParentPath: true }));
// app.use(fileUpload({}));
app.use('/static', express.static('public/static'));


app.use('/api', postRoutes);
app.use('/api', linkRouter);
app.use('/api', fileRouter);
app.use('/api', categoryRouter);
app.use('/api', starRouter);
app.use('/api', commentRoute);
app.use('/api', profileRouter);
// app.use('/api', authRoutes);

app.get('/', (req, res) => {
    res.send('Hey');
});

async function startApp() {
    try {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (e) {
        console.error(e);
    }
}

startApp();


// const authRoutes = require('./routes/auth');

