const { isValidObjectId } = require('mongoose');
const { User } = require('../models');

class UserService {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async findOne() {
        const { _id } = this.req.query;
        if (!isValidObjectId(_id)) return this.res.status(400).json({ status: 400, message: 'invalid ObjectId', error: 'Bad Request' });
        const user = await User.findOne({ _id }, { sPassword: 0, sSalt: 0, __v: 0 });
        if (!user) return this.res.status(404).json({ status: 404, message: 'user not found', error: 'Not Found' });
        return this.res.status(200).json({ status: 200, message: 'user details', data: user });
    }

    async findAll() {
        const { _id } = this.req.query;
        if (!isValidObjectId(_id)) return this.res.status(400).json({ status: 400, message: 'invalid ObjectId', error: 'Bad Request' });
        let users;
        if (_id) {
            users = await User.find({ _id: { $ne: _id } }, { __v: 0, sPassword: 0, sSalt: 0 }).sort({ sFirstName: 1 });
        } else {
            users = await User.find({}, { __v: 0, sPassword: 0, sSalt: 0 }).sort({ sFirstName: 1 });
        }
        if (users.length === 0) return this.res.status(404).json({ status: 404, message: 'user list empty', error: 'Not Found' });
        return this.res.status(200).json({ status: 200, message: 'user details', data: users });
    }

    async update() {
        const { _id } = this.req.params;
        const { sFirstName, sLastName, sUsername } = this.req.body;
        if (!isValidObjectId(_id)) return this.res.status(400).json({ status: 400, message: 'invalid ObjectId', error: 'Bad Request' });
        const user = await User.findOne({ sUsername: sUsername }, { _id: 1, sUsername: 1 });
        if (!user) {
            await User.findOneAndUpdate({ _id }, { $set: this.req.body }, { new: true }).exec();
            return this.res.status(200).json({ status: 200, message: 'Profile Updated' });
        } else if (user._id.toString() === _id && user.sUsername === sUsername) {
            await User.findOneAndUpdate({ _id }, { $set: { sFirstName, sLastName } }, { new: true }).exec();
            return this.res.status(200).json({ status: 200, message: 'Profile Updated' });
        } else {
            return this.res.status(409).json({ status: 409, message: 'Username Taken', error: 'Conflict' });
        }
    }

    async delete() {
        const { _id } = this.req.params;
        if (!isValidObjectId(_id)) return this.res.status(400).json({ status: 400, message: 'invalid ObjectId', error: 'Bad Request' });
        await User.deleteOne({ _id });
        return this.res.status(200).json({ status: 200, message: 'Account Deleted' });
    }

    async uploadDp() {
        const { _id } = this.req.body;
        if (!isValidObjectId(_id)) return this.res.status(400).json({ status: 400, message: 'invalid ObjectId', error: 'Bad Request' });
        if (!this.req.file) return this.res.status(400).json({ status: 400, message: 'upload file', error: 'Bad Request' });
        const { filename } = this.req.file;
        const user = await User.findOne({ _id });
        if (!user) return this.res.status(404).json({ status: 404, message: 'user not found', error: 'Not Found' });
        const imageUrl = `${constants.HOST}:${constants.PORT}/uploads/${filename}`;
        await User.updateOne({ _id }, { $set: { sImage: imageUrl } }, { new: true }).exec();
        return this.res.status(200).json({ status: 200, message: 'user dp uploaded' });
    }
}

module.exports = UserService;