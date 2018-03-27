/**
 * Created by tuananhzippy on 3/24/18.
 */
module.exports.init = function ($route) {
    /** Auth **/
    $route.gateway({
        method: 'post',
        route: '/api/sign-in',
        services: [
            {
                id: 'USER_SERVICE',
                path: '/api/sign-in',
                return: 'user'
            }
        ],
        action: "AuthController@signIn"
    });

    $route.gateway({
        method: 'post',
        route: '/api/sign-up',
        services: [
            {
                id: 'USER_SERVICE',
                path: '/api/sign-up',
                return: 'user'
            }
        ],
        action: "AuthController@signUp"
    });

    /* Activity */
    $route.gateway({
        method: 'get',
        route: '/api/forgot-password',
        services: [
            {
                id: 'USER_SERVICE',
                path: '/api/user/forgot-password',
                return: 'user'
            }
        ]
    });
    $route.gateway({
        method: 'get',
        route: '/api/verify-password',
        services: [
            {
                id: 'USER_SERVICE',
                path: '/api/user/verify-password',
                return: 'user'
            }
        ]
    });
    $route.gateway({
        method: 'post',
        route: '/api/customer/sign-in',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer/sign-in',
                return: 'user'
            }
        ],
        action: "AuthController@signIn"
    });
    $route.gateway({
        method: 'post',
        route: '/api/customer/facebook',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer/facebook',
                return: 'user'
            }
        ],
        action: "AuthController@signIn"
    });
    $route.gateway({
        method: 'post',
        route: '/api/customer/google',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer/google',
                return: 'user'
            }
        ],
        action: "AuthController@signIn"
    });

    $route.gateway({
        method: 'post',
        route: '/api/customer/sign-up',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer/sign-up',
                return: 'user'
            }
        ],
        action: "AuthController@signUp"
    });

    $route.gateway({
        method: 'post',
        route: '/api/customer/forgot-password',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer/forgot-password',
                return: 'user'
            }
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/customer/verify-password',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer/verify-password',
                return: 'user'
            }
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/customer/reset-password',
        services: [
            {
                id: 'CUSTOMER_SERVICE',
                path: '/api/customer/reset-password',
                return: 'user'
            }
        ]
    });
}