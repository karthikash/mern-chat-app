const { Router } = require('express');
const { AuthController } = require('../controllers');
const { Auth } = require('../middlewares');
const validate = require('../validators');

const AuthRouter = new Router();

AuthRouter.post('/signup', validate('sign_up'), AuthController.signUp);
AuthRouter.post('/signin', validate('sign_in'), AuthController.signIn);
AuthRouter.post('/signout/:_id', validate('sign_out'), Auth.validate, AuthController.signOut);
AuthRouter.put('/reset/password', validate('reset_password'), Auth.validate, AuthController.resetPassword);

module.exports = AuthRouter;