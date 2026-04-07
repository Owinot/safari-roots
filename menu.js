

(function () {
  'use strict';

  const filterBtns    = document.querySelectorAll('.filter-btn');
  const menuSections  = document.querySelectorAll('.menu-section');

  if (!filterBtns.length) return;

  /**
   * Filter menu sections by category.
   * @param {string} category - 'all' or a specific category slug
   */
  function filterMenu(category) {
    menuSections.forEach(function (section) {
      if (category === 'all' || section.dataset.category === category) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });
  }

  /* Attach click listeners to filter buttons */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active state
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Filter the menu
      filterMenu(btn.dataset.category);
    });
  });

})();
