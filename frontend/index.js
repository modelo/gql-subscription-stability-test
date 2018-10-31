import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import gql from 'graphql-tag';

// Create an http link:
const httpLink = new HttpLink({
  uri: `http://52.82.24.149:8084/graphql`
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://52.82.24.149:8085/graphql`,
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
  },
});

let i = 0;
client.subscribe({
    query: gql`
      subscription testSub {
          testSub
      }`,
    variables: {}
  }).subscribe({
      next: (data) => {
          // Notify your application with the new arrived data
          console.log(data);
          client.query({
              query: gql`
                query testQuery {
                    testQuery
                }`,
              variables: {}
          }).then(data => console.log(data));

          i++
          document.getElementById('count').innerHTML = i;
      }
  })