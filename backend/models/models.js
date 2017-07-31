module.exports = function () {

    var models = {
        barDataModel: require("./barData/model.js")(),
        uploadFileModel: require("./uploadFile/uploadFile.model")()
    };
    return models;
};