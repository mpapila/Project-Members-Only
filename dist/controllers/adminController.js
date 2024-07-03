"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin_postUpdate_post = exports.admin_postUpdate_get = exports.admin_userupdate_post = exports.admin_userupdate_get = exports.admin_user_delete = exports.admin_post_delete = exports.admin_page_get = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Users_1 = __importDefault(require("../models/Users"));
const Posts_1 = __importDefault(require("../models/Posts"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
exports.admin_page_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield Users_1.default.find({}).exec();
    const allPosts = yield Posts_1.default.find({}).exec();
    const usernameFromPosts = yield Posts_1.default.distinct('username').exec();
    if (!process.env.JWT_SECRET) {
        const error = new Error("There is no JWT Secret Key");
        return next(error);
    }
    let decoded = jsonwebtoken_1.default.verify(req.cookies.token, process.env.JWT_SECRET);
    const username = decoded.username;
    const user = yield Users_1.default.findOne({ username }).exec();
    const renderOptions = {
        title: "Admin Dashboard",
        posts: allPosts,
        users: allUsers,
        error: [],
        user,
        usernameFromPosts,
    };
    res.render('admin', renderOptions);
}));
exports.admin_post_delete = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Posts_1.default.findByIdAndDelete(req.params.id);
        res.status(200).send('Post deleted successfully');
        console.log('success');
    }
    catch (error) {
        console.log('error', error);
    }
}));
exports.admin_user_delete = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Users_1.default.findByIdAndDelete(req.params.id);
        res.status(200).send('User deleted successfully');
    }
    catch (error) {
        console.log('error', error);
    }
}));
exports.admin_userupdate_get = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Users_1.default.findById(req.params.id).exec();
    res.render("sign-up", {
        title: "User Update",
        errors: [],
        user,
    });
}));
exports.admin_userupdate_post = [
    (0, express_validator_1.body)("username", "Username needs to be unique").trim().notEmpty(),
    (0, express_validator_1.body)('email', 'Invalid Email').isEmail().trim().normalizeEmail(),
    (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.render('sign-up', {
                title: 'User Update',
                errors: errors.array(),
            });
        }
        const { username, email } = req.body;
        const user = yield Users_1.default.findById(req.params.id).exec();
        if (!user) {
            return res.status(404).send('User not found');
        }
        user.username = username;
        user.email = email;
        yield user.save();
        res.redirect('/admin');
    }))
];
exports.admin_postUpdate_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Users_1.default.findById(req.params.id).exec();
    const postOne = yield Posts_1.default.findById(req.params.id).exec();
    const renderOption = {
        title: 'Post Update',
        errors: [],
    };
    if (!process.env.JWT_SECRET) {
        const error = new Error("There is no JWT Secret Key");
        return next(error);
    }
    let decoded = jsonwebtoken_1.default.verify(req.cookies.token, process.env.JWT_SECRET);
    renderOption.user = decoded;
    res.render("post_form", renderOption);
}));
exports.admin_postUpdate_post = [
    (0, express_validator_1.body)('post').trim(),
    (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
        const postOne = yield Posts_1.default.findById(req.params.id).exec();
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.render('post_form', {
                title: 'Post Update',
                errors: errors.array(),
            });
        }
        const { post } = req.body;
        if (!postOne) {
            return res.status(404).send('User not found');
        }
        postOne.post = post;
        yield postOne.save();
        res.redirect('/admin');
    }))
];
