/**
 * Created by tuananhzippy on 1/31/18.
 */
module.exports.init = function ($route) {

    $route.gateway({
        method: 'get',
        route: '/api/category',
        type: "pipe",
        services: [
            {
                id: 'CATEGORY_SERVICE',
                path: '/api/category',
                method: 'get',
                return: 'category'

            },
            {
                id: 'BUSINESS_SERVICE',
                path: '/api/business?ids=:join_column',
                method: 'get',
                join_from: 'category',
                join_column: 'business_id',
                return: 'business'
            },
            {
                id: 'USER_SERVICE',
                path: '/api/user?ids=:join_column',
                method: 'get',
                join_from: 'category',
                join_column: 'creator_id',
                return: 'creator'
            }
        ]
    });

    $route.gateway({
        method: 'get',
        route: '/api/category/:id',
        services: [
            {
                id: 'CATEGORY_SERVICE',
                path: '/api/category/:id',
                return: 'category'
            }
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/category',
        services: [
            {
                id: 'CATEGORY_SERVICE',
                path: '/api/category',
                return: 'category'
            }
        ]
    });
    $route.gateway({
        method: 'put',
        route: '/api/category/:id',
        services: [
            {
                id: 'CATEGORY_SERVICE',
                path: '/api/category/:id',
                return: 'category'
            }
        ]
    });
    $route.gateway({
        method: 'delete',
        route: '/api/category/:id',
        services: [
            {
                id: 'CATEGORY_SERVICE',
                path: '/api/category/:id',
                return: 'category'
            }
        ]
    });
}