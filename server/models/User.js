const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    favor: [Number]
});

// // static sign up method
// userSchema.statics.signup = async function (name, type, password) {
//     // check if empty
//     if (!name || !type || !password) {
//         throw Error('All fields must be filled')
//     }
//     // check email to be unique.
//     const exists = await this.findOne({ name });
//     if (exists) {
//         throw Error('name already in use.');
//     }
//     // password hashing
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);

//     const user = await this.create({
//         name, type, password: hash
//     });
//     return user;
// }

// // static login method
// userSchema.statics.login = async function (name, password) {
//     // check if empty
//     if (!name || !password) {
//         throw Error('All fields must be filled')
//     }
//     // find user
//     const user = await this.findOne({ name });
//     if (!user) {
//         throw Error('Incorrect name');
//     }
//     // match the password
//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//         throw Error('Incorrect password')
//     }
//     return user;
// }

const commentSchema = new Schema({
    venueId: { type: Number, required: true },
    userName: { type: String, required: true },
    content: { type: String, required: true }
})

const User = mongoose.model('User', userSchema);
const Comment = mongoose.model('Comment', commentSchema);
module.exports = {
    User,
    Comment
};