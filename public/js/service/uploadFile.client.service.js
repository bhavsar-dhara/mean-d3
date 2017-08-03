(function () {
    angular
        .module("meanD3")
        .factory("FileService", FileService);

    function FileService($http) {
        var api = {
            getFileDataById: getFileDataById
        };
        return api;

        function getFileDataById(fileId) {
            console.log("in getFileDataById client service");
            var url = "/api/file/" + fileId;
            return $http.get(url);
        }
    }
})();