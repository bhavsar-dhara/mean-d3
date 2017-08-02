(function () {
    angular
        .module("meanD3")
        .controller("FileUploadController", FileUploadController)
        .directive("ChartForm", ChartForm)
        .directive('barChart', BarChart);

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

    function ChartForm() {
        return {
            restrict: 'E',
            replace: true,
            controller: function AppCtrl ($scope) {
                $scope.update = function(d, i){ $scope.data = randomData(); };
                function randomData(){
                    return d3.range(~~(Math.random()*25)+1).map(function(d, i){return ~~(Math.random()*500);});
                }
            },
            template: '<div class="form">' +
            'Height: {{options.height}}<br />' +
            '<input type="range" ng-model="options.height" min="100" max="800"/>' +
            '<br /><button ng-click="update()">Update Data</button>' +
            '<br />Hovered bar data: {{barValue}}</div>'
        }
    }

    function BarChart() {
        var chart = d3.custom.barChart();
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope:{
                height: '=height',
                data: '=data',
                hovered: '&hovered'
            },
            link: function(scope, element, attrs) {
                var chartEl = d3.select(element[0]);
                chart.on('customHover', function(d, i){
                    scope.hovered({args:d});
                });

                scope.$watch('data', function (newVal, oldVal) {
                    chartEl.datum(newVal).call(chart);
                });

                scope.$watch('height', function(d, i){
                    chartEl.call(chart.height(scope.height));
                })
            },
            template: '<div class="chart"></div>'
        }
    }

})();