module.exports = function () {

    var mongoose = require('mongoose'),
        assert = require('assert');

    var JsonSchema = require('./jsonImport.schema.js')();
    var JsonImport = mongoose.model('JsonImport', JsonSchema);

    // Create APIs to manage calls from the UI
    var api = {
        insertData: insertData
    };
    return api;

    function insertData(data) {
        console.log("in insertData");
        return JsonImport.collection.insertMany(data);
        /*, function (err, res) {
            assert.equal(null, err);
            assert.equal(50, res.insertedCount);
            if (err) console.err(err);
            console.log("Success");
        })*/
    }
};