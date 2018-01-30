/**
 * @author Phuluong
 * December 27, 2015
 */

/** Exports **/
module.exports = new RouteLoader();
/** Imports **/
var IO = require("../io/io");
var util = require(__dir + "/core/app/util");
var config = require(__dir + "/core/app/config");
var contentTypes = require(__dir + "/core/io/content-types");
var serviceRegistry = require(__dir + "/core/loader/service-registry");
var UrlPattern = require("url-pattern");
var request = require("request");
/** Modules **/
function RouteLoader() {
    this.filterContainer = [];
    this.load = function (constructorProperties) {
        this.sessionManager = constructorProperties.sessionManager;
        this.socketIOConnection = constructorProperties.socketIOConnection;
        this.httpConnection = constructorProperties.httpConnection;
        this.autoLoader = constructorProperties.autoLoader;
        this.viewEngine = constructorProperties.viewEngine;
        this.serviceRegistry = constructorProperties.serviceRegistry;
        this.httpConnection.asset(processAssetRequest);
        this.initHTTPRoutes();
    };
    this.group = function () {
    };
    this.any = function (routeName, route, filters) {
        this.io(routeName, route, filters);
        for (var i = 0; i < this.httpConnection.methods.length; i++) {
            this[this.httpConnection.methods[i]](routeName, route, filters);
        }
        return this;
    };
    this.gateway = function (config) {
        var self = this;
        self.httpConnection[config.method](config.route, function (req, res) {
            var retval = {};
            var io = new IO({
                method: config.method,
                autoLoader: self.autoLoader,
                routeName: config.route,
                sessionManager: self.sessionManager,
                viewEngine: self.viewEngine
            });
            io.bindHttp(req, res);
            if (config.services != null && config.services.length > 0) {
                if (config.type == null || config.type == "parallel") {
                    var requestPromises = [];
                    for (var i = 0; i < config.services.length; i++) {
                        var service = config.services[i];
                        var requestPromise = sendGatewayPromiseRequest(service, io.inputs, config.method);
                        requestPromises.push(requestPromise);
                    }
                    Promise.all(requestPromises).then(function (values) {
                        for (var i = 0; i < config.services.length; i++) {
                            retval[config.services[i].return == null ? i : config.services[i].return] = values[i];
                        }
                        responseGatewayRequest(self, io, config, retval);
                    });
                } else {
                    var promisePipe;
                    for (var i = 0; i < config.services.length; i++) {
                        var service = config.services[i];
                        if (i == 0) {
                            var requestPromise = sendGatewayPromiseRequest(service, io.inputs, config.method);
                            promisePipe = requestPromise;
                        } else {
                            var promisePipeClosureFn = function (service, promiseIdx) {
                                promisePipe = promisePipe.then(function (data) {
                                    buildReturnData(data, retval, io, config, promiseIdx);
                                    return sendGatewayPromiseRequest(service, io.inputs, config.method, true);
                                });
                            };
                            promisePipeClosureFn(service, i - 1);
                        }
                    }
                    promisePipe.then(function (data) {
                        buildReturnData(data, retval, io, config, config.services.length - 1);
                        responseGatewayRequest(self, io, config, retval);
                    }).catch(function (err) {
                        responseGatewayRequest(self, io, config, {error: err});
                    });
                }
            }
        });
    };

    this.io = function (routeName, action, filters) {
        var self = this;
        this.socketIOConnection.addMessageListener(routeName, function (data, session) {
            var io = new IO({
                method: "io",
                autoLoader: self.autoLoader,
                routeName: routeName,
                sessionManager: self.sessionManager,
                viewEngine: self.viewEngine
            });
            io.bindSocketIO(data, session);
            executeAction(self, action, io, filters);
        });
        return this;
    };
    this.initHTTPRoutes = function () {
        var self = this;
        for (var i = 0; i < this.httpConnection.methods.length; i++) {
            var method = this.httpConnection.methods[i];
            this[method] = function (self, method) {
                return function (routeName, action, filters) {
                    self.httpConnection[method](routeName, function (req, res) {
                        var io = new IO({
                            method: method,
                            autoLoader: self.autoLoader,
                            routeName: routeName,
                            sessionManager: self.sessionManager,
                            viewEngine: self.viewEngine
                        });
                        io.bindHttp(req, res);
                        executeAction(self, action, io, filters);
                    });
                    return self;
                };
            }(this, method);
        }
    }
    /**
     * Register a filter to the route
     * @param {String} name
     * @param {callable} callbackFn
     * @returns {RouteLoader}
     */
    this.filter = function (name, callbackFn) {
        this.filterContainer[name] = callbackFn;
        return this;
    };
    function responseGatewayRequest(self, io, config, responseData) {
        if (config.action != null) {
            io.inputs.gateway = {};
            for (var property in responseData) {
                io.inputs.gateway[property] = responseData[property];
            }
            executeAction(self, config.action, io);
        } else {
            io.json(responseData);
        }
    }

    function sendGatewayPromiseRequest(service, params, defaultMethod, pipe) {
        if (service.method == null) {
            service.method = defaultMethod;
        }
        //return sendGatewayPromiseRequest(service, io.inputs, config.method, true);
        var url = "";
        var servicePath = service.path;
        if (pipe) {
            var pipeParams = util.getRouteParams(servicePath);
            var paramValues = {};
            for (var i = 0; i < pipeParams.length; i++) {
                var param = pipeParams[i];
                if (service.join_from != null) {
                    var mainTable = service.join_from;
                    var column = service.join_column;
                    var mainTableData = params[mainTable].data;
                    var pipeParamValue = [];
                    if (mainTableData.length > 0) {
                        for (var i = 0; i < mainTableData.length; i++) {
                            var columnValue = mainTableData[i][column];
                            pipeParamValue.push(columnValue);
                        }

                    }else  if (typeof mainTableData == 'object') {
                        var columnValue = mainTableData[column] != null ? mainTableData[column] : -1;
                        pipeParamValue.push(columnValue);
                    }

                    if (pipeParamValue.length == 0) {
                        pipeParamValue = [-1];
                    }
                    params = {};
                    params[param] = pipeParamValue.join(',');
                    paramValues[param] = pipeParamValue.join(',');
                } else {
                    var pipeParamValue = params.getProperty(param);
                    if (pipeParamValue != null) {
                        params[param] = pipeParamValue;
                        paramValues[param] = pipeParamValue;
                    }
                }

            }
            servicePath = util.fillRouteParams(servicePath, paramValues);
        }
        var urlPattern = new UrlPattern(servicePath);
        url = serviceRegistry.getService(service.id) + urlPattern.stringify(params);
        return new Promise(function (resolve, reject) {
            var requestParams = service.method.toUpperCase() == "GET" ? {qs: params} : {form: params};
            request[service.method](url, requestParams,
                function (err, httpResponse, body) {
                    if (err) {
                        reject(err);
                    } else {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {
                        }
                        resolve(body);
                    }
                }
            );
        });
    }

    function executeAction(self, action, io, filters) {
        var interrupt = false;
        // call before-filter
        if (filters != null && filters.before != null) {
            if (typeof filters.before === "function") {
                if (filters.before(io) === false) {
                    interrupt = true;
                }
            } else if (typeof filters.before === "string") {
                if (self.filterContainer[filters.before] != null && self.filterContainer[filters.before](io) === false) {
                    interrupt = true;
                }
            } else if ((typeof filters.before === "object") && filters.before.length > 0) {
                for (var i = 0; i < filters.before.length; i++) {
                    if (typeof filters.before[i] === "function") {
                        if (filters.before[i](io) === false) {
                            interrupt = true;
                        }
                    } else if (typeof filters.before[i] === "string") {
                        if (self.filterContainer[filters.before[i]] != null && self.filterContainer[filters.before[i]](io) === false) {
                            interrupt = true;
                        }
                    }
                }
            }
        }
        // if before-filter return false, return before executing action
        if (interrupt) {
            return;
        }
        // call action
        if (typeof action === "function") {
            action(io);
        } else if (typeof action === "string") {
            var actionFn = self.autoLoader.getAction(action);
            if (actionFn != null) {
                actionFn(io);
            } else {
                io.status(404).json({
                    status: 404,
                    result: "page not found"
                });
            }
        }
        // call after-filter
        if (filters != null && filters.after != null) {
            if (typeof filters.after === "function") {
                filters.after(io);
            } else if (typeof filters.after === "string") {
                if (self.filterContainer[filters.after] != null) {
                    self.filterContainer[filters.after](io);
                }
            } else if ((typeof filters.after === "object") && filters.after.length > 0) {
                for (var i = 0; i < filters.after.length; i++) {
                    if (typeof filters.after[i] === "function") {
                        filters.after[i](io);
                    } else if (typeof filters.after[i] === "string") {
                        if (self.filterContainer[filters.after[i]] != null) {
                            self.filterContainer[filters.after[i]](io);
                        }
                    }
                }
            }
        }
    }

    function processAssetRequest(req, res) {
        var result = util.readFile(__dir + config.get("app.assetPath", "") + req.baseUrl);
        if (result === false) {
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(JSON.stringify({
                status: 404,
                result: "page not found"
            }));
        } else {
            var header = {"Connection": "close"};
            var fileExtension = req.baseUrl.fileExtension();
            var contentType = contentTypes[fileExtension];
            if (contentType != null) {
                header["Content-Type"] = contentType;
            }
            res.writeHead(200, header);
            res.end(result, "binary");
        }
    }

    function buildReturnData(requestResult, retval, io, config, promiseIdx) {
        var returnPropertype = config.services[promiseIdx].return == null ? promiseIdx
            : config.services[promiseIdx].return;
        if (config.services[promiseIdx].join_from != null) {
            var joinFrom = config.services[promiseIdx].join_from;
            var joinColumn = config.services[promiseIdx].join_column;
            var groupBuildData = groupData(requestResult);
            if (io.inputs[joinFrom] != null) {
                var joinFromData = io.inputs[joinFrom].data;
                if(joinFromData.length > 0) {
                    for (var i = 0; i < joinFromData.length; i++) {
                        var columnValue = joinFromData[i][joinColumn];
                        joinFromData[i][returnPropertype] = {};
                        if (groupBuildData[columnValue] != null) {
                            joinFromData[i][returnPropertype] = groupBuildData[columnValue];
                        }
                    }
                }
                if(typeof joinFromData == 'object') {
                    var columnValue = joinFromData[joinColumn] != null ? joinFromData[joinColumn] : '';
                    joinFromData[returnPropertype] = groupBuildData[columnValue];
                }
                io.inputs[joinFrom].data = joinFromData;
            }
        } else {
            retval[returnPropertype] = requestResult;
            io.inputs[returnPropertype] = requestResult;
        }

    }
    function groupData(requestResult) {
        var requestData = requestResult.data != null ? requestResult.data : [];
        var groupData = {};
        if (requestData != null && requestData.length > 0) {
            for (var i = 0; i < requestData.length; i++) {
                var item = requestData[i];
                groupData[item.id] = item;
            }
        }
        return groupData;
    }
}
