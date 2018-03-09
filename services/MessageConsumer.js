var amqp = require('amqplib/callback_api');
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
        $socketIOConnection.broadcastMessage(routingKey, message);
    };

    this.listen();
}
