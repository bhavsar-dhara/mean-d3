module.exports = function (app) {

    var mongoose = require('mongoose');

    mongoose.connect('mongodb://localhost/meanD3Demo', { useMongoClient: true });

    // To remove deprecated function warning
    // mongoose.connection.openUri('mongodb://localhost/meanD3Demo', {  });
    //server: {socketOptions: {keepAlive: 1}}

    // Use native promises
    mongoose.Promise = global.Promise;

    var models = require("./models/models.js")();

    require("./services/barData.service.js")(app, models);

    // // Create a schema
    // var BarDataSchema = new mongoose.Schema({
    //     year: parseInt(Number),
    //     value: parseInt(Number),
    //     created_at: {type: Date, default: Date.now},
    //     updated_at: {type: Date, default: ''}
    // }, {collection: "bar.data"});
    //
    // // Create a model based on the schema
    // var Data = mongoose.model('Data', BarDataSchema);

    // // Create a data in memory
    // var data = new Data({year: '1990', value: '345'});

    // Save it to database
    // data.save(function (err) {
    //     if (err)
    //         console.log(err);
    //     else
    //         console.log(data);
    // });

    // Creating and saving a data
    // Data.create({year: '1998', value: '999'}, function (err, data) {
    //     if (err) console.log(err);
    //     else console.log(data);
    // });

    // Find all data in the Data collection
    // Data.find(function (err, todos) {
    //     if (err) return console.error(err);
    //     console.log(todos)
    // });


};