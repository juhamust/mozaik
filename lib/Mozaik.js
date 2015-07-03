"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var winston = require("winston");
var path = require("path");
var chalk = require("chalk");
var Bus = require("./Bus");

var Mozaik = (function () {
    function Mozaik(config) {
        _classCallCheck(this, Mozaik);

        this.logger = winston;

        this.config = config;

        this.serverConfig = {
            env: config.env,
            host: config.host,
            port: config.port
        };

        this.config.appTitle = this.config.appTitle || "Mozaïk";
        this.config.assetsBaseUrl = this.config.assetsBaseUrl || "";
        this.config.useWssConnection = !!this.config.useWssConnection;

        this.baseDir = (config.baseDir || process.cwd()) + path.sep;
        this.rootDir = path.resolve(__dirname);

        this.bus = new Bus(this);
    }

    _prototypeProperties(Mozaik, null, {
        startServer: {
            value: function startServer() {
                require("./server")(this);
            },
            writable: true,
            configurable: true
        },
        loadApiConfig: {

            /**
             * @param {Object} config The convict config schema to validate against
             */
            value: function loadApiConfig(config) {
                // load and validate config
                config.load(this.config.api);

                try {
                    config.validate();
                } catch (e) {
                    this.logger.error(chalk.red(e.message));
                    process.exit(1);
                }
            },
            writable: true,
            configurable: true
        }
    });

    return Mozaik;
})();

module.exports = Mozaik;