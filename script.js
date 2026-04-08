/* ================================================
   script.js — Sarah.M Portfolio
   ================================================ */

'use strict';

/* ------------------------------------------------
   1. SECTION NAVIGATION (SPA-style)
   ------------------------------------------------ */
(function initNav() {
  const hexBtns  = document.querySelectorAll('.hex-btn');
  const pages    = document.querySelectorAll('.page');

  function showSection(targetId) {
    // Hide all pages
    pages.forEach(p => p.classList.remove('active'));
    hexBtns.forEach(b => b.classList.remove('active'));

    // Show target page
    const page = document.getElementById(targetId);
    const btn  = document.querySelector(`.hex-btn[data-target="${targetId}"]`);

    if (page) {
      page.classList.add('active');
      // Trigger skill bars if skills section
      if (targetId === 'skills') triggerSkillBars();
    }
    if (btn) btn.classList.add('active');

    // Update URL hash without scrolling
    history.replaceState(null, '', '#' + targetId);
  }

  // Nav button clicks
  hexBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.dataset.target;
      if (target) showSection(target);
    });
  });

  // In-page CTA links with data-target
  document.querySelectorAll('a[data-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.dataset.target);
    });
  });

  // Handle page load with hash
  const hash = window.location.hash.replace('#', '');
  const validSections = ['home', 'about', 'portfolio', 'skills', 'services', 'contact'];
  if (hash && validSections.includes(hash)) {
    showSection(hash);
  } else {
    showSection('home');
  }
})();


/* ------------------------------------------------
   2. SKILL BARS ANIMATION
   ------------------------------------------------ */
function triggerSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const w = bar.dataset.w || '0';
    // Small delay so animation is visible after section switch
    setTimeout(() => { bar.style.width = w + '%'; }, 100);
  });
}


/* ------------------------------------------------
   3. REVEAL ON SECTION ENTRY
   (runs whenever a new page becomes active)
   ------------------------------------------------ */
(function initReveal() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.target.querySelectorAll('.reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 100);
      });
    });
  });

  document.querySelectorAll('.page').forEach(page => {
    observer.observe(page, { attributeFilter: ['class'] });
  });

  // Also handle initial active page
  document.querySelectorAll('.page.active .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 100 + 200);
  });
})();


/* ------------------------------------------------
   4. ACTIVE NAV based on hash changes (back/forward)
   ------------------------------------------------ */
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  const pages = document.querySelectorAll('.page');
  const hexBtns = document.querySelectorAll('.hex-btn');
  const valid = ['home','about','portfolio','skills','services','contact'];

  if (valid.includes(hash)) {
    pages.forEach(p => p.classList.remove('active'));
    hexBtns.forEach(b => b.classList.remove('active'));

    const page = document.getElementById(hash);
    const btn  = document.querySelector(`.hex-btn[data-target="${hash}"]`);
    if (page) { page.classList.add('active'); if (hash === 'skills') triggerSkillBars(); }
    if (btn)  btn.classList.add('active');
  }
});


/* ------------------------------------------------
   5. PROJECT CARD — hover ripple effect
   ------------------------------------------------ */
(function initRipple() {
  document.querySelectorAll('.proj-card, .serv-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
      this.style.setProperty('--mx', (e.offsetX) + 'px');
      this.style.setProperty('--my', (e.offsetY) + 'px');
    });
  });
})();


/* ------------------------------------------------
   6. HEX CLUSTER — spin on hover
   ------------------------------------------------ */
(function initHexCluster() {
  const cluster = document.querySelector('.hex-cluster');
  if (!cluster) return;
  let angle = 0;
  let animId;
  let spinning = false;

  cluster.addEventListener('mouseenter', () => {
    spinning = true;
    function spin() {
      if (!spinning) return;
      angle += 0.4;
      const orbiters = cluster.querySelectorAll('.hx:not(.hx-c)');
      orbiters.forEach((hx, i) => {
        const baseAngle = (i / orbiters.length) * 360 + angle;
        const rad = baseAngle * Math.PI / 180;
        const r   = 95;
        const cx  = 140, cy = 140;
        const x   = cx + r * Math.cos(rad) - 40;
        const y   = cy + r * Math.sin(rad) - 35;
        hx.style.left = x + 'px';
        hx.style.top  = y + 'px';
      });
      animId = requestAnimationFrame(spin);
    }
    spin();
  });

  cluster.addEventListener('mouseleave', () => {
    spinning = false;
    cancelAnimationFrame(animId);
    // Reset positions via CSS
    const orbiters = cluster.querySelectorAll('.hx:not(.hx-c)');
    orbiters.forEach(hx => { hx.style.left = ''; hx.style.top = ''; });
  });
})();


/* ------------------------------------------------
   7. KEYBOARD NAVIGATION (arrows)
   ------------------------------------------------ */
(function initKeyNav() {
  const order = ['home','about','portfolio','skills','services','contact'];

  document.addEventListener('keydown', (e) => {
    const active = document.querySelector('.page.active');
    if (!active) return;
    const idx = order.indexOf(active.id);
    let next = -1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = Math.min(idx + 1, order.length - 1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   next = Math.max(idx - 1, 0);

    if (next !== -1 && next !== idx) {
      const pages   = document.querySelectorAll('.page');
      const hexBtns = document.querySelectorAll('.hex-btn');
      pages.forEach(p => p.classList.remove('active'));
      hexBtns.forEach(b => b.classList.remove('active'));
      const targetId = order[next];
      document.getElementById(targetId)?.classList.add('active');
      document.querySelector(`.hex-btn[data-target="${targetId}"]`)?.classList.add('active');
      history.replaceState(null, '', '#' + targetId);
      if (targetId === 'skills') triggerSkillBars();
    }
  });
})();


/* ------------------------------------------------
   8. PAGE TITLE update on section change
   ------------------------------------------------ */
(function initTitleSync() {
  const titles = {
    home:      'Sarah.M — Portfolio',
    about:     'About — Sarah.M',
    portfolio: 'Projects — Sarah.M',
    skills:    'Skills — Sarah.M',
    services:  'Services — Sarah.M',
    contact:   'Contact — Sarah.M',
  };

  const observer = new MutationObserver(() => {
    const active = document.querySelector('.page.active');
    if (active && titles[active.id]) document.title = titles[active.id];
  });

  document.querySelectorAll('.page').forEach(p =>
    observer.observe(p, { attributeFilter: ['class'] })
  );
})();