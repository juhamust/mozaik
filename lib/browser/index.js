"use strict";

var ComponentRegistry = require("./component-registry");

module.exports = {
    add: ComponentRegistry.add,
    addBatch: ComponentRegistry.addBatch,
    get: ComponentRegistry.get,
    list: ComponentRegistry.list,
    Mixin: {
        ApiConsumer: require("./mixins/ApiConsumerMixin")
    },
    Store: {
        Api: require("./stores/ApiStore")
    },
    Actions: {
        Api: require("./actions/ApiActions"),
        Config: require("./actions/ConfigActions")
    },
    Component: {
        Mozaik: require("./components/Mozaik"),
        Pie: require("./components/charts/Pie"),
        Treemap: require("./components/charts/Treemap")
    }
};