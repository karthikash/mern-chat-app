require('dotenv').config();

const constants = {
    "dev": {
        NODE_ENV: process.env.NODE_ENV,
        HOST: process.env.HOST,
        PORT: process.env.PORT,
        MONGO_DB_URL: process.env.MONGO_DB_URL,
        AUTH: {
            JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
            JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
        },
        MONGO_CONFIG: {
            DB_HOST: process.env.DB_HOST,
            DB_USER: process.env.DB_USER,
            DB_PASSWORD: process.env.DB_PASSWORD,
            DB_PORT: process.env.DB_PORT,
            DB_NAME: process.env.DB_NAME,
            DB_BACKUP_FOLDER: process.env.DB_BACKUP_FOLDER
        },
        API_VERSION: process.env.API_VERSION,
        REDIS_CONFIG: {
            HOST: process.env.REDIS_HOST,
            PORT: process.env.REDIS_PORT
        }
    },
    "prod": {

    }
};

module.exports = constants[process.env.NODE_ENV || 'dev'];