import { auth, database } from './firebase.js'; 
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";  
import { ref, set, onValue, push, get, runTransaction, update, remove, equalTo, orderByChild, query  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";  


// const totalUsersRef = ref(database, 'totalUsers');
// onValue(totalUsersRef, (snapshot) => {
//   const total = snapshot.val() || 0;
//   document.getElementById('total-user').textContent = total
// });
// set(totalUsersRef, 0);

const loader = document.getElementById('loader');

// Check authentication state
onAuthStateChanged(auth, async(user) => {
  if (user) {
    // User is signed in, check if admin
    const isAdmin = await checkAdminStatus(user);  

    if (isAdmin) {  
      // Load the dashboard if the user is an admin  
      fetchAndDisplayUsers();  
      fetchAndDisplayTransactions();  
    } 
    // else {  
    //   // Redirect if the user is not an admin  
    //   console.log('User is not an admin:', user.uid);  
    //   // window.location.href = 'sign-in-admin.html';  
    // }
  } else {
    // No user signed in, redirect to sign-in page  
    console.log("No user signed in, redirecting...");  
    window.location.href = 'sign-in-admin.html';  
  }
});

async function checkAdminStatus(user) {
  try{
    const adminRef = ref(database, `admins/${user.uid}`);
    const adminSnapshot = await get(adminRef);
    return adminSnapshot.exists() && adminSnapshot.val() === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

async function addUser() {

  const user = auth.currentUser;  
  if (!user) {  
    console.log("User is not authenticated. Stopping operation.");  
    return; 
  } 

  const fullname = document.getElementById('js-fullname').value;
  const username = document.getElementById('js-username').value.trim();
  const email = document.querySelector('#js-email').value;  
  const password = document.querySelector('#js-password').value;


  try{
    // Create user with email and password  
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);  
    const newUser = userCredential.user;

    await updateProfile(newUser, { displayName: username });

    const countersRef = ref(database, 'counters/userDisplayId');  
    const result = await runTransaction(countersRef, (currentValue) => { 
      // document.querySelector('#total-user').innerHTML = currentValue; 
      return (currentValue || 0) + 1;  
    });

    if (!result.committed) {   
      throw new Error("Transaction not committed"); 
    }  

    const displayId = result.snapshot.val();  
    const userRef = ref(database, `users/${newUser.uid}`); 

    const existingUserSnapshot = await get(query(ref(database, 'users'), orderByChild('username'), equalTo(username)));

    if(existingUserSnapshot.exists()){
      alert('Username already in use. please choose a different username');
      await auth.currentUser.delete();
      return;
    }

    await set(userRef, {  
      email: email,  
      displayId: displayId,  
      goldBalance: 0,  
      createdAt: new Date().toISOString(),  
      status: 'Active',  
      fullname: fullname,  
      username: username  
    }); 

    console.log("User added successfully:", newUser.uid);    
    fetchAndDisplayUsers();
    
  } catch (error) {  
    console.error("Error adding user:", error);  
  } 
}

function fetchAndDisplayUsers(){
  const userListElement = document.getElementById('user-list');  
  
  const usersRef = ref(database, 'users/');
  
  onValue(usersRef, (snapshot) => { 
    userListElement.innerHTML = ''; 
    const users = snapshot.val(); 
    if (users) {  
      // let userCounter = 1; 
      Object.keys(users).forEach(key => {  
        const user = users[key]; 
        const createdDate = new Date(user.createdAt);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };  
        const formattedDate = createdDate.toLocaleDateString(undefined, options);

        // Create a new table row  
        const row = document.createElement('tr');
        row.dataset.userId = key; // Store user ID
        row.innerHTML=`
          <td>
            <div class="user-id">
              <i class="fa-regular fa-user" style="color: rgba(196,138,0,1);"></i>
              <div>
                <h4>${user.username}</h4>
                <p>${user.email}</p>
              </div>
            </div>
          </td>

            <td class="created">
            <p>${formattedDate}</p>
          </td>

          <td>
            <div class="active-div">
              <div class="${user.status === 'Active' ? 'active-circle' : 'not-active-circle'}"></div>  
              <p>${user.status === 'Active' ? 'Online' : 'Offline'}</p>  
            </div>
          </td>
        `;

        row.addEventListener('click', (e) => {
          e.stopPropagation()
          const userId = row.dataset.userId;
          localStorage.setItem('userId', userId)
          openEditUserForm(userId)
        });
        // Append the new row to the user list  
        userListElement.appendChild(row);
      })
    }else {  
      // Handle case where no users exist  
      userListElement.innerHTML = '<tr><td colspan="3">No users found.</td></tr>';  
    }
  })
}


function addTransaction (userId, amount, type, date, increase) {
  const userBalanceRef = ref(database, `users/${userId}/goldBalance`);
  const transactionsRef = ref(database, `users/${userId}/transactions/`);

  runTransaction(userBalanceRef, (currentBalance) => {
    const amountNum = parseFloat(amount);
    if (type === 'Bronze Membership' || type === 'Platinum Membership' || type === 'Diamond Membership') {
      return (currentBalance || 0) + amountNum;
    }else if (type === 'withdraw') {
      if ((currentBalance || 0) >= amountNum) {
        return currentBalance - amountNum;
      } else {
        return;
      }
    }else {
      console.error('Invalid transaction type');
      return currentBalance; // No change
    }
  }).then((result) => {
    if (result.committed) {

      const newTransactionRef = push(transactionsRef);
      const transactionData = {  
        amount: amount,  
        type: type,  
        date: date,  
        increase: increase,  
        createdAt: new Date().toISOString() 
      }; 
      set(newTransactionRef, transactionData)
      .then(() => {
        console.log('Transaction added successfully');
        fetchAndDisplayTransactions();
      })
      .catch((error) => {
        console.error('Error adding transaction: ', error);
      });
    } else{
      if(type === 'withdraw') {
        console.error('Insufficient balance for withdrawal');
        alert('Not enough gold balance.');
      }else {
        console.error('Transaction not committed');
      }
    }
  }).catch((error) => {
    console.error('Error in transaction: ', error);
  });
}

function populateUserSelected(){
  const userSelect = document.getElementById('user-select');
  const usersRef = ref(database, 'users/');

  onValue(usersRef, (snapshot) => {
    const users = snapshot.val();
    userSelect.innerHTML = '<option value="">-- Select User --</option>';
    if(users){
      Object.keys(users).forEach(userId => { 
        const user = users[userId]; 
        const option = document.createElement('option');
        option.value = userId;
        option.textContent = user.email;
        userSelect.appendChild(option);
      })
    }
  })
}

async function fetchAndDisplayTransactions() {  
  const transactionBody = document.getElementById('transaction-body');  
  
  transactionBody.innerHTML = ''; 

  const adminUid = "oKmtt5pApHZqDjSyCp3uO1Y2gHJ2"; 
  set(ref(database, `admins/${adminUid}`), true)
  .then(() => console.log("Admin UID added"))
  .catch((error) => console.error("Error adding admin UID:", error));


  // console.log('Current user:', adminUid); 
  if (!adminUid) {
    transactionBody.innerHTML = '<tr><td colspan="4">Please log in as an admin to view transactions.</td></tr>';
    console.log("No user logged in. Please log in as an admin.");
    return; 
  }

  // console.log('Logged-in user UID:', adminUid);

  try{
    const usersSnapshot = await get(ref(database, 'users/')); 
    if (usersSnapshot.exists()) {  
      const users = usersSnapshot.val(); 
      let globalCounter = 1; 
      for (const userId in users) {  
        const user = users[userId];
        const userTransactionsSnapshot = await get(ref(database, `users/${userId}/transactions/`));  
        if (userTransactionsSnapshot.exists()) {  
          const transactions = userTransactionsSnapshot.val();  
          for (const transactionId in transactions) {  
            const transaction = transactions[transactionId];  
            const row = document.createElement('tr');
            row.innerHTML = `  
              <td>  
                <div class="user-id">  
                  <i class="fa-regular fa-credit-card" style="color: rgba(196,138,0,1);"></i>  
                  <div>  
                    <h4>${transaction.amount + 'kg'}</h4>  
                    <p>Transaction #${globalCounter}</p>  
                  </div>  
                </div>  
              </td>  
              
              <td class="created">  
                <p>${transaction.type}</p>  
              </td>  

              <td class="created">  
                <p> ${user.username}</p>  
              </td>  

              <td>  
                <div class="active-div">  
                  <i class="fa-solid fa-calendar-days"></i>  
                  <p>${transaction.date}</p>  
                </div>  
              </td>  

              <td>  
                 <div class="active-div">  
                  <i class="fa-solid fa-trash-can"   
                     style="color: red;"   
                     id="js-delete-transaction-${userId}-${transactionId}"></i>  
                </div>    
              </td>  
           `; 
           transactionBody.appendChild(row);  

           const deleteIcon = row.querySelector(`#js-delete-transaction-${userId}-${transactionId}`); 
   
           deleteIcon.addEventListener('click', () => {  
             deleteTransaction(userId, transactionId);  
           });  
           globalCounter++ 
          }
        }
      } 
    }else {  
      transactionBody.innerHTML = '<tr><td colspan="4">No users found.</td></tr>';  
    }  
  } catch (error) {  
    console.error('Error fetching transactions:', error);  
  } 
  
} 

async function openEditUserForm(userId) {
  try{
    const userSnapshot = await get(ref(database, `users/${userId}`));
    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      document.getElementById('js-user-email').value = userData.email;

      document.getElementById('js-user-balance').value = userData.goldBalance;

      document.getElementById('js-user-balance-usd').value = userData.goldBalancesUsd;

      document.getElementById('js-user-balance-increasement').value = userData.goldBalancesByIncreasement;

      document.getElementById('investment-type').value = userData.InvestmentType;

      document.querySelector('#update-user-form .password-container p').textContent = `Current balance: ${userData.goldBalance || 0} kg`;

      document.querySelector('#bal-in-usd').textContent = `Current balance In USD: ${userData.goldBalancesUsd || 0} USD`;

      document.querySelector('#bal-increasement').textContent = `Current balance Increasment: ${userData.goldBalancesByIncreasement || 0} %`;


      document.querySelector('#invest-crrent-type').textContent = `Current Invesment: ${userData.InvestmentType}`;

      document.getElementById('update-user-overlay').style.display = 'flex';

      document.getElementById('update-user-overlay').style.opacity = '1';

      document.getElementById('update-user-overlay').dataset.userId = userId;

    } else {
      console.error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

async  function updateUser() {
  const overlay = document.getElementById('update-user-overlay');
  const userId = overlay.dataset.userId;

  const newBalance = parseFloat(document.getElementById('js-user-balance').value);

  const newBalanceInUsd = parseFloat(document.getElementById('js-user-balance-usd').value);

  const newBalanceIncreasement = parseFloat(document.getElementById('js-user-balance-increasement').value);

  const newInvestmentType = document.getElementById('investment-type').value

  // Validate the balance
  if (isNaN(newBalance)) {
    console.error('Invalid balance');
    return;
  }else if(isNaN(newBalanceInUsd)){
    console.error('Invalid balance');
    return;
  }else if(isNaN(newBalanceIncreasement)){
    console.error('Invalid balance');
    return;
  }

  try{
    const userRef = ref(database, `users/${userId}/`);

    await update(userRef, { goldBalance: newBalance });
    
    await update(userRef, { goldBalancesUsd: newBalanceInUsd });

    await update(userRef, { goldBalancesByIncreasement: newBalanceIncreasement });

    await update(userRef, { InvestmentType: newInvestmentType });

    console.log('User balance updated successfully');

    document.getElementById('update-user-form').reset();
    document.getElementById('update-user-overlay').style.display = 'none';
    document.getElementById('update-user-overlay').style.opacity = '0';
    delete document.getElementById('update-user-overlay').dataset.userId; // Clean up
  }catch (error) {
    console.error('Error updating user balance:', error);
  }
}

// Function to handle delete action  
async function deleteTransaction(userId, transactionId) {  
  try {  
    console.log(`Attempting to delete transaction ${transactionId} for user ${userId}`); // Log User and Transaction ID  
    const transactionRef = ref(database, `users/${userId}/transactions/${transactionId}`);  

    // Remove transaction from database  
    await remove(transactionRef);  
    console.log(`Transaction ${transactionId} deleted for user ${userId}`);  
    
    // Refresh the transaction display  
    fetchAndDisplayTransactions();  
  } catch (error) {  
    console.error('Error deleting transaction:', error);  
  }  
}  

async function deleteUser(userId){
  try{
    const userRef = ref(database, `users/${userId}`); 
    await remove(userRef); 
    console.log('User data deleted from database');  
    

    // Delete the user from Firebase Authentication  
    const user = auth.currentUser;  
    if (user && user.uid === userId) {  
      await user.delete();  
      console.log('User account deleted from Firebase Authentication');  
    } else {  
      console.error('User not authenticated or UID mismatch');  
    }

    document.getElementById('delete-user-overlay').style.display = "none"
    document.getElementById('delete-user-overlay').style.opacity = '0'
  } catch (error) {  
    console.error('Error deleting user:', error);  
  } 
}

function adminSignOut(){
  auth.signOut().then(() => {
    const admin = auth.currentUser;

    window.location.href = 'sign-in-admin.html';  
    set(ref(database, `admins/${admin.uid}`), false);
    sessionStorage.getItem('isAdminLoggedIn', 'false');  
  }).catch((error) => {
    console.error('Error signing out:', error.message);  

  })
}


document.addEventListener('DOMContentLoaded', () => {  
  const addUserButton = document.querySelector('.add-btn');  
  const addTransactionButton = document.querySelector('.transaction-btn');  
  
  // display Add user form
  const displayAddUserForm = document.getElementById('add-user-overlay');
  addUserButton.addEventListener('click', () => {  
    displayAddUserForm.style.opacity = '1';
    displayAddUserForm.style.display = 'flex';

  }); 

  // display Transaction form 
  const displayTransactionForm = document.getElementById('add-transaction-overlay');
  addTransactionButton.addEventListener('click', () => {  
    displayTransactionForm.style.opacity = '1';
    displayTransactionForm.style.display = 'flex';
  });

  // Cancel icons 
  const cancelIcon = document.getElementById('js-cancle-btn');
  cancelIcon.addEventListener('click', () => {
    displayAddUserForm.style.opacity = '0';
    displayAddUserForm.style.display = 'none';
  });
  
  const cancelIconTrans = document.getElementById('js-cancle-trans-btn');
  cancelIconTrans.addEventListener('click', () => {
    displayTransactionForm.style.opacity = '0';
    displayTransactionForm.style.display = 'none';
  });

  const updateCancelIcon  = document.getElementById('js-cancle-update-btn')
  const updateUserForm = document.getElementById('update-user-overlay');

  updateCancelIcon.addEventListener('click', () => {
    updateUserForm.style.opacity = '0';
    updateUserForm.style.display = 'none';
  })


  // cancel buttons 
  const cancelBtn = document.getElementById('cancel-btn');
  cancelBtn.addEventListener('click', () => {
    displayAddUserForm.style.opacity = '0';
  });

  const transCancelBtn = document.getElementById('trans-cancel-btn');
  transCancelBtn.addEventListener('click', () => {
    displayTransactionForm.style.opacity = '0';
  });

  // Add users form admin
  const userForm = document.querySelector('#add-user-form');
  
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#js-email').value;  
    const password = document.querySelector('#js-password').value;    
    // alert('clicked')
    addUser(email, password);
    document.getElementById('add-user-form').reset(); 
    
    document.getElementById('add-user-overlay').style.display = 'none'; 
  })
  fetchAndDisplayUsers()  

  // Add users Transaction 
  const transactionForm = document.getElementById('add-transaction-form');



  transactionForm.addEventListener('submit' , (e) => {
    e.preventDefault()
    
    const userSelect = document.getElementById('user-select');  
    const userId = userSelect.value;
    const amount = document.getElementById('num-input').value;
    const increaseNum = document.getElementById('increment-input').value;
    const type = document.getElementById('transaction-type').value;
    const date = document.getElementById('date-input').value

    if (userId && amount && type && date && increaseNum) {  
      addTransaction(userId, amount,  type, date ,increaseNum);
    }else{
      console.error('Please fill out all fields correctly.');
    }

    document.getElementById('add-transaction-form').reset(); 
    
    document.getElementById('add-transaction-overlay').style.display = 'none'; 


  });

  populateUserSelected();
  fetchAndDisplayTransactions(); 


  updateUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    updateUser();
  })

  // delete pop up 
  document.getElementById('delete-btn').addEventListener('click', () => {
    updateUserForm.style.opacity = '1';
    updateUserForm.style.display = 'flex';
    document.getElementById('delete-user-overlay').style.display = "flex"
    document.getElementById('delete-user-overlay').style.opacity = '1'
  })
  

  // delete user 
  document.getElementById('js-delete-user').addEventListener('click', () => {
    const userId = localStorage.getItem('userId');
    deleteUser(userId)
  })

  // cancel for deleting user 
  document.querySelector('#delete-user-cancel-btn').addEventListener('click', () => {
    document.getElementById('delete-user-overlay').style.display = "none"
    document.getElementById('delete-user-overlay').style.opacity = '0'  
  })

  const mobileUserView = document.getElementById('mobile-users-view');
  const mobileTransactionView = document.getElementById('mobile-tranc-view')
  mobileUserView.classList.add('active')
  mobileUserView.addEventListener('click', () => {
    mobileUserView.classList.add('active');
    mobileTransactionView.classList.remove('active')
    document.querySelector('.transaction-container').style.display = 'none';
    document.querySelector('.users-container').style.display = 'flex';
  })
  mobileTransactionView.addEventListener('click', () => {
    mobileTransactionView.classList.add('active')
    mobileUserView.classList.remove('active')
    document.querySelector('.users-container').style.display = 'none';
    document.querySelector('.transaction-container').style.display = 'flex';
  })


  // sign out 
  const signOutBtn = document.getElementById('admin-sign-out');
  
  signOutBtn.addEventListener('click', adminSignOut)
});  