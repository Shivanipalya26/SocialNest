import { Router } from 'express';
import { deleteMedia } from '../controllers/media.controller';
import { verifyToken } from '../middlewares/verifyToken.middleware';

const mediaRouter = Router();

mediaRouter.post('/delete', verifyToken, deleteMedia);

export default mediaRouter;
