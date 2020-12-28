const { ChatService } = require('../services');

const sendMessage = async (req, res, next) => {
    try {
        const chat = new ChatService(req, res);
        return chat.sendMessage();
    } catch (error) {
        logger.error(error);
        return next(error);
    }
}

const fetchMessages = async (req, res, next) => {
    try {
        const chat = new ChatService(req, res);
        return chat.fetchMessages();
    } catch (error) {
        logger.error(error);
        return next(error);
    }
}

const updateMessageStatus = async (req, res, next) => {
    try {
        const chat = new ChatService(req, res);
        return chat.updateMessageStatus();
    } catch (error) {
        logger.error(error);
        return next(error);
    }
}


module.exports = {
    sendMessage,
    fetchMessages,
    updateMessageStatus
};