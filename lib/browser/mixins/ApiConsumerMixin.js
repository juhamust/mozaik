"use strict";

var ApiStore = require("./../stores/ApiStore");
var ApiActions = require("./../actions/ApiActions");

var ApiConsumerMixin = {
    componentWillMount: function componentWillMount() {
        this.apiRequest = this.getApiRequest();
        this.listenTo(ApiStore, this._onApiData);
    },

    _onApiData: function _onApiData(data) {
        if (data.id === this.apiRequest.id) {
            this.onApiData(data.body);
        }
    },

    componentDidMount: function componentDidMount() {
        ApiActions.get(this.apiRequest.id, this.apiRequest.params || {});
    }
};

module.exports = ApiConsumerMixin;