const express = require('express');
const {
    getVenues,
    // getOneWorkout,
    // createWorkout,
    // deleteWorkout,
    // updateWorkout
} = require('../controllers/venueControllers')

const router = express.Router();

// get all 
router.get('/', getVenues)

// // get a single
// router.get('/:id', getOneWorkout)
// // post a new
// router.post('/', createWorkout)

// // delete a new
// router.delete('/:id', deleteWorkout)

// // update a new
// router.patch('/:id', updateWorkout)

module.exports = router;
