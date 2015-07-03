"use strict";

var React = require("react");
var d3 = require("d3");


function position() {
    this.style("left", function (d) {
        return d.x + "px";
    }).style("top", function (d) {
        return d.y + "px";
    }).style("width", function (d) {
        return Math.max(0, d.dx - 1) + "px";
    }).style("height", function (d) {
        return Math.max(0, d.dy - 1) + "px";
    });
}


var Treemap = React.createClass({
    displayName: "Treemap",
    getDefaultProps: function getDefaultProps() {
        return {
            transitionDuration: 800,
            showCount: false
        };
    },

    propTypes: {
        showCount: React.PropTypes.bool.isRequired
    },

    d3Render: function d3Render(data) {
        if (!data) {
            return;
        }

        var el = this.getDOMNode();

        var width = el.offsetWidth;
        var height = el.offsetHeight;

        var treemap = d3.layout.treemap().size([width, height]).sticky(true).value(function (d) {
            return d.count;
        });

        var container = d3.select(el);

        var chunks = container.selectAll(".treemap__chunk").data(treemap.nodes(data));

        var newChunks = chunks.enter().append("div").attr("class", "treemap__chunk").call(position).style("background", function (d) {
            return d.color;
        }).append("span").text(function (d) {
            return d.label;
        });

        if (this.props.showCount === true) {
            newChunks.append("span").attr("class", "count").text(function (d) {
                return d.count;
            });
        }

        chunks.transition().duration(this.props.transitionDuration).call(position);
    },

    shouldComponentUpdate: function shouldComponentUpdate(data) {
        this.d3Render(data.data);

        return false;
    },

    render: function render() {
        var style = {
            width: "100%",
            height: "100%"
        };

        return React.createElement("div", { className: "treemap", style: style });
    }
});

module.exports = Treemap;