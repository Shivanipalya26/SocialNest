import { Router } from 'express';
import { accessToken, callback, getUserDetails, requestToken } from '../controllers/x.controller';

const xRouter = Router();

xRouter.get('/request-token', requestToken);
xRouter.get('/callback', callback);
xRouter.post('/access-token', accessToken);
xRouter.get('/me', getUserDetails);

export default xRouter;
