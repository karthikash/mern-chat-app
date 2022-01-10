const logger = require("./logger.config");
const { User } = require('../models');
const moment = require('moment');
const { Chat } = require('../models');
const fs = require('fs');

module.exports = (io) => {
    const users = [];

    addUser = ({ _id, socketid, room }) => {
        const user = { _id, socketid, room };
        users.push(user);
        logger.debug(`users list: ${JSON.stringify(users)} `);
        return users;
    }

    removeUser = (socketid) => {
        const index = users.findIndex((user) => user.socketid === socketid);
        if (index !== -1) {
            return users.splice(index, 1)[0]
        }
    }

    io.on("connection", (socket) => {
        logger.debug(`user with socket: ${JSON.stringify(socket.id)} connected`);

        socket.emit('socket.id', socket.id);

        socket.on('join', (data) => {
            const user = addUser(data);
            socket.join(user.room);
            logger.debug(`user connected: ${JSON.stringify(data)}`);
            io.emit('users_online', users);
        });

        socket.on('req_messages', async (data) => {
            const { sender, receiver } = data;
            logger.debug(`sender ${sender} requesting updated messages for receiver ${receiver}`);
            const messages = await Chat
                .find({}, { _id: 1, sMessage: 1, nStatus: 1, createdAt: 1 })
                .or([{ oFrom: sender, oTo: receiver }, { oFrom: receiver, oTo: sender }])
                .select('oFrom')
                .populate({ path: 'oFrom', model: User, select: { sFirstName: 1 } })
                .select('oTo')
                .populate({ path: 'oTo', model: User, select: { sFirstName: 1 } })
                .sort({ createdAt: 1 });
            io.emit('messages', messages);
            logger.debug(`updated chat emitted`);
        });

        socket.on('new_media_message', (message) => {
            let fileName = `${message.oFrom}-${Date.now()}-${message.fileName}`;
            message.file = message.file.replace(/^data:image\/\w+;base64,/, '');
            fs.writeFile(`./public/uploads/${fileName}`, message.file, 'base64', async (error) => {
                if (error) {
                    logger.error(`error while saving file: ${error.message}`);
                } else {
                    const msg = {
                        sMessage: `${constants.HOST}/uploads/${fileName}`,
                        oFrom: message.oFrom,
                        oTo: message.oTo
                    };
                    await new Chat(msg).save();
                }
            });
            io.emit('refresh_messages', message.oTo);
        });

        socket.on('new_text_message', async (message) => {
            logger.debug(`new_text_message: ${JSON.stringify(message)}`);
            await new Chat(message).save();
            io.emit('refresh_messages', message.oTo);
        });

        socket.on('receiver', res => {
            logger.debug(`receiver ${res}`);
        });

        socket.on('typing', ({ sender, receiver, status }) => {
            logger.debug(`user: ${JSON.stringify(sender)} is typing on ${receiver}`);
            if (status && status === true) {
                io.emit('iamtyping', { sender, receiver, status });
            } else {
                io.emit('iamtyping', { sender, receiver, status });
            }
        });

        socket.on('disconnect', () => {
            logger.debug(`user with socket: ${JSON.stringify(socket.id)} disconnected`);
            const user = removeUser(socket.id);
            if (user) {
                logger.debug(`users list: ${JSON.stringify(users)} `);
                const { _id } = user;
                User.updateOne({ _id }, { $set: { updatedAt: moment() } }, { new: true }).exec();
                io.emit('user_left', _id);
            }
            io.emit('users_online', users);
        });
    });

};