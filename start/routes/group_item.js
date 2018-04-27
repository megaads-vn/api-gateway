/**
 * Created by tungnk on 1/03/18.
 */
module.exports.init = function ($route) {
    $route.gateway({
        method: 'get',
        route: '/api/group-item',
        type: 'pipe',
        services: [
            {
                id: 'GROUP_ITEM_SERVICE',
                path: '/api/group-item',
                method: 'get',
                return: 'group_item'
            },
            {
                id: 'ORDER_ITEM_SERVICE',
                path: '/api/order-item?ids=:join_column&page_size=-1',
                method: 'get',
                join_from: 'group_item',
                join_column: 'value',
                return: 'order_item'
            },
            {
                id: 'PRODUCT_SERVICE',
                path: '/api/product?ids=:join_column&page_size=-1',
                method: 'get',
                join_from: 'group_item',
                join_column: 'product_id',
                return: 'product'
            }
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/group-item/:id',
        services: [
            {
                id: 'GROUP_ITEM_SERVICE',
                path: '/api/group-item/:id',
                return: 'group_item'
            }
        ]
    });

    $route.gateway({
        method: 'post',
        route: '/api/group-item/seperate-item/:id',
        services: [
            {
                id: 'GROUP_ITEM_SERVICE',
                path: '/api/group-item/seperate-item/:id',
                return: 'group_item'
            }
        ]
    });

};
