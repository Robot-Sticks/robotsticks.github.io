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
*/
  apiKey: "AIzaSyCt0IhN37bwI1Gp4xPBmhq8FY9bgrfrydM",
  authDomain: "stickeducation-27116.firebaseapp.com",
  databaseURL: "https://stickeducation-27116-default-rtdb.firebaseio.com",
  projectId: "stickeducation-27116",
  storageBucket: "stickeducation-27116.appspot.com",
  messagingSenderId: "566576954504",
  appId: "1:566576954504:web:fa4f51202373ba6c30733d"
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
      document.getElementById("userDetails").style.display = "block";
      showUserDetails(user);
    } else {
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
checkAuthState();
