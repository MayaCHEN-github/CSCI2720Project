//model
const { Venue, Event } = require('../models/Models')
const mongoose = require('mongoose');

// get 10 venus with at least 3 events.
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

    console.log(venues.length)
    console.log(venuesLeast.length)
    
    res.status(200).json({ venuesL: venues, eventCount: venuesLeast })
}

// export function
module.exports = {
    getVenues
}