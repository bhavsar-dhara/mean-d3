(function () {
    angular
        .module("meanD3")
        .controller("FileUploadController", FileUploadController);

    function FileUploadController($scope, FileService) {
        $scope.submit = function(){
            console.log($scope.upload);
            console.log($scope.upload.name);
            console.log($scope.upload.file);
            var newUpload = {
                name: $scope.upload.name,
                created: Date.now(),
                file: $scope.upload.file
            };
            FileService
                .saveFile(newUpload)
                .then(function (response) {
                    var file = response.data;
                    if (file) {
                        console.log("Successfully saved the file");
                    } else {
                        $scope.error = "Unable to save File";
                    }
                })
        };
    }
})();