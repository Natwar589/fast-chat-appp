import express from 'express';
import authenticateJWT from '../middlewares/AuthMiddleware.js';
import { CreateChannel, GetAllChannels, GetChannelMessages } from '../controllers/ChannelController.js';

const channelRoutes = express.Router();

channelRoutes.post('/create-channel',authenticateJWT,CreateChannel);
channelRoutes.get('/get-channels',authenticateJWT,GetAllChannels);
channelRoutes.get('/get-all-channel-message',authenticateJWT,GetChannelMessages);

export default  channelRoutes;