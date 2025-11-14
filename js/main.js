/* Main JS: theme toggle, projects, scroll reveal, draggable icons */
(function(){
  'use strict';

  // === CONFIGURAÇÕES ===
  const WHATSAPP_NUMBER = '351924781513'; // ← COLOQUE SEU NÚMERO AQUI

  // Dados dos projetos — fácil de adicionar!
  const projects = [
    {
      title: 'Site Institucional',
      description: 'Criado para empresa Afiacorte.',
      image: 'img/projeto1.png',
      demo: 'https://edsette.github.io/afiacorte/'
    },
    {
      title: 'E-Commerce completo',
      description: 'Empresa local de vendas de materiais de construção.',
      image: 'img/projeto2.png',
      site: 'https://www.casabianca.com.br/'
    },
    // Adicione mais aqui! Ex:
    // { title: 'App X', description: '...', image: '...', site: '...', demo: '...' }
  ];

  // DOM
  const q = s => document.querySelector(s);
  const qa = s => document.querySelectorAll(s);

  // Ano atual
  const yearEl = q('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // === TEMA CLARO/ESCURO ===
  const html = document.documentElement;
  const themeBtn = q('#theme-toggle');
  const storedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', storedTheme);
  themeBtn.innerHTML = storedTheme === 'dark' ? '🌙' : '☀️';

  function toggleTheme() {
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeBtn.innerHTML = newTheme === 'dark' ? '🌙' : '☀️';
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
    themeBtn.addEventListener('keyup', e => (e.key === 'Enter' || e.key === ' ') && toggleTheme());
  }

  // === SCROLL SUAVE ===
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (a && a.getAttribute('href') !== '#') {
      e.preventDefault();
      document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    }
  });

  // === INJETAR PROJETOS ===
  const grid = q('#projects-grid');
  if (grid && projects.length > 0) {
    projects.forEach(p => {
      const card = document.createElement('article');
      card.className = 'project-card fade-in-up';
      card.setAttribute('role', 'listitem');

      let buttons = '';
      if (p.site) buttons += `<a class="btn ghost" href="${p.site}" target="_blank" rel="noopener">Site</a>`;
      if (p.demo) buttons += `<a class="btn ghost" href="${p.demo}" target="_blank" rel="noopener">Demo</a>`;

      card.innerHTML = `
        <div class="project-media" style="background-image:url('${p.image}')" aria-hidden="true"></div>
        <div class="project-body">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <div class="project-tags">${buttons}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // === ANIMAÇÃO DE REVEAL ===
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    qa('.fade-in-up').forEach(el => observer.observe(el));
  } else {
    qa('.fade-in-up').forEach(el => el.classList.add('reveal'));
  }

  // === ÍCONES DRAGGABLE (opcional) ===
  qa('.icon').forEach(icon => {
    let dragging = false, startX, startY, offsetX = 0, offsetY = 0;
    icon.addEventListener('dragstart', e => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      e.dataTransfer.setData('text/plain', 'drag');
    });
    document.addEventListener('dragover', e => {
      if (dragging) {
        e.preventDefault();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        icon.style.transform = `translate(${offsetX + dx}px, ${offsetY + dy}px)`;
      }
    });
    document.addEventListener('dragend', e => {
      if (dragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        offsetX += dx;
        offsetY += dy;
        dragging = false;
      }
    });
  });

  // === BOTÃO WHATSAPP FLUTUANTE ===
  const floatBtn = q('.whatsapp-float');
  if (floatBtn) {
    floatBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá%20Eduardo!%20Vi%20seu%20portfólio%20e%20gostaria%20de%20conversar.`;
  }

})();