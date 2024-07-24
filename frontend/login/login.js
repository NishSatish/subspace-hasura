const url = 'http://localhost:9000/login';

const submitForm = async (username, password) => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({username, pwd: password}),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const res = await response.json();
  const token = res.token;
  if (!token) {
    alert('Invalid credentials!');
    return;
  }
  console.log(res);
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
  window.location.href = '../index.html';
}

// Main Validation
const check = async () => {
  password = document.getElementById('password').value;
  username = document.getElementById('username').value;
  clearErrors();

  if (document.getElementById('username').value == '') {
    seterror('name', '*username should not be blank');
    returnval = false;
    document.getElementById('username').focus();
  } else {
    returnval = true;
  }

  if (returnval == true) {
    if (document.getElementById('password').value == '') {
      seterror('password1', '*password should not be blank');
      returnval = false;
      document.getElementById('password').focus();
    } else {
      returnval = true;
    }
  }

  if (returnval == true) {
    await submitForm(username, password);
  }
}

const clearErrors = () => {
  errors = document.getElementsByClassName('formerror');
  for (let item of errors) {
    item.innerHTML = '';
  }
}

// Populate error containers
const seterror = (id, error) => {
  element = document.getElementById(id);
  element.getElementsByClassName('formerror')[0].innerHTML = error;
}