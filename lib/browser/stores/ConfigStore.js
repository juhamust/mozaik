"use strict";

var Reflux = require("reflux");
var ConfigActions = require("./../actions/ConfigActions");
var DashboardActions = require("./../actions/DashboardActions");
var request = require("superagent");

var ConfigStore = Reflux.createStore({
    listenables: ConfigActions,

    loadConfig: function loadConfig() {
        var _this = this;
        request.get("/config").end(function (err, res) {
            var config = res.body;

            _this.trigger(res.body);

            DashboardActions.setDashboards(config.dashboards);
        });
    }
});

module.exports = ConfigStore;