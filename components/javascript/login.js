
// Default activeUser is a guest with undecided major on startup
var activeUser = {username: "Guest", password: "", major: "Undecided", classes: []};

let users = [
  {username: "willie", password: "wildcat", major: "Computer Science", classes: ["Comp_Sci 111", "Comp_Sci 211", "Comp_Sci212", "Comp_Sci213", "Comp_Sci 214", "Comp_Sci 330"]},
  {username: "morty", password: "wildcat", major: "Econonics", classes: ["Econ 201", "Econ 202", "Econ 281", "Econ 310-1", "Econ 310-2", "Econ 311"]}
];

function loginFields() {
  // Read information from login window fields
  var loginData = document.getElementById("userlogin");
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
        // Correct credentials, log in
        activeUser = user;
        document.getElementById("greeting").innerHTML = activeUser.username;
        document.getElementById("signup").style.display = "none";
        document.getElementById("login").style.display = "none";
        document.getElementById("logout").style.display = "flex";
        updateClasses();
        document.getElementById('id01').style.display = "none";
        resetForm(0);
        return;
      }
    }
  }
  // Iterated over all users and no user with this username found
  alert("Username not found. Please create an account.");
  resetForm(1);
  return;
}

function makeAccount() {
  var loginData = document.getElementById("userlogin");
  newUser = {username: loginData.elements[0].value, password: loginData.elements[1].value, major:'Undecided', classes:[]};
  for (existingUser of users) {
    // Iterate over all users to see if username taken
    if (existingUser.username == newUser.username){
      // Username already taken
      alert('There is already an account associated with this username. Please log in to the existing account or choose a different username.');
      return;
    } 
  }
  // Username not taken so add account
  users.push[newUser];
  document.getElementById("greeting").innerHTML = newUser.username;
  activeUser = newUser;
  document.getElementById("signup").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("logout").style.display = "flex";
  updateClasses();
  document.getElementById('id01').style.display = "none";
}

function resetForm(resetCode) {
  var logindata = document.getElementById("userlogin");
  // resetCode passed in with resetForm to determine
  // which fields of the form to reset
  switch (resetCode){
    case 0:
      // Reset username and password fields
      logindata.elements[0].value = '';
    case 1:
      // Reset just the password field
      logindata.elements[1].value = '';
      return;
    default:
      // log invalid resetCode input and return
      console.log('#resetForm: Invalid resetCode: ' + resetCode);
      return;
  }
  
}




function updateClasses() {
  // Update displayed information when a user logs in or signs up
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

function logout() {
  // Prompt user to confirm logout
  if (confirm("Are you sure you want to log out?")){
    // Reset active user to guest and reset the page
    activeUser = {username: "Guest", password: "", major: "Undecided", classes: []};
    document.getElementById("greeting").innerHTML = activeUser.username;
    updateClasses();
    document.getElementById("signup").style.display = "flex";
    document.getElementById("login").style.display = "flex";
    document.getElementById("logout").style.display = "none";
  }
  return;
}