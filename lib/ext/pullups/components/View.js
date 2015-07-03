"use strict";

var React = require("react");
var Reflux = require("reflux");
var ApiConsumerMixin = require("./../../../core/mixins/ApiConsumerMixin");

var View = React.createClass({
  displayName: "View",
  mixins: [Reflux.ListenerMixin, ApiConsumerMixin],

  getInitialState: function getInitialState() {
    return {
      location: null,
      leaderboard: []
    };
  },

  propTypes: {
    location: React.PropTypes.string.isRequired
  },

  getApiRequest: function getApiRequest() {
    var id = "pullups.view";
    if (this.props.location) {
      id += "." + this.props.location;
    }

    return {
      id: id,
      params: {
        location: this.props.location
      }
    };
  },

  onApiData: function onApiData(leaderboard) {
    this.setState({
      leaderboard: leaderboard
    });
  },

  render: function render() {
    var entries = this.state.leaderboard.map(function (entry) {
      return React.createElement(
        "li",
        null,
        entry.user,
        " ",
        entry.total
      );
    });

    if (entries.length === 0) {
      entries = React.createElement(
        "p",
        null,
        "No data"
      );
    }

    var widget = React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "widget__header" },
        "Pullups"
      ),
      React.createElement(
        "div",
        { className: "widget__body" },
        React.createElement(
          "ul",
          null,
          entries
        )
      )
    );

    return widget;
  }
});

module.exports = View;