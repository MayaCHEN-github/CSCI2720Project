const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const venueSchema = new Schema({
    venueId: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
});

const eventSchema = new Schema({
    eventId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
    },
    date: { type: String },
    description: { type: String },
    presenter: { type: String },
    price: { type: String },
    venueId: { type: Number }
});


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
    favor: [Number],
    comments: {
        comment: {
            venueId: Number,
            content: String
        }
    }
});

// const commentSchema = new Schema({
//     content: {
//         type: String
//     },
//     venueId: {
//         type: Number
//     },
//     userId: {
//         type: mongoose.Schema.Types.ObjectId, ref: 'user'
//     }
// })

const Event = mongoose.model('Event', eventSchema);
const Venue = mongoose.model('Venue', venueSchema);
const User = mongoose.model('User', userSchema);
// const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
    Event,
    Venue,
    User,
    // Comment
};
