//model
const { Event, Venue } = require('../models/Models')
const { User } = require('../models/User')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//---- create read update delete on events
// read all events
const readEvents = async (req, res) => {
    const events = await Event.find({});
    res.status(200).json(events);
}
// read an event
const readEvent = async (req, res) => {
    const event = await Event.findOne({ eventId: req.params.id });
    if (event) {
        res.status(200).json(event);
    } else {
        res.status(404).json({ error: "there is no event with id " + req.params.id });
    }
}
// create an event
const createEvent = async (req, res) => {
    const { title, date, description, presenter, price, venueId } = req.body;
    // check whether the venueid exists
    const corLoc = await Venue.findOne({ venueId: venueId })
    if (!corLoc) {
        res.status(400).json({ error: "no venue with id " + venueId });
    } else {
        // auto create the event id as asg 3
        const eventLargest = await Event.find().sort({ "eventId": -1 }).limit(1);
        const newId = eventLargest[0].eventId + 1;
        let newEvent = new Event({
            eventId: newId, title: title, date: date, description: description, presenter: presenter, price: price, venueId: venueId
        });
        newEvent.save().then(() => {
            res.status(200).json(newEvent);
        })
    }
}
// update an event
const updateEvent = async (req, res) => {
    const eventId = req.params.id;
    // cannot change the event id.
    const { title, date, description, presenter, price, venueId } = req.body;
    // update only existing fields
    let params = {
        title: title,
        date: date,
        description: description,
        presenter: presenter,
        price: price,
        venueId: venueId
    }
    for (let prop in params) {
        if (!params[prop]) {
            delete params[prop];
        }
    }

    // return the updated item
    const updateEvent = await Event.findOneAndUpdate({ eventId: eventId }, params, {
        returnDocument: 'after'
    });
    if (!updateEvent) {
        res.status(404).json({ error: "There is no event with ID:" + req.params.eventID });
    } else {
        res.status(200).json(updateEvent);
    }
}
// delete an event
const deleteEvent = async (req, res) => {
    const deleteId = req.params.id;
    const eventDelete = await Event.findOneAndDelete({ eventId: deleteId });
    if (!eventDelete) {
        res.status(404).json({ error: "There is no event with ID:" + req.params.eventID });
    } else {
        res.status(204).json({});
    }
}

//---- create read update delete on users
// read all user
const readUsers = async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
}

// read a user
const readUser = async (req, res) => {
    const user = await User.findOne({ name: req.params.name });
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ error: "there is no user with name " + req.params.name });
    }
}

// create with hashing
const createUser = async (req, res) => {
    const { name, type, original_pw, favor } = req.body;
    // check if empty
    if (!name || !type || !original_pw) {
        res.status(400).json({ error: "All fields must be filled" })
    } else {
        // check whether the user exists
        const corUser = await User.findOne({ name: name })
        if (corUser) {
            res.status(400).json({ error: "name already exists." });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPw = await bcrypt.hash(original_pw, salt);
            const newUser = new User({
                name: name, type: type, password: hashedPw, original_pw: original_pw, favor: favor
            });
            newUser.save().then(() => {
                res.status(200).json(newUser);
            })
        }
    }
}
// update
const updateUser = async (req, res) => {
    const userName = req.params.name;
    // cannot change the name, because unique identity.

    // can change: type, pw, favor[number]
    const { type, original_pw, favor } = req.body;
    // update only existing fields
    let params = {
        type: type, password: original_pw, original_pw: original_pw, favor: favor
    }
    for (let prop in params) {
        if (!params[prop]) {
            delete params[prop];
        }
    }
    if (original_pw) {
        const salt = await bcrypt.genSalt(10);
        const hashedPw = await bcrypt.hash(original_pw, salt);
        params.password = hashedPw;
    }
    // return the updated item
    const updateUser = await User.findOneAndUpdate({ name: userName }, params, {
        returnDocument: 'after'
    });
    if (!updateUser) {
        res.status(404).json({ error: "There is no user with name: " + userName });
    } else {
        res.status(200).json(updateUser);
    }

}
// delete
const deleteUser = async (req, res) => {
    const userName = req.params.name;
    const userDelete = await User.findOneAndDelete({ name: userName });
    if (!userDelete) {
        res.status(404).json({ error: "There is no user with name: " + userName });
    } else {
        res.status(204).json({});
    }
}


// export function
module.exports = {
    readEvents,
    readEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    readUsers,
    readUser,
    createUser,
    updateUser,
    deleteUser
}