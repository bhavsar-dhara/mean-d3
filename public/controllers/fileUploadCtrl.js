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
        var parseTimeMS = d3.timeParse("%Y-%m-%d %H:%M:%S");
        var formatTime = d3.timeFormat("%Y-%m-%d %H:%M:%S.%L" || "%Y-%m-%d %H:%M:%S");

        var x = d3.scaleTime()
            .rangeRound([0, width]);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        // helper function
        function getDate(d) {
            return new Date(d.TS);
        }

        function getMilliSeconds(d) {
            console.log(".. " + formatTime(new Date(d.TS)));
            return d.TS.getTime();
        }

        // var area = d3.area()
        //     .x(function (d) {
        //         return x(d.date);
        //     })
        //     .y1(function (d) {
        //         return y(d.close);
        //     });

        var area = d3.area()
            .x(function (d) {
                return x(getDate(d));
            })
            .y1(function (d) {
                return y(d.Bar);
            });

        // workingChart(x, y, area, g, parseTime, height);

        requiredChart(x, y, area, g, parseTime, formatTime, width, height,
            margin, FileService, fileId, getDate, getMilliSeconds, parseTimeMS);
    }

    function requiredChart(x, y, area, g, parseTime, formatTime, width, height,
                           margin, FileService, fileId, getDate, getMilliSeconds, parseTimeMS) {
        FileService
            .getFileDataById(fileId)
            .then(function (response) {
                var addedData = response.data.dataStr;
                var arrayOfObjects = eval(addedData);

                if (arrayOfObjects) {

                    arrayOfObjects.forEach(function (d) {
                        // var regex = new RegExp("^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9]).?(0?[0-9]?[0-9]?)$");
                            // /(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2}).(\d{3})/

                        // regexp for yyyy-mm-dd hh:mm:ss.ss
                        var regex1 = new RegExp("^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|0[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[0-5][0-9]):(0?[0-9]|[0-5][0-9]).([0-9][0-9])$");
                        // regexp for yyyy-mm-dd hh:mm:ss.s~0~
                        var regex2 = new RegExp("^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|0[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[0-5][0-9]):(0?[0-9]|[0-5][0-9]).([0-9])$");
                        // console.log( ",,, " + d.TS);
                        // console.log( ",,, ,,, " + regex1.test(d.TS));
                        // console.log( ",,, ,,, ,,, " + regex2.test(d.TS));
                        d.TS = regex1.test(d.TS) ? parseTime(d.TS) : (regex2.test(d.TS) ? parseTime(d.TS + '0') : parseTimeMS(d.TS));
                        d.RN = +d.RN;
                        d.Bar = +d.Bar;
                        d.mV = +d.mV;
                    });

                    var data = arrayOfObjects.map(function(d) {
                        console.log(d.TS);
                        // console.log("... " + formatTime(new Date(d.TS)));
                        // console.log(d.Bar);
                        console.log("milli = " + getMilliSeconds(d));
                        return {
                            TS: new Date(d.TS),
                            Bar: d.Bar
                        };
                    });

                    // get max and min dates - this assumes data is sorted
                    var minDate = getDate(data[0]),
                        maxDate = getDate(data[data.length-1]);

                    // var x = d3.time.scale().domain([minDate, maxDate]).range([0, w]);

                    // calculate min and max data values
                    // const timeMin = d3.min(data, function (d) { formatTime(d.TS) });
                    // const timeMax = d3.max(data, function(d) { formatTime(d.TS) });

                    console.log(minDate);
                    console.log(maxDate);

                    // x.domain([minDate, maxDate]);
                    x.domain(d3.extent(data, function (d) {
                        return d.TS;
                    }));
                    y.domain([0, d3.max(data, function (d) {
                        return Math.ceil(d.Bar);
                    })]);
                    area.y0(y(0));

                    g.append("path")
                        .datum(data)
                        .attr("fill", "steelblue")
                        .attr("d", area);

                    g.append("g")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x))
                        .attr("transform",
                            "translate(" + (width/2) + " ," +
                            (height + margin.top + 20) + ")")
                        .append("text")
                        // .attr("class", "label")
                        // .attr("x", width)
                        // .attr("y", -6)
                        .style("text-anchor", "end")
                        .text("DateTime");

                    g.append("g")
                        .call(d3.axisLeft(y))
                        .append("text")
                        .attr("fill", "#000")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", "0.71em")
                        .attr("text-anchor", "end")
                        .text("Pressure (Bar)");
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

    function testLineGraph() {
        FileService
            .getFileDataById(fileId)
            .then(function (response) {
                var addedData = response.data.dataStr;
                // Data for the line graph
                var arrayOfObjects = eval(addedData);

                if (arrayOfObjects) {

                    //The accessor function we talked about above
                    var lineFunction = d3.svg.line()
                        .x(function(d) { return d.x; })
                        .y(function(d) { return d.y; })
                        .interpolate("linear");

                    //The SVG Container
                    var svgContainer = d3.select("body").append("svg")
                        .attr("width", 200)
                        .attr("height", 200);

                    //The line SVG Path we draw
                    var lineGraph = svgContainer.append("path")
                        .attr("d", lineFunction(lineData))
                        .attr("stroke", "blue")
                        .attr("stroke-width", 2)
                        .attr("fill", "none");

                } else {
                    $scope.error = "Unable to plot Data";
                }
            });
    }

})();