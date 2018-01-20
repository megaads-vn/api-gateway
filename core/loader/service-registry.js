/**
 *
 * @author Phuluong
 * December 27, 2015
 */

/** Exports **/
module.exports = new ServiceRegistry();
/** Imports **/
var util = require("../app/util");
/** Modules **/
function ServiceRegistry() {
    var self = this;
    this.services = {};
    this.register = function(id, url) {
        self.services[id] = url;
    };
    this.getService = function(id) {
        return self.services[id];
    }
}
