// Element's schema

const mongoose = require('mongoose');

const elementSchema = mongoose.Schema({
    //id: Number,
    title: String,
    description: String,
    status: String,
    expiringDate: Date
});

module.exports = mongoose.model('Element', elementSchema);