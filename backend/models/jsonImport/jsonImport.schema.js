module.exports = function () {

    var mongoose = require('mongoose');

    var JsonSchema = mongoose.Schema({
        timeStamp_TS: Date,
        record_RN: String,
        pressure_Bar: parseFloat(Number),
        volt_mV: parseFloat(Number),
        created_at: {type: Date, default: Date.now}
    }, {collection: "json.data"});

    return JsonSchema;
};