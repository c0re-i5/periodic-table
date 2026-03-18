/**
 * Interactive Periodic Table — Application Logic
 * 
 * Features:
 *  - CSS Grid periodic table with accurate element positioning
 *  - Hover tooltips with element summary
 *  - Click-to-open detail panel with properties, Bohr model, fun facts
 *  - Real-time search (by name, symbol, or atomic number)
 *  - Temperature slider: shows phase at given temperature
 *  - Category legend filtering: click to highlight a category
 *  - Keyboard navigation: arrow keys, Escape to close
 */

(function () {
  'use strict';

  // ═══════════════════════ DOM References ═══════════════════════
  const periodicTableEl = document.getElementById('periodic-table');
  const lanthanideRowEl = document.getElementById('lanthanide-row-label');
  const actinideRowEl   = document.getElementById('actinide-row-label');
  const legendEl        = document.getElementById('legend');
  const searchInput     = document.getElementById('search-input');
  const tempSlider      = document.getElementById('temp-slider');
  const tempDisplay     = document.getElementById('temp-display');
  const detailPanel     = document.getElementById('detail-panel');
  const detailContent   = document.getElementById('detail-content');
  const detailBackdrop  = document.getElementById('detail-backdrop');
  const detailClose     = document.getElementById('detail-close');
  const vizContainer    = document.getElementById('viz-container');

  // ═══════════════════════ State ═══════════════════════
  let activeElement = null;
  let activeCategory = null;
  let activeViz = 'bohr2d';
  let cellMap = new Map(); // number -> DOM element
  let tooltipEl = null;
  let bohr3dAnimationId = null;

  // ═══════════════════════ Initialize ═══════════════════════
  function init() {
    createTooltip();
    renderLegend();
    renderTable();
    bindEvents();
  }

  // ═══════════════════════ Tooltip ═══════════════════════
  function createTooltip() {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'element-tooltip';
    tooltipEl.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltipEl);
  }

  function showTooltip(el, element) {
    const massText = typeof element.mass === 'string' ? element.mass : element.mass.toFixed(element.mass < 10 ? 4 : 3);
    tooltipEl.innerHTML = `
      <div class="tooltip-header">
        <span class="tooltip-symbol" style="color: ${CATEGORIES[element.category].color}">${element.symbol}</span>
        <span class="tooltip-name">${element.name}</span>
        <span class="tooltip-number">#${element.number}</span>
      </div>
      <div class="tooltip-details">
        <span class="tooltip-detail-item">Mass: <span>${massText}</span></span>
        <span class="tooltip-detail-item">Phase: <span>${element.phase}</span></span>
        ${element.electronegativity ? `<span class="tooltip-detail-item">EN: <span>${element.electronegativity}</span></span>` : ''}
      </div>
    `;

    const rect = el.getBoundingClientRect();
    const tipWidth = 220;
    let left = rect.left + rect.width / 2 - tipWidth / 2;
    let top = rect.bottom + 8;

    // Keep tooltip in viewport
    if (left < 8) left = 8;
    if (left + tipWidth > window.innerWidth - 8) left = window.innerWidth - tipWidth - 8;
    if (top + 100 > window.innerHeight) top = rect.top - 80;

    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = top + 'px';
    tooltipEl.classList.add('visible');
  }

  function hideTooltip() {
    tooltipEl.classList.remove('visible');
  }

  // ═══════════════════════ Legend ═══════════════════════
  function renderLegend() {
    let html = '';
    for (const [key, cat] of Object.entries(CATEGORIES)) {
      html += `
        <div class="legend-item" data-category="${key}">
          <span class="legend-swatch" style="background: ${cat.color}"></span>
          <span class="legend-label">${cat.label}</span>
        </div>
      `;
    }
    // Phase legend
    html += `
      <div class="phase-legend">
        <div class="phase-legend-item"><span class="phase-dot solid"></span> Solid</div>
        <div class="phase-legend-item"><span class="phase-dot liquid"></span> Liquid</div>
        <div class="phase-legend-item"><span class="phase-dot gas"></span> Gas</div>
      </div>
    `;
    legendEl.innerHTML = html;
  }

  // ═══════════════════════ Render Table ═══════════════════════
  function renderTable() {
    const mainElements = ELEMENTS.filter(e => e.row >= 1 && e.row <= 7);
    const lanthanides  = ELEMENTS.filter(e => e.row === 8);
    const actinides    = ELEMENTS.filter(e => e.row === 9);

    // Render main grid (periods 1–7)
    renderMainGrid(mainElements);

    // Render lanthanides and actinides as separate rows
    renderFBlockRow(lanthanides, lanthanideRowEl);
    renderFBlockRow(actinides, actinideRowEl);

    // Apply initial temperature
    updatePhases(parseInt(tempSlider.value, 10));
  }

  function renderMainGrid(elements) {
    // Create a position map for quick lookup
    const posMap = new Map();
    elements.forEach(e => posMap.set(`${e.row}-${e.col}`, e));

    let html = '';
    let order = 0;

    for (let row = 1; row <= 7; row++) {
      for (let col = 1; col <= 18; col++) {
        const element = posMap.get(`${row}-${col}`);

        // Lanthanide placeholder
        if (row === 6 && col === 3) {
          html += `<div class="placeholder-cell" data-link="lanthanide"
                        style="grid-row:${row};grid-column:${col}">
            <span class="placeholder-label">${LANTHANIDE_PLACEHOLDER.label}</span>
            <span class="placeholder-sublabel">${LANTHANIDE_PLACEHOLDER.sublabel}</span>
          </div>`;
          continue;
        }
        // Actinide placeholder
        if (row === 7 && col === 3) {
          html += `<div class="placeholder-cell" data-link="actinide"
                        style="grid-row:${row};grid-column:${col}">
            <span class="placeholder-label">${ACTINIDE_PLACEHOLDER.label}</span>
            <span class="placeholder-sublabel">${ACTINIDE_PLACEHOLDER.sublabel}</span>
          </div>`;
          continue;
        }

        if (element) {
          html += createCellHTML(element, row, col, order++);
        }
        // Empty cells are handled by grid — no need to render empties
      }
    }

    periodicTableEl.innerHTML = html;

    // Store references
    periodicTableEl.querySelectorAll('.element-cell').forEach(cell => {
      const num = parseInt(cell.dataset.number, 10);
      cellMap.set(num, cell);
    });
  }

  function renderFBlockRow(elements, containerEl) {
    let html = containerEl.innerHTML; // Keep the label
    elements.sort((a, b) => a.number - b.number);

    let order = 0;
    elements.forEach(e => {
      // These go into columns 3–17 of the f-block grid row
      html += createCellHTML(e, null, e.col, order++);
    });

    containerEl.innerHTML = html;

    // Store references
    containerEl.querySelectorAll('.element-cell').forEach(cell => {
      const num = parseInt(cell.dataset.number, 10);
      cellMap.set(num, cell);
    });
  }

  function createCellHTML(element, row, col, order) {
    const cat = CATEGORIES[element.category];
    const bgColor = cat.color;
    const massText = typeof element.mass === 'string' ? element.mass : element.mass.toFixed(element.mass < 10 ? 4 : 3);
    const gridStyle = row ? `grid-row:${row};grid-column:${col}` : `grid-column:${col}`;

    return `
      <div class="element-cell"
           data-number="${element.number}"
           data-category="${element.category}"
           data-phase="${element.phase.toLowerCase()}"
           style="${gridStyle};background:${bgColor}22;border-color:${bgColor}44;--anim-order:${order}"
           tabindex="0"
           role="button"
           aria-label="${element.name}, ${element.symbol}, atomic number ${element.number}">
        <span class="element-number">${element.number}</span>
        <span class="element-symbol">${element.symbol}</span>
        <span class="element-name">${element.name}</span>
        <span class="element-mass">${massText}</span>
      </div>
    `;
  }

  // ═══════════════════════ Events ═══════════════════════
  function bindEvents() {
    // Element clicks (delegation)
    document.addEventListener('click', (e) => {
      const cell = e.target.closest('.element-cell');
      if (cell) {
        const num = parseInt(cell.dataset.number, 10);
        const element = ELEMENTS.find(el => el.number === num);
        if (element) selectElement(element, cell);
        return;
      }

      // Placeholder clicks — scroll to f-block rows
      const placeholder = e.target.closest('.placeholder-cell');
      if (placeholder) {
        const link = placeholder.dataset.link;
        const target = link === 'lanthanide' ? lanthanideRowEl : actinideRowEl;
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Legend clicks
      const legendItem = e.target.closest('.legend-item');
      if (legendItem) {
        toggleCategoryFilter(legendItem.dataset.category);
        return;
      }

      // Viz tab clicks
      const vizTab = e.target.closest('.viz-tab');
      if (vizTab) {
        switchViz(vizTab.dataset.viz);
        return;
      }

      // 3D speed control — handled inside renderCloud3D now
    });

    // Hover
    document.addEventListener('mouseover', (e) => {
      const cell = e.target.closest('.element-cell');
      if (cell) {
        const num = parseInt(cell.dataset.number, 10);
        const element = ELEMENTS.find(el => el.number === num);
        if (element) showTooltip(cell, element);
      }
    });
    document.addEventListener('mouseout', (e) => {
      const cell = e.target.closest('.element-cell');
      if (cell) hideTooltip();
    });

    // Close detail panel
    detailClose.addEventListener('click', closeDetail);
    detailBackdrop.addEventListener('click', closeDetail);

    // Search
    searchInput.addEventListener('input', debounce(handleSearch, 150));

    // Temperature
    tempSlider.addEventListener('input', () => {
      const temp = parseInt(tempSlider.value, 10);
      tempDisplay.textContent = `${temp}°C`;
      updatePhases(temp);
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDetail();
        searchInput.blur();
      }
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }

  // ═══════════════════════ Select Element ═══════════════════════
  function selectElement(element, cell) {
    // Remove previous active
    cellMap.forEach(c => c.classList.remove('active'));
    cell.classList.add('active');
    activeElement = element;

    // Update detail panel
    showDetail(element);
  }

  function showDetail(element) {
    const cat = CATEGORIES[element.category];
    const massText = typeof element.mass === 'string' ? element.mass : element.mass.toFixed(4);

    // Symbol block
    const symbolBlock = document.getElementById('detail-symbol-block');
    symbolBlock.style.background = cat.color + '22';
    symbolBlock.style.border = `1px solid ${cat.color}44`;
    document.getElementById('detail-number').textContent = element.number;
    document.getElementById('detail-symbol').textContent = element.symbol;
    document.getElementById('detail-symbol').style.color = cat.color;
    document.getElementById('detail-name').textContent = element.name;
    document.getElementById('detail-mass').textContent = massText + ' u';

    // Category badge
    const badge = document.getElementById('detail-category');
    badge.textContent = cat.label;
    badge.style.background = cat.color + '33';
    badge.style.color = cat.color;

    // Summary
    document.getElementById('detail-summary').textContent = element.summary;

    // Fun Fact
    document.getElementById('detail-fun-fact-text').textContent = element.funFact;

    // Properties Grid
    const propsHtml = buildPropertiesHTML(element);
    document.getElementById('properties-grid').innerHTML = propsHtml;

    // Ionic States & Oxidation
    renderIonicStates(element);

    // Electron Configuration
    document.getElementById('electron-config-text').textContent = element.electronConfig;

    // Shell Diagram (Bohr model)
    renderShellDiagram(element.shells);

    // Show panel
    detailPanel.classList.add('open');
    detailBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDetail() {
    detailPanel.classList.remove('open');
    detailBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    cellMap.forEach(c => c.classList.remove('active'));
    activeElement = null;
    if (bohr3dAnimationId) {
      cancelAnimationFrame(bohr3dAnimationId);
      bohr3dAnimationId = null;
    }
    if (molState.animId) {
      cancelAnimationFrame(molState.animId);
      molState.animId = null;
    }
  }

  // ═══════════════════════ Ionic States Renderer ═══════════════════════
  function renderIonicStates(element) {
    const ionsSection = document.getElementById('detail-ions');
    const oxContainer = document.getElementById('oxidation-states');
    const ionsList = document.getElementById('ions-list');

    const ionData = (typeof ELEMENT_IONS !== 'undefined') && ELEMENT_IONS[element.number];

    if (!ionData || (!ionData.ions.length && ionData.oxidationStates.length <= 1)) {
      ionsSection.style.display = 'none';
      return;
    }

    ionsSection.style.display = '';

    // Render oxidation states
    const commonSet = new Set((ionData.commonOx || '').split(',').map(s => s.trim()));
    oxContainer.innerHTML = '<span style="font-size:0.68rem;color:var(--text-muted);margin-right:4px">Oxidation states:</span>' +
      ionData.oxidationStates.map(ox => {
        const isCommon = commonSet.has(ox);
        const isPos = ox.startsWith('+');
        const isNeg = ox.startsWith('-');
        const cls = ['ox-state'];
        if (isCommon) cls.push('common');
        if (isPos) cls.push('positive');
        if (isNeg) cls.push('negative');
        return `<span class="${cls.join(' ')}" title="${isCommon ? 'Common' : 'Less common'}">${ox}</span>`;
      }).join('');

    // Render ion cards
    if (ionData.ions.length === 0) {
      ionsList.innerHTML = '';
      return;
    }

    ionsList.innerHTML = ionData.ions.map(ion => {
      const chargeClass = ion.charge > 0 ? 'positive' : 'negative';
      const chargeLabel = ion.charge > 0 ? `+${ion.charge}` : `${ion.charge}`;
      const isPoly = ion.config === 'polyatomic';
      return `
        <div class="ion-card" style="border-left-color: ${ion.color || 'var(--accent)'}">
          <div class="ion-symbol" style="color: ${ion.color || 'var(--text-primary)'}">${ion.symbol}</div>
          <div class="ion-info">
            <div class="ion-name">${ion.name}${isPoly ? '<span class="polyatomic-label">polyatomic</span>' : ''}</div>
            ${!isPoly ? `<div class="ion-config">${ion.config}</div>` : ''}
            <div class="ion-note">${ion.note}</div>
          </div>
          <span class="ion-charge-badge ${chargeClass}">${chargeLabel}</span>
        </div>`;
    }).join('');
  }

  function buildPropertiesHTML(el) {
    const props = [];

    props.push({ label: 'Phase', value: el.phase, unit: '' });
    if (el.electronegativity) {
      props.push({ label: 'Electronegativity', value: el.electronegativity, unit: '(Pauling)' });
    }
    if (el.density) {
      props.push({ label: 'Density', value: el.density, unit: 'g/cm³' });
    }
    if (el.meltingPoint !== null && el.meltingPoint !== undefined) {
      props.push({ label: 'Melting Point', value: el.meltingPoint, unit: '°C' });
    }
    if (el.boilingPoint !== null && el.boilingPoint !== undefined) {
      props.push({ label: 'Boiling Point', value: el.boilingPoint, unit: '°C' });
    }
    if (el.yearDiscovered) {
      const year = el.yearDiscovered < 0 ? `~${Math.abs(el.yearDiscovered)} BC` : el.yearDiscovered;
      props.push({ label: 'Discovered', value: year, unit: '' });
    }
    if (el.discoveredBy) {
      props.push({ label: 'Discovered By', value: el.discoveredBy, unit: '' });
    }
    if (el.shells) {
      props.push({ label: 'Electron Shells', value: el.shells.join(', '), unit: '' });
    }

    return props.map(p => `
      <div class="property-card">
        <div class="property-label">${p.label}</div>
        <div class="property-value">${p.value}<span class="property-unit"> ${p.unit}</span></div>
      </div>
    `).join('');
  }

  // ═══════════════════════ Shell Diagram (Bohr Model) ═══════════════════════
  function renderShellDiagram(shells) {
    // Render the active visualization
    renderBohr2D(shells);
    renderCloud3D(activeElement);
    renderOrbitalDiagram(activeElement);
    renderMolecule(activeElement);
  }

  // ─────────────── Visualization Tab Switching ───────────────
  function switchViz(mode) {
    activeViz = mode;
    document.querySelectorAll('.viz-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.viz === mode);
    });
    document.querySelectorAll('.viz-panel').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('viz-' + mode);
    if (target) target.classList.add('active');

    // Stop 3D animation when not visible
    if (mode !== 'bohr3d' && bohr3dAnimationId) {
      cancelAnimationFrame(bohr3dAnimationId);
      bohr3dAnimationId = null;
    }
    // Restart 3D if switching to it
    if (mode === 'bohr3d' && activeElement) {
      startCloudAnimation();
    }
    // Stop molecule animation when not visible
    if (mode !== 'molecule' && molState.animId) {
      cancelAnimationFrame(molState.animId);
      molState.animId = null;
    }
    if (mode === 'molecule' && activeElement) {
      startMoleculeAnimation();
    }
  }

  // ═══════════════════ 2D BOHR MODEL ═══════════════════
  // Enhanced with animated electrons orbiting on CSS offset-path
  function renderBohr2D(shells) {
    const container = document.getElementById('viz-bohr2d');
    if (!shells || shells.length === 0) { container.innerHTML = ''; return; }

    const maxRings = shells.length;
    // Scale rings to fit detail panel; cap at reasonable size
    const baseR = 14;
    const stepR = Math.min(24, Math.max(16, 150 / maxRings));
    const maxR = baseR + stepR * maxRings;
    const size = maxR * 2 + 30;

    const cx = size / 2;
    const cy = size / 2;

    let html = `<div class="bohr2d-wrapper" style="width:${size}px;height:${size}px;">`;
    html += `<div class="bohr2d-nucleus" style="left:${cx-8}px;top:${cy-8}px;"></div>`;

    shells.forEach((count, i) => {
      const r = baseR + stepR * (i + 1);
      const d = r * 2;
      const off = cx - r;

      // Shell label  
      const catColor = activeElement ? CATEGORIES[activeElement.category].color : 'var(--accent)';
      html += `<div class="bohr2d-ring" style="width:${d}px;height:${d}px;left:${off}px;top:${off}px;border-color:${catColor}44;"></div>`;

      // Shell electron count label
      html += `<div class="bohr2d-shell-label" style="left:${cx + r - 6}px;top:${cy - 8}px;">${count}e⁻</div>`;

      // Animated electrons placed along the circle
      const electronCount = Math.min(count, 12); // cap visible electrons for performance
      const speed = 3 + i * 1.5; // outer shells orbit slower
      for (let e = 0; e < electronCount; e++) {
        const startAngle = (360 / electronCount) * e;
        // Use CSS animation with offset-path (circle)
        html += `<div class="bohr2d-electron" style="
          offset-path: circle(${r}px at ${cx}px ${cy}px);
          offset-distance: ${(startAngle / 360) * 100}%;
          --orbit-duration: ${speed}s;
          animation-direction: ${i % 2 === 0 ? 'normal' : 'reverse'};
        "></div>`;
      }
    });

    html += '</div>';
    container.innerHTML = html;
  }

  // ═══════════════════ 3D ELECTRON CLOUD (Canvas) ═══════════════════
  // Scientifically accurate orbital probability density visualization.
  // Uses hydrogen-like wavefunctions: R_nl(r) × Y_lm(θ,φ) with
  // Slater effective nuclear charge. Monte Carlo rejection sampling
  // from |ψ|² renders the actual orbital shapes (s, p, d, f).
  // Positive and negative lobes of the wavefunction shown in distinct colors.

  // Lobe colors: positive lobe / negative lobe per orbital type
  const LOBE_COLORS = {
    s: { pos: [80, 160, 255],  neg: [80, 160, 255]  },   // s has no sign change angularly
    p: { pos: [255, 100, 80],  neg: [80, 140, 255]  },   // red + / blue -
    d: { pos: [255, 200, 50],  neg: [100, 60, 220]  },   // gold + / purple -
    f: { pos: [50, 210, 120],  neg: [220, 60, 160]  },   // green + / pink -
  };

  // Human-readable orbital m-value names
  const M_NAMES = {
    s: { 0: '' },
    p: { '-1': 'y', 0: 'z', 1: 'x' },
    d: { '-2': 'xy', '-1': 'yz', 0: 'z²', 1: 'xz', 2: 'x²-y²' },
    f: { '-3': 'y(3x²-y²)', '-2': 'xyz', '-1': 'yz²', 0: 'z³', 1: 'xz²', 2: 'z(x²-y²)', 3: 'x(x²-3y²)' },
  };

  const cloud3d = {
    canvas: null, ctx: null,
    allOrbData: [],    // precomputed orbital info [{n,l,m,lChar,Zeff,rExt,key,elec}]
    pointCache: {},    // cache: 'nlm' -> [{x,y,z,sign}]
    activeFilter: 'all', // 'all' or 'nlm' key
    camTheta: 0.4,
    camPhi: 0.3,
    fov: 600,
    zoom: 1.0,
    autoRotate: true,
    dragging: false,
    lastMouse: { x: 0, y: 0 },
    dpr: 1, w: 0, h: 0,
    speed: 1,
    scale: 1,
    element: null,
  };

  // ── Associated Laguerre polynomial L^α_n(x) via recurrence ──
  function assocLaguerre(n, alpha, x) {
    if (n === 0) return 1;
    if (n === 1) return 1 + alpha - x;
    let prev2 = 1;
    let prev1 = 1 + alpha - x;
    for (let k = 2; k <= n; k++) {
      const curr = ((2 * k - 1 + alpha - x) * prev1 - (k - 1 + alpha) * prev2) / k;
      prev2 = prev1;
      prev1 = curr;
    }
    return prev1;
  }

  // ── Real spherical harmonic angular factor Y_lm(cosθ, φ) ──
  // Returns SIGNED value (positive/negative lobes preserved for coloring).
  function angularY(l, m, cosT, phi) {
    const st = Math.sqrt(Math.max(0, 1 - cosT * cosT));
    if (l === 0) return 1;
    if (l === 1) {
      if (m ===  0) return cosT;                    // pz
      if (m ===  1) return st * Math.cos(phi);      // px
      if (m === -1) return st * Math.sin(phi);      // py
    }
    if (l === 2) {
      const st2 = st * st;
      if (m ===  0) return 3 * cosT * cosT - 1;             // dz²
      if (m ===  1) return st * cosT * Math.cos(phi);        // dxz
      if (m === -1) return st * cosT * Math.sin(phi);        // dyz
      if (m ===  2) return st2 * Math.cos(2 * phi);          // dx²-y²
      if (m === -2) return st2 * Math.sin(2 * phi);          // dxy
    }
    if (l === 3) {
      const st2 = st * st, st3 = st2 * st, ct2 = cosT * cosT;
      if (m ===  0) return cosT * (5 * ct2 - 3);             // fz³
      if (m ===  1) return st * (5 * ct2 - 1) * Math.cos(phi);
      if (m === -1) return st * (5 * ct2 - 1) * Math.sin(phi);
      if (m ===  2) return st2 * cosT * Math.cos(2 * phi);
      if (m === -2) return st2 * cosT * Math.sin(2 * phi);
      if (m ===  3) return st3 * Math.cos(3 * phi);
      if (m === -3) return st3 * Math.sin(3 * phi);
    }
    return 1;
  }

  // ── Slater effective nuclear charge ──
  function slaterZeff(Z, targetN, targetL, configMap) {
    function grp(n, l) {
      if (l <= 1) return n;
      if (l === 2) return n + 0.5;
      return n + 0.25;
    }
    const tg = grp(targetN, targetL);
    const groupE = {};
    for (const [key, count] of configMap) {
      const n = parseInt(key[0]), l = 'spdf'.indexOf(key[1]);
      const g = grp(n, l);
      groupE[g] = (groupE[g] || 0) + count;
    }
    let sigma = 0;
    for (const [gStr, count] of Object.entries(groupE)) {
      const g = parseFloat(gStr);
      if (g === tg) {
        sigma += (targetN === 1 ? 0.30 : 0.35) * Math.max(0, count - 1);
      } else if (g < tg) {
        if (targetL <= 1) {
          sigma += (g >= tg - 1 ? 0.85 : 1.00) * count;
        } else {
          sigma += 1.00 * count;
        }
      }
    }
    return Math.max(1, Z - sigma);
  }

  // ── Determine which individual orbitals (n,l,m) are occupied ──
  function getOccupiedOrbitals(configMap) {
    const M_VALUES = {
      s: [0],
      p: [1, 0, -1],
      d: [2, 1, 0, -1, -2],
      f: [3, 2, 1, 0, -1, -2, -3],
    };
    const orbitals = [];
    for (const [key, electrons] of configMap) {
      const n = parseInt(key[0]);
      const lChar = key[1];
      const l = 'spdf'.indexOf(lChar);
      const ms = M_VALUES[lChar];
      // Hund's rule: fill one per orbital first, then pair
      const mE = new Array(ms.length).fill(0);
      let rem = electrons;
      for (let i = 0; i < ms.length && rem > 0; i++) { mE[i]++; rem--; }
      for (let i = 0; i < ms.length && rem > 0; i++) { mE[i]++; rem--; }
      for (let i = 0; i < ms.length; i++) {
        if (mE[i] > 0) orbitals.push({ n, l, m: ms[i], elec: mE[i], key, lChar });
      }
    }
    return orbitals;
  }

  // ── Generate point cloud for one orbital via rejection sampling ──
  // Returns points with sign of wavefunction preserved for lobe coloring.
  function sampleOrbital(n, l, m, Zeff, numPoints) {
    const rCut = Math.max(4, (5 * n * n) / Zeff);

    // High-resolution pre-scan for radial peak: r²|R|²
    let maxRad = 0;
    const RSCAN = 500;
    for (let i = 1; i <= RSCAN; i++) {
      const r = (i / RSCAN) * rCut;
      const rho = 2 * Zeff * r / n;
      const L = assocLaguerre(n - l - 1, 2 * l + 1, rho);
      const Rv = Math.pow(rho, l) * Math.exp(-rho / 2) * L;
      const p = r * r * Rv * Rv;
      if (p > maxRad) maxRad = p;
    }

    // High-resolution angular pre-scan for |Y|² peak
    let maxAng = 0;
    const ASCAN = 80;
    for (let i = 0; i <= ASCAN; i++) {
      const ct = -1 + 2 * i / ASCAN;
      for (let j = 0; j <= ASCAN; j++) {
        const phi = 2 * Math.PI * j / ASCAN;
        const Y = angularY(l, m, ct, phi);
        if (Y * Y > maxAng) maxAng = Y * Y;
      }
    }
    if (maxRad === 0 || maxAng === 0) return [];

    const pts = [];
    let attempts = 0;
    const maxAttempts = numPoints * 120;
    while (pts.length < numPoints && attempts < maxAttempts) {
      attempts++;
      // Importance-weighted radial sampling: bias toward peak
      const r = Math.random() * rCut;
      const rho = 2 * Zeff * r / n;
      const L = assocLaguerre(n - l - 1, 2 * l + 1, rho);
      const Rv = Math.pow(rho, l) * Math.exp(-rho / 2) * L;
      const radProb = r * r * Rv * Rv;
      if (Math.random() * maxRad > radProb) continue;

      // Angular rejection
      const cosT = -1 + 2 * Math.random();
      const phi = 2 * Math.PI * Math.random();
      const Y = angularY(l, m, cosT, phi);
      if (Math.random() * maxAng > Y * Y) continue;

      const st = Math.sqrt(Math.max(0, 1 - cosT * cosT));
      pts.push({
        x: r * st * Math.cos(phi),
        y: r * st * Math.sin(phi),
        z: r * cosT,
        sign: Y >= 0 ? 1 : -1,    // preserve wavefunction sign for lobe coloring
        r,                          // distance from nucleus
      });
    }
    return pts;
  }

  // ── Precompute orbital info for an element ──
  function precomputeOrbData(element) {
    const configMap = parseElectronConfig(element.electronConfig);
    const orbitals = getOccupiedOrbitals(configMap);
    const Z = element.number;

    let maxR = 0;
    const orbData = orbitals.map(orb => {
      const Zeff = slaterZeff(Z, orb.n, orb.l, configMap);
      const rExt = (5 * orb.n * orb.n) / Zeff;
      if (rExt > maxR) maxR = rExt;
      return { ...orb, Zeff, rExt };
    });

    return { orbData, maxR, Z, configMap };
  }

  // ── Build points for a single orbital (high resolution) ──
  function buildSingleOrbital(orb, scale) {
    const cacheKey = `${orb.n}${orb.l}${orb.m}`;
    if (cloud3d.pointCache[cacheKey]) return cloud3d.pointCache[cacheKey];

    const numPts = 15000;
    const raw = sampleOrbital(orb.n, orb.l, orb.m, orb.Zeff, numPts);
    const colors = LOBE_COLORS[orb.lChar] || { pos: [180,180,180], neg: [180,180,180] };

    // Use per-orbital scale so single orbitals fill the canvas
    const orbScale = orb.rExt > 0 ? 200 / orb.rExt : scale;
    const points = raw.map(p => {
      const col = p.sign >= 0 ? colors.pos : colors.neg;
      return {
        x: p.x * orbScale, y: p.y * orbScale, z: p.z * orbScale,
        r: col[0], g: col[1], b: col[2],
        alpha: 0.30,
        size: 1.5,
      };
    });
    cloud3d.pointCache[cacheKey] = points;
    return points;
  }

  // ── Build points for all orbitals (overview) ──
  function buildAllOrbitals(orbData, scale) {
    if (cloud3d.pointCache['__all__']) return cloud3d.pointCache['__all__'];

    const totalOrbs = orbData.length;
    const ptsPerOrb = Math.max(400, Math.floor(15000 / Math.max(1, totalOrbs)));

    const allPoints = [];
    for (const orb of orbData) {
      const raw = sampleOrbital(orb.n, orb.l, orb.m, orb.Zeff, ptsPerOrb);
      const colors = LOBE_COLORS[orb.lChar] || { pos: [180,180,180], neg: [180,180,180] };
      for (const p of raw) {
        const col = p.sign >= 0 ? colors.pos : colors.neg;
        allPoints.push({
          x: p.x * scale, y: p.y * scale, z: p.z * scale,
          r: col[0], g: col[1], b: col[2],
          alpha: 0.18 + 0.07 * (orb.n / 7),
          size: 1.0 + 0.2 * (orb.n / 7),
        });
      }
    }
    cloud3d.pointCache['__all__'] = allPoints;
    return allPoints;
  }

  // ── Get active point set based on filter ──
  function getActivePoints() {
    const filter = cloud3d.activeFilter;
    const { orbData, scale } = cloud3d;
    if (filter === 'all') {
      return buildAllOrbitals(orbData, scale);
    }
    // Subshell group view (pre-built in click handler)
    if (filter.startsWith('__sub_') && cloud3d.pointCache[filter]) {
      return cloud3d.pointCache[filter];
    }
    // Find the matching individual orbital
    const orb = orbData.find(o => `${o.n}${o.lChar}${o.m}` === filter);
    if (!orb) return buildAllOrbitals(orbData, scale);
    return buildSingleOrbital(orb, scale);
  }

  // ── 3D math helpers ──
  function rotX(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [p[0], p[1]*c - p[2]*s, p[1]*s + p[2]*c];
  }
  function rotY(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [p[0]*c + p[2]*s, p[1], -p[0]*s + p[2]*c];
  }
  function rotZ(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [p[0]*c - p[1]*s, p[0]*s + p[1]*c, p[2]];
  }
  function cloudProject(p3) {
    const d = cloud3d.fov / (cloud3d.fov + p3[2]);
    return [p3[0] * d, p3[1] * d, p3[2], d];
  }
  function cloudCamTransform(p) {
    let q = rotY(p, cloud3d.camTheta);
    q = rotX(q, cloud3d.camPhi);
    return q;
  }
  function hexToRgb(hex) {
    const m = hex.replace('#','');
    return [parseInt(m.slice(0,2),16), parseInt(m.slice(2,4),16), parseInt(m.slice(4,6),16)];
  }

  // ── Build orbital label text ──
  function orbLabel(orb) {
    const mNames = M_NAMES[orb.lChar];
    const sub = mNames ? mNames[String(orb.m)] : '';
    if (sub) return `${orb.n}${orb.lChar}${sub}`;
    return `${orb.n}${orb.lChar}`;
  }

  // ── Main render call ──
  function renderCloud3D(element) {
    const container = document.getElementById('viz-bohr3d');
    if (!element) { container.innerHTML = ''; return; }

    const { orbData, maxR, Z, configMap } = precomputeOrbData(element);
    const scale = maxR > 0 ? 200 / Math.pow(maxR, 0.75) : 1;

    cloud3d.element = element;
    cloud3d.allOrbData = orbData;
    cloud3d.orbData = orbData;
    cloud3d.scale = scale;
    cloud3d.pointCache = {};
    cloud3d.activeFilter = 'all';
    cloud3d.camTheta = 0.4;
    cloud3d.camPhi = 0.3;
    cloud3d.zoom = 1.0;
    cloud3d.autoRotate = true;

    const size = 480;

    // Build orbital selector buttons
    // Group by subshell (e.g. all 2p orbitals together)
    const subshells = new Map(); // key -> [orbitals]
    for (const o of orbData) {
      if (!subshells.has(o.key)) subshells.set(o.key, []);
      subshells.get(o.key).push(o);
    }

    let selectorHtml = '<div class="cloud-selector">';
    selectorHtml += '<button class="cloud-sel-btn active" data-cloud-filter="all">All</button>';

    for (const [subKey, orbs] of subshells) {
      // Button for the whole subshell
      if (orbs.length > 1) {
        selectorHtml += `<button class="cloud-sel-btn cloud-sel-group" data-cloud-filter="sub:${subKey}">${subKey}</button>`;
      }
      // Individual orbital buttons
      for (const orb of orbs) {
        const filterKey = `${orb.n}${orb.lChar}${orb.m}`;
        const lbl = orbLabel(orb);
        const elecLabel = orb.elec === 2 ? '↑↓' : '↑';
        selectorHtml += `<button class="cloud-sel-btn" data-cloud-filter="${filterKey}">${lbl} <span class="cloud-sel-e">${elecLabel}</span></button>`;
      }
    }
    selectorHtml += '</div>';

    // Build legend
    const usedTypes = new Set(orbData.map(o => o.lChar));
    let legendHtml = '<div class="mol-legend">';
    for (const t of usedTypes) {
      const cp = LOBE_COLORS[t].pos, cn = LOBE_COLORS[t].neg;
      if (t === 's') {
        legendHtml += `<span class="mol-legend-item"><span class="mol-legend-dot" style="background:rgb(${cp})"></span>${t}</span>`;
      } else {
        legendHtml += `<span class="mol-legend-item"><span class="mol-legend-dot" style="background:rgb(${cp})"></span>${t}+</span>`;
        legendHtml += `<span class="mol-legend-item"><span class="mol-legend-dot" style="background:rgb(${cn})"></span>${t}−</span>`;
      }
    }
    legendHtml += '</div>';

    container.innerHTML = `
      <div class="bohr3d-wrapper">
        ${selectorHtml}
        <canvas id="bohr3d-canvas" width="${size * 2}" height="${size * 2}"
                style="width:${size}px;height:${size}px;cursor:grab;"></canvas>
        ${legendHtml}
        <div class="bohr3d-hint" id="cloud-hint">Drag to rotate · Scroll to zoom · Select orbital to see its shape</div>
        <div class="bohr3d-controls">
          <button class="bohr3d-btn" data-action="auto" title="Toggle auto-rotate">⟳</button>
          <button class="bohr3d-btn" data-action="reset" title="Reset view">↺</button>
        </div>
      </div>`;

    const canvas = document.getElementById('bohr3d-canvas');
    cloud3d.canvas = canvas;
    cloud3d.ctx = canvas.getContext('2d');
    cloud3d.dpr = window.devicePixelRatio || 1;
    cloud3d.w = canvas.width;
    cloud3d.h = canvas.height;

    // Pointer events
    canvas.addEventListener('pointerdown', onCloudPointerDown);
    canvas.addEventListener('pointermove', onCloudPointerMove);
    canvas.addEventListener('pointerup', onCloudPointerUp);
    canvas.addEventListener('pointerleave', onCloudPointerUp);
    canvas.addEventListener('wheel', onCloudWheel, { passive: false });

    // Control buttons
    container.querySelectorAll('.bohr3d-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const a = btn.dataset.action;
        if (a === 'auto') cloud3d.autoRotate = !cloud3d.autoRotate;
        if (a === 'reset') { cloud3d.camTheta = 0.4; cloud3d.camPhi = 0.3; cloud3d.zoom = 1.0; cloud3d.autoRotate = true; cloud3d.pointCache = {}; }
      });
    });

    // Orbital selector
    container.querySelectorAll('.cloud-sel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.cloud-sel-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.cloudFilter;

        if (filter.startsWith('sub:')) {
          // Show all orbitals of this subshell combined
          const subKey = filter.slice(4);
          const orbs = subshells.get(subKey);
          if (orbs) {
            // Build combined cloud inline
            const cacheKey = '__sub_' + subKey;
            if (!cloud3d.pointCache[cacheKey]) {
              const pts = [];
              for (const orb of orbs) {
                const raw = sampleOrbital(orb.n, orb.l, orb.m, orb.Zeff, Math.floor(12000 / orbs.length));
                const colors = LOBE_COLORS[orb.lChar];
                const subScale = orb.rExt > 0 ? 200 / orb.rExt : scale;
                for (const p of raw) {
                  const col = p.sign >= 0 ? colors.pos : colors.neg;
                  pts.push({
                    x: p.x * subScale, y: p.y * subScale, z: p.z * subScale,
                    r: col[0], g: col[1], b: col[2], alpha: 0.28, size: 1.3,
                  });
                }
              }
              cloud3d.pointCache[cacheKey] = pts;
            }
            cloud3d.activeFilter = cacheKey;
          }
        } else {
          cloud3d.activeFilter = filter;
        }
        // Update hint text
        const hint = document.getElementById('cloud-hint');
        if (hint) {
          if (filter === 'all') {
            hint.textContent = `Drag to rotate · Scroll to zoom · Select orbital to see its shape`;
          } else {
            const name = btn.textContent.trim().replace(/[↑↓]/g, '').trim();
            hint.textContent = `Showing ${name} orbital · ${getActivePoints().length.toLocaleString()} points`;
          }
        }
      });
    });

    if (activeViz === 'bohr3d') startCloudAnimation();
  }

  // ── Pointer events for drag-rotation ──
  function onCloudPointerDown(e) {
    cloud3d.dragging = true;
    cloud3d.autoRotate = false;
    cloud3d.lastMouse = { x: e.clientX, y: e.clientY };
    cloud3d.canvas.style.cursor = 'grabbing';
    e.preventDefault();
  }
  function onCloudPointerMove(e) {
    if (!cloud3d.dragging) return;
    const dx = e.clientX - cloud3d.lastMouse.x;
    const dy = e.clientY - cloud3d.lastMouse.y;
    cloud3d.camTheta += dx * 0.008;
    cloud3d.camPhi = Math.max(-1.4, Math.min(1.4, cloud3d.camPhi + dy * 0.008));
    cloud3d.lastMouse = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }
  function onCloudPointerUp() {
    cloud3d.dragging = false;
    if (cloud3d.canvas) cloud3d.canvas.style.cursor = 'grab';
  }
  function onCloudWheel(e) {
    const factor = cloud3d.zoom < 1 ? 0.001 : 0.003;
    cloud3d.zoom = Math.max(0.15, Math.min(12.0, cloud3d.zoom + e.deltaY * -factor));
    e.preventDefault();
  }

  // ── Animation loop ──
  function startCloudAnimation() {
    if (bohr3dAnimationId) cancelAnimationFrame(bohr3dAnimationId);
    const ctx = cloud3d.ctx;
    if (!ctx) return;

    function frame() {
      if (cloud3d.autoRotate) {
        cloud3d.camTheta += 0.005 * cloud3d.speed;
      }
      drawCloud(ctx);
      bohr3dAnimationId = requestAnimationFrame(frame);
    }
    bohr3dAnimationId = requestAnimationFrame(frame);
  }

  // ── Per-frame draw ──
  function drawCloud(ctx) {
    const W = cloud3d.w, H = cloud3d.h;
    const cx = W / 2, cy = H / 2;
    const zm = cloud3d.zoom;

    ctx.clearRect(0, 0, W, H);

    // ── Draw subtle axes ──
    const origin = cloudCamTransform([0, 0, 0]);
    const op = cloudProject(origin);
    const axLen = 160 * zm;
    const axisData = [
      { dir: [axLen, 0, 0], label: 'x', col: 'rgba(255,100,100,' },
      { dir: [0, axLen, 0], label: 'y', col: 'rgba(100,255,100,' },
      { dir: [0, 0, axLen], label: 'z', col: 'rgba(100,150,255,' },
    ];
    for (const ax of axisData) {
      const tp = cloudCamTransform(ax.dir);
      const pp = cloudProject(tp);
      // Axis line
      ctx.strokeStyle = ax.col + '0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + op[0], cy + op[1]);
      ctx.lineTo(cx + pp[0] * zm, cy + pp[1] * zm);
      ctx.stroke();
      // Axis label
      ctx.font = `bold 16px 'JetBrains Mono', monospace`;
      ctx.fillStyle = ax.col + '0.25)';
      ctx.fillText(ax.label, cx + pp[0] * zm + 4, cy + pp[1] * zm - 4);
    }

    // ── Nucleus ──
    const ng = ctx.createRadialGradient(cx + op[0], cy + op[1], 0, cx + op[0], cy + op[1], 20 * zm);
    ng.addColorStop(0, 'rgba(255,255,255,0.35)');
    ng.addColorStop(0.2, 'rgba(180,210,255,0.12)');
    ng.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ng;
    ctx.beginPath();
    ctx.arc(cx + op[0], cy + op[1], 20 * zm, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e0eaff';
    ctx.beginPath();
    ctx.arc(cx + op[0], cy + op[1], 3 * zm, 0, Math.PI * 2);
    ctx.fill();

    // ── Get points for active selection ──
    const points = getActivePoints();
    if (points.length === 0) return;

    // ── Project all points ──
    const projected = new Array(points.length);
    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      const t = cloudCamTransform([pt.x * zm, pt.y * zm, pt.z * zm]);
      const p = cloudProject(t);
      projected[i] = {
        sx: cx + p[0], sy: cy + p[1], z: t[2],
        r: pt.r, g: pt.g, b: pt.b,
        alpha: pt.alpha * p[3],
        size: pt.size * p[3] * zm,
      };
    }

    // ── Sort back-to-front ──
    projected.sort((a, b) => b.z - a.z);

    // ── Draw points with normal blending (avoids white washout) ──
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      const sz = Math.max(0.5, p.size);
      const a = Math.min(0.45, p.alpha * 0.40);
      ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, sz, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    // ── Label for selected orbital ──
    if (cloud3d.activeFilter !== 'all' && !cloud3d.activeFilter.startsWith('__sub_')) {
      const orb = cloud3d.orbData.find(o => `${o.n}${o.lChar}${o.m}` === cloud3d.activeFilter);
      if (orb) {
        const label = orbLabel(orb);
        ctx.font = `bold 22px 'Inter', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(label, 16, W - 16);
        ctx.font = `13px 'JetBrains Mono', monospace`;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillText(`n=${orb.n}  ℓ=${orb.l}  m=${orb.m}  Z*=${orb.Zeff.toFixed(1)}`, 16, W - 40);
      }
    }
  }

  // ═══════════════════ ORBITAL DIAGRAM ═══════════════════
  // Parses actual electronConfig string (handles Aufbau exceptions like Cr, Cu, Pd, Au)

  // Map Unicode superscript digits to numbers
  const SUPER_MAP = { '\u00b9':1, '\u00b2':2, '\u00b3':3, '\u2070':0,
    '\u2074':4, '\u2075':5, '\u2076':6, '\u2077':7, '\u2078':8, '\u2079':9 };

  // Noble gas core expansions
  const NOBLE_CORES = {
    'He': '1s²',
    'Ne': '1s² 2s² 2p⁶',
    'Ar': '1s² 2s² 2p⁶ 3s² 3p⁶',
    'Kr': '1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶',
    'Xe': '1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p⁶',
    'Rn': '1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 6s² 6p⁶',
    'Og': '1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 4f¹⁴ 5s² 5p⁶ 5d¹⁰ 5f¹⁴ 6s² 6p⁶ 6d¹⁰ 7s² 7p⁶',
  };

  // Subshell max capacity lookup
  const SUBSHELL_MAX = { s: 2, p: 6, d: 10, f: 14 };

  // Display order by energy level
  const DISPLAY_ORDER = [
    '1s','2s','2p','3s','3p','3d','4s','4p','4d','4f',
    '5s','5p','5d','5f','6s','6p','6d','7s','7p'
  ];

  function parseSuperscript(str) {
    let num = 0;
    for (const ch of str) {
      const d = SUPER_MAP[ch];
      if (d !== undefined) num = num * 10 + d;
    }
    return num;
  }

  function parseElectronConfig(configStr) {
    // Expand noble gas notation: [Ar] 3d⁵ 4s¹ → full subshell list
    let expanded = configStr;
    const coreMatch = configStr.match(/\[([A-Za-z]+)\]/);
    if (coreMatch) {
      const coreName = coreMatch[1];
      const coreExpansion = NOBLE_CORES[coreName] || '';
      expanded = coreExpansion + ' ' + configStr.slice(coreMatch.index + coreMatch[0].length);
    }

    // Parse subshells: e.g. "3d⁵" → { n:3, l:'d', electrons:5 }
    const subshells = new Map(); // key: "3d" → electrons
    const regex = /(\d)([spdf])([\u00b9\u00b2\u00b3\u2070\u2074-\u2079]+)/g;
    let m;
    while ((m = regex.exec(expanded)) !== null) {
      const key = m[1] + m[2];
      const count = parseSuperscript(m[3]);
      subshells.set(key, count); // later values override (handles noble gas + explicit)
    }

    return subshells;
  }

  function renderOrbitalDiagram(element) {
    const container = document.getElementById('viz-orbital');
    if (!element) { container.innerHTML = ''; return; }

    // Parse the real electronConfig string
    const subshellMap = parseElectronConfig(element.electronConfig);

    // Sort by standard display order
    const filled = [];
    for (const key of DISPLAY_ORDER) {
      if (subshellMap.has(key)) {
        const n = parseInt(key[0]);
        const l = key[1];
        filled.push({ n, l, max: SUBSHELL_MAX[l], electrons: subshellMap.get(key), key });
      }
    }

    let html = '<div class="orbital-diagram">';

    filled.forEach(sub => {
      const boxes = sub.max / 2; // each box holds 2 electrons (up+down)
      html += `<div class="orbital-row">`;
      html += `<span class="orbital-label">${sub.n}${sub.l}</span>`;
      html += `<div class="orbital-boxes">`;

      let electronsLeft = sub.electrons;
      // First pass: one electron per box (Hund's rule)
      const boxElectrons = new Array(boxes).fill(0);
      for (let b = 0; b < boxes && electronsLeft > 0; b++) {
        boxElectrons[b]++;
        electronsLeft--;
      }
      // Second pass: pair up
      for (let b = 0; b < boxes && electronsLeft > 0; b++) {
        boxElectrons[b]++;
        electronsLeft--;
      }

      boxElectrons.forEach(count => {
        const cls = count === 2 ? 'filled' : count === 1 ? 'half' : '';
        html += `<div class="orbital-box ${cls}">`;
        if (count >= 1) html += `<span class="arrow-up">\u2191</span>`;
        if (count >= 2) html += `<span class="arrow-down">\u2193</span>`;
        html += `</div>`;
      });

      html += `</div>`; // boxes
      html += `<span class="orbital-sublabel">${sub.electrons}/${sub.max}</span>`;
      html += `</div>`; // row
    });

    html += '</div>';
    container.innerHTML = html;
  }

  // ═══════════════════ MOLECULAR ELECTRON CLOUD (LCAO) ═══════════════════
  // Molecular orbitals via Linear Combination of Atomic Orbitals.
  // Uses pre-defined LCAO coefficients to visualize bonding/antibonding MOs.
  // Samples from contributing AOs and evaluates full MO for sign coloring.

  const BOHR_PER_ANGSTROM = 1.8897259886;

  // MO type color palette: positive / negative phase
  const MO_COLORS = {
    bonding:     { pos: [60, 150, 255],  neg: [255, 90, 60]  },
    antibonding: { pos: [255, 200, 50],  neg: [150, 50, 220] },
    nonbonding:  { pos: [50, 200, 130],  neg: [200, 60, 150] },
    core:        { pos: [140, 140, 160], neg: [140, 140, 160] },
  };

  const molCloud = {
    active: false,
    compound: null,
    moData: null,
    atomsBohr: [],
    pointCache: {},
    activeFilter: 'all',
    camTheta: 0.5,
    camPhi: 0.4,
    fov: 600,
    zoom: 1.0,
    autoRotate: true,
    dragging: false,
    lastMouse: { x: 0, y: 0 },
    dpr: 1, w: 0, h: 0,
    scale: 1,
  };

  // Evaluate atomic orbital wavefunction (unnormalized) at point (x,y,z) in Bohr
  function evalAO(n, l, m, Zeff, x, y, z) {
    const r = Math.sqrt(x * x + y * y + z * z);
    if (r < 1e-12) {
      return l === 0 ? assocLaguerre(n - 1, 1, 0) : 0;
    }
    const cosT = z / r;
    const phi = Math.atan2(y, x);
    const rho = 2 * Zeff * r / n;
    const L = assocLaguerre(n - l - 1, 2 * l + 1, rho);
    const R = Math.pow(rho, l) * Math.exp(-rho / 2) * L;
    const Y = angularY(l, m, cosT, phi);
    return R * Y;
  }

  // Evaluate full molecular orbital at point (x,y,z) in Bohr
  function evalMO(mo, atomsBohr, x, y, z) {
    let psi = 0;
    for (const a of mo.ao) {
      const atom = atomsBohr[a.atom];
      psi += a.c * evalAO(a.n, a.l, a.m, a.zeff, x - atom.x, y - atom.y, z - atom.z);
    }
    return psi;
  }

  // Sample points for one molecular orbital using per-AO importance sampling
  function sampleMolOrbital(mo, atomsBohr, numPoints) {
    const totalW = mo.ao.reduce((s, a) => s + a.c * a.c, 0);
    if (totalW === 0) return [];

    const pts = [];

    for (const contrib of mo.ao) {
      const weight = (contrib.c * contrib.c) / totalW;
      const targetPts = Math.max(10, Math.round(weight * numPoints));
      const atom = atomsBohr[contrib.atom];
      const { n, l, m, zeff } = contrib;
      const rCut = Math.max(4, (5 * n * n) / zeff);

      // Radial pre-scan
      let maxRad = 0;
      for (let i = 1; i <= 300; i++) {
        const r = (i / 300) * rCut;
        const rho = 2 * zeff * r / n;
        const L = assocLaguerre(n - l - 1, 2 * l + 1, rho);
        const Rv = Math.pow(rho, l) * Math.exp(-rho / 2) * L;
        const p = r * r * Rv * Rv;
        if (p > maxRad) maxRad = p;
      }

      // Angular pre-scan
      let maxAng = 0;
      for (let i = 0; i <= 50; i++) {
        const ct = -1 + 2 * i / 50;
        for (let j = 0; j <= 50; j++) {
          const phi = 2 * Math.PI * j / 50;
          const Y = angularY(l, m, ct, phi);
          if (Y * Y > maxAng) maxAng = Y * Y;
        }
      }

      if (maxRad === 0 || maxAng === 0) continue;

      let got = 0;
      let attempts = 0;
      const maxAttempts = targetPts * 100;

      while (got < targetPts && attempts < maxAttempts) {
        attempts++;
        const r = Math.random() * rCut;
        const rho = 2 * zeff * r / n;
        const L = assocLaguerre(n - l - 1, 2 * l + 1, rho);
        const Rv = Math.pow(rho, l) * Math.exp(-rho / 2) * L;
        if (Math.random() * maxRad > r * r * Rv * Rv) continue;

        const cosT = -1 + 2 * Math.random();
        const phi = 2 * Math.PI * Math.random();
        const Y = angularY(l, m, cosT, phi);
        if (Math.random() * maxAng > Y * Y) continue;

        const st = Math.sqrt(Math.max(0, 1 - cosT * cosT));
        const px = r * st * Math.cos(phi) + atom.x;
        const py = r * st * Math.sin(phi) + atom.y;
        const pz = r * cosT + atom.z;

        // Evaluate full MO for sign
        const psiVal = evalMO(mo, atomsBohr, px, py, pz);

        pts.push({
          x: px, y: py, z: pz,
          sign: psiVal >= 0 ? 1 : -1,
        });
        got++;
      }
    }
    return pts;
  }

  // Build colored point cloud for a molecular orbital
  function buildMolOrbPoints(mo, atomsBohr, scale, numPoints) {
    const cacheKey = mo.name;
    if (molCloud.pointCache[cacheKey]) return molCloud.pointCache[cacheKey];

    const raw = sampleMolOrbital(mo, atomsBohr, numPoints);
    const colors = MO_COLORS[mo.type] || MO_COLORS.bonding;

    const points = raw.map(p => {
      const col = p.sign >= 0 ? colors.pos : colors.neg;
      return {
        x: p.x * scale, y: p.y * scale, z: p.z * scale,
        r: col[0], g: col[1], b: col[2],
        alpha: 0.30,
        size: 1.5,
      };
    });
    molCloud.pointCache[cacheKey] = points;
    return points;
  }

  // Build all occupied MOs combined
  function buildAllMolOrbPoints(moData, atomsBohr, scale) {
    if (molCloud.pointCache['__all__']) return molCloud.pointCache['__all__'];

    const occupied = moData.orbitals.filter(mo => mo.electrons > 0 && mo.type !== 'core');
    const ptsPerMO = Math.max(200, Math.floor(10000 / Math.max(1, occupied.length)));

    // Assign distinct hues to each MO
    const allPoints = [];
    occupied.forEach((mo, idx) => {
      const raw = sampleMolOrbital(mo, atomsBohr, ptsPerMO);
      const hue = (idx / occupied.length) * 360;
      const rgb = hslToRgb(hue, 0.7, 0.6);
      for (const p of raw) {
        allPoints.push({
          x: p.x * scale, y: p.y * scale, z: p.z * scale,
          r: rgb[0], g: rgb[1], b: rgb[2],
          alpha: 0.20,
          size: 1.0,
        });
      }
    });
    molCloud.pointCache['__all__'] = allPoints;
    return allPoints;
  }

  // HSL to RGB helper
  function hslToRgb(h, s, l) {
    h /= 360;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
      const k = (n + h * 12) % 12;
      return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };
    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
  }

  // Get active point set for molecular cloud
  function getMolCloudPoints() {
    const { moData, atomsBohr, scale } = molCloud;
    const filter = molCloud.activeFilter;

    if (filter === 'all') {
      return buildAllMolOrbPoints(moData, atomsBohr, scale);
    }
    const mo = moData.orbitals.find(o => o.name === filter);
    if (!mo) return buildAllMolOrbPoints(moData, atomsBohr, scale);
    const numPts = mo.electrons > 0 ? 15000 : 10000;
    return buildMolOrbPoints(mo, atomsBohr, scale, numPts);
  }

  // Draw molecular cloud (per-frame)
  function drawMolCloud(ctx) {
    const W = molCloud.w, H = molCloud.h;
    const cx = W / 2, cy = H / 2;
    const zm = molCloud.zoom;

    // Inline camera transform using molCloud's own angles
    function mcTransform(p) {
      let q = rotY(p, molCloud.camTheta);
      q = rotX(q, molCloud.camPhi);
      return q;
    }
    function mcProject(p3) {
      const d = molCloud.fov / (molCloud.fov + p3[2]);
      return [p3[0] * d, p3[1] * d, p3[2], d];
    }

    ctx.clearRect(0, 0, W, H);

    // Axes
    const axLen = 130 * zm;
    const axisData = [
      { dir: [axLen, 0, 0], label: 'x', col: 'rgba(255,100,100,' },
      { dir: [0, axLen, 0], label: 'y', col: 'rgba(100,255,100,' },
      { dir: [0, 0, axLen], label: 'z', col: 'rgba(100,150,255,' },
    ];
    for (const ax of axisData) {
      const tp = mcTransform(ax.dir);
      const pp = mcProject(tp);
      ctx.strokeStyle = ax.col + '0.10)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + pp[0] * zm, cy + pp[1] * zm);
      ctx.stroke();
      ctx.font = `bold 14px 'JetBrains Mono', monospace`;
      ctx.fillStyle = ax.col + '0.20)';
      ctx.fillText(ax.label, cx + pp[0] * zm + 3, cy + pp[1] * zm - 3);
    }

    // Draw atom positions as small labeled dots
    if (molCloud.compound) {
      for (const a of molCloud.compound.atoms) {
        const bohr = { x: a.x * BOHR_PER_ANGSTROM, y: a.y * BOHR_PER_ANGSTROM, z: a.z * BOHR_PER_ANGSTROM };
        const t = mcTransform([bohr.x * molCloud.scale * zm, bohr.y * molCloud.scale * zm, bohr.z * molCloud.scale * zm]);
        const p = mcProject(t);
        const rgb = hexToRgb(getCPK(a.sym));
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.6)`;
        ctx.beginPath();
        ctx.arc(cx + p[0], cy + p[1], 4 * p[3] * zm, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,0.4)`;
        ctx.font = `bold ${Math.round(10 * p[3] * zm)}px 'Inter', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(a.sym, cx + p[0], cy + p[1] - 6 * p[3] * zm);
      }
      ctx.textAlign = 'start';
    }

    // Get cloud points
    const points = getMolCloudPoints();
    if (points.length === 0) return;

    // Project
    const projected = new Array(points.length);
    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      const t = mcTransform([pt.x * zm, pt.y * zm, pt.z * zm]);
      const p = mcProject(t);
      projected[i] = {
        sx: cx + p[0], sy: cy + p[1], z: t[2],
        r: pt.r, g: pt.g, b: pt.b,
        alpha: pt.alpha * p[3],
        size: pt.size * p[3] * zm,
      };
    }

    // Sort back-to-front
    projected.sort((a, b) => b.z - a.z);

    // Draw
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      const sz = Math.max(0.5, p.size);
      const a = Math.min(0.45, p.alpha * 0.40);
      ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, sz, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Label
    if (molCloud.activeFilter !== 'all') {
      const mo = molCloud.moData.orbitals.find(o => o.name === molCloud.activeFilter);
      if (mo) {
        ctx.font = `bold 18px 'Inter', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(mo.name, 16, W - 16);
        ctx.font = `12px 'JetBrains Mono', monospace`;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        const typeLabel = mo.type + (mo.electrons > 0 ? ` (${mo.electrons}e⁻)` : ' (empty)');
        ctx.fillText(typeLabel, 16, W - 36);
      }
    }
  }

  // Molecular cloud camera events
  function onMolCloudPointerDown(e) {
    molCloud.dragging = true;
    molCloud.autoRotate = false;
    molCloud.lastMouse = { x: e.clientX, y: e.clientY };
    if (molCloud.canvas) molCloud.canvas.style.cursor = 'grabbing';
    e.preventDefault();
  }
  function onMolCloudPointerMove(e) {
    if (!molCloud.dragging) return;
    const dx = e.clientX - molCloud.lastMouse.x;
    const dy = e.clientY - molCloud.lastMouse.y;
    molCloud.camTheta += dx * 0.008;
    molCloud.camPhi = Math.max(-1.4, Math.min(1.4, molCloud.camPhi + dy * 0.008));
    molCloud.lastMouse = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }
  function onMolCloudPointerUp() {
    molCloud.dragging = false;
    if (molCloud.canvas) molCloud.canvas.style.cursor = 'grab';
  }
  function onMolCloudWheel(e) {
    const factor = molCloud.zoom < 1 ? 0.001 : 0.003;
    molCloud.zoom = Math.max(0.15, Math.min(12.0, molCloud.zoom + e.deltaY * -factor));
    e.preventDefault();
  }

  // Molecular cloud animation
  function startMolCloudAnimation() {
    if (molState.animId) cancelAnimationFrame(molState.animId);
    const ctx = molCloud.ctx;
    if (!ctx) return;

    function frame() {
      if (molCloud.autoRotate) {
        molCloud.camTheta += 0.005;
      }
      drawMolCloud(ctx);
      molState.animId = requestAnimationFrame(frame);
    }
    molState.animId = requestAnimationFrame(frame);
  }

  // ═══════════════════ MOLECULE VISUALIZER ═══════════════════
  // 3D ball-and-stick model of a common compound, rendered on Canvas
  // with the same camera system as the Bohr 3D model

  const molState = {
    canvas: null, ctx: null,
    compound: null,
    compoundIdx: 0,
    camTheta: 0.5, camPhi: 0.4, camDist: 500, fov: 600,
    autoRotate: true, dragging: false,
    lastMouse: { x: 0, y: 0 },
    animId: null,
    scale: 100, // Å to px scale
    cloudMode: false,
  };

  function renderMolecule(element) {
    const container = document.getElementById('viz-molecule');
    if (!container) return;
    if (!element) { container.innerHTML = ''; return; }

    const compounds = (typeof ELEMENT_COMPOUNDS !== 'undefined') ? ELEMENT_COMPOUNDS[element.number] : null;
    if (!compounds || compounds.length === 0) {
      container.innerHTML = '<div class="mol-empty">No compound data for this element.</div>';
      return;
    }

    molState.compoundIdx = 0;
    const compound = compounds[0];
    molState.compound = compound;
    molState.camTheta = 0.5;
    molState.camPhi = 0.4;
    molState.camDist = 500;
    molState.autoRotate = true;
    molState.cloudMode = false;

    // Check if MO data exists for the first compound
    const hasMO = typeof MOLECULAR_ORBITALS !== 'undefined' && MOLECULAR_ORBITALS[compound.formula];

    // Build UI
    const size = 320;
    const cloudSize = 420;
    let selectorHtml = '';
    if (compounds.length > 1) {
      selectorHtml = '<div class="mol-selector">' +
        compounds.map((c, i) =>
          `<button class="mol-sel-btn${i===0?' active':''}" data-mol-idx="${i}">${c.formula}</button>`
        ).join('') + '</div>';
    }

    // View toggle (Ball & Stick vs e⁻ Cloud)
    let toggleHtml = '';
    if (hasMO) {
      toggleHtml = `<div class="mol-view-toggle" id="mol-view-toggle">
        <button class="mol-view-btn active" data-mol-view="sticks">Ball &amp; Stick</button>
        <button class="mol-view-btn" data-mol-view="cloud">e⁻ Cloud</button>
      </div>`;
    }

    container.innerHTML = `
      <div class="mol-wrapper">
        <div class="mol-header">
          <span class="mol-name" id="mol-name">${compound.name}</span>
          <span class="mol-formula" id="mol-formula">${compound.formula}</span>
        </div>
        ${selectorHtml}
        ${toggleHtml}
        <canvas id="mol-canvas" width="${size*2}" height="${size*2}"
                style="width:${size}px;height:${size}px;cursor:grab;"></canvas>
        <div class="mol-cloud-selector" id="mol-cloud-selector" style="display:none;"></div>
        <p class="mol-desc" id="mol-desc">${compound.description}</p>
        <div class="mol-legend" id="mol-legend"></div>
        <div class="mol-hint">Drag to rotate &middot; Scroll to zoom</div>
      </div>`;

    // Build legend
    const uniqueSyms = [...new Set(compound.atoms.map(a => a.sym))];
    const legendEl2 = document.getElementById('mol-legend');
    legendEl2.innerHTML = uniqueSyms.map(s =>
      `<span class="mol-legend-item"><span class="mol-legend-dot" style="background:${getCPK(s)}"></span>${s}</span>`
    ).join('');

    // Canvas setup
    const canvas = document.getElementById('mol-canvas');
    molState.canvas = canvas;
    molState.ctx = canvas.getContext('2d');

    // Auto-scale: measure bounding box of atoms
    const xs = compound.atoms.map(a => a.x);
    const ys = compound.atoms.map(a => a.y);
    const zs = compound.atoms.map(a => a.z);
    const maxSpan = Math.max(
      Math.max(...xs) - Math.min(...xs),
      Math.max(...ys) - Math.min(...ys),
      Math.max(...zs) - Math.min(...zs),
      1.5
    );
    molState.scale = (size * 0.55) / maxSpan;

    // Events
    canvas.addEventListener('pointerdown', onMolPointerDown);
    canvas.addEventListener('pointermove', onMolPointerMove);
    canvas.addEventListener('pointerup', onMolPointerUp);
    canvas.addEventListener('pointerleave', onMolPointerUp);
    canvas.addEventListener('wheel', onMolWheel, { passive: false });

    // Compound selector
    container.querySelectorAll('.mol-sel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.molIdx);
        selectCompound(idx, compounds);
        container.querySelectorAll('.mol-sel-btn').forEach(b => b.classList.toggle('active', b === btn));
      });
    });

    // View toggle events (Ball & Stick / e⁻ Cloud)
    setupMolViewToggle(container, compound, size, cloudSize);

    if (activeViz === 'molecule') startMoleculeAnimation();
  }

  // Toggle between Ball & Stick and e⁻ Cloud views
  function setupMolViewToggle(container, compound, sticksSize, cloudSize) {
    container.querySelectorAll('.mol-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.mol-view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.molView;
        molState.cloudMode = (mode === 'cloud');

        const canvas = molState.canvas;
        const selector = document.getElementById('mol-cloud-selector');

        if (molState.cloudMode) {
          // Switch to cloud mode
          canvas.width = cloudSize * 2;
          canvas.height = cloudSize * 2;
          canvas.style.width = cloudSize + 'px';
          canvas.style.height = cloudSize + 'px';

          // Remove molecule events, add cloud events
          canvas.removeEventListener('pointerdown', onMolPointerDown);
          canvas.removeEventListener('pointermove', onMolPointerMove);
          canvas.removeEventListener('pointerup', onMolPointerUp);
          canvas.removeEventListener('pointerleave', onMolPointerUp);
          canvas.removeEventListener('wheel', onMolWheel);
          canvas.addEventListener('pointerdown', onMolCloudPointerDown);
          canvas.addEventListener('pointermove', onMolCloudPointerMove);
          canvas.addEventListener('pointerup', onMolCloudPointerUp);
          canvas.addEventListener('pointerleave', onMolCloudPointerUp);
          canvas.addEventListener('wheel', onMolCloudWheel, { passive: false });

          // Init molCloud
          initMolCloud(molState.compound, canvas);

          // Build MO selector
          if (selector) {
            selector.style.display = 'flex';
            buildMolCloudSelector(selector);
          }

          // Restart animation in cloud mode
          startMolCloudAnimation();
        } else {
          // Switch back to sticks mode
          canvas.width = sticksSize * 2;
          canvas.height = sticksSize * 2;
          canvas.style.width = sticksSize + 'px';
          canvas.style.height = sticksSize + 'px';

          // Remove cloud events, add molecule events
          canvas.removeEventListener('pointerdown', onMolCloudPointerDown);
          canvas.removeEventListener('pointermove', onMolCloudPointerMove);
          canvas.removeEventListener('pointerup', onMolCloudPointerUp);
          canvas.removeEventListener('pointerleave', onMolCloudPointerUp);
          canvas.removeEventListener('wheel', onMolCloudWheel);
          canvas.addEventListener('pointerdown', onMolPointerDown);
          canvas.addEventListener('pointermove', onMolPointerMove);
          canvas.addEventListener('pointerup', onMolPointerUp);
          canvas.addEventListener('pointerleave', onMolPointerUp);
          canvas.addEventListener('wheel', onMolWheel, { passive: false });

          molCloud.active = false;
          if (selector) selector.style.display = 'none';

          // Restart sticks animation
          molState.autoRotate = true;
          startMoleculeAnimation();
        }
      });
    });
  }

  // Initialize molecular cloud state for a compound
  function initMolCloud(compound, canvas) {
    const formula = compound.formula;
    const moData = MOLECULAR_ORBITALS[formula];
    if (!moData) return;

    molCloud.active = true;
    molCloud.compound = compound;
    molCloud.moData = moData;
    molCloud.canvas = canvas;
    molCloud.ctx = canvas.getContext('2d');
    molCloud.dpr = 2;
    molCloud.w = canvas.width;
    molCloud.h = canvas.height;
    molCloud.camTheta = 0.5;
    molCloud.camPhi = 0.4;
    molCloud.autoRotate = true;
    molCloud.dragging = false;
    molCloud.activeFilter = 'all';
    molCloud.pointCache = {};

    // Convert atom positions to Bohr
    molCloud.atomsBohr = compound.atoms.map(a => ({
      x: a.x * BOHR_PER_ANGSTROM,
      y: a.y * BOHR_PER_ANGSTROM,
      z: a.z * BOHR_PER_ANGSTROM,
      sym: a.sym,
    }));

    // Compute scale: map Bohr extent to pixel space
    const bohrCoords = molCloud.atomsBohr;
    let maxR = 0;
    for (const a of bohrCoords) {
      const r = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
      if (r > maxR) maxR = r;
    }
    // Add orbital extent: largest rCut from any contributing AO
    let maxOrbR = 0;
    for (const mo of moData.orbitals) {
      for (const ao of mo.ao) {
        const atomR = Math.sqrt(bohrCoords[ao.atom].x ** 2 + bohrCoords[ao.atom].y ** 2 + bohrCoords[ao.atom].z ** 2);
        const rCut = Math.max(4, (5 * ao.n * ao.n) / ao.zeff);
        if (atomR + rCut > maxOrbR) maxOrbR = atomR + rCut;
      }
    }
    molCloud.scale = 180 / Math.max(maxR + 3, maxOrbR, 4);
    molCloud.zoom = 1.0;
  }

  // Build MO selector buttons
  function buildMolCloudSelector(el) {
    if (!molCloud.moData) return;
    const orbs = molCloud.moData.orbitals;
    const occupied = orbs.filter(o => o.electrons > 0);

    let html = `<button class="mol-cloud-btn active" data-mo-name="all">All Occupied</button>`;
    occupied.forEach(mo => {
      const label = mo.name + ` (${mo.electrons}e⁻)`;
      html += `<button class="mol-cloud-btn" data-mo-name="${mo.name}">${label}</button>`;
    });
    // Also show unoccupied (antibonding) if any
    const unoccupied = orbs.filter(o => o.electrons === 0);
    if (unoccupied.length > 0) {
      html += '<span class="mol-cloud-sep">|</span>';
      unoccupied.forEach(mo => {
        html += `<button class="mol-cloud-btn" data-mo-name="${mo.name}">${mo.name} (empty)</button>`;
      });
    }

    el.innerHTML = html;

    el.querySelectorAll('.mol-cloud-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('.mol-cloud-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        molCloud.activeFilter = btn.dataset.moName;
        // Clear only the specific cache key if switching
        // No need to clear — we cache by name
      });
    });
  }

  function selectCompound(idx, compounds) {
    molState.compoundIdx = idx;
    molState.compound = compounds[idx];
    molState.camTheta = 0.5;
    molState.camPhi = 0.4;
    molState.autoRotate = true;

    const c = compounds[idx];
    const nameEl = document.getElementById('mol-name');
    const formulaEl = document.getElementById('mol-formula');
    const descEl = document.getElementById('mol-desc');
    const legendEl2 = document.getElementById('mol-legend');
    if (nameEl) nameEl.textContent = c.name;
    if (formulaEl) formulaEl.textContent = c.formula;
    if (descEl) descEl.textContent = c.description;

    const uniqueSyms = [...new Set(c.atoms.map(a => a.sym))];
    if (legendEl2) {
      legendEl2.innerHTML = uniqueSyms.map(s =>
        `<span class="mol-legend-item"><span class="mol-legend-dot" style="background:${getCPK(s)}"></span>${s}</span>`
      ).join('');
    }

    // Re-scale
    const xs = c.atoms.map(a => a.x);
    const ys = c.atoms.map(a => a.y);
    const zs = c.atoms.map(a => a.z);
    const maxSpan = Math.max(
      Math.max(...xs) - Math.min(...xs),
      Math.max(...ys) - Math.min(...ys),
      Math.max(...zs) - Math.min(...zs),
      1.5
    );
    molState.scale = (160 * 0.55) / maxSpan * 2;

    // Reset to Ball & Stick mode
    molState.cloudMode = false;
    molCloud.active = false;
    molCloud.pointCache = {};

    const toggle = document.getElementById('mol-view-toggle');
    const selector = document.getElementById('mol-cloud-selector');
    const hasMO = typeof MOLECULAR_ORBITALS !== 'undefined' && MOLECULAR_ORBITALS[c.formula];

    if (toggle) {
      toggle.style.display = hasMO ? 'flex' : 'none';
      toggle.querySelectorAll('.mol-view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.molView === 'sticks');
      });
    }
    if (selector) selector.style.display = 'none';

    // Restore sticks canvas size and event listeners
    const canvas = molState.canvas;
    if (canvas) {
      canvas.width = 640;
      canvas.height = 640;
      canvas.style.width = '320px';
      canvas.style.height = '320px';

      // Ensure sticks event listeners (remove cloud ones if present)
      canvas.removeEventListener('pointerdown', onMolCloudPointerDown);
      canvas.removeEventListener('pointermove', onMolCloudPointerMove);
      canvas.removeEventListener('pointerup', onMolCloudPointerUp);
      canvas.removeEventListener('pointerleave', onMolCloudPointerUp);
      canvas.removeEventListener('wheel', onMolCloudWheel);
      // Re-add sticks listeners (removeEventListener is no-op if not present)
      canvas.removeEventListener('pointerdown', onMolPointerDown);
      canvas.addEventListener('pointerdown', onMolPointerDown);
      canvas.removeEventListener('pointermove', onMolPointerMove);
      canvas.addEventListener('pointermove', onMolPointerMove);
      canvas.removeEventListener('pointerup', onMolPointerUp);
      canvas.addEventListener('pointerup', onMolPointerUp);
      canvas.removeEventListener('pointerleave', onMolPointerUp);
      canvas.addEventListener('pointerleave', onMolPointerUp);
      canvas.removeEventListener('wheel', onMolWheel);
      canvas.addEventListener('wheel', onMolWheel, { passive: false });
    }

    startMoleculeAnimation();
  }

  // Pointer events for molecule
  function onMolPointerDown(e) {
    molState.dragging = true;
    molState.autoRotate = false;
    molState.lastMouse = { x: e.clientX, y: e.clientY };
    molState.canvas.style.cursor = 'grabbing';
    e.preventDefault();
  }
  function onMolPointerMove(e) {
    if (!molState.dragging) return;
    const dx = e.clientX - molState.lastMouse.x;
    const dy = e.clientY - molState.lastMouse.y;
    molState.camTheta += dx * 0.008;
    molState.camPhi = Math.max(-1.4, Math.min(1.4, molState.camPhi + dy * 0.008));
    molState.lastMouse = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }
  function onMolPointerUp() {
    molState.dragging = false;
    if (molState.canvas) molState.canvas.style.cursor = 'grab';
  }
  function onMolWheel(e) {
    molState.camDist = Math.max(200, Math.min(1200, molState.camDist + e.deltaY * 0.8));
    e.preventDefault();
  }

  function molCamTransform(p) {
    let q = rotY(p, molState.camTheta);
    q = rotX(q, molState.camPhi);
    return q;
  }

  function molProject(p3) {
    const d = molState.fov / (molState.fov + p3[2]);
    return [p3[0] * d, p3[1] * d, p3[2], d];
  }

  function startMoleculeAnimation() {
    if (molState.animId) cancelAnimationFrame(molState.animId);
    const ctx = molState.ctx;
    if (!ctx) return;

    function frame() {
      if (molState.autoRotate) {
        molState.camTheta += 0.006;
      }
      drawMolecule(ctx);
      molState.animId = requestAnimationFrame(frame);
    }
    molState.animId = requestAnimationFrame(frame);
  }

  function drawMolecule(ctx) {
    const compound = molState.compound;
    if (!compound) return;

    const W = molState.canvas.width, H = molState.canvas.height;
    const cx = W / 2, cy = H / 2;
    const S = molState.scale;

    ctx.clearRect(0, 0, W, H);

    // Transform all atom positions
    const transformed = compound.atoms.map(a => {
      const p3 = molCamTransform([a.x * S, a.y * S, a.z * S]);
      const pp = molProject(p3);
      return { sym: a.sym, x: cx + pp[0], y: cy + pp[1], z: p3[2], scale: pp[3] };
    });

    // Collect draw items for depth sorting
    const items = [];

    // ── Bonds ──
    compound.bonds.forEach(bond => {
      const a1 = transformed[bond.from];
      const a2 = transformed[bond.to];
      const avgZ = (a1.z + a2.z) / 2;

      items.push({
        z: avgZ + 0.01,
        draw: () => {
          const order = Math.round(bond.order) || 1;
          const dx = a2.x - a1.x;
          const dy = a2.y - a1.y;
          const len = Math.sqrt(dx*dx + dy*dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;

          const avgScale = (a1.scale + a2.scale) / 2;
          const lineW = 2.5 * avgScale;
          const gap = 5 * avgScale;

          for (let i = 0; i < order; i++) {
            const offset = (i - (order-1)/2) * gap;
            const ox = nx * offset;
            const oy = ny * offset;

            // Gradient from atom1 color to atom2 color
            const grad = ctx.createLinearGradient(a1.x+ox, a1.y+oy, a2.x+ox, a2.y+oy);
            const c1 = getCPK(a1.sym);
            const c2 = getCPK(a2.sym);
            grad.addColorStop(0, c1);
            grad.addColorStop(0.5, c1);
            grad.addColorStop(0.5, c2);
            grad.addColorStop(1, c2);

            ctx.strokeStyle = grad;
            ctx.lineWidth = lineW;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(a1.x + ox, a1.y + oy);
            ctx.lineTo(a2.x + ox, a2.y + oy);
            ctx.stroke();
          }
        }
      });
    });

    // ── Atoms (balls) ──
    transformed.forEach((a) => {
      const baseR = (getRadius(a.sym) || 0.5) * S * 0.35;
      const r = Math.max(6, baseR * a.scale);
      const rgb = hexToRgb(getCPK(a.sym));

      items.push({
        z: a.z,
        draw: () => {
          // Shadow / depth
          ctx.fillStyle = `rgba(0,0,0,${0.15 * a.scale})`;
          ctx.beginPath();
          ctx.arc(a.x + 2, a.y + 2, r, 0, Math.PI*2);
          ctx.fill();

          // Sphere with specular highlight
          const grad = ctx.createRadialGradient(
            a.x - r*0.3, a.y - r*0.3, r*0.05,
            a.x, a.y, r
          );
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.35, `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
          grad.addColorStop(1, `rgb(${Math.floor(rgb[0]*0.35)},${Math.floor(rgb[1]*0.35)},${Math.floor(rgb[2]*0.35)})`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(a.x, a.y, r, 0, Math.PI*2);
          ctx.fill();

          // Atom symbol label (for larger atoms)
          if (r > 12) {
            ctx.fillStyle = (rgb[0]+rgb[1]+rgb[2]) > 450 ? '#222' : '#fff';
            ctx.font = `bold ${Math.round(r * 0.75)}px 'Inter', sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(a.sym, a.x, a.y + 1);
          }
        }
      });
    });

    // Depth sort and draw
    items.sort((a, b) => b.z - a.z);
    items.forEach(item => item.draw());
  }

  // ═══════════════════════ Search ═══════════════════════
  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      // Clear search — show all
      cellMap.forEach(cell => {
        cell.classList.remove('dimmed', 'highlighted');
      });
      return;
    }

    ELEMENTS.forEach(el => {
      const cell = cellMap.get(el.number);
      if (!cell) return;

      const match =
        el.name.toLowerCase().includes(query) ||
        el.symbol.toLowerCase().includes(query) ||
        String(el.number) === query ||
        el.category.replace(/-/g, ' ').includes(query);

      if (match) {
        cell.classList.remove('dimmed');
        cell.classList.add('highlighted');
      } else {
        cell.classList.add('dimmed');
        cell.classList.remove('highlighted');
      }
    });
  }

  // ═══════════════════════ Category Filter ═══════════════════════
  function toggleCategoryFilter(category) {
    const legendItems = legendEl.querySelectorAll('.legend-item');

    if (activeCategory === category) {
      // Deselect — show all
      activeCategory = null;
      legendItems.forEach(li => li.classList.remove('dimmed'));
      cellMap.forEach(cell => cell.classList.remove('dimmed'));
    } else {
      activeCategory = category;
      legendItems.forEach(li => {
        li.classList.toggle('dimmed', li.dataset.category !== category);
      });
      cellMap.forEach(cell => {
        cell.classList.toggle('dimmed', cell.dataset.category !== category);
      });
    }
  }

  // ═══════════════════════ Temperature / Phase ═══════════════════════
  function updatePhases(tempC) {
    ELEMENTS.forEach(el => {
      const cell = cellMap.get(el.number);
      if (!cell) return;

      let phase = 'unknown';
      if (el.meltingPoint !== null && el.boilingPoint !== null) {
        if (tempC < el.meltingPoint) {
          phase = 'solid';
        } else if (tempC < el.boilingPoint) {
          phase = 'liquid';
        } else {
          phase = 'gas';
        }
      } else if (el.meltingPoint !== null) {
        phase = tempC < el.meltingPoint ? 'solid' : 'liquid';
      } else {
        phase = el.phase.toLowerCase();
      }

      cell.dataset.phase = phase;
    });
  }

  // ═══════════════════════ Utilities ═══════════════════════
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // ═══════════════════════ Start ═══════════════════════
  document.addEventListener('DOMContentLoaded', init);
})();
