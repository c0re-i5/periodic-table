/**
 * NUCLEAR-DATA.js — Nuclear properties, isotopes, and decay data for all 118 elements
 *
 * Data includes:
 *  - Nuclear properties: protons, neutrons (most stable isotope), nuclear radius,
 *    binding energy per nucleon, spin, parity, magnetic moment, quadrupole moment
 *  - Isotopes: mass number, natural abundance, half-life, decay modes, spin
 *  - Decay chains: for radioactive elements, the path to stability
 *  - Quark content summary: total u/d quarks in the nucleus
 *
 * Sources: NUBASE2020 evaluation, IAEA Nuclear Data Services, NNDC at BNL,
 *          AME2020 atomic mass evaluation
 *
 * Half-life notation: 's' = seconds, 'm' = minutes, 'h' = hours, 'd' = days,
 *   'y' = years, 'ky' = kiloyears, 'My' = megayears, 'Gy' = gigayears,
 *   'stable' = stable isotope
 *
 * Decay modes: 'α' = alpha, 'β⁻' = beta minus, 'β⁺' = beta plus / EC,
 *   'EC' = electron capture, 'IT' = isomeric transition, 'SF' = spontaneous fission,
 *   'p' = proton emission, 'n' = neutron emission, '2β⁻' = double beta minus
 */

const NUCLEAR_DATA = {
  // ═══════════════════════════════════════════════════════════
  // Z = 1 — Hydrogen
  // ═══════════════════════════════════════════════════════════
  1: {
    z: 1,
    symbol: 'H',
    nucleons: 1,          // most abundant isotope mass number
    radius: 0.88,         // charge radius in fm
    bindingPerNucleon: 0,  // single nucleon
    spin: '1/2+',
    magneticMoment: 2.793, // nuclear magnetons
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 1, name: 'Protium',  abundance: 99.9855, halfLife: 'stable', decayModes: [], spin: '1/2+' },
      { a: 2, name: 'Deuterium', abundance: 0.0145, halfLife: 'stable', decayModes: [], spin: '1+' },
      { a: 3, name: 'Tritium',   abundance: 0, halfLife: '12.32 y', decayModes: ['β⁻'], spin: '1/2+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 2 — Helium
  // ═══════════════════════════════════════════════════════════
  2: {
    z: 2,
    symbol: 'He',
    nucleons: 4,
    radius: 1.68,
    bindingPerNucleon: 7.07,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 3, name: 'Helion',   abundance: 0.0002, halfLife: 'stable', decayModes: [], spin: '1/2+' },
      { a: 4, name: 'Alpha',    abundance: 99.9998, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 6, name: 'He-6',     abundance: 0, halfLife: '0.807 s', decayModes: ['β⁻'], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 3 — Lithium
  // ═══════════════════════════════════════════════════════════
  3: {
    z: 3,
    symbol: 'Li',
    nucleons: 7,
    radius: 2.39,
    bindingPerNucleon: 5.61,
    spin: '3/2-',
    magneticMoment: 3.256,
    quadrupole: -0.040,
    stable: true,
    isotopes: [
      { a: 6, name: 'Li-6', abundance: 7.59, halfLife: 'stable', decayModes: [], spin: '1+' },
      { a: 7, name: 'Li-7', abundance: 92.41, halfLife: 'stable', decayModes: [], spin: '3/2-' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 4 — Beryllium
  // ═══════════════════════════════════════════════════════════
  4: {
    z: 4,
    symbol: 'Be',
    nucleons: 9,
    radius: 2.52,
    bindingPerNucleon: 6.46,
    spin: '3/2-',
    magneticMoment: -1.178,
    quadrupole: 0.053,
    stable: true,
    isotopes: [
      { a: 7, name: 'Be-7',  abundance: 0, halfLife: '53.22 d', decayModes: ['EC'], spin: '3/2-' },
      { a: 9, name: 'Be-9',  abundance: 100, halfLife: 'stable', decayModes: [], spin: '3/2-' },
      { a: 10, name: 'Be-10', abundance: 0, halfLife: '1.39 My', decayModes: ['β⁻'], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 5 — Boron
  // ═══════════════════════════════════════════════════════════
  5: {
    z: 5,
    symbol: 'B',
    nucleons: 11,
    radius: 2.42,
    bindingPerNucleon: 6.93,
    spin: '3/2-',
    magneticMoment: 2.689,
    quadrupole: 0.041,
    stable: true,
    isotopes: [
      { a: 10, name: 'B-10', abundance: 19.9, halfLife: 'stable', decayModes: [], spin: '3+' },
      { a: 11, name: 'B-11', abundance: 80.1, halfLife: 'stable', decayModes: [], spin: '3/2-' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 6 — Carbon
  // ═══════════════════════════════════════════════════════════
  6: {
    z: 6,
    symbol: 'C',
    nucleons: 12,
    radius: 2.47,
    bindingPerNucleon: 7.68,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 11, name: 'C-11', abundance: 0, halfLife: '20.33 m', decayModes: ['β⁺'], spin: '3/2-' },
      { a: 12, name: 'C-12', abundance: 98.93, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 13, name: 'C-13', abundance: 1.07, halfLife: 'stable', decayModes: [], spin: '1/2-' },
      { a: 14, name: 'C-14', abundance: 0, halfLife: '5730 y', decayModes: ['β⁻'], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 7 — Nitrogen
  // ═══════════════════════════════════════════════════════════
  7: {
    z: 7,
    symbol: 'N',
    nucleons: 14,
    radius: 2.56,
    bindingPerNucleon: 7.48,
    spin: '1+',
    magneticMoment: 0.404,
    quadrupole: 0.020,
    stable: true,
    isotopes: [
      { a: 13, name: 'N-13', abundance: 0, halfLife: '9.97 m', decayModes: ['β⁺'], spin: '1/2-' },
      { a: 14, name: 'N-14', abundance: 99.636, halfLife: 'stable', decayModes: [], spin: '1+' },
      { a: 15, name: 'N-15', abundance: 0.364, halfLife: 'stable', decayModes: [], spin: '1/2-' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 8 — Oxygen
  // ═══════════════════════════════════════════════════════════
  8: {
    z: 8,
    symbol: 'O',
    nucleons: 16,
    radius: 2.70,
    bindingPerNucleon: 7.98,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 16, name: 'O-16', abundance: 99.757, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 17, name: 'O-17', abundance: 0.038, halfLife: 'stable', decayModes: [], spin: '5/2+' },
      { a: 18, name: 'O-18', abundance: 0.205, halfLife: 'stable', decayModes: [], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 9 — Fluorine
  // ═══════════════════════════════════════════════════════════
  9: {
    z: 9,
    symbol: 'F',
    nucleons: 19,
    radius: 2.90,
    bindingPerNucleon: 7.78,
    spin: '1/2+',
    magneticMoment: 2.629,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 18, name: 'F-18', abundance: 0, halfLife: '109.77 m', decayModes: ['β⁺'], spin: '1+' },
      { a: 19, name: 'F-19', abundance: 100, halfLife: 'stable', decayModes: [], spin: '1/2+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 10 — Neon
  // ═══════════════════════════════════════════════════════════
  10: {
    z: 10,
    symbol: 'Ne',
    nucleons: 20,
    radius: 3.01,
    bindingPerNucleon: 8.03,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 20, name: 'Ne-20', abundance: 90.48, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 21, name: 'Ne-21', abundance: 0.27, halfLife: 'stable', decayModes: [], spin: '3/2+' },
      { a: 22, name: 'Ne-22', abundance: 9.25, halfLife: 'stable', decayModes: [], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 11 — Sodium
  // ═══════════════════════════════════════════════════════════
  11: {
    z: 11,
    symbol: 'Na',
    nucleons: 23,
    radius: 2.99,
    bindingPerNucleon: 8.11,
    spin: '3/2+',
    magneticMoment: 2.218,
    quadrupole: 0.104,
    stable: true,
    isotopes: [
      { a: 22, name: 'Na-22', abundance: 0, halfLife: '2.603 y', decayModes: ['β⁺'], spin: '3+' },
      { a: 23, name: 'Na-23', abundance: 100, halfLife: 'stable', decayModes: [], spin: '3/2+' },
      { a: 24, name: 'Na-24', abundance: 0, halfLife: '14.96 h', decayModes: ['β⁻'], spin: '4+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 12 — Magnesium
  // ═══════════════════════════════════════════════════════════
  12: {
    z: 12,
    symbol: 'Mg',
    nucleons: 24,
    radius: 3.06,
    bindingPerNucleon: 8.26,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 24, name: 'Mg-24', abundance: 78.99, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 25, name: 'Mg-25', abundance: 10.00, halfLife: 'stable', decayModes: [], spin: '5/2+' },
      { a: 26, name: 'Mg-26', abundance: 11.01, halfLife: 'stable', decayModes: [], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 13 — Aluminum
  // ═══════════════════════════════════════════════════════════
  13: {
    z: 13,
    symbol: 'Al',
    nucleons: 27,
    radius: 3.06,
    bindingPerNucleon: 8.33,
    spin: '5/2+',
    magneticMoment: 3.642,
    quadrupole: 0.147,
    stable: true,
    isotopes: [
      { a: 26, name: 'Al-26', abundance: 0, halfLife: '717 ky', decayModes: ['β⁺'], spin: '5+' },
      { a: 27, name: 'Al-27', abundance: 100, halfLife: 'stable', decayModes: [], spin: '5/2+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 14 — Silicon
  // ═══════════════════════════════════════════════════════════
  14: {
    z: 14,
    symbol: 'Si',
    nucleons: 28,
    radius: 3.12,
    bindingPerNucleon: 8.45,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 28, name: 'Si-28', abundance: 92.223, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 29, name: 'Si-29', abundance: 4.685, halfLife: 'stable', decayModes: [], spin: '1/2+' },
      { a: 30, name: 'Si-30', abundance: 3.092, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 32, name: 'Si-32', abundance: 0, halfLife: '153 y', decayModes: ['β⁻'], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 15 — Phosphorus
  // ═══════════════════════════════════════════════════════════
  15: {
    z: 15,
    symbol: 'P',
    nucleons: 31,
    radius: 3.19,
    bindingPerNucleon: 8.48,
    spin: '1/2+',
    magneticMoment: 1.132,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 31, name: 'P-31', abundance: 100, halfLife: 'stable', decayModes: [], spin: '1/2+' },
      { a: 32, name: 'P-32', abundance: 0, halfLife: '14.27 d', decayModes: ['β⁻'], spin: '1+' },
      { a: 33, name: 'P-33', abundance: 0, halfLife: '25.35 d', decayModes: ['β⁻'], spin: '1/2+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 16 — Sulfur
  // ═══════════════════════════════════════════════════════════
  16: {
    z: 16,
    symbol: 'S',
    nucleons: 32,
    radius: 3.26,
    bindingPerNucleon: 8.49,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 32, name: 'S-32', abundance: 94.99, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 33, name: 'S-33', abundance: 0.75, halfLife: 'stable', decayModes: [], spin: '3/2+' },
      { a: 34, name: 'S-34', abundance: 4.25, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 35, name: 'S-35', abundance: 0, halfLife: '87.37 d', decayModes: ['β⁻'], spin: '3/2+' },
      { a: 36, name: 'S-36', abundance: 0.01, halfLife: 'stable', decayModes: [], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 17 — Chlorine
  // ═══════════════════════════════════════════════════════════
  17: {
    z: 17,
    symbol: 'Cl',
    nucleons: 35,
    radius: 3.37,
    bindingPerNucleon: 8.52,
    spin: '3/2+',
    magneticMoment: 0.822,
    quadrupole: -0.082,
    stable: true,
    isotopes: [
      { a: 35, name: 'Cl-35', abundance: 75.76, halfLife: 'stable', decayModes: [], spin: '3/2+' },
      { a: 36, name: 'Cl-36', abundance: 0, halfLife: '301 ky', decayModes: ['β⁻','β⁺'], spin: '2+' },
      { a: 37, name: 'Cl-37', abundance: 24.24, halfLife: 'stable', decayModes: [], spin: '3/2+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 18 — Argon
  // ═══════════════════════════════════════════════════════════
  18: {
    z: 18,
    symbol: 'Ar',
    nucleons: 40,
    radius: 3.43,
    bindingPerNucleon: 8.60,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 36, name: 'Ar-36', abundance: 0.3336, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 38, name: 'Ar-38', abundance: 0.0629, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 39, name: 'Ar-39', abundance: 0, halfLife: '268 y', decayModes: ['β⁻'], spin: '7/2-' },
      { a: 40, name: 'Ar-40', abundance: 99.6035, halfLife: 'stable', decayModes: [], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 19 — Potassium
  // ═══════════════════════════════════════════════════════════
  19: {
    z: 19,
    symbol: 'K',
    nucleons: 39,
    radius: 3.44,
    bindingPerNucleon: 8.56,
    spin: '3/2+',
    magneticMoment: 0.391,
    quadrupole: 0.059,
    stable: true,
    isotopes: [
      { a: 39, name: 'K-39', abundance: 93.258, halfLife: 'stable', decayModes: [], spin: '3/2+' },
      { a: 40, name: 'K-40', abundance: 0.012, halfLife: '1.25 Gy', decayModes: ['β⁻','β⁺','EC'], spin: '4-' },
      { a: 41, name: 'K-41', abundance: 6.730, halfLife: 'stable', decayModes: [], spin: '3/2+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 20 — Calcium
  // ═══════════════════════════════════════════════════════════
  20: {
    z: 20,
    symbol: 'Ca',
    nucleons: 40,
    radius: 3.48,
    bindingPerNucleon: 8.55,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 40, name: 'Ca-40', abundance: 96.941, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 42, name: 'Ca-42', abundance: 0.647, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 43, name: 'Ca-43', abundance: 0.135, halfLife: 'stable', decayModes: [], spin: '7/2-' },
      { a: 44, name: 'Ca-44', abundance: 2.086, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 48, name: 'Ca-48', abundance: 0.187, halfLife: '64 Ey', decayModes: ['2β⁻'], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 21 — Scandium
  // ═══════════════════════════════════════════════════════════
  21: {
    z: 21,
    symbol: 'Sc',
    nucleons: 45,
    radius: 3.55,
    bindingPerNucleon: 8.62,
    spin: '7/2-',
    magneticMoment: 4.757,
    quadrupole: -0.220,
    stable: true,
    isotopes: [
      { a: 44, name: 'Sc-44', abundance: 0, halfLife: '3.97 h', decayModes: ['β⁺'], spin: '2+' },
      { a: 45, name: 'Sc-45', abundance: 100, halfLife: 'stable', decayModes: [], spin: '7/2-' },
      { a: 46, name: 'Sc-46', abundance: 0, halfLife: '83.79 d', decayModes: ['β⁻'], spin: '4+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 22 — Titanium
  // ═══════════════════════════════════════════════════════════
  22: {
    z: 22,
    symbol: 'Ti',
    nucleons: 48,
    radius: 3.59,
    bindingPerNucleon: 8.72,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 46, name: 'Ti-46', abundance: 8.25, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 47, name: 'Ti-47', abundance: 7.44, halfLife: 'stable', decayModes: [], spin: '5/2-' },
      { a: 48, name: 'Ti-48', abundance: 73.72, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 49, name: 'Ti-49', abundance: 5.41, halfLife: 'stable', decayModes: [], spin: '7/2-' },
      { a: 50, name: 'Ti-50', abundance: 5.18, halfLife: 'stable', decayModes: [], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 23 — Vanadium
  // ═══════════════════════════════════════════════════════════
  23: {
    z: 23,
    symbol: 'V',
    nucleons: 51,
    radius: 3.60,
    bindingPerNucleon: 8.74,
    spin: '7/2-',
    magneticMoment: 5.149,
    quadrupole: -0.043,
    stable: true,
    isotopes: [
      { a: 50, name: 'V-50', abundance: 0.250, halfLife: '1.5e17 y', decayModes: ['β⁺'], spin: '6+' },
      { a: 51, name: 'V-51', abundance: 99.750, halfLife: 'stable', decayModes: [], spin: '7/2-' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 24 — Chromium
  // ═══════════════════════════════════════════════════════════
  24: {
    z: 24,
    symbol: 'Cr',
    nucleons: 52,
    radius: 3.64,
    bindingPerNucleon: 8.76,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 50, name: 'Cr-50', abundance: 4.345, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 52, name: 'Cr-52', abundance: 83.789, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 53, name: 'Cr-53', abundance: 9.501, halfLife: 'stable', decayModes: [], spin: '3/2-' },
      { a: 54, name: 'Cr-54', abundance: 2.365, halfLife: 'stable', decayModes: [], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 25 — Manganese
  // ═══════════════════════════════════════════════════════════
  25: {
    z: 25,
    symbol: 'Mn',
    nucleons: 55,
    radius: 3.68,
    bindingPerNucleon: 8.77,
    spin: '5/2-',
    magneticMoment: 3.468,
    quadrupole: 0.330,
    stable: true,
    isotopes: [
      { a: 53, name: 'Mn-53', abundance: 0, halfLife: '3.74 My', decayModes: ['EC'], spin: '7/2-' },
      { a: 55, name: 'Mn-55', abundance: 100, halfLife: 'stable', decayModes: [], spin: '5/2-' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 26 — Iron
  // ═══════════════════════════════════════════════════════════
  26: {
    z: 26,
    symbol: 'Fe',
    nucleons: 56,
    radius: 3.74,
    bindingPerNucleon: 8.79,   // near the peak!
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 54, name: 'Fe-54', abundance: 5.845, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 56, name: 'Fe-56', abundance: 91.754, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 57, name: 'Fe-57', abundance: 2.119, halfLife: 'stable', decayModes: [], spin: '1/2-' },
      { a: 58, name: 'Fe-58', abundance: 0.282, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 60, name: 'Fe-60', abundance: 0, halfLife: '2.6 My', decayModes: ['β⁻'], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 27 — Cobalt
  // ═══════════════════════════════════════════════════════════
  27: {
    z: 27,
    symbol: 'Co',
    nucleons: 59,
    radius: 3.77,
    bindingPerNucleon: 8.77,
    spin: '7/2-',
    magneticMoment: 4.627,
    quadrupole: 0.420,
    stable: true,
    isotopes: [
      { a: 57, name: 'Co-57', abundance: 0, halfLife: '271.74 d', decayModes: ['EC'], spin: '7/2-' },
      { a: 59, name: 'Co-59', abundance: 100, halfLife: 'stable', decayModes: [], spin: '7/2-' },
      { a: 60, name: 'Co-60', abundance: 0, halfLife: '5.271 y', decayModes: ['β⁻'], spin: '5+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 28 — Nickel
  // ═══════════════════════════════════════════════════════════
  28: {
    z: 28,
    symbol: 'Ni',
    nucleons: 58,
    radius: 3.77,
    bindingPerNucleon: 8.76,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 58, name: 'Ni-58', abundance: 68.077, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 60, name: 'Ni-60', abundance: 26.223, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 61, name: 'Ni-61', abundance: 1.140, halfLife: 'stable', decayModes: [], spin: '3/2-' },
      { a: 62, name: 'Ni-62', abundance: 3.635, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 63, name: 'Ni-63', abundance: 0, halfLife: '100.1 y', decayModes: ['β⁻'], spin: '1/2-' },
      { a: 64, name: 'Ni-64', abundance: 0.926, halfLife: 'stable', decayModes: [], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 29 — Copper
  // ═══════════════════════════════════════════════════════════
  29: {
    z: 29,
    symbol: 'Cu',
    nucleons: 63,
    radius: 3.88,
    bindingPerNucleon: 8.75,
    spin: '3/2-',
    magneticMoment: 2.227,
    quadrupole: -0.211,
    stable: true,
    isotopes: [
      { a: 63, name: 'Cu-63', abundance: 69.17, halfLife: 'stable', decayModes: [], spin: '3/2-' },
      { a: 64, name: 'Cu-64', abundance: 0, halfLife: '12.70 h', decayModes: ['β⁺','β⁻'], spin: '1+' },
      { a: 65, name: 'Cu-65', abundance: 30.83, halfLife: 'stable', decayModes: [], spin: '3/2-' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 30 — Zinc
  // ═══════════════════════════════════════════════════════════
  30: {
    z: 30,
    symbol: 'Zn',
    nucleons: 64,
    radius: 3.93,
    bindingPerNucleon: 8.74,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 64, name: 'Zn-64', abundance: 49.17, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 66, name: 'Zn-66', abundance: 27.73, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 67, name: 'Zn-67', abundance: 4.04, halfLife: 'stable', decayModes: [], spin: '5/2-' },
      { a: 68, name: 'Zn-68', abundance: 18.45, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 70, name: 'Zn-70', abundance: 0.61, halfLife: 'stable', decayModes: [], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 31 — Gallium
  // ═══════════════════════════════════════════════════════════
  31: {
    z: 31,
    symbol: 'Ga',
    nucleons: 69,
    radius: 3.99,
    bindingPerNucleon: 8.72,
    spin: '3/2-',
    magneticMoment: 2.016,
    quadrupole: 0.171,
    stable: true,
    isotopes: [
      { a: 69, name: 'Ga-69', abundance: 60.108, halfLife: 'stable', decayModes: [], spin: '3/2-' },
      { a: 71, name: 'Ga-71', abundance: 39.892, halfLife: 'stable', decayModes: [], spin: '3/2-' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 32 — Germanium
  // ═══════════════════════════════════════════════════════════
  32: {
    z: 32,
    symbol: 'Ge',
    nucleons: 74,
    radius: 4.07,
    bindingPerNucleon: 8.71,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 70, name: 'Ge-70', abundance: 20.57, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 72, name: 'Ge-72', abundance: 27.45, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 73, name: 'Ge-73', abundance: 7.75, halfLife: 'stable', decayModes: [], spin: '9/2+' },
      { a: 74, name: 'Ge-74', abundance: 36.50, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 76, name: 'Ge-76', abundance: 7.73, halfLife: '1.8e21 y', decayModes: ['2β⁻'], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 33 — Arsenic
  // ═══════════════════════════════════════════════════════════
  33: {
    z: 33,
    symbol: 'As',
    nucleons: 75,
    radius: 4.10,
    bindingPerNucleon: 8.70,
    spin: '3/2-',
    magneticMoment: 1.440,
    quadrupole: 0.314,
    stable: true,
    isotopes: [
      { a: 73, name: 'As-73', abundance: 0, halfLife: '80.30 d', decayModes: ['EC'], spin: '3/2-' },
      { a: 75, name: 'As-75', abundance: 100, halfLife: 'stable', decayModes: [], spin: '3/2-' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 34 — Selenium
  // ═══════════════════════════════════════════════════════════
  34: {
    z: 34,
    symbol: 'Se',
    nucleons: 80,
    radius: 4.14,
    bindingPerNucleon: 8.71,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 74, name: 'Se-74', abundance: 0.86, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 76, name: 'Se-76', abundance: 9.23, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 77, name: 'Se-77', abundance: 7.60, halfLife: 'stable', decayModes: [], spin: '1/2-' },
      { a: 78, name: 'Se-78', abundance: 23.69, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 79, name: 'Se-79', abundance: 0, halfLife: '327 ky', decayModes: ['β⁻'], spin: '7/2+' },
      { a: 80, name: 'Se-80', abundance: 49.80, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 82, name: 'Se-82', abundance: 8.82, halfLife: '1.0e20 y', decayModes: ['2β⁻'], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 35 — Bromine
  // ═══════════════════════════════════════════════════════════
  35: {
    z: 35,
    symbol: 'Br',
    nucleons: 79,
    radius: 4.16,
    bindingPerNucleon: 8.70,
    spin: '3/2-',
    magneticMoment: 2.106,
    quadrupole: 0.313,
    stable: true,
    isotopes: [
      { a: 79, name: 'Br-79', abundance: 50.69, halfLife: 'stable', decayModes: [], spin: '3/2-' },
      { a: 81, name: 'Br-81', abundance: 49.31, halfLife: 'stable', decayModes: [], spin: '3/2-' },
    ],
    decayChain: null,
  },

  // ═══════════════════════════════════════════════════════════
  // Z = 36 — Krypton
  // ═══════════════════════════════════════════════════════════
  36: {
    z: 36,
    symbol: 'Kr',
    nucleons: 84,
    radius: 4.19,
    bindingPerNucleon: 8.72,
    spin: '0+',
    magneticMoment: 0,
    quadrupole: 0,
    stable: true,
    isotopes: [
      { a: 78, name: 'Kr-78', abundance: 0.355, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 80, name: 'Kr-80', abundance: 2.286, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 82, name: 'Kr-82', abundance: 11.593, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 83, name: 'Kr-83', abundance: 11.500, halfLife: 'stable', decayModes: [], spin: '9/2+' },
      { a: 84, name: 'Kr-84', abundance: 56.987, halfLife: 'stable', decayModes: [], spin: '0+' },
      { a: 85, name: 'Kr-85', abundance: 0, halfLife: '10.76 y', decayModes: ['β⁻'], spin: '9/2+' },
      { a: 86, name: 'Kr-86', abundance: 17.279, halfLife: 'stable', decayModes: [], spin: '0+' },
    ],
    decayChain: null,
  },

  // ═══════ Z = 37–54 (Rb through Xe) ═══════

  37: { z:37, symbol:'Rb', nucleons:85, radius:4.20, bindingPerNucleon:8.70, spin:'5/2-', magneticMoment:1.353, quadrupole:0.276, stable:true,
    isotopes: [
      { a:85, name:'Rb-85', abundance:72.17, halfLife:'stable', decayModes:[], spin:'5/2-' },
      { a:87, name:'Rb-87', abundance:27.83, halfLife:'49.2 Gy', decayModes:['β⁻'], spin:'3/2-' },
    ], decayChain:null },

  38: { z:38, symbol:'Sr', nucleons:88, radius:4.22, bindingPerNucleon:8.73, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:84, name:'Sr-84', abundance:0.56, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:86, name:'Sr-86', abundance:9.86, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:87, name:'Sr-87', abundance:7.00, halfLife:'stable', decayModes:[], spin:'9/2+' },
      { a:88, name:'Sr-88', abundance:82.58, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:90, name:'Sr-90', abundance:0, halfLife:'28.80 y', decayModes:['β⁻'], spin:'0+' },
    ], decayChain:null },

  39: { z:39, symbol:'Y', nucleons:89, radius:4.24, bindingPerNucleon:8.71, spin:'1/2-', magneticMoment:-0.137, quadrupole:0, stable:true,
    isotopes: [
      { a:89, name:'Y-89', abundance:100, halfLife:'stable', decayModes:[], spin:'1/2-' },
      { a:90, name:'Y-90', abundance:0, halfLife:'64.05 h', decayModes:['β⁻'], spin:'2-' },
    ], decayChain:null },

  40: { z:40, symbol:'Zr', nucleons:90, radius:4.27, bindingPerNucleon:8.71, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:90, name:'Zr-90', abundance:51.45, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:91, name:'Zr-91', abundance:11.22, halfLife:'stable', decayModes:[], spin:'5/2+' },
      { a:92, name:'Zr-92', abundance:17.15, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:94, name:'Zr-94', abundance:17.38, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:96, name:'Zr-96', abundance:2.80, halfLife:'2.0e19 y', decayModes:['2β⁻'], spin:'0+' },
    ], decayChain:null },

  41: { z:41, symbol:'Nb', nucleons:93, radius:4.32, bindingPerNucleon:8.66, spin:'9/2+', magneticMoment:6.171, quadrupole:-0.320, stable:true,
    isotopes: [
      { a:93, name:'Nb-93', abundance:100, halfLife:'stable', decayModes:[], spin:'9/2+' },
      { a:94, name:'Nb-94', abundance:0, halfLife:'20.3 ky', decayModes:['β⁻'], spin:'6+' },
    ], decayChain:null },

  42: { z:42, symbol:'Mo', nucleons:98, radius:4.32, bindingPerNucleon:8.66, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:92, name:'Mo-92', abundance:14.53, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:94, name:'Mo-94', abundance:9.15, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:95, name:'Mo-95', abundance:15.84, halfLife:'stable', decayModes:[], spin:'5/2+' },
      { a:96, name:'Mo-96', abundance:16.67, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:97, name:'Mo-97', abundance:9.60, halfLife:'stable', decayModes:[], spin:'5/2+' },
      { a:98, name:'Mo-98', abundance:24.39, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:99, name:'Mo-99', abundance:0, halfLife:'65.94 h', decayModes:['β⁻'], spin:'1/2+' },
      { a:100, name:'Mo-100', abundance:9.82, halfLife:'8.5e18 y', decayModes:['2β⁻'], spin:'0+' },
    ], decayChain:null },

  43: { z:43, symbol:'Tc', nucleons:97, radius:4.35, bindingPerNucleon:8.64, spin:'9/2+', magneticMoment:5.685, quadrupole:-0.129, stable:false,
    isotopes: [
      { a:97, name:'Tc-97', abundance:0, halfLife:'4.21 My', decayModes:['EC'], spin:'9/2+' },
      { a:98, name:'Tc-98', abundance:0, halfLife:'4.2 My', decayModes:['β⁻'], spin:'6+' },
      { a:99, name:'Tc-99', abundance:0, halfLife:'211.1 ky', decayModes:['β⁻'], spin:'9/2+' },
    ], decayChain:null },

  44: { z:44, symbol:'Ru', nucleons:102, radius:4.39, bindingPerNucleon:8.61, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:96, name:'Ru-96', abundance:5.54, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:98, name:'Ru-98', abundance:1.87, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:99, name:'Ru-99', abundance:12.76, halfLife:'stable', decayModes:[], spin:'5/2+' },
      { a:100, name:'Ru-100', abundance:12.60, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:101, name:'Ru-101', abundance:17.06, halfLife:'stable', decayModes:[], spin:'5/2+' },
      { a:102, name:'Ru-102', abundance:31.55, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:104, name:'Ru-104', abundance:18.62, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  45: { z:45, symbol:'Rh', nucleons:103, radius:4.40, bindingPerNucleon:8.58, spin:'1/2-', magneticMoment:-0.088, quadrupole:0, stable:true,
    isotopes: [
      { a:103, name:'Rh-103', abundance:100, halfLife:'stable', decayModes:[], spin:'1/2-' },
    ], decayChain:null },

  46: { z:46, symbol:'Pd', nucleons:106, radius:4.44, bindingPerNucleon:8.56, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:102, name:'Pd-102', abundance:1.02, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:104, name:'Pd-104', abundance:11.14, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:105, name:'Pd-105', abundance:22.33, halfLife:'stable', decayModes:[], spin:'5/2+' },
      { a:106, name:'Pd-106', abundance:27.33, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:108, name:'Pd-108', abundance:26.46, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:110, name:'Pd-110', abundance:11.72, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  47: { z:47, symbol:'Ag', nucleons:107, radius:4.47, bindingPerNucleon:8.55, spin:'1/2-', magneticMoment:-0.114, quadrupole:0, stable:true,
    isotopes: [
      { a:107, name:'Ag-107', abundance:51.839, halfLife:'stable', decayModes:[], spin:'1/2-' },
      { a:109, name:'Ag-109', abundance:48.161, halfLife:'stable', decayModes:[], spin:'1/2-' },
      { a:110, name:'Ag-110m', abundance:0, halfLife:'249.95 d', decayModes:['β⁻','IT'], spin:'6+' },
    ], decayChain:null },

  48: { z:48, symbol:'Cd', nucleons:114, radius:4.50, bindingPerNucleon:8.54, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:106, name:'Cd-106', abundance:1.25, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:108, name:'Cd-108', abundance:0.89, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:110, name:'Cd-110', abundance:12.49, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:111, name:'Cd-111', abundance:12.80, halfLife:'stable', decayModes:[], spin:'1/2+' },
      { a:112, name:'Cd-112', abundance:24.13, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:113, name:'Cd-113', abundance:12.22, halfLife:'8.04e15 y', decayModes:['β⁻'], spin:'1/2+' },
      { a:114, name:'Cd-114', abundance:28.73, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:116, name:'Cd-116', abundance:7.49, halfLife:'2.8e19 y', decayModes:['2β⁻'], spin:'0+' },
    ], decayChain:null },

  49: { z:49, symbol:'In', nucleons:115, radius:4.54, bindingPerNucleon:8.52, spin:'9/2+', magneticMoment:5.534, quadrupole:0.770, stable:true,
    isotopes: [
      { a:113, name:'In-113', abundance:4.29, halfLife:'stable', decayModes:[], spin:'9/2+' },
      { a:115, name:'In-115', abundance:95.71, halfLife:'4.4e14 y', decayModes:['β⁻'], spin:'9/2+' },
    ], decayChain:null },

  50: { z:50, symbol:'Sn', nucleons:120, radius:4.56, bindingPerNucleon:8.51, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:112, name:'Sn-112', abundance:0.97, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:114, name:'Sn-114', abundance:0.66, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:115, name:'Sn-115', abundance:0.34, halfLife:'stable', decayModes:[], spin:'1/2+' },
      { a:116, name:'Sn-116', abundance:14.54, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:117, name:'Sn-117', abundance:7.68, halfLife:'stable', decayModes:[], spin:'1/2+' },
      { a:118, name:'Sn-118', abundance:24.22, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:119, name:'Sn-119', abundance:8.59, halfLife:'stable', decayModes:[], spin:'1/2+' },
      { a:120, name:'Sn-120', abundance:32.58, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:122, name:'Sn-122', abundance:4.63, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:124, name:'Sn-124', abundance:5.79, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  51: { z:51, symbol:'Sb', nucleons:121, radius:4.59, bindingPerNucleon:8.49, spin:'5/2+', magneticMoment:3.363, quadrupole:-0.543, stable:true,
    isotopes: [
      { a:121, name:'Sb-121', abundance:57.21, halfLife:'stable', decayModes:[], spin:'5/2+' },
      { a:123, name:'Sb-123', abundance:42.79, halfLife:'stable', decayModes:[], spin:'7/2+' },
      { a:125, name:'Sb-125', abundance:0, halfLife:'2.76 y', decayModes:['β⁻'], spin:'7/2+' },
    ], decayChain:null },

  52: { z:52, symbol:'Te', nucleons:130, radius:4.61, bindingPerNucleon:8.47, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:120, name:'Te-120', abundance:0.09, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:122, name:'Te-122', abundance:2.55, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:123, name:'Te-123', abundance:0.89, halfLife:'stable', decayModes:[], spin:'1/2+' },
      { a:124, name:'Te-124', abundance:4.74, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:125, name:'Te-125', abundance:7.07, halfLife:'stable', decayModes:[], spin:'1/2+' },
      { a:126, name:'Te-126', abundance:18.84, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:128, name:'Te-128', abundance:31.74, halfLife:'2.2e24 y', decayModes:['2β⁻'], spin:'0+' },
      { a:130, name:'Te-130', abundance:34.08, halfLife:'7.9e20 y', decayModes:['2β⁻'], spin:'0+' },
    ], decayChain:null },

  53: { z:53, symbol:'I', nucleons:127, radius:4.65, bindingPerNucleon:8.45, spin:'5/2+', magneticMoment:2.813, quadrupole:-0.696, stable:true,
    isotopes: [
      { a:127, name:'I-127', abundance:100, halfLife:'stable', decayModes:[], spin:'5/2+' },
      { a:129, name:'I-129', abundance:0, halfLife:'15.7 My', decayModes:['β⁻'], spin:'7/2+' },
      { a:131, name:'I-131', abundance:0, halfLife:'8.023 d', decayModes:['β⁻'], spin:'7/2+' },
    ], decayChain:null },

  54: { z:54, symbol:'Xe', nucleons:132, radius:4.68, bindingPerNucleon:8.43, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:124, name:'Xe-124', abundance:0.095, halfLife:'1.8e22 y', decayModes:['2EC'], spin:'0+' },
      { a:126, name:'Xe-126', abundance:0.089, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:128, name:'Xe-128', abundance:1.910, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:129, name:'Xe-129', abundance:26.401, halfLife:'stable', decayModes:[], spin:'1/2+' },
      { a:130, name:'Xe-130', abundance:4.071, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:131, name:'Xe-131', abundance:21.232, halfLife:'stable', decayModes:[], spin:'3/2+' },
      { a:132, name:'Xe-132', abundance:26.909, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:134, name:'Xe-134', abundance:10.436, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:136, name:'Xe-136', abundance:8.857, halfLife:'2.2e21 y', decayModes:['2β⁻'], spin:'0+' },
    ], decayChain:null },

  // ═══════ Z = 55–86 (Cs through Rn) ═══════

  55: { z:55, symbol:'Cs', nucleons:133, radius:4.80, bindingPerNucleon:8.41, spin:'7/2+', magneticMoment:2.582, quadrupole:-0.003, stable:true,
    isotopes: [
      { a:133, name:'Cs-133', abundance:100, halfLife:'stable', decayModes:[], spin:'7/2+' },
      { a:134, name:'Cs-134', abundance:0, halfLife:'2.065 y', decayModes:['β⁻','EC'], spin:'4+' },
      { a:135, name:'Cs-135', abundance:0, halfLife:'2.3 My', decayModes:['β⁻'], spin:'7/2+' },
      { a:137, name:'Cs-137', abundance:0, halfLife:'30.17 y', decayModes:['β⁻'], spin:'7/2+' },
    ], decayChain:null },

  56: { z:56, symbol:'Ba', nucleons:138, radius:4.84, bindingPerNucleon:8.39, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:130, name:'Ba-130', abundance:0.106, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:132, name:'Ba-132', abundance:0.101, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:134, name:'Ba-134', abundance:2.417, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:135, name:'Ba-135', abundance:6.592, halfLife:'stable', decayModes:[], spin:'3/2+' },
      { a:136, name:'Ba-136', abundance:7.854, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:137, name:'Ba-137', abundance:11.232, halfLife:'stable', decayModes:[], spin:'3/2+' },
      { a:138, name:'Ba-138', abundance:71.698, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  57: { z:57, symbol:'La', nucleons:139, radius:4.86, bindingPerNucleon:8.38, spin:'7/2+', magneticMoment:2.783, quadrupole:0.200, stable:true,
    isotopes: [
      { a:138, name:'La-138', abundance:0.089, halfLife:'1.02e11 y', decayModes:['β⁻','EC'], spin:'5+' },
      { a:139, name:'La-139', abundance:99.911, halfLife:'stable', decayModes:[], spin:'7/2+' },
    ], decayChain:null },

  58: { z:58, symbol:'Ce', nucleons:140, radius:4.88, bindingPerNucleon:8.38, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:136, name:'Ce-136', abundance:0.185, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:138, name:'Ce-138', abundance:0.251, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:140, name:'Ce-140', abundance:88.450, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:142, name:'Ce-142', abundance:11.114, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  59: { z:59, symbol:'Pr', nucleons:141, radius:4.89, bindingPerNucleon:8.35, spin:'5/2+', magneticMoment:4.275, quadrupole:-0.077, stable:true,
    isotopes: [
      { a:141, name:'Pr-141', abundance:100, halfLife:'stable', decayModes:[], spin:'5/2+' },
    ], decayChain:null },

  60: { z:60, symbol:'Nd', nucleons:142, radius:4.91, bindingPerNucleon:8.33, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:142, name:'Nd-142', abundance:27.152, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:143, name:'Nd-143', abundance:12.174, halfLife:'stable', decayModes:[], spin:'7/2-' },
      { a:144, name:'Nd-144', abundance:23.798, halfLife:'2.3e15 y', decayModes:['α'], spin:'0+' },
      { a:145, name:'Nd-145', abundance:8.293, halfLife:'stable', decayModes:[], spin:'7/2-' },
      { a:146, name:'Nd-146', abundance:17.189, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:148, name:'Nd-148', abundance:5.756, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:150, name:'Nd-150', abundance:5.638, halfLife:'6.7e18 y', decayModes:['2β⁻'], spin:'0+' },
    ], decayChain:null },

  61: { z:61, symbol:'Pm', nucleons:145, radius:4.93, bindingPerNucleon:8.31, spin:'5/2+', magneticMoment:3.80, quadrupole:0, stable:false,
    isotopes: [
      { a:145, name:'Pm-145', abundance:0, halfLife:'17.7 y', decayModes:['EC'], spin:'5/2+' },
      { a:147, name:'Pm-147', abundance:0, halfLife:'2.623 y', decayModes:['β⁻'], spin:'7/2+' },
    ], decayChain:null },

  62: { z:62, symbol:'Sm', nucleons:152, radius:4.95, bindingPerNucleon:8.30, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:144, name:'Sm-144', abundance:3.07, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:147, name:'Sm-147', abundance:14.99, halfLife:'1.06e11 y', decayModes:['α'], spin:'7/2-' },
      { a:148, name:'Sm-148', abundance:11.24, halfLife:'7e15 y', decayModes:['α'], spin:'0+' },
      { a:149, name:'Sm-149', abundance:13.82, halfLife:'stable', decayModes:[], spin:'7/2-' },
      { a:150, name:'Sm-150', abundance:7.38, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:152, name:'Sm-152', abundance:26.75, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:154, name:'Sm-154', abundance:22.75, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  63: { z:63, symbol:'Eu', nucleons:153, radius:4.97, bindingPerNucleon:8.28, spin:'5/2+', magneticMoment:3.472, quadrupole:0.903, stable:true,
    isotopes: [
      { a:151, name:'Eu-151', abundance:47.81, halfLife:'stable', decayModes:[], spin:'5/2+' },
      { a:152, name:'Eu-152', abundance:0, halfLife:'13.54 y', decayModes:['EC','β⁻'], spin:'3-' },
      { a:153, name:'Eu-153', abundance:52.19, halfLife:'stable', decayModes:[], spin:'5/2+' },
    ], decayChain:null },

  64: { z:64, symbol:'Gd', nucleons:158, radius:4.99, bindingPerNucleon:8.26, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:152, name:'Gd-152', abundance:0.20, halfLife:'1.08e14 y', decayModes:['α'], spin:'0+' },
      { a:154, name:'Gd-154', abundance:2.18, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:155, name:'Gd-155', abundance:14.80, halfLife:'stable', decayModes:[], spin:'3/2-' },
      { a:156, name:'Gd-156', abundance:20.47, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:157, name:'Gd-157', abundance:15.65, halfLife:'stable', decayModes:[], spin:'3/2-' },
      { a:158, name:'Gd-158', abundance:24.84, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:160, name:'Gd-160', abundance:21.86, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  65: { z:65, symbol:'Tb', nucleons:159, radius:5.01, bindingPerNucleon:8.25, spin:'3/2+', magneticMoment:2.014, quadrupole:1.432, stable:true,
    isotopes: [
      { a:159, name:'Tb-159', abundance:100, halfLife:'stable', decayModes:[], spin:'3/2+' },
    ], decayChain:null },

  66: { z:66, symbol:'Dy', nucleons:164, radius:5.03, bindingPerNucleon:8.23, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:156, name:'Dy-156', abundance:0.056, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:158, name:'Dy-158', abundance:0.095, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:160, name:'Dy-160', abundance:2.329, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:161, name:'Dy-161', abundance:18.889, halfLife:'stable', decayModes:[], spin:'5/2+' },
      { a:162, name:'Dy-162', abundance:25.475, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:163, name:'Dy-163', abundance:24.896, halfLife:'stable', decayModes:[], spin:'5/2-' },
      { a:164, name:'Dy-164', abundance:28.260, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  67: { z:67, symbol:'Ho', nucleons:165, radius:5.05, bindingPerNucleon:8.22, spin:'7/2-', magneticMoment:4.173, quadrupole:3.580, stable:true,
    isotopes: [
      { a:165, name:'Ho-165', abundance:100, halfLife:'stable', decayModes:[], spin:'7/2-' },
    ], decayChain:null },

  68: { z:68, symbol:'Er', nucleons:166, radius:5.07, bindingPerNucleon:8.20, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:162, name:'Er-162', abundance:0.139, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:164, name:'Er-164', abundance:1.601, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:166, name:'Er-166', abundance:33.503, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:167, name:'Er-167', abundance:22.869, halfLife:'stable', decayModes:[], spin:'7/2+' },
      { a:168, name:'Er-168', abundance:26.978, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:170, name:'Er-170', abundance:14.910, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  69: { z:69, symbol:'Tm', nucleons:169, radius:5.08, bindingPerNucleon:8.19, spin:'1/2+', magneticMoment:-0.232, quadrupole:0, stable:true,
    isotopes: [
      { a:169, name:'Tm-169', abundance:100, halfLife:'stable', decayModes:[], spin:'1/2+' },
      { a:170, name:'Tm-170', abundance:0, halfLife:'128.6 d', decayModes:['β⁻','EC'], spin:'1-' },
    ], decayChain:null },

  70: { z:70, symbol:'Yb', nucleons:174, radius:5.10, bindingPerNucleon:8.18, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:168, name:'Yb-168', abundance:0.123, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:170, name:'Yb-170', abundance:2.982, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:171, name:'Yb-171', abundance:14.09, halfLife:'stable', decayModes:[], spin:'1/2-' },
      { a:172, name:'Yb-172', abundance:21.68, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:173, name:'Yb-173', abundance:16.103, halfLife:'stable', decayModes:[], spin:'5/2-' },
      { a:174, name:'Yb-174', abundance:32.026, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:176, name:'Yb-176', abundance:12.996, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  71: { z:71, symbol:'Lu', nucleons:175, radius:5.12, bindingPerNucleon:8.17, spin:'7/2+', magneticMoment:2.233, quadrupole:3.490, stable:true,
    isotopes: [
      { a:175, name:'Lu-175', abundance:97.401, halfLife:'stable', decayModes:[], spin:'7/2+' },
      { a:176, name:'Lu-176', abundance:2.599, halfLife:'37.6 Gy', decayModes:['β⁻'], spin:'7-' },
    ], decayChain:null },

  72: { z:72, symbol:'Hf', nucleons:180, radius:5.14, bindingPerNucleon:8.15, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:174, name:'Hf-174', abundance:0.16, halfLife:'2.0e15 y', decayModes:['α'], spin:'0+' },
      { a:176, name:'Hf-176', abundance:5.26, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:177, name:'Hf-177', abundance:18.60, halfLife:'stable', decayModes:[], spin:'7/2-' },
      { a:178, name:'Hf-178', abundance:27.28, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:179, name:'Hf-179', abundance:13.62, halfLife:'stable', decayModes:[], spin:'9/2+' },
      { a:180, name:'Hf-180', abundance:35.08, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  73: { z:73, symbol:'Ta', nucleons:181, radius:5.15, bindingPerNucleon:8.13, spin:'7/2+', magneticMoment:2.371, quadrupole:3.170, stable:true,
    isotopes: [
      { a:180, name:'Ta-180m', abundance:0.012, halfLife:'>1.2e15 y', decayModes:[], spin:'9-' },
      { a:181, name:'Ta-181', abundance:99.988, halfLife:'stable', decayModes:[], spin:'7/2+' },
    ], decayChain:null },

  74: { z:74, symbol:'W', nucleons:184, radius:5.17, bindingPerNucleon:8.12, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:180, name:'W-180', abundance:0.12, halfLife:'1.8e18 y', decayModes:['α'], spin:'0+' },
      { a:182, name:'W-182', abundance:26.50, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:183, name:'W-183', abundance:14.31, halfLife:'stable', decayModes:[], spin:'1/2-' },
      { a:184, name:'W-184', abundance:30.64, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:186, name:'W-186', abundance:28.43, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  75: { z:75, symbol:'Re', nucleons:187, radius:5.18, bindingPerNucleon:8.10, spin:'5/2+', magneticMoment:3.220, quadrupole:2.070, stable:true,
    isotopes: [
      { a:185, name:'Re-185', abundance:37.40, halfLife:'stable', decayModes:[], spin:'5/2+' },
      { a:187, name:'Re-187', abundance:62.60, halfLife:'4.12e10 y', decayModes:['β⁻'], spin:'5/2+' },
    ], decayChain:null },

  76: { z:76, symbol:'Os', nucleons:192, radius:5.20, bindingPerNucleon:8.08, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:184, name:'Os-184', abundance:0.02, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:186, name:'Os-186', abundance:1.59, halfLife:'2.0e15 y', decayModes:['α'], spin:'0+' },
      { a:187, name:'Os-187', abundance:1.96, halfLife:'stable', decayModes:[], spin:'1/2-' },
      { a:188, name:'Os-188', abundance:13.24, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:189, name:'Os-189', abundance:16.15, halfLife:'stable', decayModes:[], spin:'3/2-' },
      { a:190, name:'Os-190', abundance:26.26, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:192, name:'Os-192', abundance:40.78, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  77: { z:77, symbol:'Ir', nucleons:193, radius:5.21, bindingPerNucleon:8.07, spin:'3/2+', magneticMoment:0.151, quadrupole:0.816, stable:true,
    isotopes: [
      { a:191, name:'Ir-191', abundance:37.3, halfLife:'stable', decayModes:[], spin:'3/2+' },
      { a:192, name:'Ir-192', abundance:0, halfLife:'73.83 d', decayModes:['β⁻','EC'], spin:'4+' },
      { a:193, name:'Ir-193', abundance:62.7, halfLife:'stable', decayModes:[], spin:'3/2+' },
    ], decayChain:null },

  78: { z:78, symbol:'Pt', nucleons:195, radius:5.22, bindingPerNucleon:8.06, spin:'1/2-', magneticMoment:0.607, quadrupole:0, stable:true,
    isotopes: [
      { a:190, name:'Pt-190', abundance:0.012, halfLife:'6.5e11 y', decayModes:['α'], spin:'0+' },
      { a:192, name:'Pt-192', abundance:0.782, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:194, name:'Pt-194', abundance:32.86, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:195, name:'Pt-195', abundance:33.78, halfLife:'stable', decayModes:[], spin:'1/2-' },
      { a:196, name:'Pt-196', abundance:25.21, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:198, name:'Pt-198', abundance:7.36, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  79: { z:79, symbol:'Au', nucleons:197, radius:5.34, bindingPerNucleon:8.04, spin:'3/2+', magneticMoment:0.146, quadrupole:0.547, stable:true,
    isotopes: [
      { a:197, name:'Au-197', abundance:100, halfLife:'stable', decayModes:[], spin:'3/2+' },
      { a:198, name:'Au-198', abundance:0, halfLife:'2.695 d', decayModes:['β⁻'], spin:'2-' },
    ], decayChain:null },

  80: { z:80, symbol:'Hg', nucleons:202, radius:5.36, bindingPerNucleon:8.03, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:196, name:'Hg-196', abundance:0.15, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:198, name:'Hg-198', abundance:9.97, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:199, name:'Hg-199', abundance:16.87, halfLife:'stable', decayModes:[], spin:'1/2-' },
      { a:200, name:'Hg-200', abundance:23.10, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:201, name:'Hg-201', abundance:13.18, halfLife:'stable', decayModes:[], spin:'3/2-' },
      { a:202, name:'Hg-202', abundance:29.86, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:204, name:'Hg-204', abundance:6.87, halfLife:'stable', decayModes:[], spin:'0+' },
    ], decayChain:null },

  81: { z:81, symbol:'Tl', nucleons:205, radius:5.38, bindingPerNucleon:8.00, spin:'1/2+', magneticMoment:1.638, quadrupole:0, stable:true,
    isotopes: [
      { a:203, name:'Tl-203', abundance:29.52, halfLife:'stable', decayModes:[], spin:'1/2+' },
      { a:205, name:'Tl-205', abundance:70.48, halfLife:'stable', decayModes:[], spin:'1/2+' },
    ], decayChain:null },

  82: { z:82, symbol:'Pb', nucleons:208, radius:5.50, bindingPerNucleon:7.87, spin:'0+', magneticMoment:0, quadrupole:0, stable:true,
    isotopes: [
      { a:204, name:'Pb-204', abundance:1.4, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:206, name:'Pb-206', abundance:24.1, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:207, name:'Pb-207', abundance:22.1, halfLife:'stable', decayModes:[], spin:'1/2-' },
      { a:208, name:'Pb-208', abundance:52.4, halfLife:'stable', decayModes:[], spin:'0+' },
      { a:210, name:'Pb-210', abundance:0, halfLife:'22.20 y', decayModes:['β⁻'], spin:'0+' },
    ], decayChain:null },

  83: { z:83, symbol:'Bi', nucleons:209, radius:5.52, bindingPerNucleon:7.85, spin:'9/2-', magneticMoment:4.111, quadrupole:-0.516, stable:false,
    isotopes: [
      { a:207, name:'Bi-207', abundance:0, halfLife:'31.55 y', decayModes:['EC'], spin:'9/2-' },
      { a:208, name:'Bi-208', abundance:0, halfLife:'3.68e5 y', decayModes:['EC'], spin:'5+' },
      { a:209, name:'Bi-209', abundance:100, halfLife:'2.01e19 y', decayModes:['α'], spin:'9/2-' },
      { a:210, name:'Bi-210', abundance:0, halfLife:'5.013 d', decayModes:['β⁻'], spin:'1-' },
    ], decayChain:null },

  // ═══════ Z = 84–118: Radioactive elements with decay chains ═══════

  84: { z:84, symbol:'Po', nucleons:209, radius:5.53, bindingPerNucleon:7.83, spin:'1/2-', magneticMoment:0.683, quadrupole:0, stable:false,
    isotopes: [
      { a:208, name:'Po-208', abundance:0, halfLife:'2.898 y', decayModes:['α','EC'], spin:'0+' },
      { a:209, name:'Po-209', abundance:0, halfLife:'125.2 y', decayModes:['α','EC'], spin:'1/2-' },
      { a:210, name:'Po-210', abundance:0, halfLife:'138.376 d', decayModes:['α'], spin:'0+' },
    ],
    decayChain: [
      { a:210, z:84, sym:'Po', mode:'α' },
      { a:206, z:82, sym:'Pb', mode:'stable' },
    ] },

  85: { z:85, symbol:'At', nucleons:210, radius:5.54, bindingPerNucleon:7.81, spin:'5+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:210, name:'At-210', abundance:0, halfLife:'8.1 h', decayModes:['EC','α'], spin:'5+' },
      { a:211, name:'At-211', abundance:0, halfLife:'7.214 h', decayModes:['EC','α'], spin:'9/2-' },
    ],
    decayChain: [
      { a:211, z:85, sym:'At', mode:'α' },
      { a:207, z:83, sym:'Bi', mode:'α' },
      { a:203, z:81, sym:'Tl', mode:'stable' },
    ] },

  86: { z:86, symbol:'Rn', nucleons:222, radius:5.59, bindingPerNucleon:7.80, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:219, name:'Rn-219', abundance:0, halfLife:'3.96 s', decayModes:['α'], spin:'5/2+' },
      { a:220, name:'Rn-220', abundance:0, halfLife:'55.6 s', decayModes:['α'], spin:'0+' },
      { a:222, name:'Rn-222', abundance:0, halfLife:'3.824 d', decayModes:['α'], spin:'0+' },
    ],
    decayChain: [
      { a:222, z:86, sym:'Rn', mode:'α' },
      { a:218, z:84, sym:'Po', mode:'α' },
      { a:214, z:82, sym:'Pb', mode:'β⁻' },
      { a:214, z:83, sym:'Bi', mode:'β⁻' },
      { a:214, z:84, sym:'Po', mode:'α' },
      { a:210, z:82, sym:'Pb', mode:'β⁻' },
      { a:210, z:83, sym:'Bi', mode:'β⁻' },
      { a:210, z:84, sym:'Po', mode:'α' },
      { a:206, z:82, sym:'Pb', mode:'stable' },
    ] },

  87: { z:87, symbol:'Fr', nucleons:223, radius:5.60, bindingPerNucleon:7.78, spin:'3/2-', magneticMoment:1.17, quadrupole:1.17, stable:false,
    isotopes: [
      { a:221, name:'Fr-221', abundance:0, halfLife:'4.80 m', decayModes:['α'], spin:'5/2-' },
      { a:223, name:'Fr-223', abundance:0, halfLife:'22.00 m', decayModes:['β⁻'], spin:'3/2-' },
    ],
    decayChain: [
      { a:223, z:87, sym:'Fr', mode:'β⁻' },
      { a:223, z:88, sym:'Ra', mode:'α' },
      { a:219, z:86, sym:'Rn', mode:'α' },
      { a:215, z:84, sym:'Po', mode:'α' },
      { a:211, z:82, sym:'Pb', mode:'β⁻' },
      { a:211, z:83, sym:'Bi', mode:'α' },
      { a:207, z:81, sym:'Tl', mode:'stable' },
    ] },

  88: { z:88, symbol:'Ra', nucleons:226, radius:5.62, bindingPerNucleon:7.66, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:223, name:'Ra-223', abundance:0, halfLife:'11.43 d', decayModes:['α'], spin:'3/2+' },
      { a:224, name:'Ra-224', abundance:0, halfLife:'3.631 d', decayModes:['α'], spin:'0+' },
      { a:226, name:'Ra-226', abundance:0, halfLife:'1600 y', decayModes:['α'], spin:'0+' },
      { a:228, name:'Ra-228', abundance:0, halfLife:'5.75 y', decayModes:['β⁻'], spin:'0+' },
    ],
    decayChain: [
      { a:226, z:88, sym:'Ra', mode:'α' },
      { a:222, z:86, sym:'Rn', mode:'α' },
      { a:218, z:84, sym:'Po', mode:'α' },
      { a:214, z:82, sym:'Pb', mode:'β⁻' },
      { a:214, z:83, sym:'Bi', mode:'β⁻' },
      { a:214, z:84, sym:'Po', mode:'α' },
      { a:210, z:82, sym:'Pb', mode:'β⁻' },
      { a:210, z:83, sym:'Bi', mode:'β⁻' },
      { a:210, z:84, sym:'Po', mode:'α' },
      { a:206, z:82, sym:'Pb', mode:'stable' },
    ] },

  89: { z:89, symbol:'Ac', nucleons:227, radius:5.67, bindingPerNucleon:7.65, spin:'3/2-', magneticMoment:1.1, quadrupole:1.7, stable:false,
    isotopes: [
      { a:225, name:'Ac-225', abundance:0, halfLife:'10.0 d', decayModes:['α'], spin:'3/2-' },
      { a:227, name:'Ac-227', abundance:0, halfLife:'21.77 y', decayModes:['β⁻','α'], spin:'3/2-' },
    ],
    decayChain: [
      { a:227, z:89, sym:'Ac', mode:'β⁻' },
      { a:227, z:90, sym:'Th', mode:'α' },
      { a:223, z:88, sym:'Ra', mode:'α' },
      { a:219, z:86, sym:'Rn', mode:'α' },
      { a:215, z:84, sym:'Po', mode:'α' },
      { a:211, z:82, sym:'Pb', mode:'β⁻' },
      { a:211, z:83, sym:'Bi', mode:'α' },
      { a:207, z:81, sym:'Tl', mode:'stable' },
    ] },

  90: { z:90, symbol:'Th', nucleons:232, radius:5.75, bindingPerNucleon:7.62, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:228, name:'Th-228', abundance:0, halfLife:'1.913 y', decayModes:['α'], spin:'0+' },
      { a:230, name:'Th-230', abundance:0, halfLife:'75.4 ky', decayModes:['α'], spin:'0+' },
      { a:232, name:'Th-232', abundance:100, halfLife:'14.05 Gy', decayModes:['α'], spin:'0+' },
    ],
    decayChain: [
      { a:232, z:90, sym:'Th', mode:'α' },
      { a:228, z:88, sym:'Ra', mode:'β⁻' },
      { a:228, z:89, sym:'Ac', mode:'β⁻' },
      { a:228, z:90, sym:'Th', mode:'α' },
      { a:224, z:88, sym:'Ra', mode:'α' },
      { a:220, z:86, sym:'Rn', mode:'α' },
      { a:216, z:84, sym:'Po', mode:'α' },
      { a:212, z:82, sym:'Pb', mode:'β⁻' },
      { a:212, z:83, sym:'Bi', mode:'α' },
      { a:208, z:82, sym:'Pb', mode:'stable' },
    ] },

  91: { z:91, symbol:'Pa', nucleons:231, radius:5.76, bindingPerNucleon:7.61, spin:'3/2-', magneticMoment:2.01, quadrupole:-1.72, stable:false,
    isotopes: [
      { a:231, name:'Pa-231', abundance:100, halfLife:'32.76 ky', decayModes:['α'], spin:'3/2-' },
      { a:233, name:'Pa-233', abundance:0, halfLife:'26.97 d', decayModes:['β⁻'], spin:'3/2-' },
    ],
    decayChain: [
      { a:231, z:91, sym:'Pa', mode:'α' },
      { a:227, z:89, sym:'Ac', mode:'β⁻' },
      { a:227, z:90, sym:'Th', mode:'α' },
      { a:223, z:88, sym:'Ra', mode:'α' },
      { a:219, z:86, sym:'Rn', mode:'α' },
      { a:215, z:84, sym:'Po', mode:'α' },
      { a:211, z:82, sym:'Pb', mode:'β⁻' },
      { a:211, z:83, sym:'Bi', mode:'α' },
      { a:207, z:81, sym:'Tl', mode:'stable' },
    ] },

  92: { z:92, symbol:'U', nucleons:238, radius:5.86, bindingPerNucleon:7.57, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:233, name:'U-233', abundance:0, halfLife:'159.2 ky', decayModes:['α'], spin:'5/2+' },
      { a:234, name:'U-234', abundance:0.005, halfLife:'245.5 ky', decayModes:['α'], spin:'0+' },
      { a:235, name:'U-235', abundance:0.720, halfLife:'703.8 My', decayModes:['α'], spin:'7/2-' },
      { a:236, name:'U-236', abundance:0, halfLife:'23.42 My', decayModes:['α'], spin:'0+' },
      { a:238, name:'U-238', abundance:99.274, halfLife:'4.468 Gy', decayModes:['α'], spin:'0+' },
    ],
    decayChain: [
      { a:238, z:92, sym:'U', mode:'α' },
      { a:234, z:90, sym:'Th', mode:'β⁻' },
      { a:234, z:91, sym:'Pa', mode:'β⁻' },
      { a:234, z:92, sym:'U', mode:'α' },
      { a:230, z:90, sym:'Th', mode:'α' },
      { a:226, z:88, sym:'Ra', mode:'α' },
      { a:222, z:86, sym:'Rn', mode:'α' },
      { a:218, z:84, sym:'Po', mode:'α' },
      { a:214, z:82, sym:'Pb', mode:'β⁻' },
      { a:214, z:83, sym:'Bi', mode:'β⁻' },
      { a:214, z:84, sym:'Po', mode:'α' },
      { a:210, z:82, sym:'Pb', mode:'β⁻' },
      { a:210, z:83, sym:'Bi', mode:'β⁻' },
      { a:210, z:84, sym:'Po', mode:'α' },
      { a:206, z:82, sym:'Pb', mode:'stable' },
    ] },

  93: { z:93, symbol:'Np', nucleons:237, radius:5.87, bindingPerNucleon:7.57, spin:'5/2+', magneticMoment:3.14, quadrupole:3.87, stable:false,
    isotopes: [
      { a:236, name:'Np-236', abundance:0, halfLife:'154 ky', decayModes:['EC','β⁻'], spin:'6-' },
      { a:237, name:'Np-237', abundance:0, halfLife:'2.144 My', decayModes:['α'], spin:'5/2+' },
    ],
    decayChain: [
      { a:237, z:93, sym:'Np', mode:'α' },
      { a:233, z:91, sym:'Pa', mode:'β⁻' },
      { a:233, z:92, sym:'U', mode:'α' },
      { a:229, z:90, sym:'Th', mode:'α' },
      { a:225, z:88, sym:'Ra', mode:'β⁻' },
      { a:225, z:89, sym:'Ac', mode:'α' },
      { a:221, z:87, sym:'Fr', mode:'α' },
      { a:217, z:85, sym:'At', mode:'α' },
      { a:213, z:83, sym:'Bi', mode:'β⁻' },
      { a:213, z:84, sym:'Po', mode:'α' },
      { a:209, z:82, sym:'Pb', mode:'stable' },
    ] },

  94: { z:94, symbol:'Pu', nucleons:244, radius:5.89, bindingPerNucleon:7.56, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:238, name:'Pu-238', abundance:0, halfLife:'87.7 y', decayModes:['α'], spin:'0+' },
      { a:239, name:'Pu-239', abundance:0, halfLife:'24.11 ky', decayModes:['α'], spin:'1/2+' },
      { a:240, name:'Pu-240', abundance:0, halfLife:'6.561 ky', decayModes:['α'], spin:'0+' },
      { a:241, name:'Pu-241', abundance:0, halfLife:'14.29 y', decayModes:['β⁻'], spin:'5/2+' },
      { a:244, name:'Pu-244', abundance:0, halfLife:'80.0 My', decayModes:['α','SF'], spin:'0+' },
    ],
    decayChain: [
      { a:239, z:94, sym:'Pu', mode:'α' },
      { a:235, z:92, sym:'U', mode:'α' },
      { a:231, z:90, sym:'Th', mode:'β⁻' },
      { a:231, z:91, sym:'Pa', mode:'α' },
      { a:227, z:89, sym:'Ac', mode:'β⁻' },
      { a:227, z:90, sym:'Th', mode:'α' },
      { a:223, z:88, sym:'Ra', mode:'α' },
      { a:219, z:86, sym:'Rn', mode:'α' },
      { a:215, z:84, sym:'Po', mode:'α' },
      { a:211, z:82, sym:'Pb', mode:'β⁻' },
      { a:211, z:83, sym:'Bi', mode:'α' },
      { a:207, z:81, sym:'Tl', mode:'stable' },
    ] },

  95: { z:95, symbol:'Am', nucleons:243, radius:5.90, bindingPerNucleon:7.55, spin:'5/2-', magneticMoment:1.58, quadrupole:4.20, stable:false,
    isotopes: [
      { a:241, name:'Am-241', abundance:0, halfLife:'432.2 y', decayModes:['α'], spin:'5/2-' },
      { a:243, name:'Am-243', abundance:0, halfLife:'7.37 ky', decayModes:['α'], spin:'5/2-' },
    ],
    decayChain: [
      { a:241, z:95, sym:'Am', mode:'α' },
      { a:237, z:93, sym:'Np', mode:'α' },
      { a:233, z:91, sym:'Pa', mode:'β⁻' },
      { a:233, z:92, sym:'U', mode:'α' },
      { a:229, z:90, sym:'Th', mode:'α' },
      { a:225, z:88, sym:'Ra', mode:'β⁻' },
      { a:225, z:89, sym:'Ac', mode:'α' },
      { a:221, z:87, sym:'Fr', mode:'α' },
      { a:217, z:85, sym:'At', mode:'α' },
      { a:213, z:83, sym:'Bi', mode:'α' },
      { a:209, z:81, sym:'Tl', mode:'stable' },
    ] },

  96: { z:96, symbol:'Cm', nucleons:247, radius:5.92, bindingPerNucleon:7.53, spin:'9/2-', magneticMoment:0.36, quadrupole:0, stable:false,
    isotopes: [
      { a:244, name:'Cm-244', abundance:0, halfLife:'18.10 y', decayModes:['α'], spin:'0+' },
      { a:245, name:'Cm-245', abundance:0, halfLife:'8.5 ky', decayModes:['α'], spin:'7/2+' },
      { a:247, name:'Cm-247', abundance:0, halfLife:'15.6 My', decayModes:['α'], spin:'9/2-' },
      { a:248, name:'Cm-248', abundance:0, halfLife:'348 ky', decayModes:['α','SF'], spin:'0+' },
    ], decayChain:null },

  97: { z:97, symbol:'Bk', nucleons:247, radius:5.93, bindingPerNucleon:7.52, spin:'3/2-', magneticMoment:2.0, quadrupole:0, stable:false,
    isotopes: [
      { a:247, name:'Bk-247', abundance:0, halfLife:'1.38 ky', decayModes:['α'], spin:'3/2-' },
      { a:249, name:'Bk-249', abundance:0, halfLife:'330 d', decayModes:['β⁻'], spin:'7/2+' },
    ], decayChain:null },

  98: { z:98, symbol:'Cf', nucleons:251, radius:5.94, bindingPerNucleon:7.50, spin:'1/2+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:249, name:'Cf-249', abundance:0, halfLife:'351 y', decayModes:['α'], spin:'9/2-' },
      { a:250, name:'Cf-250', abundance:0, halfLife:'13.08 y', decayModes:['α','SF'], spin:'0+' },
      { a:251, name:'Cf-251', abundance:0, halfLife:'900 y', decayModes:['α'], spin:'1/2+' },
      { a:252, name:'Cf-252', abundance:0, halfLife:'2.645 y', decayModes:['α','SF'], spin:'0+' },
    ], decayChain:null },

  99: { z:99, symbol:'Es', nucleons:252, radius:5.95, bindingPerNucleon:7.49, spin:'5-', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:252, name:'Es-252', abundance:0, halfLife:'471.7 d', decayModes:['α','EC'], spin:'5-' },
      { a:253, name:'Es-253', abundance:0, halfLife:'20.47 d', decayModes:['α'], spin:'7/2+' },
      { a:254, name:'Es-254', abundance:0, halfLife:'275.7 d', decayModes:['α','EC'], spin:'7+' },
    ], decayChain:null },

  100: { z:100, symbol:'Fm', nucleons:257, radius:5.96, bindingPerNucleon:7.47, spin:'9/2+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:255, name:'Fm-255', abundance:0, halfLife:'20.07 h', decayModes:['α'], spin:'7/2+' },
      { a:257, name:'Fm-257', abundance:0, halfLife:'100.5 d', decayModes:['α','SF'], spin:'9/2+' },
    ], decayChain:null },

  101: { z:101, symbol:'Md', nucleons:258, radius:5.97, bindingPerNucleon:7.45, spin:'8-', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:258, name:'Md-258', abundance:0, halfLife:'51.5 d', decayModes:['α','EC','SF'], spin:'8-' },
      { a:260, name:'Md-260', abundance:0, halfLife:'27.8 d', decayModes:['SF','α','EC'], spin:'0+' },
    ], decayChain:null },

  102: { z:102, symbol:'No', nucleons:259, radius:5.98, bindingPerNucleon:7.43, spin:'9/2+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:255, name:'No-255', abundance:0, halfLife:'3.1 m', decayModes:['α','EC'], spin:'1/2+' },
      { a:259, name:'No-259', abundance:0, halfLife:'58 m', decayModes:['α','EC'], spin:'9/2+' },
    ], decayChain:null },

  103: { z:103, symbol:'Lr', nucleons:266, radius:5.99, bindingPerNucleon:7.41, spin:'7/2-', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:260, name:'Lr-260', abundance:0, halfLife:'2.7 m', decayModes:['α','EC','SF'], spin:'0+' },
      { a:266, name:'Lr-266', abundance:0, halfLife:'11 h', decayModes:['SF'], spin:'0+' },
    ], decayChain:null },

  104: { z:104, symbol:'Rf', nucleons:267, radius:6.00, bindingPerNucleon:7.39, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:261, name:'Rf-261', abundance:0, halfLife:'68 s', decayModes:['α','SF'], spin:'0+' },
      { a:267, name:'Rf-267', abundance:0, halfLife:'1.3 h', decayModes:['SF'], spin:'0+' },
    ], decayChain:null },

  105: { z:105, symbol:'Db', nucleons:268, radius:6.01, bindingPerNucleon:7.37, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:262, name:'Db-262', abundance:0, halfLife:'35 s', decayModes:['α','SF','EC'], spin:'0+' },
      { a:268, name:'Db-268', abundance:0, halfLife:'32 h', decayModes:['SF','EC'], spin:'0+' },
    ], decayChain:null },

  106: { z:106, symbol:'Sg', nucleons:269, radius:6.02, bindingPerNucleon:7.35, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:265, name:'Sg-265', abundance:0, halfLife:'8.9 s', decayModes:['α'], spin:'0+' },
      { a:269, name:'Sg-269', abundance:0, halfLife:'14 m', decayModes:['α'], spin:'0+' },
    ], decayChain:null },

  107: { z:107, symbol:'Bh', nucleons:270, radius:6.03, bindingPerNucleon:7.33, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:267, name:'Bh-267', abundance:0, halfLife:'17 s', decayModes:['α'], spin:'0+' },
      { a:270, name:'Bh-270', abundance:0, halfLife:'2.4 m', decayModes:['α'], spin:'0+' },
    ], decayChain:null },

  108: { z:108, symbol:'Hs', nucleons:269, radius:6.04, bindingPerNucleon:7.31, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:269, name:'Hs-269', abundance:0, halfLife:'9.7 s', decayModes:['α'], spin:'0+' },
      { a:270, name:'Hs-270', abundance:0, halfLife:'3.6 s', decayModes:['α'], spin:'0+' },
    ], decayChain:null },

  109: { z:109, symbol:'Mt', nucleons:278, radius:6.05, bindingPerNucleon:7.29, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:276, name:'Mt-276', abundance:0, halfLife:'0.72 s', decayModes:['α'], spin:'0+' },
      { a:278, name:'Mt-278', abundance:0, halfLife:'7.6 s', decayModes:['α'], spin:'0+' },
    ], decayChain:null },

  110: { z:110, symbol:'Ds', nucleons:281, radius:6.06, bindingPerNucleon:7.27, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:279, name:'Ds-279', abundance:0, halfLife:'0.20 s', decayModes:['SF','α'], spin:'0+' },
      { a:281, name:'Ds-281', abundance:0, halfLife:'12.7 s', decayModes:['SF','α'], spin:'0+' },
    ], decayChain:null },

  111: { z:111, symbol:'Rg', nucleons:282, radius:6.07, bindingPerNucleon:7.25, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:280, name:'Rg-280', abundance:0, halfLife:'3.6 s', decayModes:['α'], spin:'0+' },
      { a:282, name:'Rg-282', abundance:0, halfLife:'0.5 s', decayModes:['α'], spin:'0+' },
    ], decayChain:null },

  112: { z:112, symbol:'Cn', nucleons:285, radius:6.08, bindingPerNucleon:7.23, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:283, name:'Cn-283', abundance:0, halfLife:'4 s', decayModes:['SF','α'], spin:'0+' },
      { a:285, name:'Cn-285', abundance:0, halfLife:'29 s', decayModes:['α'], spin:'0+' },
    ], decayChain:null },

  113: { z:113, symbol:'Nh', nucleons:286, radius:6.09, bindingPerNucleon:7.21, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:284, name:'Nh-284', abundance:0, halfLife:'0.91 s', decayModes:['α'], spin:'0+' },
      { a:286, name:'Nh-286', abundance:0, halfLife:'9.5 s', decayModes:['α'], spin:'0+' },
    ], decayChain:null },

  114: { z:114, symbol:'Fl', nucleons:289, radius:6.10, bindingPerNucleon:7.19, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:287, name:'Fl-287', abundance:0, halfLife:'0.48 s', decayModes:['α'], spin:'0+' },
      { a:289, name:'Fl-289', abundance:0, halfLife:'2.1 s', decayModes:['α'], spin:'0+' },
    ], decayChain:null },

  115: { z:115, symbol:'Mc', nucleons:290, radius:6.11, bindingPerNucleon:7.17, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:288, name:'Mc-288', abundance:0, halfLife:'0.17 s', decayModes:['α'], spin:'0+' },
      { a:290, name:'Mc-290', abundance:0, halfLife:'0.65 s', decayModes:['α'], spin:'0+' },
    ], decayChain:null },

  116: { z:116, symbol:'Lv', nucleons:293, radius:6.12, bindingPerNucleon:7.15, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:291, name:'Lv-291', abundance:0, halfLife:'19 ms', decayModes:['α'], spin:'0+' },
      { a:293, name:'Lv-293', abundance:0, halfLife:'53 ms', decayModes:['α'], spin:'0+' },
    ], decayChain:null },

  117: { z:117, symbol:'Ts', nucleons:294, radius:6.13, bindingPerNucleon:7.13, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:293, name:'Ts-293', abundance:0, halfLife:'22 ms', decayModes:['α'], spin:'0+' },
      { a:294, name:'Ts-294', abundance:0, halfLife:'51 ms', decayModes:['α'], spin:'0+' },
    ], decayChain:null },

  118: { z:118, symbol:'Og', nucleons:294, radius:6.14, bindingPerNucleon:7.11, spin:'0+', magneticMoment:0, quadrupole:0, stable:false,
    isotopes: [
      { a:294, name:'Og-294', abundance:0, halfLife:'0.69 ms', decayModes:['α'], spin:'0+' },
    ], decayChain:null },
};

// ═══════════════════════════════════════════════════════════
// Nuclear Shell Model — Magic Numbers
// ═══════════════════════════════════════════════════════════
// The nuclear shell model predicts enhanced stability when either
// the number of protons or neutrons equals a magic number:
//   2, 8, 20, 28, 50, 82, 126
//
// Energy levels (with spin-orbit coupling):
//   1s₁/₂ | 1p₃/₂ 1p₁/₂ | 1d₅/₂ 2s₁/₂ 1d₃/₂ | 1f₇/₂ |
//   2p₃/₂ 1f₅/₂ 2p₁/₂ 1g₉/₂ | 1g₇/₂ 2d₅/₂ 2d₃/₂ 3s₁/₂ 1h₁₁/₂ |
//   1h₉/₂ 2f₇/₂ 2f₅/₂ 3p₃/₂ 3p₁/₂ 1i₁₃/₂ |

const NUCLEAR_SHELLS = [
  // Each entry: { label, capacity, cumulativeTotal (magic number at shell closure) }
  // Shell 1: magic 2
  { label: '1s₁/₂', j: '1/2', capacity: 2, cumulative: 2, magic: true },
  // Shell 2: magic 8
  { label: '1p₃/₂', j: '3/2', capacity: 4, cumulative: 6, magic: false },
  { label: '1p₁/₂', j: '1/2', capacity: 2, cumulative: 8, magic: true },
  // Shell 3: magic 20
  { label: '1d₅/₂', j: '5/2', capacity: 6, cumulative: 14, magic: false },
  { label: '2s₁/₂', j: '1/2', capacity: 2, cumulative: 16, magic: false },
  { label: '1d₃/₂', j: '3/2', capacity: 4, cumulative: 20, magic: true },
  // Shell 4: magic 28
  { label: '1f₇/₂', j: '7/2', capacity: 8, cumulative: 28, magic: true },
  // Shell 5: magic 50
  { label: '2p₃/₂', j: '3/2', capacity: 4, cumulative: 32, magic: false },
  { label: '1f₅/₂', j: '5/2', capacity: 6, cumulative: 38, magic: false },
  { label: '2p₁/₂', j: '1/2', capacity: 2, cumulative: 40, magic: false },
  { label: '1g₉/₂', j: '9/2', capacity: 10, cumulative: 50, magic: true },
  // Shell 6: magic 82
  { label: '1g₇/₂', j: '7/2', capacity: 8, cumulative: 58, magic: false },
  { label: '2d₅/₂', j: '5/2', capacity: 6, cumulative: 64, magic: false },
  { label: '2d₃/₂', j: '3/2', capacity: 4, cumulative: 68, magic: false },
  { label: '3s₁/₂', j: '1/2', capacity: 2, cumulative: 70, magic: false },
  { label: '1h₁₁/₂', j: '11/2', capacity: 12, cumulative: 82, magic: true },
  // Shell 7: magic 126
  { label: '1h₉/₂', j: '9/2', capacity: 10, cumulative: 92, magic: false },
  { label: '2f₇/₂', j: '7/2', capacity: 8, cumulative: 100, magic: false },
  { label: '2f₅/₂', j: '5/2', capacity: 6, cumulative: 106, magic: false },
  { label: '3p₃/₂', j: '3/2', capacity: 4, cumulative: 110, magic: false },
  { label: '3p₁/₂', j: '1/2', capacity: 2, cumulative: 112, magic: false },
  { label: '1i₁₃/₂', j: '13/2', capacity: 14, cumulative: 126, magic: true },
  // Beyond 126 (predicted):
  { label: '2g₉/₂', j: '9/2', capacity: 10, cumulative: 136, magic: false },
  { label: '1i₁₁/₂', j: '11/2', capacity: 12, cumulative: 148, magic: false },
  { label: '3d₅/₂', j: '5/2', capacity: 6, cumulative: 154, magic: false },
  { label: '1j₁₅/₂', j: '15/2', capacity: 16, cumulative: 170, magic: false },
  { label: '3d₃/₂', j: '3/2', capacity: 4, cumulative: 174, magic: false },
  { label: '4s₁/₂', j: '1/2', capacity: 2, cumulative: 176, magic: false },
  { label: '2g₇/₂', j: '7/2', capacity: 8, cumulative: 184, magic: true }, // predicted magic
];

// Binding energy per nucleon reference curve (for the chart)
// Sampled at key nuclei: [A, B/A in MeV]
const BINDING_ENERGY_CURVE = [
  [1, 0], [2, 1.11], [3, 2.83], [4, 7.07], [6, 5.33], [7, 5.61],
  [9, 6.46], [10, 6.50], [11, 6.93], [12, 7.68], [14, 7.48],
  [16, 7.98], [19, 7.78], [20, 8.03], [23, 8.11], [24, 8.26],
  [27, 8.33], [28, 8.45], [31, 8.48], [32, 8.49], [35, 8.52],
  [40, 8.55], [45, 8.62], [48, 8.72], [51, 8.74], [52, 8.76],
  [55, 8.77], [56, 8.79], [58, 8.76], [59, 8.77], [63, 8.75],
  [64, 8.74], [69, 8.72], [74, 8.71], [75, 8.70], [80, 8.71],
  [84, 8.72], [85, 8.70], [88, 8.73], [89, 8.71], [90, 8.71],
  [93, 8.66], [98, 8.66], [103, 8.58], [106, 8.56], [107, 8.55],
  [114, 8.54], [115, 8.52], [120, 8.51], [121, 8.49], [127, 8.45],
  [130, 8.47], [132, 8.43], [133, 8.41], [138, 8.39], [139, 8.38],
  [140, 8.38], [141, 8.35], [142, 8.33], [152, 8.30], [153, 8.28],
  [158, 8.26], [159, 8.25], [164, 8.23], [165, 8.22], [166, 8.20],
  [169, 8.19], [174, 8.18], [175, 8.17], [180, 8.15], [181, 8.13],
  [184, 8.12], [187, 8.10], [192, 8.08], [193, 8.07], [195, 8.06],
  [197, 8.04], [202, 8.03], [205, 8.00], [208, 7.87], [209, 7.85],
  [222, 7.80], [226, 7.66], [232, 7.62], [235, 7.59], [238, 7.57],
  [244, 7.56], [247, 7.53], [251, 7.50], [257, 7.47], [294, 7.11],
];
