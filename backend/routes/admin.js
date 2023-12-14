const express = require('express');

const {
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
} = require('../controllers/adminControllers')

const router = express.Router();

//---- create read update delete on events
router.get('/event', readEvents)
router.get('/event/:id', readEvent)
router.post('/event', createEvent)

router.patch('/event/:id', updateEvent)

router.delete('/event/:id', deleteEvent)

//---- create read update delete on users
// read all
router.get('/user', readUsers)
router.get('/user/:name', readUser)
// create
router.post('/user', createUser)
// update
router.patch('/user/:name', updateUser)
// delete
router.delete('/user/:name', deleteUser)

module.exports = router;