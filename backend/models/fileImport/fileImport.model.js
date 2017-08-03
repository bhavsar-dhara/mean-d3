module.exports = function () {

    var mongoose = require('mongoose'),
        assert = require('assert');

    var FileDataSchema = require('./fileImport.schema.js')();
    var FileImport = mongoose.model('FileImport', FileDataSchema);

    // Create APIs to manage calls from the UI
    var api = {
        insertFileData: insertFileData,
        getFileDataById: getFileDataById
    };
    return api;

    function insertFileData(data) {
        return FileImport.create(data);
    }

    function getFileDataById(dataId) {
        return FileImport.findById(dataId);
    }
};