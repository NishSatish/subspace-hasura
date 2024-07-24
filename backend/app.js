import express from "express";
import cors from 'cors';
import { gql, request } from 'graphql-request';
import jwt from "jsonwebtoken";
import { getTransactions, signUpQuery, updateBalance, userQuery, verifyLogin } from "./queries/queries.js";
import verifyToken from "./middleware/verifyToken.js";

const app = express();
const port = process.env.PORT || 9000;
app.use(express.json());
app.use(cors())

// This Express backend is to take in requests from the frontend and basically figure out what 
// query/mutation should be called when.
const apiUrl = process.env.HASURA_URL;
const secret = process.env.JWT_SECRET;

const headers = {
  'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
  'content-type': 'application/json'
}

// Signup Route
app.post('/signup', async (req, res) => {
  const {username, pwd} = req.body;
  try {
    const data  = await request(apiUrl, signUpQuery, {"pwd" : pwd, "username": username}, headers);
    console.log(data);
    res.json({msg: "algoog"});
  } catch (error) {
    console.error(error)
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const {username, pwd} = req.body;
  try {
    const { User } = await request(apiUrl, verifyLogin, {"username": username}, headers);
    if (!User[0].pwd) {
      throw new Error('invalid')
    }
    if (pwd !== User[0].pwd) {
      throw new Error('invalid')
    }
    const token = await jwt.sign({username}, secret);
    res.status(200).json({token});
  } catch (error) {
    res.status(500).json({error: "invalid creds"});
  }
});


// Withdraw/Deposit Routes
app.post('/transact', verifyToken, async (req, res) => {
  const username = req.user;
  const { type, amount } = req.body;
  const TYPES = { d: "DEPOSIT", w: "WITHDRAW" }
  try {
    const { User } = await request(apiUrl, userQuery, {"username": username}, headers);
    let newBalance;
    if (type == TYPES.d) {
      newBalance = (User[0].balance + parseFloat(amount)).toFixed(2);
    } else {
      if (amount > User[0].balance) {
        throw new Error('not enough funds');
      }
      newBalance = (User[0].balance - parseFloat(amount)).toFixed(2);
    }
    const { update_User } = await request(
      apiUrl, 
      updateBalance, 
      {"username": username, "balance": newBalance, "type": type, "amount": amount}, 
      headers
    );
    if (update_User.returning.length > 0) {
      res.status(200).json({balance: update_User.returning[0].balance});
    } else {
      throw new Error('something went wrong');
    }
  } catch (error) {
    res.status(500).json({error});
    console.error(error)
  }
  
})

// Fetch Balance Route
app.get('/balance', verifyToken, async (req, res) => {
  const username = req.user;
  try {
    const { User } = await request(apiUrl, userQuery, {"username": username}, headers);
    if (User.length == 0) {
      throw new Error('user not found');
    }
    res.status(200).json({ balance: User[0].balance });
  } catch (error) {
    res.status(500).json({error});
    console.error(error)
  }
});

// Fetch Transactions Route
app.get('/transactions', verifyToken, async (req, res) => {
  const username = req.user;
  try {
    const { Transactions } = await request(apiUrl, getTransactions, {"username": username}, headers);
    if (!Transactions) {
     throw new Error('txns not found');
    }
    res.status(200).json({transactions: Transactions});
  } catch (error) {
    res.status(500).json({error});
    console.error(error)
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
