import express from 'express';
import { callback, postMedia, postText, redirect } from '../controllers/linkedin.controller';

const linkedinRouter = express.Router();

linkedinRouter.get('/request-token', redirect);

linkedinRouter.get('/callback', callback);

linkedinRouter.post('/post', postText);

linkedinRouter.post('/postMedia', postMedia);

export default linkedinRouter;
