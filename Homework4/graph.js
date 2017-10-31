var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 1080 - margin.left - margin.right;
var height = 720 - margin.top - margin.bottom;

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

// Pie chart showing the frequency of the column "brand"
// Discard brand with frequency less than 100
// Visual should have proper labeling of the pies with the brand name and frequency
// Reference: http://bl.ocks.org/Potherca/b9f8b3d0a24e0b20f16d
d3.csv("Car.csv", function (error, data) {
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

    var pie = d3.layout.pie().value(function (d) { return d.values; });

    // Declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);

    // Select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice").data(pie).enter().append("g").attr("class", "slice");
    arcs.append("path")
        //.style({ fill: randomColor })
        .attr("fill", randomColor)
        .attr("d", function (d) { return arc(d); })
        ;

    // Add the text
    arcs.append("text")
        .attr("transform", function (d) {
            d.innerRadius = 200; /* Distance of label to the center*/
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";
        }
        )
        .attr("text-anchor", "middle")
        .text(function (d, i) { return groupData[i].key + " (" + groupData[i].values + ")"; })
        ;
    console.log(groupData);
});


// Tree Layout showing "brand" - "model" - "name" hierarchy.
// Discard brand that has frequency less than 100.
// For each brand, show top 3 most frequent models
// For each model, show top 5 most frequent names
// Tree must have proper labeling with text and frequency
// Assume all the brand nodes are under a node name "Car"