import { gql } from 'graphql-request';

export const userQuery = gql`
  query ($username: String!) {
    User(where: {username: {_eq: $username}}) {
      balance
      username
    }
  }
`;

export const verifyLogin = gql`
  query ($username: String!) {
    User(where: {username: {_eq: $username}}) {
      pwd
    }
  }
`;

export const signUpQuery = gql`
  mutation ($pwd: String!, $username: String!) {
    insert_User_one(object: {pwd: $pwd, username: $username}) {
      id
    }
  }
`;

export const updateBalance = gql`
  mutation($username: String!, $balance: float8!, $type: String!, $amount: float8!) {
    update_User(where: {username: {_eq: $username}}, _set: {balance: $balance}) {
      returning {
        balance
      }
    }

    insert_Transactions_one(object: {amount: $amount, type: $type, user: $username}) {
      id
    }
  }
`;

export const getTransactions = gql`
  query ($username: String!) {
    Transactions(where: {user: {_eq: $username}}) {
      type
      amount
    }
  }
`;