/**
 * Created by tuanpa on 1/26/18.
 */
module.exports.init = function ($route) {

        $route.gateway({
            method: 'get',
            route: '/api/business',
            type: "pipe",
            services: [
                {
                    id: 'BUSINESS_SERVICE',
                    path: '/api/business',
                    return: 'business'
                },
                {
                    id: 'USER_SERVICE',
                    path: '/api/user?ids=:join_column',
                    method: 'get',
                    join_from: 'business',
                    join_column: 'creator_id',
                    return: 'creator'
                }
            ]
    });

    $route.gateway({
        method: 'get',
        type: "pipe",
        route: '/api/business/:id',
        services: [
            {
                id: 'BUSINESS_SERVICE',
                path:  '/api/business/:id',
                return: 'business'
            },
            {
                id: 'USER_SERVICE',
                path: '/api/user?ids=:join_column',
                method: 'get',
                join_from: 'business',
                join_column: 'creator_id',
                return: 'creator'
            }
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/business',
        services: [
            {
                id: 'BUSINESS_SERVICE',
                path: '/api/business',
                return: 'business'
            }
        ]
    });
    $route.gateway({
        method: 'put',
        route: '/api/business/:id',
        services: [
            {
                id: 'BUSINESS_SERVICE',
                path: '/api/business/:id',
                return: 'business'
            }
        ]
    });
    $route.gateway({
        method: 'delete',
        route: '/api/business/:id',
        services: [
            {
                id: 'BUSINESS_SERVICE',
                path: '/api/business/:id',
                return: 'business'
            }
        ]
    });
};