import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routerUser from "./router/routerUser.js";
import routerComments from "./router/routerComments.js";

const app = express();
dotenv.config();


app.use(express.json());
app.use(cookieParser('cookieName', {
    sameSite: 'lax',
}));
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use('/api', routerUser);
app.use('/api', routerComments);


async function startApp(){
    try {
        await mongoose.connect(process.env.MONGO_URL_PATH);
        app.listen(process.env.PORT, () => console.log('Server start'));
    } catch (e) {
        console.log(e);
    }
}

startApp();