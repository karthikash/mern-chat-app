const { Router } = require("express");
const multer = require('multer');

const UserRouter = new Router();

const { UserController } = require('../controllers');
const { Auth } = require("../middlewares");
const validate = require("../validators");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${req.body._id}-${file.originalname}`);
    }
});

const fileFilter = (req, file, callback) => {
    var ext = file.mimetype;
    if (ext !== 'image/png' && ext !== 'image/jpg' && ext !== 'image/jpeg') {
        return callback(new Error('Only images are allowed to upload'));
    }
    callback(null, true);
};

const limits = {
    fileSize: 1024 * 1024
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits,
});

UserRouter.get('/get', validate('get_user_by_id'), Auth.validate, UserController.findOne);
UserRouter.get('/list', validate('get_user_list'), Auth.validate, UserController.findAll);
UserRouter.patch('/update/:_id', validate('update_user'), Auth.validate, UserController.updateUser);
UserRouter.delete('/delete/:_id', validate('delete_user'), Auth.validate, UserController.deleteUser);
UserRouter.patch('/upload/dp', Auth.validate, upload.single('dp'), UserController.uploadDp);

module.exports = UserRouter;