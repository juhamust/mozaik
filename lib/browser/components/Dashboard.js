"use strict";

var React = require("react");
var _ = require("lodash");
var Reflux = require("reflux");
var Widget = require("./Widget");
var DashboardStore = require("./../stores/DashboardStore");

var Dashboard = React.createClass({
    displayName: "Dashboard",
    mixins: [Reflux.ListenerMixin],

    getInitialState: function getInitialState() {
        return {
            isCurrent: false
        };
    },

    componentWillMount: function componentWillMount() {
        this.listenTo(DashboardStore, this.onDashboardStoreUpdate);
    },

    onDashboardStoreUpdate: function onDashboardStoreUpdate(index) {
        this.setState({
            isCurrent: index === this.props.dashboard.index
        });
    },

    render: function render() {
        var columns = this.props.dashboard.columns;
        var rows = this.props.dashboard.rows;

        var widgetNodes = _.map(this.props.dashboard.widgets, function (widget, index) {
            var props = _.extend({}, _.omit(widget, ["columns", "rows"]), {
                key: index,
                type: widget.type,
                w: widget.columns / columns * 100 + "%",
                h: widget.rows / rows * 100 + "%",
                x: widget.x / columns * 100 + "%",
                y: widget.y / rows * 100 + "%"
            });

            return React.createElement(Widget, props);
        });

        var cssClasses = "dashboard__sheet";
        if (this.state.isCurrent) {
            cssClasses += " _is-current";
        }

        return React.createElement(
            "div",
            { className: cssClasses },
            widgetNodes
        );
    }
});

module.exports = Dashboard;