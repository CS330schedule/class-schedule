var activeUser = {username: "Guest", password: "", major: "Undecided", classes: []};

  let users = [
    {username: "willie", password: "wildcat", major: "Computer Science", classes: ["Comp_Sci 111", "Comp_Sci 211", "Comp_Sci212", "Comp_Sci213", "Comp_Sci 214", "Comp_Sci 330"]}
  ];

  function loginFields() {
    var loginData = document.getElementById("userlogin");
    tryLogin(loginData.elements[0].value, loginData.elements[1].value);
  }

  function tryLogin(name, pass) {
    for (user of users) {
      if (user.username == name) {
        if (user.password == pass) {
          activeUser = user;
          document.getElementById("greeting").innerHTML = activeUser.username;
          document.getElementById("signup").style.display = "none";
          document.getElementById("login").style.display = "none";
          document.getElementById("logout").style.display = "flex";
          updateClasses();
          document.getElementById('id01').style.display = "none";
        }
        else {
          alert("Incorrect username or password.")
        }
      }
      else {
        alert("Username not found. Create an account to continue.");
      }
    }
  }

  function makeAccount() {
      var loginData = document.getElementById("userlogin");
      activeUser = {username: loginData.elements[0].value, password: loginData.elements[1].value, major:'Undecided', classes:[]};
      users.push[activeUser];
      document.getElementById("signup").style.display = "none";
      document.getElementById("login").style.display = "none";
      document.getElementById("logout").style.display = "flex";
      updateClasses();
      document.getElementById('id01').style.display = "none";
  }


  function updateClasses() {
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
    activeUser = {username: "Guest", password: "", major: "Undecided", classes: []};
    updateClasses();
    document.getElementById("signup").style.display = "flex";
    document.getElementById("login").style.display = "flex";
    document.getElementById("logout").style.display = "none";
  }