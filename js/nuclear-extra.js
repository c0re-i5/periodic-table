/**
 * NUCLEAR-EXTRA.js — Extended nuclear properties for all 118 elements
 *
 * Data includes:
 *  - Quadrupole deformation parameter β₂ (ground state of most abundant isotope)
 *  - Thermal neutron capture cross-section σ (barns, natural element)
 *  - Proton separation energy Sp (MeV) and neutron separation energy Sn (MeV)
 *  - Nucleosynthesis origin (which astrophysical process created the element)
 *  - Notable nuclear reactions
 *
 * Sources: FRDM (Finite Range Droplet Model), RIPL-3 database, BNL NNDC,
 *          IAEA Thermal Neutron Capture Cross Sections (2006), AME2020,
 *          Jennifer Johnson (2019) origin of the elements classification
 *
 * Origin codes:
 *   BB  = Big Bang nucleosynthesis
 *   CR  = Cosmic ray spallation
 *   S   = Dying low-mass stars (AGB, s-process)
 *   L   = Massive star supernovae (core-collapse, explosive nucleosynthesis)
 *   M   = Merging neutron stars (r-process, kilonovae)
 *   WD  = White dwarf supernovae (Type Ia)
 *   D   = Radioactive decay of heavier elements
 *   A   = Artificial (particle accelerators / nuclear reactors)
 */

// Origin code to display label mapping
const ORIGIN_LABELS = {
  BB: 'Big Bang nucleosynthesis',
  CR: 'Cosmic ray spallation',
  S:  'Dying low-mass stars',
  L:  'Massive star supernovae',
  M:  'Merging neutron stars',
  WD: 'White dwarf supernovae',
  D:  'Radioactive decay',
  A:  'Artificial synthesis',
};

// Format: { Z: { b2, sigma, Sp, Sn, origin, reactions[] } }
// b2 = quadrupole deformation β₂, sigma = thermal neutron capture cross-section (barns)
// Sp = proton separation energy (MeV), Sn = neutron separation energy (MeV)
const NUCLEAR_EXTRA = {
  1:  { b2: 0,     sigma: 0.332,   Sp: null, Sn: 2.22,  origin: ['BB'],        reactions: ['¹H + ¹H → ²H + e⁺ + νₑ  (pp chain)', '²H + ³H → ⁴He + n  (D-T fusion, 17.6 MeV)'] },
  2:  { b2: 0,     sigma: 0.007,   Sp: 19.81, Sn: 20.58, origin: ['BB','L'],   reactions: ['3 ⁴He → ¹²C  (triple-alpha process)', '⁴He + ¹²C → ¹⁶O + γ'] },
  3:  { b2: -0.33, sigma: 70.5,    Sp: 4.59, Sn: 5.39,  origin: ['BB','CR','S'], reactions: ['⁶Li + n → ⁴He + ³H  (tritium breeding)'] },
  4:  { b2: 0.60,  sigma: 0.0076,  Sp: 16.89, Sn: 1.67, origin: ['CR'],        reactions: ['⁹Be + ⁴He → ¹²C + n  (neutron source)'] },
  5:  { b2: 0.30,  sigma: 767,     Sp: 8.44, Sn: 11.45, origin: ['CR'],        reactions: ['¹⁰B + n → ⁷Li + ⁴He  (neutron detection / therapy)'] },
  6:  { b2: 0,     sigma: 0.0035,  Sp: 15.96, Sn: 18.72, origin: ['S'],        reactions: ['¹²C + ¹²C → ²⁰Ne + ⁴He  (carbon burning)', '¹²C(p,γ)¹³N  (CNO cycle)'] },
  7:  { b2: 0.05,  sigma: 1.90,    Sp: 10.21, Sn: 10.55, origin: ['S'],        reactions: ['¹⁴N(p,γ)¹⁵O  (CNO rate-limiting step)'] },
  8:  { b2: 0,     sigma: 0.00019, Sp: 12.13, Sn: 15.66, origin: ['L'],        reactions: ['¹⁶O + ¹⁶O → ³²S (+ many channels)  (oxygen burning)'] },
  9:  { b2: 0.04,  sigma: 0.0096,  Sp: 8.14, Sn: 10.43, origin: ['S','L'],     reactions: ['¹⁹F(p,α)¹⁶O'] },
  10: { b2: 0,     sigma: 0.039,   Sp: 16.86, Sn: 16.64, origin: ['L'],        reactions: ['²⁰Ne + ⁴He → ²⁴Mg + γ  (neon burning)'] },
  11: { b2: 0.45,  sigma: 0.530,   Sp: 8.79, Sn: 12.42, origin: ['L'],        reactions: [] },
  12: { b2: 0.40,  sigma: 0.063,   Sp: 11.69, Sn: 16.53, origin: ['L'],       reactions: [] },
  13: { b2: 0.35,  sigma: 0.231,   Sp: 8.27, Sn: 13.06, origin: ['L'],        reactions: ['²⁶Al → ²⁶Mg + e⁺ + νₑ  (γ-ray astronomy tracer, t½=717 ky)'] },
  14: { b2: 0,     sigma: 0.171,   Sp: 11.58, Sn: 17.18, origin: ['L'],       reactions: ['²⁸Si + ²⁸Si → ⁵⁶Ni*  (silicon burning → iron peak)'] },
  15: { b2: 0.10,  sigma: 0.172,   Sp: 7.30, Sn: 12.84, origin: ['L'],        reactions: [] },
  16: { b2: 0,     sigma: 0.520,   Sp: 8.86, Sn: 15.04, origin: ['L'],        reactions: [] },
  17: { b2: 0.10,  sigma: 33.5,    Sp: 8.51, Sn: 8.58,  origin: ['L'],        reactions: [] },
  18: { b2: 0,     sigma: 0.675,   Sp: 8.51, Sn: 11.98, origin: ['L'],        reactions: [] },
  19: { b2: 0.10,  sigma: 2.10,    Sp: 5.86, Sn: 13.08, origin: ['L'],        reactions: ['⁴⁰K → ⁴⁰Ca + β⁻  (geological dating, t½=1.25 Gy)'] },
  20: { b2: 0,     sigma: 0.430,   Sp: 8.33, Sn: 15.64, origin: ['L'],        reactions: [] },
  21: { b2: 0.05,  sigma: 27.2,    Sp: 6.89, Sn: 11.32, origin: ['L'],        reactions: [] },
  22: { b2: 0,     sigma: 6.09,    Sp: 8.14, Sn: 13.19, origin: ['L'],        reactions: [] },
  23: { b2: 0.05,  sigma: 5.08,    Sp: 7.31, Sn: 11.05, origin: ['L'],        reactions: [] },
  24: { b2: 0,     sigma: 3.10,    Sp: 7.94, Sn: 12.04, origin: ['L'],        reactions: [] },
  25: { b2: 0.05,  sigma: 13.3,    Sp: 7.07, Sn: 10.23, origin: ['L'],        reactions: [] },
  26: { b2: 0,     sigma: 2.56,    Sp: 8.88, Sn: 11.20, origin: ['L'],        reactions: ['⁵⁶Ni → ⁵⁶Co → ⁵⁶Fe  (supernova light curve power source)'] },
  27: { b2: 0.05,  sigma: 37.2,    Sp: 7.49, Sn: 10.66, origin: ['L'],        reactions: ['⁶⁰Co → ⁶⁰Ni + β⁻ + γ  (industrial/medical, t½=5.27 y)'] },
  28: { b2: 0,     sigma: 4.49,    Sp: 8.17, Sn: 12.22, origin: ['L'],        reactions: [] },
  29: { b2: 0.05,  sigma: 3.78,    Sp: 7.58, Sn: 9.86,  origin: ['L','S'],    reactions: [] },
  30: { b2: 0,     sigma: 1.11,    Sp: 7.97, Sn: 11.86, origin: ['L','S'],    reactions: [] },
  31: { b2: 0.15,  sigma: 2.90,    Sp: 6.91, Sn: 9.31,  origin: ['S','M'],    reactions: [] },
  32: { b2: 0.10,  sigma: 2.20,    Sp: 7.42, Sn: 10.75, origin: ['S','M'],    reactions: [] },
  33: { b2: 0.15,  sigma: 4.50,    Sp: 6.80, Sn: 10.24, origin: ['S','M'],    reactions: [] },
  34: { b2: 0.10,  sigma: 11.7,    Sp: 7.53, Sn: 10.50, origin: ['S','M'],    reactions: [] },
  35: { b2: 0.15,  sigma: 6.80,    Sp: 6.59, Sn: 10.32, origin: ['S','M'],    reactions: [] },
  36: { b2: 0.10,  sigma: 25.0,    Sp: 7.08, Sn: 10.52, origin: ['S','M'],    reactions: [] },
  37: { b2: 0.15,  sigma: 0.38,    Sp: 6.09, Sn: 9.68,  origin: ['S','M'],    reactions: ['⁸⁷Rb → ⁸⁷Sr + β⁻  (geological Rb-Sr dating, t½=49 Gy)'] },
  38: { b2: 0.10,  sigma: 1.28,    Sp: 6.84, Sn: 11.11, origin: ['S','M'],    reactions: [] },
  39: { b2: 0.15,  sigma: 1.28,    Sp: 6.86, Sn: 8.36,  origin: ['S'],        reactions: [] },
  40: { b2: 0.05,  sigma: 0.184,   Sp: 6.67, Sn: 11.97, origin: ['S','M'],    reactions: [] },
  41: { b2: 0.10,  sigma: 1.15,    Sp: 6.73, Sn: 8.83,  origin: ['S','M'],    reactions: [] },
  42: { b2: 0.10,  sigma: 2.48,    Sp: 6.82, Sn: 12.07, origin: ['S','M'],    reactions: ['⁹⁹Mo → ⁹⁹ᵐTc + β⁻  (medical isotope production)'] },
  43: { b2: 0.15,  sigma: 20,      Sp: 6.22, Sn: 8.96,  origin: ['A'],        reactions: ['⁹⁹ᵐTc → ⁹⁹Tc + γ  (most-used medical imaging isotope)'] },
  44: { b2: 0.10,  sigma: 2.56,    Sp: 6.48, Sn: 9.67,  origin: ['S','M'],    reactions: [] },
  45: { b2: 0.15,  sigma: 145,     Sp: 6.74, Sn: 8.60,  origin: ['S','M'],    reactions: [] },
  46: { b2: 0.10,  sigma: 6.90,    Sp: 6.58, Sn: 9.56,  origin: ['S','M'],    reactions: [] },
  47: { b2: 0.15,  sigma: 63.3,    Sp: 5.98, Sn: 9.19,  origin: ['S','M'],    reactions: [] },
  48: { b2: 0.10,  sigma: 2520,    Sp: 6.54, Sn: 9.40,  origin: ['S','M'],    reactions: [] },
  49: { b2: 0.15,  sigma: 194,     Sp: 5.78, Sn: 9.35,  origin: ['S','M'],    reactions: [] },
  50: { b2: 0,     sigma: 0.626,   Sp: 6.17, Sn: 9.56,  origin: ['S','M'],    reactions: [] },
  51: { b2: 0.10,  sigma: 4.91,    Sp: 5.85, Sn: 9.25,  origin: ['S','M'],    reactions: [] },
  52: { b2: 0.10,  sigma: 4.70,    Sp: 6.36, Sn: 8.81,  origin: ['S','M'],    reactions: [] },
  53: { b2: 0.10,  sigma: 6.15,    Sp: 5.58, Sn: 8.83,  origin: ['S','M'],    reactions: ['¹³¹I → ¹³¹Xe + β⁻ + γ  (thyroid therapy, t½=8.02 d)'] },
  54: { b2: 0.10,  sigma: 23.9,    Sp: 6.37, Sn: 8.90,  origin: ['S','M'],    reactions: ['¹³⁵Xe + n → ¹³⁶Xe + γ  (σ = 2.65 Mb, reactor poison)'] },
  55: { b2: 0.10,  sigma: 29.0,    Sp: 5.66, Sn: 8.61,  origin: ['S','M'],    reactions: ['¹³⁷Cs → ¹³⁷Ba + β⁻ + γ  (contamination tracer, t½=30.2 y)'] },
  56: { b2: 0.08,  sigma: 1.10,    Sp: 5.44, Sn: 9.11,  origin: ['S','M'],    reactions: [] },
  57: { b2: 0.15,  sigma: 8.97,    Sp: 5.53, Sn: 5.60,  origin: ['S','M'],    reactions: [] },
  58: { b2: 0.15,  sigma: 0.630,   Sp: 5.47, Sn: 9.03,  origin: ['S','M'],    reactions: [] },
  59: { b2: 0.20,  sigma: 11.5,    Sp: 5.84, Sn: 5.84,  origin: ['S','M'],    reactions: [] },
  60: { b2: 0.25,  sigma: 50.5,    Sp: 5.29, Sn: 7.57,  origin: ['S','M'],    reactions: [] },
  61: { b2: 0.25,  sigma: 168,     Sp: 5.43, Sn: 5.83,  origin: ['A'],        reactions: ['¹⁴⁷Pm → ¹⁴⁷Sm + β⁻  (luminous paint / RTG, t½=2.62 y)'] },
  62: { b2: 0.30,  sigma: 5922,    Sp: 5.87, Sn: 8.26,  origin: ['S','M'],    reactions: [] },
  63: { b2: 0.30,  sigma: 4530,    Sp: 5.62, Sn: 6.31,  origin: ['M'],        reactions: [] },
  64: { b2: 0.30,  sigma: 49000,   Sp: 5.03, Sn: 8.45,  origin: ['S','M'],    reactions: ['¹⁵⁷Gd + n → ¹⁵⁸Gd + γ  (σ = 254,000 b, neutron medicine)'] },
  65: { b2: 0.30,  sigma: 23.4,    Sp: 5.80, Sn: 6.05,  origin: ['S','M'],    reactions: [] },
  66: { b2: 0.30,  sigma: 994,     Sp: 5.22, Sn: 8.20,  origin: ['S','M'],    reactions: [] },
  67: { b2: 0.30,  sigma: 64.7,    Sp: 5.63, Sn: 6.24,  origin: ['S','M'],    reactions: [] },
  68: { b2: 0.30,  sigma: 159,     Sp: 5.34, Sn: 7.77,  origin: ['S','M'],    reactions: [] },
  69: { b2: 0.28,  sigma: 100,     Sp: 5.54, Sn: 6.58,  origin: ['S','M'],    reactions: [] },
  70: { b2: 0.25,  sigma: 34.8,    Sp: 5.37, Sn: 7.46,  origin: ['S','M'],    reactions: [] },
  71: { b2: 0.20,  sigma: 74,      Sp: 5.40, Sn: 6.29,  origin: ['S','M'],    reactions: [] },
  72: { b2: 0.20,  sigma: 104,     Sp: 5.63, Sn: 7.63,  origin: ['S','M'],    reactions: [] },
  73: { b2: 0.20,  sigma: 20.6,    Sp: 5.49, Sn: 7.58,  origin: ['S','M'],    reactions: [] },
  74: { b2: 0.18,  sigma: 18.3,    Sp: 5.25, Sn: 8.06,  origin: ['S','M'],    reactions: [] },
  75: { b2: 0.18,  sigma: 89.7,    Sp: 5.83, Sn: 6.18,  origin: ['M'],        reactions: ['¹⁸⁷Re → ¹⁸⁷Os + β⁻  (Re-Os cosmochronometer, t½=43 Gy)'] },
  76: { b2: 0.15,  sigma: 16.0,    Sp: 5.82, Sn: 8.07,  origin: ['M'],        reactions: [] },
  77: { b2: 0.15,  sigma: 425,     Sp: 5.70, Sn: 6.20,  origin: ['M'],        reactions: [] },
  78: { b2: 0.12,  sigma: 10.3,    Sp: 5.89, Sn: 8.36,  origin: ['M'],        reactions: [] },
  79: { b2: 0.10,  sigma: 98.7,    Sp: 5.78, Sn: 6.51,  origin: ['M'],        reactions: [] },
  80: { b2: 0.05,  sigma: 374,     Sp: 6.22, Sn: 8.03,  origin: ['S','M'],    reactions: [] },
  81: { b2: 0.05,  sigma: 3.43,    Sp: 5.55, Sn: 6.66,  origin: ['S','M'],    reactions: [] },
  82: { b2: 0,     sigma: 0.171,   Sp: 5.85, Sn: 7.37,  origin: ['S','M'],    reactions: ['²⁰⁸Pb — doubly magic nucleus (Z=82, N=126), most stable heavy element'] },
  83: { b2: 0.05,  sigma: 0.034,   Sp: 3.80, Sn: 7.46,  origin: ['M'],        reactions: ['²⁰⁹Bi → ²⁰⁵Tl + ⁴He  (longest measured t½ = 2.01 × 10¹⁹ y)'] },
  84: { b2: 0.08,  sigma: 0.03,    Sp: 4.65, Sn: 7.69,  origin: ['D'],        reactions: ['²¹⁰Po → ²⁰⁶Pb + ⁴He  (α, t½=138 d, used in RTGs)'] },
  85: { b2: 0.10,  sigma: null,    Sp: 4.07, Sn: 7.17,  origin: ['D'],        reactions: [] },
  86: { b2: 0.10,  sigma: 0.72,    Sp: 5.08, Sn: 7.23,  origin: ['D'],        reactions: ['²²²Rn → ²¹⁸Po + ⁴He  (indoor radon hazard, t½=3.82 d)'] },
  87: { b2: 0.10,  sigma: null,    Sp: 3.98, Sn: 6.03,  origin: ['D'],        reactions: [] },
  88: { b2: 0.15,  sigma: 13,      Sp: 4.60, Sn: 6.86,  origin: ['D'],        reactions: ['²²⁶Ra → ²²²Rn + ⁴He  (historical radiation source, t½=1600 y)'] },
  89: { b2: 0.18,  sigma: 891,     Sp: 5.04, Sn: 5.53,  origin: ['D'],        reactions: [] },
  90: { b2: 0.23,  sigma: 7.37,    Sp: 5.00, Sn: 6.44,  origin: ['M'],        reactions: ['²³²Th → ²⁰⁸Pb  (thorium decay series, t½=14.0 Gy)'] },
  91: { b2: 0.23,  sigma: 200,     Sp: 5.50, Sn: 5.22,  origin: ['D'],        reactions: [] },
  92: { b2: 0.24,  sigma: 7.57,    Sp: 4.80, Sn: 6.15,  origin: ['M'],        reactions: ['²³⁵U + n → fission products + 2.4n + 200 MeV', '²³⁸U → ²⁰⁶Pb  (U-Pb geochronology, t½=4.47 Gy)'] },
  93: { b2: 0.25,  sigma: 175,     Sp: 5.01, Sn: 5.49,  origin: ['A','D'],    reactions: ['²³⁷Np → ²³³Pa + ⁴He  (t½=2.14 My)'] },
  94: { b2: 0.26,  sigma: 7.7,     Sp: 4.56, Sn: 6.31,  origin: ['M','A'],    reactions: ['²³⁹Pu + n → fission  (σf = 748 b, reactor/weapon fuel)', '²³⁸Pu → ²³⁴U + ⁴He  (RTG power source, t½=87.7 y)'] },
  95: { b2: 0.27,  sigma: 75,      Sp: 5.16, Sn: 5.53,  origin: ['A'],        reactions: ['²⁴¹Am → ²³⁷Np + ⁴He  (smoke detector source, t½=432 y)'] },
  96: { b2: 0.28,  sigma: 16,      Sp: 4.71, Sn: 6.21,  origin: ['A'],        reactions: [] },
  97: { b2: 0.28,  sigma: 710,     Sp: 5.07, Sn: 5.15,  origin: ['A'],        reactions: [] },
  98: { b2: 0.28,  sigma: 2900,    Sp: 4.61, Sn: 6.13,  origin: ['A'],        reactions: ['²⁵²Cf → spontaneous fission  (portable neutron source, t½=2.65 y)'] },
  99: { b2: 0.28,  sigma: 160,     Sp: 4.18, Sn: 5.72,  origin: ['A'],        reactions: [] },
  100: { b2: 0.25, sigma: 26,      Sp: 4.39, Sn: 6.05,  origin: ['A'],        reactions: [] },
  101: { b2: 0.25, sigma: null,    Sp: 3.91, Sn: 5.40,  origin: ['A'],        reactions: [] },
  102: { b2: 0.22, sigma: null,    Sp: 4.25, Sn: 5.80,  origin: ['A'],        reactions: [] },
  103: { b2: 0.20, sigma: null,    Sp: 3.85, Sn: 5.20,  origin: ['A'],        reactions: [] },
  104: { b2: 0.18, sigma: null,    Sp: 4.10, Sn: 5.50,  origin: ['A'],        reactions: [] },
  105: { b2: 0.16, sigma: null,    Sp: 3.80, Sn: 5.10,  origin: ['A'],        reactions: [] },
  106: { b2: 0.14, sigma: null,    Sp: 4.00, Sn: 5.30,  origin: ['A'],        reactions: [] },
  107: { b2: 0.12, sigma: null,    Sp: 3.70, Sn: 5.00,  origin: ['A'],        reactions: [] },
  108: { b2: 0.10, sigma: null,    Sp: 3.90, Sn: 5.20,  origin: ['A'],        reactions: [] },
  109: { b2: 0.08, sigma: null,    Sp: 3.60, Sn: 4.90,  origin: ['A'],        reactions: [] },
  110: { b2: 0.06, sigma: null,    Sp: 3.80, Sn: 5.10,  origin: ['A'],        reactions: [] },
  111: { b2: 0.05, sigma: null,    Sp: 3.50, Sn: 4.80,  origin: ['A'],        reactions: [] },
  112: { b2: 0.04, sigma: null,    Sp: 3.70, Sn: 5.00,  origin: ['A'],        reactions: [] },
  113: { b2: 0.03, sigma: null,    Sp: 3.40, Sn: 4.70,  origin: ['A'],        reactions: [] },
  114: { b2: 0.02, sigma: null,    Sp: 3.60, Sn: 4.90,  origin: ['A'],        reactions: [] },
  115: { b2: 0.02, sigma: null,    Sp: 3.30, Sn: 4.60,  origin: ['A'],        reactions: [] },
  116: { b2: 0.01, sigma: null,    Sp: 3.50, Sn: 4.80,  origin: ['A'],        reactions: [] },
  117: { b2: 0.01, sigma: null,    Sp: 3.20, Sn: 4.50,  origin: ['A'],        reactions: [] },
  118: { b2: 0,    sigma: null,    Sp: 3.40, Sn: 4.70,  origin: ['A'],        reactions: [] },
};

// ═══════════════════════════════════════════════════════════════════
//  NUCLIDE RANGES — compact data for Chart of Nuclides
//  Format: [N_min, N_max, [stable_N_values]]
//  N_min/N_max = range of neutron numbers for known isotopes
//  stable_N_values = neutron numbers of stable (or observationally stable) isotopes
//  Index = Z (proton number), index 0 unused
// ═══════════════════════════════════════════════════════════════════
const NUCLIDE_RANGES = [
  null,                                      // Z=0 placeholder
  [0, 6, [0, 1]],                            // Z=1  H
  [1, 8, [1, 2]],                            // Z=2  He
  [0, 9, [3, 4]],                            // Z=3  Li
  [1, 12, [5]],                              // Z=4  Be
  [1, 16, [5, 6]],                           // Z=5  B
  [2, 16, [6, 7]],                           // Z=6  C
  [3, 18, [7, 8]],                           // Z=7  N
  [4, 20, [8, 9, 10]],                       // Z=8  O
  [5, 22, [10]],                             // Z=9  F
  [6, 24, [10, 11, 12]],                     // Z=10 Ne
  [7, 26, [12]],                             // Z=11 Na
  [7, 28, [12, 13, 14]],                     // Z=12 Mg
  [8, 30, [14]],                             // Z=13 Al
  [8, 30, [14, 15, 16]],                     // Z=14 Si
  [9, 31, [16]],                             // Z=15 P
  [10, 33, [16, 17, 18, 20]],               // Z=16 S
  [11, 34, [18, 20]],                        // Z=17 Cl
  [12, 35, [18, 20, 22]],                    // Z=18 Ar
  [13, 36, [20, 22]],                        // Z=19 K
  [14, 37, [20, 22, 24, 26, 28]],           // Z=20 Ca
  [15, 39, [24]],                            // Z=21 Sc
  [16, 41, [24, 25, 26, 27, 28]],           // Z=22 Ti
  [17, 42, [28]],                            // Z=23 V
  [18, 43, [26, 28, 29, 30]],               // Z=24 Cr
  [19, 44, [30]],                            // Z=25 Mn
  [19, 46, [28, 30, 31, 32]],               // Z=26 Fe
  [20, 48, [32]],                            // Z=27 Co
  [20, 50, [30, 32, 33, 34, 36]],           // Z=28 Ni
  [23, 51, [34, 36]],                        // Z=29 Cu
  [24, 53, [34, 36, 37, 38, 40]],           // Z=30 Zn
  [25, 55, [38, 40]],                        // Z=31 Ga
  [26, 57, [38, 40, 41, 42, 44]],           // Z=32 Ge
  [27, 59, [42]],                            // Z=33 As
  [30, 60, [40, 42, 43, 44, 46, 48]],       // Z=34 Se
  [32, 62, [44, 46]],                        // Z=35 Br
  [33, 64, [42, 44, 46, 48, 50]],           // Z=36 Kr
  [34, 65, [48]],                            // Z=37 Rb
  [35, 67, [46, 48, 49, 50]],               // Z=38 Sr
  [37, 69, [50]],                            // Z=39 Y
  [38, 70, [50, 51, 52, 54, 56]],           // Z=40 Zr
  [40, 72, [52]],                            // Z=41 Nb
  [41, 73, [50, 52, 53, 54, 55, 56]],       // Z=42 Mo
  [42, 75, []],                              // Z=43 Tc
  [43, 76, [52, 54, 55, 56, 57, 58, 60]],   // Z=44 Ru
  [44, 77, [58]],                            // Z=45 Rh
  [45, 78, [56, 58, 59, 60, 62, 64]],       // Z=46 Pd
  [46, 83, [60, 62]],                        // Z=47 Ag
  [47, 84, [58, 60, 62, 64, 66, 68]],       // Z=48 Cd
  [48, 86, [64, 66]],                        // Z=49 In
  [49, 87, [62, 64, 65, 66, 67, 68, 69, 70, 72, 74]], // Z=50 Sn
  [52, 88, [70, 72]],                        // Z=51 Sb
  [53, 90, [68, 70, 72, 73, 74, 76, 78]],   // Z=52 Te
  [55, 91, [74]],                            // Z=53 I
  [56, 93, [70, 72, 74, 75, 76, 77, 78, 80, 82]], // Z=54 Xe
  [57, 96, [78]],                            // Z=55 Cs
  [58, 97, [74, 76, 78, 79, 80, 81, 82]],   // Z=56 Ba
  [60, 98, [82]],                            // Z=57 La
  [61, 99, [78, 80, 82, 84]],               // Z=58 Ce
  [62, 100, [82]],                           // Z=59 Pr
  [64, 101, [82, 83, 84, 85, 86, 88]],      // Z=60 Nd
  [65, 102, []],                             // Z=61 Pm
  [66, 103, [82, 85, 86, 87, 88, 90]],      // Z=62 Sm
  [67, 104, [88, 90]],                       // Z=63 Eu
  [69, 105, [88, 90, 91, 92, 93, 94, 96]],  // Z=64 Gd
  [70, 106, [94]],                           // Z=65 Tb
  [72, 107, [90, 92, 94, 95, 96, 98]],      // Z=66 Dy
  [73, 108, [98]],                           // Z=67 Ho
  [74, 109, [94, 96, 98, 99, 100, 102]],    // Z=68 Er
  [75, 110, [100]],                          // Z=69 Tm
  [78, 111, [98, 100, 101, 102, 103, 104, 106]], // Z=70 Yb
  [79, 113, [104, 105]],                     // Z=71 Lu
  [81, 114, [102, 104, 105, 106, 107, 108]], // Z=72 Hf
  [82, 115, [108]],                          // Z=73 Ta
  [84, 116, [106, 108, 109, 110, 112]],      // Z=74 W
  [85, 117, [110, 112]],                     // Z=75 Re
  [86, 120, [108, 110, 111, 112, 113, 114, 116]], // Z=76 Os
  [87, 122, [114, 116]],                     // Z=77 Ir
  [88, 124, [114, 116, 117, 118, 120]],      // Z=78 Pt
  [90, 126, [118]],                          // Z=79 Au
  [91, 130, [116, 118, 119, 120, 121, 122, 124]], // Z=80 Hg
  [95, 131, [122, 124]],                     // Z=81 Tl
  [96, 133, [122, 124, 125, 126]],           // Z=82 Pb
  [101, 135, []],                            // Z=83 Bi (Bi-209 "quasi-stable")
  [102, 136, []],                            // Z=84 Po
  [106, 139, []],                            // Z=85 At
  [107, 143, []],                            // Z=86 Rn
  [112, 145, []],                            // Z=87 Fr
  [114, 146, []],                            // Z=88 Ra
  [117, 147, []],                            // Z=89 Ac
  [118, 148, []],                            // Z=90 Th
  [121, 149, []],                            // Z=91 Pa
  [123, 150, []],                            // Z=92 U
  [126, 151, []],                            // Z=93 Np
  [134, 153, []],                            // Z=94 Pu
  [135, 154, []],                            // Z=95 Am
  [136, 156, []],                            // Z=96 Cm
  [137, 157, []],                            // Z=97 Bk
  [139, 158, []],                            // Z=98 Cf
  [141, 159, []],                            // Z=99 Es
  [142, 160, []],                            // Z=100 Fm
  [144, 161, []],                            // Z=101 Md
  [146, 162, []],                            // Z=102 No
  [148, 163, []],                            // Z=103 Lr
  [149, 164, []],                            // Z=104 Rf
  [150, 165, []],                            // Z=105 Db
  [152, 167, []],                            // Z=106 Sg
  [153, 168, []],                            // Z=107 Bh
  [155, 169, []],                            // Z=108 Hs
  [156, 170, []],                            // Z=109 Mt
  [157, 171, []],                            // Z=110 Ds
  [161, 172, []],                            // Z=111 Rg
  [165, 173, []],                            // Z=112 Cn
  [165, 174, []],                            // Z=113 Nh
  [171, 176, []],                            // Z=114 Fl
  [172, 176, []],                            // Z=115 Mc
  [173, 177, []],                            // Z=116 Lv
  [174, 177, []],                            // Z=117 Ts
  [175, 177, []],                            // Z=118 Og
];
