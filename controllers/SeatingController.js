/**
 * Created by tuanpa on 1/26/18.
 */

function SeatingController($event, $config, $logger) {
    this.demo = function (io) {
      console.log(io.inputs.gateway);
    };
}
module.exports = SeatingController;