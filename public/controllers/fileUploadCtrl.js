(function () {
    angular
        .module("meanD3")
        .controller("FileUploadController", FileUploadController);

    function FileUploadController($scope, FileService, $routeParams, $location) {

        var vm = this;
        var fileId = $routeParams.fileId;
        console.log(fileId);

        function init() {

            if (fileId !== undefined) {
                chart(FileService, fileId, $scope);
                // $scope.textStr = "Redirect Successful";
            }
        }

        init();
    }

    function chart(FileService, fileId, $scope) {
        var svg = d3.select("svg"),
            margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");

        var x = d3.scaleTime()
            .rangeRound([0, width]);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        // var area = d3.area()
        //     .x(function (d) {
        //         return x(d.date);
        //     })
        //     .y1(function (d) {
        //         return y(d.close);
        //     });

        var area = d3.area()
            .x(function (d) {
                return x(d.TS);
            })
            .y1(function (d) {
                return y(d.Bar);
            });

        // workingChart(x, y, area, g, parseTime, height);

        requiredChart(x, y, area, g, parseTime, height, FileService, fileId);
    }

    function requiredChart(x, y, area, g, parseTime, height, FileService, fileId) {
        FileService
            .getFileDataById(fileId)
            .then(function (response) {
                // console.log("id = " + response.data._id);
                // console.log("data = " + response.data.dataStr);
                // console.log("createdDate = " + response.data.created_at);
                var addedData = response.data.dataStr;
                var arrayOfObjects = eval(addedData);

                if (arrayOfObjects) {

                    var dataCallback = function (d) {
                        d.TS = parseTime(d.TS);
                        d.RN = +d.RN;
                        d.Bar = +d.Bar;
                        d.mV = +d.mV;
                    };

                    // console.log("length array = " + arrayOfObjects.length);
                    // console.log("length data = " + addedData.length);

                    arrayOfObjects.forEach(dataCallback);

                    // for (var i = 0; i < arrayOfObjects.length; i++) {
                    //     var object = arrayOfObjects[i];
                    //     // for (var property in object) {
                    //     //     console.log('item ' + i + ': ' + property + '=' + object[property]);
                    //     // }
                    //     // If property names are known beforehand, you can also just do e.g.
                    //     console.log(object.TS + ';' + object.RN + ';' + object.Bar + ';' + object.mV);
                    //
                    // }

                    // console.log("addedData[0] = " + addedData[0]);
                    // console.log("addedData[1] = " + addedData[1]);
                    // console.log("addedData[2] = " + addedData[2]);

                    var data = arrayOfObjects.map(function(d) {
                        return {
                            TS: new Date(d.TS),
                            Bar: d.Bar
                        };
                    });

                    // console.log("length data = " + data.length);
                    // for (var j = 0; i < data.length; i++) {
                    //     var obj = data[i];
                    //     // for (var property in object) {
                    //     //     console.log('item ' + i + ': ' + property + '=' + object[property]);
                    //     // }
                    //     // If property names are known beforehand, you can also just do e.g.
                    //     console.log(obj.TS + ';' + obj.Bar);
                    //
                    // }

                    x.domain(d3.extent(data, function (d) {
                        return d.TS;
                    }));
                    y.domain([0, d3.max(data, function (d) {
                        return d.Bar;
                    })]);
                    area.y0(y(0));

                    g.append("path")
                        .datum(data)
                        .attr("fill", "steelblue")
                        .attr("d", area);

                    g.append("g")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x));

                    g.append("g")
                        .call(d3.axisLeft(y))
                        .append("text")
                        .attr("fill", "#000")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", "0.71em")
                        .attr("text-anchor", "end")
                        .text("Pressure (Bar)");

                    // console.log("response received...");
                } else {
                    $scope.error = "Unable to plot Data";
                }
            });

    }

    function workingChart(x, y, area, g, parseTime, height) {
        d3.tsv("data.tsv", function (d) {
            d.date = parseTime(d.date);
            d.close = +d.close;
            return d;
        }, function (error, data) {
            if (error) throw error;

            x.domain(d3.extent(data, function (d) {
                return d.date;
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.close;
            })]);
            area.y0(y(0));

            g.append("path")
                .datum(data)
                .attr("fill", "steelblue")
                .attr("d", area);

            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            g.append("g")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Price ($)");
        });
    }

})();