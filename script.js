/**
 * PORTFÓLIO — Antônio Pires Moreira
 * script.js
 *
 * Funcionalidades:
 *  1. Navbar: fundo ao rolar + link ativo conforme seção
 *  2. Scroll suave para âncoras internos
 *  3. Revelar elementos ao entrar na viewport (IntersectionObserver)
 *  4. Animar barras de progresso de habilidades
 *  5. Formulário de contato (simulação / mailto)
 *  6. Ano dinâmico no rodapé
 *  7. Fecha menu mobile ao clicar em link
 */

/* ============================================================
   1. NAVBAR — muda visual ao rolar a página
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Executa uma vez ao carregar (caso página seja recarregada com scroll)
  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });
})();


/* ============================================================
   2. LINK ATIVO NA NAVBAR conforme seção visível
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let currentId = '';

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink(); // Executa ao carregar
})();


/* ============================================================
   3. SCROLL SUAVE para âncoras internos
      (Bootstrap 5 e browsers modernos já suportam via CSS,
       mas este fallback garante compatibilidade total)
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
})();


/* ============================================================
   4. REVEAL — revelar elementos ao entrar na viewport
   ============================================================ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Para de observar após revelar
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ============================================================
   5. BARRAS DE PROGRESSO — animar ao entrar na viewport
   ============================================================ */
(function initProgressBars() {
  const bars = document.querySelectorAll('.progress-bar[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width') + '%';

          // Pequeno delay para a animação parecer intencional
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 200);

          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
})();


/* ============================================================
   6. FORMULÁRIO DE CONTATO — validação + feedback
   ============================================================ */
(function initContactForm() {
  const sendBtn = document.getElementById('sendBtn');
  const feedback = document.getElementById('formFeedback');
  const form = document.getElementById('contactForm');

  if (!sendBtn) return;

  sendBtn.addEventListener('click', function () {
    const name    = document.getElementById('contactName')?.value.trim();
    const email   = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMsg')?.value.trim();

    // --- Validação básica ---
    if (!name || !email || !message) {
      shakeButton(sendBtn);
      showInputErrors({ name, email, message });
      return;
    }

    if (!isValidEmail(email)) {
      shakeButton(sendBtn);
      highlightInput('contactEmail', true);
      return;
    }

    // --- Monta o mailto e abre cliente de e-mail ---
    const subject = encodeURIComponent(`Contato pelo portfólio — ${name}`);
    const body    = encodeURIComponent(`Olá, Antônio!\n\nNome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`);
    const mailTo  = `mailto:antoniopires2209@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailTo;

    // --- Mostra feedback de sucesso ---
    if (form && feedback) {
      form.classList.add('d-none');
      feedback.classList.remove('d-none');
    }
  });

  /** Verifica e-mail com regex simples */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /** Destaca campos inválidos */
  function showInputErrors({ name, email, message }) {
    highlightInput('contactName',  !name);
    highlightInput('contactEmail', !email);
    highlightInput('contactMsg',   !message);
  }

  function highlightInput(id, hasError) {
    const el = document.getElementById(id);
    if (!el) return;

    if (hasError) {
      el.style.borderColor = '#f87171';
    } else {
      el.style.borderColor = '';
    }

    // Remove destaque depois de 2s
    if (hasError) {
      setTimeout(() => {
        el.style.borderColor = '';
      }, 2000);
    }
  }

  /** Animação de "shake" no botão quando há erro */
  function shakeButton(btn) {
    btn.style.animation = 'none';
    btn.offsetHeight; // reflow
    btn.style.animation = 'shakeBtn 0.4s ease';

    btn.addEventListener('animationend', () => {
      btn.style.animation = '';
    }, { once: true });
  }
})();

/* Adiciona keyframes para shake dinamicamente */
(function addShakeKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shakeBtn {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
})();


/* ============================================================
   7. ANO DINÂMICO no rodapé
   ============================================================ */
(function setFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();


/* ============================================================
   8. FECHAR MENU MOBILE ao clicar em link
   ============================================================ */
(function initMobileMenuClose() {
  const navMenu = document.getElementById('navMenu');
  if (!navMenu) return;

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      // Usa a API do Bootstrap para fechar o collapse
      const bsCollapse = bootstrap.Collapse.getInstance(navMenu);
      if (bsCollapse) bsCollapse.hide();
    });
  });
})();


/* ============================================================
   9. EASTER EGG no console 🐣
   ============================================================ */
(function consoleBranding() {
  const style = [
    'color: #4ade80',
    'font-family: monospace',
    'font-size: 14px',
    'font-weight: bold',
    'padding: 4px 8px',
    'background: #131620',
    'border-radius: 4px'
  ].join(';');

  console.log('%c👋 Olá, curioso! — Portfólio de Antônio Pires Moreira', style);
  console.log('%c🔗 github.com/TonioPMz', style);
})();