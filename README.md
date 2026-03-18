# Interactive Periodic Table

A modern, interactive periodic table of the elements built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no dependencies.

![Dark theme periodic table with element detail modal](https://img.shields.io/badge/elements-118-blue) ![Zero dependencies](https://img.shields.io/badge/dependencies-0-green) ![License](https://img.shields.io/badge/license-MIT-purple)

## Features

### Periodic Table
- **All 118 elements** with accurate data (atomic mass, electron configuration, electronegativity, density, melting/boiling points, discovery year, and more)
- **CSS Grid layout** — authentic 18-column periodic table with lanthanide/actinide rows
- **Category color-coding** — alkali metals, transition metals, metalloids, noble gases, etc.
- **Search** — real-time filtering by name, symbol, or atomic number
- **Temperature slider** — dynamically shows phase state (solid/liquid/gas) from −273°C to 6000°C
- **Category legend** — click to filter by element category

### Element Detail Panel
Click any element to open a centered modal with:
- **Identity** — symbol, name, atomic number, atomic mass, category, phase, discovery year
- **Ionic states** — common oxidation states with electron configurations for 50+ elements
- **Physical & chemical properties** — electronegativity, density, melting/boiling points, electron affinity, ionization energy

### Visualizations (4 tabs)
- **2D Bohr Model** — animated electrons orbiting on CSS offset-path shells
- **Electron Cloud (e⁻ Cloud)** — scientifically accurate 3D probability density visualization:
  - Hydrogen-like wavefunctions: $R_{nl}(r) \times Y_l^m(\theta, \varphi)$
  - Associated Laguerre polynomials via recurrence relation
  - Real spherical harmonics for s, p, d, and f orbitals
  - Slater's rules for effective nuclear charge ($Z_{\text{eff}}$)
  - Monte Carlo rejection sampling from $|\psi|^2$
  - **Orbital selector** — view individual orbitals (1s, 2p_z, 3d_xy, etc.) with characteristic shapes
  - **Sign-sensitive lobe coloring** — positive/negative wavefunction phases in distinct colors
  - Drag to rotate, scroll to zoom, 15,000-point resolution per orbital
- **Orbital Diagram** — Hund's rule filling with up/down arrow notation
- **Molecule Viewer** — 3D ball-and-stick models of common compounds for each element

### Chemistry Data
- **Compounds** — common compounds for all 118 elements with formulas and descriptions
- **Extended compounds** — additional compounds for 35 key elements (water, ammonia, sulfuric acid, etc.)
- **Ionic states** — oxidation states with electron configurations for 50 elements (91 ion entries)

## Getting Started

No build step required. Just serve the files:

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# Or just open index.html in a browser
```

Then visit `http://localhost:8080`.

## Project Structure

```
periodic-table/
├── index.html              # App shell, modal overlay, visualization tabs
├── css/
│   └── styles.css          # Dark theme, CSS Grid layout, responsive design
└── js/
    ├── elements.js         # All 118 elements with full data
    ├── compounds.js        # Base compounds for every element
    ├── compounds-extra.js  # Extended compounds for 35 key elements
    ├── ions.js             # Ionic states for 50 elements
    └── app.js              # All interactivity, renderers, and math
```

## Technical Details

- **Zero dependencies** — pure HTML5, CSS3, and ES6+ JavaScript
- **Canvas 2D API** — all 3D visualizations rendered via manual rotation matrices and perspective projection
- **~7,700 lines of code** across 7 files
- **Responsive** — adapts from desktop to mobile with CSS Grid breakpoints
- **Dark theme** — designed for readability with carefully chosen contrast ratios

### Scientific Accuracy

The electron cloud renderer implements real quantum mechanics:

| Component | Method |
|-----------|--------|
| Radial wavefunctions | $R_{nl}(r) \propto \rho^l \, e^{-\rho/2} \, L_{n-l-1}^{2l+1}(\rho)$ where $\rho = 2Z_{\text{eff}}r/n$ |
| Angular wavefunctions | Real spherical harmonics $Y_l^m(\theta, \varphi)$ for $l = 0, 1, 2, 3$ |
| Effective nuclear charge | Slater's rules with proper group screening constants |
| Electron filling | Hund's rule — maximize spin before pairing |
| Probability sampling | Monte Carlo rejection sampling from $|\psi|^2 = |R_{nl}|^2 |Y_l^m|^2$ |

All math has been verified against analytical solutions (radial node positions, angular node counts, Slater $Z_{\text{eff}}$ values for H, He, Li, C, Na, Ti, and lobe sign correctness for p/d/f orbitals).

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires ES6+ support (template literals, Maps, arrow functions, `const`/`let`).

## License

MIT
