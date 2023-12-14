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
    original_pw: {
        type: String, required: true
    },
    favor: [Number]
});

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