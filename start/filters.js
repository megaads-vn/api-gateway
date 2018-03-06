var jwt     = require('jsonwebtoken'),
    bcrypt  = require('bcrypt');

module.exports = function ($route, $config) {
    $route.filter("auth", function (io) {
        var result = false;
        if (io.inputs["token"] != null && io.inputs["token"] == $config.get('app.serviceToken')) {
            result = true;
        }
        if (io.request
                && io.request.headers
                && io.request.headers.authorization
                && io.request.headers.authorization.split(' ')[0] === 'JWT'){
            try {
                var decoded = jwt.verify(io.request.headers.authorization.split(' ')[1], $config.get('app.secret'));
                io.inputs.creator_id = decoded.id;
                result = true;
            } catch(err) {}
        }
        if (result) {
            return true;
        } else {
            return io.status(401).json({
                status: 401,
                result: "unauthorized"
            });
        }
    });
};
