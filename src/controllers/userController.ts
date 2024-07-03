import { Request, Response, NextFunction } from 'express';
import User from "../models/Users";
import Post from '../models/Posts';
import asyncHandler from "express-async-handler";
import { ExpressValidator, body, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtPayload, PostsType } from '../types';
import { Document, ObjectId } from "mongoose";

interface PostDocument extends Document {
    username: string;
    post: string;
}

export const index = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const [numUsers, numPosts, posts] = await Promise.all([
        User.countDocuments({}).exec(),
        Post.countDocuments({}).exec(),
        Post.find().exec() as unknown as Promise<PostDocument[]>,
    ])
    const renderOptions: Record<string, string | number | JwtPayload | PostDocument[]> = {
        title: "Member's Posts",
        users_count: numUsers,
        posts_count: numPosts,
        posts,
    }
    if (req.cookies.token) {

        if (!process.env.JWT_SECRET) {
            const error = new Error("There is no JWT Secret Key")
            return next(error);
        }
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET) as JwtPayload
        // console.log('decoded', decoded)
        renderOptions.user = decoded
    }
    // res.send("Home Page");
    res.render("index", renderOptions)
})
export const user_create_get = (req: Request, res: Response, next: NextFunction): void => {


    res.render("sign-up", {
        title: "Sign Up",
        errors: []
    })
}

export const user_create_post = [
    body("username", "Username needs to be unique").trim().notEmpty(),
    body('email', 'Invalid email').isEmail().trim().normalizeEmail(),
    body("password", 'Password must be at least 8 characters').trim().isLength({ min: 8 }),


    asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('sign-up', {
                title: 'Sign Up',
                errors: errors.array()
            });
        }

        const { username, password, email } = req.body
        const hashed = await bcrypt.hash(password, 10)
        // console.log('req body:', req.body);

        const newUser = new User({
            username: username,
            email: email,
            password: hashed,
        })
        try {
            await newUser.save();
            // console.log('new user:', newUser.username, 'created')
            res.redirect('/login')
        } catch (error) {
            return next(error)
        }
    })
]

export const user_login_get = (req: Request, res: Response, next: NextFunction) => {

    res.render('login', {
        title: "Login Page",
        errors: [],
    })
}

export const user_login_post = [
    body('username').trim().notEmpty(),
    body('password').trim().isLength({ min: 8 }),

    asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {



        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('login', {
                title: 'Login Up',
                errors: errors.array()
            });
        }

        const { username, password } = req.body
        // console.log('username', username)
        // console.log('password', password)
        const user = await User.findOne({ username: username })
        if (!user) {
            const error = new Error("User not found");
            return next(error);
        }
        const hashed = String(user.password)
        // console.log('hash', hashed)
        const passwordMatches = await bcrypt.compare(password, hashed)

        if (!passwordMatches) {
            const error = new Error("Incorrect Password");
            return next(error);
        };
        // console.log('Login successful')
        if (!process.env.JWT_SECRET) {
            const error = new Error("There is no JWT Secret Key")
            return next(error);
        }
        const userString = JSON.stringify(user)
        const token = jwt.sign(userString, process.env.JWT_SECRET)
        const responsePayload = {
            token
        }
        // console.log('payload', responsePayload)
        res.json(responsePayload)


    })
]

export const user_logout = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('token')
        res.redirect('/login')
    } catch (error) {
        return next(error);
    }
}




