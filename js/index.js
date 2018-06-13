$(document).ready(function() {
  /*************************************/
  /***********  functional methods *****/
  /*************************************/

  function identityWrapper(f) {
    return function(val) {
      f();
      return val;
    };
  }

  /*************************************/
  /***********  validate methods *******/
  /*************************************/

  function isEmail(text) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(text).toLowerCase());
  }

  function isPhoneNumber(text) {
    var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return regex.test(String(text).toLowerCase());
  }


  function validateInput(input) {
    if (isEmail(input)) return true;
    if (isPhoneNumber(input)) return true;
    return false;
  }

  function validate(formData) {
    var input = formData.input;

    if (!validateInput(input)) {
      throw Error('Input không hợp lệ');
    }

    return input;
  }

  function validateFail(error) {
    console.error(error);
  }
  
  /*************************************/
  /***********  form methods     *******/
  /*************************************/

  function getEmailsRef() {
    return firebase.database().ref('data');
  }

  function sendDataToFireBase(email) { 
    fbq('track', 'CompleteRegistration', { action: 'RegisterEmailOrPhoneNumber' });

    return getEmailsRef()
      .push()
      .set({
        email: email,
        createdDate: new Date().toString()
      });
  }

  function showLoading() {
    // Hide action-block and show loading-block
    $('#action-block').hide();
    $('#loading-block').show();
  }

  function hideLoading() {
    // Hide loading-block and show thank-you-block
    $('#loading-block').hide();
    $('#thank-you-block').show();
  }

  function getInputValue() {
    return $('#phone-mail-input').val().trim();
  }

  function getFormData() {
    var input = getInputValue();
    return { input: input };
  }


  /*************************************/
  /***********  main methods   *********/
  /*************************************/

  function typingValidate(event) {
    var input = $('#phone-mail-input');
    var errorLbl = $('#error-lbl');

    var value = getInputValue();

    // Remove validate border
    input.removeClass('border-red border-green');
    errorLbl.addClass('d-none');

    // Input is empty do nothing
    if (!value) return;

    if (validateInput(value)) {
      input.addClass('border-green');
      errorLbl.addClass('d-none');
    } else {
      input.addClass('border-red');
      errorLbl.removeClass('d-none');
    }
  }

  function onFormSubmit(event) {
    // Prevent form submit
    event.preventDefault();

    return Promise.resolve()
      .then(getFormData)
      .then(validate)
      .then(identityWrapper(showLoading))
      .then(sendDataToFireBase)
      .then(identityWrapper(hideLoading))
      .catch(validateFail);
  }


  function main() {
    $('#mail-form').on('submit', onFormSubmit);
    $('#phone-mail-input').keyup(typingValidate);
  }

  // Run main function
  main();
});
