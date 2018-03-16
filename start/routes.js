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

    /** Auth **/
    $route.gateway({
        method: 'post',
        route: '/api/sign-in',
        services: [
            {
                id: 'USER_SERVICE',
                path: '/api/sign-in',
                return: 'user'
            }
        ],
        action: "AuthController@signIn"
    });

    $route.gateway({
        method: 'post',
        route: '/api/sign-up',
        services: [
            {
                id: 'USER_SERVICE',
                path: '/api/sign-up',
                return: 'user'
            }
        ],
        action: "AuthController@signUp"
    });

    /* Activity */
    $route.gateway({
        method: 'get',
        route: '/api/forgot-password',
        services: [
            {
                id: 'USER_SERVICE',
                path: '/api/user/forgot-password',
                return: 'user'
            }
        ]
    });
    $route.gateway({
        method: 'get',
        route: '/api/verify-password',
        services: [
            {
                id: 'USER_SERVICE',
                path: '/api/user/verify-password',
                return: 'user'
            }
        ]
    });
    $route.gateway({
        method: 'post',
        route: '/api/customer/sign-in',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer/sign-in',
                return: 'user'
            }
        ],
        action: "AuthController@signIn"
    });
    $route.gateway({
        method: 'post',
        route: '/api/customer/facebook',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer/facebook',
                return: 'user'
            }
        ],
        action: "AuthController@signIn"
    });
    $route.gateway({
        method: 'post',
        route: '/api/customer/google',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer/google',
                return: 'user'
            }
        ],
        action: "AuthController@signIn"
    });

    $route.gateway({
        method: 'post',
        route: '/api/customer/sign-up',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer/sign-up',
                return: 'user'
            }
        ],
        action: "AuthController@signUp"
    });



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
