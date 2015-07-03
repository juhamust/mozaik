"use strict";

var React = require("react");
var d3 = require("d3");

// This component d3 code was heavily
// inspired from https://gist.github.com/mbostock/1346410

// Return computed arc data key
function key(d) {
    return d.data.id;
}

// This function can be shared across all pie instances
var pie = d3.layout.pie().value(function (d) {
    return d.count;
}).sort(null);

// Try to get a neighbor arc, otherwise, returns null
function findNeighborArc(i, prevData, newData, key) {
    var d;
    return (d = findPreceding(i, prevData, newData, key)) ? { startAngle: d.endAngle, endAngle: d.endAngle } : (d = findFollowing(i, prevData, newData, key)) ? { startAngle: d.startAngle, endAngle: d.startAngle } : null;
}

// Find the element in prevData that joins the highest preceding element in newData.
function findPreceding(i, prevData, newData, key) {
    var m = prevData.length;
    while (--i >= 0) {
        var k = key(newData[i]);
        for (var j = 0; j < m; ++j) {
            if (key(prevData[j]) === k) {
                return prevData[j];
            }
        }
    }
}

// Find the element in prevData that joins the lowest following element in newData.
function findFollowing(i, prevData, newData, key) {
    var n = newData.length,
        m = prevData.length;
    while (++i < n) {
        var k = key(newData[i]);
        for (var j = 0; j < m; ++j) {
            if (key(prevData[j]) === k) {
                return prevData[j];
            }
        }
    }
}


var Pie = React.createClass({
    displayName: "Pie",
    getDefaultProps: function getDefaultProps() {
        return {
            innerRadius: 0,
            spacing: 0.1,
            data: [],
            transitionDuration: 600
        };
    },

    propTypes: {
        spacing: React.PropTypes.number.isRequired,
        innerRadius: React.PropTypes.number.isRequired,
        transitionDuration: React.PropTypes.number.isRequired,
        data: React.PropTypes.arrayOf(React.PropTypes.shape({
            count: React.PropTypes.number,
            color: React.PropTypes.string
        })).isRequired
    },

    d3Render: function d3Render(data) {
        if (!data) {
            return;
        }

        var prevData = this.paths.data();
        var newData = pie(data);

        var width = this.getDOMNode().offsetWidth;
        var height = this.getDOMNode().offsetHeight;

        var minSize = Math.min(width, height);
        var radius = minSize / 2 - minSize * this.props.spacing;

        this.arcsContainer.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var arc = d3.svg.arc().outerRadius(radius).innerRadius(radius * this.props.innerRadius);

        this.paths = this.paths.data(newData, key);

        this.paths.enter().append("path").each(function (d, i) {
            this._current = findNeighborArc(i, prevData, newData, key) || d;
        }).attr("fill", function (d) {
            return d.data.color;
        });

        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            };
        }

        this.paths.exit().datum(function (d, i) {
            return findNeighborArc(i, prevData, newData, key) || d;
        }).transition().duration(this.props.transitionDuration).attrTween("d", arcTween).remove();

        this.paths.transition().duration(this.props.transitionDuration).attrTween("d", arcTween);
    },

    componentDidMount: function componentDidMount() {
        this.svg = d3.select(this.getDOMNode());
        this.arcsContainer = this.svg.append("g").attr("class", "arcs");
        this.paths = this.arcsContainer.selectAll("path");

        this.d3Render();
    },

    shouldComponentUpdate: function shouldComponentUpdate(data) {
        this.d3Render(data.data);

        return false;
    },

    render: function render() {
        return React.createElement("svg", null);
    }
});


module.exports = Pie;