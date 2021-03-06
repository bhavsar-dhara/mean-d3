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

        function createData(data) {
            // console.log("in client add");
            // console.log("DATA = " + data.year + "=" + data.value);
            return $http.post("/api/data/", data);
        }

        function findAllData() {
            // console.log("in client findall");
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