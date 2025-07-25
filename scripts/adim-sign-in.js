import { signInWithEmailAndPassword, onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js"; 
import { auth, database } from './firebase.js'; 
import { ref, get, set } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";  


// Handle form submission  

document.addEventListener(('DOMContentLoaded'), () => {
  const loader = document.getElementById('loader');
  const signInButton = document.getElementById('sign-btn');

  // Check auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      checkAdminStatus(user);
    } else {
      console.log('No user signed in, please log in.');
      loader.style.display = 'none';
    }
  });


  document.getElementById('adminLoginForm').addEventListener('submit', async(event) => {  
    event.preventDefault();  

    loader.style.display = "flex";
    signInButton.disabled = true;

    const email = document.getElementById('email').value;  
    const password = document.getElementById('password').value;  

    try{
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const admin = userCredential.user;
      
      // Add user as admin (run this once, then comment out)
      await set(ref(database, `admins/${admin.uid}`), true);
      console.log('Admin UID added:', admin.uid);


      const adminRef = ref(database, `admins/${admin.uid}`);
      const adminSnapshot = await get(adminRef);
      sessionStorage.setItem('isAdminLoggedIn', 'true');  
      if (!adminSnapshot.exists() || adminSnapshot.val() !== true) {
        // window.location.href = "sign-in-admin.html"; 
        // throw new Error('Access denied: Admin privileges required.');
      }
      console.log('Admin signed in:', admin.uid);
      window.location.href = "adminDb.html"; 

    } catch(error) {  
      console.error('signIn failed:', error.message);
  
      // Display error message to user
      let errorMessage = 'Login failed. Please try again.';
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'No admin found with this details.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No admin found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'No internet connection';
          break;
        default:
          errorMessage = error.message;
      }
      const errorDiv = document.getElementById('error-message');
      errorDiv.textContent = errorMessage;
      errorDiv.style.display = 'block';
    } finally {
      // Hide loader and re-enable button
      loader.style.display = 'none';
      signInButton.disabled = false;
    }
  });  

  
  async function checkAdminStatus(admin) {
    try{
      const adminRef = ref(database, `admins/${admin.uid}`);
      const adminSnapshot = await get(adminRef);
      if (!adminSnapshot.exists() || adminSnapshot.val() !== true) {
        // console.log('User is not an admin:', user.uid);
        // alert('Access denied: You are not an admin.');
        // window.location.href = 'sign-in-admin.html'; 
        loader.style.display = 'none';
        signInButton.disabled = false;
        return;
      }

      // User is an admin, hide loader and show content
      console.log('Admin signed in:', admin.uid);
      window.location.href = 'adminDb.html';
    }catch (error) {
      console.error('Error checking admin status:', error);
      alert('Error: ' + error.message);
      loader.style.display = 'none';

      signInButton.disabled = false;
    }
  }
})
 