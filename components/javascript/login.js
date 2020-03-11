const guest = {username: "guest", password: "", school: ['guest'], major: ['guest']};

// Default activeUser is guest on startup
var activeUser = guest;

// Array for holding the users registered with the website
let users = [
  {username: "willie", password: "wildcat", school: ['McCormick School of Engineering and Applied Science'], major: ["Computer Science"]},
  {username: "morty", password: "wildcat", school: ['Weinberg College of Arts and Sciences'], major: ["Economics"]}
];


// Dictionary that holds all of the major requirements //
const majorRequirements = {
  'Undecided':{'Undecided':{}},
  'Bienen School of Music': {
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
  'McCormick School of Engineering and Applied Science': {
    'Applied Mathematics':{},
    'Biomedical Engineering':{},
    'Chemical Engineering':{},
    'Civil Engineering':{},
    'Computer Engineering':{},
    'Computer Science': {
          'Core Major Requirements': {'COMP_SCI 211-0': false, 'COMP_SCI 213-0': false, 'COMP_SCI 214-0': false},
          'Mathematics': {'MATH 220-1': false, 'MATH 220-2': false, 'MATH 228-1': false, 'COMP_SCI 212': false},
          'Engineering Analysis': {'GEN_ENG 205-1': false, 'GEN_ENG 205-2': false, 'GEN_ENG 205-3': false, 'COMP_SCI 111-0': false},
          'Basic Science':{'4 units of McCormick basic science': false},
          'Design and Communication':{'DSGN 106-1': false, 'ENGLISH 106-1': false, 'DSGN 106-2': false, 'ENGLISH 106-2': false, '1 unit of a speaking course': false},
          'Basic Engineering':{'5 units of McCormick basic engineering': false},
          'Statistics (choose one)':{'IEMS 201-0': false, 'IEMS 303-0': false, 'ELEC_ENG 302-0': false},
          'Theme':{'7 units of social sciences and humanities': false},
          'Unrestricted Electives':{'5 units': false}
          },
    'Electrical Engineering':{},
    'Environmental Engineering':{},
    'Industrial Engineering':{},
    'Manufacturing and Design Engineering':{},
    'Materials Science and Engineering':{},
    'Mechanical Engineering':{}
  },
  'Medill School of Journalism': {
    'Journalism': {}
  },
  'School of Education and Social Policy': {
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
  'Weinberg College of Arts and Sciences': {
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
    'Economics':{
        'Core Major Requirements': {'ECON 201-0': false, 'ECON 202-0': false, 'ECON 281-0': false, 'ECON 310-1': false, 'ECON 310-2': false, 'ECON 311-0': false},
        'Advanced Field Courses': {'6 units of 300 level Economics classes': false},
        'Courses in Related Fields': {'MATH 220-1': false, 'STATS 210': false, '3 units in related fields': false},
        'Distribution Courses<br/>(2 units of each)': {'Natural Sciences (Area I)': false, 'Formal Studies (Area II)': false,
                                'Social and Behavioral Sciences (Area III)': false, 'Historical Studies (Area IV)': false, 'Ethics and Values (Area V)': false, 'Literature and Fine Arts (Area VI)': false}
    },
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



///// Onclick actions for the header buttons ///// 
function displayLogin() {
  resetForm(0);
  document.getElementById('conf-psw-tag').style.display='none';
  document.getElementById('conf-psw-field').style.display='none';
  document.getElementById('school-selection-tag').style.display='none';
  document.getElementById('school-selection').style.display='none';
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

  populateSchools();

  document.getElementById('conf-psw-tag').style.display='block';
  document.getElementById('conf-psw-field').style.display='block';
  document.getElementById('school-selection-tag').style.display='block';
  document.getElementById('school-selection').style.display='block';
  document.getElementById('majors-selection-tag').style.display='block';
  document.getElementById('majors-selection').style.display='block';
  document.getElementById('login-button').style.display='none';
  document.getElementById('switch_to_signup').style.display='none';
  document.getElementById('createaccount-button').style.display='block';
  document.getElementById('switch_to_login').style.display='block';
  document.getElementById('id01').style.display='block';
  document.getElementById('username').focus();
}

// Populates the school-selection with the information in majorRequirements
const populateSchools = () => {
  let schoolSelect = document.getElementById('school-selection');
  schoolSelect.innerHTML = `<option value="default" disabled selected>Select a School</option>`;
  for (school of Object.keys(majorRequirements)) {
    schoolSelect.innerHTML += `
    <option value=${school}>${school}</option>`;
  }
  schoolSelect.onchange = function(){
    populateMajors(this.options[this.selectedIndex].text);
  }
}



// Populates the major selection based on the school selected
const populateMajors = (school) => {
  console.log(school);
  let majorSelect = document.getElementById('majors-selection');
  majorSelect.innerHTML = `<option value="default" disabled selected>Select a Major</option>`;
  for (major of Object.keys(majorRequirements[school])) {
    console.log(major);
    majorSelect.innerHTML += `
    <option value=${major}>${major}</option>`;
  }
  majorSelect.disabled = false;
}



function logout() {
  // Prompt user to confirm logout
  if (confirm("Are you sure you want to log out?")){
    // Reset active user to guest and reset the page
    activeUser = guest;

    updateMajorRequirements();

    //document.getElementById("greeting").innerHTML = activeUser.username;   => Change to login greeting section
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
  tryLogin(loginData.elements[0].value, loginData.elements[1].value);
  return;
}

function tryLogin(name, pass) {
  for (user of users) {
    if (user.username == name && user.password == pass) {
      // Correct credentials ==> log in
      activeUser = user;
      //document.getElementById("greeting").innerHTML = activeUser.username;   => Change to login greeting section
      document.getElementById("account").innerHTML = `<p>Welcome, ${activeUser.username}   &#9660</p>`
      document.getElementById("signup").style.display = "none";
      document.getElementById("login").style.display = "none";
      document.getElementById("account-dropdown").style.display = "inline-block";
      updateMajorRequirements();
      document.getElementById('id01').style.display = "none";
      resetForm(0);
      return;
    }
  }
  // Iterated over all credentials and didn't find a suitable login
  alert("Incorrect username or password");
  resetForm(1);
  return;
}
////////////////////////////////


///// Handle making account ////
function makeAccount() {
  var loginData = document.getElementById("userlogin");
  newUser = {username: loginData.elements[0].value, password: loginData.elements[1].value, school:[], major:[]};

  newUser.school.push(loginData.elements[3].options[loginData.elements[3].selectedIndex].text);
  newUser.major.push(loginData.elements[4].options[loginData.elements[4].selectedIndex].text);

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
  document.getElementById('account').innerHTML = `<p>Welcome, ${activeUser.username}   &#9660</p>`;

  updateMajorRequirements();

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
function updateMajorRequirements() {
  let clssContainer = document.getElementById('class-container');
  clssContainer.innerHTML = ``;
  console.log('Active major:' + activeUser.major);
  
  document.getElementById('requirementsPlaceholder').style.display = 'none';

  if (activeUser.major == "Undecided") {
    // Handle case where major is undecided with special formatting
    document.getElementById('major-header').innerHTML = "Undecided Major";
    clssContainer.innerHTML = ``;
    document.getElementById('class-container-container').style.display = 'none';
    return;
  } else if (activeUser.major == "guest") {
    document.getElementById('major-header').innerHTML = "Major Requirements"
    document.getElementById('requirementsPlaceholder').style.display = 'block';
    clssContainer.innerHTML = ``;
    document.getElementById('class-container-container').style.display = 'none';
    return;
  }


  for (let major of activeUser.major) {
    // Iterate over all majors associated with the account
    console.log("Major: " + major);
    document.getElementById('major-header').innerHTML = major;
    let majorTemplate = ``;

    // Get the actual requirements for the major and iterate over them
    let majorReq = majorRequirements[activeUser.school][major];
    for (let req of Object.keys(majorReq)) {
      console.log("Req: " + req);
      let reqTemplate = `
        <container class='major-section-container'>
          <h2 class="major-section">${req}</h2>`;
      for (let clss of Object.keys(majorReq[req])) {
        console.log("clss: " + clss);
        reqTemplate += `
          <p class="major-course">${clss}</p>`;
      }
      reqTemplate += `
    </container>`;
    majorTemplate += reqTemplate;
    }
    clssContainer.innerHTML += majorTemplate
    document.getElementById('class-container-container').style.display = 'flex';
  }

  return;
}
////////////////////////////////