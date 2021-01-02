const logger = require("./logger.config");
const { User } = require('../models');
const moment = require('moment');

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

        socket.on('new_text_message', (message) => {
            logger.debug(`new_text_message: ${JSON.stringify(message)}`);
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