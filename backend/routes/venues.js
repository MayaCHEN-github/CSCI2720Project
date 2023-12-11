const express = require('express');
const {
    getVenues,
    getByKeyword,
    getById,
    addComment
} = require('../controllers/venueControllers')

const router = express.Router();

// function 1: get 10 venus with at least 3 events.
router.get('/', getVenues)

// function 2: search keyword in venue name
router.get('/key/:key', getByKeyword)

// function 3: venue info + comments on it
router.get('/:id', getById)

// comments part
// add comment for venue id for user name
router.post('/comment', addComment)

module.exports = router;
