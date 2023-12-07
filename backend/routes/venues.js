const express = require('express');
const {
    getVenues,
    getByKeyword,
    getById,
} = require('../controllers/venueControllers')

const router = express.Router();

// function 1: get 10 venus with at least 3 events.
router.get('/', getVenues)

// function 2: search keyword in venue name
router.get('/key/:key', getByKeyword)

// function 3: single venue page
router.get('/:id', getById)


module.exports = router;
