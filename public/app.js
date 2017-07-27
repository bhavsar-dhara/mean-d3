module.exports = function (app) {

    var mongoose = require("mongoose");

    // connect to local database
    mongoose.connect('mongodb://localhost/meand3demo', { server: { socketOptions: { keepAlive: 1 } } });

};