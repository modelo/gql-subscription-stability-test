const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();


module.exports = {
    Query: {
        testQuery: (id) => {
            console.log('query,', new Date());
            return 'test';
        }
    },
    Subscription: {
        testSub: {
            subscribe: () => pubsub.asyncIterator('channel'),
        }
    },
};

setInterval(() => {
    console.log('publish,', new Date());
    pubsub.publish('channel', `{msg: 'publish'}`);
}, 5000);
