/**
 * @author Phuluong
 * December 27, 2015
 */

/** Exports x**/
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

    /**
     * Grouped routes
     * @param {callable} routes
     * @param {} filters
     * @returns {RouteLoader}
     */
    this.group = function (routes, filters) {
        this.groupFilters = filters;
        routes.bind(this)();
        return this;
    };

    /**
    * Register a multi method route
    * @param {String} routeName
    * @param {callable | String} action
    * @param {} filters
    * @returns {RouteLoader}
    */
    this.any = function (routeName, route, filters) {
        this.io(routeName, route, filters);
        for (var i = 0; i < this.httpConnection.methods.length; i++) {
            this[this.httpConnection.methods[i]](routeName, route, filters);
        }
        return this;
    };
    this.gateway = function (config, filters) {
        var self = this;
        if (filters == null && self.groupFilters != null) {
            filters = self.groupFilters;
        }
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
            executeAction(self, function() {
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
                            responseGatewayRequest(self, io, config, {error: err.toString()});
                        });
                    }
                } else if (config.redirection != null) {
                    var urlPattern = new UrlPattern(config.redirection.path);
                    url = serviceRegistry.getService(config.redirection.id) + urlPattern.stringify(io.inputs);
                    var requestParams = config.method.toUpperCase() == "GET" ? {qs: io.inputs} : {form: io.inputs};
                    request[config.method](url, requestParams).pipe(res);
                }
            }, io, filters);
        });
    };

    /**
    * Register a socket.io route
    * @param {String} routeName
    * @param {callable | String} action
    * @param {} filters
    * @returns {RouteLoader}
    */
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
    /**
    * Initialize HTTP route registers
    * @param {String} routeName
    * @param {callable | String} action
    * @param {} filters
    * @returns {RouteLoader}
    */
    this.initHTTPRoutes = function () {
        var self = this;
        for (var i = 0; i < this.httpConnection.methods.length; i++) {
            var method = this.httpConnection.methods[i];
            this[method] = function (self, method) {
                return function (routeName, action, filters) {
                    if (filters == null && self.groupFilters != null) {
                        filters = self.groupFilters;
                    }
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
                    var joinColumn = service.join_column;
                    var joinFromArr = service.join_from.split('.');
                    var mainTable = joinFromArr[0];
                    var mainTableData = params[mainTable].data;

                    var pipeParamValue = [];
                    if (!mainTableData) {
                        continue;
                    }
                    if (mainTableData.id != null) {
                        if(joinFromArr.length == 1) {
                            var columnValue = mainTableData[joinColumn] != null ? mainTableData[joinColumn] : -1;
                            pipeParamValue.push(columnValue);
                        } else {
                            var joinData = getJoinData(mainTableData, joinFromArr[1], joinColumn);
                            pipeParamValue = joinData;
                        }
                    } else if (mainTableData.length > 0) {
                        for (var i = 0; i < mainTableData.length; i++) {
                            var columnValue = '';
                            if(joinFromArr.length == 1) {
                                columnValue = mainTableData[i][joinColumn] ||  -1;
                                pipeParamValue.push(columnValue);
                            } else {
                                var joinData = getJoinData(mainTableData[i], joinFromArr[1], joinColumn);
                                pipeParamValue = pipeParamValue.concat(joinData);
                            }
                        }
                    }
                    if (pipeParamValue.length == 0) {
                        pipeParamValue = [-1];
                    }
                    params = {};
                    params[param] = pipeParamValue.join(',');
                    paramValues[param] = pipeParamValue.join(',');
                } else {
                    var pipeParamValue = util.getProperty(params, param);
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

    function getJoinData(mainTableData, dataColumn, joinColumn) {
        var joinData = mainTableData[dataColumn] || '';
        
        var result = [];
        var joinColumnValue;
        if(joinData.id != null) {
            joinColumnValue = joinData[joinColumn] || -1;
            result.push(joinColumnValue);
        } else {
            for(var i = 0; i < joinData.length; i++) {
                joinColumnValue = joinData[i][joinColumn] || -1;
                result.push(joinColumnValue);
            }
        }
        return result;
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
            var joinFromArr = config.services[promiseIdx].join_from.split('.');
            if(joinFromArr.length > 1) {
                joinFrom = joinFromArr[0];
            }
            var joinColumn = config.services[promiseIdx].join_column;
            var groupBuildData = groupData(requestResult);
            if (io.inputs[joinFrom] != null) {
                var joinFromData = io.inputs[joinFrom].data;
                if (joinFromData != null && joinFromData.length > 0) {
                    for (var i = 0; i < joinFromData.length; i++) {

                        var columnValue = '';
                        if(joinFromArr.length > 1 && joinFromData[i][joinFromArr[1]].id != null) {
                            columnValue = joinFromData[i][joinFromArr[1]][joinColumn] || -1;
                        } else if (joinFromArr.length == 1){
                            columnValue = joinFromData[i][joinColumn] || -1;
                        }
                        joinFromData[i][returnPropertype] = {};
                        if (columnValue != '' && groupBuildData[columnValue] != null) {
                            joinFromData[i][returnPropertype] = groupBuildData[columnValue];
                        } 
                        else if(joinFromData[i] != null 
                            && joinFromData[i][joinFromArr[1]] != null
                            && joinFromData[i][joinFromArr[1]].length > 0){
                            for (var t = 0; t < joinFromData[i][joinFromArr[1]].length; t++) {
                                joinFromData[i][joinFromArr[1]][t][returnPropertype] = '';
                                columnValue = joinFromData[i][joinFromArr[1]][t][joinColumn] || -1;
                                if(groupBuildData[columnValue] != null) {
                                    joinFromData[i][joinFromArr[1]][t][returnPropertype] = groupBuildData[columnValue];
                                }
                            }
                        }
                        else {
                            
                            var columnValueArr = [columnValue];
                            if(typeof  columnValue == 'string') {
                                columnValueArr = columnValue.split(',');
                            }
                            if(columnValueArr.length > 1) {
                                joinFromData[i][returnPropertype] = [];
                                for (var x = 0; x < columnValueArr.length; x++) {
                                    var columnValueTmp = columnValueArr[x];
                                    if (groupBuildData[columnValueTmp] != null) {
                                        joinFromData[i][returnPropertype].push(groupBuildData[columnValueTmp]);
                                    }
                                }
                            }

                        }
                    }
                } else if(typeof joinFromData == 'object') {
                    var columnValue;
                    if(joinFromArr.length > 1 && joinFromData[joinFromArr[1]] != null) {
                        columnValue = joinFromData[joinFromArr[1]] || -1;
                        if(joinFromData[joinFromArr[1]].id != null) {
                            columnValue = 
                                (joinFromData[joinFromArr[1]] != null 
                                    && joinFromData[joinFromArr[1]][joinColumn] != null)
                                ? joinFromData[joinFromArr[1]][joinColumn] : '';
                            joinFromData[returnPropertype] = groupBuildData[columnValue];
                        } else if(joinFromData[joinFromArr[1]].length > 0){
                            for (var t = 0; t < joinFromData[joinFromArr[1]].length; t++) {
                                joinFromData[joinFromArr[1]][t][returnPropertype] = '';
                                columnValue = joinFromData[joinFromArr[1]][t][joinColumn] || -1;
                                if(groupBuildData[columnValue] != null) {
                                    joinFromData[joinFromArr[1]][t][returnPropertype] = groupBuildData[columnValue];
                                }
                            }
                            //joinFromData[returnPropertype] = groupBuildData;
                        }
                      
                    } else {
                        columnValue = joinFromData[joinColumn] != null ? joinFromData[joinColumn] : '';
                        joinFromData[returnPropertype] = groupBuildData[columnValue];
                    }
                }
                io.inputs[joinFrom].data = joinFromData;
            }
        } else {
            retval[returnPropertype] = requestResult;
            io.inputs[returnPropertype] = requestResult;
        }

    }

    function mapData(groupBuildData) {

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
