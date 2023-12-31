import { setLoginUserText, setLogoutUserText } from "../Menubar.Login.js";

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDPb_-F1lebm0bFnz1-6gE2B5pDzhz-FVc",
    authDomain: "robot-sticks.firebaseapp.com",
    projectId: "robot-sticks",
    storageBucket: "robot-sticks.appspot.com",
    messagingSenderId: "1018626900208",
    appId: "1:1018626900208:web:0ef0c0c8a1e6d08f270235",
    measurementId: "G-XS0QD5DXRE"
};

firebase.initializeApp(config);

let provider = new firebase.auth.GoogleAuthProvider();

function loginUser() {

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
      setLogoutUserText(res.user);
    })
    .catch((e) => {
      console.log(e);
    });
}

function logoutUser() {

  firebase
    .auth()
    .signOut()
    .then(() => {
      setLoginUserText();
    })
    .catch((e) => {
      console.log(e);
    });
}


async function getUserDetails () {

  console.log("Checking login status");

  var currentUser = null;

  await firebase.auth().onAuthStateChanged((user) => {
    
    if (user) {

      currentUser = user;    
      
    }     
  });
  
  return currentUser;
}

export {loginUser, logoutUser, getUserDetails};