// Execute JavaScript logic once the document DOM is ready
document.addEventListener('DOMContentLoaded', () => {

  const htmlElem = document.documentElement;

  /* -------------------------------------------------------------
     1. Light & Dark Theme Toggle Logic
  ------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = themeToggleBtn?.querySelector('i');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElem.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlElem.setAttribute('data-theme', newTheme);
      if (themeIcon) {
        themeIcon.className = newTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      }

      showToast(`Switched to ${newTheme} mode`);
    });
  }

  /* -------------------------------------------------------------
     2. Color Accent Palette Switcher Logic
  ------------------------------------------------------------- */
  const accentBtns = document.querySelectorAll('.accent-btn');
  accentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      accentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const color = btn.getAttribute('data-color');
      if (color === 'indigo') {
        htmlElem.removeAttribute('data-accent');
      } else {
        htmlElem.setAttribute('data-accent', color);
      }

      showToast(`Accent updated to ${color}`);
    });
  });

  /* -------------------------------------------------------------
     3. Skill Category Filtering Logic
  ------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillBadges = document.querySelectorAll('.skill-badge');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      skillBadges.forEach(badge => {
        const badgeCat = badge.getAttribute('data-cat');
        if (category === 'all' || badgeCat === category) {
          badge.style.display = 'inline-flex';
        } else {
          badge.style.display = 'none';
        }
      });
    });
  });

  /* -------------------------------------------------------------
     4. Copy Contact Info to Clipboard
  ------------------------------------------------------------- */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const studentEmail = 'abduse816@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(studentEmail)
          .then(() => showToast('Email copied to clipboard!'))
          .catch(() => showToast('Failed to copy email'));
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = studentEmail;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand('copy');
          showToast('Email copied to clipboard!');
        } catch (err) {
          showToast('Failed to copy email');
        } finally {
          document.body.removeChild(tempInput);
        }
      }
    });
  }

  /* -------------------------------------------------------------
     5. Contact Modal Logic (Formspree)
  ------------------------------------------------------------- */
  const contactModal = document.getElementById('contactModal');
  const openContactBtn = document.getElementById('openContactBtn') || document.getElementById('contactBtn');
  const closeModalBtn = document.getElementById('closeModalBtn') || document.getElementById('closeModal');
  const contactForm = document.getElementById('contactForm');

  function openModal() {
    if (contactModal) {
      contactModal.style.display = 'flex';
      contactModal.classList.remove('hidden');
    }
  }

  function closeModal() {
    if (contactModal) {
      contactModal.style.display = 'none';
      contactModal.classList.add('hidden');
    }
  }

  // Open Modal
  if (openContactBtn) {
    openContactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  // Close Modal triggers
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeModal();
    });
  }

  // Form Submission via Fetch API
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('submitBtn') || contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;
      }

      const formData = new FormData(contactForm);

    try {
        const response = await fetch('https://formspree.io/f/xaenpgen', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          showToast('Message sent successfully!');
          closeModal();
          contactForm.reset();
        } else {
          showToast('Failed to send message. Please check form parameters.');
        }
      } catch (error) {
        showToast('Network error. Please try again.');
        console.error('Submission error:', error);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  /* -------------------------------------------------------------
     Helper Function: Display Temporary Toast Notification
  ------------------------------------------------------------- */
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimeout;

  function showToast(message) {
    if (toastMsg && toast) {
      toastMsg.textContent = message;
      toast.classList.add('show');
      toast.style.display = 'block';

      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
        toast.style.display = 'none';
      }, 2500);
    } else {
      console.log('Toast Notification:', message);
    }
  }
});