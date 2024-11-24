import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();


app.use(express.json());
app.use(cookieParser('cookieName', 'cookieValue', {
    sameSite: 'lax',
}));
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));



async function startApp(){
    try {
        await mongoose.connect(process.env.MONGO_URL_PATH);
        app.listen(process.env.PORT, () => console.log('Server start'));
    } catch (e) {
        console.log(e);
    }
}

startApp();