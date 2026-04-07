/* ============================================
   gallery.js — Image slider + lightbox
   ============================================ */

(function () {
  'use strict';

  /* ==========================================
     IMAGE SLIDER
     ========================================== */

  const slider       = document.getElementById('heroSlider');
  const slides       = slider ? Array.from(slider.querySelectorAll('.slider__slide')) : [];
  const prevBtn      = document.getElementById('sliderPrev');
  const nextBtn      = document.getElementById('sliderNext');
  const dotsWrap     = document.getElementById('sliderDots');
  const captionEl    = document.getElementById('sliderCaption');

  let currentIndex   = 0;
  let autoplayTimer  = null;
  const AUTOPLAY_MS  = 5000; // time between auto-advances

  if (slides.length === 0) return; // nothing to do

  /* Build dot indicators dynamically */
  function buildDots() {
    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'slider__dot' + (i === 0 ? ' dot--active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () {
        goToSlide(i);
        resetAutoplay();
      });
      dotsWrap.appendChild(dot);
    });
  }

  /* Update the active slide, caption, and dots */
  function goToSlide(index) {
    slides[currentIndex].classList.remove('slide--active');
    dotsWrap.children[currentIndex].classList.remove('dot--active');

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('slide--active');
    dotsWrap.children[currentIndex].classList.add('dot--active');

    // Update caption
    if (captionEl) {
      const caption = slides[currentIndex].dataset.caption || '';
      captionEl.textContent = caption;
    }
  }

  /* Advance one step forward */
  function nextSlide() { goToSlide(currentIndex + 1); }

  /* Step backward */
  function prevSlide() { goToSlide(currentIndex - 1); }

  /* Start the autoplay interval */
  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
  }

  /* Clear and restart autoplay (called after manual navigation) */
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  /* Keyboard navigation */
  function handleKeydown(e) {
    if (e.key === 'ArrowLeft')  { prevSlide(); resetAutoplay(); }
    if (e.key === 'ArrowRight') { nextSlide(); resetAutoplay(); }
  }

  /* Touch / swipe support */
  let touchStartX = 0;
  slider.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', function (e) {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {           // swipe threshold: 50 px
      diff < 0 ? nextSlide() : prevSlide();
      resetAutoplay();
    }
  }, { passive: true });

  /* Wire up controls */
  if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); resetAutoplay(); });
  document.addEventListener('keydown', handleKeydown);

  /* Pause autoplay when user hovers over slider */
  slider.addEventListener('mouseenter', function () { clearInterval(autoplayTimer); });
  slider.addEventListener('mouseleave', startAutoplay);

  /* Initialise */
  buildDots();
  startAutoplay();


  /* ==========================================
     LIGHTBOX
     ========================================== */

  const lightbox       = document.getElementById('lightbox');
  const lightboxClose  = document.getElementById('lightboxClose');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxLabel  = document.getElementById('lightboxLabel');

  if (!lightbox) return;

  /**
   * Open the lightbox for a photo-item element.
   * If the item contains a real <img>, show that image.
   * Otherwise, show the placeholder text.
   *
   * @param {HTMLElement} el - The clicked .photo-item element
   */
  window.openLightbox = function (el) {
    const img = el.querySelector('img');
    const label = el.dataset.label || '';

    lightboxContent.innerHTML = '';

    if (img) {
      // Real image — clone and display it full-size
      const fullImg = document.createElement('img');
      fullImg.src = img.src;
      fullImg.alt = img.alt;
      lightboxContent.appendChild(fullImg);
    } else {
      // Placeholder — show a styled placeholder in the lightbox
      const placeholder = el.querySelector('.photo-placeholder');
      const text = placeholder ? placeholder.querySelector('span').textContent : label;
      const small = placeholder ? placeholder.querySelector('small').textContent : '';

      const div = document.createElement('div');
      div.className = 'lightbox__placeholder';
      div.innerHTML = '<span style="font-size:1.1rem;">' + text + '</span>' +
                      '<small>' + small + '</small>';
      lightboxContent.appendChild(div);
    }

    if (lightboxLabel) lightboxLabel.textContent = label;

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent background scroll
    lightboxClose.focus();
  };

  /* Close the lightbox */
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  /* Close on backdrop click */
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* Close on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

})();
