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
    clientId: "sub_id",
    username: "sub",
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
 * Affiche l'information envoyé par le publisher
 */
const topic = 'TopicExample';
client.on('message', (topic, message) => {
    message = message.toString();
    logger.info(`[ Subscriber ]\nTopic: "${topic}"\nMessage: "${message}"\n`);
});

/**
 * Souscription à un topic sur lequel le publisher envoie des données
 */
client.on('connect', () => {
    client.subscribe(topic);
});

/**
 *  Décommenter les lignes suivante pour tester que le souscripteur ne peut pas publier
 */
// const message = 'Hello';
// client.on('connect', () => {
//     setInterval(() => {
//         client.publish(topic, message);
//         logger.info(`[ Publisher ]\nMessage: "${message}"\n`);
//     }, 5000);
// });
