import { auth, database } from './firebase.js';

import { ref, onValue, query, orderByChild, equalTo, get} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js"; 

import {  signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";  

import updateUI from './index.js';

document.addEventListener('DOMContentLoaded', () => {
  const signInBtn = document.getElementById('sign-btn');
    
  signInBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    let email   = document.getElementById('email').value;
    localStorage.setItem('email', email)
    signInWithEmailAndPasswordDirect(email);
  })
});

auth.onAuthStateChanged((user) => {  
  if (user) {  
    console.log('User is signed in:', user.uid); 
    updateUI(user);
  } else {  
    console.log('No user is signed in.');  
    // You can redirect to a login page or display a message  
  }  
});  

async function signInWithEmailAndPasswordDirect(emailOrUsername){
  // let identifier  = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value; 

  const signInBtn = document.getElementById('sign-btn');

  if (!emailOrUsername || !password) {  
    alert('Please enter a valid email/username and password.');  
    return; 
  } 

    // Handle email validation only if it looks like an email  
    if (validEmail(emailOrUsername)) {  
      console.log('Email format is valid');  
    } else if (emailOrUsername.length < 5) {   
      alert('Username should be at least 5 characters long.');  
      return; // Exit if username is too short  
    }  
  
  signInBtn.disabled = true;  
  signInBtn.innerHTML = "Signing In...";  
   
  try{
    const userCredential =  await signInWithEmailAndPassword(auth, emailOrUsername, password);
    const user =  userCredential.user;
    console.log('sign in successful',  userCredential.user.uid) // continue here........;

    // handleUsernameSignIn(emailOrUsername, password); 


    // handleUsernameSignIn(username, password)
    console.log('User signed in successfully with email.');  
    // console.log('Auth state after sign-in:', user)
    sessionStorage.setItem('isLoggedIn', 'true');  
    // console.log('User signed in: ', user.uid); 
    updateUI(user);  
    handleUserData(user);
    
  } catch (emailError) {   
    // handle specific error messages  
    if(emailError.code === "auth/user-not-found"){
      console.log("User not found with email. Attempting to look up username...");  

      const usernameSnapshot  = await queryUsername(emailOrUsername.trim());  
      if (usernameSnapshot) { 
        alert('User found with that username. Please use your email to sign in.');  
      } else {  
        // alert('No user found with that username or email. Please register.');  
        return;
      }  
    }else if(emailError.code === "auth/wrong-password"){
      alert('Incorrect password. Please try again.');  
    }else if(emailError.code === "auth/too-many-requests") {
      alert('Too many failed login attempts. Please try again later.');  
    } else if (emailError.code === 'auth/invalid-credential') {  
      alert('Invalid credentials. Please ensure your email and password are correct.');  
    } else{
      // console.error('Error signing in with email:', emailError.message);

      const usernameSnapshot  = await queryUsername(emailOrUsername.trim());  
      if (usernameSnapshot) { 
        alert('User found with that username. Please use your email to sign in.');  
      } else {  
        alert('Permission denied username sign in');  
        return;
      }  
    }

  }finally {  
    // Always re-enable the sign-in button and reset text  
    signInBtn.disabled = false;  
    signInBtn.innerHTML = "SIGN IN";  
  }

}

async function handleUsernameSignIn(username, password){
  console.log('Checking authentication status...');  
  const user = auth.currentUser;  

  if (!user) {  
    alert("You need to be logged in to access this data.");  
    return;  
  }  

  console.log('Querying for username:', username);  
  const userQuery = query(ref(database, 'users'), orderByChild('username'), equalTo(username));  
  const snapshot = await get(userQuery);
  
  console.log('Snapshot exists:', snapshot.exists());  

  if (snapshot.exists()) {
    const userData = snapshot.val()[Object.keys(snapshot.val())[0]];  

    const userEmail = userData.email; 
    
    try {
      await signInWithEmailAndPassword(auth, userEmail, password); 
      console.log(userEmail)
      const currentUser  = auth.currentUser;
      console.log('Current User:', currentUser);  

      if(currentUser){
        console.log('User signed in successfully with username.');
        sessionStorage.setItem('isLoggedIn', 'true');  
        console.log('User signed in: ', currentUser.uid); 
        updateUI(currentUser);  
        console.log('Retrieved user data:', userData);  
        handleUserData(userData);     
      }else{
        alert("You need to be logged in to access this data.");  
      }

    } catch (signinError) {  
      console.error('Error signing in with username:', signinError.message);  

      if(signinError.code === "auth/wrong-password"){
        alert('Incorrect password. Please try again.');  
      }else if (signinError.code === "auth/user-not-found"){
        alert('No user found with this username. Please check.');  
      }else if (signinError.code === "auth/too-many-requests"){
        alert('Too many failed login attempts with username. Please try again later.');  
      } else if (signinError.code === 'auth/invalid-credential') {  
        alert('Invalid Password for this user. Please check and try again.');  
      }else {
        console.error('Sign in failed: ' + signinError.message);  
      }
    }  
  }else{
    alert('No user found with that username.');  
  }
}

function handleUserData(user) {  
  const userRef = ref(database, 'users/' + user.uid);  
 
  onValue(userRef, (snapshot) => {  
    const data = snapshot.val();  
    if (data) {  
      localStorage.setItem("userName", data.username); 
      localStorage.setItem("userId", data.uid); 
      // sendOTP();  
      window.location.replace("/my_account.html");
    }else{
      alert('Account Not found');  
    }
  }, (error) => {
    console.error('Database error:', error);
  })

}

function validEmail(email) {   
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
  return emailPattern.test(email);  
} 
// Function to query for the username in the database  
async function queryUsername(username) { 
  const userQuery = query(ref(database, 'users'), orderByChild('username'), equalTo(username));  

  try {  
    const snapshot = await get(userQuery); 
    if (snapshot.exists()) {  
      console.log('Username found:', snapshot.val());  
      return snapshot.val(); // Return user data  
    } else {  
      console.log("No user found with that username.");  
      return null;  
    }
    // return snapshot.exists() ? snapshot.val() : null; 
  } catch (error) {  
    console.error('Error querying username:', error);   
    // switch (error.message) {  
    //   case "permission-denied":  
    //     alert('Access denied. Please check your permissions.');  
    //     break;  
    //   default:  
    //     alert('Error retrieving user data.');  
    //   break;  
    // } 
  }  

} 

function sendOTP() {
  // Reference  
  let emailInput = document.getElementById('email').value.trim();
  sessionStorage.setItem("userEmail", emailInput);

  if (!isValidEmail(emailInput)) {  
    alert('Invalid email address. Please check and try again.');  
    return; // Exit if the email is invalid  
  }  

  const otpverify = document.getElementsByClassName('otpverify')[0];
  const otpBtn = document.querySelector('.opt-btn');
  let otpInp = document.getElementById('opt-input');
  const mainForm = document.querySelector('.main-form');
  const serviceID = 'service_kwwsd5c';
  const templateID = 'template_dgocp4a';

  // Generate an OTP 
  let otp = Math.floor(Math.random() * 1000000);
  // console.log(otp)

  let templateParam = {
    from_name: 'Alluregold Gold Investment',
    otp: otp,
    nessage: 'Please Confirm your OTP',
    reply_to: emailInput
  }

  emailjs.send(serviceID, templateID, templateParam).then((res) =>{
    console.log(res);
    otpverify.style.display = "block";
    mainForm.style.display = "none";
    console.log('sent');
    otpBtn.addEventListener('click', (e) => {
      e.preventDefault()
      console.log('clicked');
      if(otpInp.value == otp){
        window.location.replace("/my_account.html");
      }else(
        alert('Incorrect Otp')
      )
    });  
  }, error => {
    console.log(error)
  });

}

// const fgtPwdLink =  document.querySelector('.fgt-pwd');

// fgtPwdLink.addEventListener('click', ()=> {
//   alert('Service Unavailable, try again later....');
// });
