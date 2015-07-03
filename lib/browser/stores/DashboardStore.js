"use strict";

var Reflux = require("reflux");
var _ = require("lodash");
var DashboardActions = require("./../actions/DashboardActions");
var ConfigStore = require("./ConfigStore");

var _dashboards = [];
var _currentIndex = 0;
var _config = null;
var _timer = null;

var DashboardStore = Reflux.createStore({
    init: function init() {
        this.listenTo(DashboardActions.setDashboards, this.setDashboards);
        this.listenTo(DashboardActions.previousDashboard, this.previousDashboard);
        this.listenTo(DashboardActions.nextDashboard, this.nextDashboard);
        this.listenTo(ConfigStore, this.setConfig);
    },

    setConfig: function setConfig(config) {
        _config = _.pick(config, "rotationDuration");
        this.start();
    },

    start: function start() {
        var _this = this;
        if (_config.rotationDuration && _dashboards.length > 0 && _timer === null) {
            _timer = setInterval(function () {
                _this.nextDashboard();
            }, _config.rotationDuration);
        }
    },

    previousDashboard: function previousDashboard() {
        _currentIndex--;
        this.trigger(_currentIndex);
    },

    nextDashboard: function nextDashboard() {
        if (_currentIndex < _dashboards.length - 1) {
            _currentIndex++;
        } else {
            _currentIndex = 0;
        }

        this.trigger(_currentIndex);
    },

    setDashboards: function setDashboards(dashboards) {
        _.forEach(dashboards, function (dashboard, index) {
            dashboard.index = index;
        });

        _dashboards = dashboards;
        _currentIndex = 0;

        this.start();

        this.trigger(_currentIndex);
    },

    currentIndex: function currentIndex() {
        return _currentIndex;
    }
});

module.exports = DashboardStore;