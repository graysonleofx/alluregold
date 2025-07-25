import { auth } from './firebase.js';

window.onload =  () => {
  const saveLoggedIn = sessionStorage.getItem('isLoggedIn');
  if (saveLoggedIn == true) {
    console.log('logged IN')
    window.location.href = '/My_account';
  }
}

const getStartedBtn = document.getElementById('js-get-start-btn');
const contactBtn = document.getElementById('js-contact-btn');
const supportBtn = document.getElementById('js-support-btn');
const authBtn = document.getElementById('sign-in'); 

document.addEventListener('DOMContentLoaded', () => {
  // Getstarted button fucntion 
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      window.location.href = 'sign-in.html';
    });
  }

  if (contactBtn) {
   // Contact Button function 
    contactBtn.addEventListener('click', () => window.location.href = 'contact.html');
  }

  if (supportBtn) {
    // Get support function 
    supportBtn.addEventListener('click', () => window.location.href = 'support.html');
  }

  // Initial UI update based on authentication state  
  updateUI(auth.currentUser);  
});


// Get references to buttons  
 

// Function to update the UI based on authentication state  
export default function updateUI(user) {
  if(authBtn){
    if (user) {  
      // User is signed in  
      authBtn.textContent = 'Sign Out';  
      authBtn.onclick = () => signOutUser();  
      // getStartedBtn.onclick = () => redirectToUserAccount(user.uid);  
    } else {  
      // User is signed out  
      authBtn.textContent = 'Sign In';  
      authBtn.onclick = () => signInUser();  
      // getStartedBtn.onclick = () => {
      //   // alert('Please sign in to get started.');
      //   window.location.href = 'sign-in.html';
      // };  
    }  
  }  

    if(getStartedBtn){
      if(user){
        getStartedBtn.onclick = () => redirectToUserAccount(user.uid);
      } else {
        getStartedBtn.onclick = () => {
          window.location.href = 'sign-in.html';
        };

    }
  } 
}

 
// Sign In function  
function signInUser() {  
  window.location.href = 'sign-in.html' 
}  

// Sign Out function  
function signOutUser() {  
  auth.signOut().then(() => {  
    // Clear session storage and update UI  
    sessionStorage.setItem('isLoggedIn', 'false');  
    updateUI(null);  
    window.location.href = '/';  
  }).catch((error) => {  
    console.error('Error signing out:', error.message);  
  });  
}  

// Redirect to user account  
function redirectToUserAccount(userId) {  
  window.location.href = `my_account.html`;   
} 

// Listen for authentication state changes  
auth.onAuthStateChanged((user) => {  
  updateUI(user);  
});  

