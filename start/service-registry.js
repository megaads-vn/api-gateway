
var config = require(__dir + "/core/app/config");

module.exports = function ($serviceRegistry) {
    $serviceRegistry.register("CUSTOMER_SERVICE", config.get("app.serviceUrl"));
    $serviceRegistry.register("ORDER_SERVICE", config.get("app.serviceUrl"));
    $serviceRegistry.register("SEATING_SERVICE", config.get("app.serviceUrl"));
    $serviceRegistry.register("BUSINESS_SERVICE", config.get("app.serviceUrl"));
    $serviceRegistry.register("USER_SERVICE", config.get("app.serviceUrl"));
    $serviceRegistry.register("CATEGORY_SERVICE", config.get("app.serviceUrl"));
    $serviceRegistry.register("PRODUCT_SERVICE", config.get("app.serviceUrl"));
    $serviceRegistry.register("IMAGE_SERVICE", config.get("app.serviceUrl"));
    $serviceRegistry.register("TEST_SERVICE", config.get("app.serviceUrl"));
};
