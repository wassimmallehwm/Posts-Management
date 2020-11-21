const {ApolloServer, PubSub} = require('apollo-server');
const mongoose = require('mongoose');
require ('dotenv').config();
const pubsub = new PubSub();

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req, pubsub})
});

mongoose.connect(process.env.DB_URI,
    {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, 
    () => {
        console.log('Database connected')
        server.listen({port: 5500})
        .then(res => {
            console.log(`Server running at ${res.url}`)
        })
    },
    error => {
        console.log(error)
    }
);

