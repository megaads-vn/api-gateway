var _       = require('lodash'),
    jwt     = require('jsonwebtoken'),
    bcrypt  = require('bcrypt'),
    config = require('./../core/app/config');

module.exports = function ($route) {
  $route.filter("auth", function (io) {
        if(io.request && io.request.headers && io.request.headers.authorization && io.request.headers.authorization.split(' ')[0] === 'JWT'){
          jwt.verify(io.request.headers.authorization.split(' ')[1], config.get('app.secret'), function(err, decode){
            if (err) {
              io.user = undefined;
              return io.status(401).json({
                  status: 401,
                  result: "unauthorized"
              });
            } else {
              io.inputs.creator_id = decode.id;
              return false;
            }
          });
        }else{
          return io.status(401).json({
              status: 401,
              result: "unauthorized"
          });
        }
    });
};