/**
 * THÉMIS - ACADEMIA DE FORMAÇÃO DE VIGILANTES
 * Lógica Interativa, Animações e Componentes (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initTextSwap();
  initStatsCounter();
  initFacilityTabs();
  initCourseFilters();
  initCourseModal();
  initContactForm();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. NAVBAR SCROLL EFFECT
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. MOBILE MENU DRAWER
   -------------------------------------------------------------------------- */
const SVG_ICONS = {
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="vertical-align: middle; margin-right: 6px;"><polyline points="20 6 9 17 4 12"></polyline></svg>'
};

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  const toggleDrawer = () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen ? SVG_ICONS.close : SVG_ICONS.menu;
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', toggleDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = SVG_ICONS.menu;
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   3. ANIMAÇÃO DE TEXT SWAP (TROCA DINÂMICA DE PALAVRAS COM CURSOR)
   -------------------------------------------------------------------------- */
function initTextSwap() {
  const textSwapElement = document.getElementById('textSwap');
  if (!textSwapElement) return;

  const phrases = [
    'segurança privada',
    'escolta armada',
    'transporte de valores',
    'proteção VIP',
    'defesa pessoal tática'
  ];

  let currentIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentPhrase = phrases[currentIndex];

    if (isDeleting) {
      textSwapElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      textSwapElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pausa antes de apagar
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentIndex = (currentIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Iniciar após pequeno delay
  setTimeout(typeEffect, 800);
}

/* --------------------------------------------------------------------------
   4. CONTADOR DE ESTATÍSTICAS ANIMADO (STATS COUNTER ON SCROLL)
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statItems = document.querySelectorAll('.stat-value');
  if (!statItems.length) return;

  let hasAnimated = false;

  const animateNumbers = () => {
    statItems.forEach(item => {
      const target = parseInt(item.getAttribute('data-target'), 10);
      const prefix = item.getAttribute('data-prefix') || '';
      const suffix = item.getAttribute('data-suffix') || '';
      const duration = 1800;
      const start = 0;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(start + (target - start) * easeProgress);

        item.textContent = `${prefix}${currentVal.toLocaleString('pt-BR')}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          item.textContent = `${prefix}${target.toLocaleString('pt-BR')}${suffix}`;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateNumbers();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* --------------------------------------------------------------------------
   5. TABS INTERATIVAS DA ESTRUTURA (ESTANDE, TATAME, SALAS, INSTRUTORES)
   -------------------------------------------------------------------------- */
function initFacilityTabs() {
  const tabButtons = document.querySelectorAll('.facility-tab-btn');
  const panes = document.querySelectorAll('.facility-pane');

  if (!tabButtons.length || !panes.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(`tab-${targetId}`);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. FILTRO DE CURSOS POR CATEGORIA
   -------------------------------------------------------------------------- */
function initCourseFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  if (!filterBtns.length || !courseCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      courseCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. MODAL DE DETALHES DO CURSO
   -------------------------------------------------------------------------- */
const COURSES_DATA = {
  formacao: {
    title: 'Curso de Formação de Vigilante',
    badge: 'Curso Base Oficial',
    duration: '200 horas/aula (aprox. 20 dias)',
    certification: 'Certificado com Validade Nacional homologado pela PF',
    prerequisites: 'Idade mínima de 21 anos, Ensino Fundamental completo e idoneidade comprovada.',
    description: 'O curso de Formação de Vigilante é a porta de entrada obrigatória para a profissão de segurança privada no Brasil. Abrange treinamento intensivo teórico e prático em conformidade com as diretrizes da Polícia Federal.',
    syllabus: [
      'Armamento e Tiro Teórico e Prático',
      'Defesa Pessoal Tática e Imobilizações',
      'Legislação Aplicada e Direitos Humanos',
      'Prevenção e Combate a Incêndios',
      'Primeiros Socorros em Emergências',
      'Rádio e Comunicações Operacionais',
      'Vigilância Eletrônica e Segurança Física',
      'Gerenciamento de Crises e Conflitos'
    ]
  },
  reciclagem: {
    title: 'Curso de Reciclagem de Vigilante',
    badge: 'Atualização Obrigatória',
    duration: '50 horas/aula (aprox. 5 dias)',
    certification: 'Atualização válida por 2 anos (CNV ativa)',
    prerequisites: 'Possuir o curso de Formação de Vigilante e estar dentro do prazo regular.',
    description: 'Curso obrigatório a cada dois anos para manter o vigilante ativo e apto para trabalhar. Focado na atualização de tiro real, novas técnicas de defesa e legislação vigente.',
    syllabus: [
      'Atualização de Tiro e Disparos Reais',
      'Novas Práticas de Defesa Pessoal',
      'Revisão da Legislação e Jurisprudência',
      'Protocolos Atualizados de Segurança',
      'Treinamento em Cenários Simulados',
      'Simulação de Emergências Operacionais'
    ]
  },
  escolta: {
    title: 'Extensão em Escolta Armada',
    badge: 'Extensão Tática Especializada',
    duration: '50 horas/aula',
    certification: 'Habilitação específica para escolta de cargas e comboios',
    prerequisites: 'Curso de Formação de Vigilante concluído e com reciclagem em dia.',
    description: 'Capacita o vigilante para operações de escolta rodoviária e urbana de cargas de alto valor e comboios industriais. Envolve direção defensiva, reação a emboscadas e tiro tático veicular.',
    syllabus: [
      'Táticas de Proteção e Acompanhamento',
      'Tiro Tático Embarcado e Veicular',
      'Reação em Situações de Emboscada',
      'Legislação de Trânsito e Escolta',
      'Comunicação em Comboio e Roteirização',
      'Procedimentos de Abordagem e Fuga'
    ]
  },
  transporte: {
    title: 'Extensão em Transporte de Valores',
    badge: 'Elite Operacional',
    duration: '50 horas/aula',
    certification: 'Habilitação para atuação em empresas de Carro-Forte',
    prerequisites: 'Formação de Vigilante regularizada e teste psicotécnico aprovado.',
    description: 'Treinamento de alto rendimento para atuar em carros-fortes, tesourarias e custódia de numerários bancários. Foco total em disciplina, precisão e procedimentos de segurança máxima.',
    syllabus: [
      'Operações de Carro-Forte e Guarnição',
      'Tiro com Armas de Alta Energia (Calibres Permitidos)',
      'Controle e Manuseio de Valores',
      'Varredura de Risco e Perímetros Críticos',
      'Embarque e Desembarque Seguro',
      'Procedimentos em Ataques e Tentativas de Assalto'
    ]
  },
  seguranca_pessoal: {
    title: 'Vigilante de Segurança Pessoal Privada (VSPP)',
    badge: 'Proteção Executiva VIP',
    duration: '50 horas/aula',
    certification: 'Credenciamento oficial para segurança pessoal e autoridades',
    prerequisites: 'Formação de Vigilante com histórico exemplar e aptidão física.',
    description: 'Prepara o profissional para atuar como segurança pessoal de executivos, empresários, artistas e autoridades públicas. Enfatiza discrição, planejamento de itinerários e ação evasiva.',
    syllabus: [
      'Planejamento e Reconhecimento de Itinerários',
      'Técnicas de Escolta a Pé e Embarcada',
      'Defesa Imediata da Autoridade (VIP)',
      'Etiqueta Corporativa e Postura Profissional',
      'Identificação Antecipada de Ameaças',
      'Direção Evasiva e Defensiva'
    ]
  },
  defesa_pessoal: {
    title: 'Curso Intensivo de Defesa Pessoal Tática',
    badge: 'Módulo Prático Avançado',
    duration: '40 horas/aula práticas',
    certification: 'Certificado de Especialização Tática Thémis',
    prerequisites: 'Aberto a vigilantes e profissionais de segurança pública/privada.',
    description: 'Treinamento 100% focado no tatame próprio da Thémis. Ensina retenção e contra-retenção de armas de fogo, controle de agressores armados com facas, e imobilizações policiais seguras.',
    syllabus: [
      'Retenção e Contra-Retenção de Armamento',
      'Defesa Contra Ataques de Arma Branca',
      'Imobilizações Táticas Articulares',
      'Uso Racional da Força e Tonfa Tática',
      'Combate Corpo a Corpo e Rolamentos',
      'Controle Psicológico sob Estresse Extremo'
    ]
  }
};

function initCourseModal() {
  const modalBackdrop = document.getElementById('courseModal');
  const closeBtn = document.getElementById('modalClose');
  const detailsButtons = document.querySelectorAll('[data-course-key]');

  if (!modalBackdrop) return;

  const titleEl = document.getElementById('modalTitle');
  const badgeEl = document.getElementById('modalBadge');
  const descEl = document.getElementById('modalDesc');
  const durationEl = document.getElementById('modalDuration');
  const certEl = document.getElementById('modalCert');
  const prereqEl = document.getElementById('modalPrereq');
  const syllabusListEl = document.getElementById('modalSyllabus');
  const whatsappBtn = document.getElementById('modalWaBtn');

  const openModal = (courseKey) => {
    const data = COURSES_DATA[courseKey];
    if (!data) return;

    titleEl.textContent = data.title;
    badgeEl.textContent = data.badge;
    descEl.textContent = data.description;
    durationEl.textContent = data.duration;
    certEl.textContent = data.certification;
    prereqEl.textContent = data.prerequisites;

    syllabusListEl.innerHTML = '';
    data.syllabus.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      syllabusListEl.appendChild(li);
    });

    const encodedMsg = encodeURIComponent(`Olá, equipe Thémis! Gostaria de saber valores e próximas turmas para o ${data.title}.`);
    whatsappBtn.href = `https://wa.me/5511999999999?text=${encodedMsg}`;

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  detailsButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-course-key');
      openModal(key);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   8. FORMULÁRIO DE CONTATO E MATRÍCULA COM MÁSCARA
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const phoneInput = document.getElementById('formPhone');
  if (!form) return;

  // Máscara de Telefone (XX) XXXXX-XXXX
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.substring(0, 11);

      if (val.length > 6) {
        val = `(${val.substring(0, 2)}) ${val.substring(2, 7)}-${val.substring(7)}`;
      } else if (val.length > 2) {
        val = `(${val.substring(0, 2)}) ${val.substring(2)}`;
      } else if (val.length > 0) {
        val = `(${val}`;
      }
      e.target.value = val;
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const course = document.getElementById('formCourse').value;
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !phone) {
      alert('Por favor, preencha seu nome e telefone WhatsApp.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando...';

    setTimeout(() => {
      const text = `Olá! Meu nome é ${name}. Tenho interesse no curso: ${course}. WhatsApp: ${phone}. Mensagem: ${message || 'Gostaria de receber a grade e valores.'}`;
      const url = `https://wa.me/5511999999999?text=${encodeURIComponent(text)}`;

      alert(`Obrigado pelo contato, ${name}! Redirecionando para o nosso WhatsApp oficial com seus dados preenchidos.`);
      window.open(url, '_blank');

      submitBtn.disabled = false;
      submitBtn.innerHTML = `${SVG_ICONS.check} Mensagem Enviada!`;
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
      }, 4000);
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   9. NAVEGAÇÃO SUAVE (SMOOTH SCROLL)
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId.length <= 1) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 74;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}
