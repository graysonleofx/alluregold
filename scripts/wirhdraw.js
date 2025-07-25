import {database } from './firebase.js'; 

import { ref, get, push, set, onValue} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js"; 


// Reference 
const Cance_btn = document.querySelector('#js-cancel-btn');
const investMemberH = document.querySelector('.invest-member');
const inputDiv = document.querySelector('.js-input-div');
const proceedBtn = document.querySelector('.js-local-btn');
const proceedWithdrawCashBtn = document.querySelector('.js-withdraw-cash-btn');
const proceedWithdrawGoldBtn = document.querySelector('.js-withdraw-gold-btn');
const signOutBtnn = document.querySelector('.js-sign-out');
const selectElement = document.getElementById('js-withdraw-type');
const goldForm = document.querySelectorAll('#hidden');
const wInBankForm =  document.querySelectorAll('#hide-w-in-bk');


signOutBtnn.addEventListener('click', () => {
  window.location.replace('/index');
  sessionStorage.clear();  
})

Cance_btn.addEventListener('click',  () =>{
  window.location.replace("/my_account.html");
})

displayBronzeInvestment()
  
function displayBronzeInvestment(){
  inputDiv.style.display = "flex"
}

function withdraw(){
  // proceedBtn.textContent = 'Processing...';
  proceedBtn.disabled = true;

  alert('Please Select a withdrawal Process');

  // const selectElement = document.getElementById('js-withdraw-type')
  // const selectedVal = selectElement.value;
  // console.log(selectedVal)

  // const email = localStorage.getItem('email');
  // withdraw( selectedVal, email,)

  // displaySuccessful();
}

function withdrawInCash( type, email, accname, accnum, swift, iban, bankname){

  // Proceed with sending the email using EmailJS
  emailjs.send("service_yivr7hb","template_k0uizxa", {
    type: type,
    email: email,
    accname: accname,
    accnum: accnum,
    swift: swift, 
    iban: iban,
    bankname: bankname,
    time: Date.now().toFixed()
  })
  .then((response) => {
    console.log('Invested Sucessfully', response.status);
    proceedWithdrawCashBtn.textContent = 'Continue';
    proceedWithdrawCashBtn.disabled = false;
    displaySuccessful();
  }, (error) => {
    console.error('Error sending :', error);  
    alert('An error occurred. Please try again later.');  
  })
}

function withdrawInGold( type, email, fullname, address, city, state, zip){

  // Proceed with sending the email using EmailJS
  emailjs.send("service_yivr7hb","template_nr2v8x6", {
    type: type,
    email: email,
    fullname: fullname,
    address: address,
    city: city,
    state: state,
    zip: zip,
    time: Date.now().toFixed()
  })
  .then((response) => {
    console.log('Invested Sucessfully', response.status);
    proceedBtn.textContent = 'Continue';
    proceedBtn.disabled = false;
    displaySuccessful();
  }, (error) => {
    console.error('Error sending :', error);  
    alert('An error occurred. Please try again later.');  
  })
}

function selectedEleVal() {
  const selectedVal = selectElement.value;
  console.log(selectedVal);

  if(selectedVal === 'Withdraw in Gold'){
    goldForm.forEach((eachINp) => {
      eachINp.style.display = 'flex';
    });

    proceedWithdrawGoldBtn.style.display = 'block';
    proceedWithdrawCashBtn.style.display = 'none';
    proceedBtn.style.display = 'none';
    
    wInBankForm.forEach((eachINp) => {
      eachINp.style.display = 'none'
    });

    proceedWithdrawGoldBtn.addEventListener('click', () => {
      const selectedVal = selectElement.value;
      const email = localStorage.getItem('email');

      proceedWithdrawGoldBtn.textContent = "Processing..."
      
      const fullname = document.getElementById('fullname-input').value;
      const address = document.getElementById('street-input').value;
      const city = document.getElementById('city-input').value;
      const state = document.getElementById('state-input').value;
      const zip = document.getElementById('zip-input').value;

      withdrawInGold( selectedVal, email, fullname, address, city, state, zip)
    });

    // proceedBtn.textContent = 'Withdraw in Gold'
    // goldForm.style.display = 'flex'
  }else if(selectedVal === 'Withdraw as Cash'){
    goldForm.forEach((eachINp) => {
      eachINp.style.display = 'none';
    });

    proceedWithdrawCashBtn.style.display = 'block';
    proceedWithdrawGoldBtn.style.display = 'none';
    proceedBtn.style.display = 'none';

    wInBankForm.forEach((eachINp) => {
      eachINp.style.display = 'flex'
    });
      // proceedBtn.textContent = 'Withdraw in Cash';
      proceedWithdrawCashBtn.addEventListener('click', () => {
        const selectedVal = selectElement.value;
        const email = localStorage.getItem('email');

        proceedWithdrawCashBtn.textContent = "Processing..."
        
        const accName = document.getElementById('acc-name-input').value;
        const accNum = document.getElementById('acc-num-input').value;
        const swiftCode = document.getElementById('swift-code-input').value;
        const IBAN = document.getElementById('idan-input').value;
        const bankName = document.getElementById('bank-name-input').value;


        withdrawInCash( selectedVal, email, accName, accNum, swiftCode, IBAN, bankName)
      });
 
    }else{
    goldForm.forEach((eachINp) => {
      eachINp.style.display = 'none';
    });

    wInBankForm.forEach((eachINp) => {
      eachINp.style.display = 'none'
    });
    proceedWithdrawGoldBtn.style.display = 'none';
    proceedWithdrawCashBtn.style.display = 'none';
    proceedBtn.style.display = 'block';

    // proceedBtn.textContent = 'Withdraw';
  }
}

// showing the successful message details and function 
function displaySuccessful(){
  const successfulDiv = document.querySelector('.successful');
  investMemberH.style.display = "none";
  inputDiv.style.display = "none";
  successfulDiv.style.display = "flex";
}

document.addEventListener('DOMContentLoaded', () => {
  selectElement.addEventListener('change', () => {
    selectedEleVal();
  });

  document.getElementById('successful-btn').addEventListener('click', () => {
    window.location.replace("my_account.html");
  });

  proceedBtn.addEventListener('click', (e) => {
    e.preventDefault();
    withdraw()
  });
  
});
