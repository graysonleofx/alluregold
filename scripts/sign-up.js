import { auth, database } from './firebase.js';

import { ref, set, query, orderByChild, equalTo, get} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js"; 

import { createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js"; 

const fgtPwdLink =  document.querySelector('.fgt-pwd');


document.addEventListener('DOMContentLoaded', () => {
  const signUpBtn = document.querySelector('.js-form');
  signUpBtn.addEventListener('submit', (e) => {
    e.preventDefault()
    signUp()
  });
});

async function signUp() {
  const fullname = document.getElementById('fullname').value;
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const signUpBtn = document.querySelector('.js-sign-in-button');

  signUpBtn.disabled = true;  
  signUpBtn.innerHTML = "Creating Account...";  


  try{
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);  
    const user = userCredential.user;  

    // Prepare user data  
    const userDetails = {  
      fullname: fullname,
      username: username,
      email: email,  
      uid: user.uid,  
      createdAt: new Date().toISOString(),  
      status: 'Active',
      goldBalance: 0,
      goldBalancesUsd: 0,
      goldBalancesByIncreasement: 0,
      InvestmentType: ''
    };

    const userRef = ref(database, `users/${user.uid}`);

    const existingUserSnapshot = await get(query(ref(database, 'users'), orderByChild('username'), equalTo(username)));
    
    if(existingUserSnapshot.exists()){
      alert('Username already in use. please choose a different username');
      // await auth.currentUser.delete();
      return;
    }
  
    // Save user details to Realtime Database  
    await set(userRef, userDetails);  
    // await set(ref(database, 'users/' + user.uid), userDetails); 
    console.log('User signed up and added to database successfully');  
    window.location.href = "sign-in.html"

  } catch (error) {
    console.error('Error during sign-up:', error);
    alert('Sign up failed: ' + error.message);
  }finally {  
    // Always re-enable the sign-in button and reset text  
    signUpBtn.disabled = false;  
    signUpBtn.innerHTML = "Create Account";  
  }

  
  // get(queryRef).then((snapshot) => {
  //   if(snapshot.exists()){
  //     alert('Username already in use. please choose a different username');
  //     return;
  //   }else{

  //     createUserWithEmailAndPassword(auth, email, password) 
  //     .then((userCredential) => {
  //       const user = userCredential.user;  
  //       localStorage.setItem("userId", user.uid);
  //       localStorage.setItem("userEmail", user.email);
  //       console.log('User signed up: ', user.uid); 
    
  //       // Prepare user data  
  //       const userDetails = {  
  //         username: username,
  //         email: email,  
  //         uid: user.uid,  
  //         createdAt: new Date().toISOString(),  
  //         status: 'Active',
  //         goldBalance: 0
  //       };
    
  //       // Save user details to Realtime Database  
  //       return set(ref(database, 'users/' + user.uid), userDetails); 
  //     })
  //     .then(() => {
  //       console.log('User added to database successfully');  
  //       window.location.href="sign-in.html";
  //     })
  //     .catch((error) => {  
  //       console.error('Error signing up: ', error.message);  
  //       alert('Sign up failed: ' + error.message); 
  //     });
  //   }
  // }).catch((error) => {
  //   console.error("Error checking username: ", error.message);
  //   alert('Error checking username. please try again later.');
  // })

}

fgtPwdLink.addEventListener('click', ()=> {
  alert('Service Unavailable, try again later....');
});



