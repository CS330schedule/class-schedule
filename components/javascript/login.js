const guest = {username: "guest", password: "", major: "Undecided", classes: []};


// Default activeUser is guest on startup
var activeUser = guest;

// Array for holding the users registered with the website
let users = [
  {username: "willie", password: "wildcat", major: "Computer Science", classes: ["Comp_Sci 111", "Comp_Sci 211", "Comp_Sci212", "Comp_Sci213", "Comp_Sci 214", "Comp_Sci 330"]},
  {username: "morty", password: "wildcat", major: "Econonics", classes: ["Econ 201", "Econ 202", "Econ 281", "Econ 310-1", "Econ 310-2", "Econ 311"]}
];


///// Onclick actions for the header buttons ///// 
function displayLogin() {
  resetForm(0);
  document.getElementById('conf-psw-tag').style.display='none';
  document.getElementById('conf-psw-field').style.display='none';
  document.getElementById('majors-selection-tag').style.display='none';
  document.getElementById('majors-selection').style.display='none';
  document.getElementById('login-button').style.display='block';
  document.getElementById('switch_to_signup').style.display='block';
  document.getElementById('createaccount-button').style.display='none';
  document.getElementById('switch_to_login').style.display='none';
  document.getElementById('id01').style.display='block';
  document.getElementById('username').focus();
}

function displaySignUp() {
  resetForm(0);
  document.getElementById('conf-psw-tag').style.display='block';
  document.getElementById('conf-psw-field').style.display='block';
  document.getElementById('majors-selection-tag').style.display='block';
  document.getElementById('majors-selection').style.display='block';
  document.getElementById('login-button').style.display='none';
  document.getElementById('switch_to_signup').style.display='none';
  document.getElementById('createaccount-button').style.display='block';
  document.getElementById('switch_to_login').style.display='block';
  document.getElementById('id01').style.display='block';
  document.getElementById('username').focus();
}

// Submit form on enter press
document.onkeydown=function(){
  if(window.event.keyCode=='13' && document.getElementById('id01').style.display == 'block'){
    if (document.getElementById('createaccount-button').style.display == 'block'){
      makeAccount();
    } else {
      readLoginFields();
    }
  }
}

function logout() {
  // Prompt user to confirm logout
  if (confirm("Are you sure you want to log out?")){
    // Reset active user to guest and reset the page
    activeUser = guest;
    //document.getElementById("greeting").innerHTML = activeUser.username;   => Change to login greeting section
    updateClasses();
    document.getElementById("signup").style.display = "flex";
    document.getElementById("login").style.display = "flex";
    document.getElementById("account-dropdown").style.display="none";
  }
  return;
}
////////////////////////////////


///// Handles login process /////
function readLoginFields() {
  // Read information from login window fields
  var loginData = document.getElementById("userlogin");
  console.log(loginData.elements[2].value);
  tryLogin(loginData.elements[0].value, loginData.elements[1].value);
  return;
}

function tryLogin(name, pass) {
  for (user of users) {
    if (user.username == name) {
      if (user.password != pass) {
        // Incorrect password for this username
        alert("Incorrect username or password.");
        resetForm(1);
        return; 
      } else {
        // Correct credentials ==> log in
        activeUser = user;
        //document.getElementById("greeting").innerHTML = activeUser.username;   => Change to login greeting section
        document.getElementById("signup").style.display = "none";
        document.getElementById("login").style.display = "none";
        document.getElementById("account-dropdown").style.display = "inline-block";
        updateClasses();
        document.getElementById('id01').style.display = "none";
        resetForm(0);
        return;
      }
    }
  }
  // Iterated over all users and no user with this username found
  alert("Username not found. Please sign up and create an account to continue.");
  resetForm(1);
  return;
}
////////////////////////////////


///// Handle making account ////
function makeAccount() {
  var loginData = document.getElementById("userlogin");
  newUser = {username: loginData.elements[0].value, password: loginData.elements[1].value, major:loginData.elements[3].value, classes:[]};

  if ((newUser.username == '') || (newUser.password == '') || (loginData.elements[2].value == '') || (newUser.major == 'default')) {
    // User has not filled out one of the fields
    alert('Please fill out all of the fields to sign up')
    return;
  }
  for (existingUser of users) {
    // Iterate over all users to see if username taken
    if (existingUser.username == newUser.username){
      // Username already taken
      alert('There is already an account associated with this username. Please log in to the existing account or choose a different username.');
      resetForm(0);
      return;
    } 
  }
  if (newUser.password != loginData.elements[2].value) {
    // This phrasing is abiguous and will be changed later
    alert('Passwords must match to create an account');
    resetForm(2);
    return;
  }
  // Username not taken and passwords match so add account
  users.push(newUser);
  //document.getElementById("greeting").innerHTML = newUser.username;   => Change to login greeting section
  activeUser = newUser;
  document.getElementById("signup").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("account-dropdown").style.display = "inline-block";
  updateClasses();
  document.getElementById('id01').style.display = "none";
}
////////////////////////////////


///// Clears out the login form based on resetCode set by programmer /////
function resetForm(resetCode) {
  var logindata = document.getElementById("userlogin");
  switch (resetCode){
    case 0:
      // Reset all fields (usernmae, passwords, and major)
      logindata.elements[0].value = '';
      logindata.elements[3].value = 'default';
    case 1:
      // Reset "password" and "confirm password" fields
      logindata.elements[1].value = '';
    case 2:
      // Reset just "confirm password" field
      logindata.elements[2].value = '';
      return;
    default:
    // log invalid resetCode input and return
    console.log('#resetForm: Invalid resetCode ' + resetCode);
    return;
  }
}
////////////////////////////////


///// Updates the classes displayed on the sidebar based on activeUser /////
function updateClasses() {
  document.getElementById('account').innerHTML = `<p>Welcome, ${activeUser.username}   &#9660</p>`;
  document.getElementById('major-header').innerHTML = activeUser.major;
  if (activeUser.major == "Undecided"){
    document.getElementById('class-container').innerHTML = ``;
  }
  else{
    for (clss of activeUser.classes) {
      document.getElementById('class-container').innerHTML += `
        <section class="class-card">${clss}</section>`;
    }
  } 
}
////////////////////////////////