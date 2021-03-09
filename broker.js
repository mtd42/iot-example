const fs = require('fs');
const tls = require('tls');
const aedes = require('aedes')();
const logger = require('node-color-log')

const key = fs.readFileSync('./auth/server/server.key');
const cert = fs.readFileSync('./auth/server/server.crt');

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

aedes.authorizePublish = (client, packet, callback) => {
    const userPublisher = users.find((user) => user.role === 'publisher');
    if (userPublisher && userPublisher.id === client.id) {
        logger.info(`${client.id} published this message -> "${packet.payload.toString()}"`);
        callback(null)
    } else {
        logger.error(`${client.id} can not publish.`);
    }
}

aedes.authorizeSubscribe = (client, sub, callback) => {
    const userSubscriber= users.find((user) => user.role === 'subscriber');
    if (userSubscriber && userSubscriber.id === client.id) {
        logger.info(`${client.id} subscribed this topic -> "${sub.topic}"`);
        callback(null, sub)
    } else {
        logger.error(`${client.id} can not subscribe.`);
    }
}

tls.createServer({ key, cert }, aedes.handle).listen(3000);
