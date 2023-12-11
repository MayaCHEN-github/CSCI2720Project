//model
const { Venue, Event } = require('../models/Models')
const { Comment } = require('../models/User')
const mongoose = require('mongoose');

//function 1: get 10 venus with at least 3 events.
const getVenues = async (req, res) => {
    const result = await Event.aggregate(
        [{ $group: { _id: "$venueId", num_event: { $sum: 1 } } }]
    )
    // check number of events (at least 3)
    var venuesLeast = [];
    var venuesListId = [];
    for (var i in result) {
        // console.log(result[i]);
        let eventNum = Number(result[i].num_event);
        if (eventNum > 2) {
            // delete result[i];
            venuesLeast.push(result[i])
            venuesListId.push(result[i]._id)
        }
    }

    // only return 10 items:
    // get corresponding venues(only 10, with latitude not zero)
    const venues = await Venue.find({ venueId: { $in: venuesListId }, latitude: { $ne: 0 } }).limit(10);
    // corresponding 10 event counters
    var returnId = [];
    for (var i of venues) {
        returnId.push(i.venueId);
    }
    const filtered = result.filter((obj) => returnId.includes(obj._id));
    // combine 2 array
    const combineArray = venues.map(item => ({
        ...item._doc,
        eventCount: filtered.find(i => i._id == item.venueId).num_event
    }))
    res.status(200).json({ combineArray })
    // res.status(200).json({ venuesInfo: venues, eventCount: filtered })
}

// function 2: search keyword in venue name
const getByKeyword = async (req, res) => {
    const key = req.params.key
    const result = await Venue.find({ name: { $regex: key, $options: "i" } });
    res.status(200).json(result);
}

// function 3: single venue page
const getById = async (req, res) => {
    const result = await Venue.find({ venueId: req.params.id });

    // find corresponding comments
    const comments = await Comment.find({ venueId: req.params.id });
    res.status(200).json({ venue: result, comments: comments});
}

// add comments
const addComment = async (req, res) => {
    const { venueId, name, content } = req.body;
    let newComment = new Comment({
        venueId: venueId, userName: name, content: content
    });
    newComment.save().then(() => {
        res.status(200).json(newComment);
    })
}

// export function
module.exports = {
    getVenues,
    getByKeyword,
    getById,
    addComment
}
