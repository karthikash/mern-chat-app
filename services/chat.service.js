const { isValidObjectId } = require('mongoose');
const { Chat, User } = require('../models');

class ChatService {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async sendMessage() {
        const message = new Chat(this.req.body);
        message.save();
        return this.res.status(201).json({ code: 201, message: 'message sent' });
    }

    async sendMedia() {
        const { oFrom } = this.req.body;
        if (!isValidObjectId(oFrom)) return this.res.status(400).json({ status: 400, message: 'invalid ObjectId', error: 'Bad Request' });
        if (!this.req.file) return this.res.status(400).json({ status: 400, message: 'upload file', error: 'Bad Request' });
        const { filename } = this.req.file;
        const user = await User.findOne({ _id: oFrom });
        if (!user) return this.res.status(404).json({ status: 404, message: 'user not found', error: 'Not Found' });
        const imageUrl = `http://${constants.HOST}:${constants.PORT}/uploads/${filename}`;
        this.req.body.sMessage = imageUrl;
        const message = new Chat(this.req.body);
        message.save();
        return this.res.status(201).json({ code: 201, message: 'message sent' });
    }

    async fetchMessages() {
        const { sender, receiver } = this.req.query;
        const messages = await Chat
            .find({}, { _id: 1, sMessage: 1, nStatus: 1, createdAt: 1 })
            .or([{ oFrom: sender, oTo: receiver }, { oFrom: receiver, oTo: sender }])
            .select('oFrom')
            .populate({ path: 'oFrom', model: User, select: { sFirstName: 1 } })
            .select('oTo')
            .populate({ path: 'oTo', model: User, select: { sFirstName: 1 } })
            .sort({ createdAt: 1 });
        if (messages.length === 0) return this.res.status(404).json({ status: 404, message: 'no chats found' });
        return this.res.status(200).json({ code: 200, message: 'chat list', data: messages });
    }

    async updateMessageStatus() {
        const { _id, status } = this.req.body;
        const message = await Chat.findOne({ _id });
        if (!message) return this.res.status(404).json({ code: 404, message: 'message not found', error: 'Not Found' });
        message.nStatus = status;
        message.save();
        return this.res.status(200).json({ code: 200, message: 'message status updated' });
    }
}

module.exports = ChatService;