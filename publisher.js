const mqtt = require('mqtt');
const logger = require('node-color-log');
const fs = require('fs');

/**
 * Correspond à la clé du client et le certificat du client
 */
const KEY = fs.readFileSync("./auth/client/client.key");
const CRT = fs.readFileSync("./auth/client/client.crt");

/**
 * Options à passer à la connexion au broker
 * Note : Ici le mot de passe est en dur pour la démonstration
 * une autentification par JWT serait préférable
 */
const options = {
    clientId: "pub_id",
    username: "pub",
    password: "password",
    key: KEY,
    cert: CRT,
    rejectUnauthorized: false,
};

/**
 * Connexion au broker
 */
const client = mqtt.connect('mqtts://localhost:3000', options);

/**
 * Publication toutes les 5 secondes une fois connecté au broker
 */
const topic = 'TopicExample';
const message = 'Hello World';
client.on('connect', () => {
    setInterval(() => {
        client.publish(topic, message);
        logger.info(`[ Publisher ]\nMessage: "${message}"\n`);
    }, 5000);
});

/**
 * Décommenter les lignes suivantes pour tester que le publicateur ne peux pas souscrire.
 */
// client.on('connect', () => {
//     client.subscribe(topic);
// });
