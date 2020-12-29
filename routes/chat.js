const { Router } = require("express");
const { ChatController } = require('../controllers');
const { Auth } = require("../middlewares");
const validate = require("../validators");
const multer = require('multer');

const ChatRouter = new Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${req.body.oFrom}-${file.originalname}`);
    }
});

const fileFilter = (req, file, callback) => {
    var ext = file.mimetype;
    callback(null, true);
};

const limits = {
    fileSize: 4096 * 4096
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits,
});

ChatRouter.post('/send', validate('send_message'), Auth.validate, ChatController.sendMessage);
ChatRouter.get('/list', validate('message_list'), Auth.validate, ChatController.fetchMessages);
ChatRouter.patch('/update/status', validate('update_status'), Auth.validate, ChatController.updateMessageStatus);
ChatRouter.post('/upload/', Auth.validate, upload.single('media'), ChatController.sendMedia);

module.exports = ChatRouter;