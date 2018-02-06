var OrderRoute = require('./routes/order');
var BusinessRoute = require('./routes/business');
var UserRoute = require('./routes/user');
var SeatingRoute = require('./routes/seating');
var CategoryRoute = require('./routes/category');
var ProductRoute = require('./routes/product');
var CustomerRoute = require('./routes/customer');
var ImageRoute = require('./routes/image');

var Auth = require('../controllers/AuthController');

module.exports = function ($route, $logger) {
    /** Register HTTP requests **/
    $route.options('/*', function (io) {
        io.header('Access-Control-Allow-Origin', '*')
            .header('Access-Control-Allow-Credentials', 'true')
            .header('Access-Control-Max-Age', 28800)
            .header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
            .header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Origin, Authorization')
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

    /* Get Resource */
    $route.gateway({
        method: 'get',
        route: '/api/resources/*',
        services: [
            {
                id: 'IMAGE_SERVICE',
                path: '/*',
                return: 'resources'
            }
        ]
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