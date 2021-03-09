const fs = require('fs');
const tls = require('tls');
const aedes = require('aedes')();
const logger = require('node-color-log')

/**
 * Correspond à la clé et au certificat du serveur
 */
const key = fs.readFileSync('./auth/server/server.key');
const cert = fs.readFileSync('./auth/server/server.crt');

/**
 * Le tableau user est uniquement pour la démonstration
 * Ici nous considérons que les acteurs sont enregistrés dans une possible
 * base de données
 */
const users = [
    {
        id: 'pub_id',
        username: 'pub',
        password: 'password',
        role: 'publisher',
    },
    {
        id: 'sub_id',
        username: 'sub',
        password: 'password',
        role: 'subscriber'
    },
];

/**
 * Cette fonctionnalité permet de :
 * - Gérer la partie autentification
 * @param {Object} client 
 * @param {String} username 
 * @param {Buffer} password 
 * @param {Function} callback 
 */
aedes.authenticate = (client, username, password, callback) => {
    const data = {
        id: client.id,
        username,
        password: password.toString(),
    };
    if (users.some((e) => e.username === data.username && e.password === data.password)) {
        logger.info(`${client.id} is authenticated.`);
        callback(null, true)
    } else {
        logger.error(`${client.id} try to connect with invalid credidentials.`);
    }
};

/**
 * Cette fonctionnalité permet de :
 * - Gérer le comportement pour les publications
 * @param {Object} client 
 * @param {Object} packet 
 * @param {Function} callback 
 */
aedes.authorizePublish = (client, packet, callback) => {
    const userPublisher = users.find((user) => user.role === 'publisher');
    if (userPublisher && userPublisher.id === client.id) {
        logger.info(`${client.id} published this message -> "${packet.payload.toString()}"`);
        callback(null)
    } else {
        logger.error(`${client.id} can not publish.`);
    }
}

/**
 * Cette fonctionnalité permet de :
 * - Gérer le comportement pour les souscriptions
 * @param {Object} client 
 * @param {Object} sub 
 * @param {Function} callback 
 */
aedes.authorizeSubscribe = (client, sub, callback) => {
    const userSubscriber= users.find((user) => user.role === 'subscriber');
    if (userSubscriber && userSubscriber.id === client.id) {
        logger.info(`${client.id} subscribed this topic -> "${sub.topic}"`);
        callback(null, sub)
    } else {
        logger.error(`${client.id} can not subscribe.`);
    }
}

/**
 * Cette fonctionnalité permet de :
 * - Créer une connexion de type TLS
 */
tls.createServer({ key, cert }, aedes.handle).listen(3000);
