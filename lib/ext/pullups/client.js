"use strict";

var request = require("superagent");
require("superagent-bluebird-promise");
var Promise = require("bluebird");

var config = require("./../../../config");

function buildApiRequest(params) {
  params = params || {};

  return request.get(config.api.slackbot.url).query({ location: params.location }).promise();
}

module.exports = {
  view: function (params) {
    console.log("PARAMS", params);

    return buildApiRequest(params).then(function (res) {
      return res.body;
    })["catch"](function (err) {
      return JSON.stringify([]);
    });
  }
};