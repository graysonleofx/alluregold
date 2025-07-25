import { initializeApp} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";

import { getDatabase, ref, push, onValue} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js"; 

const firebaseConfig = {
  apiKey: "AIzaSyDiPQB-_i4b7WlmGzlZTO5RUVNqdK0nbDU",
  authDomain: "online-bank-97eb2.firebaseapp.com",
  databaseURL: "https://online-bank-97eb2-default-rtdb.firebaseio.com",
  projectId: "online-bank-97eb2",
  storageBucket: "online-bank-97eb2.firebasestorage.app",
  messagingSenderId: "262153218762",
  appId: "1:262153218762:web:a405d5ceefa733a5fb2233"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const userId = localStorage.getItem("userId");
renderTransactionList(userId);

// function renderTransactionList(userId) {
//   const transactionList = document.getElementById('js-transaction');
//   transactionList.classList.add('transactionList')
//   const transactionRef = database.ref('users/' + userId + '/transactions/');
//   transactionRef.on('value', (snapshot) => {
//     transactionList.innerHTML = '';
//     snapshot.forEach((childSnapshot) => {
//       const transaction = childSnapshot.val();
//       const transactionItem = document.createElement('div');
//       transactionItem.innerHTML = `
//         <div class="transactions-lists ">
//             <div class="product-item">
//               <div>${transaction.name}</div>
//               <p>${transaction.remark}</p>
//             </div>
//             <div class="amount-div">
//               <div>-${transaction.amount}</div>
//             </div> 
//         </div>
//       `;
//       transactionList.appendChild(transactionItem);
//     });
//   });
// }

function renderTransactionList(userId) {
  const transactionList = document.getElementById('js-transaction');
  transactionList.classList.add('transactionList')
  const transactionRef = ref(database, 'users/' + userId + '/transactions/');
  onValue(transactionRef, (snapshot) => {
    const transactions = snapshot.val();
    console.log("Transactions data:", transactions);

    // Check if transactions is null or undefined  
    if (!transactions) {  
      transactionList.innerHTML = '<div class="transactions-lists">No transactions available.</div>'; // Inform the user  
      return; // Exit the function if there are no transactions  
    }  
    
    
    // Convert the transactions object to an array and sort it by date in descending order  
    const sortedTransactions = Object.values(transactions).sort((a, b) => {  
      const dateA = new Date(a.date).getTime();  
      const dateB = new Date(b.date).getTime();  
      return dateB - dateA;  
    });

    // Clear the transaction list before rendering the sorted transactions  
    transactionList.innerHTML = '';  

    // Reverse the order of the sorted transactions to display the user's last transaction first
    sortedTransactions.reverse();

    // Render the sorted transaction list on the browser
    sortedTransactions.forEach((transaction) => {
      const transactionItem = document.createElement('div');
      transactionItem.innerHTML = `
        <div class="transactions-lists ">
          <div class="product-item">
            <div>${transaction.name}</div>
            <p>${transaction.remark}</p>
          </div>
          <div class="amount-div">
            <div>-${transaction.amount}</div>
          </div> 
        </div>
      `;
      transactionList.appendChild(transactionItem);
    });
  });
}
