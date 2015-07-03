"use strict";

var React = require("react");
var Reflux = require("reflux");
var _ = require("lodash");
var Dashboard = require("./Dashboard");
var Timer = require("./Timer");
var ConfigStore = require("./../stores/ConfigStore");

var Mozaik = React.createClass({
    displayName: "Mozaik",
    mixins: [Reflux.ListenerMixin],

    getInitialState: function getInitialState() {
        return {
            config: null
        };
    },

    componentWillMount: function componentWillMount() {
        this.listenTo(ConfigStore, this.onConfigStoreUpdate);
    },

    onConfigStoreUpdate: function onConfigStoreUpdate(config) {
        this.setState({
            config: config
        });
    },

    render: function render() {
        if (this.state.config === null) {
            return null;
        }

        var dashboardNodes = _.map(this.state.config.dashboards, function (dashboard, index) {
            return React.createElement(Dashboard, { key: index, dashboard: dashboard });
        });

        var timerNode = null;
        if (this.state.config.dashboards.length > 1) {
            timerNode = React.createElement(Timer, null);
        }

        return React.createElement(
            "div",
            { className: "dashboard" },
            dashboardNodes
        );
    }
});

module.exports = Mozaik;