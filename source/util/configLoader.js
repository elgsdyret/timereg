/*
 * Module to load the configuration for the current environment.
 * The environment is defined in the environment variable APP_ENV.
 *
 * The configuration files are searched for in the config directory of the
 * Backend checked out from Git. The files should be named like this:
 * $APP_ENV.app.config.json
 *
 * Exceptions are thrown if APP_ENV is undefined, the config file
 * doesn't exists, or isn't valid JSON.
 */
var fs = require('fs');

var envName = process.env["APP_ENV"];

if (!envName) {
    throw new Error("Missing environment variable APP_ENV");
}

var configPath = fs.realpathSync(__dirname + "/../../config/" + envName + ".app.config.json");

var data = fs.readFileSync(configPath, 'utf-8');
var config = JSON.parse(data);

config.appEnv = envName;
config.configPath = configPath;
exports.config = config;