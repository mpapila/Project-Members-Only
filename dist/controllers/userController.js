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
exports.user_logout = exports.user_login_post = exports.user_login_get = exports.user_create_post = exports.user_create_get = exports.index = void 0;
const Users_1 = __importDefault(require("../models/Users"));
const Posts_1 = __importDefault(require("../models/Posts"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.index = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [numUsers, numPosts, posts] = yield Promise.all([
        Users_1.default.countDocuments({}).exec(),
        Posts_1.default.countDocuments({}).exec(),
        Posts_1.default.find().exec(),
    ]);
    const renderOptions = {
        title: "Member's Posts",
        users_count: numUsers,
        posts_count: numPosts,
        posts,
    };
    if (req.cookies.token) {
        if (!process.env.JWT_SECRET) {
            const error = new Error("There is no JWT Secret Key");
            return next(error);
        }
        let decoded = jsonwebtoken_1.default.verify(req.cookies.token, process.env.JWT_SECRET);
        // console.log('decoded', decoded)
        renderOptions.user = decoded;
    }
    // res.send("Home Page");
    res.render("index", renderOptions);
}));
const user_create_get = (req, res, next) => {
    res.render("sign-up", {
        title: "Sign Up",
        errors: []
    });
};
exports.user_create_get = user_create_get;
exports.user_create_post = [
    (0, express_validator_1.body)("username", "Username needs to be unique").trim().notEmpty(),
    (0, express_validator_1.body)('email', 'Invalid email').isEmail().trim().normalizeEmail(),
    (0, express_validator_1.body)("password", 'Password must be at least 8 characters').trim().isLength({ min: 8 }),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.render('sign-up', {
                title: 'Sign Up',
                errors: errors.array()
            });
        }
        const { username, password, email } = req.body;
        const hashed = yield bcrypt_1.default.hash(password, 10);
        // console.log('req body:', req.body);
        const newUser = new Users_1.default({
            username: username,
            email: email,
            password: hashed,
        });
        try {
            yield newUser.save();
            // console.log('new user:', newUser.username, 'created')
            res.redirect('/login');
        }
        catch (error) {
            return next(error);
        }
    }))
];
const user_login_get = (req, res, next) => {
    res.render('login', {
        title: "Login Page",
        errors: [],
    });
};
exports.user_login_get = user_login_get;
exports.user_login_post = [
    (0, express_validator_1.body)('username').trim().notEmpty(),
    (0, express_validator_1.body)('password').trim().isLength({ min: 8 }),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.render('login', {
                title: 'Login Up',
                errors: errors.array()
            });
        }
        const { username, password } = req.body;
        // console.log('username', username)
        // console.log('password', password)
        const user = yield Users_1.default.findOne({ username: username });
        if (!user) {
            const error = new Error("User not found");
            return next(error);
        }
        const hashed = String(user.password);
        // console.log('hash', hashed)
        const passwordMatches = yield bcrypt_1.default.compare(password, hashed);
        if (!passwordMatches) {
            const error = new Error("Incorrect Password");
            return next(error);
        }
        ;
        // console.log('Login successful')
        if (!process.env.JWT_SECRET) {
            const error = new Error("There is no JWT Secret Key");
            return next(error);
        }
        const userString = JSON.stringify(user);
        const token = jsonwebtoken_1.default.sign(userString, process.env.JWT_SECRET);
        const responsePayload = {
            token
        };
        // console.log('payload', responsePayload)
        res.json(responsePayload);
    }))
];
const user_logout = (req, res, next) => {
    try {
        res.clearCookie('token');
        res.redirect('/login');
    }
    catch (error) {
        return next(error);
    }
};
exports.user_logout = user_logout;
