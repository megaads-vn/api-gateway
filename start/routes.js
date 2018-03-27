var OrderRoute = require('./routes/order');
var BusinessRoute = require('./routes/business');
var UserRoute = require('./routes/user');
var SeatingRoute = require('./routes/seating');
var CategoryRoute = require('./routes/category');
var ProductRoute = require('./routes/product');
var CustomerRoute = require('./routes/customer');
var ImageRoute = require('./routes/image');
var OrderItem = require('./routes/order_item');
var GroupItem = require('./routes/group_item');

var Auth = require('../controllers/AuthController');
var Activity = require('./activity');

module.exports = function ($route, $logger) {
    /** Register HTTP requests **/
    $route.options('/*', function (io) {
        io.header('Access-Control-Allow-Origin', '*')
            .header('Access-Control-Allow-Credentials', 'true')
            .header('Access-Control-Max-Age', 28800)
            .header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE, PATCH')
            .header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Origin, Authorization, X-XSRF-TOKEN, Role-User')
            .echo("");
    });

    Activity.init($route);

    $route.group(function () {
        OrderRoute.init($route);
        BusinessRoute.init($route);
        UserRoute.init($route);
        SeatingRoute.init($route);
        CategoryRoute.init($route);
        ProductRoute.init($route);
        CustomerRoute.init($route);
        ImageRoute.init($route);
        GroupItem.init($route);
        OrderItem.init($route);
    },
    {
        before: ["auth", function (io) {
            $logger.debug("processing a download request");
            }],
        after: function (io) {
            $logger.debug("finished a download request");
        }
    });



};
