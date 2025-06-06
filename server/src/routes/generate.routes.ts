import { Router } from 'express';
import { enhanceCaption, generateCaption, generateImage } from '../controllers/generate.controller';
import { verifyToken } from '../middlewares/verifyToken.middleware';

const generateRouter = Router();

generateRouter.get('/', enhanceCaption);
generateRouter.post('/', generateCaption);
generateRouter.post('/image', verifyToken, generateImage);

export default generateRouter;
