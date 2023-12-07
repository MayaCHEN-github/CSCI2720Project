//model
const { Venue, Event } = require('../models/Models')
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
    // get corresponding venues
    const venues = await Venue.find({ venueId: { $in: venuesListId } });

    res.status(200).json({ venuesInfo: venues, eventCount: venuesLeast })
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
    res.status(200).json(result);
}

// function 4: get all event
const getEvents = async (req, res) => {
    const result = await Event.find({});
    res.status(200).json(result);
}

// export function
module.exports = {
    getVenues,
    getByKeyword,
    getById,
}
