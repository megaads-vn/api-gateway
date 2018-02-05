var OrderRoute = require('./routes/order');
var BusinessRoute = require('./routes/business');
var UserRoute = require('./routes/user');
var SeatingRoute = require('./routes/seating');
var CategoryRoute = require('./routes/category');
var ProductRoute = require('./routes/product');
var CustomerRoute = require('./routes/customer');
var ImageRoute = require('./routes/image');

var auth = require('../controllers/auth-controller');

module.exports = function ($route, $logger) {
    /** Register HTTP requests **/
    /** Register socket.io requests **/
    /** Register filters **/
    $route.post("/register", "HomeController@register");
	$route.post("/sign-in", "HomeController@sign_in");
    $route.post("/home", "HomeController@home",
        {
            before: ["auth", function (io) {
                    $logger.debug("processing a download request");
                }],
            after: function (io) {
                $logger.debug("finished a download request");
            }
        }
    );

    $route.filter("auth", auth.auth);

    $route.options('/*', function (io) {
        io.header('Access-Control-Allow-Origin', '*')
            .header('Access-Control-Allow-Credentials', 'true')
            .header('Access-Control-Max-Age', 28800)
            .header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
            .header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Origin, Authorization')
            .echo("");
    });

    OrderRoute.init($route);
    BusinessRoute.init($route);
    UserRoute.init($route);
    SeatingRoute.init($route);
    CategoryRoute.init($route);
    ProductRoute.init($route);
    CustomerRoute.init($route);
    ImageRoute.init($route);
};