const msgBtn = document.querySelector('#js-send-msg')
msgBtn.addEventListener('click', () => {
  sendMail();
})

function sendMail() {
  const message = document.getElementById('message').value;

  // Initialize EmailJS with your User ID
  // emailjs.init('8s46LNhuDcL_kfKb_');  

  if (message.trim() === '') {
    document.getElementById('message-error').textContent = 'Message cannot be empty';
  } else {
    document.getElementById('message-error').textContent = '';
  }

  if ( message.trim() !== '') {
    msgBtn.textContent = 'Sending Message...'

    // Proceed with sending the email using EmailJS
    emailjs.send("service_kwwsd5c","template_zivdvmr", {
      message, message
    })
    .then(function(response) {
      alert('Message sent successfully!', response.status);
      document.getElementById('contact-form').reset();
      msgBtn.textContent = 'Send Message'
    }, function(error) {  
      console.error('EmailJS Error:', error);  
      alert('An error occurred. Please try again later.');  
      document.getElementById('contact-form').reset();  
      msgBtn.textContent = 'Send Message';  
    })
  }
}