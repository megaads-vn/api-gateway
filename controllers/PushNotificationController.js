var request = require('request');
var config = require(__dir + "/core/app/config");
var util = require(__dir + "/core/app/util");
module.exports = new PushNotificationController();

function PushNotificationController() {
    this.pushOrderStatus = function (data) {

        var myJSONObject = {
            // 'title': "Thanh toán thành công"
            // 'msg': 'Bạn đã thanh toán xong, và có thể đặt món ăn mới!',
            'device_id': data.device_id,
            'type': 'ORDER_STATUS'
        };
        if(data.status == "paid"){
            myJSONObject.title = "Thanh toán thành công";
            myJSONObject.msg = "Bạn đã thanh toán xong, và có thể đặt món ăn mới!";
        }else if(data.status == "cancel"){
            myJSONObject.title = "Thực đơn đã huỷ";
            myJSONObject.msg = "Thực đơn của bạn đã huỷ, và có thể đặt món ăn mới!";
        }else {
            return;
        }
        request({
            url: config.get("app.serviceUrl")+ '/api/push-notification/push-device',
            method: "POST",
            json: true,   // <--Very important!!!
            body: myJSONObject
        }, function (error, response, body){
            console.log(body);
        });

  }

  this.pushOrderItemStatus = function (data) {

        var myJSONObject = {
            'title': "Trạng thái món ăn",
            'type': 'ORDER_ITEM_STATUS'
        };

        request({
            url: "http://"+util.getLocalIP()+':'+config.get("app.port")+'/api/order-item/order/product/'+ data.id+ "?token="+config.get('app.serviceToken'),
            method: "GET",
        }, function (error, response, body){
            var result = JSON.parse(body);
            if(result.order_item.status == "successful" &&
                typeof result.order_item.data.order !== "undefined" &&
                typeof result.order_item.data.order.device_id !== "undefined" &&
                result.order_item.data.order.device_id != null){
                myJSONObject.device_id = result.order_item.data.order.device_id;
                if(data.status == "ready"){
                    myJSONObject.msg = result.order_item.data.product.name+" đã chế biến xong!"
                }else if(data.status == "inprocess"){
                    myJSONObject.msg = result.order_item.data.product.name+" bắt đầu chế biến!"
                }else if(data.status == "cancel"){
                    myJSONObject.msg = result.order_item.data.product.name+" đã huỷ!"
                }else{
                    return;
                }
                request({
                    url: config.get("app.serviceUrl")+ '/api/push-notification/push-device',
                    method: "POST",
                    json: true,   // <--Very important!!!
                    body: myJSONObject
                }, function (error, response, body){
                    // console.log(body);
                });
            }
            // console.log(body);
        });
    }
}
