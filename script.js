/**
 * ============================================================================
 * SHINOBI PORTFOLIO LOGIC
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENTS ---
  const loader = document.getElementById('loader');
  const loaderStatus = document.getElementById('loader-status');
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const navLinksList = document.getElementById('navLinks');
  const parallaxBgs = document.querySelectorAll('.parallax-bg');
  const screenFlash = document.getElementById('screen-flash');
  const systemStatus = document.getElementById('systemStatus');
  const sharinganEyes = document.querySelectorAll('.eye-svg');
  const tiltElements = document.querySelectorAll('.project-card, .skill-card, #dossier-portrait, #hero-portal');

  // --- AUTOMATED LOADER CONTROL (Genjutsu Zoom Transition) ---
  let transitionTriggered = false;

  const triggerLoaderTransition = () => {
    if (transitionTriggered) return;
    transitionTriggered = true;

    // 1. Update text to show Genjutsu is initiating
    if (loaderStatus) {
      loaderStatus.textContent = 'Genjutsu Aligned.';
      loaderStatus.style.textShadow = '0 0 15px var(--accent-orange)';
    }

    // 2. Wait a brief moment, then play zoom scaling transition
    setTimeout(() => {
      if (loader) {
        loader.classList.add('genjutsu-transition');
      }

      // 3. Completely hide loader after transition completes
      setTimeout(() => {
        if (loader) {
          loader.style.display = 'none';
        }
      }, 850);
    }, 700); // 700ms of "Genjutsu Aligned" state before zoom
  };

  // 1. Trigger transition when all assets are fully loaded (ensures loader shows for at least 1.6 seconds)
  window.addEventListener('load', () => {
    setTimeout(triggerLoaderTransition, 1600);
  });

  // 2. Fallback: Force transition after 3.5 seconds in case of slow mobile connections
  setTimeout(triggerLoaderTransition, 3500);

  // --- STICKY NAVIGATION ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- MOBILE NAV TOGGLE ---
  if (menuBtn && navLinksList) {
    menuBtn.addEventListener('click', () => {
      navLinksList.classList.toggle('active');
      
      const spans = menuBtn.querySelectorAll('span');
      if (navLinksList.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    navLinksList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('active');
        const spans = menuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // --- INTERACTIVE MOUSE PARALLAX & EYE TRACKING ---
  window.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Normalized position relative to center (-1 to 1)
    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;

    // 1. Translate background floating elements (embers & leaves)
    parallaxBgs.forEach(bg => {
      const speed = parseFloat(bg.getAttribute('data-speed')) || 1;
      const rotation = bg.getAttribute('data-rotation') || '0';
      const xMove = deltaX * 25 * speed;
      const yMove = deltaY * 25 * speed;
      
      bg.style.transform = `translate3d(${-xMove}px, ${-yMove}px, 0) rotate(${rotation}deg)`;
    });

    // 2. Sharingan Eye Rotation Tracking (Navbar, Portal, Footer)
    sharinganEyes.forEach(eye => {
      const rect = eye.getBoundingClientRect();
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height / 2;
      
      // Calculate angle from eye center to cursor position
      const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
      const angleDeg = angle * (180 / Math.PI);
      
      // Rotate the iris containing tomoes
      eye.style.transform = `rotate(${angleDeg}deg)`;
    });
  });

  // --- 3D INTERACTIVE CARD TILT ---
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Calculate tilt angles based on cursor distance from center (max 15 deg)
      const rotX = -(y / rect.height) * 15;
      const rotY = (x / rect.width) * 15;
      
      // Apply 3D transform rotation and scaling
      el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      el.style.transition = 'transform 0.05s ease';
    });

    el.addEventListener('mouseleave', () => {
      // Revert smooth transition back to initial state
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      el.style.transition = 'transform 0.5s ease';
    });
  });

  // --- CANVAS CHAKRA EMBER CURSOR TRAIL ---
  const canvas = document.getElementById('chakra-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Resize handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle constructor
    class EmberParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = -Math.random() * 2 - 0.5; // Drifts upward
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
        if (this.size > 0.2) this.size -= 0.05;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        const isTsukuyomi = document.body.classList.contains('tsukuyomi-mode');
        const glowColor = isTsukuyomi ? '255, 15, 15' : '230, 0, 0';
        const centerColor = isTsukuyomi ? '0, 0, 0' : '255, 150, 150';

        // Draw glowing gradient particle
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, `rgba(${centerColor}, 1)`);
        grad.addColorStop(0.5, `rgba(${glowColor}, 0.8)`);
        grad.addColorStop(1, `rgba(${glowColor}, 0)`);
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Capture cursor moves and spawn particles
    window.addEventListener('mousemove', (e) => {
      for (let i = 0; i < 2; i++) {
        particles.push(new EmberParticle(e.clientX, e.clientY));
      }
    });

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, idx) => {
        p.update();
        p.draw();
        
        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(idx, 1);
        }
      });
      
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // --- KONAMI CODE EASTER EGG (Tsukuyomi Genjutsu Mode) ---
  const konamiPattern = [
    'ArrowUp', 'ArrowUp', 
    'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 
    'ArrowLeft', 'ArrowRight', 
    'b', 'a'
  ];
  let inputSequence = [];

  window.addEventListener('keydown', (e) => {
    inputSequence.push(e.key);
    
    if (inputSequence.length > konamiPattern.length) {
      inputSequence.shift();
    }

    if (JSON.stringify(inputSequence) === JSON.stringify(konamiPattern)) {
      triggerTsukuyomiGenjutsu();
      inputSequence = [];
    }
  });

  function triggerTsukuyomiGenjutsu() {
    if (screenFlash) {
      screenFlash.classList.add('flash-active');
      setTimeout(() => {
        screenFlash.classList.remove('flash-active');
      }, 150);
    }

    const isActive = document.body.classList.toggle('tsukuyomi-mode');

    if (systemStatus) {
      if (isActive) {
        systemStatus.textContent = 'WARNING: GENJUTSU DETECTED // REALITY COMPROMISED.';
        systemStatus.style.color = '#ff0f0f';
        systemStatus.style.textShadow = '0 0 8px rgba(255, 15, 15, 0.6)';
      } else {
        systemStatus.textContent = 'System Report // No Genjutsu Detected.';
        systemStatus.style.color = 'var(--accent-orange)';
        systemStatus.style.textShadow = '0 0 5px var(--glow-orange)';
      }
  }

  // --- CONTACT FORM AJAX SUBMISSION ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Inscribing Message...';
      submitBtn.disabled = true;
      
      const formData = new FormData(contactForm);
      
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          submitBtn.textContent = 'Message Inscribed Successfully!';
          submitBtn.style.backgroundColor = '#22c55e'; // Green success color
          submitBtn.style.borderColor = '#22c55e';
          submitBtn.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.4)';
          contactForm.reset();
          
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.style.borderColor = '';
            submitBtn.style.boxShadow = '';
            submitBtn.disabled = false;
          }, 4000);
        } else {
          submitBtn.textContent = 'Submission Failed. Retry?';
          submitBtn.disabled = false;
          setTimeout(() => {
            submitBtn.textContent = originalText;
          }, 3000);
        }
      })
      .catch(error => {
        submitBtn.textContent = 'Connection Error.';
        submitBtn.disabled = false;
        setTimeout(() => {
          submitBtn.textContent = originalText;
        }, 3000);
      });
    });
  }
});
