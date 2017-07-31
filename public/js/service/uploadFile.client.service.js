(function () {
    angular
        .module("meanD3")
        .factory("FileService", FileService);

    function FileService($http) {
        var api = {
            saveFile: saveFile,
            getFile: getFile,
            getFileById: getFileById
        };
        return api;
        
        function saveFile(file) {
            console.log("in client saveFile");
        }
        
        function getFile() {
            
        }
        
        function getFileById() {
            
        }
    }
})();