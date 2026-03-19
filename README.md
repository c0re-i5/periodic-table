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
Click any element to open a 3-column modal with:
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
  - Drag to rotate, scroll to zoom, up to 80,000-point resolution per orbital
- **Orbital Diagram** — Hund's rule filling with up/down arrow notation
- **Molecule Viewer** — 3D ball-and-stick models of common compounds for each element, with MO cloud visualization for 188 molecules

### Nuclear Physics (7 tabs)
A dedicated nuclear column shows subatomic structure for every element:
- **Nucleus 3D** — interactive 3D visualization of the atomic nucleus:
  - Fibonacci sphere packing of protons (red) and neutrons (teal) as translucent, edge-stroked spheres
  - **Nuclear deformation** — β₂ quadrupole parameter stretches prolate (β₂ > 0) or compresses oblate (β₂ < 0) nuclei, visible in the 3D shape
  - Perspective projection with depth-sorted rendering and specular highlights
  - **Quark substructure** — zoom in past 1.8× to reveal the valence quarks inside each nucleon:
    - **Proton** = 2 up quarks (+⅔e) + 1 down quark (−⅓e)
    - **Neutron** = 1 up quark (+⅔e) + 2 down quarks (−⅓e)
    - QCD color charges (red, green, blue) — one per quark, ensuring color-neutral hadrons
    - Animated confinement jitter simulating quantum fluctuations
  - **Gluon springs** — wavy lines between quarks representing the strong force carriers
  - Drag to rotate, scroll to zoom (0.3×–20×), auto-rotation
- **Decay Chain** — connected node graph showing radioactive decay sequences (α, β⁻, β⁺, EC, SF) with color-coded modes
- **Binding Energy** — B/A vs mass number chart with Fe-56 peak marker, current element highlighted, gradient fill under curve
- **Nuclear Shells** — dual-column proton/neutron shell filling diagram with magic number indicators (2, 8, 20, 28, 50, 82, 126)
- **Chart of Nuclides** — Z vs N grid showing all known isotopes colored by decay mode (stable = black, β⁻ = blue, β⁺/EC = red, α = gold, SF = green), centered on the current element with current nuclide highlighted
- **SEMF Waterfall** — Semi-Empirical Mass Formula (Weizsäcker) breakdown showing volume, surface, Coulomb, asymmetry, and pairing terms as a waterfall chart with predicted vs actual binding energy and shell effect indicator
- **Decay Curve (t½)** — exponential decay plot $N(t) = N_0 \cdot (\tfrac{1}{2})^{t/t_{1/2}}$ over 6 half-lives with fraction markers; stable elements show a stability analysis instead

#### Nuclear Analysis Panel
Below the nuclear info badges, an analysis panel provides:
- **Mass Defect & E = mc²** — free nucleon mass sum vs nuclear mass, mass defect in MeV/c², atomic mass units, and kg
- **Stability Analysis** — N/Z ratio vs optimal, even-even/odd-odd parity classification, magic number proximity, predicted decay mode
- **Fission/Fusion Context** — distance from the iron peak (8.79 MeV/nucleon), energy potential for fusion or fission, stellar burning and nucleosynthesis context
- **Isotope Abundance Bar Chart** — horizontal bars showing natural abundance of each isotope
- **Nuclear Force Range** — strong force connections visible on the 3D nucleus at intermediate zoom (0.8–2.5×), showing bonds between neighboring nucleons within ~1.5 fm

Nuclear info badges show: proton/neutron count, nuclear radius, spin/parity, binding energy per nucleon, magnetic moment, stability status, thermal neutron capture cross-section (σₙ,γ in barns), separation energies (Sp/Sn in MeV), and nucleosynthesis origin (Big Bang, cosmic rays, stars, supernovae, neutron star mergers, radioactive decay, or artificial). Notable nuclear reactions are listed when available (e.g., fission, fusion, medical isotopes).

### Molecular Orbital Clouds
When viewing a compound, click **"MO Cloud"** to see its molecular electron cloud — LCAO molecular orbital theory rendered as a 3D point cloud.

- **188 molecules** with full LCAO coefficients: $\psi_{\text{MO}}(\mathbf{r}) = \sum_i c_i \, \varphi_i(\mathbf{r} - \mathbf{R}_i)$
- **97% cloud coverage** — 191 of 197 multi-atom compounds have MO cloud visualizations
- Covers diatomics (H₂, N₂, O₂, HF, HCl, Br₂, I₂, He₂, ClF, ICl, IBr), triatomics (H₂O, SO₂, O₃, NO₂, BeH₂, HgO, NOCl, SnCl₂), polyatomics (NH₃, CH₄, CO₂, BF₃, SO₃, C₂H₄, C₂H₂, GeH₄, AsH₃), and complex species (C₂H₅OH, CH₃OH, HNO₃, B₂H₆, UF₆, COCl₂, CH₃Cl)
- Noble gas compounds: XeF₂, XeF₄, KrF₂, HArF, RnF₂
- Transition metal compounds: FeO, NiO, CuO, FeCl₃, RhCl₃, TiCl₄, OsO₄, RuO₄, PtCl₂, PdCl₂, AuCl₃, HgCl₂ (with d-orbital bonding)
- Metal sulfates & carbonates: FeSO₄, NiSO₄, CuSO₄, BaSO₄, Tl₂SO₄, CaCO₃, SrCO₃, NaHCO₃
- Complex oxyanions: KMnO₄, K₂Cr₂O₇, AgNO₃, H₂SO₄
- Heavy metal oxides: MoO₃, WO₃, MnO₂, ZrO₂, HfO₂, CeO₂, IrO₂, Cr₂O₃, V₂O₅, Nb₂O₅, Ta₂O₅, Re₂O₇, TeO₂
- Actinide/lanthanide oxides: UO₂, ThO₂, PuO₂, La₂O₃, Pa₂O₅ (with f-orbital bonding)
- Perovskites & mixed oxides: BaTiO₃, Co₃O₄, In₂O₃, Fe₂O₃, Al₂O₃, Na₂O, K₂O
- Semiconductors: GaAs, ZnO, ZnS, CdS, CdTe
- Ionic salts: NaCl, KCl, CsCl, RbCl, AgCl, LiF, NaF, KOH, PbCl₂, ZnCl₂
- Coordination compounds: PtCl₂(NH₃)₂ (cisplatin), TcO₄⁻
- Other: Cu₂O, Ag₂O, Hg₂Cl₂, Ca(OH)₂, Mg(OH)₂, PCl₅, GaCl₃, As₂O₃, Sb₂O₃, Sc₂O₃
- **HOMO/LUMO detection** — automatically identifies frontier orbitals and computes bond order
- **MO energy diagram** — interactive orbital energy level panel with occupancy indicators
- **MO selector** — view individual bonding, antibonding, nonbonding, and core orbitals with detailed info
- **Sign-colored lobes** — positive/negative wavefunction phases in distinct colors per MO type
- High-density rendering with up to 80,000 points per orbital for crisp visualizations
- Drag to rotate, scroll to zoom, atom labels with CPK colors

### Chemistry Data
- **Compounds** — common compounds for all 118 elements with formulas and descriptions
- **Extended compounds** — 222 unique compounds with 3D geometries across all 118 elements (water, ammonia, sulfuric acid, ethanol, methanol, cisplatin, and more)
- **Molecular orbitals** — LCAO coefficients for 188 molecules with validated quantum numbers (97% coverage of all multi-atom compounds)
- **Ionic states** — oxidation states with electron configurations for 50 elements (91 ion entries)
- **Nuclear data** — nuclear properties, isotopes, decay chains, shell model levels, and binding energy curve for all 118 elements
- **Extended nuclear data** — deformation parameters (β₂), neutron capture cross-sections, separation energies (Sp/Sn), nucleosynthesis origins, notable reactions, and nuclide ranges for the Chart of Nuclides

## Getting Started

No build step required. Just open the file: index.html

## Project Structure

```
periodic-table/
├── index.html                # App shell, 3-column modal, visualization tabs
├── css/
│   └── styles.css            # Dark theme, CSS Grid layout, responsive design
└── js/
    ├── elements.js           # All 118 elements with full data
    ├── compounds.js          # Base compounds for every element
    ├── compounds-extra.js    # Extended compounds with 3D geometries (all 118 elements)
    ├── molecular-orbitals.js # LCAO MO coefficients for 188 molecules
    ├── ions.js               # Ionic states for 50 elements
    ├── nuclear-data.js       # Nuclear properties, isotopes, decay chains for 118 elements
    ├── nuclear-extra.js      # Deformation, cross-sections, separation energies, origins, nuclide ranges
    └── app.js                # All interactivity, renderers, and math
```

## Technical Details

- **Zero dependencies** — pure HTML5, CSS3, and ES6+ JavaScript
- **Canvas 2D API** — all 3D visualizations rendered via manual rotation matrices and perspective projection
- **~25,000 lines of code** across 10 files
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

#### Molecular Orbital Theory

The molecular cloud renderer extends atomic wavefunctions to multi-center systems using LCAO (Linear Combination of Atomic Orbitals):

$$\psi_{\text{MO}}(\mathbf{r}) = \sum_i c_i \, \varphi_i(\mathbf{r} - \mathbf{R}_i)$$

| Component | Method |
|-----------|--------|
| Atomic basis | Hydrogen-like orbitals centered at each atom position |
| LCAO coefficients | Hand-computed from symmetry, electronegativity, and Slater Zeff |
| Coordinate system | Atomic positions in Bohr (Å × 1.8897) with angular convention: $m=0 \to p_z$, $m=1 \to p_x$, $m=-1 \to p_y$ |
| MO types | σ/π bonding, σ*/π* antibonding, nonbonding (lone pairs), core |
| Advanced bonding | 3-center-4-electron (XeF₂, KrF₂, RnF₂), d-p π bonds (FeO, WC), hypervalent (UF₆, XeF₄, PCl₅), f-orbital bonding (UO₂, PuO₂, ThO₂, Pa₂O₅) |
| HOMO/LUMO | Automatic frontier orbital detection with bond order computation |
| Energy diagram | Interactive MO energy level panel with occupancy and orbital symmetry labels |
| Validation | All 188 molecules checked: quantum numbers ($n \geq 1$, $0 \leq l < n$, $|m| \leq l$), atom indices in range, positive $Z_{\text{eff}}$, non-zero coefficients |

#### Nuclear & Subatomic Physics

The nucleus renderer visualizes nuclear structure from the nucleon level down to quarks:

| Component | Method |
|-----------|--------|
| Nucleon packing | Fibonacci sphere — golden angle sampling on concentric shells |
| Nuclear data | Binding energy, spin/parity, magnetic moment, quadrupole moment for 118 elements |
| Nuclear deformation | β₂ quadrupole parameter — prolate/oblate nucleus shape applied to Fibonacci sphere packing |
| Cross-sections | Thermal neutron capture σₙ,γ (barns) from IAEA reference data |
| Separation energies | Proton (Sp) and neutron (Sn) separation energies (MeV) from AME2020 |
| Nucleosynthesis | Origin classification: Big Bang, cosmic rays, low/high-mass stars, neutron star mergers, decay, artificial |
| Chart of Nuclides | Z vs N grid colored by decay mode heuristic (β⁻, β⁺/EC, α, SF) with stability line |
| Isotopes | Natural abundance, half-life, and decay modes for all known stable/radioactive isotopes |
| Decay chains | α, β⁻, β⁺, electron capture (EC), and spontaneous fission (SF) sequences |
| Binding energy curve | 88-point B/A vs A reference data with Fe-56 peak |
| Nuclear shell model | 28 energy levels ($1s_{1/2}$ through $3d_{3/2}$) with magic numbers at 2, 8, 20, 28, 50, 82, 126 |
| SEMF | Weizsäcker formula: $B = a_V A - a_S A^{2/3} - a_C \frac{Z(Z-1)}{A^{1/3}} - a_A \frac{(N-Z)^2}{A} \pm \frac{\delta_0}{\sqrt{A}}$ |
| Half-life decay | $N(t) = N_0 \cdot (\tfrac{1}{2})^{t/t_{1/2}}$ with parser for s, ms, μs, ns, m, h, d, y, ky, My, Gy, Ey units |
| Mass defect | $\Delta m = Z \cdot m_p + N \cdot m_n - M_{\text{nucleus}}$, converted to MeV ($m_p = 938.272$, $m_n = 939.565$) |
| Strong force range | ~1.5 fm inter-nucleon connections rendered at intermediate zoom |
| Quark structure | Proton = uud, Neutron = udd — correct valence quark composition per the Standard Model |
| QCD color charge | Each nucleon contains one red, one green, one blue quark — color-neutral (white) hadrons |
| Gluon visualization | Wavy spring connections between quark pairs representing the strong force |
| Quark charges | Up quark: $+\frac{2}{3}e$, Down quark: $-\frac{1}{3}e$ — proton total $+1e$, neutron total $0$ |

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires ES6+ support (template literals, Maps, arrow functions, `const`/`let`).

## License

MIT
