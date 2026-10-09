/**
 * Harish-Chandra Digital Legacy Challenge 2026
 * Track 09: Digital Tribute Wall & Memory Chambers
 * Architecture: Clean Vanilla ES6+ & Procedural Web Audio API
 */

// ==========================================================================
// 1. Procedural Web Audio API Engine (No external sound files required)
// ==========================================================================
class WoodSoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(forceState = null) {
    if (forceState !== null) {
      this.soundEnabled = forceState;
    } else {
      this.soundEnabled = !this.soundEnabled;
    }
    return this.soundEnabled;
  }

  // Realistic double door knock synthesized using envelope filters & resonant nodes
  playDoorDoubleKnock() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    this.triggerWoodThud(now);
    this.triggerWoodThud(now + 0.16); // Double knock offset
  }

  triggerWoodThud(startTime) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Wood impact frequency character
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, startTime);
    osc.frequency.exponentialRampToValueAtTime(42, startTime + 0.12);

    // Resonant bandpass to mimic thick hollow oak wood panel
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, startTime);
    filter.frequency.exponentialRampToValueAtTime(100, startTime + 0.12);

    gain.gain.setValueAtTime(0.85, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.15);
  }

  // Resonant bronze bell chime for memorial modal opening
  playChamberChime() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [440, 659.25, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.18 / (idx + 1), now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + 1.4);
    });
  }
}

// ==========================================================================
// 2. Curated Chamber Content Data
// ==========================================================================
const CHAMBER_DATA = {
  cambridge: {
    roomNumber: "Chamber I",
    title: "Kanpur & Cambridge Days",
    snippet: "From the banks of the Ganges to Dirac's blackboard at St John's College.",
    body: `Born in Kanpur in 1923, Harish-Chandra's meteoric brilliance was recognized early at the University of Allahabad by eminent physicist K. S. Krishnan. In 1945, he sailed for England to pursue his Ph.D. at Cambridge under the towering theoretical physicist Paul Dirac. While studying relativistic wave equations, Dirac noticed Harish-Chandra's unmatched instinct for geometric precision, remarking that his student possessed an unusually deep mathematical soul that transcended physical approximation alone.`,
    period: "1923 – 1947",
    milestone: "Ph.D. under P.A.M. Dirac; Transition from theoretical physics to pure representation theory."
  },
  princeton: {
    roomNumber: "Chamber II",
    title: "The IAS Princeton Study",
    snippet: "Architecting the infinite-dimensional representation theory of semisimple Lie groups.",
    body: `Invited to the Institute for Advanced Study in Princeton by J. Robert Oppenheimer, Harish-Chandra embarked on a solitary mathematical odyssey. Over three relentless decades, he created almost single-handedly the infinite-dimensional representation theory of reductive Lie groups. His discovery of discrete series representations and the majestic Plancherel formula for semisimple Lie groups provided the indispensable bedrock upon which the modern Langlands Program now stands.`,
    period: "1950 – 1983",
    milestone: "Discrete series characters, Plancherel Formula, Cole Prize (AMS), Fellow of the Royal Society."
  },
  philosophy: {
    roomNumber: "Chamber III",
    title: "The Painter & Philosopher",
    snippet: "Reflecting on truth, silence, fine lines, and the music of Beethoven.",
    body: `Outside mathematics, Harish-Chandra was a disciplined painter and an ardent devotee of classical music, particularly Beethoven. His notebooks frequently mingled mathematical calculations with thoughtful sketches and reflections from the Bhagavad Gita and French literature. Colleagues at Princeton recalled a scholar of ascetic grace and quiet warmth, who viewed every mathematical theorem as an unalterable work of timeless art carved out of eternity.`,
    period: "Personal Legacy",
    milestone: "Landscape watercolors, philosophical correspondences with Dirac and Weil, reflections on aesthetic purity."
  }
};

// ==========================================================================
// 3. Initial Curated Tributes Dataset
// ==========================================================================
const DEFAULT_TRIBUTES = [
  {
    id: "trib-01",
    authorName: "Prof. Arvind S. Deshmukh",
    authorRole: "Professor of Pure Mathematics",
    authorAffiliation: "School of Mathematics, TIFR Mumbai",
    category: "faculty",
    message: "His papers read like ancient cathedrals—every pillar and arch placed with unyielding logical precision. Studying his Plancherel formula as a young doctoral student forever shaped my reverence for mathematical elegance.",
    hasDiya: true,
    homageCount: 42,
    dateString: "Oct 2026"
  },
  {
    id: "trib-02",
    authorName: "Elena Rostova",
    authorRole: "Doctoral Researcher in Harmonic Analysis",
    authorAffiliation: "École Normale Supérieure, Paris",
    category: "global-scholar",
    message: "Harish-Chandra taught the mathematical world that infinite dimensions are not chaotic voids, but structured harmonies waiting for the disciplined mind to uncover their characters.",
    hasDiya: true,
    homageCount: 31,
    dateString: "Sep 2026"
  },
  {
    id: "trib-03",
    authorName: "Kavya N. Rao",
    authorRole: "M.Sc. Mathematics Scholar",
    authorAffiliation: "University of Allahabad Alumni",
    category: "student",
    message: "Walking through the historic halls where he studied in Allahabad fills us with immense pride. He showed that devotion to fundamental truth from India can sculpt global mathematical frontiers.",
    hasDiya: false,
    homageCount: 19,
    dateString: "Oct 2026"
  },
  {
    id: "trib-04",
    authorName: "Marcus Sterling",
    authorRole: "Visiting Fellow",
    authorAffiliation: "Institute for Advanced Study, Princeton",
    category: "reflection",
    message: "On crisp autumn afternoons in Princeton, passing his former office is a reminder of absolute focus. He worked with the devotion of a monk and the imagination of a Renaissance master.",
    hasDiya: true,
    homageCount: 57,
    dateString: "Aug 2026"
  }
];

// ==========================================================================
// 4. Main Application Controller
// ==========================================================================
class TributeApp {
  constructor() {
    this.soundEngine = new WoodSoundSynthesizer();
    this.tributes = [];
    this.currentFilter = 'all';

    this.cacheDom();
    this.bindEvents();
    this.loadTributes();
  }

  cacheDom() {
    // Audio
    this.audioToggleBtn = document.getElementById('audio-toggle-btn');
    this.audioIcon = document.getElementById('audio-icon');
    this.audioLabel = document.getElementById('audio-label');

    // Doors & Chambers
    this.doorWrappers = document.querySelectorAll('.door-wrapper');
    this.chamberModal = document.getElementById('chamber-modal');
    this.chamberContent = document.getElementById('chamber-modal-content');
    this.closeChamberBtn = document.getElementById('close-chamber-modal');

    // Tribute Wall
    this.tributesGrid = document.getElementById('tributes-grid');
    this.filterChips = document.querySelectorAll('.filter-chip');
    this.openTributeModalBtn = document.getElementById('open-tribute-modal');
    this.tributeModal = document.getElementById('tribute-modal');
    this.closeTributeBtn = document.getElementById('close-tribute-modal');

    // Submission Form
    this.tributeForm = document.getElementById('tribute-form');
    this.authorNameInput = document.getElementById('author-name');
    this.authorRoleInput = document.getElementById('author-role');
    this.authorAffiliationInput = document.getElementById('author-affiliation');
    this.categorySelect = document.getElementById('tribute-category');
    this.tributeMessageInput = document.getElementById('tribute-message');
    this.charCounter = document.getElementById('char-counter');
    this.diyaToggle = document.getElementById('diya-toggle');
    this.toastContainer = document.getElementById('toast-container');
  }

  bindEvents() {
    // Audio Toggle
    this.audioToggleBtn.addEventListener('click', () => this.handleAudioToggle());

    // Door Knock & Chamber Interaction
    this.doorWrappers.forEach(door => {
      door.addEventListener('click', () => this.handleDoorInteraction(door));
      door.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleDoorInteraction(door);
        }
      });
    });

    this.closeChamberBtn.addEventListener('click', () => this.closeChamberModal());
    this.chamberModal.addEventListener('click', (e) => {
      if (e.target === this.chamberModal) this.closeChamberModal();
    });

    // Tribute Modals & Actions
    this.openTributeModalBtn.addEventListener('click', () => this.openTributeModal());
    this.closeTributeBtn.addEventListener('click', () => this.closeTributeModal());
    this.tributeModal.addEventListener('click', (e) => {
      if (e.target === this.tributeModal) this.closeTributeModal();
    });

    // Filters
    this.filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentFilter = chip.dataset.filter;
        this.renderTributes();
      });
    });

    // Character Counter
    this.tributeMessageInput.addEventListener('input', () => {
      const len = this.tributeMessageInput.value.length;
      this.charCounter.textContent = `${len} / 600`;
    });

    // Form Submission
    this.tributeForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

    // Global ESC key listener for modal closing
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeChamberModal();
        this.closeTributeModal();
      }
    });
  }

  // --- Audio Handler ---
  handleAudioToggle() {
    const isEnabled = this.soundEngine.toggleSound();
    if (isEnabled) {
      this.audioIcon.className = 'fa-solid fa-volume-high';
      this.audioLabel.textContent = 'FX Audio: ON';
      this.audioToggleBtn.style.borderColor = 'var(--antique-gold)';
      this.showToast("Sanctum sound effects enabled");
    } else {
      this.audioIcon.className = 'fa-solid fa-volume-xmark';
      this.audioLabel.textContent = 'FX Audio: MUTED';
      this.audioToggleBtn.style.borderColor = 'var(--slate-muted)';
      this.showToast("Sound muted");
    }
  }

  // --- Door Knock & Reveal Flow ---
  handleDoorInteraction(doorEl) {
    const doorId = doorEl.dataset.door;
    const doorLeaf = doorEl.querySelector('.door-leaf');
    const knockerRing = doorEl.querySelector('.knocker-ring');

    // 1. Trigger realistic audio knock
    this.soundEngine.playDoorDoubleKnock();

    // 2. Play knocker ring tapping animation
    knockerRing.classList.add('knocker-tapping');
    setTimeout(() => knockerRing.classList.remove('knocker-tapping'), 500);

    // 3. Smooth 3D Door Swing
    setTimeout(() => {
      doorLeaf.classList.add('door-open');
    }, 250);

    // 4. Reveal Chamber Modal
    setTimeout(() => {
      this.soundEngine.playChamberChime();
      this.openChamberModal(doorId);
      doorLeaf.classList.remove('door-open'); // Reset for next visit
    }, 750);
  }

  openChamberModal(doorKey) {
    const data = CHAMBER_DATA[doorKey];
    if (!data) return;

    this.chamberContent.innerHTML = `
      <span class="room-badge">${data.roomNumber}</span>
      <h2>${data.title}</h2>
      <blockquote class="room-snippet">"${data.snippet}"</blockquote>
      <div class="room-body">${data.body}</div>
      <div class="chamber-meta-box">
        <div class="meta-item">
          <h4>Historical Epoch</h4>
          <p>${data.period}</p>
        </div>
        <div class="meta-item">
          <h4>Key Archival Resonance</h4>
          <p>${data.milestone}</p>
        </div>
      </div>
    `;

    this.chamberModal.classList.add('active');
    this.chamberModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeChamberModal() {
    this.chamberModal.classList.remove('active');
    this.chamberModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // --- Tribute Modal Handlers ---
  openTributeModal() {
    this.tributeModal.classList.add('active');
    this.tributeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    this.authorNameInput.focus();
  }

  closeTributeModal() {
    this.tributeModal.classList.remove('active');
    this.tributeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.tributeForm.reset();
    this.charCounter.textContent = '0 / 600';
    this.clearErrors();
  }

  clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
  }

  // --- LocalStorage & Tributes Loading ---
  loadTributes() {
    try {
      const stored = localStorage.getItem('hc_legacy_tributes_2026');
      if (stored) {
        this.tributes = JSON.parse(stored);
      } else {
        this.tributes = [...DEFAULT_TRIBUTES];
        this.saveTributesToStorage();
      }
    } catch (e) {
      this.tributes = [...DEFAULT_TRIBUTES];
    }
    this.renderTributes();
  }

  saveTributesToStorage() {
    try {
      localStorage.setItem('hc_legacy_tributes_2026', JSON.stringify(this.tributes));
    } catch (e) {
      console.warn("Storage full or unavailable");
    }
  }

  // --- Render Tributes Grid ---
  renderTributes() {
    this.tributesGrid.innerHTML = '';

    const filtered = this.tributes.filter(t => {
      if (this.currentFilter === 'all') return true;
      return t.category === this.currentFilter;
    });

    if (filtered.length === 0) {
      this.tributesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--slate-muted);">
          <i class="fa-solid fa-feather" style="font-size: 2rem; color: var(--antique-gold); margin-bottom: 0.5rem; display:block;"></i>
          No tributes recorded yet under this category. Be the first to inscribe one.
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('article');
      card.className = 'tribute-card';

      // Category display names
      const catLabels = {
        'student': 'Student',
        'faculty': 'Faculty',
        'global-scholar': 'Global Scholar',
        'reflection': 'Personal Reflection'
      };

      const diyaHtml = item.hasDiya ? `
        <div class="diya-badge" title="Eternal Flame Offered">
          <div class="flame-icon"></div>
          <span>Diya</span>
        </div>
      ` : '';

      card.innerHTML = `
        <div class="card-top">
          <span class="category-tag tag-${item.category}">${catLabels[item.category] || 'Homage'}</span>
          ${diyaHtml}
        </div>
        <p class="tribute-text">"${this.escapeHtml(item.message)}"</p>
        <div class="card-author-meta">
          <h4 class="author-name">${this.escapeHtml(item.authorName)}</h4>
          <p class="author-role-inst">${this.escapeHtml(item.authorRole)} • ${this.escapeHtml(item.authorAffiliation)}</p>
        </div>
        <div class="card-footer">
          <span>${item.dateString || 'Legacy 2026'}</span>
          <button class="flower-homage-btn" data-id="${item.id}" aria-label="Offer Flower Homage">
            <i class="fa-solid fa-spa"></i>
            <span class="count">${item.homageCount || 0}</span> Pranam
          </button>
        </div>
      `;

      // Flower Homage button event
      const homageBtn = card.querySelector('.flower-homage-btn');
      homageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.incrementHomage(item.id, homageBtn);
      });

      this.tributesGrid.appendChild(card);
    });
  }

  incrementHomage(id, buttonEl) {
    const item = this.tributes.find(t => t.id === id);
    if (item) {
      item.homageCount = (item.homageCount || 0) + 1;
      const countSpan = buttonEl.querySelector('.count');
      if (countSpan) countSpan.textContent = item.homageCount;
      this.saveTributesToStorage();
      this.showToast("Flower tribute offered (सादर प्रणाम)");
    }
  }

  // --- Form Validation & Submission ---
  handleFormSubmit(e) {
    e.preventDefault();
    this.clearErrors();

    const name = this.authorNameInput.value.trim();
    const role = this.authorRoleInput.value.trim();
    const affiliation = this.authorAffiliationInput.value.trim();
    const category = this.categorySelect.value;
    const message = this.tributeMessageInput.value.trim();
    const hasDiya = this.diyaToggle.checked;

    let hasError = false;

    if (!name) {
      document.getElementById('name-error').classList.add('visible');
      hasError = true;
    }
    if (!role) {
      document.getElementById('role-error').classList.add('visible');
      hasError = true;
    }
    if (!affiliation) {
      document.getElementById('affiliation-error').classList.add('visible');
      hasError = true;
    }
    if (!message || message.length < 15) {
      document.getElementById('message-error').classList.add('visible');
      hasError = true;
    }

    if (hasError) return;

    // Create tribute payload
    const newTribute = {
      id: "trib-" + Date.now(),
      authorName: name,
      authorRole: role,
      authorAffiliation: affiliation,
      category: category,
      message: message,
      hasDiya: hasDiya,
      homageCount: 1,
      dateString: "Oct 2026"
    };

    // Prepend new tribute so it appears first
    this.tributes.unshift(newTribute);
    this.saveTributesToStorage();
    this.closeTributeModal();
    this.renderTributes();
    this.showToast("Your tribute has been inscribed into the Sanctum Wall ✦");
  }

  // --- Helpers ---
  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-bell"></i> <span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 4000);
  }
}

// ==========================================================================
// 5. Initialize on DOM Ready
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  window.appInstance = new TributeApp();
});