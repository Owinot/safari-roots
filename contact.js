/* ============================================
   contact.js — Contact form validation
   ============================================ */

(function () {
  'use strict';

  const form           = document.getElementById('contactForm');
  if (!form) return;

  /* Field references */
  const firstNameInput  = document.getElementById('firstName');
  const lastNameInput   = document.getElementById('lastName');
  const emailInput      = document.getElementById('email');
  const messageInput    = document.getElementById('message');
  const submitBtn       = document.getElementById('formSubmit');
  const successMsg      = document.getElementById('formSuccess');
  const globalErrorMsg  = document.getElementById('formGlobalError');
  const enquirySelect   = document.getElementById('enquiryType');
  const reservationRow  = document.getElementById('reservationRow');

  /* ==========================================
     UTILITIES
     ========================================== */

  /** Show an error message beneath a field */
  function showError(input, errorEl, message) {
    input.classList.add('error');
    input.classList.remove('valid');
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }

  /** Clear an error and mark field as valid */
  function clearError(input, errorEl) {
    input.classList.remove('error');
    input.classList.add('valid');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }

  /** Basic email format check */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  /* ==========================================
     INDIVIDUAL FIELD VALIDATORS
     ========================================== */

  function validateFirstName() {
    const errorEl = document.getElementById('firstNameError');
    if (firstNameInput.value.trim().length < 2) {
      showError(firstNameInput, errorEl, 'Please enter your first name (at least 2 characters).');
      return false;
    }
    clearError(firstNameInput, errorEl);
    return true;
  }

  function validateLastName() {
    const errorEl = document.getElementById('lastNameError');
    if (lastNameInput.value.trim().length < 2) {
      showError(lastNameInput, errorEl, 'Please enter your last name (at least 2 characters).');
      return false;
    }
    clearError(lastNameInput, errorEl);
    return true;
  }

  function validateEmail() {
    const errorEl = document.getElementById('emailError');
    if (!emailInput.value.trim()) {
      showError(emailInput, errorEl, 'Email address is required.');
      return false;
    }
    if (!isValidEmail(emailInput.value)) {
      showError(emailInput, errorEl, 'Please enter a valid email address (e.g. you@example.com).');
      return false;
    }
    clearError(emailInput, errorEl);
    return true;
  }

  function validateMessage() {
    const errorEl = document.getElementById('messageError');
    const msg = messageInput.value.trim();
    if (!msg) {
      showError(messageInput, errorEl, 'A message is required.');
      return false;
    }
    if (msg.length < 10) {
      showError(messageInput, errorEl, 'Please write a slightly longer message (at least 10 characters).');
      return false;
    }
    clearError(messageInput, errorEl);
    return true;
  }

  /* ==========================================
     LIVE (blur) VALIDATION — feedback as user moves through fields
     ========================================== */

  firstNameInput.addEventListener('blur', validateFirstName);
  lastNameInput.addEventListener('blur',  validateLastName);
  emailInput.addEventListener('blur',     validateEmail);
  messageInput.addEventListener('blur',   validateMessage);

  // Also clear errors as user types (after first submission attempt)
  firstNameInput.addEventListener('input', function () {
    if (firstNameInput.classList.contains('error')) validateFirstName();
  });
  lastNameInput.addEventListener('input', function () {
    if (lastNameInput.classList.contains('error')) validateLastName();
  });
  emailInput.addEventListener('input', function () {
    if (emailInput.classList.contains('error')) validateEmail();
  });
  messageInput.addEventListener('input', function () {
    if (messageInput.classList.contains('error')) validateMessage();
  });

  /* ==========================================
     SHOW / HIDE RESERVATION FIELDS
     ========================================== */

  function toggleReservationFields() {
    if (!reservationRow) return;
    if (enquirySelect.value === 'reservation' || enquirySelect.value === 'events') {
      reservationRow.style.display = '';
    } else {
      reservationRow.style.display = 'none';
    }
  }

  if (enquirySelect) {
    enquirySelect.addEventListener('change', toggleReservationFields);
    toggleReservationFields(); // run on page load
  }

  /* ==========================================
     FORM SUBMISSION
     ========================================== */

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent actual HTTP submission (backend required for real sending)

    // Hide previous feedback
    successMsg.classList.remove('visible');
    globalErrorMsg.classList.remove('visible');

    // Run all validators
    const isValid =
      validateFirstName() &
      validateLastName()  &
      validateEmail()     &
      validateMessage();

    if (!isValid) {
      // Scroll to first error field
      const firstError = form.querySelector('.form-input.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      globalErrorMsg.classList.add('visible');
      return;
    }

    /* --- Simulate sending (replace with real fetch/XMLHttpRequest to your backend) ---

    Example integration:
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstNameInput.value,
        lastName:  lastNameInput.value,
        email:     emailInput.value,
        message:   messageInput.value,
        enquiry:   enquirySelect ? enquirySelect.value : '',
      })
    })
    .then(res => res.json())
    .then(data => { showSuccess(); })
    .catch(err => { showNetworkError(); });

    ----------------------------------------------------------------- */

    // Simulated async submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    submitBtn.classList.add('loading');

    setTimeout(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      submitBtn.classList.remove('loading');

      // Reset form fields
      form.reset();

      // Clear all valid/error states
      form.querySelectorAll('.form-input').forEach(function (input) {
        input.classList.remove('valid', 'error');
      });

      // Show success message and scroll to it
      successMsg.classList.add('visible');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Re-run field toggle after reset
      if (enquirySelect) toggleReservationFields();
    }, 1400); // simulated 1.4 s network delay
  });

})();
