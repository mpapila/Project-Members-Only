import express, { Express, Request, Response } from "express"
import dotenv from 'dotenv';
import mongoose, { mongo } from "mongoose";
import asyncHandler from 'express-async-handler'
import User from './models/Users'
import bodyParser from "body-parser";
import { user_create_post } from './controllers/userController';
import indexRouter from './routes/main'
import path = require("path");
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression = require("compression");
import helmet from "helmet";
// import helmet from "helmet";


dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const mongoDB = process.env.MONGODB_URI;
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser())
if (!mongoDB) {
    throw new Error('MONGODB_URI environment variable is not defined');
}
app.use(compression());
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net", (req, res) => `'nonce-${res.locals.nonce}'`],
        },
    }),
);

mongoose.connect(mongoDB)
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch((err) => {
        console.log('Connection Error:', err)
    })

app.use('/', indexRouter)

app.listen(port, () => {
    console.log('server is running at', port)
})
