import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";  
import { getDatabase} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";  


const firebaseConfig = {
  apiKey: "AIzaSyCYKG_aEnj91X31MRdEP12o4vXMmc0Um0g",
  authDomain: "assetsinvest-bfadb.firebaseapp.com",
  projectId: "assetsinvest-bfadb",
  storageBucket: "assetsinvest-bfadb.firebasestorage.app",
  messagingSenderId: "670510674666",
  appId: "1:670510674666:web:f84306aa1be3eb538f9d93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  
const database = getDatabase(app); 
export { auth, database };