/**
 * Created by tuananhzippy on 1/31/18.
 */
module.exports.init = function ($route) {

    $route.gateway({
        method: 'get',
        route: '/api/notification',
        type: "pipe",
        services: [
            {
                id: 'NOTIFICATION_SERVICE',
                path: '/api/notification',
                method: 'get',
                return: 'notification'

            },
            {
                id: 'BUSINESS_SERVICE',
                path: '/api/business?ids=:join_column',
                method: 'get',
                join_from: 'notification',
                join_column: 'business_id',
                return: 'business'
            },
            {
                id: 'USER_SERVICE',
                path: '/api/user?ids=:join_column',
                method: 'get',
                join_from: 'notification',
                join_column: 'creator_id',
                return: 'creator'
            }

        ]
    });

    $route.gateway({
        method: 'get',
        route: '/api/notification/:id',
        services: [
            {
                id: 'NOTIFICATION_SERVICE',
                path: '/api/notification/:id',
                return: 'notification'
            }
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/notification',
        services: [
            {
                id: 'NOTIFICATION_SERVICE',
                path: '/api/notification',
                return: 'notification'
            }
        ]
    });
    $route.gateway({
        method: 'put',
        route: '/api/notification/:id',
        services: [
            {
                id: 'NOTIFICATION_SERVICE',
                path: '/api/notification/:id',
                return: 'notification'
            }
        ]
    });
    $route.gateway({
        method: 'delete',
        route: '/api/notification/:id',
        services: [
            {
                id: 'NOTIFICATION_SERVICE',
                path: '/api/notification/:id',
                return: 'notification'
            }
        ]
    });
}
