/**
 * Created by tuananhzippy on 25/07/2018.
 */
module.exports.init = function ($route) {

    $route.gateway({
        method: 'get',
        route: '/api/report/order/:id',
        services: [
            {
                id: 'REPORT_SERVICE',
                path: '/api/report/order/:id',
                return: 'order'
            }
        ]
    });

    $route.gateway({
        method: 'get',
        route: '/api/report/product/:id',
        services: [
            {
                id: 'REPORT_SERVICE',
                path: '/api/report/product/:id',
                return: 'product'
            }
        ]
    });

}