const { Router } = require('express');
const ApiRouter = new Router();

const AuthRouter = require('./auth');
const UserRouter = require('./user');
const ChatRouter = require('./chat');

ApiRouter.use('/auth', AuthRouter);
ApiRouter.use('/user', UserRouter);
ApiRouter.use('/chat', ChatRouter);

module.exports = ApiRouter;