(function () {
    angular
        .module("meanD3")
        .controller("FileUploadController", FileUploadController);

    function FileUploadController($scope, FileService, $routeParams, $location) {

        var vm = this;
        fileId = $routeParams.fileId;
        console.log(fileId);

        function init() {

            if(fileId !== undefined) {
                $scope.textStr = "Redirect Successful";
            }

        }
        init();
    }
})();