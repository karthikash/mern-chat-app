require('dotenv').config();

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ timestamp, label, level, message }) => {
    return `${timestamp} - [${label}] - ${level}: ${message}`;
});

const TRANSPORTS = [];

switch (process.env.NODE_ENV) {
    case 'production': TRANSPORTS.push(
        new transports.File({
            level: 'silly',
            filename: 'access.log',
            maxsize: 4096,
            maxFiles: 4,
            json: true,
            handleExceptions: true,
            colorize: false,
            timestamp: true
        })
    );
        break;
    default: TRANSPORTS.push(
        new transports.Console({
            level: 'silly',
            handleExceptions: true,
            json: true,
            colorize: true,
            timestamp: true
        })
    );
        break;
};

const logger = createLogger({
    transports: TRANSPORTS,
    exitOnError: false,
    format: combine(
        label({ label: 'ChatApp' }),
        format.colorize(),
        timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        logFormat
    )
});

module.exports = logger;