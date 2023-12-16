// Your web app's Firebase configuration

var firebaseConfig = {
/*
  apiKey: "AIzaSyBTnsiKIukKiQ2ztqGkszkMP6f1yG5y1xc",
  authDomain: "robotsticks-9519d.firebaseapp.com",
  databaseURL: "https://robotsticks-9519d-default-rtdb.firebaseio.com",
  projectId: "robotsticks-9519d",
  storageBucket: "robotsticks-9519d.appspot.com",
  messagingSenderId: "296707504609",
  appId: "1:296707504609:web:a967839ad767bf1b2e3aa0",
  measurementId: "G-DRKMQ3VJKQ",

  apiKey: "AIzaSyCt0IhN37bwI1Gp4xPBmhq8FY9bgrfrydM",
  authDomain: "stickeducation-27116.firebaseapp.com",
  databaseURL: "https://stickeducation-27116-default-rtdb.firebaseio.com",
  projectId: "stickeducation-27116",
  storageBucket: "stickeducation-27116.appspot.com",
  messagingSenderId: "566576954504",
  appId: "1:566576954504:web:fa4f51202373ba6c30733d"
  */  
    apiKey: "AIzaSyDPb_-F1lebm0bFnz1-6gE2B5pDzhz-FVc",
    authDomain: "robot-sticks.firebaseapp.com",
    projectId: "robot-sticks",
    storageBucket: "robot-sticks.appspot.com",
    messagingSenderId: "1018626900208",
    appId: "1:1018626900208:web:0ef0c0c8a1e6d08f270235",
    measurementId: "G-XS0QD5DXRE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

document.getElementById("dashboard").style.display = "none";

document.getElementById("login").addEventListener("click", GoogleLogin);
document.getElementById("logout").addEventListener("click", LogoutUser);

let provider = new firebase.auth.GoogleAuthProvider();

function GoogleLogin() {

  console.log("Login Btn Call");
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function () {
      let provider = new firebase.auth.GoogleAuthProvider();
      return firebase.auth().signInWithPopup(provider);
    })
    .then((res) => {
      console.log(res.user);
      document.getElementById("LoginScreen").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
      document.getElementById("userDetails").style.display = "block";
      showUserDetails(res.user);
    })
    .catch((e) => {
      console.log(e);
    });
}
/*
Add in body: <div id="userDetails"></div>
*/  
function showUserDetails(user) {
    document.getElementById('userDetails').innerHTML = `
      <div class='login-info'>
        <img src="${user.photoURL}" class="profile-photo">
        <div class='user-info'>
          <p>Name: ${user.displayName}</p>
          <p>Email: ${user.email}</p>
        </div>
      </div>
      `
  }

function checkAuthState() {
    
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {

      document.getElementById("LoginScreen").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
      
      if (document.getElementById("userDetails")) {

        document.getElementById("userDetails").style.display = "block";
        showUserDetails(user);
      }

      showProjectList(true);
    
    } else {
      
      showProjectList();
    }
  });
}

function LogoutUser() {
  console.log("Logout Btn Call");
  firebase
    .auth()
    .signOut()
    .then(() => {
      document.getElementById("LoginScreen").style.display = "block";
      document.getElementById("dashboard").style.display = "none";
      document.getElementById('userDetails').style.display = "none";
    })
    .catch((e) => {
      console.log(e);
    });
}

function showProjectList(showList = false) {

  if (!document.getElementById("projectAlbum")) {

    return;
  }

  console.log("showProjectList", showList);  

  if (showList === true) {

    const user = firebase.auth().currentUser;
    console.log("/users/" + user.uid);
    const dbRef = firebase.database().ref("/users/" + user.uid);
    
    var projectList = new Set(); 
    
    dbRef.once('value').then((snapshot) => {
      
      snapshot.forEach((element) => {
        projectList.add(element.val());
      });

      console.log("project list inside", projectList); // Now it will show the populated set
      console.log("project list size inside", projectList.size);

      // Place your iteration and DOM manipulation code here
      const projectAlbum = document.getElementById("projectAlbum");

      projectAlbum.querySelector(".container").querySelector(".row").innerHTML = ' '; 
      
      projectList.forEach((projectId) => {
      
        console.log("project id", projectId);
        
        projectAlbum.querySelector(".container").querySelector(".row").innerHTML += 
        `<a href="3d?p=${projectId}" class="col-md-4">
          <div>
            <div class="card mb-4 box-shadow">
              <img class="card-img-top" alt="Thumbnail" src="./3d/thumbnail.png" data-holder-rendered="true" style="height: 225px; width: 100%; display: block;">
              <p class="card-thumbnail-text">${projectId}</p>
            </div>
          </div>
        </a>`;
      });
  

      document.getElementById("projectAlbum").style.display = "block";

    }).catch((error) => {
      console.error(error);
    });

  } else {
    document.getElementById("projectAlbum").style.display = "none";
  } 
}


checkAuthState();
