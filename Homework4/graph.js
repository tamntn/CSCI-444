// Function to generate random color
// Reference: http://bl.ocks.org/jdarling/06019d16cb5fd6795edf
var randomColor = (function () {
    var golden_ratio_conjugate = 0.618033988749895;
    var h = Math.random();

    var hslToRgb = function (h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return '#' + Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
    };

    return function () {
        h += golden_ratio_conjugate;
        h %= 1;
        return hslToRgb(h, 0.5, 0.60);
    };
})();

/****************************************** PIE CHART ********************************************/
// Pie chart showing the frequency of the column "brand"
// Discard brand with frequency less than 100
// Visual should have proper labeling of the pies with the brand name and frequency
// Reference: http://bl.ocks.org/Potherca/b9f8b3d0a24e0b20f16d
d3.csv("Car.csv", function (error, data) {
    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    var width = 960 - margin.left - margin.right;
    var height = 640 - margin.top - margin.bottom;
    var r = height / 2;

    // Nesting Value for Brand Frequency
    var groupData = d3.nest()
        .key(function (d) { return d['brand']; })
        .rollup(function (v) { return v.length; })
        .entries(data);

    // Filtering Values > 100
    groupData = groupData.filter(function (d) {
        return d.values > 100;
    });

    var vis = d3.select('#part1').append("svg")
        .data([groupData])
        .attr("width", width)
        .attr("height", height).append("g")
        .attr("transform", "translate(" + r + "," + r + ")");

    // Tooltip for the visualization
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d, i) { return groupData[i].key + " (" + groupData[i].values + ")"; });

    vis.call(tip);

    var pie = d3.layout.pie().value(function (d) { return d.values; });

    // Declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);

    // Select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice").data(pie).enter().append("g").attr("class", "slice");
    arcs.append("path")
        //.style({ fill: randomColor })
        .attr("fill", randomColor)
        .attr("d", function (d) { return arc(d); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        ;

    // Add the text
    // arcs.append("text")
    //     .attr("transform", function (d) {
    //         d.innerRadius = 200; /* Distance of label to the center*/
    //         d.outerRadius = r;
    //         return "translate(" + arc.centroid(d) + ")";
    //     }
    //     )
    //     .attr("text-anchor", "middle")
    //     .text(function (d, i) { return groupData[i].key + " (" + groupData[i].values + ")"; })
    //     ;
});

/*********************************** TREE LAYOUT & BUBBLE PACK CHART ********************************/
// Using d3 to read the csv file and generate the needed Object for Tree and Bubble Chart
d3.csv("Car.csv", function (error, data) {
    // Nesting data just for "brand"
    var brandData = d3.nest()
        .key(function (d) { return d['brand']; })
        .rollup(function (v) { return v.length; })
        .entries(data);

    // Nesting data for "brand" and then "model"
    var modelData = d3.nest()
        .key(function (d) { return d['brand']; })
        .key(function (d) { return d['model']; })
        .rollup(function (v) { return v.length; })
        .entries(data);

    // Nesting all required data: "brand", "model" and "name"
    // This is the MAIN OBJECT
    var groupData = d3.nest()
        .key(function (d) { return d['brand']; })
        .key(function (d) { return d['model']; })
        .key(function (d) { return d['name']; })
        .rollup(function (v) { return v.length; })
        .entries(data);

    // Compare function
    function compare(a, b) {
        if (parseInt(a.value) < parseInt(b.value)) {
            return 1;
        }
        if (parseInt(a.value) > parseInt(b.value)) {
            return -1;
        }
        return 0;
    }

    // Looping through the MAIN OBJECT to change key -> "name" and values -> "children"
    // Also, adding "value" as the number of cars in each "brand", "model" and "name"
    for (var index1 = 0; index1 < groupData.length; index1++) {
        groupData[index1].name = groupData[index1].key;
        groupData[index1].children = groupData[index1].values;
        groupData[index1].value = brandData[index1].values;
        delete groupData[index1].key;
        delete groupData[index1].values;
        for (var index2 = 0; index2 < groupData[index1].children.length; index2++) {
            groupData[index1].children[index2].name = groupData[index1].children[index2].key;
            groupData[index1].children[index2].children = groupData[index1].children[index2].values;
            groupData[index1].children[index2].value = modelData[index1].values[index2].values;
            delete groupData[index1].children[index2].key;
            delete groupData[index1].children[index2].values;
            for (var index3 = 0; index3 < groupData[index1].children[index2].children.length; index3++) {
                groupData[index1].children[index2].children[index3].name = groupData[index1].children[index2].children[index3].key;
                groupData[index1].children[index2].children[index3].value = groupData[index1].children[index2].children[index3].values;
                delete groupData[index1].children[index2].children[index3].key;
                delete groupData[index1].children[index2].children[index3].values;
            }
        }
    };

    // Filtering "Brand" that has over 100 cars
    groupData = groupData.filter(function (d) {
        return d.value > 100;
    });

    // Sorting all "value" so we can get the most frequent ones
    // Top 3 models, Top 5 names
    groupData.sort(compare);
    groupData.forEach(function (element) {
        element.children.sort(compare);
        element.children = element.children.slice(0, 3);
        element.children.forEach(function (nextElement) {
            nextElement.children.sort(compare);
            nextElement.children = nextElement.children.slice(0, 5);
        });
    }, this);

    // Adding 'Car' as the top parent of the MAIN OBJECT
    var treeData = {
        "name": "Car",
        "children": groupData,
        "value": 9999
    };

    // Logging the object to console for testing purpose
    console.log(treeData);

    // Calling the functions to create Tree & Bubble Chart
    createTree(treeData);
    createBubblePack(treeData);

});


/****************************** FUNCTION TO GENERATE A TREE FROM A ROOT OBJECT ***********************/
function createTree(source) {
    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 100
    };

    var width = 1280 - margin.left - margin.right;
    var height = 3720 - margin.top - margin.bottom;

    var i = 0;

    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function (d) { return [d.y, d.x]; });

    var svg = d3.select("#part2").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Compute the new tree layout.
    var nodes = tree.nodes(source).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) { d.y = d.depth * 180; });

    // Declare the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function (d) { return d.id || (d.id = ++i); });

    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    nodeEnter.append("circle")
        .attr("r", 6)
        .style("fill", "#fff");

    nodeEnter.append("text")
        .attr("x", function (d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function (d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function (d) { return d.name + " (" + d.value + ")"; })
        .style("fill-opacity", 1);

    // Declare the links…
    var link = svg.selectAll("path.link")
        .data(links, function (d) { return d.target.id; });

    // Enter the links.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", diagonal);

};

/************************ FUNCTION TO GENERATE A BUBBLE PACK CHART FROM A ROOT OBJECT ****************/
function createBubblePack(source) {
    var width = 720, height = 720;

    var chart = d3.select("#part3").append("svg")
        .attr("width", width).attr("height", height)
        .append("g")
        .attr("transform", "translate(50,50)");

    // Tooltip for the visualization
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        //.html(function (d) { return d.children ? "" : d.name + " (" + d.value + ")"; });
        .html(function (d) { return d.name + " (" + d.value + ")"; });

    chart.call(tip);

    var pack = d3.layout.pack()
        .size([height - 50, width - 50])
        .padding(10);

    var nodes = pack.nodes(source);

    var node = chart.selectAll(".node")
        .data(nodes).enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);


    node.append("circle")
        .attr("r", function (d) { return d.r; })
        .attr("fill", "steelblue")
        .attr("opacity", 0.25)
        .attr("stroke", "#ADADAD")
        .attr("stroke-width", 2)

    // node.append("text")
    //     .text(function (d) { return d.children ? "" : d.name + " (" + d.value + ")"; });
};