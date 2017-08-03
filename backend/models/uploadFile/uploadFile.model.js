module.exports = function () {

    var mongoose = require('mongoose');
    var UploadFileSchema = require('./uploadFile.schema.js')();
    var File = mongoose.model('File', UploadFileSchema);

    // Create APIs to manage calls from the UI
    var api = {
        saveFile: saveFile,
        getFile: getFile,
        getFileById: getFileById
    };
    return api;

    function saveFile(uploadFile) {
        console.log("in model saveFile");
        return File.create(uploadFile);
    }

    function getFile() {
        console.log("in model getFile");
    }

    function getFileById(fileId) {
        console.log("in model getFileById");
        return File.findById(fileId);
    }

};