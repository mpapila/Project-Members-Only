import express from "express";
import { user_create_post, index, user_create_get, user_login_get, user_login_post, user_logout } from '../controllers/userController'
import { post_list_get, post_create_get, post_create_post } from '../controllers/postController'
import { admin_page_get, admin_postUpdate_get, admin_postUpdate_post, admin_post_delete, admin_user_delete, admin_userupdate_get, admin_userupdate_post } from "../controllers/adminController";

const router = express.Router();

router.get('/', index)
router.get('/sign-up', user_create_get)
router.post('/sign-up', user_create_post)
router.get('/login', user_login_get)
router.post('/login', user_login_post)
router.get('/post', post_list_get)
router.get('/post/create', post_create_get)
router.post('/post/create', post_create_post)
router.get('/admin', admin_page_get)
router.get('/logout', user_logout)
router.delete('/admin/post/:id', admin_post_delete)
router.delete('/admin/user/:id', admin_user_delete)
router.get('/admin/user/:id/edit', admin_userupdate_get)
router.post('/admin/user/:id/edit', admin_userupdate_post)
router.get('/admin/post/:id/edit', admin_postUpdate_get)
router.post('/admin/post/:id/edit', admin_postUpdate_post)

export default router;
