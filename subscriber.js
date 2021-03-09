const mqtt = require('mqtt');
const logger = require('node-color-log');
const fs = require('fs');

const KEY = fs.readFileSync("./auth/client/client.key");
const CRT = fs.readFileSync("./auth/client/client.crt");

const options = {
    clientId: "sub_id",
    username: "sub",
    password: "password",
    key: KEY,
    cert: CRT,
    rejectUnauthorized: false,
};

const client = mqtt.connect('mqtts://localhost:3000', options);

const topic = 'TopicExample';


client.on('message', (topic, message) => {
    message = message.toString();
    logger.info(`[ Subscriber ]\nTopic: "${topic}"\nMessage: "${message}"\n`);
});

client.on('connect', () => {
    client.subscribe(topic);
});

// Décommenter les lignes suivante pour tester que le souscripteur ne peut pas publier
// const message = 'Hello';
// client.on('connect', () => {
//     setInterval(() => {
//         client.publish(topic, message);
//         logger.info(`[ Publisher ]\nMessage: "${message}"\n`);
//     }, 5000);
// });
