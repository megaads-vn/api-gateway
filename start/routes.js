var auth = require('./../controllers/auth-controller');

module.exports = function ($route, $logger) {
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
};