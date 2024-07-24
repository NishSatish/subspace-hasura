const TRANSACTIONS = {
  w: "WITHDRAW",
  d: "DEPOSIT"
}

const url = 'http://localhost:9000';

const signout = () => {
  localStorage.clear();
  window.location.href = './login/login.html';
}

const getBalance = async () => {
  const response = await fetch(url + '/balance', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authorization': localStorage.getItem("token")
    }
  });
  const res = await response.json();
  document.getElementById("balance").textContent = res.balance;
}

document.getElementById("transactions-view").style.display = "none";

// If user is logged in
if (localStorage.getItem("token")) {
  (async () => {
    await getBalance();
  })();
  document.getElementById("auth-buttons").style.display = "none";
  const username = localStorage.getItem("username");
  document.getElementById("content").innerHTML = `
  <div class="balance-info">
  <div class="balance-header">${username}'s balance</div>
  <div class="balance" id="balance">...</div>
  </div>
  <input type="number" class="inputs amount" step=".01" placeholder="Enter Amount" id="amount">
  <div class="formerror">Enter an amount above 0</div>
  <div class="auth-buttons">
  <button class="auth-btn" style="background-color: #d9534f;" onclick="submitTransaction('w')">Withdraw</button>
  <button class="auth-btn" style="background-color: #5cb85c;" onclick="submitTransaction('d')">Deposit</button>
  </div>
  <div class="signout">
  <a href="#" onclick="showTransactions()">View Transactions</a>
  </div>
  <div class="signout">
  <a href="#" onclick="signout()">Signout</a>
  </div>
  `;
  document.getElementsByClassName("formerror")[0].textContent = '';
}

const submitTransaction = async (mode) => {
  const amount = document.getElementById("amount").value;
  const type = mode === "d" ? TRANSACTIONS.d : TRANSACTIONS.w;
  document.getElementsByClassName("formerror")[0].textContent = '';
  if (amount <= 0) {
    document.getElementsByClassName("formerror")[0].textContent = 'Value must be above 0';
    return;
  }

  if ((type === TRANSACTIONS.w) && amount > parseFloat(document.getElementById("balance").textContent)) {
    document.getElementsByClassName("formerror")[0].textContent = 'Withdraw greater than balance';
    return;
  }
  
  console.log(amount, type);

  document.getElementById("balance").textContent = '...'; // Loading...
  const response = await fetch(url + '/transact', {
    method: 'POST',
    body: JSON.stringify({amount, type}),
    headers: {
      'Content-Type': 'application/json',
      'authorization': localStorage.getItem("token")
    }
  });
  if (response.status != 200) {
    document.getElementsByClassName("formerror")[0].textContent = 'Withdraw greater than balance';
    return;
  }
  const res = await response.json();
  document.getElementById("balance").textContent = res.balance;
}


const showTransactions = async () => {
  // Hide main view and show the transaction list
  document.getElementById("main-view").style.display = "none";
  document.getElementById("transactions-view").style.display = "initial";
  document.getElementsByClassName("loading-transactions")[0].textContent = '...';
  
  const response = await fetch(url + '/transactions', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authorization': localStorage.getItem("token")
    }
  });
  const res = await response.json();

  // Error Handling
  if (response.status != 200 || !res.transactions) {
    document.getElementsByClassName("error-transactions")[0].textContent = 'Error while fetching transactions';
    return;
  }
  document.getElementsByClassName("loading-transactions")[0].textContent = '';
  
  if (res.transactions == 0) {
    document.getElementsByClassName("error-transactions")[0].textContent = 'No transactions yet';
  }
  
  // Populate the list of transactions
  res.transactions.forEach(txn => {
    const txnDiv = createTransactionElement(txn.type, txn.amount)
    document.getElementById("txn-list").appendChild(txnDiv);
  });
}

const createTransactionElement = (mode, amount) => {
  const transactionElement = document.createElement("div");
  transactionElement.className = 'txn';
  const transactionMode = document.createElement("div");
  transactionMode.className = 'txn-mode';
  const transactionAmount = document.createElement("div");
  transactionAmount.className = 'txn-amt';

  transactionMode.style.color =
    mode === TRANSACTIONS.d ? '#5cb85c' : '#d9534f';
  transactionMode.textContent =
    mode === TRANSACTIONS.d ? TRANSACTIONS.d : TRANSACTIONS.w

  transactionAmount.textContent = amount;

  transactionElement.appendChild(transactionMode);
  transactionElement.appendChild(transactionAmount);

  return transactionElement
}

const hideTransactions = () => {
  document.getElementById("main-view").style.display = "initial";
  document.getElementById("transactions-view").style.display = "none";
}
