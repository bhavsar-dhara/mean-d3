module.exports = function () {

    var models = {
        barDataModel: require("./barData/model.js")(),
        uploadFileModel: require("./uploadFile/uploadFile.model.js")(),
        eventModel: require("./event/event.model.js")(),
        jsonImportModel: require("./jsonImport/jsonImport.model.js")(),
        fileImportModel: require("./fileImport/fileImport.model.js")()
    };
    return models;
};