var amqp = require('amqplib/callback_api');
var pushNoti = require('../controllers/PushNotificationController');

module.exports = MessageConsumer;

function MessageConsumer($config, $logger, $socketIOConnection) {
    var self = this;
    this.listen = function() {
        amqp.connect("amqp://" + $config.get("mq.username") + ":" + $config.get("mq.password") +"@" + $config.get("mq.host") + ":" + $config.get("mq.port"),
            function(err, conn) {
                console.log("connected to message server!");
                conn.createChannel(function(err, ch) {
                    var ex = $config.get("mq.exchange");
                    ch.assertExchange(ex, 'topic', {durable: false});
                    ch.assertQueue('', {exclusive: false}, function(err, q) {
                          ch.bindQueue(q.queue, ex, "data.*.*");
                          ch.consume(q.queue, function(msg) {
                              self.consume(msg.fields.routingKey, msg.content.toString());
                          }, {noAck: true});
                    });
                });
            }
        );
    };

    this.consume = function(routingKey, message) {
        $logger.debug("Consuming message: " + routingKey, message);
        var data = JSON.parse(message);
        if (routingKey == "data.order.created"
            || routingKey == "data.order.updated"
            || routingKey == "data.order.deleted"
            || routingKey == "data.order_item.created"
            || routingKey == "data.order_item.updated"
            || routingKey == "data.order_item.deleted"
            || routingKey == "data.group_item.deleted"
            || routingKey == "data.group_item.deleted") {
            $socketIOConnection.sendMessageToFilteredSessions({"business_id": data.business_id}, routingKey, message);
            }
        if (routingKey == "data.order.updated") {
            if (typeof data.status !== "undefined"
                && typeof data.device_id !== "undefined"
                && data.device_id !== null) {
                pushNoti.pushOrderStatus(data);
            }
        } else if (routingKey == "data.order_item.updated") {
            if (typeof data.status !== "undefined") {
                pushNoti.pushOrderItemStatus(data);
            }
        }
    };

    this.listen();
}
