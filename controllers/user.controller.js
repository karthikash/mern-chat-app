const { UserService } = require('../services');

const findOne = async (req, res, next) => {
    try {
        const user = new UserService(req, res);
        return user.findOne();
    } catch (error) {
        logger.error(error);
        return next(error);
    }
}

const findAll = async (req, res, next) => {
    try {
        const user = new UserService(req, res);
        return user.findAll();
    } catch (error) {
        logger.error(error);
        return next(error);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const user = new UserService(req, res);
        return user.update();
    } catch (error) {
        logger.error(error);
        return next(error);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const user = new UserService(req, res);
        return user.delete();
    } catch (error) {
        logger.error(error);
        return next(error);
    }
}

const uploadDp = async (req, res, next) => {
    try {
        const user = new UserService(req, res);
        return user.uploadDp();
    } catch (error) {
        logger.error(error);
        return next(error);
    }
}

module.exports = {
    findOne,
    findAll,
    updateUser,
    deleteUser,
    uploadDp
}