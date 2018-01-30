/**
 * Created by tuanpa on 1/26/18.
 */
module.exports.init = function ($route) {
    $route.gateway({
        method: 'get',
        route: '/api/order',
        type: "pipe",
        services: [
            {
                id: 'ORDER_SERVICE',
                path: '/api/order',
                method: 'get',
                return: 'orders'

            },
            {
                id: 'BUSINESS_SERVICE',
                path: '/api/business?ids=:join_column',
                method: 'get',
                join_from: 'orders',
                join_column: 'business_id',
                return: 'business'
            },
            {
                id: 'SEATING_SERVICE',
                path: '/api/seating?ids=:join_column',
                method: 'get',
                join_from: 'orders',
                join_column: 'seating_id',
                return: 'seating'
            }
        ]
    });

    $route.gateway({
        method: 'get',
        route: '/api/order/:id',
        type: "pipe",
        services: [
            {
                id: 'ORDER_SERVICE',
                path: '/api/order/:id',
                return: 'orders'
            },
            {
                id: 'BUSINESS_SERVICE',
                path: '/api/business?ids=:join_column',
                method: 'get',
                join_from: 'orders',
                join_column: 'business_id',
                return: 'business'
            },
            {
                id: 'SEATING_SERVICE',
                path: '/api/seating?ids=:join_column',
                method: 'get',
                join_from: 'orders',
                join_column: 'seating_id',
                return: 'seating'
            },
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/order',
        services: [
            {
                id: 'ORDER_SERVICE',
                path: '/api/order'

            }
        ]
    });
    $route.gateway({
        method: 'put',
        route: '/api/order/:id',
        services: [
            {
                id: 'ORDER_SERVICE',
                path: '/api/order/:id'

            }
        ]
    });
    $route.gateway({
        method: 'delete',
        route: '/api/order/:id',
        services: [
            {
                id: 'ORDER_SERVICE',
                path: '/api/order/:id'

            }
        ]
    });
};