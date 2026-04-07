/* ============================================
   nav.js — Shared navigation script
   Included on every page.
   ============================================ */

(function () {
  'use strict';

  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  /* --- Mobile hamburger toggle --- */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked (on mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  /* --- Close menu on outside click --- */
  document.addEventListener('click', function (e) {
    if (navLinks && navLinks.classList.contains('open')) {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      }
    }
  });

})();
