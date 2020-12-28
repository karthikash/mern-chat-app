const { Schema, model } = require("mongoose");

const chatSchema = new Schema({
    sMessage: {
        type: String,
        required: true
    },
    oFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    oTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nStatus: {
        type: Number,
        enum: [1, 2],
        default: 1
    }
}, {
    timestamps: true
});

module.exports = model('Chat', chatSchema, 'Chat');

/**
 * @field nStatus
 * 0 => sent
 * 1 => delivered
 */