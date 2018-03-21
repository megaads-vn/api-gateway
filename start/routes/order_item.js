/**
 * Created by tungnk on 1/03/18.
 */
module.exports.init = function ($route) {
    $route.gateway({
        method: 'get',
        route: '/api/order-item',
        type: "pipe",
        services: [
            {
                id: 'ORDER_ITEM_SERVICE',
                path: '/api/order-item',
                method: 'get',
                return: 'order_item'
            },
            {
                id: 'PRODUCT_SERVICE',
                path: '/api/product?ids=:join_column',
                method: 'get',
                join_from: 'order_item',
                join_column: 'product_id',
                return: 'product'
            }
        ]
    });
    $route.gateway({
        method: 'get',
        route: '/api/order-item/:id',
        type: "pipe",
        services: [
            {
                id: 'ORDER_ITEM_SERVICE',
                path: '/api/order-item/:id',
                method: 'get',
                return: 'order_item'
            }
        ]
    });
    $route.gateway({
        method: 'get',
        route: '/api/order-item/order/product/:id',
        type: "pipe",
        services: [
            {
                id: 'ORDER_ITEM_SERVICE',
                path: '/api/order-item/:id',
                method: 'get',
                return: 'order_item'
            },
            {
                id: 'ORDER_SERVICE',
                path: '/api/order?ids=:join_column',
                method: 'get',
                join_from: 'order_item',
                join_column: 'order_id',
                return: 'order'
            },
            {
                id: 'PRODUCT_SERVICE',
                path: '/api/product?ids=:join_column',
                method: 'get',
                join_from: 'order_item',
                join_column: 'product_id',
                return: 'product'
            }
        ]
    });
    $route.gateway({
        method: 'get',
        route: '/api/get-cook',
        type: "pipe",
        services: [
            {
                id: 'ORDER_ITEM_SERVICE',
                path: '/api/order-item',
                method: 'get',
                return: 'order_item'
            },
            {
                id: 'ORDER_SERVICE',
                path: '/api/order?ids=:join_column',
                method: 'get',
                join_from: 'order_item',
                join_column: 'order_id',
                return: 'order'
            },
        ]
    });

    $route.gateway({
        method: 'patch',
        route: '/api/order-item/:id',
        services: [
            {
                id:'ORDER_ITEM_SERVICE',
                path: '/api/order-item/:id',
                return: 'order-item'
            }
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/order-item',
        services: [
            {
                id: 'ORDER_ITEM_SERVICE',
                path: '/api/order-item',
                return: 'order-item'
            }
        ]
    });

};
