import {database } from './firebase.js'; 

import { ref, get, push, set, onValue} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js"; 


// Reference 
const Cance_btn = document.querySelector('#js-cancel-btn');

const investMemberH = document.querySelector('.invest-member');
const bronzeMemberH = document.querySelector('.bronze-member');
const platinumMemberH = document.querySelector('.platinum-member');
const diamondMemberH = document.querySelector('.daimond-member');

const inputDiv = document.querySelector('.js-input-div');
const internationalDiv = document.getElementById('international-div');
const daimondINpDiv = document.getElementById('diamond-div');

const investBronze = document.querySelector('.invest-bronze');
const investPlatinum = document.querySelector('.invest-platinum');
const investDiamond = document.querySelector('.invest-diamond');
const amountDiv = document.getElementById('js-amount-div');
const proceedBtn = document.querySelector('.js-local-btn');
const comfrimDiv = document.querySelector('#js-confrim-div');
const interProceedBtn = document.querySelector('.js-inter-pro-btn');
const diamondProceedBtn = document.querySelector('.js-diamond-pro-btn');
const interAmountDiv = document.getElementById('js-inter-amount-div');
const diamondAmtDiv = document.getElementById('js-diamond-amount-div');

const interDiv = document.querySelector('#international-div');
const interConfirmDiv = document.querySelector('#js-inter-confrim-div');
const DiamondConfirmDiv = document.querySelector('#js-diamond-confrim-div');

const signOutBtnn = document.querySelector('.js-sign-out');
signOutBtnn.addEventListener('click', () => {
  // sessionStorage.removeItem("userEmail");
  // sessionStorage.removeItem("userName");
  // sessionStorage.removeItem("userChackings");
  // sessionStorage.removeItem("userSavings");
  // sessionStorage.removeItem('isLoggedIn');
  window.location.replace('/index');
  sessionStorage.clear();  
})


// for bronze investment pLan  
// all bronze investment pLan inputs 

Cance_btn.addEventListener('click',  () =>{
  window.location.replace("/my_account.html");
})

// for bronze investment pLan   
document.querySelector('.invest-bronze')
.addEventListener('click', displayBronzeInvestment);
  
function displayBronzeInvestment(){
  investMemberH.style.display = "none";
  platinumMemberH.style.display = "none";
  diamondMemberH.style.display = "none";
  bronzeMemberH.style.display = "block";
  // inputDiv.style.display = "block";
  inputDiv.style.display = "flex"
  investBronze.style.display = "none";
  investPlatinum.style.display = "none";
  investDiamond.style.display = "none";

  const investmentTypeInputBronze = document.querySelector('.js-investment-type-input-bronze');
  investmentTypeInputBronze.value = 'Bronze Membership';

  localStorage.setItem('investmentTypeBronze', investmentTypeInputBronze.value)
}

// for bronze investment pLan back button 
document.querySelector('.js-back-btn')
.addEventListener('click', backButton);

function backButton() {
  investMemberH.style.display = "block";
  bronzeMemberH.style.display = "none";
  platinumMemberH.style.display = "none"
  diamondMemberH.style.display = "none"

  inputDiv.style.display = "none";
  internationalDiv.style.display = "none"
  daimondINpDiv.style.display = "none"
  investBronze.style.display = "flex"
  investPlatinum.style.display = "flex"
  investDiamond.style.display = "flex"
}

// document.querySelector('.amount-back-btn')
// .addEventListener('click', amountBackBtn);

document.querySelector('.details-back-btn')
.addEventListener('click', confrimBackBtn);

function confrimBackBtn(){
  investMemberH.style.display = "none";
  bronzeMemberH.style.display = "block";
  platinumMemberH.style.display = "none"
  diamondMemberH.style.display = "none"

  inputDiv.style.display = "flex";
  internationalDiv.style.display = "none"
  comfrimDiv.style.display = "none"
  // amountDiv.style.display = "flex"
  investBronze.style.display = "none";
  investPlatinum.style.display = "none";
  investDiamond.style.display = "none";
}

// showing the amount content 
proceedBtn.addEventListener('click', (e) => {
  e.preventDefault();
  showInvestmentInput();
});
  
function showInvestmentInput() {
  const fullName = document.querySelector('.number-input').value;

  const address = document.querySelector('#bank-name-input').value;
  const phone = document.querySelector('.remark-input').value;
  localStorage.setItem('fullname', fullName);
  localStorage.setItem('address', address);
  localStorage.setItem('phone', phone);
  if(fullName === '' || address === '' || phone === '') {
    alert("Please fill in all input fields.");
    return; 
  }
    investMemberH.style.display = "none";
    bronzeMemberH.style.display = "block";
    platinumMemberH.style.display = "none";
    diamondMemberH.style.display = "none";
  
    inputDiv.style.display = "none"
    internationalDiv.style.display = "none"
    // amountDiv.style.display = "flex"
    comfrimDiv.style.display = "flex"
    investBronze.style.display = "none";
    investPlatinum.style.display = "none";
    investDiamond.style.display = "none";
    showComfrimDetails()
}

function showComfrimDetails() {

  const fullname = document.querySelector('.number-input').value;
  const address = document.querySelector('#bank-name-input').value;
  const phone = document.querySelector('.remark-input').value
  const investmentTypeInputBronze = document.querySelector('.js-investment-type-input-bronze');

  // document.querySelector('.transaction-type').textContent = nameInp;
  document.querySelector('.fullname').textContent = fullname;
  document.querySelector('.address').textContent = address;
  document.querySelector('.phone').textContent = phone;
  document.querySelector('.transaction-type').textContent = investmentTypeInputBronze.value = 'Bronze Membership';

  investMemberH.style.display = "none";
  bronzeMemberH.style.display = "block";
  platinumMemberH.style.display = "none";
  diamondMemberH.style.display = "none";

  inputDiv.style.display = "none"
  internationalDiv.style.display = "none"
  comfrimDiv.style.display = "flex"
  investBronze.style.display = "none";
  investPlatinum.style.display = "none";
  investDiamond.style.display = "none";
}

const confirmBtn = document.querySelector('#confirm-details-btn');  
confirmBtn.addEventListener('click', handleConfirmClick); 

function handleConfirmClick() { 
  confirmBtn.innerHTML = 'Please wait...';  
  confirmBtn.disabled = true;


  const investmentType = document.querySelector('.js-investment-type-input-bronze').value;  
  const fullname = document.querySelector('.number-input').value.trim();  
  const address = document.getElementById('bank-name-input').value.trim();  
  const phone = document.querySelector('.remark-input').value.trim();  


  // console.log({  
  //   investmentType,  
  //   fullname,  
  //   address,  
  //   phone  
  // });  

  //  Validate retrieved data  
  if (!investmentType || !fullname || !address || !phone) {  
    alert('Please ensure all required details are filled out.');  
    confirmBtn.innerHTML = 'Confirm Details';  
    confirmBtn.disabled = false;
    return;  
  } 

  const userId = localStorage.getItem("userId");

  if (!userId) {  
    console.error('User ID not found. Ensure user is authenticated.');    
    alert('User not authenticated. Please log in.');
    confirmBtn.innerHTML = 'Confirm Details';
    confirmBtn.disabled = false;   
    return;
  }   
  saveInvestment(investmentType, fullname, address, phone)
};

function saveInvestment(type, fullname, address, phone){

  // Proceed with sending the email using EmailJS
  emailjs.send("service_kwwsd5c","template_dgocp4a", {
    type: type,
    fullname: fullname,
    address: address,
    phone: phone
  })
  .then((response) => {
    console.log('Invested Sucessfully', response.status);
    displaySuccessful();
  }, (error) => {
    console.error('Error sending :', error);  
    alert('An error occurred. Please try again later.');  
  })

  // const userId = localStorage.getItem("userId");


  // const investmentRef = ref(database, `users/${userId}/investments`); 
  
  // Create a shallow copy to avoid circular reference issues  
  // const newInvestmentRef = push(investmentRef);
  // const investmentData = {  
  //   fullname: fullname,  
  //   type: type, 
  //   address: address, 
  //   phone: phone,
  //   date: new Date().toISOString() 
  // };

  // console.log('Investment Reference:', investmentRef, investmentData);  

  // try{
  //   await set(newInvestmentRef, investmentData)
  //     console.log('Investment details stored successfully!');
  //     displaySuccessful();
  //     confirmBtn.innerHTML = 'Confirm Details'; 
  //     confirmBtn.disabled = false;  
  // }catch(error) {  
  //   console.error('Error storing investment details:', error);  
  //   alert('There was an error saving your investment details. Please try again.');  
  //   confirmBtn.innerHTML = 'Confirm Details'; 
  // }finally{
  //   confirmBtn.innerHTML = 'Confirm Details';   
  //   confirmBtn.disabled = false;  
  // }

}

// showing the successful message details and function 
function displaySuccessful(){
  const successfulDiv = document.querySelector('.successful');

  investMemberH.style.display = "none";
  bronzeMemberH.style.display = "none";
  platinumMemberH.style.display = "none";
  diamondMemberH.style.display = "none";

  inputDiv.style.display = "none";
  internationalDiv.style.display = "none";
  interConfirmDiv.style.display = "none";
  DiamondConfirmDiv.style.display = "none";
  comfrimDiv.style.display = "none";
  successfulDiv.style.display = "flex";
  investBronze.style.display = "none";
  investPlatinum.style.display = "none";
  investBronze.style.display = "none";
}

document.getElementById('successful-btn').addEventListener('click', () => {
  // console.log("clicked");
  window.location.replace("my_account.html");
});



// for Platinum investment membership 
document.querySelector('.invest-platinum').addEventListener('click', displayPlatinumInvestment);

function displayPlatinumInvestment(){
  investMemberH.style.display = "none";
  bronzeMemberH.style.display = "none";
  platinumMemberH.style.display = "block";
  diamondMemberH.style.display = "none";

  inputDiv.style.display = "none"
  internationalDiv.style.display = "flex"
  investBronze.style.display = "none";
  investPlatinum.style.display = "none";
  investDiamond.style.display = "none";

  const investmentTypeInputPlatinum = document.querySelector('.js-investment-type-input-platinum');
  investmentTypeInputPlatinum.value = 'Platinum Membership';
}

// for platinum investment membership back button 
document.getElementById('international-back-btn')
.addEventListener('click', backButton);



// showing platinum investment membership confrim back button 
document.querySelector('.inter-details-back-btn')
.addEventListener('click', interConfrimBackBtn);
function interConfrimBackBtn(){
  investMemberH.style.display = "none";
  bronzeMemberH.style.display = "none";
  platinumMemberH.style.display = "block"
  diamondMemberH.style.display = "none"

  inputDiv.style.display = "none";
  internationalDiv.style.display = "flex"
  interConfirmDiv.style.display = "none"
  investBronze.style.display = "none";
  investPlatinum.style.display = "none";
  investDiamond.style.display = "none";
}

// showing platinum investment membership input content
interProceedBtn.addEventListener('click', showInterAmountContent);
function showInterAmountContent() {

  const swiftInp = document.querySelector('.js-Swift-code').value;

  const bankNameInp = document.querySelector('.js-bank-name').value;

  const remarkInp = document.querySelector('.js-remark').value;
  localStorage.setItem('interRemarkInp', remarkInp);


  if( swiftInp === '' || bankNameInp === '' || remarkInp === '') {
    alert("Please fill in all input fields.");
    return;
  }
  investMemberH.style.display = "none";
  bronzeMemberH.style.display = "none";
  platinumMemberH.style.display = "block";
  diamondMemberH.style.display = "none";

  inputDiv.style.display = "none"
  internationalDiv.style.display = "none"
  // amountDiv.style.display = "none";
  // interAmountDiv.style.display = "flex"
  investBronze.style.display = "none";
  investPlatinum.style.display = "none";
  investDiamond.style.display = "none";
  showInterComfrimDetails();
}


function showInterComfrimDetails() {
  const investmentTypeInputPlatinum = document.querySelector('.js-investment-type-input-platinum');
  const fullname = document.querySelector('.js-Swift-code').value.trim();
  const address = document.querySelector('.js-bank-name').value.trim();
  const phone = document.querySelector('.js-remark').value.trim();

  document.querySelector('.js-investment-type').textContent =   investmentTypeInputPlatinum.value = 'Platinum Membership';
  document.querySelector('.js-SwiftCode').textContent = fullname;
  document.querySelector('.js-bank').textContent = address;
  document.querySelector('.js-phone').textContent = phone;


  investMemberH.style.display = "none";
  bronzeMemberH.style.display = "none";
  platinumMemberH.style.display = "block";
  diamondMemberH.style.display = "none";

  inputDiv.style.display = "none";
  internationalDiv.style.display = "none";
  // interAmountDiv.style.display = "none";
  interConfirmDiv.style.display = "flex";
  // OTPDiv.style.display = "none";
  investBronze.style.display = "none";
  investPlatinum.style.display = "none";
  investDiamond.style.display = "none";
}

const platinumConfirmBtn = document.querySelector('#platinum-confrim-btn')
platinumConfirmBtn.addEventListener('click',handleplatinumConfirmClick)

function handleplatinumConfirmClick() { 
  platinumConfirmBtn.innerHTML = 'Please wait...';  
  platinumConfirmBtn.disabled = true;


  const investmentTypePlatinum = document.querySelector('.js-investment-type-input-platinum').value;
  const fullname = document.querySelector('.js-Swift-code').value.trim();
  const address = document.querySelector('.js-bank-name').value.trim();
  const phone = document.querySelector('.js-remark').value.trim();


  // console.log({  
  //   investmentType,  
  //   fullname,  
  //   address,  
  //   phone  
  // });  

  //  Validate retrieved data  
  if (!investmentTypePlatinum || !fullname || !address || !phone) {  
    alert('Please ensure all required details are filled out.');  
    platinumConfirmBtn.innerHTML = 'Confirm Details';  
    platinumConfirmBtn.disabled = false;
    return;  
  } 

  const userId = localStorage.getItem("userId");

  if (!userId) {  
    console.error('User ID not found. Ensure user is authenticated.');    
    alert('User not authenticated. Please log in.');
    platinumConfirmBtn.innerHTML = 'Confirm Details';
    platinumConfirmBtn.disabled = false;   
    return;
  }   
  saveInvestment(investmentTypePlatinum, fullname, address, phone)
};


// function platinumSendOTP() {
//   let emailInput = sessionStorage.getItem("userEmail");
//   const OTPDiv = document.getElementById('send-otp-div');
//   let otpInp = document.getElementById('otp-input');
//   const otpBtn = document.querySelector('#otp-btn');
//   const serviceID = 'service_kwwsd5c';
//   const templateID = 'template_dgocp4a';

//   // Generate an OTP 
//   let otp = Math.floor(Math.random() * 1000000);

//   let templateParam = {
//     from_name: 'Alluregold Gold Investment',
//     otp: otp,
//     nessage: 'Please Confirm your OTP',
//     reply_to: emailInput
//   }

//   emailjs.send(serviceID, templateID, templateParam).then((res) =>{
//     console.log(res);
//     investMemberH.style.display = "none";
//     bronzeMemberH.style.display = "none";
//     platinumMemberH.style.display = "block";
//     diamondMemberH.style.display = "none";

//     inputDiv.style.display = "none"
//     internationalDiv.style.display = "none"
//     amountDiv.style.display = "none";
//     interAmountDiv.style.display = "none";
//     // comfrimDiv.style.display = "none";
//     interConfirmDiv.style.display = "none";
//     DiamondConfirmDiv.style.display = "none";
//     OTPDiv.style.display = "grid";
//     investBronze.style.display = "none";
//     investPlatinum.style.display = "none";
//     investDiamond.style.display = "none";
//     console.log('ok')


//     otpBtn.addEventListener('click', (e)=>{
//       e.preventDefault()
//       if(otpInp.value == otp){
//         // alert('Email address verified...');
//         // const userId = localStorage.getItem("userId");
//         // interSendMoney(userId)
//         alert('YOUR INVESTMENT IS UNDER REVIEW !');
//         return true;
//       }else{
//         alert('Enter correct otp');
//         return false;
//       }
//     })
//   },  error => {
//     console.log(error)
//   })
// }




// function interSendMoney(userid){
//   const amountInp = Number(document.querySelector('.js-amount').value);

//   // Check if the amount does not exceed the $50 limit  
//   if (amountInp > 100) {  
//     alert('Investment cannot exceed $100.');  
//     return;  
//   }  

//   // Assuming you have a predefined conversion factor from dollars to kg  
//   const conversionRate = 3000;
//   const amountInKg = amountInp / conversionRate; 

//   const formattedAmountInKg = amountInKg + " kg";  


//   const interName = localStorage.getItem('internameInp');
//   const interRemark = localStorage.getItem('interRemarkInp');



//   // const interGoldBalanceRef = ref(database, `users/${userid}/goldBalance`)
//   // get(interGoldBalanceRef).then((snapshot) => {
//   //   let InterGoldBalance = snapshot.val();
//   //   if (InterGoldBalance >= amountInp) {
//   //     let newGoldBalance = InterGoldBalance - amountInp;
//   //     set(interGoldBalanceRef, newGoldBalance).then(() => {
//   //       updateInterGoldInvestment(userid, amountInKg);
//   //       InterSaveTransaction(formattedAmountInKg, interRemark, interName); 
//   //       interDisplaySuccessful();
//   //     })
//   //   }else{
//   //     alert('Insufficient balance in gold account.'); 
//   //   }
//   // }).catch((error) => {  
//   //   console.error("Error fetching checking balance:", error);   
//   // });
// }

// Function to update the user's gold balance after investing  
// function updateInterGoldInvestment(userid, amount) {  
//   const IntergoldBalanceRef = ref(database, 'users/' + userid + '/goldBalance'); 
//   get(IntergoldBalanceRef).then((snapshot) => {  
//     let currentInterGoldBalance = snapshot.val();  
     
//     // Deduct the investment amount from gold balance  
//     if (currentInterGoldBalance >= amount) { 
//       let newGoldBalance = currentInterGoldBalance; 
//       set(IntergoldBalanceRef, newGoldBalance).then(() => {  
//         console.log('Gold balance updated successfully.');  
//       }).catch((error) => {  
//         console.error("Error updating gold balance:", error);  
//       });
//     }else {  
//       alert('Insufficient gold balance to invest the specified amount.');  
//     } 
//   }).catch((error) => {  
//     console.error("Error fetching gold balance:", error);  
//   }); 
// }

// function InterSaveTransaction( interAmount, interRemark, interName) {
//   // Get the current user's ID
//   const userId = localStorage.getItem("userId");

//   const transactionDetails = {
//     name: interName,
//     remark: interRemark,
//     amount: interAmount,
//     date: new Date().toISOString()
//   };
//   const userTransactionRef = ref(database, 'users/' + userId + '/transactions');


//   push(userTransactionRef, transactionDetails);

// }


// function interDisplaySuccessful(){
//   const OTPDiv = document.getElementById('send-otp-div');
//   const successfulDiv = document.querySelector('.successful');
//   const amountInp = document.querySelector('.js-amount').value;
//   const formattedAmountInp = Number(amountInp).toLocaleString('en-US', {style: 'currency', currency: 'USD'})
//   document.querySelector('.you-sent').textContent = formattedAmountInp ;
//   document.querySelector('.deducted').textContent = formattedAmountInp ;

//   send.style.display = "none";
//   local.style.display = "none";
//   international.style.display = "none";

//   inputDiv.style.display = "none"
//   internationalDiv.style.display = "none"
//   amountDiv.style.display = "none";
//   interAmountDiv.style.display = "none";
//   comfrimDiv.style.display = "none";
//   OTPDiv.style.display = "none";
//   successfulDiv.style.display = "flex";
//   sendLocal.style.display = "none";
//   sendInternation.style.display = "none";
// }





// for diamond investment membership 

document.querySelector('.invest-diamond').addEventListener('click', displayDiamondInvestment);

function displayDiamondInvestment(){
  investMemberH.style.display = "none";
  bronzeMemberH.style.display = "none";
  platinumMemberH.style.display = "none";
  diamondMemberH.style.display = "block";

  inputDiv.style.display = "none";
  internationalDiv.style.display = "none";
  daimondINpDiv.style.display = "block";
  investBronze.style.display = "none";
  investPlatinum.style.display = "none";
  investDiamond.style.display = "none";

  const investmentTypeInputDiamond = document.querySelector('.js-investment-type-input-diamond');
  investmentTypeInputDiamond.value = 'Diamond Membership';
}

// for diamond investment membership back button 
document.getElementById('diamond-back-btn')
.addEventListener('click', backButton);


// showing diamond investment plan input content
diamondProceedBtn.addEventListener('click', showDiamondAmountContent);
function showDiamondAmountContent() {
  // const nameInp = document.querySelector('.js-dmd-acc-name').value;
  // localStorage.setItem('diamondNameInp', nameInp);

  const swiftInp = document.querySelector('.js-dmd-Swift-code').value;

  const bankNameInp = document.querySelector('.js-dmd-bank-name').value;

  const remarkInp = document.querySelector('.js-dmd-remark').value;
  localStorage.setItem('daimondRemarkInp', remarkInp);


  if(swiftInp === '' || bankNameInp === '' || remarkInp === '') {
    alert("Please fill in all input fields.");
  }else{
    investMemberH.style.display = "none";
    bronzeMemberH.style.display = "none";
    platinumMemberH.style.display = "none";
    diamondMemberH.style.display = "block";
  
    inputDiv.style.display = "none"
    internationalDiv.style.display = "none"
    daimondINpDiv.style.display = "none"
    investBronze.style.display = "none";
    investPlatinum.style.display = "none";
    investDiamond.style.display = "none";
    showDiamondComfrimDetails();
  }
}

// showing diamond investment plan confirm details
// diamondAmountBtn.addEventListener('click', showDiamondComfrimDetails)

function showDiamondComfrimDetails() {
  const investmentTypeInputDiamond = document.querySelector('.js-investment-type-input-diamond');
  const fullname= document.querySelector('.js-dmd-Swift-code').value;
  const address = document.querySelector('.js-dmd-bank-name').value;
  const phone = document.querySelector('.js-dmd-remark').value;
;
  document.querySelector('.js-dmd-investment-type').textContent =   investmentTypeInputDiamond.value = 'Diamond Membership';
  document.querySelector('.js-dmd-SwiftCode').textContent = fullname;
  document.querySelector('.js-dmd-bank').textContent = address;
  document.querySelector('.js-dmd-phone').textContent = phone;
  investMemberH.style.display = "none";
  bronzeMemberH.style.display = "none";
  platinumMemberH.style.display = "none";
  diamondMemberH.style.display = "block";

  inputDiv.style.display = "none";
  internationalDiv.style.display = "none";
  DiamondConfirmDiv.style.display = "flex";
  investBronze.style.display = "none";
  investPlatinum.style.display = "none";
  investDiamond.style.display = "none";
}

// showing diamond investment membership confrim back button 
document.querySelector('.diamond-details-back-btn')
.addEventListener('click', diamondConfrimBackBtn);

function diamondConfrimBackBtn(){
  investMemberH.style.display = "none";
  bronzeMemberH.style.display = "none";
  platinumMemberH.style.display = "none"
  diamondMemberH.style.display = "block"

  inputDiv.style.display = "none";
  internationalDiv.style.display = "none"
  interConfirmDiv.style.display = "none"
  interAmountDiv.style.display = "none";
  diamondAmtDiv.style.display = "flex"
  interDiv.style.display = "none";
  investBronze.style.display = "none";
  investPlatinum.style.display = "none";
  investDiamond.style.display = "none";
}

const diamondConfrimBtn = document.querySelector('#daimond-confrim-btn');
diamondConfrimBtn.addEventListener('click', handleDiamondConfrimClick);

function handleDiamondConfrimClick() { 
  diamondConfrimBtn.innerHTML = 'Please wait...';  
  diamondConfrimBtn.disabled = true;


  const investmentTypeInputDiamond = document.querySelector('.js-investment-type-input-diamond').value;
  const fullname= document.querySelector('.js-dmd-Swift-code').value.trim();
  const address = document.querySelector('.js-dmd-bank-name').value.trim();
  const phone = document.querySelector('.js-dmd-remark').value.trim();


  // console.log({  
  //   investmentType,  
  //   fullname,  
  //   address,  
  //   phone  
  // });  

  //  Validate retrieved data  
  if (!investmentTypeInputDiamond || !fullname || !address || !phone) {  
    alert('Please ensure all required details are filled out.');  
    diamondConfrimBtn.innerHTML = 'Confirm Details';  
    diamondConfrimBtn.disabled = false;
    return;  
  } 

  const userId = localStorage.getItem("userId");

  if (!userId) {  
    console.error('User ID not found. Ensure user is authenticated.');    
    alert('User not authenticated. Please log in.');
    diamondConfrimBtn.innerHTML = 'Confirm Details';
    diamondConfrimBtn.disabled = false;   
    return;
  }   
  saveInvestment(investmentTypeInputDiamond, fullname, address, phone)
};


// function dainmondSendOTP() {
//   let emailInput = sessionStorage.getItem("userEmail");
//   const OTPDiv = document.getElementById('send-otp-div');
//   let otpInp = document.getElementById('otp-input');
//   const otpBtn = document.querySelector('#otp-btn');
//   const serviceID = 'service_kwwsd5c';
//   const templateID = 'template_dgocp4a';

//   // Generate an OTP 
//   let otp = Math.floor(Math.random() * 1000000);
//   // console.log(otp)

//   let templateParam = {
//     from_name: 'Alluregold Gold Investment',
//     otp: otp,
//     nessage: 'Please Confirm your OTP to process payment',
//     reply_to: emailInput
//   }

//   emailjs.send(serviceID, templateID, templateParam).then((res) =>{
//     console.log(res);
//     investMemberH.style.display = "none";
//     bronzeMemberH.style.display = "none";
//     platinumMemberH.style.display = "none"
//     diamondMemberH.style.display = "block"

//     inputDiv.style.display = "none"
//     internationalDiv.style.display = "none"
//     amountDiv.style.display = "none";
//     interAmountDiv.style.display = "none";
//     // comfrimDiv.style.display = "none";
//     interConfirmDiv.style.display = "none";
//     DiamondConfirmDiv.style.display = "none";
//     OTPDiv.style.display = "grid";
//     investBronze.style.display = "none";
//     investPlatinum.style.display = "none";
//     investDiamond.style.display = "none";
//     console.log('ok')

//     otpBtn.addEventListener('click', (e)=>{
//       e.preventDefault()
//       if(otpInp.value == otp){
//         // alert('Email address verified...');
//         // const userId = localStorage.getItem("userId");
//         // sendMoney(userId);
//         alert('YOUR INVESTMENT IS UNDER REVIEW !');
//         return true;
//       }else{
//         alert('Enter correct otp');
//         return false
//       }
//     })
//   },  error => {
//     console.log(error)
//   });
// }

document.addEventListener('DOMContentLoaded', () => { 
  const userId = localStorage.getItem("userId");
  const user = userId;  

  console.log('User signed in: ', user);

  if(user){
    const userRef = ref(database, 'users/' + user);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();  
      if (data) {

        document.getElementById('js-user-username').textContent = data.username; 
        // console.log(data.username)
        // document.getElementById('js-user-username').textContent = data.email;   
        // document.getElementById('js-user-username').textContent = data.username;   
      }else {  
        console.log('No user data found.');   
        window.location.href = "sign-in.html";  
      } 
    })
  } else {  
    console.log('No user is signed in.');   
    window.location.href = "sign-in.html";   
  } ;
});
 