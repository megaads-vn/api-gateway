
module.exports = AuthController;

function AuthController() {

  this.signUp = function (io) {
    return io.json(io.inputs.gateway.user);
  }

  this.signIn = function (io) {
    if (typeof io.inputs.gateway.user.access_token != "undefined") {
      return io.json(io.inputs.gateway.user);
    } else {
      return io.json({
        status: "fail",
        result: 401
      });
    }
  }


}