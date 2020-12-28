const { SignInValidator, SignOutValidator, SignUpValidator, ResetPaswordValidator } = require('./auth.validator');
const { GetUserByIdValidator, GetUserListValidator, UpdateUserValidator, DeleteUserValidator, UploadDpValidator } = require('./user.validator');
const { SendMessageValidator, MessageListValidator, UpdateStatusValidator } = require('./chat.validator');

const validate = (schema = null) => (req, res, next) => {
    switch (schema) {

        // AUTH VALIDATION
        case 'sign_up': var Schema = SignUpValidator; break;
        case 'sign_in': var Schema = SignInValidator; break;
        case 'sign_out': var Schema = SignOutValidator; break;
        case 'reset_password': var Schema = ResetPaswordValidator; break;

        // USERS VALIDATION
        case 'get_user_by_id': var Schema = GetUserByIdValidator; break;
        case 'get_user_list': var Schema = GetUserListValidator; break;
        case 'update_user': var Schema = UpdateUserValidator; break;
        case 'delete_user': var Schema = DeleteUserValidator; break;

        // CHAT VALIDATION
        case 'send_message': var Schema = SendMessageValidator; break;
        case 'message_list': var Schema = MessageListValidator; break;
        case 'update_status': var Schema = UpdateStatusValidator; break;
    }
    if (!Schema) {
        return next(new Error('Schema flag is not defined in validation'))
    } else {
        var body = req.body;
        var query = req.query;
        var params = req.params;
        var file = req.file;
        var data = Object.assign({}, body, query, params, file)
        if (typeof data == 'string') {
            data = JSON.parse(data)
        }
        var validation = Schema.validate(data);
        if (!validation.error) return next();
        return res.status(400).json({ status: 400, error: validation });
    }
}

module.exports = validate;