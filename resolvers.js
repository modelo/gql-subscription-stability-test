const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();


module.exports = {
    Query: {
        testQuery: (id) => {
            console.log('query,', new Date().getTime());
            return new Date().getTime();
        }
    },
    Subscription: {
        testSub: {
            subscribe: () => pubsub.asyncIterator('channel'),
        }
    },
};

setInterval(() => {
    console.log('publish,', new Date().getTime());
    pubsub.publish('channel', `{msg: 'publish'}`);
}, 5000);
