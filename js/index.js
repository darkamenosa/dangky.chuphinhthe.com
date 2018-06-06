$(document).ready(function() {

    function sendDataToFireBase(data) {

      return new Promise((resolve, reject) => {
        setTimeout(resolve, 3000);
      })

    }
     
    function isEmail(text) {
      var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(String(text).toLowerCase());
    }

    function isPhoneNumber(text) {
      var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
      return regex.test(String(text).toLowerCase());
    }

    function getInputValue() {
      return $('#phone-mail-input').val().trim();
    }

    function validateInput(input) {
      if (isEmail(input)) return true;
      if (isPhoneNumber(input)) return true;
      return false;
    }
    
    function validate(formData) {
      var input = formData.input 
      
      if (!validateInput(input)) {
        throw Error('Input không hợp lệ')
      }

      return input;
    }

    function validateFail(error) {
      console.log(error)
    }
    
    function getFormData() {
      var input = getInputValue()
      return { input: input };
    }

    function onFormSubmit(event) {
      // Prevent form submit
      event.preventDefault();

      return Promise
        .resolve()
        .then(getFormData)
        .then(validate)
        .then((val) => {

          // Hide action-block and show loading-block
          $('#action-block').hide();
          $('#loading-block').show();

          return val;
        })
        .then(sendDataToFireBase)
        .then((val) => {
          // Hide loading-block and show thank-you-block
          $('#loading-block').hide();
          $('#thank-you-block').show();

          return val;
        })
        .catch(validateFail);
    }

    function typingValidate(event) {
      var input = $('#phone-mail-input');
      var value = getInputValue()

      // Remove validate border
      input.removeClass('border-red border-green')

      // Input is empty do nothing
      if (!value) return;

      if (validateInput(value)) {
        input.addClass('border-green');
      } else {
        input.addClass('border-red');
      }
    }

    function main() {
      $('#mail-form').on('submit', onFormSubmit);
      $('#phone-mail-input').keyup(typingValidate);
    }

    // Run main function
    main();
});
