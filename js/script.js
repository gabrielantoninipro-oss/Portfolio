const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const searchInput = document.querySelector('.nav-search');
const suggestionsPanel = document.querySelector('.search-suggestions');
const yearElement = document.getElementById('year');

const navItems = navLinks ? Array.from(navLinks.querySelectorAll('a')).map((link) => ({
  label: link.textContent,
  href: link.getAttribute('href'),
})) : [];

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

function updateSuggestions(query) {
  if (!suggestionsPanel || !query) {
    suggestionsPanel?.classList.remove('open');
    suggestionsPanel?.replaceChildren();
    return;
  }

  const filtered = navItems.filter((item) =>
    item.label.toLowerCase().startsWith(query.toLowerCase())
  );

  if (!filtered.length) {
    suggestionsPanel.classList.remove('open');
    suggestionsPanel.replaceChildren();
    return;
  }

  suggestionsPanel.replaceChildren(...filtered.map((item) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = item.label;
    button.dataset.href = item.href;
    return button;
  }));

  suggestionsPanel.classList.add('open');
}

if (searchInput && suggestionsPanel) {
  searchInput.addEventListener('input', (event) => {
    updateSuggestions(event.target.value.trim());
  });

  searchInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;

    const query = event.target.value.trim().toLowerCase();
    const match = navItems.find((item) =>
      item.label.toLowerCase().startsWith(query)
    );

    if (match) {
      window.location.href = match.href;
    }
  });

  suggestionsPanel.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (button?.dataset.href) {
      window.location.href = button.dataset.href;
    }
  });

  document.addEventListener('click', (event) => {
    if (!searchInput.contains(event.target) && !suggestionsPanel.contains(event.target)) {
      suggestionsPanel.classList.remove('open');
    }
  });
}

/* Accordéons corrigés : fonctionne avec les accordéons imbriqués de la page Projets */
function setPanelHeight(panel) {
  if (!panel.classList.contains('open')) {
    panel.style.maxHeight = '0px';
    return;
  }

  // Les panneaux de la page Projets doivent afficher tout le contenu,
  // sans couper les accordéons Contexte / Architecture / Fabrication / Tests.
  if (panel.classList.contains('scrollable') || panel.classList.contains('scrollable-inner')) {
    panel.style.maxHeight = 'none';
    return;
  }

  panel.style.maxHeight = panel.scrollHeight + 'px';
}

function refreshParents(panel) {
  let parent = panel.parentElement;
  while (parent) {
    if (parent.classList && parent.classList.contains('accordion-content') && parent.classList.contains('open')) {
      setPanelHeight(parent);
    }
    parent = parent.parentElement;
  }
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('.accordion-button');
  if (!button) return;

  const panelId = button.getAttribute('aria-controls');
  if (!panelId) return;

  const panel = document.getElementById(panelId);
  if (!panel) return;

  event.preventDefault();

  const isOpen = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!isOpen));
  panel.classList.toggle('open', !isOpen);

  setPanelHeight(panel);
  refreshParents(panel);

  setTimeout(() => {
    setPanelHeight(panel);
    refreshParents(panel);
  }, 100);
});

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Modal des applications de compétences
const skillModal = document.getElementById('skillModal');
const modalTitle = document.getElementById('modalTitle');
const modalImg = document.getElementById('modalImg');
const modalText = document.getElementById('modalText');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.application-card').forEach((card) => {
  card.addEventListener('click', () => {
    if (!skillModal) return;
    modalTitle.textContent = card.dataset.title || '';
    modalImg.src = card.dataset.img || '';
    modalImg.alt = card.dataset.title || '';
    modalText.innerHTML = card.dataset.text || '';
    skillModal.classList.add('open');
  });
});

function closeSkillModal() {
  if (skillModal) skillModal.classList.remove('open');
}

if (modalClose) {
  modalClose.addEventListener('click', closeSkillModal);
}

if (skillModal) {
  skillModal.addEventListener('click', (event) => {
    if (event.target === skillModal) closeSkillModal();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeSkillModal();
});

// Ouverture automatique de la zone GEII quand on arrive depuis un badge C.1, C.2, etc.
window.addEventListener('load', () => {
  const hash = window.location.hash;
  if (!hash) return;

  const target = document.querySelector(hash);
  if (!target) return;

  const panel = target.closest('.accordion-content');
  if (panel) {
    panel.classList.add('open');

    const id = panel.id;
    const button = document.querySelector(`[aria-controls="${id}"]`);
    if (button) button.setAttribute('aria-expanded', 'true');
    setPanelHeight(panel);
    refreshParents(panel);
  }

  setTimeout(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 250);
});

// Cartes des parties de projets : ouverture du texte et des photos dans une fenêtre
const projectModal = document.getElementById('projectModal');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalBody = document.getElementById('projectModalBody');
const projectModalClose = document.getElementById('projectModalClose');

function openProjectDetail(card) {
  if (!projectModal || !projectModalTitle || !projectModalBody) return;
  const detail = document.getElementById(card.dataset.detail || '');
  if (!detail) return;
  projectModalTitle.textContent = card.dataset.title || 'Détail du projet';
  projectModalBody.innerHTML = detail.innerHTML;
  projectModal.classList.add('open');
}

document.querySelectorAll('.project-section-card').forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    openProjectDetail(card);
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProjectDetail(card);
    }
  });
});

function closeProjectModal() {
  if (projectModal) projectModal.classList.remove('open');
}
if (projectModalClose) projectModalClose.addEventListener('click', closeProjectModal);
if (projectModal) {
  projectModal.addEventListener('click', (event) => {
    if (event.target === projectModal) closeProjectModal();
  });
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeProjectModal();
});
