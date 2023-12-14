const { User } = require('../models/User')
const { Venue } = require('../models/Models')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// login user
const loginUser = async (req, res) => {
    const { name, password } = req.body;
    // check if empty
    if (!name || !password) {
        res.status(400).json({ error: "all field must be filled" })
    }
    const user = await User.findOne({ name });
    if (!user) {
        res.status(404).json({ error: "no such user" });
        return;
    }
    const storedHashedPassword = user.password;
    const isValid = await bcrypt.compare(password, storedHashedPassword);
    if (isValid) {
        res.status(200).json({ name: user.name, type: user.type, favor: user.favor });
    } else {
        res.status(400).json({ error: "incorrect password" });
    }
}

// list all favor
const readFavor = async (req, res) => {
    const name = req.params.name; // Corrected line
    const user = await User.findOne({ name });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const favor = user.favor;
    res.status(200).json(favor);
}

// add favor
const addFavor = async (req, res) => {
    const { name, venueId } = req.body;
    const user = await User.findOne({ name: name });
    let favor = user.favor;

    favor.push(venueId);
    const newUser = await User.findOneAndUpdate(
        { name: name },
        { favor: favor },
        { returnDocument: 'after' }
    );
    res.status(200).json(newUser.favor);
}
// delete favor
const deleteFavor = async (req, res) => {
    const { name, venueId } = req.body;
    const user = await User.findOne({ name: name });
    let favor = user.favor;
    const index = favor.indexOf(venueId);
    favor.splice(index, 1);
    const newUser = await User.findOneAndUpdate(
        { name: name },
        { favor: favor },
        { returnDocument: 'after' }
    );
    res.status(200).json(newUser.favor);
}

// export function
module.exports = {
    readFavor,
    addFavor,
    deleteFavor,
    loginUser
}