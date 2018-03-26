/**
 * Created by tuananhzippy on 1/31/18.
 */
module.exports.init = function ($route) {

    $route.gateway({
        method: 'get',
        route: '/api/customer',
        type: "pipe",
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer',
                return: 'customer'
            }
        ]
    });

    $route.gateway({
        method: 'get',
        type: "pipe",
        route: '/api/customer/:id',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path:  '/api/customer/:id',
                return: 'customer'
            }
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/customer',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer',
                return: 'customer'
            }
        ]
    });

    $route.gateway({
        method: 'put',
        route: '/api/customer/:id',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer/:id',
                return: 'customer'
            }
        ]
    });

    $route.gateway({
        method: 'patch',
        route: '/api/customer/:id',
        services: [
            {
                id:'ORDER_SERVICE',
                path: '/api/customer/:id',
                return: 'customer'
            }
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/customer/change-password',
        services: [
            {
                id:'ORDER_SERVICE',
                path: '/api/customer/change-password',
                return: 'customer'
            }
        ]
    });

    $route.gateway({
        method: 'delete',
        route: '/api/customer/:id',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer/:id',
                return: 'customer'
            }
        ]
    });

}
