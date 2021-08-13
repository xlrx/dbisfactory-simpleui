
//var kHost = '134.60.152.152:9092'; //process.env.KAFKA_HOST ||
//var kTopic = 'hackathon2'

var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    kafkaclient1 = new kafka.KafkaClient({kafkaHost: '134.60.152.152:9092'}),
    consumer = new Consumer(
        kafkaclient1,
        [
            { topic: 'hackathon2'}
        ],
        {
            autoCommit: false
        }
    );

// WebSocket
var WebSocketServer = require('ws').Server,
    ws = new WebSocketServer({port: 40510});

ws.on('connection', function (ws) {
    ws.on('message', function (message) {
        console.log('received: %s', message)
    });
    /*setInterval(
        () => ws.send(`${new Date()}`),
        1000
    )*/
    consumer.on('message', function(message) {
        //var buf = new Buffer(message.value, 'binary'); // Read string into a buffer.
        //var decodedMessage = buf.slice(0)
        console.log(message);
        try {
            //const jsonMessage = JSON.parse(buf);
            ws.send(message.value);
        } catch(err) {
            console.error(err);
        }
    });

});



consumer.on('error', function(err) {
    console.log('error', err);
});

process.on('SIGINT', function() {
    consumer.close(true, function() {
        process.exit();
    });
});




