"use strict";

var _ = require("lodash");

var _components = {};

var ComponentRegistry = {
    addBatch: function addBatch(ns, components) {
        _.forOwn(components, function (component, id) {
            ComponentRegistry.add("" + ns + "." + _.snakeCase(id), component);
        });
    },

    add: function add(type, component) {
        _components[type] = component;

        return ComponentRegistry;
    },

    get: function get(type) {
        if (!_components[type]) {
            throw new Error("No component defined for type \"" + type + "\"");
        }

        return _components[type];
    },

    list: function list() {
        return _components;
    }
};

module.exports = ComponentRegistry;