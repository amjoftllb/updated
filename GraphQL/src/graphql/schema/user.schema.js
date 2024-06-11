const { gql } = require("apollo-server-express");

const bookSchema = gql`
  enum Gender {
    Male
    Female
  }

  type user {
    fullName: String!
    email: String!
    password: String!
    zipcode: String!
    gender: Gender!
    country: String!
    phoneNumber: Int!
  }

  type Query {
    getUser: user
  }

  type Mutation {
    registerUser(
      fullName: String!
      email: String!
      password: String!
      zipcode: Int!
      gender: String!
      country: String!
      phoneNumber: Int!
    ): user!
  }
`;

module.exports = bookSchema;
