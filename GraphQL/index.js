const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./src/graphql/schema/index.js");
const resolvers = require("./src/graphql/resolvers/index.js");
const connectDb = require("./src/db/connectDB.js");
const app = require("./app.js");
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  server.applyMiddleware({ app, path: "/graphql" });

  connectDb()
    .then(() => {
      app.listen(process.env.PORT || 8000, () => {
        console.log(`MONGO_DB_CONNECTED on port number ${process.env.PORT}`);
      });
    })
    .catch((err) => {
      console.log("Mongo_db connection failed !!!! ", err);
    });
});
