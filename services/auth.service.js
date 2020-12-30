const { genSalt, hash } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { isValidObjectId } = require('mongoose');
const { User } = require('../models');

class AuthService {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    signToken(payload) {
        const token = sign(payload, constants.AUTH.JWT_SECRET_KEY, { expiresIn: parseInt(constants.AUTH.JWT_EXPIRES_IN) });
        return token;
    }

    async hashPassword(sPassword, sSalt) {
        return await hash(sPassword, sSalt);
    }

    async signUp() {
        const { sUsername, sPassword } = this.req.body;
        const user = await User.findOne({ sUsername }, { _id: 0 });
        if (user) return this.res.status(409).json({ status: 409, message: 'Username Taken', error: 'Conflict' });
        const salt = await genSalt();
        this.req.body.sSalt = salt;
        this.req.body.sPassword = await this.hashPassword(sPassword, salt);
        this.req.body.sUsername = sUsername.toLowerCase();
        const data = new User(this.req.body);
        data.save();
        return this.res.status(201).json({ status: 201, message: 'User Registered' });
    }

    async signIn() {
        const { sUsername, sPassword } = this.req.body;
        const user = await User.findOne({ sUsername }, { sPassword: 1, sSalt: 1 });
        if (!user) return this.res.status(404).json({ status: 404, message: `User not Registered`, error: 'Not Found' });
        if (user.sPassword !== await this.hashPassword(sPassword, user.sSalt)) {
            return this.res.status(401).json({ status: 401, message: 'Incorrect Password', error: 'Unauthorized' });
        }
        const { _id } = user;
        const token = this.signToken({ _id });
        return this.res.status(200).json({ status: 200, message: 'Login Success', token, _id });
    }

    signOut() {
        const { _id } = this.req.params;
        if (!isValidObjectId(_id)) return this.res.status(400).json({ status: 400, message: 'invalid ObjectId', error: 'Bad Request' });
        return this.res.status(200).json({ status: 200, message: 'sign out success' });
    }

    async resetPassword() {
        const { _id, sPassword } = this.req.body;
        if (!isValidObjectId(_id)) return this.res.status(400).json({ status: 400, message: 'invalid ObjectId', error: 'Bad Request' });
        const user = await User.findOne({ _id }, { sPassword: 1, sSalt: 1 });
        if (!user) return this.res.status(404).json({ status: 404, message: `user doesn't exists`, error: 'Not Found' });
        user.sPassword = await this.hashPassword(sPassword, user.sSalt);
        user.save();
        return this.res.status(200).json({ status: 200, message: 'Password Changed' });
    }
}

module.exports = AuthService;