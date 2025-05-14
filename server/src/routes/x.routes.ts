import { Router } from 'express';
import { accessToken, callback, requestToken } from '../controllers/x.controller';
import { getUserDetails, postTweet, uploadMedia } from '../controllers/post.controller';

const xRouter = Router();

xRouter.get('/request-token', requestToken);
xRouter.get('/callback', callback);
xRouter.post('/access-token', accessToken);
xRouter.post('/tweet', postTweet);
xRouter.get('/me', getUserDetails);
xRouter.post('/media', uploadMedia);

export default xRouter;
