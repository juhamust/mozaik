"use strict";

var React = require("react");
var Reflux = require("reflux");
var DashboardStore = require("./../stores/DashboardStore");

var Timer = React.createClass({
    displayName: "Timer",
    mixins: [Reflux.ListenerMixin],

    getInitialState: function getInitialState() {
        return {
            completion: 0
        };
    },

    componentWillMount: function componentWillMount() {
        var _this = this;
        this.listenTo(DashboardStore, this.onStoreUpdate);

        setInterval(function () {
            _this.setState({
                completion: _this.state.completion + 5
            });
        }, 5);
    },

    onStoreUpdate: function onStoreUpdate() {
        this.setState({
            completion: 0
        });
    },

    render: function render() {
        var style = {
            width: this.state.completion / 200 * 100 + "%"
        };

        return React.createElement(
            "div",
            { className: "hotboard__timeline" },
            React.createElement("div", { className: "hotboard__timeline__progress", style: style })
        );
    }
});

module.exports = Timer;