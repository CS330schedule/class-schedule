const guest = {username: "guest", password: "", major: "Undecided", classes: []};

/* Dictionary that holds all of the major requirements */
const majorRequirements = {
  'Bienen': {
    'Brass':{},
    'Composition & Music Technology':{},
    'Conducting & Ensembles':{},
    'Jazz Studies':{},
    'Music Education':{},
    'Music Theory & Cognition':{},
    'Musicology':{},
    'Percussion':{},
    'Piano':{},
    'Strings, Harp, & Guitar':{},
    'Voice & Opera':{},
    'Woodwinds':{}
  },
  'MEAS': {
    'Applied Mathematics':{},
    'Biomedical Engineering':{},
    'Chemical Engineering':{},
    'Civil Engineering':{},
    'Computer Engineering':{},
    'Computer Science': 
          {'Core Major Requirements': {'COMP_SCI 211-0': false, 'COMP_SCI 213-0': false, 'COMP_SCI 214-0': false},
          'Mathematics': {'MATH 220-1': false, 'MATH 220-2': false, 'MATH 228-1': false, 'Comp_Sci 212': false},
          'Engineering Analysis': {'GEN_ENG 205-1': false, 'GEN_ENG 205-2': false, 'GEN_ENG 205-3': false, 'COMP_SCI 111-0': false},
          'Basic Science':{'4 units of McCormick basic science': false},
          'Design and Communication':{'DSGN 106-1': false, 'ENGLISH 106-1': false, 'DSGN 106-2': false, 'ENGLISH 106-2': false, '1 unit of a speaking course': false},
          'Basic Engineering':{'5 units of McCormick basic engineering': false},
          'Statistics (choose one)':{'IEMS 201-0': false, 'IEMS 303-0': false, 'ELEC_ENG 302-0': false},
          'Theme':{'7 social sciences/humanities courses': false},
          'Unrestricted Electives':{'5 units': false}
          },
    'Electrical Engineering':{},
    'Environmental Engineering':{},
    'Industrial Engineering':{},
    'Manufacturing and Design Engineering':{},
    'Materials Science and Engineering':{},
    'Mechanical Engineering':{}
  },
  'Medill': {
    'Journalism': {}
  },
  'SESP': {
    'Human Development in Context':{},
    'Learning & Organizational Change':{},
    'Learning Sciences':{},
    'Social Policy':{}
  },
  'School of Communication': {
    'Communication Studies':{},
    'Dance':{},
    'Human Communication Services':{},
    'Performance Studies':{},
    'Radio/Television/Film':{},
    'Theatre':{}
  },
  'Weinberg': {
    'African American Studies':{},
    'American Studies':{},
    'Anthropology':{},
    'Art History':{},
    'Asian Studies':{},
    'Biological Sciences':{},
    'Chemistry':{},
    'Classics':{},
    'Cognitive Science':{},
    'Computer Science':{},
    'Economics':{},
    'English':{},
    'French':{},
    'Global Health':{},
    'History':{},
    'Integrated Science':{},
    'Linguistics':{},
    'Mathematics':{},
    'Neuroscience':{},
    'Political Science':{},
    'Psychology':{},
    'Sociology':{},
    'Spanish':{},
    'Statistics':{}
  }
};


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
    document.getElementById('login-major').style.display = "block";

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
    if (user.username != name || user.password != pass) {
      // Incorrect username or password
      // Not specific to username or password for security reasons
      alert("Incorrect username or password");
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


///// Submit login/signup form on enter press //////
document.onkeydown=function(){
  if(window.event.keyCode=='13' && document.getElementById('id01').style.display == 'block'){
    if (document.getElementById('createaccount-button').style.display == 'block'){
      makeAccount();
    } else {
      readLoginFields();
    }
  }
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
  document.getElementById('login-major').style.display = "none";
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