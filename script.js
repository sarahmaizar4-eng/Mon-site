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

  // Handle page load with hash - FORCER HOME si pas de hash valide
  const hash = window.location.hash.replace('#', '');
  const validSections = ['home', 'about', 'portfolio', 'skills', 'services', 'contact', 'chatbot'];
  
  // Si le hash n'existe pas ou n'est pas valide, on force HOME
  if (!hash || !validSections.includes(hash)) {
    showSection('home');
  } else {
    showSection(hash);
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
  const valid = ['home','about','portfolio','skills','services','contact','chatbot'];

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
  const order = ['home','about','portfolio','skills','services','contact','chatbot'];

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
    chatbot:   'Chat — Sarah.M',
  };

  const observer = new MutationObserver(() => {
    const active = document.querySelector('.page.active');
    if (active && titles[active.id]) document.title = titles[active.id];
  });

  document.querySelectorAll('.page').forEach(p =>
    observer.observe(p, { attributeFilter: ['class'] })
  );
})();

/* ------------------------------------------------
   9. CHATBOT LOGIC
   ------------------------------------------------ */
(function initChatbot() {
  const portfolioData = {
    name: "Sarah Maizar Said", age: 19,
    title: "Engineering Student specialized in Computer Science",
    location: "Cité Nagad, Djibouti",
    bio: "Sarah Maizar Said is a 19-year-old engineering student specialized in computer science. She combines careful technical work with creative ideas to build useful digital products.",
    education: "Engineering student at Faculty of Engineering, specialized in Computer Science. 2+ years of study.",
    skills: ["HTML / CSS: 90%","JavaScript: 75%","Python: 92%","C / C++: 50%","Git / GitHub: 95%"],
    projects: ["Glino C++ - Web design project showcasing C++ integration","Project 2 - Embedded systems with custom firmware","Project 3 - Cross-platform mobile app for students","Project 4 - Machine learning for engineering datasets"],
    services: ["Web Development - Building responsive modern websites","UI / UX Design - Creating intuitive interfaces","Data Analysis - Extracting insights from datasets","Programming - Custom software development"],
    contact: { address: "Cité Nagad, Djibouti", email: "Sarahmaizar4@gmail.com", phone: "+253 77 04 91 81" },
    stats: { yearsStudy: "2+", projectsCount: "4+", technologies: "3+" }
  };

  function normalizeText(text) { return text.toLowerCase().trim().replace(/[?.,!;:]/g, ''); }
  function containsAny(text, keywords) {
    const normalized = normalizeText(text);
    return keywords.some(k => normalized.includes(k.toLowerCase()));
  }

  function getResponse(question) {
    const q = normalizeText(question);
    if (containsAny(q, ['who is sarah','tell me about sarah','about sarah','sarah maizar','her name','background'])) return `👩‍💻 ${portfolioData.name} is a ${portfolioData.age}-year-old ${portfolioData.title}. ${portfolioData.bio}`;
    if (containsAny(q, ['how old','age','years old'])) return `🎂 ${portfolioData.name} is ${portfolioData.age} years old.`;
    if (containsAny(q, ['education','study','studying','student','faculty','engineering student','university'])) return `🎓 ${portfolioData.education}`;
    if (containsAny(q, ['skill','expertise','technologies','tech stack','know','languages'])) return `⚡ Here are Sarah's skills:\n${portfolioData.skills.map(s => '• ' + s).join('\n')}\n\nShe's continuously improving!`;
    if (containsAny(q, ['html','css'])) return `🎨 Sarah's HTML/CSS skill level is 90%. She creates responsive and modern web designs.`;
    if (containsAny(q, ['javascript','js'])) return `💻 JavaScript proficiency: 75%. Sarah builds interactive web applications.`;
    if (containsAny(q, ['python'])) return `🐍 Python expertise: 92%. Strong in data analysis and backend development.`;
    if (containsAny(q, ['c++','cpp'])) return `🔧 C/C++ knowledge: 50%. Currently advancing in system programming.`;
    if (containsAny(q, ['git','github'])) return `📦 Git/GitHub proficiency: 95%. Experienced with version control.`;
    if (containsAny(q, ['project','portfolio','work','built','glino'])) return `📁 Sarah has ${portfolioData.stats.projectsCount} featured projects:\n${portfolioData.projects.map(p => '📌 ' + p).join('\n')}`;
    if (containsAny(q, ['service','offer','provide','assist'])) return `🛠️ Sarah offers these services:\n${portfolioData.services.map(s => '✨ ' + s).join('\n')}`;
    if (containsAny(q, ['email','mail']) && containsAny(q, ['contact','reach','find'])) return `📧 Email Sarah at: ${portfolioData.contact.email}`;
    if (containsAny(q, ['phone','call','number'])) return `📞 Sarah's phone number: ${portfolioData.contact.phone}`;
    if (containsAny(q, ['contact','reach','find','get in touch'])) return `📬 Contact Sarah via:\n• Email: ${portfolioData.contact.email}\n• Phone: ${portfolioData.contact.phone}\n• Address: ${portfolioData.contact.address}`;
    if (containsAny(q, ['hello','hi','hey','bonjour'])) return `👋 Hello! I'm Sarah's portfolio assistant. How can I help you?`;
    if (containsAny(q, ['thank','thanks','merci'])) return `😊 You're very welcome! Feel free to ask more questions about Sarah.`;
    return `🤔 I can answer questions about Sarah's portfolio.\n\nTry asking:\n• "Who is Sarah?"\n• "What are her skills?"\n• "Tell me about her projects"\n• "How can I contact her?"`;
  }

  // Wait until chatbot section is in DOM (may be added later)
  function setupChatbot() {
    const messagesContainer = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    if (!messagesContainer || !chatInput || !sendBtn) return;

    let typingEl = null;

    function addMessage(content, isUser) {
      const div = document.createElement('div');
      div.className = 'message ' + (isUser ? 'user' : 'bot');
      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      avatar.textContent = isUser ? '👤' : '🤖';
      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      contentDiv.innerHTML = content.replace(/\n/g, '<br>');
      div.appendChild(avatar);
      div.appendChild(contentDiv);
      messagesContainer.appendChild(div);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTyping() {
      if (typingEl) return;
      typingEl = document.createElement('div');
      typingEl.className = 'message bot';
      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      avatar.textContent = '🤖';
      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      contentDiv.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
      typingEl.appendChild(avatar);
      typingEl.appendChild(contentDiv);
      messagesContainer.appendChild(typingEl);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTyping() {
      if (typingEl) { typingEl.remove(); typingEl = null; }
    }

    async function sendMessage(question) {
      if (!question || !question.trim()) return;
      addMessage(question, true);
      chatInput.value = '';
      showTyping();
      await new Promise(r => setTimeout(r, 500));
      hideTyping();
      addMessage(getResponse(question), false);
    }

    sendBtn.addEventListener('click', () => sendMessage(chatInput.value));
    chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(chatInput.value); });
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => sendMessage(chip.getAttribute('data-question')));
    });
  }

  // Run setup on page load
  setupChatbot();
})();
