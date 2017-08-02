(function () {
    angular
        .module("meanD3")
        .config(Config);

    function Config($routeProvider, $locationProvider, $sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(['self',
            new RegExp('^(http[s]?):\/\/(w{3}.)?maps.googleapis\.com/.+$'),
            new RegExp('^(http[s]?):\/\/(w{3}.)?api.eventful\.com/.+$')]);
        $routeProvider
            .when("/", {
                templateUrl: "views/main.html",
                controller: "MainController",
                controllerAs: "ctrl"
            })
            .when("/d3Demo", {
                templateUrl: "views/d3Demo.html",
                controller: "D3Controller",
                controllerAs: "ctrl"
            })
            .when("/mongoDemo", {
                templateUrl: "views/mongoDemo.html",
                controller: "MongoController",
                controllerAs: "ctrl"
            })
            .when("/fileUploadDemo", {
                templateUrl: "views/fileUploadDemo.html",
                controller: "FileUploadController",
                controllerAs: "ctrl"
            })
            .when("/fileUploadDemo/:fileId/plot", {
                templateUrl: "views/fileUploadSuccessfulDemo.html",
                controller: "FileUploadController",
                controllerAs: "ctrl"
            })
            .when("/realTimeDemo", {
                templateUrl: "views/realTimeDemo.html",
                controller: "RealTimeController",
                controllerAs: "ctrl"
            })
            .when("/googleMapDemo", {
                templateUrl: "views/googleMapDemo.html",
                controller: "GoogleMapController",
                controllerAs: "ctrl"
            })
            .otherwise({
                redirectTo: "/"
            });
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('');
    }
})();