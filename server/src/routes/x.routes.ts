import { Router } from 'express';
import { accessToken, callback, requestToken } from '../controllers/x.controller';

const xRouter = Router();

xRouter.get('/request-token', requestToken);
xRouter.get('/callback', callback);
xRouter.post('/access-token', accessToken);

export default xRouter;
