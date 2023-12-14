const express = require('express');
const {
    readFavor,
    addFavor,
    deleteFavor
} = require('../controllers/userControllers')


const router = express.Router();

//------ list all favor for the user name
router.get('/:name', readFavor)
// add new favor for venue id for user name
router.post('/', addFavor)
// delete favor for venue id for user name
router.delete('/', deleteFavor)

module.exports = router;