module.exports = function () {

    var mongoose = require('mongoose');

    var BarDataSchema = new mongoose.Schema({
        year: parseInt(Number),
        value: parseInt(Number),
        created_at: {type: Date, default: Date.now},
        updated_at: {type: Date, default: ''}
    }, {collection: "bar.data"});

    return BarDataSchema;
};