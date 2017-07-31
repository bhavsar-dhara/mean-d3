(function () {
    angular
        .module("meanD3")
        .controller("MongoController", MongoController);

    function MongoController($rootScope, DataService) {
        $rootScope.year = (~~(Math.random()*2017)+1);
        $rootScope.value = (~~(Math.random()*999)+1);
        $rootScope.onAdd = function () {
            console.log("in button click");
            var data = {
                year: $rootScope.year,
                value: $rootScope.value
            };
            console.log("in controller add: " + $rootScope.year + "=" + $rootScope.value);
            console.log("DATA = " + data.year + "=" + data.value);
            DataService
                .createData(data)
                .then(function (response) {
                    var addedData = response.data;
                    if (addedData) {
                        // $location.url();
                        console.log(addedData);
                    } else {
                        $rootScope.error = "Unable to add Data";
                    }
                });
        }
    }
})();