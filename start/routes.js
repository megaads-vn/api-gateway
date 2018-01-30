var OrderRoute = require('./routes/order');
var BusinessRoute = require('./routes/business');
var UserRoute = require('./routes/user');
var SeatingRoute = require('./routes/seating');
module.exports = function ($route, $logger) {
    /** Register HTTP requests **/
    /** Register socket.io requests **/
    /** Register filters **/
    OrderRoute.init($route);
    BusinessRoute.init($route);
    UserRoute.init($route);
    SeatingRoute.init($route);
};