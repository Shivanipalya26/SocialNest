import { Router } from 'express';
import { getPostsController, postController } from '../controllers/post.controller';
import { verifyToken } from '../middlewares/verifyToken.middleware';
import formidableMiddleware from 'express-formidable';

const postRouter = Router();

postRouter.use(formidableMiddleware());

postRouter.get('/', verifyToken, getPostsController);
postRouter.post('/', verifyToken, postController);

export default postRouter;
