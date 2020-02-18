var activeUser = {username: "Guest", password: "", classes: []};

  let users = [
    {username: "willie", password: "wildcat", major: "Computer Science Major", classes: ["Comp_Sci 111", "Comp_Sci 211", "Comp_Sci212", "Comp_Sci213", "Comp_Sci 214", "Comp_Sci 330"]}
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
          updateClasses();
          document.getElementById('id01').style.display = "none";
        }
        else {
          document.getElementById('wrongpass').style.display = "block";
        }
      }
      else {
        alert('username not found');
      }
    }
  }

  function makeAccount() {
      var loginData = document.getElementById("userlogin");
      users.push[{username: loginData.elements[0].value, password: loginData.elements[1].value}];
  }


  function updateClasses() {
    document.getElementById('major-header').innerHTML = activeUser.major;
    let i = 1;
    for (clss of activeUser.classes) {
      document.getElementById('class'+i).innerHTML = clss;
      document.getElementById('class'+i).style.display = 'block';
      i++;
    }
  }