(function () {
    angular
        .module("meanD3")
        .controller("MongoController", MongoController);

    function MongoController($scope, DataService) {

        function init() {
            $scope.year = (~~(Math.random()*2017)+1);
            $scope.value = (~~(Math.random()*999)+1);
        }
        init();

        $scope.onAdd = function () {
            console.log("in button click");
            console.log("in button click: " + $scope.year);
            console.log("in button click: " + $scope.value);
            var data = {
                year: $scope.year,
                value: $scope.value
            };
            // console.log("in controller add: " + $scope.year + "=" + $scope.value);
            // console.log("DATA = " + data.year + "=" + data.value);
            add($scope, DataService, data);
        };
        findAll($scope, DataService);
    }

    function add($scope, DataService, data) {
        DataService
            .createData(data)
            .then(function (response) {
                var addedData = response.data;
                if (addedData) {
                    findAll($scope, DataService);
                    // $location.url();
                    // console.log(addedData);
                } else {
                    $scope.error = "Unable to add Data";
                }
            });
    }

    function findAll($scope, DataService) {
        // console.log("in ctrl findall");
        DataService
            .findAllData()
            .then(function (response) {
                var datas = response.data;
                // console.log(JSON.stringify(datas));
                if (datas) {
                    // console.log("in ctrl rspns findall");
                    $scope.datas = datas;
                } else {
                    $scope.error = "Unable to retrieve Data";
                }
            });

    }
})();