import { Request, Response, NextFunction } from 'express';
import asyncHandler from "express-async-handler";
import User from "../models/Users";
import Post from '../models/Posts';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';
import { body, validationResult } from 'express-validator';




export const admin_page_get = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const allUsers = await User.find({}).exec()
    const allPosts = await Post.find({}).exec()
    const usernameFromPosts = await Post.distinct('username').exec()
    if (!process.env.JWT_SECRET) {
        const error = new Error("There is no JWT Secret Key")
        return next(error);
    }
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET) as JwtPayload
    const username = decoded.username;
    const user = await User.findOne({ username }).exec();
    const renderOptions = {
        title: "Admin Dashboard",
        posts: allPosts,
        users: allUsers,
        error: [],
        user,
        usernameFromPosts,
    }
    res.render('admin', renderOptions)

})

export const admin_post_delete = asyncHandler(async (req, res, _next) => {
    try {
        await Post.findByIdAndDelete(req.params.id)
        res.status(200).send('Post deleted successfully');
        console.log('success')
    } catch (error) {
        console.log('error', error)
    }
})

export const admin_user_delete = asyncHandler(async (req, res, _next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.log('error', error)
    }
})
export const admin_userupdate_get = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const user = await User.findById(req.params.id).exec();

    res.render("sign-up", {
        title: "User Update",
        errors: [],
        user,

    })
})
export const admin_userupdate_post = [
    body("username", "Username needs to be unique").trim().notEmpty(),
    body('email', 'Invalid Email').isEmail().trim().normalizeEmail(),

    asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void | any> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('sign-up', {
                title: 'User Update',
                errors: errors.array(),

            });
        }

        const { username, email } = req.body
        const user = await User.findById(req.params.id).exec()
        if (!user) {
            return res.status(404).send('User not found');
        }
        user.username = username;
        user.email = email;

        await user.save()

        res.redirect('/admin')
    })
]

export const admin_postUpdate_get = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findById(req.params.id).exec();
    const postOne = await Post.findById(req.params.id).exec();
    const renderOption: Record<string, string | number | JwtPayload | JwtPayload[]> = {
        title: 'Post Update',
        errors: [],
    }
    if (!process.env.JWT_SECRET) {
        const error = new Error("There is no JWT Secret Key")
        return next(error);
    }
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET) as unknown as JwtPayload
    renderOption.user = decoded
    res.render("post_form", renderOption)
})
export const admin_postUpdate_post = [
    body('post').trim(),

    asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void | any> => {
        const postOne = await Post.findById(req.params.id).exec();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('post_form', {
                title: 'Post Update',
                errors: errors.array(),
            });
        }

        const { post } = req.body
        if (!postOne) {
            return res.status(404).send('User not found');
        }
        postOne.post = post

        await postOne.save()

        res.redirect('/admin')
    })
]