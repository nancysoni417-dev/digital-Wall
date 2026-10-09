/**
 * Harish-Chandra Digital Sanctum
 * Track 09: Memory Chambers & Tribute Wall
 */

// Procedural Audio Synthesizer (No external sound files required)
class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle(state = null) {
    this.soundEnabled = state !== null ? state : !this.soundEnabled;
    return this.soundEnabled;
  }

  // Realistic Double Door Knock
  playKnock() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    this.thud(t);
    this.thud(t + 0.16);
  }

  thud(startTime) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, startTime);
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.12);

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

  playChime() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [440, 659.25, 880].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.05);

      gain.gain.setValueAtTime(0.18 / (i + 1), t + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2 + i * 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.05);
      osc.stop(t + 1.4);
    });
  }
}

// Chamber Exhibit Data
const CHAMBERS = {
  cambridge: {
    room: "Chamber I",
    title: "Kanpur & Cambridge Days",
    snippet: "From the banks of the Ganges to Dirac's blackboard at St John's College.",
    body: "Born in Kanpur in 1923, Harish-Chandra's meteoric brilliance was recognized early at the University of Allahabad by eminent physicist K. S. Krishnan. In 1945, he sailed for England to pursue his Ph.D. at Cambridge under theoretical physicist Paul Dirac. While studying relativistic wave equations, Dirac noted his unusually deep mathematical soul that sought absolute logical harmony.",
    period: "1923 – 1947",
    milestone: "Ph.D. under P.A.M. Dirac; Transition from physics to representation theory."
  },
  princeton: {
    room: "Chamber II",
    title: "The IAS Princeton Study",
    snippet: "Architecting the infinite-dimensional representation theory of semisimple Lie groups.",
    body: "Invited to the Institute for Advanced Study in Princeton by J. Robert Oppenheimer, Harish-Chandra embarked on a solitary mathematical odyssey. Over three decades, he created almost single-handedly the infinite-dimensional representation theory of reductive Lie groups and the Plancherel formula, the foundation of the modern Langlands Program.",
    period: "1950 – 1983",
    milestone: "Discrete series characters, Plancherel Formula, Cole Prize (AMS), F.R.S."
  },
  philosophy: {
    room: "Chamber III",
    title: "The Painter & Philosopher",
    snippet: "Reflecting on truth, silence, fine lines, and the music of Beethoven.",
    body: "Outside mathematics, Harish-Chandra was a disciplined painter and an ardent devotee of classical music, particularly Beethoven. His notebooks mingled mathematical formulas with sketches and reflections from the Gita, viewing theorems as unalterable works of timeless art carved out of eternity.",
    period: "Personal Legacy",
    milestone: "Landscape watercolors, philosophical correspondences with Dirac and Weil."
  }
};

const DEFAULT_TRIBUTES = [
  {
    id: "t-1",
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
    id: "t-2",
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
    id: "t-3",
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
    id: "t-4",
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

class App {
  constructor() {
    this.sound = new SoundSynthesizer();
    this.tributes = [];
    this.filter = 'all';

    this.initDOM();
    this.bindEvents();
    this.loadData();
  }

  initDOM() {
    this.audioBtn = document.getElementById('audio-toggle-btn');
    this.audioIcon = document.getElementById('audio-icon');
    this.audioLabel = document.getElementById('audio-label');
    this.audioDot = document.querySelector('.audio-dot');

    this.doors = document.querySelectorAll('.door-wrapper');
    this.chamberModal = document.getElementById('chamber-modal');
    this.chamberContent = document.getElementById('chamber-modal-content');
    this.closeChamber = document.getElementById('close-chamber-modal');

    this.tributesGrid = document.getElementById('tributes-grid');
    this.filterChips = document.querySelectorAll('.filter-chip');
    
    this.openTributeBtn = document.getElementById('open-tribute-modal');
    this.tributeModal = document.getElementById('tribute-modal');
    this.closeTribute = document.getElementById('close-tribute-modal');

    this.form = document.getElementById('tribute-form');
    this.charCounter = document.getElementById('char-counter');
    this.messageInput = document.getElementById('tribute-message');
    this.toastContainer = document.getElementById('toast-container');
  }

  bindEvents() {
    // Audio Toggle
    this.audioBtn.addEventListener('click', () => {
      const active = this.sound.toggle();
      this.audioIcon.className = active ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
      this.audioLabel.textContent = active ? 'AUDIO: ON' : 'AUDIO: MUTED';
      this.audioDot.style.background = active ? 'var(--antique-gold)' : '#64748B';
      this.toast(active ? "Audio effects active" : "Audio muted");
    });

    // Doors Knock
    this.doors.forEach(door => {
      const runKnock = () => {
        const id = door.dataset.door;
        const leaf = door.querySelector('.door-leaf');
        const knocker = door.querySelector('.knocker-ring');

        this.sound.playKnock();
        knocker.classList.add('knocker-tapping');
        setTimeout(() => knocker.classList.remove('knocker-tapping'), 400);

        setTimeout(() => leaf.classList.add('door-open'), 220);
        setTimeout(() => {
          this.sound.playChime();
          this.openChamber(id);
          leaf.classList.remove('door-open');
        }, 700);
      };

      door.addEventListener('click', runKnock);
      door.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          runKnock();
        }
      });
    });

    this.closeChamber.addEventListener('click', () => this.closeChamberModal());
    this.chamberModal.addEventListener('click', (e) => {
      if (e.target === this.chamberModal) this.closeChamberModal();
    });

    // Tributes
    this.openTributeBtn.addEventListener('click', () => {
      this.tributeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    this.closeTribute.addEventListener('click', () => this.closeFormModal());
    this.tributeModal.addEventListener('click', (e) => {
      if (e.target === this.tributeModal) this.closeFormModal();
    });

    this.filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.filter = chip.dataset.filter;
        this.renderTributes();
      });
    });

    this.messageInput.addEventListener('input', () => {
      this.charCounter.textContent = `${this.messageInput.value.length} / 600`;
    });

    this.form.addEventListener('submit', (e) => this.submitTribute(e));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeChamberModal();
        this.closeFormModal();
      }
    });
  }

  openChamber(id) {
    const data = CHAMBERS[id];
    if (!data) return;

    this.chamberContent.innerHTML = `
      <span class="room-badge">${data.room}</span>
      <h2>${data.title}</h2>
      <blockquote class="room-snippet">"${data.snippet}"</blockquote>
      <div class="room-body">${data.body}</div>
      <div class="chamber-meta-box">
        <div class="meta-item">
          <h4>Historical Epoch</h4>
          <p>${data.period}</p>
        </div>
        <div class="meta-item">
          <h4>Archival Resonance</h4>
          <p>${data.milestone}</p>
        </div>
      </div>
    `;

    this.chamberModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeChamberModal() {
    this.chamberModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeFormModal() {
    this.tributeModal.classList.remove('active');
    document.body.style.overflow = '';
    this.form.reset();
    this.charCounter.textContent = '0 / 600';
    document.querySelectorAll('.field-error').forEach(e => e.classList.remove('visible'));
  }

  loadData() {
    try {
      const stored = localStorage.getItem('hc_sanctum_tributes_2026');
      this.tributes = stored ? JSON.parse(stored) : [...DEFAULT_TRIBUTES];
      if (!stored) this.saveData();
    } catch (e) {
      this.tributes = [...DEFAULT_TRIBUTES];
    }
    this.renderTributes();
  }

  saveData() {
    try {
      localStorage.setItem('hc_sanctum_tributes_2026', JSON.stringify(this.tributes));
    } catch (e) {}
  }

  renderTributes() {
    this.tributesGrid.innerHTML = '';
    const filtered = this.tributes.filter(t => this.filter === 'all' || t.category === this.filter);

    if (filtered.length === 0) {
      this.tributesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--slate-muted);">
          No tributes recorded under this filter.
        </div>
      `;
      return;
    }

    const catLabels = {
      'student': 'Student',
      'faculty': 'Faculty',
      'global-scholar': 'Global Scholar',
      'reflection': 'Personal Reflection'
    };

    filtered.forEach(item => {
      const card = document.createElement('article');
      card.className = 'tribute-card';

      const diya = item.hasDiya ? `
        <div class="diya-badge">
          <div class="flame-icon"></div>
          <span>Diya</span>
        </div>
      ` : '';

      card.innerHTML = `
        <div class="card-top">
          <span class="category-tag tag-${item.category}">${catLabels[item.category] || 'Homage'}</span>
          ${diya}
        </div>
        <p class="tribute-text">"${this.escape(item.message)}"</p>
        <div class="card-author-meta">
          <h4 class="author-name">${this.escape(item.authorName)}</h4>
          <p class="author-role-inst">${this.escape(item.authorRole)} • ${this.escape(item.authorAffiliation)}</p>
        </div>
        <div class="card-footer">
          <span>${item.dateString || 'Oct 2026'}</span>
          <button class="flower-homage-btn" data-id="${item.id}">
            <i class="fa-solid fa-spa"></i>
            <span class="count">${item.homageCount || 0}</span> Pranam
          </button>
        </div>
      `;

      card.querySelector('.flower-homage-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        item.homageCount = (item.homageCount || 0) + 1;
        card.querySelector('.count').textContent = item.homageCount;
        this.saveData();
        this.toast("Homage offered (सादर प्रणाम)");
      });

      this.tributesGrid.appendChild(card);
    });
  }

  submitTribute(e) {
    e.preventDefault();
    const name = document.getElementById('author-name').value.trim();
    const role = document.getElementById('author-role').value.trim();
    const inst = document.getElementById('author-affiliation').value.trim();
    const cat = document.getElementById('tribute-category').value;
    const msg = document.getElementById('tribute-message').value.trim();
    const diya = document.getElementById('diya-toggle').checked;

    let valid = true;
    if (!name) { document.getElementById('name-error').classList.add('visible'); valid = false; }
    if (!role) { document.getElementById('role-error').classList.add('visible'); valid = false; }
    if (!inst) { document.getElementById('affiliation-error').classList.add('visible'); valid = false; }
    if (!msg || msg.length < 15) { document.getElementById('message-error').classList.add('visible'); valid = false; }

    if (!valid) return;

    this.tributes.unshift({
      id: "trib-" + Date.now(),
      authorName: name,
      authorRole: role,
      authorAffiliation: inst,
      category: cat,
      message: msg,
      hasDiya: diya,
      homageCount: 1,
      dateString: "Oct 2026"
    });

    this.saveData();
    this.closeFormModal();
    this.renderTributes();
    this.toast("Your tribute has been inscribed into the Sanctum Wall ✦");
  }

  escape(s) {
    return (s || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<i class="fa-solid fa-bell"></i> <span>${msg}</span>`;
    this.toastContainer.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }
}

document.addEventListener('DOMContentLoaded', () => new App());