// IIFE (immediately invoked function expression)
(function () {
    angular
        .module('meanD3', [])
        .controller('meanD3Controller', function AppCtrl ($scope) {
            $scope.options = {width: 600, height: 400, 'bar': 'aaa'};
            $scope.data = [1, 2, 3, 4];
            $scope.hovered = function (d) {
                $scope.barValue = d;
                $scope.$apply();
            };
            $scope.barValue = 'None';

            function init() {
                $scope.title = "Bar Chart Using AngularJS with D3 and MongoDB.";
            }
            init();
        })
        .directive('chartForm', function() {
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
        })
        .directive('barChart', function() {
            var chart = d3.custom.barChart();
            return {
                restrict: 'E',
                replace: true,
                template: '<div class="chart"></div>',
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
                }
            }
        })
        .directive('addData', function() {
            return {
                restrict: 'E',
                replace: true,
                controller: function AppCtrl ($scope, DataService) {
                    $scope.year = (~~(Math.random()*2017)+1);
                    $scope.value = (~~(Math.random()*999)+1);
                    $scope.onAdd = function () {
                        console.log("in button click");
                        var data = {
                            year: $scope.year,
                            value: $scope.value
                        };
                        console.log("in controller add: " + $scope.year + "=" + $scope.value);
                        console.log("DATA = " + data.year + "=" + data.value);
                        DataService
                            .createData(data)
                            .then(function (response) {
                                var addedData = response.data;
                                if (addedData) {
                                    // $location.url();
                                    console.log(addedData);
                                } else {
                                    scope.error = "Unable to add Data";
                                }
                            });
                    }
                },
                template: '<div class="form">' +
                '<h1> Add Data to Mongo DB </h1>' +
                'Year: <input type="number" ng-model="year" maxlength="4" max="2017">' +
                '<br />Value: <input type="number" ng-model="value" maxlength="3" min="0">' +
                '<br /><button ng-click="onAdd()">Add Data</button>' +
                '<br />Added bar data: {{year}}, {{value}}' +
                '<br />Error: {{error}}' +
                '</div>'
            }
        });
})();
