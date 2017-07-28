module.exports = function () {

    var models = {
        barDataModel: require("./barData/model.js")()
    };
    return models;
};