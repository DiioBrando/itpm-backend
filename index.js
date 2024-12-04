import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routerUser from "./router/routerUser.js";
import routerComment from "./router/routerComment.js";
import routerProject from "./router/routerProject.js";
import routerTask from "./router/routerTask.js";
import routerTasksColumn from "./router/routerTasksColumn.js";
import {ErrorMiddleware} from "./middlewaree/ErrorMiddleware.js";

const app = express();
dotenv.config();

const api = '/api';

app.use(express.json());
app.use(cookieParser('cookieName', 'cookieValue', {
    sameSite: 'lax',
}));
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(api, routerUser);
app.use(api, routerComment);
app.use(api, routerProject);
app.use(api, routerTask);
app.use(api, routerTasksColumn);

app.use(ErrorMiddleware);


async function startApp(){
    try {
        await mongoose.connect(process.env.MONGO_URL_PATH);
        app.listen(process.env.PORT, () => console.log('Server start'));
    } catch (e) {
        console.log(e);
    }
}

startApp();