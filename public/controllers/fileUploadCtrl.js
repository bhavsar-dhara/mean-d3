(function () {
    angular
        .module("meanD3")
        .controller("FileUploadController", FileUploadController);

    function FileUploadController($scope, FileService, $routeParams, $location) {

        var vm = this;
        var fileId = $routeParams.fileId;
        // console.log(fileId);

        // d3.interval(function() {
        //     update(d3v4.shuffle(alphabet)
        //         .slice(0, Math.floor(Math.random() * 26))
        //         .sort());
        // }, 1500);

        function init() {

            if (fileId !== undefined) {
                scatterPlot(FileService, fileId, $scope);
                // lineChart(FileService, fileId, $scope);
                // chart(FileService, fileId, $scope);
                // $scope.textStr = "Redirect Successful";
            }
        }

        init();
    }

    function scatterPlot(FileService, fileId, $scope) {

        var arrayOfObjects, dataCallback, dataMap, data, regex1, regex2;

        // Adds the svg canvas
        // Set the dimensions of the canvas / graph
        // Define the div for the tooltip
        var svg = d3.select("svg#chart"),
            margin = {top: 30, right: 20, bottom: 30, left: 50},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            svg = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
            div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

        // Parse the date / time
        var parseTime = d3.time.format("%Y-%m-%d %H:%M:%S.%L").parse;
        var parseTimeMS = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
        var formatTime = d3.time.format("%Y-%m-%d %H:%M:%S.%L");

        // Set the ranges
        var x = d3.time.scale()
            .rangeRound([0, width]);

        var y = d3.scale.linear()
            .rangeRound([height, 0]);

        // helper function
        function getDate(d) {
            return new Date(d.TS);
        }

        // Define the axes
        var xAxis = d3.svg.axis().scale(x)
            .orient("bottom").ticks(5).tickFormat(d3.time.format("%H:%M:%S.%L"));

        var yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(15);

        // Define the line
        var line = d3.svg.line()
            .x(function (d) {
                return x(getDate(d));
            })
            .y(function (d) {
                return y(d.Bar);
            });

        // Get the data
        FileService
            .getFileDataById(fileId)
            .then(function (response) {
                var addedData = response.data.dataStr;
                arrayOfObjects = eval(addedData);

                if (arrayOfObjects) {

                    console.log("arrayOfObjects[0]" + JSON.stringify(arrayOfObjects[0]));

                    // regexp for yyyy-mm-dd hh:MM:ss.ss
                    regex1 = new RegExp("^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|0[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[0-5][0-9]):(0?[0-9]|[0-5][0-9]).([0-9][0-9])$");
                    // regexp for yyyy-mm-dd hh:MM:ss.s~0~
                    regex2 = new RegExp("^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|0[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[0-5][0-9]):(0?[0-9]|[0-5][0-9]).([0-9])$");

                    dataCallback = function (d) {
                        // console.log("date time = " + d.TS);
                        // console.log("... " + formatTime(new Date(d.TS)));
                        // console.log(".. : " + regex1.test(d.TS) ? console.log(parseTime(d.TS)) : (regex2.test(d.TS) ? console.log(parseTime(d.TS + '0')) : console.log(parseTimeMS(d.TS))))
                        d.TS = regex1.test(d.TS) ? parseTime(d.TS + '0') : (regex2.test(d.TS) ? parseTime(d.TS + '00') : parseTimeMS(d.TS));
                        d.RN = +d.RN;
                        d.Bar = +d.Bar;
                        d.mV = +d.mV;
                    };

                    arrayOfObjects.forEach(dataCallback);

                    dataMap = function (d) {
                        // console.log("milli = " + getMilliSeconds(d));
                        // console.log("date time = " + d.TS);
                        // console.log("... " + formatTime(new Date(d.TS)));
                        return {
                            RN: d.RN,
                            mV: d.mV,
                            TS: new Date(d.TS),
                            Bar: d.Bar
                        };
                    };

                    data = arrayOfObjects.map(dataMap);

                    // Setting data for the table
                    $scope.datas = data;

                    // Scale the range of the data
                    x.domain(d3.extent(data, function (d) {
                        return d.TS;
                    }));
                    y.domain([0, d3.max(data, function (d) {
                        return Math.ceil(d.Bar);
                    })]);

                    // Add the line path.
                    svg.append("path")
                        .attr("class", "line")
                        .attr("d", line(data));

                    // Add the scatterplot
                    svg.selectAll("dot")
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("r", 2)
                        .attr("cx", function (d) {
                            return x(getDate(d));
                        })
                        .attr("cy", function (d) {
                            return y(d.Bar);
                        })
                        .on("mouseover", function (d) {
                            div.transition()
                                .duration(200)
                                .style("opacity", 0.9);
                            div.html(formatTime(d.TS) + "<br/>" + d.Bar)
                                .style("left", (d3.event.pageX + 20) + "px")
                                .style("top", (d3.event.pageY + 20) + "px");
                        })
                        .on("mouseout", function (d) {
                            div.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });

                    // Add the X Axis
                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    // Add the Y Axis
                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Pressure (Bar)");
                }
            });

        d3.select('#chart').on("click", function() {
            console.log("in on click fn");
            var newData = [{"TS": "2017-04-23 00:00:02.11", "RN": "288043041", "Bar": "2.150", "mV": "933"}];

            newData.forEach(dataCallback);
            // dataCallback(newData);
            console.log("new1 = " + JSON.stringify(newData));
            newData.map(dataMap);
            // dataMap(newData);
            console.log("new2 = " + JSON.stringify(newData));
            // arrayOfObjects.splice(0,1);
            // arrayOfObjects.push(newData);
            // console.log(arrayOfObjects.length + " .. is length");
            // var length = arrayOfObjects.length - 1;
            // console.log(length + " .. is len");
            // dataCallback(arrayOfObjects[length]);
            //
            // data = arrayOfObjects.map(dataMap);

            console.log(JSON.stringify(data[0]) + ".......data");
            data.splice(0, 1);
            console.log("len1 = " + data.length);
            data.push(newData);
            // data.forEach(dataCallback);
            // data.map(dataMap);
            // dataCallback(data[data.length - 1]);
            // dataMap(data[data.length - 1]);
            console.log("len2 = " + data.length);
            console.log("new3 = " + JSON.stringify(data[data.length - 1]));

            $scope.datas = null;
            if ($scope.datas === null) {
                $scope.datas = data;
            }

            x.domain(d3.extent(data, function (d) {
                // console.log("TS = " + d.TS);
                return d.TS;
            }));
            y.domain([0, d3.max(data, function (d) {
                // console.log("Bar = " + d.Bar);
                return Math.ceil(d.Bar);
            })]);

            // redefine the axes
            var xAxis = d3.svg.axis().scale(x)
                .orient("bottom").ticks(5).tickFormat(d3.time.format("%H:%M:%S.%L"));

            var yAxis = d3.svg.axis().scale(y)
                .orient("left").ticks(15);

            d3.select("g.x.axis")
                .transition().duration(1000)
                .call(xAxis);
            d3.select("g.y.axis")
                .transition().duration(1000)
                .call(yAxis);
            d3.selectAll("path")
                .data(data)
                .attr("d", line(data));
            d3.selectAll("circle") // move the circles
                .transition().duration(1000)
                .delay(function (d,i) { return i*100})
                .attr("cx", function (d) {
                    return x(getDate(d));
                })
                .attr("cy", function (d) {
                    return y(d.Bar);
                });
        });

        function updateData() {

            // Get the data again

            // Scale the range of the data again
            x.domain(d3.extent(data, function (d) {
                // console.log("TS = " + d.TS);
                return d.TS;
            }));
            y.domain([0, d3.max(data, function (d) {
                // console.log("Bar = " + d.Bar);
                return d.Bar;
            })]);

            // Select the section we want to apply our changes to
            var svgUpdate = d3.select("chart").transition();

            // Make the changes
            svgUpdate.select("path")   // change the line
                .duration(750)
                .attr("d", line(data));
            svgUpdate.select("g.x.axis") // change the x axis
                .duration(750)
                .call(xAxis);
            svgUpdate.select("g.y.axis") // change the y axis
                .duration(750)
                .call(yAxis);

        }
    }

    // ======================================================================================================================================================================== //

    function lineChart(FileService, fileId, $scope) {
        // var d3v4 = require(d3v4);
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
                            RN: d.RN,
                            mV: d.mV,
                            TS: new Date(d.TS),
                            Bar: d.Bar
                        };
                    });

                    $scope.datas = data;

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