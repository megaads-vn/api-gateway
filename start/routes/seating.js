/**
 * Created by tuanpa on 1/26/18.
 */
module.exports.init = function($route) {
    $route.gateway({
        method: 'get',
        route: '/api/seating',
        type: "pipe",
        services: [
            {
                id: 'SEATING_SERVICE',
                path: '/api/seating',
                method: 'get',
                return: 'seating'

            },
            {
                id: 'BUSINESS_SERVICE',
                path: '/api/business?ids=:join_column&page_size=-1',
                method: 'get',
                join_from: 'seating',
                join_column: 'business_id',
                return: 'business'
            },
            {
                id: 'USER_SERVICE',
                path: '/api/user?ids=:join_column&page_size=-1',
                method: 'get',
                join_from: 'seating',
                join_column: 'creator_id',
                return: 'creator'
            }
        ]
    });

    $route.gateway({
        method: 'get',
        route: '/api/seating/:id',
        services: [
            {
                id: 'SEATING_SERVICE',
                path: '/api/seating/:id',
                return: 'seating'
            }
        ]
    });

    $route.gateway({
        method: 'get',
        route: '/api/seating/print/:id',
        services: [
            {
                id: 'SEATING_SERVICE',
                path: '/api/seating/print/:id',
                return: 'seating'
            }
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/seating',
        services: [
            {
                id: 'SEATING_SERVICE',
                path: '/api/seating',
                return: 'seating'
            }
        ]
    });
    $route.gateway({
        method: 'put',
        route: '/api/seating/:id',
        services: [
            {
                id: 'SEATING_SERVICE',
                path: '/api/seating/:id',
                return: 'seating'
            }
        ]
    });
    $route.gateway({
        method: 'delete',
        route: '/api/seating/:id',
        services: [
            {
                id: 'SEATING_SERVICE',
                path: '/api/seating/:id',
                return: 'seating'
            }
        ]
    });
};