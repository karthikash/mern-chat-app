const Joi = require("joi");

const SignUpValidator = Joi.object().keys({
    sFirstName: Joi.string().alphanum().min(3).max(16).required(),
    sLastName: Joi.string().alphanum().min(3).max(16).required(),
    sUsername : Joi.string().regex(/^[a-z0-9_]+$/).required(),
    sPassword: Joi.string().min(8).max(20).required(),
});

const SignInValidator = Joi.object().keys({
    sUsername : Joi.string().regex(/^[a-z0-9_]+$/).required(),
    sPassword: Joi.string().min(8).max(20).required(),
});

const SignOutValidator = Joi.object().keys({
    _id : Joi.string().required()
});

const ResetPaswordValidator = Joi.object().keys({
    _id : Joi.string().required(),
    sPassword: Joi.string().min(8).max(20).required(),
});

module.exports = {
    SignUpValidator,
    SignInValidator,
    SignOutValidator,
    ResetPaswordValidator
}