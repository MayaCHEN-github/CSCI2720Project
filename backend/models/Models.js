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

const Event = mongoose.model('Event', eventSchema);
const Venue = mongoose.model('Venue', venueSchema);

module.exports = {
    Event,
    Venue
};

