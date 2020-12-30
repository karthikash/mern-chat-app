/**
 * @author [Karthik Ashokkumar]
 * @email [karthikashokumar@gmail.com]
 * @create date 2020-12-24 19:13:21
 * @modify date 2020-12-24 19:28:21
 * @desc [Chat application backend entry point]
 */

// required libraries
'use strict';

require('dotenv').config();

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { logger, constants, mongoConnection, appConfig, redis } = require('./config');

// app instance from express framework
const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer, { cors: { origin: constants.CLIENT } });

io.on('connection', socket => {
    logger.debug(`user connected: ${socket.id} `);
    socket.emit('socket.id', socket.id);
    socket.on('new_text_message', (message) => {
        logger.debug(`new_text_message: ${JSON.stringify(message)}`);
        io.emit('refresh_messages', message.oTo);
    });
    socket.on('receiver', res => {
        logger.debug(`receiver ${res}`);
    });
});

// global middleware for app instance
appConfig(app);

// establishing database connection
mongoConnection((err) => {
    if (err) {
        logger.error(err.stack);
        process.exit(1);
    }
    logger.info('Database is connected');
    httpServer.listen(constants.PORT, () => {
        logger.info(`Server is running at port ${constants.PORT}`);
    });
    // initializing global variables
    global.logger = logger;
    global.constants = constants;
    global.redisClient = redis.createConnection();
});