module.exports = function () {

    var mongoose = require('mongoose');

    var UploadSchema = mongoose.Schema({
        name: String,
        created: Date,
        file: Object
    }, {collection: "file.data"});

    return UploadSchema;
};