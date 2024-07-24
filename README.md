# SubSpace Assignment

## Setup Instructions
  * Clone the repository
  * The backend directory have package.json files. Run 'npm install' in both directories
  * The backend is hardcoded to run on port 9000. Run 'npm run start' in the backend directory to start the server
  * Serve the static frontend with any dev server. I've used the Live Server in VSC for ease
  * Environment variables will be shared in private if required
  
## Design Choices
  I decided to use the express app to call all of the queries that are prebuilt on Hasura Cloud. Consider it a proxied frontend. I've implemented basic JWT 
  authentication for user accounts. Every user has a balance and can withdraw from or deposit into it. There is also a transactions log that's used to display
  all of a user's transactions.
  
## API Documentation
  Backend Endpoints
  * (POST) /login and (POST) /signup for authentication (200 success, 500 error)
  * /transact (POST, 200 success, 500 error) for withdraw/deposit operations
  * /balance (GET, 200 success, 500 error) for fetching the balance of the user
  * /transactions (GET. 200 success, 500 error) for fetching all transactions of a user
  
## Security
  * JWT secured authentication system
  * Bcrypt was an obvious choice but had problems running it on M1 silicon.
  * Simultaneous Mutations (similar to transactions in REST)
  * Sensitive information injected as environment variables 
