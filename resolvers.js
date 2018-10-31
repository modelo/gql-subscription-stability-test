const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();


module.exports = {
    Query: {
        testQuery: (id) => {
            console.log(new Date());
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
    pubsub.publish('channel', `{msg: 'publish'}`);
    console.log('published');
}, 5000);
