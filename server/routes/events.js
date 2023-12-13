const express = require('express');
const {
    getEvents,
} = require('../controllers/eventControllers')

const router = express.Router();

// function 4: get all event
router.get('/', getEvents)


module.exports = router;
