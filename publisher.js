const mqtt = require('mqtt');
const logger = require('node-color-log');
const fs = require('fs');

const KEY = fs.readFileSync("./auth/client/client.key");
const CRT = fs.readFileSync("./auth/client/client.crt");
const options = {
    clientId: "pub_id",
    username: "pub",
    password: "password",
    key: KEY,
    cert: CRT,
    rejectUnauthorized: false,
};

const client = mqtt.connect('mqtts://localhost:3000', options);
const topic = 'TopicExample';
const message = 'Hello World';

client.on('connect', () => {
    setInterval(() => {
        client.publish(topic, message);
        logger.info(`[ Publisher ]\nMessage: "${message}"\n`);
    }, 5000);
});

// Décommenter les lignes suivantes pour tester que le publicateur ne peux pas publier.
// client.on('connect', () => {
//     client.subscribe(topic);
// });
