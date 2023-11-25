// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBTnsiKIukKiQ2ztqGkszkMP6f1yG5y1xc",
  authDomain: "robotsticks-9519d.firebaseapp.com",
  databaseURL: "https://robotsticks-9519d-default-rtdb.firebaseio.com",
  projectId: "robotsticks-9519d",
  storageBucket: "robotsticks-9519d.appspot.com",
  messagingSenderId: "296707504609",
  appId: "1:296707504609:web:a967839ad767bf1b2e3aa0",
  measurementId: "G-DRKMQ3VJKQ",
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
      showUserDetails(res.user);
    })
    .catch((e) => {
      console.log(e);
    });
}

function showUserDetails(user) {
  document.getElementById("userDetails").innerHTML = ``;
}
/*
Add in body: <div id="userDetails"></div>
  
function showUserDetails(user) {
    document.getElementById('userDetails').innerHTML = `
        <img src="${user.photoURL}" style="width:10%">
        <p>Name: ${user.displayName}</p>
        <p>Email: ${user.email}</p>
      `
  }
*/
function checkAuthState() {
    
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      document.getElementById("LoginScreen").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
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
    })
    .catch((e) => {
      console.log(e);
    });
}
checkAuthState();
