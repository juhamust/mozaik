"use strict";

var Reflux = require("reflux");
var ApiActions = require("./../actions/ApiActions");
var ConfigStore = require("./ConfigStore");

var buffer = [];
var ws = null;

var ApiStore = Reflux.createStore({
    init: function init() {
        this.listenTo(ConfigStore, this.initWs);
    },

    initWs: function initWs(config) {
        var proto = "ws";
        if (config.useWssConnection === true) {
            proto = "wss";
        }

        ws = new WebSocket("" + proto + "://" + window.document.location.host);
        ws.onmessage = function (event) {
            console.log(JSON.parse(event.data));
            ApiStore.trigger(JSON.parse(event.data));
        };

        ws.onopen = function () {
            buffer.forEach(function (request) {
                ws.send(JSON.stringify(request));
            });
        };
        this.listenTo(ApiActions.get, this.get);
    },

    get: function get(id, params) {
        if (ws === null || ws.readyState !== WebSocket.OPEN) {
            buffer.push({
                id: id,
                params: params || {}
            });

            return;
        }

        ws.send(JSON.stringify({
            id: id,
            params: params || {}
        }));
    }
});

module.exports = ApiStore;