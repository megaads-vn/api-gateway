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
                return: 'order'

            },
            {
                id: 'BUSINESS_SERVICE',
                path: '/api/business?ids=:join_column',
                method: 'get',
                join_from: 'order',
                join_column: 'business_id',
                return: 'business'
            },
            {
                id: 'SEATING_SERVICE',
                path: '/api/seating?ids=:join_column',
                method: 'get',
                join_from: 'order',
                join_column: 'seating_id',
                return: 'seating'
            },
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer?ids=:join_column',
                method: 'get',
                join_from: 'order',
                join_column: 'customer_id',
                return: 'customer'
            },
            // {
            //     id: 'USER_SERVICE',
            //     path: '/api/user?ids=:join_column',
            //     method: 'get',
            //     join_from: 'order.business',
            //     join_column: 'creator_id',
            //     return: 'creator_business'
            // },
            // {
            //     id: 'PRODUCT_SERVICE',
            //     path: '/api/product?ids=:join_column',
            //     method: 'get',
            //     join_from: 'order.items',
            //     join_column: 'product_id',
            //     return: 'product'
            // }
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
                return: 'order'
            },
            {
                id: 'BUSINESS_SERVICE',
                path: '/api/business?ids=:join_column',
                method: 'get',
                join_from: 'order',
                join_column: 'business_id',
                return: 'business'
            },
            {
                id: 'SEATING_SERVICE',
                path: '/api/seating?ids=:join_column',
                method: 'get',
                join_from: 'order',
                join_column: 'seating_id',
                return: 'seating'
            },
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer?ids=:join_column',
                method: 'get',
                join_from: 'order',
                join_column: 'customer_id',
                return: 'customer'
            },
            // {
            //     id: 'USER_SERVICE',
            //     path: '/api/user?ids=:join_column',
            //     method: 'get',
            //     join_from: 'order.business',
            //     join_column: 'creator_id',
            //     return: 'creator_business'
            // },
            // {
            //     id: 'PRODUCT_SERVICE',
            //     path: '/api/product?ids=:join_column',
            //     method: 'get',
            //     join_from: 'order.items',
            //     join_column: 'product_id',
            //     return: 'product'
            // }
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/order',
        services: [
            {
                id: 'ORDER_SERVICE',
                path: '/api/order',
                return: 'order'
            }
        ]
    });
    $route.gateway({
        method: 'put',
        route: '/api/order/:id',
        services: [
            {
                id: 'ORDER_SERVICE',
                path: '/api/order/:id',
                return: 'order'
            }
        ]
    });
    $route.gateway({
        method: 'patch',
        route: '/api/order/:id',
        services: [
            {
                id:'ORDER_SERVICE',
                path: '/api/order/:id',
                return: 'order'
            }
        ]
    });
    $route.gateway({
        method: 'delete',
        route: '/api/order/:id',
        services: [
            {
                id: 'ORDER_SERVICE',
                path: '/api/order/:id',
                return: 'order'
            }
        ]
    });
};
