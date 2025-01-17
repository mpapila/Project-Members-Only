"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const postController_1 = require("../controllers/postController");
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
router.get('/', userController_1.index);
router.get('/sign-up', userController_1.user_create_get);
router.post('/sign-up', userController_1.user_create_post);
router.get('/login', userController_1.user_login_get);
router.post('/login', userController_1.user_login_post);
router.get('/post', postController_1.post_list_get);
router.get('/post/create', postController_1.post_create_get);
router.post('/post/create', postController_1.post_create_post);
router.get('/admin', adminController_1.admin_page_get);
router.get('/logout', userController_1.user_logout);
router.delete('/admin/post/:id', adminController_1.admin_post_delete);
router.delete('/admin/user/:id', adminController_1.admin_user_delete);
router.get('/admin/user/:id/edit', adminController_1.admin_userupdate_get);
router.post('/admin/user/:id/edit', adminController_1.admin_userupdate_post);
router.get('/admin/post/:id/edit', adminController_1.admin_postUpdate_get);
router.post('/admin/post/:id/edit', adminController_1.admin_postUpdate_post);
exports.default = router;
