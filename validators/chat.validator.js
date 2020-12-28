const Joi = require("joi");

const SendMessageValidator = Joi.object().keys({
    sMessage: Joi.string().required(),
    oFrom: Joi.string().required(),
    oTo: Joi.string().required()
});

const MessageListValidator = Joi.object().keys({
    sender: Joi.string().required(),
    receiver: Joi.string().required()
});

const UpdateStatusValidator = Joi.object().keys({
    _id: Joi.string().required(),
    status: Joi.number().valid(2).required()
});

module.exports = {
    SendMessageValidator,
    MessageListValidator,
    UpdateStatusValidator
}