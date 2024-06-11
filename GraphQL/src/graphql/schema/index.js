const { mergeTypeDefs } = require('@graphql-tools/merge');
const userSchema = require('./user.schema.js'); 

const typeDefs = mergeTypeDefs([userSchema]);

module.exports = typeDefs;
