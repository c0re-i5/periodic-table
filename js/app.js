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
  let activeNuclearViz = 'nucleus3d';
  let cellMap = new Map(); // number -> DOM element
  let tooltipEl = null;
  let bohr3dAnimationId = null;
  let nucleus3dAnimationId = null;

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

    // Measure actual tooltip height
    tooltipEl.style.left = '-9999px';
    tooltipEl.style.top = '0';
    tooltipEl.classList.add('visible');
    const tipHeight = tooltipEl.offsetHeight;

    let top = rect.bottom + 8;

    // If tooltip would overflow bottom, show it above the element
    if (top + tipHeight > window.innerHeight) {
      top = rect.top - tipHeight - 8;
    }

    // Keep tooltip in viewport horizontally
    if (left < 8) left = 8;
    if (left + tipWidth > window.innerWidth - 8) left = window.innerWidth - tipWidth - 8;

    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = top + 'px';
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

      // Nuclear viz tab clicks
      const nuclearTab = e.target.closest('.nuclear-viz-tab');
      if (nuclearTab) {
        switchNuclearViz(nuclearTab.dataset.nviz);
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

    // Nuclear data
    try { showNuclearDetail(element); } catch(e) { console.error('Nuclear render error:', e); }

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
    if (nucleus3dAnimationId) {
      cancelAnimationFrame(nucleus3dAnimationId);
      nucleus3dAnimationId = null;
    }
    nuc3d.canvas = null;
    nuc3d.ctx = null;
    nuc3d.nucleons = [];
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

  // ═══════════════════════ Nuclear Detail Population ═══════════════════════
  function showNuclearDetail(element) {
    const nd = typeof NUCLEAR_DATA !== 'undefined' ? NUCLEAR_DATA[element.number] : null;
    if (!nd) return;

    const z = nd.z;
    const n = nd.nucleons - z;

    // Badges
    const protonBadge = document.getElementById('nuclear-protons');
    protonBadge.className = 'nuclear-badge proton-badge';
    protonBadge.textContent = `${z} protons`;

    const neutronBadge = document.getElementById('nuclear-neutrons');
    neutronBadge.className = 'nuclear-badge neutron-badge';
    neutronBadge.textContent = `${n} neutrons`;

    const radiusBadge = document.getElementById('nuclear-radius');
    radiusBadge.textContent = `r = ${nd.radius} fm`;

    // Stats
    document.getElementById('nuclear-spin').innerHTML = `<strong>Spin:</strong> ${nd.spin}`;
    document.getElementById('nuclear-binding').innerHTML = `<strong>B/A:</strong> ${nd.bindingPerNucleon} MeV`;
    document.getElementById('nuclear-magnetic').innerHTML = `<strong>μ:</strong> ${nd.magneticMoment} μₙ`;

    // Cross-section and separation energies from NUCLEAR_EXTRA
    const ne = typeof NUCLEAR_EXTRA !== 'undefined' ? NUCLEAR_EXTRA[nd.z] : null;
    const csEl = document.getElementById('nuclear-crosssection');
    const sepEl = document.getElementById('nuclear-separation');
    if (ne) {
      csEl.innerHTML = ne.sigma !== null
        ? `<strong>σ<sub>n,γ</sub>:</strong> ${ne.sigma >= 1000 ? ne.sigma.toLocaleString() : ne.sigma} b`
        : `<strong>σ<sub>n,γ</sub>:</strong> —`;
      const spStr = ne.Sp !== null ? ne.Sp.toFixed(1) : '—';
      const snStr = ne.Sn !== null ? ne.Sn.toFixed(1) : '—';
      sepEl.innerHTML = `<strong>S<sub>p</sub>:</strong> ${spStr}  <strong>S<sub>n</sub>:</strong> ${snStr} MeV`;
    } else {
      csEl.innerHTML = '';
      sepEl.innerHTML = '';
    }

    // Stability
    const stability = document.getElementById('nuclear-stability');
    if (nd.stable) {
      stability.className = 'nuclear-stability stable';
      stability.textContent = '● Stable Nucleus';
    } else {
      stability.className = 'nuclear-stability radioactive';
      stability.textContent = '☢ Radioactive';
    }

    // Nucleosynthesis origin
    const originEl = document.getElementById('nuclear-origin');
    if (ne && ne.origin && ne.origin.length) {
      const labels = ne.origin.map(code => (typeof ORIGIN_LABELS !== 'undefined' && ORIGIN_LABELS[code]) || code);
      originEl.innerHTML = `⭐ Origin: ${labels.join(' + ')}`;
      originEl.style.display = '';
    } else {
      originEl.style.display = 'none';
    }

    // Nuclear reactions
    const reactionsEl = document.getElementById('nuclear-reactions');
    if (ne && ne.reactions && ne.reactions.length) {
      let rHTML = '<h4>Notable Reactions</h4>';
      ne.reactions.forEach(r => {
        rHTML += `<div class="nuclear-reaction-item">${r}</div>`;
      });
      reactionsEl.innerHTML = rHTML;
      reactionsEl.style.display = '';
    } else {
      reactionsEl.style.display = 'none';
    }

    // Isotope table (enhanced with abundance bars)
    buildIsotopeChart(nd);

    // Nuclear analysis panels (mass defect, stability, fission/fusion)
    buildNuclearAnalysis(nd);

    // Render nuclear visualizations
    renderNucleus3D(nd);
    renderDecayChain(nd);
    renderBindingEnergyChart(nd);
    renderNuclearShells(nd);
    renderNuclideChart(nd);
    renderSEMF(nd);
    renderDecayCurve(nd);
  }

  // ─────────────── Nuclear Viz Tab Switching ───────────────
  function switchNuclearViz(mode) {
    activeNuclearViz = mode;
    document.querySelectorAll('.nuclear-viz-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.nviz === mode);
    });
    document.querySelectorAll('.nuclear-viz-panel').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('nviz-' + mode);
    if (target) target.classList.add('active');

    // Manage nucleus3d animation
    if (mode !== 'nucleus3d' && nucleus3dAnimationId) {
      cancelAnimationFrame(nucleus3dAnimationId);
      nucleus3dAnimationId = null;
    }
    if (mode === 'nucleus3d' && activeElement) {
      const nd = NUCLEAR_DATA[activeElement.number];
      if (nd) startNucleusAnimation(nd);
    }
  }

  // ═══════════════════════ NUCLEUS 3D RENDERER ═══════════════════════
  // Renders protons (red) and neutrons (teal) as sphere-packed nucleons
  // with interactive 3D rotation + zoom using perspective projection.

  function getNuclearVizSize(container) {
    const rect = container.parentElement.getBoundingClientRect();
    const w = Math.max(300, Math.floor(rect.width - 8));
    return { w, h: w };
  }

  function makeHiDPICanvas(container, w, h) {
    const dpr = window.devicePixelRatio || 1;
    const canvas = document.createElement('canvas');
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    container.appendChild(canvas);
    return { canvas, ctx, w, h };
  }

  // ── Nucleus 3D state (mirrors cloud3d pattern) ──
  const nuc3d = {
    canvas: null, ctx: null,
    nucleons: [],
    camTheta: 0.3,      // Y-axis rotation
    camPhi: 0.25,        // X-axis rotation
    fov: 500,
    zoom: 1.0,
    autoRotate: true,
    dragging: false,
    lastMouse: { x: 0, y: 0 },
    size: 0,
    nd: null,
  };

  function onNucPointerDown(e) {
    nuc3d.dragging = true;
    nuc3d.autoRotate = false;
    nuc3d.lastMouse = { x: e.clientX, y: e.clientY };
    if (nuc3d.canvas) nuc3d.canvas.style.cursor = 'grabbing';
    e.preventDefault();
  }
  function onNucPointerMove(e) {
    if (!nuc3d.dragging) return;
    const dx = e.clientX - nuc3d.lastMouse.x;
    const dy = e.clientY - nuc3d.lastMouse.y;
    nuc3d.camTheta += dx * 0.008;
    nuc3d.camPhi = Math.max(-1.4, Math.min(1.4, nuc3d.camPhi + dy * 0.008));
    nuc3d.lastMouse = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }
  function onNucPointerUp() {
    nuc3d.dragging = false;
    if (nuc3d.canvas) nuc3d.canvas.style.cursor = 'grab';
  }
  function onNucWheel(e) {
    const factor = nuc3d.zoom < 1 ? 0.001 : nuc3d.zoom < 5 ? 0.003 : 0.008;
    nuc3d.zoom = Math.max(0.3, Math.min(20.0, nuc3d.zoom + e.deltaY * -factor));
    e.preventDefault();
  }

  function renderNucleus3D(nd) {
    const container = document.getElementById('nviz-nucleus3d');
    container.innerHTML = '';

    const z = nd.z;
    const n = nd.nucleons - z;
    const total = z + n;

    const { w: cw } = getNuclearVizSize(container);
    const size = cw;
    const { canvas, ctx } = makeHiDPICanvas(container, size, size);

    // Pack nucleons in a roughly spherical arrangement
    // Apply nuclear deformation β₂: prolate (>0) stretches z-axis, oblate (<0) compresses
    const nucleons = [];
    const spacing = total > 100 ? 3.2 : total > 40 ? 3.8 : total > 10 ? 4.5 : 6;
    const ne = typeof NUCLEAR_EXTRA !== 'undefined' ? NUCLEAR_EXTRA[nd.z] : null;
    const beta2 = ne ? ne.b2 : 0;
    // Deformation scale factors: z-axis stretches/compresses, xy compensates for volume
    // For quadrupole: R(θ) = R₀(1 + β₂·Y₂₀(θ)) ≈ R₀(1 + β₂·(3cos²θ-1)/2)
    // Simplified: stretch z by (1 + β₂), compress xy by 1/√(1+β₂) to preserve volume
    const defZ = 1 + beta2;
    const defXY = 1 / Math.sqrt(Math.abs(defZ) || 1);

    // Fibonacci sphere packing with decoupled radial layers
    // The angular distribution uses the golden angle for even spacing on the sphere.
    // The radial placement uses a shuffled index so inner/outer shells aren't
    // correlated with the polar angle — preventing the "pushed in" pole artifact.
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    // Build a radial index array and shuffle it deterministically
    const radialOrder = Array.from({ length: total }, (_, i) => i);
    // Deterministic shuffle (seeded by total) so it's stable per element
    for (let i = radialOrder.length - 1; i > 0; i--) {
      const j = ((i * 2654435761) >>> 0) % (i + 1); // Knuth multiplicative hash
      const tmp = radialOrder[i];
      radialOrder[i] = radialOrder[j];
      radialOrder[j] = tmp;
    }

    for (let i = 0; i < total; i++) {
      // Angular position from Fibonacci sphere (evenly distributed)
      const t = i / Math.max(total - 1, 1);
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = goldenAngle * i;

      // Radial position from shuffled index (decoupled from angle)
      const ri = radialOrder[i];
      const layer = Math.cbrt((ri + 0.5) / total);
      const r = layer * spacing * Math.cbrt(total) * 0.32;
      const x = r * Math.sin(inclination) * Math.cos(azimuth) * defXY;
      const y = r * Math.sin(inclination) * Math.sin(azimuth) * defXY;
      const zc = r * Math.cos(inclination) * defZ;
      const isProton = i < z;

      // Generate 3 valence quarks per nucleon
      // Proton: uud (2 up + 1 down), Neutron: udd (1 up + 2 down)
      // Each quark carries one QCD color charge: red, green, blue
      const quarkTypes = isProton ? ['u', 'u', 'd'] : ['u', 'd', 'd'];
      const colorCharges = ['r', 'g', 'b'];
      const qr = spacing * 0.18; // quark orbit radius (relative to nucleon center)
      const qPhase = i * 2.39996; // unique phase per nucleon
      const quarks = quarkTypes.map((flavor, qi) => {
        const angle = qPhase + qi * (Math.PI * 2 / 3);
        return {
          flavor,             // 'u' or 'd'
          color: colorCharges[qi],
          // Local offset from nucleon center
          lx: qr * Math.cos(angle),
          ly: qr * Math.sin(angle) * 0.6,
          lz: qr * Math.sin(angle) * 0.8,
        };
      });

      nucleons.push({ x, y, z: zc, isProton, quarks });
    }

    // Set up state
    nuc3d.canvas = canvas;
    nuc3d.ctx = ctx;
    nuc3d.nucleons = nucleons;
    nuc3d.nd = nd;
    nuc3d.size = size;
    nuc3d.spacing = spacing;
    nuc3d.camTheta = 0.3;
    nuc3d.camPhi = 0.25;
    nuc3d.zoom = 1.0;
    nuc3d.autoRotate = true;
    nuc3d.dragging = false;
    nuc3d.time = 0;

    canvas.style.cursor = 'grab';
    canvas.addEventListener('pointerdown', onNucPointerDown);
    canvas.addEventListener('pointermove', onNucPointerMove);
    canvas.addEventListener('pointerup', onNucPointerUp);
    canvas.addEventListener('pointerleave', onNucPointerUp);
    canvas.addEventListener('wheel', onNucWheel, { passive: false });

    startNucleusAnimation(nd, canvas);
  }

  function startNucleusAnimation(nd, canvasOpt) {
    if (nucleus3dAnimationId) {
      cancelAnimationFrame(nucleus3dAnimationId);
      nucleus3dAnimationId = null;
    }

    const container = document.getElementById('nviz-nucleus3d');
    const canvas = canvasOpt || container.querySelector('canvas');
    if (!canvas || !nuc3d.nucleons.length) return;

    const ctx = nuc3d.ctx || canvas.getContext('2d');
    const nucleons = nuc3d.nucleons;
    const size = nuc3d.size;
    const total = nucleons.length;
    const sc = size / 280;
    const baseR = (total > 100 ? 3.5 : total > 40 ? 5 : total > 10 ? 7 : 9) * sc;
    const fov = nuc3d.fov;
    const cx = size / 2, cy = size / 2;

    // Quark color map — QCD color charges
    const qcdColors = { r: '220,50,50', g: '50,200,50', b: '80,120,255' };
    // Quark flavor labels
    const flavorLabel = { u: 'u', d: 'd' };

    function camTransform(px, py, pz, cosT, sinT, cosP, sinP) {
      const rx = px * cosT + pz * sinT;
      const rz = -px * sinT + pz * cosT;
      const ry = py * cosP - rz * sinP;
      const rz2 = py * sinP + rz * cosP;
      const d = fov / (fov + rz2);
      return { sx: cx + rx * d * sc, sy: cy + ry * d * sc, depth: rz2, d };
    }

    function frame() {
      nuc3d.time += 0.016;
      if (nuc3d.autoRotate) {
        nuc3d.camTheta += 0.006;
      }

      const cosT = Math.cos(nuc3d.camTheta), sinT = Math.sin(nuc3d.camTheta);
      const cosP = Math.cos(nuc3d.camPhi),   sinP = Math.sin(nuc3d.camPhi);
      const zm = nuc3d.zoom;

      // Quark visibility ramps in over zoom 1.8–3.0
      const quarkReveal = Math.max(0, Math.min(1, (zm - 1.8) / 1.2));
      // Nucleon shell fades as quarks appear
      const shellOpacity = 1 - quarkReveal * 0.65;

      ctx.clearRect(0, 0, size, size);

      // ── Nuclear force range connections ──
      // Show strong force bonds between neighboring nucleons at intermediate zoom (0.8–2.0)
      const forceReveal = Math.max(0, Math.min(1, (zm - 0.8) / 0.5)) * Math.max(0, Math.min(1, (2.5 - zm) / 0.7));
      if (forceReveal > 0 && total > 1 && total <= 300) {
        const forceRange = nuc3d.spacing * 1.3; // ~1.5 fm range of strong nuclear force
        const forceRangeSq = forceRange * forceRange;
        for (let i = 0; i < total; i++) {
          for (let j = i + 1; j < total; j++) {
            const dx = nucleons[i].x - nucleons[j].x;
            const dy = nucleons[i].y - nucleons[j].y;
            const dz = nucleons[i].z - nucleons[j].z;
            const distSq = dx * dx + dy * dy + dz * dz;
            if (distSq < forceRangeSq) {
              const pi = camTransform(nucleons[i].x * zm, nucleons[i].y * zm, nucleons[i].z * zm, cosT, sinT, cosP, sinP);
              const pj = camTransform(nucleons[j].x * zm, nucleons[j].y * zm, nucleons[j].z * zm, cosT, sinT, cosP, sinP);
              const strength = 1 - Math.sqrt(distSq) / forceRange;
              const avgDepth = (pi.depth + pj.depth) / 2;
              const depthAlpha = Math.max(0.1, Math.min(1, (avgDepth + 60) / 120));
              ctx.beginPath();
              ctx.moveTo(pi.sx, pi.sy);
              ctx.lineTo(pj.sx, pj.sy);
              ctx.strokeStyle = `rgba(255,180,60,${(forceReveal * strength * depthAlpha * 0.18).toFixed(3)})`;
              ctx.lineWidth = Math.max(0.4, 0.8 * sc * strength);
              ctx.stroke();
            }
          }
        }
      }

      // Build all drawable items for depth sorting
      const drawList = [];

      nucleons.forEach((nuc, ni) => {
        const px = nuc.x * zm, py = nuc.y * zm, pz = nuc.z * zm;
        const proj = camTransform(px, py, pz, cosT, sinT, cosP, sinP);

        // Nucleon shell (always drawn, fades at high zoom)
        drawList.push({
          type: 'nucleon',
          sx: proj.sx, sy: proj.sy, depth: proj.depth, d: proj.d,
          isProton: nuc.isProton,
          shellOpacity,
          ni,
        });

        // Quarks (visible at zoom > 1.8)
        if (quarkReveal > 0) {
          const t = nuc3d.time;
          nuc.quarks.forEach((q, qi) => {
            // Quarks jitter/orbit slightly (confinement motion)
            const wobble = 0.3 * Math.sin(t * 2.5 + ni * 1.7 + qi * 2.1);
            const qx = nuc.x + q.lx + wobble * 0.15;
            const qy = nuc.y + q.ly + wobble * 0.12;
            const qz = nuc.z + q.lz + wobble * 0.1;

            const qProj = camTransform(qx * zm, qy * zm, qz * zm, cosT, sinT, cosP, sinP);
            drawList.push({
              type: 'quark',
              sx: qProj.sx, sy: qProj.sy, depth: qProj.depth, d: qProj.d,
              flavor: q.flavor,
              colorCharge: q.color,
              reveal: quarkReveal,
              parentSx: proj.sx, parentSy: proj.sy,
              qi,
            });
          });

          // Gluon springs between quark pairs (3 connections per nucleon)
          for (let a = 0; a < 3; a++) {
            const b = (a + 1) % 3;
            const qa = nuc.quarks[a], qb = nuc.quarks[b];
            const wa = 0.3 * Math.sin(t * 2.5 + ni * 1.7 + a * 2.1);
            const wb = 0.3 * Math.sin(t * 2.5 + ni * 1.7 + b * 2.1);
            const ax = (nuc.x + qa.lx + wa * 0.15) * zm;
            const ay = (nuc.y + qa.ly + wa * 0.12) * zm;
            const az = (nuc.z + qa.lz + wa * 0.1) * zm;
            const bx = (nuc.x + qb.lx + wb * 0.15) * zm;
            const by = (nuc.y + qb.ly + wb * 0.12) * zm;
            const bz = (nuc.z + qb.lz + wb * 0.1) * zm;
            const pa = camTransform(ax, ay, az, cosT, sinT, cosP, sinP);
            const pb = camTransform(bx, by, bz, cosT, sinT, cosP, sinP);
            drawList.push({
              type: 'gluon',
              depth: (pa.depth + pb.depth) / 2,
              x1: pa.sx, y1: pa.sy, x2: pb.sx, y2: pb.sy,
              d: (pa.d + pb.d) / 2,
              reveal: quarkReveal,
              time: t,
              idx: ni * 3 + a,
            });
          }
        }
      });

      // Sort back-to-front
      drawList.sort((a, b) => a.depth - b.depth);

      // Render all items
      drawList.forEach(item => {
        if (item.type === 'nucleon') {
          const depthNorm = (item.depth + 60) / 120;
          const depthFade = Math.max(0, Math.min(1, depthNorm));
          const r = baseR * item.d * (0.85 + 0.15 * depthFade);

          const fillAlpha = (0.25 + 0.45 * depthFade) * item.shellOpacity;
          const edgeAlpha = (0.4 + 0.5 * depthFade) * item.shellOpacity;

          const rgb = item.isProton ? '255,107,107' : '78,205,196';
          const edgeRgb = item.isProton ? '255,140,140' : '120,225,216';

          // At high zoom, show nucleon as translucent bubble
          ctx.beginPath();
          ctx.arc(item.sx, item.sy, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${fillAlpha.toFixed(3)})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(item.sx, item.sy, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${edgeRgb},${edgeAlpha.toFixed(3)})`;
          ctx.lineWidth = Math.max(0.8, 1.2 * item.d);
          ctx.stroke();

          // Specular highlight
          ctx.beginPath();
          ctx.arc(item.sx - r * 0.28, item.sy - r * 0.28, r * 0.32, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${(fillAlpha * 0.35).toFixed(3)})`;
          ctx.fill();

        } else if (item.type === 'gluon') {
          // Draw gluon as a wavy/helical "spring" between two quarks
          const dx = item.x2 - item.x1, dy = item.y2 - item.y1;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len < 1) return;
          const nx = -dy / len, ny = dx / len; // perpendicular
          const segments = 12;
          const amplitude = Math.min(len * 0.3, 3.5 * item.d * sc);

          ctx.beginPath();
          for (let s = 0; s <= segments; s++) {
            const frac = s / segments;
            const mx = item.x1 + dx * frac;
            const my = item.y1 + dy * frac;
            const wave = Math.sin(frac * Math.PI * 4 + item.time * 3 + item.idx) * amplitude;
            const px = mx + nx * wave;
            const py = my + ny * wave;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = `rgba(255,220,60,${(0.35 * item.reveal * item.d).toFixed(3)})`;
          ctx.lineWidth = Math.max(0.6, 0.9 * item.d * sc);
          ctx.stroke();

        } else if (item.type === 'quark') {
          const qr = (baseR * 0.38) * item.d * sc;
          const r = Math.max(1.5 * sc, qr);
          const alpha = item.reveal * Math.max(0.3, Math.min(1, (item.depth + 60) / 120));

          const rgb = qcdColors[item.colorCharge];

          // Gluon field haze around quark
          ctx.beginPath();
          ctx.arc(item.sx, item.sy, r * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${(alpha * 0.08).toFixed(3)})`;
          ctx.fill();

          // Quark body
          ctx.beginPath();
          ctx.arc(item.sx, item.sy, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${(alpha * 0.85).toFixed(3)})`;
          ctx.fill();

          // Bright edge
          ctx.beginPath();
          ctx.arc(item.sx, item.sy, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,255,255,${(alpha * 0.5).toFixed(3)})`;
          ctx.lineWidth = Math.max(0.5, 0.8 * item.d);
          ctx.stroke();

          // Flavor label at high zoom
          if (item.reveal > 0.5 && r > 3) {
            ctx.font = `bold ${Math.max(6, Math.round(r * 1.1))}px JetBrains Mono, monospace`;
            ctx.fillStyle = `rgba(255,255,255,${(alpha * 0.9).toFixed(3)})`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(flavorLabel[item.flavor], item.sx, item.sy + 0.5);
            ctx.textBaseline = 'alphabetic';
          }
        }
      });

      // ── Legend ──
      const fs = Math.round(11 * sc);
      ctx.textAlign = 'left';
      ctx.font = `${fs}px Inter, sans-serif`;
      ctx.fillStyle = '#ff6b6b';
      const sw = Math.round(8 * sc);
      const legendY = size - Math.round(22 * sc);
      ctx.fillRect(sw, legendY, sw, sw);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(`${nd.z}p`, sw * 2.5, size - Math.round(14 * sc));

      ctx.fillStyle = '#4ecdc4';
      ctx.fillRect(Math.round(58 * sc), legendY, sw, sw);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(`${nd.nucleons - nd.z}n`, Math.round(70 * sc), size - Math.round(14 * sc));

      // Quark legend (appears at high zoom)
      if (quarkReveal > 0.3) {
        const qa = Math.min(1, (quarkReveal - 0.3) / 0.4);
        const qlx = sw;
        const qly = legendY - Math.round(16 * sc);
        const qfs = Math.round(9 * sc);
        ctx.font = `${qfs}px Inter, sans-serif`;

        // Up quark
        ctx.beginPath();
        ctx.arc(qlx + sw / 2, qly + sw / 2 - 1, sw * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,50,50,${(qa * 0.8).toFixed(2)})`;
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${(qa * 0.7).toFixed(2)})`;
        ctx.fillText('up (⅔e)', qlx + sw + 4, qly + sw - 1);

        // Down quark
        const qlx2 = Math.round(90 * sc);
        ctx.beginPath();
        ctx.arc(qlx2 + sw / 2, qly + sw / 2 - 1, sw * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80,120,255,${(qa * 0.8).toFixed(2)})`;
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${(qa * 0.7).toFixed(2)})`;
        ctx.fillText('down (-⅓e)', qlx2 + sw + 4, qly + sw - 1);

        // Gluon indicator
        const gly = qly - Math.round(14 * sc);
        ctx.beginPath();
        ctx.moveTo(qlx, gly + sw / 2);
        for (let s = 0; s <= 8; s++) {
          const frac = s / 8;
          ctx.lineTo(qlx + frac * sw * 3, gly + sw / 2 + Math.sin(frac * Math.PI * 3) * 3 * sc);
        }
        ctx.strokeStyle = `rgba(255,220,60,${(qa * 0.6).toFixed(2)})`;
        ctx.lineWidth = Math.max(0.8, 1 * sc);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${(qa * 0.6).toFixed(2)})`;
        ctx.fillText('gluon (strong force)', qlx + sw * 3 + 4, gly + sw - 1);
      }

      // Zoom indicator + hint
      ctx.font = `${Math.round(9 * sc)}px JetBrains Mono, monospace`;
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.textAlign = 'right';
      if (zm < 1.6 && quarkReveal === 0) {
        ctx.fillText('scroll to zoom into quarks', size - sw, Math.round(14 * sc));
      }
      if (nuc3d.zoom !== 1.0) {
        ctx.fillText(`${nuc3d.zoom.toFixed(1)}×`, size - sw, size - Math.round(14 * sc));
      }

      // Deformation indicator
      const neData = typeof NUCLEAR_EXTRA !== 'undefined' ? NUCLEAR_EXTRA[nd.z] : null;
      if (neData && Math.abs(neData.b2) > 0.01) {
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(167,139,250,0.55)';
        const defLabel = neData.b2 > 0 ? 'prolate' : 'oblate';
        ctx.fillText(`β₂=${neData.b2 > 0 ? '+' : ''}${neData.b2.toFixed(2)} (${defLabel})`, sw, Math.round(14 * sc));
      }

      // Strong force range indicator (visible at intermediate zoom)
      if (forceReveal > 0.3) {
        const fAlpha = Math.min(1, (forceReveal - 0.3) / 0.4);
        const fLy = legendY - Math.round((quarkReveal > 0.3 ? 42 : 16) * sc);
        ctx.textAlign = 'left';
        ctx.beginPath();
        ctx.moveTo(sw, fLy + sw / 2);
        ctx.lineTo(sw + sw * 3, fLy + sw / 2);
        ctx.strokeStyle = `rgba(255,180,60,${(fAlpha * 0.5).toFixed(2)})`;
        ctx.lineWidth = Math.max(0.8, 1 * sc);
        ctx.stroke();
        ctx.font = `${Math.round(9 * sc)}px Inter, sans-serif`;
        ctx.fillStyle = `rgba(255,180,60,${(fAlpha * 0.6).toFixed(2)})`;
        ctx.fillText('strong force (~1.5 fm)', sw + sw * 3 + 4, fLy + sw - 1);
      }
      ctx.textAlign = 'left';

      nucleus3dAnimationId = requestAnimationFrame(frame);
    }

    frame();
  }

  // ═══════════════════════ DECAY CHAIN RENDERER ═══════════════════════
  function renderDecayChain(nd) {
    const container = document.getElementById('nviz-decaychain');
    container.innerHTML = '';

    if (!nd.decayChain || nd.decayChain.length === 0) {
      container.innerHTML = '<div style="color:var(--text-muted);font-size:0.8rem;text-align:center;padding:40px 12px;">No decay chain — this element has stable isotopes</div>';
      return;
    }

    const chain = nd.decayChain;
    const { w: cw } = getNuclearVizSize(container);
    const sc = cw / 280;
    const w = cw, h = Math.min(cw, Math.max(Math.round(240 * sc), Math.round(chain.length * 42 * sc + 50)));
    const { canvas, ctx } = makeHiDPICanvas(container, w, h);
    const stepH = (h - Math.round(40 * sc)) / Math.max(chain.length - 1, 1);
    const cx = w / 2;
    const startY = Math.round(20 * sc);

    const modeColors = {
      'α': '#ff6b6b',
      'β⁻': '#4ecdc4',
      'β⁺': '#ffd93d',
      'EC': '#a78bfa',
      'SF': '#ff9f43',
      'stable': '#4ecdc4',
    };

    chain.forEach((step, i) => {
      const y = startY + i * stepH;
      const isLast = step.mode === 'stable';

      // Draw connecting line from previous
      if (i > 0) {
        const py = startY + (i - 1) * stepH;
        const prevStep = chain[i - 1];
        ctx.beginPath();
        ctx.moveTo(cx, py + 12);
        ctx.lineTo(cx, y - 12);
        ctx.strokeStyle = modeColors[prevStep.mode] || '#666';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Decay mode label on the line
        ctx.font = `${Math.round(10 * sc)}px JetBrains Mono, monospace`;
        ctx.fillStyle = modeColors[prevStep.mode] || '#888';
        ctx.textAlign = 'left';
        ctx.fillText(prevStep.mode, cx + Math.round(16 * sc), (py + y) / 2 + 4);
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(cx, y, isLast ? Math.round(13 * sc) : Math.round(10 * sc), 0, Math.PI * 2);
      ctx.fillStyle = isLast ? 'rgba(78,205,196,0.2)' : 'rgba(255,107,107,0.15)';
      ctx.fill();
      ctx.strokeStyle = isLast ? '#4ecdc4' : '#ff6b6b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Isotope label
      ctx.font = `bold ${Math.round(10 * sc)}px JetBrains Mono, monospace`;
      ctx.fillStyle = isLast ? '#4ecdc4' : 'rgba(255,255,255,0.9)';
      ctx.textAlign = 'center';
      ctx.fillText(`${step.a}`, cx, y + 1);

      // Symbol on left
      ctx.font = `${Math.round(11 * sc)}px Inter, sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.textAlign = 'right';
      ctx.fillText(step.sym, cx - Math.round(18 * sc), y + 4);

      // Z on right
      ctx.font = `${Math.round(9 * sc)}px JetBrains Mono, monospace`;
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.textAlign = 'left';
      ctx.fillText(`Z=${step.z}`, cx + Math.round(18 * sc), y + 4);
    });
  }

  // ═══════════════════════ BINDING ENERGY CHART ═══════════════════════
  function renderBindingEnergyChart(nd) {
    const container = document.getElementById('nviz-binding');
    container.innerHTML = '';

    const { w: cw } = getNuclearVizSize(container);
    const sc = cw / 280;
    const w = cw, h = Math.round(cw * 0.82);
    const { canvas, ctx } = makeHiDPICanvas(container, w, h);
    const curve = typeof BINDING_ENERGY_CURVE !== 'undefined' ? BINDING_ENERGY_CURVE : [];
    if (curve.length === 0) return;

    const pad = { top: Math.round(20 * sc), right: Math.round(16 * sc), bottom: Math.round(32 * sc), left: Math.round(40 * sc) };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const maxA = 300, maxBE = 9;

    function xOf(a) { return pad.left + (a / maxA) * plotW; }
    function yOf(be) { return pad.top + plotH - (be / maxBE) * plotH; }

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let be = 0; be <= maxBE; be += 2) {
      ctx.beginPath();
      ctx.moveTo(pad.left, yOf(be));
      ctx.lineTo(w - pad.right, yOf(be));
      ctx.stroke();
    }
    for (let a = 0; a <= maxA; a += 50) {
      ctx.beginPath();
      ctx.moveTo(xOf(a), pad.top);
      ctx.lineTo(xOf(a), h - pad.bottom);
      ctx.stroke();
    }

    // Curve
    ctx.beginPath();
    curve.forEach(([a, be], i) => {
      const x = xOf(a), y = yOf(be);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = 'rgba(255, 217, 61, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(xOf(curve[curve.length - 1][0]), yOf(0));
    ctx.lineTo(xOf(curve[0][0]), yOf(0));
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
    grad.addColorStop(0, 'rgba(255, 217, 61, 0.15)');
    grad.addColorStop(1, 'rgba(255, 217, 61, 0.02)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Highlight current element
    const curA = nd.nucleons;
    const curBE = nd.bindingPerNucleon;
    const hx = xOf(curA), hy = yOf(curBE);

    ctx.beginPath();
    ctx.arc(hx, hy, Math.round(5 * sc), 0, Math.PI * 2);
    ctx.fillStyle = '#ff6b6b';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Label for current element
    ctx.font = `bold ${Math.round(10 * sc)}px Inter, sans-serif`;
    ctx.fillStyle = '#ff6b6b';
    ctx.textAlign = curA > 200 ? 'right' : 'left';
    const labelX = curA > 200 ? hx - Math.round(8 * sc) : hx + Math.round(8 * sc);
    ctx.fillText(`${nd.symbol}-${nd.nucleons}`, labelX, hy - Math.round(8 * sc));
    ctx.font = `${Math.round(9 * sc)}px JetBrains Mono, monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(`${curBE} MeV`, labelX, hy + Math.round(4 * sc));

    // Fe-56 peak marker if not the current element
    if (nd.z !== 26) {
      const feX = xOf(56), feY = yOf(8.79);
      ctx.beginPath();
      ctx.arc(feX, feY, Math.round(3 * sc), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(78,205,196,0.6)';
      ctx.fill();
      ctx.font = `${Math.round(8 * sc)}px Inter, sans-serif`;
      ctx.fillStyle = 'rgba(78,205,196,0.6)';
      ctx.textAlign = 'left';
      ctx.fillText('Fe-56', feX + Math.round(6 * sc), feY - Math.round(4 * sc));
    }

    // Axes
    ctx.font = `${Math.round(9 * sc)}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.textAlign = 'center';
    for (let a = 50; a <= 250; a += 50) {
      ctx.fillText(a, xOf(a), h - pad.bottom + Math.round(14 * sc));
    }
    ctx.textAlign = 'right';
    for (let be = 2; be <= 8; be += 2) {
      ctx.fillText(be, pad.left - Math.round(6 * sc), yOf(be) + 3);
    }

    // Axis labels
    ctx.font = `${Math.round(10 * sc)}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('Mass Number (A)', w / 2, h - Math.round(4 * sc));

    ctx.save();
    ctx.translate(Math.round(12 * sc), h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('B/A (MeV)', 0, 0);
    ctx.restore();
  }

  // ═══════════════════════ NUCLEAR SHELL DIAGRAM ═══════════════════════
  function renderNuclearShells(nd) {
    const container = document.getElementById('nviz-shells');
    container.innerHTML = '';

    const shells = typeof NUCLEAR_SHELLS !== 'undefined' ? NUCLEAR_SHELLS : [];
    if (shells.length === 0) return;

    const z = nd.z;
    const n = nd.nucleons - z;

    const { w: cw } = getNuclearVizSize(container);
    const sc = cw / 280;

    // Find highest relevant shell for both protons and neutrons
    const maxParticles = Math.max(z, n);
    let maxShellIdx = 0;
    for (let i = 0; i < shells.length; i++) {
      if (shells[i].cumulative <= maxParticles + shells[i].capacity) maxShellIdx = i;
    }
    maxShellIdx = Math.min(maxShellIdx + 1, shells.length - 1);

    const numLevels = maxShellIdx + 1;

    // Dynamic height: grow canvas if many levels so they don't overlap
    const minLevelH = Math.round(14 * sc);
    const idealH = Math.round(40 * sc) + numLevels * minLevelH;
    const w = cw;
    const h = Math.max(cw, idealH);
    const { canvas, ctx } = makeHiDPICanvas(container, w, h);

    const levelH = (h - Math.round(40 * sc)) / numLevels;

    // Layout columns — give more room to labels on the left, magic numbers in center
    const labelW = Math.round(42 * sc);  // space for shell labels like "1h₁₁/₂"
    const gapW = Math.round(20 * sc);    // center gap for magic numbers
    const colW = (w - labelW - gapW) / 2;
    const colLeftX = labelW;
    const colRightX = labelW + colW + gapW;
    const startY = h - Math.round(18 * sc);

    // Title
    const titleFs = Math.max(8, Math.round(9 * sc));
    ctx.font = `${titleFs}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('Protons', colLeftX + colW / 2, Math.round(12 * sc));
    ctx.fillText('Neutrons', colRightX + colW / 2, Math.round(12 * sc));

    // Draw levels
    let protonsFilled = 0;
    let neutronsFilled = 0;

    // Only show labels if they won't overlap (skip every other label at small heights)
    const labelSkip = levelH < 10 * sc ? 2 : 1;

    for (let i = 0; i <= maxShellIdx; i++) {
      const shell = shells[i];
      const y = startY - i * levelH;

      // Proton filling
      const pFill = Math.min(shell.capacity, Math.max(0, z - protonsFilled));
      const pFrac = pFill / shell.capacity;
      protonsFilled += pFill;

      // Neutron filling
      const nFill = Math.min(shell.capacity, Math.max(0, n - neutronsFilled));
      const nFrac = nFill / shell.capacity;
      neutronsFilled += nFill;

      // Draw proton level bar
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fillRect(colLeftX, y - levelH + 3, colW, levelH - 4);
      if (pFrac > 0) {
        ctx.fillStyle = `rgba(255, 107, 107, ${0.3 + pFrac * 0.5})`;
        ctx.fillRect(colLeftX, y - levelH + 3, colW * pFrac, levelH - 4);
      }

      // Draw neutron level bar
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fillRect(colRightX, y - levelH + 3, colW, levelH - 4);
      if (nFrac > 0) {
        ctx.fillStyle = `rgba(78, 205, 196, ${0.3 + nFrac * 0.5})`;
        ctx.fillRect(colRightX, y - levelH + 3, colW * nFrac, levelH - 4);
      }

      // Shell label (left of proton column)
      if (i % labelSkip === 0) {
        const labelFs = Math.max(6, Math.round(7 * sc));
        ctx.font = `${labelFs}px JetBrains Mono, monospace`;
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.textAlign = 'right';
        ctx.fillText(shell.label, colLeftX - Math.round(3 * sc), y - levelH / 2 + Math.round(4 * sc));
      }

      // Magic number line + label (in center gap)
      if (shell.magic) {
        ctx.beginPath();
        ctx.moveTo(colLeftX - 2, y + 2);
        ctx.lineTo(colRightX + colW + 2, y + 2);
        ctx.strokeStyle = 'rgba(255, 217, 61, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        const magicFs = Math.max(6, Math.round(8 * sc));
        ctx.font = `bold ${magicFs}px JetBrains Mono, monospace`;
        ctx.fillStyle = 'rgba(255, 217, 61, 0.6)';
        ctx.textAlign = 'center';
        ctx.fillText(shell.cumulative, colLeftX + colW + gapW / 2, y + 1);
      }
    }
  }

  // ═══════════════════════ CHART OF NUCLIDES RENDERER ═══════════════════════
  // Shows a Z (proton) vs N (neutron) grid colored by decay mode
  // Centered on the current element with ~15 Z above/below
  function renderNuclideChart(nd) {
    const container = document.getElementById('nviz-nuclides');
    container.innerHTML = '';

    if (typeof NUCLIDE_RANGES === 'undefined') return;

    const { w: cw } = getNuclearVizSize(container);
    const sc = cw / 280;
    const currentZ = nd.z;
    const currentN = nd.nucleons - nd.z;

    // Determine Z window
    const halfWin = 15;
    const zMin = Math.max(1, currentZ - halfWin);
    const zMax = Math.min(NUCLIDE_RANGES.length - 1, currentZ + halfWin);

    // Find N range across visible elements
    let nMin = Infinity, nMax = -Infinity;
    for (let z = zMin; z <= zMax; z++) {
      const range = NUCLIDE_RANGES[z];
      if (!range) continue;
      nMin = Math.min(nMin, range[0]);
      nMax = Math.max(nMax, range[1]);
    }
    if (!isFinite(nMin)) return;

    // Layout
    const margin = { top: Math.round(20 * sc), right: Math.round(12 * sc), bottom: Math.round(32 * sc), left: Math.round(36 * sc) };
    const plotW = cw - margin.left - margin.right;
    const plotH = cw - margin.top - margin.bottom;
    const cols = nMax - nMin + 1;
    const rows = zMax - zMin + 1;
    const cellW = Math.min(plotW / cols, plotH / rows);
    const cellH = cellW;

    const canvasW = cw;
    const canvasH = Math.round(margin.top + rows * cellH + margin.bottom);
    const { canvas, ctx } = makeHiDPICanvas(container, canvasW, canvasH);

    // Stability line approximation: N_stable ≈ Z + 0.006 * Z^2
    function stableN(z) { return z + 0.006 * z * z; }

    // Decay mode heuristic color
    function nuclideColor(z, n, isStable) {
      if (isStable) return '#333333';
      const a = z + n;
      if (z > 83 && a > 209) {
        if (n > 150 && z > 96) return '#4caf50'; // SF (green)
        return '#ffd93d'; // alpha (gold)
      }
      const ns = stableN(z);
      if (n < ns - 1) return '#ff6b6b'; // beta+/EC (red) — proton-rich
      if (n > ns + 1) return '#4a9eff'; // beta- (blue) — neutron-rich
      return '#888888'; // near stability (grey)
    }

    // Draw background
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(margin.left, margin.top, cols * cellW, rows * cellH);

    // Draw nuclide cells
    for (let z = zMin; z <= zMax; z++) {
      const range = NUCLIDE_RANGES[z];
      if (!range) continue;
      const [rNmin, rNmax, stableNs] = range;
      const row = zMax - z; // Z increases upward
      const y = margin.top + row * cellH;

      for (let n = rNmin; n <= rNmax; n++) {
        const col = n - nMin;
        const x = margin.left + col * cellW;
        const isStable = stableNs.includes(n);
        const color = nuclideColor(z, n, isStable);

        ctx.fillStyle = color;
        ctx.fillRect(x + 0.5, y + 0.5, Math.max(cellW - 1, 1), Math.max(cellH - 1, 1));
      }

      // Highlight current element's row
      if (z === currentZ) {
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = Math.max(1, 1.5 * sc);
        ctx.strokeRect(margin.left + (range[0] - nMin) * cellW, y, (range[1] - range[0] + 1) * cellW, cellH);
      }
    }

    // Mark current nuclide
    const curCol = currentN - nMin;
    const curRow = zMax - currentZ;
    if (curCol >= 0 && curRow >= 0) {
      const cx = margin.left + curCol * cellW + cellW / 2;
      const cy = margin.top + curRow * cellH + cellH / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(cellW * 0.6, 3), 0, Math.PI * 2);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = Math.max(1.5, 2 * sc);
      ctx.stroke();
    }

    // Axes
    const axisFs = Math.max(7, Math.round(8 * sc));
    ctx.font = `${axisFs}px JetBrains Mono, monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    // Y-axis: Z labels (every 5 or every 2 depending on density)
    const zStep = rows > 20 ? 5 : rows > 10 ? 2 : 1;
    for (let z = zMin; z <= zMax; z++) {
      if (z % zStep !== 0 && z !== currentZ) continue;
      const row = zMax - z;
      const y = margin.top + row * cellH + cellH / 2;
      ctx.fillStyle = z === currentZ ? '#ff6b6b' : 'rgba(255,255,255,0.5)';
      ctx.fillText(z.toString(), margin.left - 4, y);
    }

    // X-axis: N labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const nStep = cols > 30 ? 10 : cols > 15 ? 5 : cols > 8 ? 2 : 1;
    for (let n = nMin; n <= nMax; n++) {
      if (n % nStep !== 0 && n !== currentN) continue;
      const col = n - nMin;
      const x = margin.left + col * cellW + cellW / 2;
      ctx.fillStyle = n === currentN ? '#ff6b6b' : 'rgba(255,255,255,0.5)';
      ctx.fillText(n.toString(), x, margin.top + rows * cellH + 3);
    }

    // Axis titles
    const titleFs = Math.max(8, Math.round(9 * sc));
    ctx.font = `bold ${titleFs}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('Neutron number N', margin.left + (cols * cellW) / 2, canvasH - 3);

    ctx.save();
    ctx.translate(Math.round(10 * sc), margin.top + (rows * cellH) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Proton number Z', 0, 0);
    ctx.restore();

    // Legend
    const legY = Math.round(4 * sc);
    const legFs = Math.max(6, Math.round(7 * sc));
    ctx.font = `${legFs}px Inter, sans-serif`;
    const legItems = [
      { color: '#333333', label: 'Stable' },
      { color: '#4a9eff', label: 'β⁻' },
      { color: '#ff6b6b', label: 'β⁺/EC' },
      { color: '#ffd93d', label: 'α' },
      { color: '#4caf50', label: 'SF' },
    ];
    let legX = margin.left;
    legItems.forEach(item => {
      ctx.fillStyle = item.color;
      const bx = Math.round(6 * sc);
      ctx.fillRect(legX, legY, bx, bx);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      legX += bx + 2;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legX, legY);
      legX += ctx.measureText(item.label).width + Math.round(8 * sc);
    });

    // Title
    ctx.font = `bold ${Math.max(8, Math.round(9 * sc))}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.textAlign = 'right';
    ctx.fillText(`${nd.symbol}-${nd.nucleons}`, canvasW - margin.right, legY + Math.round(8 * sc));
  }

  // ═══════════════════════ SEMF BREAKDOWN (WATERFALL) ═══════════════════════
  // Weizsäcker semi-empirical mass formula: B = aV*A - aS*A^(2/3) - aC*Z(Z-1)/A^(1/3) - aA*(N-Z)^2/A ± δ
  function renderSEMF(nd) {
    const container = document.getElementById('nviz-semf');
    container.innerHTML = '';

    const { w: cw } = getNuclearVizSize(container);
    const sc = cw / 280;
    const w = cw, h = Math.round(cw * 0.95);
    const { canvas, ctx } = makeHiDPICanvas(container, w, h);

    const A = nd.nucleons;
    const Z = nd.z;
    const N = A - Z;

    // SEMF coefficients (MeV) — standard Weizsäcker values
    const aV = 15.75, aS = 17.8, aC = 0.711, aA = 23.7;
    // Pairing term
    const delta0 = 11.2;
    let delta = 0;
    if (Z % 2 === 0 && N % 2 === 0) delta = delta0 / Math.sqrt(A);   // even-even
    else if (Z % 2 !== 0 && N % 2 !== 0) delta = -delta0 / Math.sqrt(A); // odd-odd

    // Individual terms (total binding energy, not per nucleon)
    const volume = aV * A;
    const surface = -aS * Math.pow(A, 2/3);
    const coulomb = -aC * Z * (Z - 1) / Math.pow(A, 1/3);
    const asymmetry = -aA * Math.pow(N - Z, 2) / A;
    const pairing = delta;
    const predicted = volume + surface + coulomb + asymmetry + pairing;
    const actual = nd.bindingPerNucleon * A;

    const terms = [
      { label: 'Volume', value: volume, color: '#4ecdc4', formula: `aᵥA = ${volume.toFixed(1)}` },
      { label: 'Surface', value: surface, color: '#ff6b6b', formula: `−aₛA²ᐟ³ = ${surface.toFixed(1)}` },
      { label: 'Coulomb', value: coulomb, color: '#ffd93d', formula: `−a꜀Z(Z−1)/A¹ᐟ³ = ${coulomb.toFixed(1)}` },
      { label: 'Asymmetry', value: asymmetry, color: '#a78bfa', formula: `−aₐ(N−Z)²/A = ${asymmetry.toFixed(1)}` },
      { label: 'Pairing', value: pairing, color: '#ff9f43', formula: `δ = ${pairing >= 0 ? '+' : ''}${pairing.toFixed(1)}` },
    ];

    const pad = { top: Math.round(28 * sc), right: Math.round(12 * sc), bottom: Math.round(70 * sc), left: Math.round(48 * sc) };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    // Find scale — waterfall goes from 0 to volume (max) and result could be near volume
    const maxVal = volume * 1.05;
    const minVal = Math.min(0, predicted - 50);

    function yOf(v) { return pad.top + plotH * (1 - (v - minVal) / (maxVal - minVal)); }

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    const gridStep = maxVal > 2000 ? 500 : maxVal > 500 ? 200 : maxVal > 100 ? 50 : 20;
    for (let v = 0; v <= maxVal; v += gridStep) {
      ctx.beginPath();
      ctx.moveTo(pad.left, yOf(v));
      ctx.lineTo(w - pad.right, yOf(v));
      ctx.stroke();
    }

    // Draw waterfall bars
    const barW = plotW / 7; // 5 terms + predicted + actual
    const gap = barW * 0.15;
    let running = 0;

    terms.forEach((term, i) => {
      const x = pad.left + i * barW + gap;
      const bw = barW - gap * 2;
      const prevRunning = running;
      running += term.value;

      const y1 = yOf(prevRunning);
      const y2 = yOf(running);

      // Bar
      const top = Math.min(y1, y2);
      const barH = Math.abs(y2 - y1);
      ctx.fillStyle = term.color;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(x, top, bw, Math.max(barH, 1));
      ctx.globalAlpha = 1;

      // Connecting line to next bar
      if (i < terms.length - 1) {
        ctx.beginPath();
        ctx.moveTo(x + bw, yOf(running));
        ctx.lineTo(x + barW + gap, yOf(running));
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Label
      ctx.font = `bold ${Math.max(6, Math.round(6.5 * sc))}px Inter, sans-serif`;
      ctx.fillStyle = term.color;
      ctx.textAlign = 'center';
      ctx.fillText(term.label, x + bw / 2, pad.top + plotH + Math.round(12 * sc));

      // Value on bar
      ctx.font = `${Math.max(5, Math.round(6 * sc))}px JetBrains Mono, monospace`;
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      const valY = term.value >= 0 ? top - Math.round(4 * sc) : top + barH + Math.round(10 * sc);
      ctx.fillText(`${term.value.toFixed(0)}`, x + bw / 2, valY);
    });

    // Predicted total bar
    const predX = pad.left + 5 * barW + gap;
    const predBW = barW - gap * 2;
    const predY = yOf(Math.max(predicted, 0));
    const predH = Math.abs(yOf(0) - yOf(Math.abs(predicted)));
    ctx.fillStyle = '#888';
    ctx.globalAlpha = 0.5;
    ctx.fillRect(predX, predY, predBW, Math.max(predH, 1));
    ctx.globalAlpha = 1;
    ctx.font = `bold ${Math.max(6, Math.round(6.5 * sc))}px Inter, sans-serif`;
    ctx.fillStyle = '#aaa';
    ctx.textAlign = 'center';
    ctx.fillText('SEMF', predX + predBW / 2, pad.top + plotH + Math.round(12 * sc));
    ctx.font = `${Math.max(5, Math.round(6 * sc))}px JetBrains Mono, monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText(`${predicted.toFixed(0)}`, predX + predBW / 2, predY - Math.round(4 * sc));

    // Actual total bar
    const actX = pad.left + 6 * barW + gap;
    const actBW = barW - gap * 2;
    const actY = yOf(Math.max(actual, 0));
    const actH = Math.abs(yOf(0) - yOf(Math.abs(actual)));
    ctx.fillStyle = '#4ecdc4';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(actX, actY, actBW, Math.max(actH, 1));
    ctx.globalAlpha = 1;
    ctx.font = `bold ${Math.max(6, Math.round(6.5 * sc))}px Inter, sans-serif`;
    ctx.fillStyle = '#4ecdc4';
    ctx.textAlign = 'center';
    ctx.fillText('Actual', actX + actBW / 2, pad.top + plotH + Math.round(12 * sc));
    ctx.font = `${Math.max(5, Math.round(6 * sc))}px JetBrains Mono, monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText(`${actual.toFixed(0)}`, actX + actBW / 2, actY - Math.round(4 * sc));

    // Delta (shell effect) indicator
    const diff = actual - predicted;
    const diffPct = predicted !== 0 ? (diff / predicted * 100).toFixed(1) : '0.0';
    ctx.font = `${Math.max(5, Math.round(6 * sc))}px JetBrains Mono, monospace`;
    ctx.fillStyle = Math.abs(diff) > 20 ? '#ffd93d' : 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.fillText(`Δ = ${diff >= 0 ? '+' : ''}${diff.toFixed(1)} MeV (${diffPct}%)`, (predX + actX + actBW) / 2, actY - Math.round(14 * sc));

    // Y-axis labels
    ctx.font = `${Math.max(6, Math.round(7 * sc))}px JetBrains Mono, monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.textAlign = 'right';
    for (let v = 0; v <= maxVal; v += gridStep) {
      ctx.fillText(v.toFixed(0), pad.left - Math.round(4 * sc), yOf(v) + 3);
    }

    // Y-axis title
    ctx.font = `${Math.max(7, Math.round(8 * sc))}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.save();
    ctx.translate(Math.round(10 * sc), pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Binding Energy (MeV)', 0, 0);
    ctx.restore();

    // Title
    ctx.font = `bold ${Math.max(8, Math.round(9 * sc))}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'left';
    ctx.fillText(`${nd.symbol}-${A}: SEMF Breakdown`, pad.left, Math.round(14 * sc));

    // Formula legend at bottom
    ctx.font = `${Math.max(5, Math.round(5.5 * sc))}px JetBrains Mono, monospace`;
    ctx.textAlign = 'left';
    let ly = pad.top + plotH + Math.round(24 * sc);
    terms.forEach(term => {
      ctx.fillStyle = term.color;
      ctx.fillText(term.formula, pad.left, ly);
      ly += Math.round(9 * sc);
    });

    // Pairing explanation
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    const pairType = (Z % 2 === 0 && N % 2 === 0) ? 'even-even (+δ)' : (Z % 2 !== 0 && N % 2 !== 0) ? 'odd-odd (−δ)' : 'odd-A (δ=0)';
    ctx.fillText(pairType, pad.left + Math.round(120 * sc), ly - Math.round(11 * sc));
  }

  // ═══════════════════════ HALF-LIFE DECAY CURVE ═══════════════════════
  function renderDecayCurve(nd) {
    const container = document.getElementById('nviz-decaycurve');
    container.innerHTML = '';

    const { w: cw } = getNuclearVizSize(container);
    const sc = cw / 280;
    const w = cw, h = Math.round(cw * 0.85);
    const { canvas, ctx } = makeHiDPICanvas(container, w, h);

    // Find the primary radioactive isotope's half-life
    let halfLifeStr = null;
    let halfLifeSec = null;
    let isoName = null;

    if (!nd.stable) {
      // Use the most abundant or first radioactive isotope
      for (const iso of nd.isotopes) {
        if (iso.halfLife !== 'stable' && iso.halfLife) {
          halfLifeStr = iso.halfLife;
          halfLifeSec = parseHalfLife(iso.halfLife);
          isoName = iso.name;
          if (iso.abundance > 0) break; // prefer abundant isotope
        }
      }
    }

    const pad = { top: Math.round(24 * sc), right: Math.round(16 * sc), bottom: Math.round(36 * sc), left: Math.round(44 * sc) };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    if (nd.stable) {
      // Stable element — show why it's stable
      ctx.fillStyle = 'rgba(78,205,196,0.08)';
      ctx.fillRect(0, 0, w, h);

      const ne = typeof NUCLEAR_EXTRA !== 'undefined' ? NUCLEAR_EXTRA[nd.z] : null;
      const A = nd.nucleons, Z = nd.z, N = A - Z;
      const isEvenEven = Z % 2 === 0 && N % 2 === 0;
      const nzRatio = N / Math.max(Z, 1);
      const optimalNZ = 1 + 0.015 * A;

      // Centered info block
      let ty = Math.round(30 * sc);
      const cxPos = w / 2;

      ctx.font = `bold ${Math.round(12 * sc)}px Inter, sans-serif`;
      ctx.fillStyle = '#4ecdc4';
      ctx.textAlign = 'center';
      ctx.fillText('● Stable Nucleus', cxPos, ty);
      ty += Math.round(24 * sc);

      ctx.font = `${Math.round(9 * sc)}px Inter, sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.7)';

      // Stability factors
      const factors = [];
      factors.push(`N/Z ratio: ${nzRatio.toFixed(2)} (optimal ≈ ${optimalNZ.toFixed(2)})`);
      factors.push(`Nucleon type: ${isEvenEven ? 'even-even (most stable)' : Z % 2 === 0 || N % 2 === 0 ? 'even-odd' : 'odd-odd'}`);

      // Check magic numbers
      const magicNums = [2, 8, 20, 28, 50, 82, 126];
      const magicZ = magicNums.includes(Z);
      const magicN = magicNums.includes(N);
      if (magicZ && magicN) factors.push('★ Doubly magic nucleus!');
      else if (magicZ) factors.push('★ Magic proton number');
      else if (magicN) factors.push('★ Magic neutron number');

      if (ne && ne.Sn !== null) factors.push(`Neutron separation: ${ne.Sn.toFixed(1)} MeV`);
      if (ne && ne.Sp !== null) factors.push(`Proton separation: ${ne.Sp.toFixed(1)} MeV`);

      // Binding energy context
      factors.push(`B/A: ${nd.bindingPerNucleon} MeV/nucleon`);

      factors.forEach(f => {
        ctx.fillText(f, cxPos, ty);
        ty += Math.round(16 * sc);
      });

      // Small note
      ctx.font = `${Math.round(7.5 * sc)}px Inter, sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ty += Math.round(10 * sc);
      ctx.fillText('No decay curve — this nucleus does not undergo', cxPos, ty);
      ty += Math.round(12 * sc);
      ctx.fillText('spontaneous radioactive decay.', cxPos, ty);

      return;
    }

    if (!halfLifeSec || halfLifeSec <= 0) {
      container.innerHTML = '<div style="color:var(--text-muted);font-size:0.8rem;text-align:center;padding:40px 12px;">Half-life data not available for this isotope</div>';
      return;
    }

    // Plot N(t)/N₀ = (1/2)^(t/t½) over 6 half-lives
    const numHL = 6;
    const tMax = halfLifeSec * numHL;

    function xOf(t) { return pad.left + (t / tMax) * plotW; }
    function yOf(frac) { return pad.top + plotH * (1 - frac); }

    // Background grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let f = 0; f <= 1; f += 0.25) {
      ctx.beginPath();
      ctx.moveTo(pad.left, yOf(f));
      ctx.lineTo(w - pad.right, yOf(f));
      ctx.stroke();
    }
    for (let hl = 1; hl <= numHL; hl++) {
      const xHL = xOf(hl * halfLifeSec);
      ctx.beginPath();
      ctx.moveTo(xHL, pad.top);
      ctx.lineTo(xHL, pad.top + plotH);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.stroke();
    }

    // Fill under curve
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(1));
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * tMax;
      const frac = Math.pow(0.5, t / halfLifeSec);
      ctx.lineTo(xOf(t), yOf(frac));
    }
    ctx.lineTo(xOf(tMax), yOf(0));
    ctx.lineTo(xOf(0), yOf(0));
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
    grad.addColorStop(0, 'rgba(255,107,107,0.2)');
    grad.addColorStop(1, 'rgba(255,107,107,0.02)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Decay curve
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * tMax;
      const frac = Math.pow(0.5, t / halfLifeSec);
      if (i === 0) ctx.moveTo(xOf(t), yOf(frac));
      else ctx.lineTo(xOf(t), yOf(frac));
    }
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Half-life markers
    for (let hl = 1; hl <= numHL; hl++) {
      const t = hl * halfLifeSec;
      const frac = Math.pow(0.5, hl);
      const mx = xOf(t), my = yOf(frac);

      // Dashed lines to axes
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(pad.left, my);
      ctx.strokeStyle = 'rgba(255,217,61,0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx, pad.top + plotH);
      ctx.strokeStyle = 'rgba(255,217,61,0.25)';
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Marker dot
      ctx.beginPath();
      ctx.arc(mx, my, Math.round(3.5 * sc), 0, Math.PI * 2);
      ctx.fillStyle = '#ffd93d';
      ctx.fill();

      // Fraction label on left
      ctx.font = `${Math.max(6, Math.round(7 * sc))}px JetBrains Mono, monospace`;
      ctx.fillStyle = '#ffd93d';
      ctx.textAlign = 'right';
      const fracStr = hl <= 3 ? `1/${Math.pow(2, hl)}` : `${(frac * 100).toFixed(1)}%`;
      ctx.fillText(fracStr, pad.left - Math.round(3 * sc), my + 3);

      // Half-life count on bottom
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(`${hl}t½`, mx, pad.top + plotH + Math.round(14 * sc));
    }

    // Y-axis labels
    ctx.font = `${Math.max(6, Math.round(7 * sc))}px JetBrains Mono, monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.textAlign = 'right';
    ctx.fillText('100%', pad.left - Math.round(3 * sc), yOf(1) + 3);
    ctx.fillText('50%', pad.left - Math.round(3 * sc), yOf(0.5) + 3);
    ctx.fillText('0%', pad.left - Math.round(3 * sc), yOf(0) + 3);

    // Y-axis title
    ctx.font = `${Math.max(7, Math.round(8 * sc))}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.save();
    ctx.translate(Math.round(10 * sc), pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('N(t) / N₀', 0, 0);
    ctx.restore();

    // X-axis title
    ctx.textAlign = 'center';
    ctx.fillText('Time', w / 2, h - Math.round(4 * sc));

    // Title & half-life info
    ctx.font = `bold ${Math.max(8, Math.round(9 * sc))}px Inter, sans-serif`;
    ctx.fillStyle = '#ff6b6b';
    ctx.textAlign = 'left';
    ctx.fillText(`${isoName || nd.symbol + '-' + nd.nucleons}`, pad.left, Math.round(14 * sc));

    ctx.font = `${Math.max(7, Math.round(8 * sc))}px JetBrains Mono, monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'right';
    ctx.fillText(`t½ = ${halfLifeStr}`, w - pad.right, Math.round(14 * sc));

    // Formula at bottom
    ctx.font = `${Math.max(6, Math.round(7 * sc))}px JetBrains Mono, monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.textAlign = 'center';
    ctx.fillText('N(t) = N₀ · (½)^(t/t½)', w / 2, h - Math.round(16 * sc));
  }

  // Parse half-life strings to seconds
  function parseHalfLife(str) {
    if (!str || str === 'stable') return 0;
    const s = str.toString().trim();
    // Handle ">X y" format
    const cleaned = s.replace(/^>/, '');
    const num = parseFloat(cleaned);
    if (isNaN(num)) return 0;
    // Match units (order matters — check longer suffixes first)
    if (/Ey$/i.test(cleaned))    return num * 3.156e25;  // exayears
    if (/Gy$/i.test(cleaned))    return num * 3.156e16;  // gigayears
    if (/My$/i.test(cleaned))    return num * 3.156e13;  // megayears
    if (/ky$/i.test(cleaned))    return num * 3.156e10;  // kiloyears
    if (/ms$/i.test(cleaned))    return num * 1e-3;      // milliseconds
    if (/μs|µs/i.test(cleaned))  return num * 1e-6;      // microseconds
    if (/ns$/i.test(cleaned))    return num * 1e-9;      // nanoseconds
    if (/\by$/i.test(cleaned) || /\s+y$/i.test(cleaned)) return num * 3.156e7;  // years
    if (/\bd$/i.test(cleaned) || /\s+d$/i.test(cleaned)) return num * 86400;    // days
    if (/\bh$/i.test(cleaned) || /\s+h$/i.test(cleaned)) return num * 3600;     // hours
    if (/\bm$/i.test(cleaned) || /\s+m$/i.test(cleaned)) return num * 60;       // minutes
    if (/\bs$/i.test(cleaned) || /\s+s$/i.test(cleaned)) return num;            // seconds
    return num; // assume seconds
  }

  // ═══════════════════════ NUCLEAR ANALYSIS PANEL ═══════════════════════
  // Shows: mass defect/E=mc², stability analysis, fission/fusion context
  function buildNuclearAnalysis(nd) {
    const el = document.getElementById('nuclear-analysis');
    if (!el) return;

    const ne = typeof NUCLEAR_EXTRA !== 'undefined' ? NUCLEAR_EXTRA[nd.z] : null;
    const A = nd.nucleons, Z = nd.z, N = A - Z;

    let html = '';

    // ── Mass Defect & E = mc² ──
    const mp = 938.272;  // proton mass MeV/c²
    const mn = 939.565;  // neutron mass MeV/c²
    const freeMass = Z * mp + N * mn; // sum of free nucleon masses
    const bindingTotal = nd.bindingPerNucleon * A;
    const nuclearMass = freeMass - bindingTotal;
    const massDefect = freeMass - nuclearMass; // = bindingTotal

    html += '<div class="nuc-analysis-section">';
    html += '<div class="nuc-analysis-title">E = mc² Mass Defect</div>';
    html += '<div class="nuc-analysis-grid">';
    html += `<div class="nuc-analysis-item"><span class="nuc-label">Free nucleons</span><span class="nuc-value">${freeMass.toFixed(1)} MeV/c²</span></div>`;
    html += `<div class="nuc-analysis-item"><span class="nuc-label">Nuclear mass</span><span class="nuc-value">${nuclearMass.toFixed(1)} MeV/c²</span></div>`;
    html += `<div class="nuc-analysis-item nuc-highlight"><span class="nuc-label">Δm (mass defect)</span><span class="nuc-value">${massDefect.toFixed(1)} MeV/c²</span></div>`;
    html += `<div class="nuc-analysis-item"><span class="nuc-label">Δm per nucleon</span><span class="nuc-value">${nd.bindingPerNucleon} MeV</span></div>`;
    html += '</div>';
    // Express in kg for educational context
    const massDefectKg = (massDefect * 1.783e-30); // MeV to kg
    const massDefectU = massDefect / 931.494;
    html += `<div class="nuc-analysis-note">Δm = ${massDefectU.toFixed(4)} u = ${massDefectKg.toExponential(2)} kg</div>`;
    html += '</div>';

    // ── Stability Analysis ──
    const nzRatio = N / Math.max(Z, 1);
    const optimalNZ = 1 + 0.015 * A;
    const isEvenEven = Z % 2 === 0 && N % 2 === 0;
    const isOddOdd = Z % 2 !== 0 && N % 2 !== 0;
    const magicNums = [2, 8, 20, 28, 50, 82, 126];
    const magicZ = magicNums.includes(Z);
    const magicN = magicNums.includes(N);

    html += '<div class="nuc-analysis-section">';
    html += '<div class="nuc-analysis-title">Stability Analysis</div>';
    html += '<div class="nuc-analysis-grid">';

    // N/Z ratio
    const nzDev = Math.abs(nzRatio - optimalNZ);
    const nzClass = nzDev < 0.15 ? 'nuc-good' : nzDev < 0.5 ? 'nuc-warn' : 'nuc-bad';
    html += `<div class="nuc-analysis-item ${nzClass}"><span class="nuc-label">N/Z ratio</span><span class="nuc-value">${nzRatio.toFixed(2)} <small>(opt: ${optimalNZ.toFixed(2)})</small></span></div>`;

    // Pairing
    const pairClass = isEvenEven ? 'nuc-good' : isOddOdd ? 'nuc-bad' : '';
    const pairLabel = isEvenEven ? 'even-even ✓' : isOddOdd ? 'odd-odd ✗' : Z % 2 === 0 ? 'even Z, odd N' : 'odd Z, even N';
    html += `<div class="nuc-analysis-item ${pairClass}"><span class="nuc-label">Parity</span><span class="nuc-value">${pairLabel}</span></div>`;

    // Magic numbers
    if (magicZ && magicN) {
      html += '<div class="nuc-analysis-item nuc-good"><span class="nuc-label">Magic numbers</span><span class="nuc-value">★ Doubly magic!</span></div>';
    } else if (magicZ) {
      html += '<div class="nuc-analysis-item nuc-good"><span class="nuc-label">Magic number</span><span class="nuc-value">★ Z = ' + Z + '</span></div>';
    } else if (magicN) {
      html += '<div class="nuc-analysis-item nuc-good"><span class="nuc-label">Magic number</span><span class="nuc-value">★ N = ' + N + '</span></div>';
    } else {
      // Show distance to nearest magic
      let nearestMagZ = magicNums.reduce((a, b) => Math.abs(b - Z) < Math.abs(a - Z) ? b : a);
      let nearestMagN = magicNums.reduce((a, b) => Math.abs(b - N) < Math.abs(a - N) ? b : a);
      html += `<div class="nuc-analysis-item"><span class="nuc-label">Nearest magic</span><span class="nuc-value">Z→${nearestMagZ} (${Z - nearestMagZ >= 0 ? '+' : ''}${Z - nearestMagZ}), N→${nearestMagN} (${N - nearestMagN >= 0 ? '+' : ''}${N - nearestMagN})</span></div>`;
    }

    // Predicted dominant decay mode
    if (!nd.stable) {
      let predDecay = '—';
      if (Z > 83) predDecay = 'α decay (Z > 83)';
      else if (nzRatio > optimalNZ + 0.1) predDecay = 'β⁻ decay (neutron-rich)';
      else if (nzRatio < optimalNZ - 0.1) predDecay = 'β⁺/EC (proton-rich)';
      html += `<div class="nuc-analysis-item"><span class="nuc-label">Predicted decay</span><span class="nuc-value">${predDecay}</span></div>`;
    }

    html += '</div></div>';

    // ── Fission/Fusion Energy Context ──
    const fePeak = 8.79; // Fe-56 B/A
    const ba = nd.bindingPerNucleon;

    html += '<div class="nuc-analysis-section">';
    html += '<div class="nuc-analysis-title">Fission / Fusion</div>';
    html += '<div class="nuc-analysis-grid">';

    if (A <= 4) {
      const gain = fePeak - ba;
      html += `<div class="nuc-analysis-item nuc-fusion"><span class="nuc-label">Fusion candidate</span><span class="nuc-value">+${gain.toFixed(1)} MeV/A to peak</span></div>`;
      html += `<div class="nuc-analysis-item"><span class="nuc-label">Energy potential</span><span class="nuc-value">${(gain * A).toFixed(0)} MeV total</span></div>`;
      html += '<div class="nuc-analysis-note">Light nuclei release energy when fused toward iron peak</div>';
    } else if (A < 56) {
      const gain = fePeak - ba;
      html += `<div class="nuc-analysis-item nuc-fusion"><span class="nuc-label">Fusion favorable</span><span class="nuc-value">+${gain.toFixed(2)} MeV/A to peak</span></div>`;
      html += '<div class="nuc-analysis-note">Fusion toward heavier nuclei releases energy (stellar burning)</div>';
    } else if (A <= 62) {
      html += '<div class="nuc-analysis-item nuc-peak"><span class="nuc-label">Near B/A peak</span><span class="nuc-value">Maximum stability</span></div>';
      html += '<div class="nuc-analysis-note">Neither fission nor fusion is energetically favorable — iron group nuclei are the nuclear "ash" of stars</div>';
    } else if (A < 150) {
      const gain = ba > 0 ? (fePeak - ba) : 0;
      html += `<div class="nuc-analysis-item"><span class="nuc-label">Above iron peak</span><span class="nuc-value">${(-gain).toFixed(2)} MeV/A below peak</span></div>`;
      html += '<div class="nuc-analysis-note">Heavier than iron — formed in supernovae (r/s-process) or neutron star mergers</div>';
    } else {
      const fissionGain = ba < fePeak ? (fePeak - ba) * 0.3 : 0; // rough estimate — fragments get ~30% closer to peak
      html += `<div class="nuc-analysis-item nuc-fission"><span class="nuc-label">Fission candidate</span><span class="nuc-value">~${(fissionGain * A).toFixed(0)} MeV released</span></div>`;
      if (Z >= 90) {
        html += `<div class="nuc-analysis-item"><span class="nuc-label">Fissile potential</span><span class="nuc-value">${Z >= 92 ? 'Actinide — fissile/fissionable' : 'Heavy — fissionable'}</span></div>`;
      }
      html += '<div class="nuc-analysis-note">Heavy nuclei release energy via fission into lighter fragments closer to the iron peak</div>';
    }

    html += '</div></div>';

    el.innerHTML = html;
    el.style.display = '';
  }

  // ═══════════════════════ ISOTOPE ABUNDANCE CHART ═══════════════════════
  function buildIsotopeChart(nd) {
    const isoContainer = document.getElementById('isotope-list');

    // Build header
    let isoHTML = '<h4>Isotopes</h4>';

    // Check if any isotopes have meaningful abundances
    const hasAbundance = nd.isotopes.some(iso => iso.abundance > 0.01);

    if (hasAbundance) {
      // Abundance bar chart
      const maxAbund = Math.max(...nd.isotopes.map(i => i.abundance));
      isoHTML += '<div class="isotope-bars">';
      nd.isotopes.forEach(iso => {
        if (iso.abundance < 0.001) return; // skip trace for bar chart
        const pct = (iso.abundance / maxAbund * 100).toFixed(1);
        const stableClass = iso.halfLife === 'stable' ? 'iso-bar-stable' : 'iso-bar-radio';
        isoHTML += `<div class="isotope-bar-row">
          <span class="iso-bar-label">${iso.name}</span>
          <div class="iso-bar-track">
            <div class="iso-bar-fill ${stableClass}" style="width:${pct}%"></div>
          </div>
          <span class="iso-bar-value">${iso.abundance.toFixed(2)}%</span>
        </div>`;
      });
      isoHTML += '</div>';
    }

    // Full isotope table (always shown)
    nd.isotopes.forEach(iso => {
      const stableClass = iso.halfLife === 'stable' ? 'isotope-stable' : 'isotope-radioactive';
      const abund = iso.abundance > 0 ? iso.abundance.toFixed(2) + '%' : 'trace';
      const halfStr = iso.halfLife === 'stable' ? 'Stable' : `t½ ${iso.halfLife}`;
      const decay = iso.decayModes.length ? iso.decayModes.join(', ') : '';
      isoHTML += `<div class="isotope-item">
        <span class="isotope-name ${stableClass}">${iso.name}</span>
        <span class="isotope-abundance">${abund}</span>
        <span class="isotope-halflife">${halfStr}</span>
        <span class="isotope-decay">${decay}</span>
      </div>`;
    });

    isoContainer.innerHTML = isoHTML;
  }
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
    // Re-render & restart 3D cloud when switching to it (container now visible → correct size)
    if (mode === 'bohr3d' && activeElement) {
      renderCloud3D(activeElement);
      startCloudAnimation();
    }
    // Stop molecule animation when not visible
    if (mode !== 'molecule' && molState.animId) {
      cancelAnimationFrame(molState.animId);
      molState.animId = null;
    }
    // Re-render molecule when switching to it (container now visible → correct size)
    if (mode === 'molecule' && activeElement) {
      // Resize canvas to match now-visible container, but preserve cloud/sticks state
      const molVizC = document.getElementById('viz-molecule');
      const canvas = molState.canvas;
      if (molVizC && canvas) {
        const molCR = molVizC.getBoundingClientRect();
        if (molState.cloudMode) {
          const cloudSize = Math.round(Math.max(280, Math.min(560, Math.floor(molCR.width - 20))) * 1.3);
          canvas.width = cloudSize * 2;
          canvas.height = cloudSize * 2;
          canvas.style.width = cloudSize + 'px';
          canvas.style.height = cloudSize + 'px';
          initMolCloud(molState.compound, canvas);
          startMolCloudAnimation();
        } else {
          const sticksSize = Math.max(280, Math.min(560, Math.floor(molCR.width - 20)));
          canvas.width = sticksSize * 2;
          canvas.height = sticksSize * 2;
          canvas.style.width = sticksSize + 'px';
          canvas.style.height = sticksSize + 'px';
          const c = molState.compound;
          const xs = c.atoms.map(a => a.x), ys = c.atoms.map(a => a.y), zs = c.atoms.map(a => a.z);
          const maxSpan = Math.max(Math.max(...xs)-Math.min(...xs), Math.max(...ys)-Math.min(...ys), Math.max(...zs)-Math.min(...zs), 1.5);
          molState.scale = (sticksSize * 0.55) / maxSpan;
          startMoleculeAnimation();
        }
      } else {
        renderMolecule(activeElement);
        startMoleculeAnimation();
      }
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
      const electronCount = Math.min(count, 32); // cap visible electrons for performance
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
    const maxAttempts = numPoints * 200;
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

    const numPts = 80000;
    const raw = sampleOrbital(orb.n, orb.l, orb.m, orb.Zeff, numPts);
    const colors = LOBE_COLORS[orb.lChar] || { pos: [180,180,180], neg: [180,180,180] };

    // Use per-orbital scale so single orbitals fill the canvas
    const orbScale = orb.rExt > 0 ? 200 / orb.rExt : scale;
    const points = raw.map(p => {
      const col = p.sign >= 0 ? colors.pos : colors.neg;
      return {
        x: p.x * orbScale, y: p.y * orbScale, z: p.z * orbScale,
        r: col[0], g: col[1], b: col[2],
        alpha: 0.22,
        size: 0.8,
      };
    });
    cloud3d.pointCache[cacheKey] = points;
    return points;
  }

  // ── Build points for all orbitals (overview) ──
  function buildAllOrbitals(orbData, scale) {
    if (cloud3d.pointCache['__all__']) return cloud3d.pointCache['__all__'];

    const totalOrbs = orbData.length;
    const ptsPerOrb = Math.max(1200, Math.floor(80000 / Math.max(1, totalOrbs)));

    const allPoints = [];
    for (const orb of orbData) {
      const raw = sampleOrbital(orb.n, orb.l, orb.m, orb.Zeff, ptsPerOrb);
      const colors = LOBE_COLORS[orb.lChar] || { pos: [180,180,180], neg: [180,180,180] };
      for (const p of raw) {
        const col = p.sign >= 0 ? colors.pos : colors.neg;
        allPoints.push({
          x: p.x * scale, y: p.y * scale, z: p.z * scale,
          r: col[0], g: col[1], b: col[2],
          alpha: 0.14 + 0.06 * (orb.n / 7),
          size: 0.6 + 0.15 * (orb.n / 7),
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

    // Dynamic size based on available container width
    const vizContainer = document.getElementById('viz-bohr3d');
    const containerRect = vizContainer ? vizContainer.getBoundingClientRect() : { width: 500 };
    const size = Math.max(360, Math.min(640, Math.floor(containerRect.width - 20)));

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
                const raw = sampleOrbital(orb.n, orb.l, orb.m, orb.Zeff, Math.floor(65000 / orbs.length));
                const colors = LOBE_COLORS[orb.lChar];
                const subScale = orb.rExt > 0 ? 200 / orb.rExt : scale;
                for (const p of raw) {
                  const col = p.sign >= 0 ? colors.pos : colors.neg;
                  pts.push({
                    x: p.x * subScale, y: p.y * subScale, z: p.z * subScale,
                    r: col[0], g: col[1], b: col[2], alpha: 0.22, size: 0.8,
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
      const sz = Math.max(0.4, p.size);
      const a = Math.min(0.35, p.alpha * 0.30);
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
    viewZoom: 1.0,
    autoRotate: true,
    dragging: false,
    lastMouse: { x: 0, y: 0 },
    dpr: 1, w: 0, h: 0,
    scale: 1,
    orbExtents: {},
    globalExtent: 1,
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
      if (!atom) continue;
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
      if (!atom) continue;
      const { n, l, m, zeff } = contrib;
      const rCut = Math.max(4, (5 * n * n) / zeff);

      // Radial pre-scan (high-res, matching atomic sampling)
      let maxRad = 0;
      const RSCAN = 500;
      for (let i = 1; i <= RSCAN; i++) {
        const r = (i / RSCAN) * rCut;
        const rho = 2 * zeff * r / n;
        const L = assocLaguerre(n - l - 1, 2 * l + 1, rho);
        const Rv = Math.pow(rho, l) * Math.exp(-rho / 2) * L;
        const p = r * r * Rv * Rv;
        if (p > maxRad) maxRad = p;
      }

      // Angular pre-scan (high-res, matching atomic sampling)
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

      if (maxRad === 0 || maxAng === 0) continue;

      let got = 0;
      let attempts = 0;
      const maxAttempts = targetPts * 200;

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
        alpha: 0.22,
        size: 0.8,
      };
    });
    molCloud.pointCache[cacheKey] = points;
    return points;
  }

  // Build all occupied MOs combined
  function buildAllMolOrbPoints(moData, atomsBohr, scale) {
    if (molCloud.pointCache['__all__']) return molCloud.pointCache['__all__'];

    const occupied = moData.orbitals.filter(mo => mo.electrons > 0 && mo.type !== 'core');
    const ptsPerMO = Math.max(1000, Math.floor(60000 / Math.max(1, occupied.length)));
    const gExt = molCloud.globalExtent;

    // Assign distinct hues to each MO, with adaptive size/alpha for compact orbitals
    const allPoints = [];
    occupied.forEach((mo, idx) => {
      const raw = sampleMolOrbital(mo, atomsBohr, ptsPerMO);
      const hue = (idx / occupied.length) * 360;
      const rgb = hslToRgb(hue, 0.7, 0.6);
      // Compaction ratio: how much smaller this orbital is vs the global extent
      const moExt = molCloud.orbExtents[mo.name] || gExt;
      const compaction = gExt / moExt;
      // Boost size and alpha for compact orbitals (log scale)
      const boost = Math.max(1, Math.log2(compaction));
      const sz = 0.6 * (1 + 0.5 * (boost - 1));
      const al = 0.16 * (1 + 0.4 * (boost - 1));
      for (const p of raw) {
        allPoints.push({
          x: p.x * scale, y: p.y * scale, z: p.z * scale,
          r: rgb[0], g: rgb[1], b: rgb[2],
          alpha: al,
          size: sz,
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
    const numPts = mo.electrons > 0 ? 80000 : 55000;
    return buildMolOrbPoints(mo, atomsBohr, scale, numPts);
  }

  // Draw molecular cloud (per-frame)
  function drawMolCloud(ctx) {
    const W = molCloud.w, H = molCloud.h;
    const cx = W / 2, cy = H / 2;
    const zm = molCloud.zoom * (molCloud.viewZoom || 1);

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
      const sz = Math.max(0.4, p.size);
      const a = Math.min(0.35, p.alpha * 0.30);
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
        const { homo, lumo } = findHOMOLUMO(molCloud.moData);
        ctx.font = `bold 18px 'Inter', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        let nameStr = mo.name;
        if (mo.name === homo) nameStr += '  HOMO';
        if (mo.name === lumo) nameStr += '  LUMO';
        ctx.fillText(nameStr, 16, W - 16);
        ctx.font = `12px 'JetBrains Mono', monospace`;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        const typeLabel = mo.type + (mo.electrons > 0 ? ` (${mo.electrons}e⁻)` : ' (empty)');
        ctx.fillText(typeLabel, 16, W - 36);
        if (mo.desc) {
          ctx.font = `11px 'Inter', sans-serif`;
          ctx.fillStyle = 'rgba(255,255,255,0.22)';
          // Word-wrap desc to ~50 chars per line
          const words = mo.desc.split(' ');
          let lines = [], cur = '';
          for (const w of words) {
            if ((cur + ' ' + w).length > 55 && cur) { lines.push(cur); cur = w; }
            else { cur = cur ? cur + ' ' + w : w; }
          }
          if (cur) lines.push(cur);
          for (let li = 0; li < Math.min(lines.length, 3); li++) {
            ctx.fillText(lines[li], 16, W - 56 - (lines.length - 1 - li) * 14);
          }
        }
      }
    } else {
      // Show bond order on "all" view
      const bondOrder = computeBondOrder(molCloud.moData);
      ctx.font = `bold 14px 'Inter', sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillText(`Bond Order: ${bondOrder % 1 === 0 ? bondOrder : bondOrder.toFixed(1)}`, 16, W - 16);
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
    // Dynamic size based on available container width
    const molVizContainer = document.getElementById('viz-molecule');
    const molContainerRect = molVizContainer ? molVizContainer.getBoundingClientRect() : { width: 400 };
    const size = Math.max(280, Math.min(560, Math.floor(molContainerRect.width - 20)));
    const cloudSize = Math.round(size * 1.3);
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
        <div class="mo-info-panel" id="mo-info-panel" style="display:none;"></div>
        <div class="mo-energy-diagram" id="mo-energy-diagram" style="display:none;"></div>
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
    setupMolViewToggle(container);

    if (activeViz === 'molecule') startMoleculeAnimation();
  }

  // Toggle between Ball & Stick and e⁻ Cloud views
  function setupMolViewToggle(container) {
    container.querySelectorAll('.mol-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.mol-view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.molView;
        molState.cloudMode = (mode === 'cloud');

        const canvas = molState.canvas;
        const selector = document.getElementById('mol-cloud-selector');

        // Compute fresh sizes from current container
        const molVizC = document.getElementById('viz-molecule');
        const molCR = molVizC ? molVizC.getBoundingClientRect() : { width: 400 };
        const sticksSize = Math.max(280, Math.min(560, Math.floor(molCR.width - 20)));
        const cloudSize = Math.round(sticksSize * 1.3);

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

          // Build energy diagram + info panel
          const diagEl = document.getElementById('mo-energy-diagram');
          const infoEl = document.getElementById('mo-info-panel');
          if (diagEl) {
            diagEl.style.display = 'block';
            buildMOEnergyDiagram(diagEl, molCloud.moData, 'all');
          }
          if (infoEl) {
            updateMOInfoPanel('all');
          }

          // Restart animation in cloud mode
          startMolCloudAnimation();
        } else {
          // Switch back to sticks mode
          canvas.width = sticksSize * 2;
          canvas.height = sticksSize * 2;
          canvas.style.width = sticksSize + 'px';
          canvas.style.height = sticksSize + 'px';

          // Recalculate molecule scale for new canvas size
          const c = molState.compound;
          const xs = c.atoms.map(a => a.x), ys = c.atoms.map(a => a.y), zs = c.atoms.map(a => a.z);
          const maxSpan = Math.max(Math.max(...xs)-Math.min(...xs), Math.max(...ys)-Math.min(...ys), Math.max(...zs)-Math.min(...zs), 1.5);
          molState.scale = (sticksSize * 0.55) / maxSpan;

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
          const diagEl2 = document.getElementById('mo-energy-diagram');
          const infoEl2 = document.getElementById('mo-info-panel');
          if (diagEl2) diagEl2.style.display = 'none';
          if (infoEl2) infoEl2.style.display = 'none';

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
    // Add orbital extent: largest rCut from contributing AOs, weighted by coefficient
    let maxOrbR = 0;
    let maxOrbRWeighted = 0;
    const orbExtents = {};
    for (const mo of moData.orbitals) {
      let moExtent = 0;
      const totalW = mo.ao.reduce((s, a) => s + a.c * a.c, 0) || 1;
      for (const ao of mo.ao) {
        if (!bohrCoords[ao.atom]) continue; // skip out-of-bounds atoms
        const atomR = Math.sqrt(bohrCoords[ao.atom].x ** 2 + bohrCoords[ao.atom].y ** 2 + bohrCoords[ao.atom].z ** 2);
        const rCut = Math.max(4, (5 * ao.n * ao.n) / ao.zeff);
        const ext = atomR + rCut;
        if (ext > maxOrbR) maxOrbR = ext;
        if (ext > moExtent) moExtent = ext;
        // Weight extent by coefficient: negligible contributions don't inflate scale
        const w = (ao.c * ao.c) / totalW;
        const wExt = atomR + rCut * Math.max(w, 0.15);
        if (wExt > maxOrbRWeighted) maxOrbRWeighted = wExt;
      }
      orbExtents[mo.name] = Math.max(moExtent, 4);
    }
    // Use weighted extent for global scale so tiny AO contributions don't dominate
    const globalExtent = Math.max(maxR + 3, maxOrbRWeighted, 4);
    molCloud.scale = 180 / globalExtent;
    molCloud.globalExtent = globalExtent;
    molCloud.orbExtents = orbExtents;
    molCloud.zoom = 1.0;
    molCloud.viewZoom = 1.0;
  }

  // ─── HOMO/LUMO Detection ───
  function findHOMOLUMO(moData) {
    const orbs = moData.orbitals;
    let homo = null, lumo = null;
    // Sort by energy rank if available, else use array order
    const sorted = orbs.map((o, i) => ({ ...o, _idx: i }));
    if (orbs[0] && orbs[0].energy != null) {
      sorted.sort((a, b) => a.energy - b.energy);
    }
    for (const o of sorted) {
      if (o.electrons > 0 && o.type !== 'core') homo = o;
      if (o.electrons === 0 && !lumo) lumo = o;
    }
    return { homo: homo ? homo.name : null, lumo: lumo ? lumo.name : null };
  }

  // ─── Bond Order Computation ───
  function computeBondOrder(moData) {
    let bonding = 0, antibonding = 0;
    for (const o of moData.orbitals) {
      if (o.type === 'bonding') bonding += o.electrons;
      else if (o.type === 'antibonding') antibonding += o.electrons;
    }
    return (bonding - antibonding) / 2;
  }

  // ─── Build MO Energy Diagram ───
  function buildMOEnergyDiagram(container, moData, activeFilter) {
    if (!container) return;
    const orbs = moData.orbitals;
    const { homo, lumo } = findHOMOLUMO(moData);
    const bondOrder = computeBondOrder(moData);

    // Separate by type for layout
    const sorted = orbs.slice();
    if (sorted[0] && sorted[0].energy != null) {
      sorted.sort((a, b) => a.energy - b.energy);
    }

    const typeColors = {
      bonding: '#4a96ff', antibonding: '#ff5a3c',
      nonbonding: '#32c87a', core: '#8c8ca0',
    };

    let html = '<div class="mo-diagram-header">';
    html += `<span class="mo-diagram-title">MO Energy Levels</span>`;
    html += `<span class="mo-diagram-bond-order">Bond Order: <strong>${bondOrder % 1 === 0 ? bondOrder : bondOrder.toFixed(1)}</strong></span>`;
    html += '</div>';
    html += '<div class="mo-diagram-levels">';

    // Draw levels bottom to top
    const reversed = sorted.slice().reverse();
    for (const mo of reversed) {
      const isActive = activeFilter === mo.name;
      const isHomo = mo.name === homo;
      const isLumo = mo.name === lumo;
      const col = typeColors[mo.type] || '#888';
      const cls = ['mo-level', isActive ? 'mo-level-active' : '', isHomo ? 'mo-level-homo' : '', isLumo ? 'mo-level-lumo' : ''].filter(Boolean).join(' ');

      html += `<div class="${cls}" data-mo-diagram="${mo.name}" style="--mo-color:${col}">`;
      html += `<span class="mo-level-line" style="background:${col}"></span>`;
      // Electron arrows
      html += '<span class="mo-level-electrons">';
      if (mo.electrons >= 1) html += '<span class="mo-e-arrow">↑</span>';
      if (mo.electrons >= 2) html += '<span class="mo-e-arrow mo-e-down">↓</span>';
      html += '</span>';
      html += `<span class="mo-level-label">${mo.name}</span>`;
      if (isHomo) html += '<span class="mo-badge mo-badge-homo">HOMO</span>';
      if (isLumo) html += '<span class="mo-badge mo-badge-lumo">LUMO</span>';
      html += '</div>';
    }
    html += '</div>';
    container.innerHTML = html;

    // Click levels to select orbital
    container.querySelectorAll('[data-mo-diagram]').forEach(el => {
      el.addEventListener('click', () => {
        const name = el.dataset.moDiagram;
        molCloud.activeFilter = name;
        // Auto-zoom
        if (molCloud.orbExtents[name]) {
          const ratio = molCloud.globalExtent / molCloud.orbExtents[name];
          molCloud.viewZoom = Math.min(ratio, 12);
        }
        // Sync selector buttons
        const selector = document.getElementById('mol-cloud-selector');
        if (selector) {
          selector.querySelectorAll('.mol-cloud-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.moName === name);
          });
        }
        // Update info panel
        updateMOInfoPanel(name);
        // Rebuild diagram with new active
        buildMOEnergyDiagram(container, molCloud.moData, name);
        molCloud.pointCache = {};
      });
    });
  }

  // ─── Update MO Info Panel ───
  function updateMOInfoPanel(moName) {
    const panel = document.getElementById('mo-info-panel');
    if (!panel || !molCloud.moData) return;
    panel.style.display = 'block';

    if (moName === 'all') {
      const moData = molCloud.moData;
      const bondOrder = computeBondOrder(moData);
      const { homo, lumo } = findHOMOLUMO(moData);
      const totalE = moData.orbitals.reduce((s, o) => s + o.electrons, 0);
      let html = `<div class="mo-info-summary">`;
      html += `<span class="mo-info-stat">${totalE}e⁻ total</span>`;
      html += `<span class="mo-info-stat">Bond order: <strong>${bondOrder % 1 === 0 ? bondOrder : bondOrder.toFixed(1)}</strong></span>`;
      if (homo) html += `<span class="mo-info-stat">HOMO: <strong>${homo}</strong></span>`;
      if (lumo) html += `<span class="mo-info-stat">LUMO: <strong>${lumo}</strong></span>`;
      html += '</div>';
      if (moData.notes) {
        html += `<p class="mo-info-notes">${moData.notes}</p>`;
      }
      panel.innerHTML = html;
      return;
    }

    const mo = molCloud.moData.orbitals.find(o => o.name === moName);
    if (!mo) { panel.style.display = 'none'; return; }

    const { homo, lumo } = findHOMOLUMO(molCloud.moData);
    let badges = '';
    if (mo.name === homo) badges += '<span class="mo-badge mo-badge-homo">HOMO</span>';
    if (mo.name === lumo) badges += '<span class="mo-badge mo-badge-lumo">LUMO</span>';

    let html = `<div class="mo-info-header">`;
    html += `<span class="mo-info-name">${mo.name}</span>`;
    html += `<span class="mo-info-type mo-info-type-${mo.type}">${mo.type}</span>`;
    html += badges;
    html += `<span class="mo-info-stat">${mo.electrons}e⁻</span>`;
    html += '</div>';
    if (mo.desc) {
      html += `<p class="mo-info-desc">${mo.desc}</p>`;
    }
    // Show AO composition
    const aoSummary = mo.ao.map(a => {
      const atomSym = molCloud.compound ? molCloud.compound.atoms[a.atom].sym : `#${a.atom}`;
      const orbLabel = ['s','p','d','f'][a.l] || '?';
      return `${atomSym} ${a.n}${orbLabel}`;
    });
    const unique = [...new Set(aoSummary)];
    html += `<div class="mo-info-ao">Composition: ${unique.join(' + ')}</div>`;
    panel.innerHTML = html;
  }

  // Build MO selector buttons
  function buildMolCloudSelector(el) {
    if (!molCloud.moData) return;
    const orbs = molCloud.moData.orbitals;
    const occupied = orbs.filter(o => o.electrons > 0);
    const { homo, lumo } = findHOMOLUMO(molCloud.moData);

    let html = `<button class="mol-cloud-btn active" data-mo-name="all">All Occupied</button>`;
    occupied.forEach(mo => {
      let label = mo.name + ` (${mo.electrons}e⁻)`;
      if (mo.name === homo) label += ' <span class="mo-badge mo-badge-homo mo-badge-sm">H</span>';
      if (mo.name === lumo) label += ' <span class="mo-badge mo-badge-lumo mo-badge-sm">L</span>';
      html += `<button class="mol-cloud-btn" data-mo-name="${mo.name}">${label}</button>`;
    });
    // Also show unoccupied (antibonding) if any
    const unoccupied = orbs.filter(o => o.electrons === 0);
    if (unoccupied.length > 0) {
      html += '<span class="mol-cloud-sep">|</span>';
      unoccupied.forEach(mo => {
        let label = mo.name + ' (empty)';
        if (mo.name === lumo) label += ' <span class="mo-badge mo-badge-lumo mo-badge-sm">L</span>';
        html += `<button class="mol-cloud-btn" data-mo-name="${mo.name}">${label}</button>`;
      });
    }

    el.innerHTML = html;

    el.querySelectorAll('.mol-cloud-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('.mol-cloud-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const moName = btn.dataset.moName;
        molCloud.activeFilter = moName;
        // Auto-zoom: fill canvas when viewing a single orbital
        if (moName !== 'all' && molCloud.orbExtents[moName]) {
          const ratio = molCloud.globalExtent / molCloud.orbExtents[moName];
          molCloud.viewZoom = Math.min(ratio, 12);
        } else {
          molCloud.viewZoom = 1.0;
        }
        // Update info panel and energy diagram
        updateMOInfoPanel(moName);
        const diagEl = document.getElementById('mo-energy-diagram');
        if (diagEl) buildMOEnergyDiagram(diagEl, molCloud.moData, moName);
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
    const diagEl3 = document.getElementById('mo-energy-diagram');
    const infoEl3 = document.getElementById('mo-info-panel');
    if (diagEl3) diagEl3.style.display = 'none';
    if (infoEl3) infoEl3.style.display = 'none';

    // Restore sticks canvas size and event listeners
    const canvas = molState.canvas;
    if (canvas) {
      const molVizC = document.getElementById('viz-molecule');
      const molCR = molVizC ? molVizC.getBoundingClientRect() : { width: 400 };
      const sticksSize = Math.max(280, Math.min(560, Math.floor(molCR.width - 20)));
      molState.scale = (sticksSize * 0.55) / maxSpan;
      canvas.width = sticksSize * 2;
      canvas.height = sticksSize * 2;
      canvas.style.width = sticksSize + 'px';
      canvas.style.height = sticksSize + 'px';

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
