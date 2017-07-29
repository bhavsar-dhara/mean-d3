(function () {
    angular
        .module("meanD3")
        .factory("DataService", DataService);

    function DataService($http) {
        var api = {
            createData: createData,
            findAllData: findAllData,
            findDataById: findDataById,
            updateData: updateData,
            deleteData: deleteData
        };
        return api;

        // var mongoose = require('mongoose');
        //
        // var BarDataSchema = require('/backend/models/barData/schema.js')();
        //
        // var Data = mongoose.model('BarData', BarDataSchema);

        function createData(data) {
            console.log("in client add");
            console.log("DATA = " + data.year + "=" + data.value);
            return $http.post("/api/data/", data);

            // Data.create(data, function (err, data) {
            //     if (err) console.log(err);
            //     else console.log(data);
            // });
        }

        function findAllData() {
            var url = "/api/data/";
            return $http.get(url);
        }

        function findDataById(dataId) {
            var url = "/api/data/" + dataId;
            return $http.get(url);
        }

        function updateData(dataId, data) {
            var url = "/api/data/" + dataId;
            return $http.put(url, data);
        }

        function deleteData(dataId) {
            var url = "/api/data/" + dataId;
            return $http.delete(url);
        }
    }
})();