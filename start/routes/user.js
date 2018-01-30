/**
 * Created by tuanpa on 1/26/18.
 */
module.exports.init = function($route) {
    $route.gateway({
        method: 'get',
        route: '/api/user',
        services: [
            {
                id: 'USER_SERVICE',
                path: '/api/user'
            }
        ]
    });

    $route.gateway({
        method: 'get',
        route: '/api/user/:id',
        services: [
            {
                id: 'USER_SERVICE',
                path:  '/api/user/:id'
            }
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/user',
        services: [
            {
                id: 'USER_SERVICE',
                path: '/api/user'
            }
        ]
    });
    $route.gateway({
        method: 'put',
        route: '/api/user/:id',
        services: [
            {
                id: 'USER_SERVICE',
                path: '/api/user/:id'
            }
        ]
    });
    $route.gateway({
        method: 'delete',
        route: '/api/user/:id',
        services: [
            {
                id: 'USER_SERVICE',
                path: '/api/user/:id'
            }
        ]
    });
};