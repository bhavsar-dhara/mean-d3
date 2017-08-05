(function () {
    angular
        .module("meanD3")
        .controller("FileUploadController", FileUploadController);

    function FileUploadController($scope, FileService, $routeParams, $location) {

        var vm = this;
        var fileId = $routeParams.fileId;
        // console.log(fileId);

        function init() {

            if (fileId !== undefined) {
                lineChart(FileService, fileId, $scope);
                // chart(FileService, fileId, $scope);
                // $scope.textStr = "Redirect Successful";
            }
        }

        init();
    }

    function lineChart(FileService, fileId, $scope) {
        var d3v4 = require(d3v4);
        var svg = d3v4.select("svg"),
            margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var parseTime = d3v4.timeParse("%Y-%m-%d %H:%M:%S.%L");
        var parseTimeMS = d3v4.timeParse("%Y-%m-%d %H:%M:%S");

        var x = d3v4.scaleTime()
            .rangeRound([0, width]);

        var y = d3v4.scaleLinear()
            .rangeRound([height, 0]);

        // helper function
        function getDate(d) {
            return new Date(d.TS);
        }

        function getMilliSeconds(d) {
            // console.log(".. " + formatTime(new Date(d.TS)));
            return d.TS.getTime();
        }

        var line = d3v4.line()
            .x(function(d) { return x(getDate(d)); })
            .y(function(d) { return y(d.Bar); });

        FileService
            .getFileDataById(fileId)
            .then(function (response) {
                var addedData = response.data.dataStr;
                var arrayOfObjects = eval(addedData);

                if (arrayOfObjects) {

                    // regexp for yyyy-mm-dd hh:MM:ss.ss
                    var regex1 = new RegExp("^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|0[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[0-5][0-9]):(0?[0-9]|[0-5][0-9]).([0-9][0-9])$");
                    // regexp for yyyy-mm-dd hh:MM:ss.s~0~
                    var regex2 = new RegExp("^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|0[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[0-5][0-9]):(0?[0-9]|[0-5][0-9]).([0-9])$");

                    arrayOfObjects.forEach(function (d) {
                        // console.log("date time = " + d.TS);
                        // console.log("... " + formatTime(new Date(d.TS)));
                        // console.log(".. : " + regex1.test(d.TS) ? console.log(parseTime(d.TS)) : (regex2.test(d.TS) ? console.log(parseTime(d.TS + '0')) : console.log(parseTimeMS(d.TS))))
                        d.TS = regex1.test(d.TS) ? parseTime(d.TS + '0') : (regex2.test(d.TS) ? parseTime(d.TS + '00') : parseTimeMS(d.TS));
                        d.RN = +d.RN;
                        d.Bar = +d.Bar;
                        d.mV = +d.mV;
                    });

                    var data = arrayOfObjects.map(function (d) {
                        // console.log("milli = " + getMilliSeconds(d));
                        // console.log("date time = " + d.TS);
                        // console.log("... " + formatTime(new Date(d.TS)));
                        return {
                            TS: new Date(d.TS),
                            Bar: d.Bar
                        };
                    });

                    x.domain(d3v4.extent(data, function (d) {
                        return d.TS;
                    }));
                    y.domain([0, d3v4.max(data, function (d) {
                        return Math.ceil(d.Bar);
                    })]);

                    g.append("g")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3v4.axisBottom(x)
                            .ticks(5)
                            .tickFormat(d3v4.timeFormat("%H:%M:%S.%L")))
                        .append("text")
                        .style("text-anchor", "end")
                        .text("Time")
                        .select(".domain")
                        .remove();

                    g.append("g")
                        .call(d3v4.axisLeft(y))
                        .append("text")
                        .attr("fill", "#000")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", "0.71em")
                        .attr("text-anchor", "end")
                        .text("Pressure (Bar)");

                    g.append("path")
                        .datum(data)
                        .attr("fill", "none")
                        .attr("stroke", "steelblue")
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("stroke-width", 1.5)
                        .attr("d", line);
                }
            });

        // d3v4.tsv("data.tsv", function(d) {
        //     d.date = parseTime(d.date);
        //     d.close = +d.close;
        //     return d;
        // }, function(error, data) {
        //     if (error) throw error;
        //
        //     x.domain(d3v4.extent(data, function(d) { return d.date; }));
        //     y.domain(d3v4.extent(data, function(d) { return d.close; }));
        //
        //     g.append("g")
        //         .attr("transform", "translate(0," + height + ")")
        //         .call(d3v4.axisBottom(x))
        //         .select(".domain")
        //         .remove();
        //
        //     g.append("g")
        //         .call(d3v4.axisLeft(y))
        //         .append("text")
        //         .attr("fill", "#000")
        //         .attr("transform", "rotate(-90)")
        //         .attr("y", 6)
        //         .attr("dy", "0.71em")
        //         .attr("text-anchor", "end")
        //         .text("Price ($)");
        //
        //     g.append("path")
        //         .datum(data)
        //         .attr("fill", "none")
        //         .attr("stroke", "steelblue")
        //         .attr("stroke-linejoin", "round")
        //         .attr("stroke-linecap", "round")
        //         .attr("stroke-width", 1.5)
        //         .attr("d", line);
        // });

    }

    function chart(FileService, fileId, $scope) {
        var svg = d3v4.select("svg"),
            margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var parseTime = d3v4.timeParse("%Y-%m-%d %H:%M:%S.%L");
        var parseTimeMS = d3v4.timeParse("%Y-%m-%d %H:%M:%S");
        var formatTime = d3v4.timeFormat("%Y-%m-%d %H:%M:%S.%L");

        var x = d3v4.scaleTime()
            .rangeRound([0, width]);

        var y = d3v4.scaleLinear()
            .rangeRound([height, 0]);

        // helper function
        function getDate(d) {
            return new Date(d.TS);
        }

        function getMilliSeconds(d) {
            // console.log(".. " + formatTime(new Date(d.TS)));
            return d.TS.getTime();
        }

        // var area = d3v4.area()
        //     .x(function (d) {
        //         return x(d.date);
        //     })
        //     .y1(function (d) {
        //         return y(d.close);
        //     });

        var area = d3v4.area()
            .x(function (d) {
                return x(getDate(d));
            })
            .y1(function (d) {
                return y(d.Bar);
            });

        // workingChart(x, y, area, g, parseTime, height);

        requiredChart(x, y, area, g, parseTime, formatTime, width, height,
            margin, FileService, fileId, getDate, getMilliSeconds, parseTimeMS, $scope);
    }

    function requiredChart(x, y, area, g, parseTime, formatTime, width, height,
                           margin, FileService, fileId, getDate, getMilliSeconds, parseTimeMS, $scope) {
        FileService
            .getFileDataById(fileId)
            .then(function (response) {
                var addedData = response.data.dataStr;
                var arrayOfObjects = eval(addedData);

                if (arrayOfObjects) {

                    // regexp for yyyy-mm-dd hh:MM:ss.ss
                    var regex1 = new RegExp("^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|0[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[0-5][0-9]):(0?[0-9]|[0-5][0-9]).([0-9][0-9])$");
                    // regexp for yyyy-mm-dd hh:MM:ss.s~0~
                    var regex2 = new RegExp("^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|0[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[0-5][0-9]):(0?[0-9]|[0-5][0-9]).([0-9])$");

                    arrayOfObjects.forEach(function (d) {
                        // console.log("date time = " + d.TS);
                        // console.log("... " + formatTime(new Date(d.TS)));
                        // console.log(".. : " + regex1.test(d.TS) ? console.log(parseTime(d.TS)) : (regex2.test(d.TS) ? console.log(parseTime(d.TS + '0')) : console.log(parseTimeMS(d.TS))))
                        d.TS = regex1.test(d.TS) ? parseTime(d.TS + '0') : (regex2.test(d.TS) ? parseTime(d.TS + '00') : parseTimeMS(d.TS));
                        d.RN = +d.RN;
                        d.Bar = +d.Bar;
                        d.mV = +d.mV;
                    });

                    var data = arrayOfObjects.map(function(d) {
                        // console.log("milli = " + getMilliSeconds(d));
                        // console.log("date time = " + d.TS);
                        // console.log("... " + formatTime(new Date(d.TS)));
                        return {
                            TS: new Date(d.TS),
                            Bar: d.Bar
                        };
                    });

                    // get max and min dates - this assumes data is sorted
                    // var minDate = getDate(data[0]),
                    //     maxDate = getDate(data[data.length-1]);

                    // var x = d3v4.time.scale().domain([minDate, maxDate]).range([0, w]);

                    // calculate min and max data values
                    // const timeMin = d3v4.min(data, function (d) { formatTime(d.TS) });
                    // const timeMax = d3v4.max(data, function(d) { formatTime(d.TS) });

                    // console.log(minDate);
                    // console.log(maxDate);

                    // x.domain([minDate, maxDate]);
                    x.domain(d3v4.extent(data, function (d) {
                        return d.TS;
                    }));
                    y.domain([0, d3v4.max(data, function (d) {
                        return Math.ceil(d.Bar);
                    })]);
                    area.y0(y(0));

                    g.append("path")
                        .datum(data)
                        .attr("fill", "steelblue")
                        .attr("d", area);

                    g.append("g")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3v4.axisBottom(x)
                            .ticks(5)
                            .tickFormat(d3v4.timeFormat("%H:%M:%S.%L")))
                        .append("text")
                        .style("text-anchor", "end")
                        .text("DateTime");

                    g.append("g")
                        .call(d3v4.axisLeft(y))
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
        d3v4.tsv("data.tsv", function (d) {
            d.date = parseTime(d.date);
            d.close = +d.close;
            return d;
        }, function (error, data) {
            if (error) throw error;

            x.domain(d3v4.extent(data, function (d) {
                return d.date;
            }));
            y.domain([0, d3v4.max(data, function (d) {
                return d.close;
            })]);
            area.y0(y(0));

            g.append("path")
                .datum(data)
                .attr("fill", "steelblue")
                .attr("d", area);

            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3v4.axisBottom(x));

            g.append("g")
                .call(d3v4.axisLeft(y))
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
                    var lineFunction = d3v4.svg.line()
                        .x(function(d) { return d.x; })
                        .y(function(d) { return d.y; })
                        .interpolate("linear");

                    //The SVG Container
                    var svgContainer = d3v4.select("body").append("svg")
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