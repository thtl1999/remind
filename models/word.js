var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var wordSchema = new Schema({
    str: String,
    mine: [String]
});

module.exports = mongoose.model('word', wordSchema);