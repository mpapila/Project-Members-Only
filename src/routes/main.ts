import express, { Express, Request, Response } from "express";
import { user_create_post, index, user_create_get, user_login_get, user_login_post, admin_page_get, user_logout } from '../controllers/userController'
import { post_list_get, post_create_get, post_create_post } from '../controllers/postController'

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

export default router;
