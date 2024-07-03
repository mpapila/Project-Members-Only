"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.post_create_post = exports.post_create_get = exports.post_list_get = void 0;
const Users_1 = __importDefault(require("../models/Users"));
const Posts_1 = __importDefault(require("../models/Posts"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
exports.post_list_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('req.cookies', req.cookies)
    try {
        if (!process.env.JWT_SECRET) {
            const error = new Error("There is no JWT Secret Key");
            return next(error);
        }
        const decoded = jsonwebtoken_1.default.verify(req.cookies.token, process.env.JWT_SECRET);
        // console.log("decoded", decoded)
        const allPost = yield Posts_1.default.find({}).sort({ createdAt: 1 }).exec();
        const user = yield Users_1.default.findById(decoded._id).exec();
        // console.log(allPost);
        res.render('posts', {
            title: 'All Posts',
            posts: allPost,
            user,
        });
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.redirect('/login');
        }
        else {
            return next(err);
        }
    }
}));
exports.post_create_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const renderOption = {
        title: 'New Post',
        errors: [],
    };
    if (!process.env.JWT_SECRET) {
        const error = new Error("There is no JWT Secret Key");
        return next(error);
    }
    let decoded = jsonwebtoken_1.default.verify(req.cookies.token, process.env.JWT_SECRET);
    renderOption.user = decoded;
    res.render('post_form', renderOption);
}));
exports.post_create_post = [
    (0, express_validator_1.body)('post').trim(),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // const token = req.cookies.token
        // console.log('token', token.decoded.username)
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.render('login', {
                title: 'Login Up',
                errors: errors.array()
            });
            return;
        }
        if (!process.env.JWT_SECRET) {
            const error = new Error("There is no JWT Secret Key");
            return next(error);
        }
        const decoded = jsonwebtoken_1.default.verify(req.cookies.token, process.env.JWT_SECRET);
        const username = decoded.username;
        const { post } = req.body;
        const newPost = new Posts_1.default({
            username,
            post,
        });
        try {
            yield newPost.save();
            // console.log(newPost, 'has been created');
            res.redirect('/post');
        }
        catch (err) {
            next(err);
        }
    }))
];
