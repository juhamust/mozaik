"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var chalk = require("chalk");
var _ = require("lodash");


var Bus = (function () {
    /**
     * @constructor
     * @param {Mozaik} mozaik
     */
    function Bus(mozaik) {
        _classCallCheck(this, Bus);

        this._mozaik = mozaik;

        this.apis = {};
        this.clients = {};
        this.subscriptions = {};
    }

    _prototypeProperties(Bus, null, {
        registerApi: {

            /**
             * Register a new API
             * which is basically an object composed of various methods.
             *
             * @param {String} id
             * @param {Object} api
             */
            value: function registerApi(id, api) {
                if (_.has(this.apis, id)) {
                    var errMsg = "API \"" + id + "\" already registered";
                    this._mozaik.logger.error(chalk.red(errMsg));
                    throw new Error(errMsg);
                }

                this.apis[id] = api(this._mozaik);

                this._mozaik.logger.info(chalk.yellow("registered API \"" + id + "\""));
            },
            writable: true,
            configurable: true
        },
        addClient: {

            /**
             * Register a new client.
             *
             * @param {Object} client
             * @param {String} id
             */
            value: function addClient(client, id) {
                if (_.has(this.clients, id)) {
                    var errMsg = "Client with id \"" + id + "\" already exists";
                    this._mozaik.logger.error(chalk.red(errMsg));
                    throw new Error(errMsg);
                }
                this.clients[id] = client;

                this._mozaik.logger.info("Client #" + id + " connected");
            },
            writable: true,
            configurable: true
        },
        clientSubscription: {

            /**
             * Add a subscription for the given client (client <-> API call).
             *
             * @param {String} clientId
             * @param {Object} request
             */
            value: function clientSubscription(clientId, request) {
                var _this = this;
                if (!_.has(this.clients, clientId)) {
                    this._mozaik.logger.error("Unable to find a client with id \"" + clientId + "\"");

                    return;
                }

                var requestId = request.id;
                var parts = requestId.split(".");
                var errMsg;
                if (parts.length < 2) {
                    errMsg = "Invalid request id \"" + requestId + "\", should be something like 'api_id.method'";
                    this._mozaik.logger.error(chalk.red(errMsg));
                    throw new Error(errMsg);
                }

                if (!_.has(this.apis, parts[0])) {
                    errMsg = "Unable to find API matching id \"" + parts[0] + "\"";
                    this._mozaik.logger.error(chalk.red(errMsg));
                    throw new Error(errMsg);
                }

                var api = this.apis[parts[0]];
                if (!_.has(api, parts[1])) {
                    errMsg = "Unable to find API method matching \"" + parts[1] + "\"";
                    this._mozaik.logger.error(chalk.red(errMsg));
                    throw new Error(errMsg);
                }

                var callFn = api[parts[1]];

                if (!this.subscriptions[requestId]) {
                    this.subscriptions[requestId] = {
                        clients: [],
                        currentResponse: null
                    };

                    this._mozaik.logger.info("Added subscription \"" + requestId + "\"");

                    // make an immediate call to avoid waiting for the first interval.
                    this.processApiCall(requestId, callFn, request.params);
                }

                // if there is no interval running, create one
                if (!this.subscriptions[requestId].timer) {
                    this.subscriptions[requestId].timer = setInterval(function () {
                        _this.processApiCall(requestId, callFn, request.params);
                    }, 100000);
                }

                // avoid adding a client for the same API call twice
                if (!_.contains(this.subscriptions[requestId].clients, clientId)) {
                    this.subscriptions[requestId].clients.push(clientId);

                    // if there's an available cached response, send it immediately
                    if (this.subscriptions[requestId].cached !== null) {
                        this.clients[clientId].send(JSON.stringify(this.subscriptions[requestId].cached));
                    }
                }
            },
            writable: true,
            configurable: true
        },
        removeClient: {

            /**
             * Remove a client.
             *
             * @param id
             */
            value: function removeClient(id) {
                var _this = this;
                _.forOwn(this.subscriptions, function (subscription, subscriptionId) {
                    subscription.clients = _.without(subscription.clients, id);

                    // if there's no more subscribers, clear the interval
                    // to avoid consuming APIs for nothing.
                    if (subscription.clients.length === 0 && subscription.timer) {
                        _this._mozaik.logger.info("removing interval for " + subscriptionId);

                        clearInterval(subscription.timer);
                        delete subscription.timer;
                    }
                });

                delete this.clients[id];

                this._mozaik.logger.info("Client #" + id + " disconnected");
            },
            writable: true,
            configurable: true
        },
        processApiCall: {

            /**
             *
             * @param {String}   id
             * @param {Function} callFn
             * @param {Object}   params
             */
            value: function processApiCall(id, callFn, params) {
                var _this = this;
                this._mozaik.logger.info("Calling \"" + id + "\"");

                callFn(params).then(function (data) {
                    var message = {
                        id: id,
                        body: data
                    };

                    _this.subscriptions[id].cached = message;

                    _this.subscriptions[id].clients.forEach((function (clientId) {
                        this.clients[clientId].send(JSON.stringify(message));
                    }).bind(_this));
                })["catch"](function (err) {
                    _this._mozaik.logger.error(id + " - status code: " + (err.status || err.statusCode));
                });
            },
            writable: true,
            configurable: true
        },
        listApis: {
            value: function listApis() {
                var apis = [];
                _.forOwn(this.apis, function (api, id) {
                    apis.push(id);
                });

                return apis;
            },
            writable: true,
            configurable: true
        }
    });

    return Bus;
})();

module.exports = Bus;