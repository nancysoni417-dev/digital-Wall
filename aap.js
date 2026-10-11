/**
 * Harish-Chandra Digital Sanctum
 * Track 09: Dynamic Verified Tribute Wall & Memory Chambers
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }
  init() {
    try {
      if (!this.ctx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) this.ctx = new AudioClass();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    } catch (e) {}
  }
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
  playKnock() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      this.thud(t);
      this.thud(t + 0.16);
    } catch (e) {}
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
    if (!this.enabled) return;
    try {
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
    } catch (e) {}
  }
}

const CHAMBERS_DATA = {
  cambridge: {
    room: "Chamber I",
    title: "Kanpur & Cambridge Days",
    snippet: "From the banks of the Ganges to Dirac's blackboard at St John's College.",
    body: "Born in Kanpur in 1923, Harish-Chandra's brilliance was recognized early at the University of Allahabad by K. S. Krishnan. In 1945, he sailed for England to study under Paul Dirac at Cambridge, exploring relativistic wave equations.",
    period: "1923 – 1947",
    milestone: "Ph.D. under P.A.M. Dirac; Transition from physics to representation theory."
  },
  princeton: {
    room: "Chamber II",
    title: "The IAS Princeton Study",
    snippet: "Architecting the infinite-dimensional representation theory of semisimple Lie groups.",
    body: "Invited to the Institute for Advanced Study in Princeton by J. Robert Oppenheimer, Harish-Chandra spent three decades constructing the representation theory of reductive Lie groups and the Plancherel formula.",
    period: "1950 – 1983",
    milestone: "Discrete series characters, Plancherel Formula, Cole Prize (AMS), F.R.S."
  },
  philosophy: {
    room: "Chamber III",
    title: "The Painter & Philosopher",
    snippet: "Reflecting on truth, silence, fine lines, and the music of Beethoven.",
    body: "Beyond equations, Harish-Chandra was a painter and lover of Beethoven. His notebooks were filled with sketches and philosophical reflections from Indian epics.",
    period: "Personal Legacy",
    milestone: "Landscape watercolors, philosophical letters with Dirac and Weil."
  }
};

// Starter Tributes with Verified Credentials
const INITIAL_TRIBUTES = [
  {
    id: "init-1",
    authorName: "Aman Verma",
    enrollmentId: "CSJMU2024-MTH042",
    authorRole: "M.Sc. Mathematics (Sem II)",
    authorAffiliation: "Chhatrapati Shahu Ji Maharaj University, Kanpur",
    category: "student",
    message: "Harish-Chandra sir showed every student in Kanpur and Allahabad that deepest universal truths can be uncovered right with pen, paper, and uncompromised dedication.",
    hasDiya: true,
    homageCount: 38,
    dateString: "Oct 2026"
  },
  {
    id: "init-2",
    authorName: "Dr. Arvind S. Deshmukh",
    enrollmentId: "TIFR-FAC-881",
    authorRole: "Professor of Pure Mathematics",
    authorAffiliation: "School of Mathematics, TIFR Mumbai",
    category: "faculty",
    message: "His papers read like ancient cathedrals—every pillar and arch placed with unyielding logical precision. Studying his Plancherel formula forever shaped our department's curriculum.",
    hasDiya: true,
    homageCount: 47,
    dateString: "Oct 2026"
  },
  {
    id: "init-3",
    authorName: "Elena Rostova",
    enrollmentId: "ENS-PARIS-2026",
    authorRole: "Doctoral Fellow in Harmonic Analysis",
    authorAffiliation: "École Normale Supérieure, Paris",
    category: "global-scholar",
    message: "Harish-Chandra proved that infinite dimensions are not chaotic voids, but structured harmonies waiting for the disciplined mind to uncover their characters.",
    hasDiya: true,
    homageCount: 29,
    dateString: "Sep 2026"
  },
  {
    id: "init-4",
    authorName: "Rohit K. Mishra",
    enrollmentId: "ALUM-AU-99",
    authorRole: "Mathematics Educator",
    authorAffiliation: "Prayagraj, Uttar Pradesh",
    category: "reflection",
    message: "Remembering him in Allahabad where his legacy was born. An epitome of simple living and infinite thinking.",
    hasDiya: false,
    homageCount: 18,
    dateString: "Aug 2026"
  }
];

class SanctumWallApp {
  constructor() {
    this.audio = new SoundEngine();
    this.tributes = [];
    this.activeFilter = 'all';

    this.cacheDom();
    this.setupEventListeners();
    this.loadData();
    this.updateFormFieldsForRole(); // Initialize dynamic labels
  }

  cacheDom() {
    this.audioBtn = document.getElementById('audio-toggle-btn');
    this.audioIcon = document.getElementById('audio-icon');
    this.audioLabel = document.getElementById('audio-label');
    this.audioDot = document.querySelector('.audio-dot');

    this.doors = document.querySelectorAll('.door-wrapper');
    this.chamberModal = document.getElementById('chamber-modal');
    this.chamberContent = document.getElementById('chamber-modal-content');
    this.closeChamberBtn = document.getElementById('close-chamber-modal');

    this.tributesGrid = document.getElementById('tributes-grid');
    this.filterChips = document.querySelectorAll('.filter-chip');

    this.openTributeBtn = document.getElementById('open-tribute-modal');
    this.tributeModal = document.getElementById('tribute-modal');
    this.closeTributeBtn = document.getElementById('close-tribute-modal');

    this.form = document.getElementById('tribute-form');
    this.categorySelect = document.getElementById('tribute-category');
    this.nameInput = document.getElementById('author-name');
    this.idInput = document.getElementById('id-number');
    this.affiliationInput = document.getElementById('author-affiliation');
    this.roleInput = document.getElementById('author-role');
    this.messageInput = document.getElementById('tribute-message');
    this.charCounter = document.getElementById('char-counter');
    this.diyaToggle = document.getElementById('diya-toggle');
    this.toastContainer = document.getElementById('toast-container');

    // Dynamic field labels
    this.lblName = document.getElementById('lbl-name');
    this.lblId = document.getElementById('lbl-id-number');
    this.lblDept = document.getElementById('lbl-dept');
    this.groupId = document.getElementById('group-id-number');
  }

  setupEventListeners() {
    // Audio Toggle
    if (this.audioBtn) {
      this.audioBtn.addEventListener('click', () => {
        const on = this.audio.toggle();
        this.audioIcon.className = on ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        this.audioLabel.textContent = on ? 'AUDIO: ON' : 'AUDIO: MUTED';
        if (this.audioDot) this.audioDot.style.background = on ? 'var(--antique-gold)' : '#64748B';
        this.showToast(on ? "FX Audio activated" : "Audio muted");
      });
    }

    // Door Knocking & Revealing
    this.doors.forEach(door => {
      const openChamber = () => {
        const doorLeaf = door.querySelector('.door-leaf');
        const knocker = door.querySelector('.knocker-ring');
        const chamberId = door.getAttribute('data-door') || 'cambridge';

        this.audio.playKnock();

        if (knocker) {
          knocker.classList.add('knocker-tapping');
          setTimeout(() => knocker.classList.remove('knocker-tapping'), 400);
        }

        if (doorLeaf) {
          setTimeout(() => doorLeaf.classList.add('door-open'), 180);
        }

        setTimeout(() => {
          this.audio.playChime();
          this.openChamberModal(chamberId);
          if (doorLeaf) doorLeaf.classList.remove('door-open');
        }, 650);
      };

      door.addEventListener('click', openChamber);
      door.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openChamber();
        }
      });
    });

    if (this.closeChamberBtn) {
      this.closeChamberBtn.addEventListener('click', () => this.closeChamberModal());
    }
    if (this.chamberModal) {
      this.chamberModal.addEventListener('click', (e) => {
        if (e.target === this.chamberModal) this.closeChamberModal();
      });
    }

    // Modal Opening
    if (this.openTributeBtn) {
      this.openTributeBtn.addEventListener('click', () => {
        this.tributeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }
    if (this.closeTributeBtn) {
      this.closeTributeBtn.addEventListener('click', () => this.closeTributeModal());
    }
    if (this.tributeModal) {
      this.tributeModal.addEventListener('click', (e) => {
        if (e.target === this.tributeModal) this.closeTributeModal();
      });
    }

    // Filter Chips
    this.filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeFilter = chip.getAttribute('data-filter') || 'all';
        this.renderTributes();
      });
    });

    // Dynamic Form Role Adaptation
    if (this.categorySelect) {
      this.categorySelect.addEventListener('change', () => this.updateFormFieldsForRole());
    }

    // Char counter
    if (this.messageInput && this.charCounter) {
      this.messageInput.addEventListener('input', () => {
        this.charCounter.textContent = `${this.messageInput.value.length} / 600`;
      });
    }

    // Submit handler
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleTributeSubmit(e));
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeChamberModal();
        this.closeTributeModal();
      }
    });
  }

  // Dynamic field labels based on chosen category
  updateFormFieldsForRole() {
    const role = this.categorySelect.value;
    if (role === 'student') {
      this.lblName.innerHTML = `Student Full Name (As per ID Card) <span class="required">*</span>`;
      this.lblId.innerHTML = `Enrollment / Roll Number <span class="required">*</span>`;
      this.nameInput.placeholder = "e.g. Priyanshu Sharma";
      this.idInput.placeholder = "e.g. EN2024MATH108";
      this.lblDept.innerHTML = `Degree & Semester / Department <span class="required">*</span>`;
      this.roleInput.placeholder = "e.g. M.Sc. Mathematics (Sem 3)";
      this.groupId.style.display = 'flex';
    } else if (role === 'faculty') {
      this.lblName.innerHTML = `Faculty / Professor Name <span class="required">*</span>`;
      this.lblId.innerHTML = `Employee / Faculty ID <span class="required">*</span>`;
      this.nameInput.placeholder = "e.g. Dr. K. Ramanathan";
      this.idInput.placeholder = "e.g. FAC-MATH-092";
      this.lblDept.innerHTML = `Academic Designation & Dept <span class="required">*</span>`;
      this.roleInput.placeholder = "e.g. Associate Professor in Algebra";
      this.groupId.style.display = 'flex';
    } else if (role === 'global-scholar') {
      this.lblName.innerHTML = `Scholar / Researcher Name <span class="required">*</span>`;
      this.lblId.innerHTML = `Scholar ID / Fellowship ID <span class="required">*</span>`;
      this.nameInput.placeholder = "e.g. Elena Rostova";
      this.idInput.placeholder = "e.g. ENS-SCH-2026";
      this.lblDept.innerHTML = `Research Specialization <span class="required">*</span>`;
      this.roleInput.placeholder = "e.g. Postdoctoral Fellow in Lie Groups";
      this.groupId.style.display = 'flex';
    } else {
      // Personal Reflection
      this.lblName.innerHTML = `Your Full Name <span class="required">*</span>`;
      this.lblId.innerHTML = `Identification / City Reference`;
      this.nameInput.placeholder = "e.g. Rajesh Kumar";
      this.idInput.placeholder = "e.g. Prayagraj / Kanpur";
      this.lblDept.innerHTML = `Profession / Relation <span class="required">*</span>`;
      this.roleInput.placeholder = "e.g. Mathematics Enthusiast";
      this.groupId.style.display = 'flex';
    }
  }

  openChamberModal(id) {
    const data = CHAMBERS_DATA[id] || CHAMBERS_DATA.cambridge;
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

  closeTributeModal() {
    this.tributeModal.classList.remove('active');
    document.body.style.overflow = '';
    this.form.reset();
    this.charCounter.textContent = '0 / 600';
    document.querySelectorAll('.field-error').forEach(e => e.classList.remove('visible'));
    this.updateFormFieldsForRole();
  }

  loadData() {
    try {
      const stored = localStorage.getItem('hc_dynamic_tributes_2026');
      if (stored && JSON.parse(stored).length > 0) {
        this.tributes = JSON.parse(stored);
      } else {
        this.tributes = [...INITIAL_TRIBUTES];
        this.saveData();
      }
    } catch (e) {
      this.tributes = [...INITIAL_TRIBUTES];
    }
    this.renderTributes();
  }

  saveData() {
    try {
      localStorage.setItem('hc_dynamic_tributes_2026', JSON.stringify(this.tributes));
    } catch (e) {}
  }

  renderTributes() {
    if (!this.tributesGrid) return;
    this.tributesGrid.innerHTML = '';

    const list = this.tributes.filter(t => this.activeFilter === 'all' || t.category === this.activeFilter);

    if (list.length === 0) {
      this.tributesGrid.innerHTML = `
        <div class="no-tributes-state">
          <i class="fa-solid fa-feather-pointed"></i>
          <p>No verified tributes in this category yet. Be the first to register and inscribe!</p>
        </div>
      `;
      return;
    }

    const badgeMap = {
      'student': { text: 'Verified Student', class: 'tag-student', icon: 'fa-graduation-cap' },
      'faculty': { text: 'Faculty / Fellow', class: 'tag-faculty', icon: 'fa-building-columns' },
      'global-scholar': { text: 'Global Scholar', class: 'tag-global-scholar', icon: 'fa-globe' },
      'reflection': { text: 'Personal Homage', class: 'tag-reflection', icon: 'fa-heart' }
    };

    list.forEach(item => {
      const card = document.createElement('article');
      card.className = 'tribute-card';

      const roleBadge = badgeMap[item.category] || badgeMap.student;
      const diyaBadge = item.hasDiya ? `
        <div class="diya-badge" title="Sacred Diya Lit">
          <div class="flame-icon"></div>
          <span>Akhand Diya</span>
        </div>
      ` : '';

      const idVerifiedBadge = item.enrollmentId ? `
        <span class="verified-id-pill" title="Verified ID / Enrollment">
          <i class="fa-solid fa-circle-check"></i> ${this.escape(item.enrollmentId)}
        </span>
      ` : '';

      card.innerHTML = `
        <div class="card-top">
          <div class="badges-row">
            <span class="category-tag ${roleBadge.class}">
              <i class="fa-solid ${roleBadge.icon}"></i> ${roleBadge.text}
            </span>
            ${idVerifiedBadge}
          </div>
          ${diyaBadge}
        </div>

        <p class="tribute-text">"${this.escape(item.message)}"</p>

        <div class="card-author-meta">
          <h4 class="author-name">${this.escape(item.authorName)}</h4>
          <p class="author-role-inst">
            <strong>${this.escape(item.authorRole)}</strong><br>
            <span>${this.escape(item.authorAffiliation)}</span>
          </p>
        </div>

        <div class="card-footer">
          <span class="card-date">${item.dateString || 'Oct 2026'}</span>
          <button class="flower-homage-btn" data-id="${item.id}" aria-label="Offer Pranam">
            <i class="fa-solid fa-spa"></i>
            <span class="count">${item.homageCount || 0}</span> Pranam
          </button>
        </div>
      `;

      // Flower Homage counter
      const homageBtn = card.querySelector('.flower-homage-btn');
      homageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        item.homageCount = (item.homageCount || 0) + 1;
        card.querySelector('.count').textContent = item.homageCount;
        this.saveData();
        this.showToast("Flower homage offered (सादर प्रणाम)");
      });

      this.tributesGrid.appendChild(card);
    });
  }

  handleTributeSubmit(e) {
    e.preventDefault();
    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));

    const name = this.nameInput.value.trim();
    const idVal = this.idInput.value.trim();
    const inst = this.affiliationInput.value.trim();
    const role = this.roleInput.value.trim();
    const category = this.categorySelect.value;
    const msg = this.messageInput.value.trim();
    const diya = this.diyaToggle.checked;

    let hasError = false;

    if (!name) {
      document.getElementById('name-error').classList.add('visible');
      hasError = true;
    }
    if (!idVal) {
      document.getElementById('id-error').classList.add('visible');
      hasError = true;
    }
    if (!inst) {
      document.getElementById('affiliation-error').classList.add('visible');
      hasError = true;
    }
    if (!role) {
      document.getElementById('role-error').classList.add('visible');
      hasError = true;
    }
    if (!msg || msg.length < 15) {
      document.getElementById('message-error').classList.add('visible');
      hasError = true;
    }

    if (hasError) return;

    // Create verified card object
    const newEntry = {
      id: "trib-" + Date.now(),
      authorName: name,
      enrollmentId: idVal,
      authorRole: role,
      authorAffiliation: inst,
      category: category,
      message: msg,
      hasDiya: diya,
      homageCount: 1,
      dateString: "Just now"
    };

    // Prepend to display at top
    this.tributes.unshift(newEntry);
    this.saveData();
    this.closeTributeModal();

    // Auto set filter to 'all' so new card is immediately visible
    this.activeFilter = 'all';
    this.filterChips.forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-filter') === 'all');
    });

    this.renderTributes();
    this.showToast("Your verified inscription is live on the Sanctum Wall! ✦");

    // Smooth scroll to the Tribute Wall
    const wallSec = document.getElementById('tribute-wall');
    if (wallSec) wallSec.scrollIntoView({ behavior: 'smooth' });
  }

  escape(str) {
    return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  showToast(msg) {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${msg}</span>`;
    this.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }
}

// Auto start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new SanctumWallApp());
} else {
  new SanctumWallApp();
}