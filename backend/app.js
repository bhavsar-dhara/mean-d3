module.exports = function (app) {

    var mongoose = require('mongoose');

    mongoose.connect('mongodb://localhost/meanD3Demo', { useMongoClient: true });

    mongoose.Promise = global.Promise;

    var models = require("./models/models.js")();

    require("./services/barData.service.js")(app, models);
    require("./services/uploadFile.service.js")(app, models);

};