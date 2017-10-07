var margin = {
    top: 50,
    right: 20,
    bottom: 50,
    left: 100
},
    width = 720 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

//d3.select("#part6")
//    .append("p")
//    .text("New paragraph!");

//var dataset = [1, 2, 3]
//var p = d3.select("body").selectAll("p")
//    .data(dataset)
//    .enter()
//    .append("p")
//    .text(function (d) { return 'Hello ' + d; });

d3.csv("Car.csv", function (error, data) {
    scatterPlot(data, "yearOfRegistration", "price", "#part2a", "Year of Registration", "Car Price ($US)", "red", "Year of Registration vs. Price Scatterplot");
    scatterPlot(data, "price", "kilometer", "#part2b", "Car Price ($US)", "Kilometer", "blue", "Price vs. Kilometer Scatterplot");
    scatterPlot(data, "yearOfRegistration", "kilometer", "#part2c", "Year of Registration", "Kilometer", "green", "Year of Registration vs. Kilometer Scatterplot");
    scatterPlot2(data, "powerPS", "price", "gearbox", "#part5", "Power PS", "Car Price", "PowerPS vs. Car Price Scatterplot - Color Grouped by GearBox");
    scatterPlot3(data, "price", "kilometer", "powerPS", "#part6", "Car Price", "Kilometer", "Price vs. Kilometer Scatterplot - Area Grouped by PowerPS");
    barChart(data, "brand", "#part3", "Brand", "Number of Cars", "Number of Cars for each Brand Name");
    barChart(data, "vehicleType", "#part4", "Vehicle Type", "Number of Cars", "Number of Cars for each Vehicle Type");
});

// Function to Create scatterplot. Passing Arguments include: data, x, y, html element, x axis name, y axis name, color of circles, graph title.
function scatterPlot(data, x, y, element, xName, yName, color, graphTitle) {
    data.forEach(function (d) {
        d[x] = +d[x];
        d[y] = +d[y];
        //d.yearOfRegistration = +d.yearOfRegistration;
        //d.price = +d.price;
    });

    var xValue = function (d) { return +d[x]; },
        xScale = d3.scale.linear().range([0, width]),
        xMap = function (d) { return xScale(xValue(d)); },
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    var yValue = function (d) { return +d[y]; },
        yScale = d3.scale.linear().range([height, 0]),
        yMap = function (d) { return yScale(yValue(d)); },
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

    var tooltip = d3.select(element).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var svg = d3.select(element).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", 40)
        .style("text-anchor", "middle")
        .text(xName);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 65)
        .attr("x", 0 - (height / 2))
        .style("text-anchor", "middle")
        .text(yName);

    svg.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("text-decoration", "underline")
        .text(graphTitle);

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function (d) {
            return color;
        })
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d["name"] + "<br/> (" + xValue(d) + ", " + yValue(d) + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
};

function scatterPlot2(data, x, y, encode, element, xName, yName, graphTitle) {
    data.forEach(function (d) {
        d[x] = +d[x];
        d[y] = +d[y];
        //d.yearOfRegistration = +d.yearOfRegistration;
        //d.price = +d.price;
    });

    var xValue = function (d) { return +d[x]; },
        xScale = d3.scale.linear().range([0, width]),
        xMap = function (d) { return xScale(xValue(d)); },
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    var yValue = function (d) { return +d[y]; },
        yScale = d3.scale.linear().range([height, 0]),
        yMap = function (d) { return yScale(yValue(d)); },
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    // setup fill color
    var cValue = function (d) {
        return d[encode];
    },
        color = d3.scale.category10();

    xScale.domain([0, 1000]);
    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

    var tooltip = d3.select(element).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var svg = d3.select(element).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", 40)
        .style("text-anchor", "middle")
        .text(xName);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 65)
        .attr("x", 0 - (height / 2))
        .style("text-anchor", "middle")
        .text(yName);

    svg.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("text-decoration", "underline")
        .text(graphTitle);

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function (d) {
            return color(cValue(d));
        })
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d["name"] + "<br/> (" + xValue(d) + ", " + yValue(d) + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // draw legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
            return d;
        })
};

// Reference: http://bl.ocks.org/mpmckenna8/566509dd3d9a08e5f9b2
function scatterPlot3(data, x, y, encode, element, xName, yName, graphTitle) {
    data.forEach(function (d) {
        d[x] = +d[x];
        d[y] = +d[y];
        //d.yearOfRegistration = +d.yearOfRegistration;
        //d.price = +d.price;
    });

    var xValue = function (d) { return +d[x]; },
        xScale = d3.scale.linear().range([0, width]),
        xMap = function (d) { return xScale(xValue(d)); },
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    var yValue = function (d) { return +d[y]; },
        yScale = d3.scale.linear().range([height, 0]),
        yMap = function (d) { return yScale(yValue(d)); },
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    // setup fill color
    // var cValue = function (d) {
    //     return d[encode];
    // },
    //     color = d3.scale.category10();
    var rscale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return +d[encode]})])
        .range([3, 20])

    xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

    var tooltip = d3.select(element).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var svg = d3.select(element).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", 40)
        .style("text-anchor", "middle")
        .text(xName);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 65)
        .attr("x", 0 - (height / 2))
        .style("text-anchor", "middle")
        .text(yName);

    svg.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("text-decoration", "underline")
        .text(graphTitle);

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d){ return rscale(d[encode])})
        //.attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function (d) {
            return "red";
        })
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d["name"] + "<br/> (" + xValue(d) + ", " + yValue(d) + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
};

function barChart(data, attribute, element, xName, yName, graphTitle) {
    var margin = { top: 50, right: 20, bottom: 110, left: 100 };

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var tooltip = d3.select(element).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var svg = d3.select(element).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var groupData = d3.nest()
        .key(function (d) { return d[attribute]; })
        .rollup(function (v) { return v.length; })
        .entries(data);

    x.domain(groupData.map(function (d) { return d.key; }));
    y.domain([0, d3.max(groupData, function (d) { return +d.values; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .style("text-anchor", "middle")
        .text(xName)

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 65)
        .attr("x", 0 - (height / 2))
        .style("text-anchor", "middle")
        .text(yName);

    svg.append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("text-decoration", "underline")
        .text(graphTitle);

    svg.selectAll("bar")
        .data(groupData)
        .enter().append("rect")
        .style("fill", "steelblue")
        .attr("x", function (d) { return x(d.key); })
        .attr("width", x.rangeBand())
        .attr("y", function (d) { return y(+d.values); })
        .attr("height", function (d) { return height - y(+d.values); })
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.key + " - " + d.values)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0)
        });
}