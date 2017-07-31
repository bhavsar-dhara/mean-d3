module.exports = function () {

    var mongoose = require('mongoose');
    var BarDataSchema = require('./schema.js')();
    var Data = mongoose.model('Data', BarDataSchema);

    // Create APIs to manage calls from the UI
    var api = {
        createData: createData,
        findAllData: findAllData,
        findDataById: findDataById,
        updateData: updateData,
        deleteData: deleteData
    };
    return api;

    // Creates a new data instance
    function createData(data) {
        // console.log("in model add");
        // console.log("DATA = " + data.year + "=" + data.value);
        return Data.create(data);
    }

    // Retrieves all data instances
    function findAllData() {
        // console.log("in model findall");
        return Data.find();
    }

    // Retrieves single page instance whose _id is pageId
    function findDataById(dataId) {
        return Data.findById({_id: dataId});
    }

    // Updates page instance whose _id is pageId
    function updateData(dataId, data) {
        return Data
            .update({_id: dataId}, {
                $set: {
                    year: data.year,
                    value: data.value
                }
            });
    }

    // Removes page instance whose _id is pageId
    function deleteData(dataId) {
        return Data.remove({_id: dataId});
    }
};