module.exports = function () {

    var mongoose = require('mongoose');

    var FileDataSchema = mongoose.Schema({
        dataStr: String,
        created_at: {type: Date, default: Date.now}
    }, {collection: "json.file.data"});

    return FileDataSchema;
};