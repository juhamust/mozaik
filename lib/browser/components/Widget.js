"use strict";

var React = require("react");
var _ = require("lodash");
var ComponentRegistry = require("./../component-registry");


var Widget = React.createClass({
    displayName: "Widget",
    render: function render() {
        var style = {
            top: this.props.y,
            left: this.props.x,
            width: this.props.w,
            height: this.props.h
        };

        // Pass props to widget component without 'metadata'
        var childProps = _.omit(this.props, ["x", "y", "w", "h", "type"]);

        var widget = React.createElement(ComponentRegistry.get(this.props.type), _.extend({}, childProps));

        var cssClass = "widget " + this.props.type.replace("_", "-").replace(".", "__");

        return React.createElement(
            "div",
            { className: "widget__wrapper", style: style },
            React.createElement(
                "div",
                { className: cssClass },
                widget
            )
        );
    }
});

module.exports = Widget;