const express = require('express');
const http = require('http');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser');
const { makeExecutableSchema } = require('graphql-tools');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const resolvers = require('./resolvers');

const app = express();

app.use(cors());
// query in our api test are big, ref: https://stackoverflow.com/a/19965089/4674834
app.use(bodyParser.json({ limit: '50mb' }));

// frontend
app.use(express.static(path.join(__dirname, './build')));

const typeDefs = fs.readFileSync(path.join(__dirname, './typeDefs.graphql'), 'utf8');

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

app.use('/graphql', graphqlHTTP(req => ({
    schema
})));

const { PORT = 8084 } = process.env;
app.listen(PORT, () => {
    console.log('Portal is up on', PORT);
});

// websocket server
const { WS_PORT = 8085 } = process.env;

// Create WebSocket listener server
const websocketServer = http.createServer((request, response) => {
    response.writeHead(404);
    response.end();
});

// Bind it to port and start listening
websocketServer.listen(WS_PORT, () => console.log(`Websocket Server is now running on http://localhost:${WS_PORT}`));

SubscriptionServer.create(
    {
        schema,
        execute,
        subscribe,
        onConnect: () => console.log('connected'),
        onDisconnect: () => console.log('disconnected'),
    },
    {
        server: websocketServer,
        path: '/graphql',
    },
);
