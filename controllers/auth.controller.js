const { AuthService } = require('../services');

const signUp = async (req, res, next) => {
    try {
        const auth = new AuthService(req, res);
        return auth.signUp();
    } catch (error) {
        logger.error(error);
        return next(error);
    }
}

const signIn = async (req, res, next) => {
    try {
        const auth = new AuthService(req, res);
        return auth.signIn();
    } catch (error) {
        logger.error(error);
        return next(error);
    }
}

const signOut = async (req, res, next) => {
    try {
        const auth = new AuthService(req, res);
        return auth.signOut();
    } catch (error) {
        logger.error(error);
        return next(error);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const auth = new AuthService(req, res);
        return auth.resetPassword();
    } catch (error) {
        logger.error(error);
        return next(error);
    }
}

module.exports = {
    signUp,
    signIn,
    signOut,
    resetPassword
};