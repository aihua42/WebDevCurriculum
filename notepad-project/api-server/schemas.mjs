import { gql } from "apollo-server-express";

const schemas = gql`
  type User {
    userId: String!
    nickname: String!
    pw: String!
  }

  type Text {
    userId: String
    textId: String
    title: String
    text: String
  }

  type Tab {
    userId: String
    activeTitle: String
    tabs: [TitleNText]
  }

  type TitleNText {
    title: String!
    text: String
  }

  input TitleNTextInput {
    title: String!
    text: String
  }

  type Token {
    refreshToken: String
  }

  type Query {
    text(userId: String!, textId: String!): Text
    tabs(userId: String!): Tab
  }

  type Mutation {
    signup(userId: String!, nickname: String!, pw: String!): Boolean
    login(userId: String!, pw: String!): Token
    logout(userId: String!, activeTitle: String!, tabs: [TitleNTextInput]!): Boolean
    refreshAccessToken(userId: String!, refreshToken: String!): Boolean
    addText(userId: String!, textId: String!, title: String!, text: String): Boolean
    updateText(userId: String!, textId: String!, key: String!, before: String!, after: String!): Boolean
    deleteText(userId: String!, textId: String!): Boolean
  }
`;

export default schemas;