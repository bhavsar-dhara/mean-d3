(function () {
    angular
        .module("meanD3")
        .controller("MainController", MainController);

    function MainController($location, $rootScope) {

        var vm = this; // viewModel = vm

        vm.d3Click = function() {
            $location.url("/d3Demo");
        }
    }
})();