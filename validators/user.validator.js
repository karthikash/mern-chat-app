const Joi = require("joi");

const GetUserByIdValidator = Joi.object().keys({
    _id: Joi.string().required()
});

const GetUserListValidator = Joi.object().keys({
    _id: Joi.string().allow('')
});

const UpdateUserValidator = Joi.object().keys({
    _id: Joi.string().required(),
    sFirstName: Joi.string().alphanum().min(3).max(16).required(),
    sLastName: Joi.string().alphanum().min(3).max(16).required(),
    sUsername: Joi.string().regex(/^[a-z0-9_]+$/).required()
});

const DeleteUserValidator = Joi.object().keys({
    _id: Joi.string().required()
});

module.exports = {
    GetUserByIdValidator,
    GetUserListValidator,
    UpdateUserValidator,
    DeleteUserValidator
}