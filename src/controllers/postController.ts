import { Request, Response, NextFunction } from "express";
import User from "../models/Users";
import Post from "../models/Posts";
import asyncHandler from "express-async-handler";
import { ExpressValidator, body, validationResult } from "express-validator";
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { JwtPayload } from "../types";



export const post_list_get = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // console.log('req.cookies', req.cookies)
    try {
        if (!process.env.JWT_SECRET) {
            const error = new Error("There is no JWT Secret Key")
            return next(error);
        }
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
        // console.log("decoded", decoded)
        const allPost = await Post.find({}).sort({ createdAt: 1 }).exec()
        const user = await User.findById((decoded as any)._id).exec();
        // console.log(allPost);
        res.render('posts', {
            title: 'All Posts',
            posts: allPost,
            user,
        })
    } catch (err) {
        if (err instanceof JsonWebTokenError) {

            res.redirect('/login')
        } else {
            return next(err)
        }

    }

})

export const post_create_get = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const renderOption: Record<string, string | number | JwtPayload | JwtPayload[]> = {
        title: 'New Post',
        errors: [],
    }
    if (!process.env.JWT_SECRET) {
        const error = new Error("There is no JWT Secret Key")
        return next(error);
    }
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET) as unknown as JwtPayload
    renderOption.user = decoded
    res.render('post_form', renderOption)
})

export const post_create_post = [
    body('post').trim(),

    asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // const token = req.cookies.token
        // console.log('token', token.decoded.username)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('login', {
                title: 'Login Up',
                errors: errors.array()
            });
            return;
        }

        if (!process.env.JWT_SECRET) {
            const error = new Error("There is no JWT Secret Key")
            return next(error);
        }
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET) as JwtPayload

        const username = decoded.username
        const { post } = req.body
        const newPost = new Post({
            username,
            post,
        })

        try {
            await newPost.save();
            // console.log(newPost, 'has been created');
            res.redirect('/post')
        } catch (err) {
            next(err)
        }
    })
]