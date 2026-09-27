// Execute JavaScript logic once the document DOM is ready
document.addEventListener('DOMContentLoaded', () => {
      
  /* -------------------------------------------------------------
     1. Light & Dark Theme Toggle Logic
  ------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlElem = document.documentElement;
  const themeIcon = themeToggleBtn?.querySelector('i');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElem.getAttribute('data-theme');
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
    });
  }

  /* -------------------------------------------------------------
     5. FULL-STACK Contact Modal Logic (Sends to Gmail)
  ------------------------------------------------------------- */
  const contactModal = document.getElementById('contactModal');
  const openContactBtn = document.getElementById('openContactBtn') || document.getElementById('contactBtn');
  const closeModalBtn = document.getElementById('closeModalBtn') || document.getElementById('closeModal');
  const contactForm = document.getElementById('contactForm');

  // Open Modal
  if (openContactBtn && contactModal) {
    openContactBtn.addEventListener('click', () => {
      contactModal.classList.add('open');
      contactModal.style.display = 'flex';
    });
  }

  // Close Modal
  if (closeModalBtn && contactModal) {
    closeModalBtn.addEventListener('click', () => {
      contactModal.classList.remove('open');
      contactModal.style.display = 'none';
    });
  }

  // Close modal if user clicks on dark overlay outside content
  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        contactModal.classList.remove('open');
        contactModal.style.display = 'none';
      }
    });
  }

  // Handle Form Submission to Node.js backend
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Safely fetch inputs or fallback to empty strings
      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const messageInput = document.getElementById('senderMessage');

      const senderName = nameInput ? nameInput.value : '';
      const senderEmail = emailInput ? emailInput.value : '';
      const senderMessage = messageInput ? messageInput.value : '';

      try {
        const response = await fetch('http://localhost:5000/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            sender_name: senderName, 
            sender_email: senderEmail, 
            message: senderMessage 
          })
        });

        const data = await response.json();
        
        showToast(data.message || 'Message sent successfully!');
        
        if (contactModal) {
          contactModal.classList.remove('open');
          contactModal.style.display = 'none';
        }
        contactForm.reset();

      } catch (error) {
        showToast('Error: Is your Node.js server running?');
        console.error(error);
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
      
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    } else {
      alert(message);
    }
  }
});