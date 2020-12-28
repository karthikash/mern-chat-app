const { Router } = require("express");
const { ChatController } = require('../controllers');
const { Auth } = require("../middlewares");
const validate = require("../validators");

const ChatRouter = new Router();

ChatRouter.post('/send', validate('send_message'), Auth.validate, ChatController.sendMessage);
ChatRouter.get('/list', validate('message_list'), Auth.validate, ChatController.fetchMessages);
ChatRouter.patch('/update/status', validate('update_status'), Auth.validate, ChatController.updateMessageStatus);

module.exports = ChatRouter;