var config = require(__dir + "/core/app/config");
var routerLoader = require(__dir + "/core/loader/route-loader");
var serviceRegistry = require(__dir + "/core/loader/service-registry");
var event = require(__dir + "/core/app/event");
var logger = (require(__dir + "/core/log/logger-factory")).getLogger();
module.exports = function ($serviceContainer) {
    $serviceContainer.bind("$config", config);
    $serviceContainer.bind("$route", routerLoader);
    $serviceContainer.bind("$serviceRegistry", serviceRegistry);
    $serviceContainer.bind("$event", event);
    $serviceContainer.bind("$logger", logger);
};
