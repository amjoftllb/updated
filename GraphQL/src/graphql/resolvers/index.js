const { mergeResolvers } = require('@graphql-tools/merge');
const userResolver = require('./user.resolvers');

const resolvers = mergeResolvers([userResolver]);

module.exports = resolvers;
