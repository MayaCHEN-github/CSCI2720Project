//model
const { Event } = require('../models/Models')
const mongoose = require('mongoose');


// function 4: get all event
const getEvents = async (req, res) => {
    const result = await Event.find({});
    res.status(200).json(result);
}

// export function
module.exports = {
    getEvents
}