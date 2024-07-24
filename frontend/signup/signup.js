const url = 'http://localhost:9000/signup';

const submitSignupForm = async (password, username) => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({username, pwd: password}),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.status != 200) {
    alert('Username exists');
    return;
  }
  window.location.href = '../login/login.html';
};

const check = async () => {
  password = document.getElementById('password').value;
  char1 = password.charAt(0);

  // Password patterns
  let pattern = /\d/g; // Start w a number
  let pattern2 = /[a-z]/g; // At least one lowercase
  let pattern3 = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/; // At least one special character
  clearErrors();

  if (document.getElementById('username').value == '') {
    seterror('name', 'username should not be blank');
    returnval = false;
    document.getElementById('username').focus();
  } else {
    returnval = true;
  }

  if (returnval == true) {
    if (password.length < 8) {
      seterror('password1', 'Password should have at least 8 digits');
      returnval = false;
      document.getElementById('password').focus();
    } else if (pattern.test(char1)) {
      seterror('password1', '*password cannot start with number!');
      returnval = false;
      document.getElementById('password').focus();
    } else if (pattern2.test(password) == false) {
      seterror('password1', '*password should have atleast one lowercase!');
      document.getElementById('password').focus();

      returnval = false;
    } else if (pattern3.test(password) == false) {
      seterror(
        'password1',
        '*password should have atleast one special character!'
      );
      document.getElementById('password').focus();
      returnval = false;
    } else {
      returnval = true;
    }
  }

  if (returnval == true) {
    await submitSignupForm(
      password,
      document.getElementById('username').value,
    );
    window.location.href = '../index.html';
  }
}

const clearErrors = () => {
  errors = document.getElementsByClassName('formerror');
  for (let item of errors) {
    item.innerHTML = '';
  }
}

const seterror = (id, error) => {
  element = document.getElementById(id);
  element.getElementsByClassName('formerror')[0].innerHTML = error;
}