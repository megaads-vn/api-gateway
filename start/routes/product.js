/**
 * Created by tuananhzippy on 1/31/18.
 */
module.exports.init = function ($route) {

    $route.gateway({
        method: 'get',
        route: '/api/product',
        type: "pipe",
        services: [
            {
                id: 'PRODUCT_SERVICE',
                path: '/api/product',
                method: 'get',
                return: 'product'
            },
            {
                id: 'CATEGORY_SERVICE',
                path: '/api/category?ids=:join_column',
                method: 'get',
                join_from: 'product',
                join_column: 'category_id',
                return: 'category'
            },
            {
                id: 'BUSINESS_SERVICE',
                path: '/api/business?ids=:join_column',
                method: 'get',
                join_from: 'product',
                join_column: 'business_id',
                return: 'business'
            }
        ]
    });

    $route.gateway({
        method: 'get',
        route: '/api/product/:id',
        services: [
            {
                id: 'PRODUCT_SERVICE',
                path: '/api/product/:id',
                return: 'product'
            }
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/product',
        services: [
            {
                id: 'PRODUCT_SERVICE',
                path: '/api/product',
                return: 'product'
            }
        ]
    });
    $route.gateway({
        method: 'put',
        route: '/api/product/:id',
        services: [
            {
                id: 'PRODUCT_SERVICE',
                path: '/api/product/:id',
                return: 'product'
            }
        ]
    });
    $route.gateway({
        method: 'delete',
        route: '/api/product/:id',
        services: [
            {
                id: 'PRODUCT_SERVICE',
                path: '/api/product/:id',
                return: 'product'
            }
        ]
    });
}