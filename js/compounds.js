/**
 * COMPOUNDS.js — Common compounds/molecules for each element
 * Each entry has: name, formula, atoms[] with 3D positions and bonds[]
 * Positions are in Ångströms (Å) — scaled at render time
 * Colors follow CPK coloring convention
 */

const CPK_COLORS = {
  H:  '#FFFFFF', He: '#D9FFFF', Li: '#CC80FF', Be: '#C2FF00',
  B:  '#FFB5B5', C:  '#909090', N:  '#3050F8', O:  '#FF0D0D',
  F:  '#90E050', Ne: '#B3E3F5', Na: '#AB5CF2', Mg: '#8AFF00',
  Al: '#BFA6A6', Si: '#F0C8A0', P:  '#FF8000', S:  '#FFFF30',
  Cl: '#1FF01F', Ar: '#80D1E3', K:  '#8F40D4', Ca: '#3DFF00',
  Ti: '#BFC2C7', V:  '#A6A6AB', Cr: '#8A99C7', Mn: '#9C7AC7',
  Fe: '#E06633', Co: '#F090A0', Ni: '#50D050', Cu: '#C88033',
  Zn: '#7D80B0', Ga: '#C28F8F', Ge: '#668F8F', As: '#BD80E3',
  Se: '#FFA100', Br: '#A62929', Kr: '#5CB8D1', Rb: '#702EB0',
  Sr: '#00FF00', Zr: '#94E0E0', Nb: '#73C2C9', Mo: '#54B5B5',
  Ag: '#C0C0C0', Sn: '#668080', Sb: '#9E63B5', Te: '#D47A00',
  I:  '#940094', Xe: '#429EB0', Cs: '#57178F', Ba: '#00C900',
  W:  '#2194D6', Pt: '#D0D0E0', Au: '#FFD123', Hg: '#B8B8D0',
  Pb: '#575961', Bi: '#9E4FB5', U:  '#008FFF',
};
// Default for unlisted elements
function getCPK(sym) { return CPK_COLORS[sym] || '#FF69B4'; }

// Atomic radii for ball sizes (in Å, for display only)
const ATOM_RADII = {
  H: 0.31, He: 0.28, Li: 1.28, Be: 0.96, B: 0.84, C: 0.76,
  N: 0.71, O: 0.66, F: 0.57, Ne: 0.58, Na: 1.66, Mg: 1.41,
  Al: 1.21, Si: 1.11, P: 1.07, S: 1.05, Cl: 1.02, Ar: 1.06,
  K: 2.03, Ca: 1.76, Ti: 1.60, Fe: 1.32, Cu: 1.32, Zn: 1.22,
  Br: 1.20, Ag: 1.45, I: 1.39, Au: 1.36, Pt: 1.36, Hg: 1.32,
  Pb: 1.46, U: 1.96,
};
function getRadius(sym) { return ATOM_RADII[sym] || 0.90; }

/**
 * ELEMENT_COMPOUNDS — keyed by atomic number
 * Each value is an array of { name, formula, description, atoms, bonds }
 *   atoms: [{ sym, x, y, z }]  — 3D coords in Ångströms
 *   bonds: [{ from, to, order }] — indices into atoms[], order 1/2/3
 */
const ELEMENT_COMPOUNDS = {
  // ─── Hydrogen (1) ───
  1: [
    {
      name: 'Water',
      formula: 'H₂O',
      description: 'Essential for all known life. The O–H bond angle is 104.5°.',
      atoms: [
        { sym: 'O', x: 0, y: 0, z: 0 },
        { sym: 'H', x: -0.76, y: 0.59, z: 0 },
        { sym: 'H', x: 0.76, y: 0.59, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }],
    },
    {
      name: 'Hydrogen Gas',
      formula: 'H₂',
      description: 'The lightest and most abundant molecule in the universe.',
      atoms: [
        { sym: 'H', x: -0.37, y: 0, z: 0 },
        { sym: 'H', x: 0.37, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Helium (2) ───
  2: [
    {
      name: 'Helium (noble)',
      formula: 'He',
      description: 'Helium is a noble gas — it does not form stable compounds under normal conditions.',
      atoms: [{ sym: 'He', x: 0, y: 0, z: 0 }],
      bonds: [],
    },
  ],

  // ─── Lithium (3) ───
  3: [
    {
      name: 'Lithium Fluoride',
      formula: 'LiF',
      description: 'Ionic salt used in optics. Has one of the highest lattice energies.',
      atoms: [
        { sym: 'Li', x: -0.80, y: 0, z: 0 },
        { sym: 'F', x: 0.80, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Beryllium (4) ───
  4: [
    {
      name: 'Beryllium Chloride',
      formula: 'BeCl₂',
      description: 'Linear molecule — an example of sp hybridization.',
      atoms: [
        { sym: 'Cl', x: -1.75, y: 0, z: 0 },
        { sym: 'Be', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.75, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
  ],

  // ─── Boron (5) ───
  5: [
    {
      name: 'Boron Trifluoride',
      formula: 'BF₃',
      description: 'Trigonal planar — classic Lewis acid with an empty p orbital.',
      atoms: [
        { sym: 'B', x: 0, y: 0, z: 0 },
        { sym: 'F', x: 1.30, y: 0, z: 0 },
        { sym: 'F', x: -0.65, y: 1.13, z: 0 },
        { sym: 'F', x: -0.65, y: -1.13, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
      ],
    },
  ],

  // ─── Carbon (6) ───
  6: [
    {
      name: 'Carbon Dioxide',
      formula: 'CO₂',
      description: 'Linear molecule with double bonds. Key greenhouse gas.',
      atoms: [
        { sym: 'O', x: -1.16, y: 0, z: 0 },
        { sym: 'C', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.16, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }],
    },
    {
      name: 'Methane',
      formula: 'CH₄',
      description: 'Tetrahedral geometry — sp³ hybridized carbon.',
      atoms: [
        { sym: 'C', x: 0, y: 0, z: 0 },
        { sym: 'H', x: 0.63, y: 0.63, z: 0.63 },
        { sym: 'H', x: -0.63, y: -0.63, z: 0.63 },
        { sym: 'H', x: -0.63, y: 0.63, z: -0.63 },
        { sym: 'H', x: 0.63, y: -0.63, z: -0.63 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 },
        { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Nitrogen (7) ───
  7: [
    {
      name: 'Ammonia',
      formula: 'NH₃',
      description: 'Trigonal pyramidal — the lone pair pushes bond angles to 107°.',
      atoms: [
        { sym: 'N', x: 0, y: 0, z: 0.12 },
        { sym: 'H', x: 0, y: 0.94, z: -0.36 },
        { sym: 'H', x: 0.81, y: -0.47, z: -0.36 },
        { sym: 'H', x: -0.81, y: -0.47, z: -0.36 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
      ],
    },
    {
      name: 'Nitrogen Gas',
      formula: 'N₂',
      description: 'Triple-bonded — one of the strongest chemical bonds (945 kJ/mol).',
      atoms: [
        { sym: 'N', x: -0.55, y: 0, z: 0 },
        { sym: 'N', x: 0.55, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 3 }],
    },
  ],

  // ─── Oxygen (8) ───
  8: [
    {
      name: 'Water',
      formula: 'H₂O',
      description: 'Bent geometry with 104.5° bond angle. Universal solvent.',
      atoms: [
        { sym: 'O', x: 0, y: 0, z: 0 },
        { sym: 'H', x: -0.76, y: 0.59, z: 0 },
        { sym: 'H', x: 0.76, y: 0.59, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }],
    },
    {
      name: 'Ozone',
      formula: 'O₃',
      description: 'Bent molecule with resonance structures. Protects Earth from UV.',
      atoms: [
        { sym: 'O', x: -1.08, y: 0.34, z: 0 },
        { sym: 'O', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.08, y: 0.34, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1.5 }, { from: 1, to: 2, order: 1.5 }],
    },
  ],

  // ─── Fluorine (9) ───
  9: [
    {
      name: 'Hydrogen Fluoride',
      formula: 'HF',
      description: 'Extremely polar bond. Used in glass etching.',
      atoms: [
        { sym: 'H', x: -0.46, y: 0, z: 0 },
        { sym: 'F', x: 0.46, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Neon (10) ───
  10: [
    {
      name: 'Neon (noble)',
      formula: 'Ne',
      description: 'Noble gas — full octet prevents bonding. Used in neon signs.',
      atoms: [{ sym: 'Ne', x: 0, y: 0, z: 0 }],
      bonds: [],
    },
  ],

  // ─── Sodium (11) ───
  11: [
    {
      name: 'Sodium Chloride',
      formula: 'NaCl',
      description: 'Table salt — iconic ionic compound. Cubic crystal structure.',
      atoms: [
        { sym: 'Na', x: -1.18, y: 0, z: 0 },
        { sym: 'Cl', x: 1.18, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Magnesium (12) ───
  12: [
    {
      name: 'Magnesium Oxide',
      formula: 'MgO',
      description: 'Highly refractory compound. Used in fireproofing and antacids.',
      atoms: [
        { sym: 'Mg', x: -0.87, y: 0, z: 0 },
        { sym: 'O', x: 0.87, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }],
    },
  ],

  // ─── Aluminum (13) ───
  13: [
    {
      name: 'Alumina',
      formula: 'Al₂O₃',
      description: 'Extremely hard — corundum. Sapphires and rubies are impure Al₂O₃.',
      atoms: [
        { sym: 'Al', x: -0.9, y: 0.5, z: 0 },
        { sym: 'Al', x: 0.9, y: 0.5, z: 0 },
        { sym: 'O', x: 0, y: -0.5, z: 0 },
        { sym: 'O', x: -1.2, y: -0.6, z: 0.5 },
        { sym: 'O', x: 1.2, y: -0.6, z: -0.5 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
        { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Silicon (14) ───
  14: [
    {
      name: 'Silicon Dioxide',
      formula: 'SiO₂',
      description: 'Quartz — basis of glass, sand, and semiconductor oxide layers.',
      atoms: [
        { sym: 'O', x: -1.16, y: 0, z: 0 },
        { sym: 'Si', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.16, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }],
    },
  ],

  // ─── Phosphorus (15) ───
  15: [
    {
      name: 'Phosphine',
      formula: 'PH₃',
      description: 'Trigonal pyramidal. Toxic gas used in semiconductor manufacturing.',
      atoms: [
        { sym: 'P', x: 0, y: 0, z: 0.14 },
        { sym: 'H', x: 0, y: 1.02, z: -0.42 },
        { sym: 'H', x: 0.88, y: -0.51, z: -0.42 },
        { sym: 'H', x: -0.88, y: -0.51, z: -0.42 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
      ],
    },
  ],

  // ─── Sulfur (16) ───
  16: [
    {
      name: 'Sulfuric Acid',
      formula: 'H₂SO₄',
      description: 'King of chemicals — most produced industrial chemical worldwide.',
      atoms: [
        { sym: 'S', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.1, y: 0.7, z: 0 },
        { sym: 'O', x: -1.1, y: 0.7, z: 0 },
        { sym: 'O', x: 0.8, y: -1.0, z: 0 },
        { sym: 'O', x: -0.8, y: -1.0, z: 0 },
        { sym: 'H', x: 1.5, y: -1.5, z: 0 },
        { sym: 'H', x: -1.5, y: -1.5, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 },
        { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 },
        { from: 3, to: 5, order: 1 }, { from: 4, to: 6, order: 1 },
      ],
    },
  ],

  // ─── Chlorine (17) ───
  17: [
    {
      name: 'Hydrochloric Acid',
      formula: 'HCl',
      description: 'Strong acid in your stomach. Bond length 1.27 Å.',
      atoms: [
        { sym: 'H', x: -0.64, y: 0, z: 0 },
        { sym: 'Cl', x: 0.64, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Argon (18) ───
  18: [
    {
      name: 'Argon (noble)',
      formula: 'Ar',
      description: 'Third-most abundant gas in the atmosphere (0.93%). Inert.',
      atoms: [{ sym: 'Ar', x: 0, y: 0, z: 0 }],
      bonds: [],
    },
  ],

  // ─── Potassium (19) ───
  19: [
    {
      name: 'Potassium Hydroxide',
      formula: 'KOH',
      description: 'Strong base — caustic potash. Used in soap-making.',
      atoms: [
        { sym: 'K', x: -1.4, y: 0, z: 0 },
        { sym: 'O', x: 0, y: 0, z: 0 },
        { sym: 'H', x: 0.48, y: 0.48, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
  ],

  // ─── Calcium (20) ───
  20: [
    {
      name: 'Calcium Carbonate',
      formula: 'CaCO₃',
      description: 'Limestone, chalk, marble, and seashells. Reacts with acid to fizz.',
      atoms: [
        { sym: 'Ca', x: -2.0, y: 0, z: 0 },
        { sym: 'C', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.13, y: 0.65, z: 0 },
        { sym: 'O', x: -0.56, y: 1.10, z: 0 },
        { sym: 'O', x: -0.56, y: -1.10, z: 0 },
      ],
      bonds: [
        { from: 0, to: 4, order: 1 },
        { from: 1, to: 2, order: 2 }, { from: 1, to: 3, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Scandium (21) ───
  21: [
    {
      name: 'Scandium Oxide',
      formula: 'Sc₂O₃',
      description: 'White solid used in high-intensity lighting and lasers.',
      atoms: [
        { sym: 'Sc', x: -1.0, y: 0.4, z: 0 },
        { sym: 'Sc', x: 1.0, y: 0.4, z: 0 },
        { sym: 'O', x: 0, y: -0.4, z: 0 },
        { sym: 'O', x: -1.3, y: -0.6, z: 0.4 },
        { sym: 'O', x: 1.3, y: -0.6, z: -0.4 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
        { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Titanium (22) ───
  22: [
    {
      name: 'Titanium Dioxide',
      formula: 'TiO₂',
      description: 'Brilliant white pigment in paint, sunscreen, and food coloring.',
      atoms: [
        { sym: 'O', x: -1.16, y: 0, z: 0 },
        { sym: 'Ti', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.16, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }],
    },
  ],

  // ─── Vanadium (23) ───
  23: [
    {
      name: 'Vanadium Pentoxide',
      formula: 'V₂O₅',
      description: 'Orange catalyst used in sulfuric acid production.',
      atoms: [
        { sym: 'V', x: -0.8, y: 0, z: 0 },
        { sym: 'V', x: 0.8, y: 0, z: 0 },
        { sym: 'O', x: 0, y: 0.6, z: 0 },
        { sym: 'O', x: -1.6, y: 0.6, z: 0 },
        { sym: 'O', x: 1.6, y: 0.6, z: 0 },
        { sym: 'O', x: -0.8, y: -0.9, z: 0 },
        { sym: 'O', x: 0.8, y: -0.9, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 2 }, { from: 0, to: 5, order: 1 },
        { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 2 }, { from: 1, to: 6, order: 1 },
      ],
    },
  ],

  // ─── Chromium (24) ───
  24: [
    {
      name: 'Potassium Dichromate',
      formula: 'K₂Cr₂O₇',
      description: 'Vivid orange — classic oxidizing agent in chemistry labs.',
      atoms: [
        { sym: 'Cr', x: -0.9, y: 0, z: 0 },
        { sym: 'Cr', x: 0.9, y: 0, z: 0 },
        { sym: 'O', x: 0, y: 0, z: 0.4 },
        { sym: 'O', x: -1.6, y: 0.8, z: 0 },
        { sym: 'O', x: -1.6, y: -0.8, z: 0 },
        { sym: 'O', x: 1.6, y: 0.8, z: 0 },
        { sym: 'O', x: 1.6, y: -0.8, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 1, to: 2, order: 1 },
        { from: 0, to: 3, order: 2 }, { from: 0, to: 4, order: 2 },
        { from: 1, to: 5, order: 2 }, { from: 1, to: 6, order: 2 },
      ],
    },
  ],

  // ─── Manganese (25) ───
  25: [
    {
      name: 'Potassium Permanganate',
      formula: 'KMnO₄',
      description: 'Deep purple — strong oxidizer used in water treatment.',
      atoms: [
        { sym: 'Mn', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.0, y: 0.7, z: 0 },
        { sym: 'O', x: -1.0, y: 0.7, z: 0 },
        { sym: 'O', x: 0, y: -1.0, z: 0.6 },
        { sym: 'O', x: 0, y: -1.0, z: -0.6 },
      ],
      bonds: [
        { from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 },
        { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Iron (26) ───
  26: [
    {
      name: 'Iron(III) Oxide',
      formula: 'Fe₂O₃',
      description: 'Rust! Also the pigment in red ochre, used since prehistory.',
      atoms: [
        { sym: 'Fe', x: -0.9, y: 0.4, z: 0 },
        { sym: 'Fe', x: 0.9, y: 0.4, z: 0 },
        { sym: 'O', x: 0, y: -0.4, z: 0.3 },
        { sym: 'O', x: -1.3, y: -0.5, z: -0.3 },
        { sym: 'O', x: 1.3, y: -0.5, z: -0.3 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
        { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Cobalt (27) ───
  27: [
    {
      name: 'Cobalt(II) Chloride',
      formula: 'CoCl₂',
      description: 'Changes from blue (dry) to pink (wet) — a humidity indicator.',
      atoms: [
        { sym: 'Cl', x: -1.6, y: 0, z: 0 },
        { sym: 'Co', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.6, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
  ],

  // ─── Nickel (28) ───
  28: [
    {
      name: 'Nickel(II) Sulfate',
      formula: 'NiSO₄',
      description: 'Green crystal used in nickel plating and rechargeable batteries.',
      atoms: [
        { sym: 'Ni', x: -1.8, y: 0, z: 0 },
        { sym: 'S', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 0.9, y: 0.8, z: 0 },
        { sym: 'O', x: -0.9, y: 0.8, z: 0 },
        { sym: 'O', x: 0, y: -1.0, z: 0.5 },
        { sym: 'O', x: 0, y: -1.0, z: -0.5 },
      ],
      bonds: [
        { from: 0, to: 3, order: 1 },
        { from: 1, to: 2, order: 2 }, { from: 1, to: 3, order: 1 },
        { from: 1, to: 4, order: 2 }, { from: 1, to: 5, order: 1 },
      ],
    },
  ],

  // ─── Copper (29) ───
  29: [
    {
      name: 'Copper(II) Sulfate',
      formula: 'CuSO₄',
      description: 'Brilliant blue crystal. Used in fungicides and electroplating.',
      atoms: [
        { sym: 'Cu', x: -1.8, y: 0, z: 0 },
        { sym: 'S', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 0.9, y: 0.8, z: 0 },
        { sym: 'O', x: -0.9, y: 0.8, z: 0 },
        { sym: 'O', x: 0, y: -1.0, z: 0.5 },
        { sym: 'O', x: 0, y: -1.0, z: -0.5 },
      ],
      bonds: [
        { from: 0, to: 3, order: 1 },
        { from: 1, to: 2, order: 2 }, { from: 1, to: 3, order: 1 },
        { from: 1, to: 4, order: 2 }, { from: 1, to: 5, order: 1 },
      ],
    },
  ],

  // ─── Zinc (30) ───
  30: [
    {
      name: 'Zinc Oxide',
      formula: 'ZnO',
      description: 'White powder — in sunscreen, rubber, and calamine lotion.',
      atoms: [
        { sym: 'Zn', x: -0.85, y: 0, z: 0 },
        { sym: 'O', x: 0.85, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }],
    },
  ],

  // ─── Gallium (31) ───
  31: [
    {
      name: 'Gallium Arsenide',
      formula: 'GaAs',
      description: 'Semiconductor with direct bandgap — key for LEDs and solar cells.',
      atoms: [
        { sym: 'Ga', x: -1.12, y: 0, z: 0 },
        { sym: 'As', x: 1.12, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Germanium (32) ───
  32: [
    {
      name: 'Germanium Dioxide',
      formula: 'GeO₂',
      description: 'Used in fiber optics and as a catalyst for PET plastic.',
      atoms: [
        { sym: 'O', x: -1.16, y: 0, z: 0 },
        { sym: 'Ge', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.16, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }],
    },
  ],

  // ─── Arsenic (33) ───
  33: [
    {
      name: 'Arsenic Trioxide',
      formula: 'As₂O₃',
      description: '"Inheritance powder" — historically notorious poison, now used in cancer treatment.',
      atoms: [
        { sym: 'As', x: -0.9, y: 0.4, z: 0 },
        { sym: 'As', x: 0.9, y: 0.4, z: 0 },
        { sym: 'O', x: 0, y: -0.3, z: 0.3 },
        { sym: 'O', x: -1.2, y: -0.5, z: -0.3 },
        { sym: 'O', x: 1.2, y: -0.5, z: -0.3 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
        { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Selenium (34) ───
  34: [
    {
      name: 'Hydrogen Selenide',
      formula: 'H₂Se',
      description: 'Bent geometry like water. Smells horrible — one of the worst.',
      atoms: [
        { sym: 'Se', x: 0, y: 0, z: 0 },
        { sym: 'H', x: -0.92, y: 0.60, z: 0 },
        { sym: 'H', x: 0.92, y: 0.60, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }],
    },
  ],

  // ─── Bromine (35) ───
  35: [
    {
      name: 'Hydrobromic Acid',
      formula: 'HBr',
      description: 'Strong acid. Bromine is the only non-metal liquid at room temperature.',
      atoms: [
        { sym: 'H', x: -0.71, y: 0, z: 0 },
        { sym: 'Br', x: 0.71, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Krypton (36) ───
  36: [
    {
      name: 'Krypton Difluoride',
      formula: 'KrF₂',
      description: 'Rare noble gas compound — only stable below −30 °C.',
      atoms: [
        { sym: 'F', x: -1.50, y: 0, z: 0 },
        { sym: 'Kr', x: 0, y: 0, z: 0 },
        { sym: 'F', x: 1.50, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
  ],

  // ─── Rubidium (37) ───
  37: [
    {
      name: 'Rubidium Chloride',
      formula: 'RbCl',
      description: 'Ionic salt. Used in biochemistry as a cell competence agent.',
      atoms: [
        { sym: 'Rb', x: -1.30, y: 0, z: 0 },
        { sym: 'Cl', x: 1.30, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Strontium (38) ───
  38: [
    {
      name: 'Strontium Carbonate',
      formula: 'SrCO₃',
      description: 'Red flame! Used in fireworks and flares.',
      atoms: [
        { sym: 'Sr', x: -2.0, y: 0, z: 0 },
        { sym: 'C', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.0, y: 0.6, z: 0 },
        { sym: 'O', x: -0.56, y: 1.0, z: 0 },
        { sym: 'O', x: -0.56, y: -1.0, z: 0 },
      ],
      bonds: [
        { from: 0, to: 4, order: 1 },
        { from: 1, to: 2, order: 2 }, { from: 1, to: 3, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Yttrium (39) ───
  39: [
    {
      name: 'Yttrium(III) Oxide',
      formula: 'Y₂O₃',
      description: 'Used in red phosphors for TV screens and LEDs.',
      atoms: [
        { sym: 'Y', x: -1.0, y: 0.4, z: 0 },
        { sym: 'Y', x: 1.0, y: 0.4, z: 0 },
        { sym: 'O', x: 0, y: -0.3, z: 0 },
        { sym: 'O', x: -1.3, y: -0.5, z: 0 },
        { sym: 'O', x: 1.3, y: -0.5, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
        { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Zirconium (40) ───
  40: [
    {
      name: 'Zirconium Dioxide',
      formula: 'ZrO₂',
      description: 'Cubic zirconia — diamond simulant. Also used in dental crowns.',
      atoms: [
        { sym: 'O', x: -1.16, y: 0, z: 0 },
        { sym: 'Zr', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.16, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }],
    },
  ],

  // ─── Niobium (41) ───
  41: [
    {
      name: 'Niobium Pentoxide',
      formula: 'Nb₂O₅',
      description: 'Used in capacitors, optical glass, and superconducting alloys.',
      atoms: [
        { sym: 'Nb', x: -0.8, y: 0, z: 0 },
        { sym: 'Nb', x: 0.8, y: 0, z: 0 },
        { sym: 'O', x: 0, y: 0.7, z: 0 },
        { sym: 'O', x: -1.5, y: 0.6, z: 0 },
        { sym: 'O', x: 1.5, y: 0.6, z: 0 },
        { sym: 'O', x: -0.8, y: -0.8, z: 0 },
        { sym: 'O', x: 0.8, y: -0.8, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 2 }, { from: 0, to: 5, order: 1 },
        { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 2 }, { from: 1, to: 6, order: 1 },
      ],
    },
  ],

  // ─── Molybdenum (42) ───
  42: [
    {
      name: 'Molybdenum Disulfide',
      formula: 'MoS₂',
      description: 'Excellent dry lubricant — used in space mechanisms.',
      atoms: [
        { sym: 'S', x: -1.0, y: 0.8, z: 0 },
        { sym: 'Mo', x: 0, y: 0, z: 0 },
        { sym: 'S', x: 1.0, y: 0.8, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }],
    },
  ],

  // ─── Technetium (43) ───
  43: [
    {
      name: 'Sodium Pertechnetate',
      formula: 'NaTcO₄',
      description: 'Radioactive — most widely used radiopharmaceutical in medical imaging.',
      atoms: [
        { sym: 'Tc', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.0, y: 0.7, z: 0 },
        { sym: 'O', x: -1.0, y: 0.7, z: 0 },
        { sym: 'O', x: 0, y: -1.0, z: 0.5 },
        { sym: 'O', x: 0, y: -1.0, z: -0.5 },
      ],
      bonds: [
        { from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 },
        { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Ruthenium (44) ───
  44: [
    {
      name: 'Ruthenium Tetroxide',
      formula: 'RuO₄',
      description: 'Tetrahedral oxidizer used in organic synthesis.',
      atoms: [
        { sym: 'Ru', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 0.9, y: 0.9, z: 0 },
        { sym: 'O', x: -0.9, y: 0.9, z: 0 },
        { sym: 'O', x: 0, y: -0.6, z: 1.0 },
        { sym: 'O', x: 0, y: -0.6, z: -1.0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 },
        { from: 0, to: 3, order: 2 }, { from: 0, to: 4, order: 2 },
      ],
    },
  ],

  // ─── Rhodium (45) ───
  45: [
    {
      name: 'Rhodium(III) Chloride',
      formula: 'RhCl₃',
      description: 'Catalyst precursor — rhodium is key in catalytic converters.',
      atoms: [
        { sym: 'Rh', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.4, y: 0.8, z: 0 },
        { sym: 'Cl', x: -1.4, y: 0.8, z: 0 },
        { sym: 'Cl', x: 0, y: -1.2, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
      ],
    },
  ],

  // ─── Palladium (46) ───
  46: [
    {
      name: 'Palladium(II) Chloride',
      formula: 'PdCl₂',
      description: 'Catalyst in cross-coupling reactions (Suzuki, Heck). Nobel Prize 2010.',
      atoms: [
        { sym: 'Cl', x: -1.5, y: 0, z: 0 },
        { sym: 'Pd', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.5, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
  ],

  // ─── Silver (47) ───
  47: [
    {
      name: 'Silver Nitrate',
      formula: 'AgNO₃',
      description: 'Photosensitive — basis of photography. Stains skin black.',
      atoms: [
        { sym: 'Ag', x: -1.8, y: 0, z: 0 },
        { sym: 'N', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 0.9, y: 0.7, z: 0 },
        { sym: 'O', x: -0.56, y: 1.0, z: 0 },
        { sym: 'O', x: -0.56, y: -1.0, z: 0 },
      ],
      bonds: [
        { from: 0, to: 4, order: 1 },
        { from: 1, to: 2, order: 2 }, { from: 1, to: 3, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Cadmium (48) ───
  48: [
    {
      name: 'Cadmium Sulfide',
      formula: 'CdS',
      description: 'Bright yellow pigment — "cadmium yellow." Also a semiconductor.',
      atoms: [
        { sym: 'Cd', x: -1.16, y: 0, z: 0 },
        { sym: 'S', x: 1.16, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }],
    },
  ],

  // ─── Indium (49) ───
  49: [
    {
      name: 'Indium Tin Oxide',
      formula: 'In₂O₃',
      description: 'Transparent conductor — in every touchscreen and LCD display.',
      atoms: [
        { sym: 'In', x: -1.0, y: 0.4, z: 0 },
        { sym: 'In', x: 1.0, y: 0.4, z: 0 },
        { sym: 'O', x: 0, y: -0.3, z: 0 },
        { sym: 'O', x: -1.3, y: -0.5, z: 0 },
        { sym: 'O', x: 1.3, y: -0.5, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
        { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Tin (50) ───
  50: [
    {
      name: 'Tin(IV) Chloride',
      formula: 'SnCl₄',
      description: 'Tetrahedral fuming liquid. Used in organic synthesis.',
      atoms: [
        { sym: 'Sn', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.0, y: 1.0, z: 0.5 },
        { sym: 'Cl', x: -1.0, y: -1.0, z: 0.5 },
        { sym: 'Cl', x: -1.0, y: 1.0, z: -0.5 },
        { sym: 'Cl', x: 1.0, y: -1.0, z: -0.5 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 },
        { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Antimony (51) ───
  51: [
    {
      name: 'Antimony Trioxide',
      formula: 'Sb₂O₃',
      description: 'Flame retardant additive used in plastics and textiles.',
      atoms: [
        { sym: 'Sb', x: -0.9, y: 0.4, z: 0 },
        { sym: 'Sb', x: 0.9, y: 0.4, z: 0 },
        { sym: 'O', x: 0, y: -0.4, z: 0 },
        { sym: 'O', x: -1.3, y: -0.5, z: 0 },
        { sym: 'O', x: 1.3, y: -0.5, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
        { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Tellurium (52) ───
  52: [
    {
      name: 'Hydrogen Telluride',
      formula: 'H₂Te',
      description: 'Toxic gas — tellurium compounds famously make your breath smell like garlic.',
      atoms: [
        { sym: 'Te', x: 0, y: 0, z: 0 },
        { sym: 'H', x: -1.0, y: 0.60, z: 0 },
        { sym: 'H', x: 1.0, y: 0.60, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }],
    },
  ],

  // ─── Iodine (53) ───
  53: [
    {
      name: 'Potassium Iodide',
      formula: 'KI',
      description: 'Added to table salt as an iodine supplement — prevents goiter.',
      atoms: [
        { sym: 'K', x: -1.5, y: 0, z: 0 },
        { sym: 'I', x: 1.5, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Xenon (54) ───
  54: [
    {
      name: 'Xenon Tetrafluoride',
      formula: 'XeF₄',
      description: 'Square planar — first noble gas compound (1962). Shook chemistry.',
      atoms: [
        { sym: 'Xe', x: 0, y: 0, z: 0 },
        { sym: 'F', x: 1.2, y: 1.2, z: 0 },
        { sym: 'F', x: -1.2, y: 1.2, z: 0 },
        { sym: 'F', x: -1.2, y: -1.2, z: 0 },
        { sym: 'F', x: 1.2, y: -1.2, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 },
        { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Cesium (55) ───
  55: [
    {
      name: 'Cesium Chloride',
      formula: 'CsCl',
      description: 'Iconic BCC crystal structure used in X-ray crystallography.',
      atoms: [
        { sym: 'Cs', x: -1.5, y: 0, z: 0 },
        { sym: 'Cl', x: 1.5, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Barium (56) ───
  56: [
    {
      name: 'Barium Sulfate',
      formula: 'BaSO₄',
      description: 'White and X-ray opaque — "barium swallow" in medical imaging.',
      atoms: [
        { sym: 'Ba', x: -2.0, y: 0, z: 0 },
        { sym: 'S', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 0.9, y: 0.9, z: 0 },
        { sym: 'O', x: -0.9, y: 0.9, z: 0 },
        { sym: 'O', x: 0, y: -1.0, z: 0.5 },
        { sym: 'O', x: 0, y: -1.0, z: -0.5 },
      ],
      bonds: [
        { from: 0, to: 3, order: 1 },
        { from: 1, to: 2, order: 2 }, { from: 1, to: 3, order: 1 },
        { from: 1, to: 4, order: 2 }, { from: 1, to: 5, order: 1 },
      ],
    },
  ],

  // ─── Period 6 transition metals → simplified common compounds ───

  // Lanthanides (57-71) — representative compounds
  57: [{ name: 'Lanthanum Oxide', formula: 'La₂O₃', description: 'Used in optical glass and catalysts.',
    atoms: [{ sym: 'La', x: -1, y: 0.4, z: 0 }, { sym: 'La', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  58: [{ name: 'Cerium(IV) Oxide', formula: 'CeO₂', description: 'Catalytic converter and glass polishing agent.',
    atoms: [{ sym: 'O', x: -1.1, y: 0, z: 0 }, { sym: 'Ce', x: 0, y: 0, z: 0 }, { sym: 'O', x: 1.1, y: 0, z: 0 }],
    bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }] }],

  59: [{ name: 'Praseodymium Oxide', formula: 'Pr₂O₃', description: 'Yellow-green ceramic pigment ("praseodymium yellow").',
    atoms: [{ sym: 'Pr', x: -1, y: 0.4, z: 0 }, { sym: 'Pr', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  60: [{ name: 'Neodymium Oxide', formula: 'Nd₂O₃', description: 'Source of neodymium for the world\'s strongest permanent magnets.',
    atoms: [{ sym: 'Nd', x: -1, y: 0.4, z: 0 }, { sym: 'Nd', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  61: [{ name: 'Promethium Chloride', formula: 'PmCl₃', description: 'Radioactive. Used in luminous paint for watches.',
    atoms: [{ sym: 'Pm', x: 0, y: 0, z: 0 }, { sym: 'Cl', x: 1.4, y: 0.8, z: 0 }, { sym: 'Cl', x: -1.4, y: 0.8, z: 0 }, { sym: 'Cl', x: 0, y: -1.2, z: 0 }],
    bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }] }],

  62: [{ name: 'Samarium Oxide', formula: 'Sm₂O₃', description: 'SmCo magnets are heat-resistant — used in missiles and satellites.',
    atoms: [{ sym: 'Sm', x: -1, y: 0.4, z: 0 }, { sym: 'Sm', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  63: [{ name: 'Europium Oxide', formula: 'Eu₂O₃', description: 'Red phosphor in TVs and euro banknote anti-counterfeiting.',
    atoms: [{ sym: 'Eu', x: -1, y: 0.4, z: 0 }, { sym: 'Eu', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  64: [{ name: 'Gadolinium Oxide', formula: 'Gd₂O₃', description: 'MRI contrast agent — paramagnetic. enhances medical imaging.',
    atoms: [{ sym: 'Gd', x: -1, y: 0.4, z: 0 }, { sym: 'Gd', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  65: [{ name: 'Terbium Oxide', formula: 'Tb₂O₃', description: 'Green phosphor in LED screens and fluorescent lamps.',
    atoms: [{ sym: 'Tb', x: -1, y: 0.4, z: 0 }, { sym: 'Tb', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  66: [{ name: 'Dysprosium Oxide', formula: 'Dy₂O₃', description: 'Added to NdFeB magnets to increase heat resistance.',
    atoms: [{ sym: 'Dy', x: -1, y: 0.4, z: 0 }, { sym: 'Dy', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  67: [{ name: 'Holmium Oxide', formula: 'Ho₂O₃', description: 'Has the highest magnetic moment — used in magnetic flux concentrators.',
    atoms: [{ sym: 'Ho', x: -1, y: 0.4, z: 0 }, { sym: 'Ho', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  68: [{ name: 'Erbium Oxide', formula: 'Er₂O₃', description: 'Pink — erbium-doped fiber amplifiers power the internet.',
    atoms: [{ sym: 'Er', x: -1, y: 0.4, z: 0 }, { sym: 'Er', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  69: [{ name: 'Thulium Oxide', formula: 'Tm₂O₃', description: 'Used in portable X-ray devices. Rarest stable lanthanide.',
    atoms: [{ sym: 'Tm', x: -1, y: 0.4, z: 0 }, { sym: 'Tm', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  70: [{ name: 'Ytterbium Oxide', formula: 'Yb₂O₃', description: 'Used in fiber lasers and stainless steel improvement.',
    atoms: [{ sym: 'Yb', x: -1, y: 0.4, z: 0 }, { sym: 'Yb', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  71: [{ name: 'Lutetium Oxide', formula: 'Lu₂O₃', description: 'Used in PET scan detectors. Most expensive lanthanide.',
    atoms: [{ sym: 'Lu', x: -1, y: 0.4, z: 0 }, { sym: 'Lu', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  // ─── Period 6 Transition Metals (72-80) ───
  72: [{ name: 'Hafnium Dioxide', formula: 'HfO₂', description: 'High-k dielectric in modern CPUs — replaced silicon dioxide at 45nm.',
    atoms: [{ sym: 'O', x: -1.1, y: 0, z: 0 }, { sym: 'Hf', x: 0, y: 0, z: 0 }, { sym: 'O', x: 1.1, y: 0, z: 0 }],
    bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }] }],

  73: [{ name: 'Tantalum Pentoxide', formula: 'Ta₂O₅', description: 'Dielectric in capacitors — found in every smartphone.',
    atoms: [{ sym: 'Ta', x: -0.8, y: 0, z: 0 }, { sym: 'Ta', x: 0.8, y: 0, z: 0 }, { sym: 'O', x: 0, y: 0.7, z: 0 }, { sym: 'O', x: -1.4, y: 0.6, z: 0 }, { sym: 'O', x: 1.4, y: 0.6, z: 0 }, { sym: 'O', x: -0.8, y: -0.8, z: 0 }, { sym: 'O', x: 0.8, y: -0.8, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 2 }, { from: 0, to: 5, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 2 }, { from: 1, to: 6, order: 1 }] }],

  74: [{ name: 'Tungsten Carbide', formula: 'WC', description: 'Nearly as hard as diamond — drill bits, armor-piercing rounds.',
    atoms: [{ sym: 'W', x: -0.8, y: 0, z: 0 }, { sym: 'C', x: 0.8, y: 0, z: 0 }],
    bonds: [{ from: 0, to: 1, order: 3 }] }],

  75: [{ name: 'Rhenium Heptoxide', formula: 'Re₂O₇', description: 'Rarest naturally occurring element. Used in jet engine superalloys.',
    atoms: [{ sym: 'Re', x: -0.8, y: 0, z: 0 }, { sym: 'Re', x: 0.8, y: 0, z: 0 }, { sym: 'O', x: 0, y: 0, z: 0.4 }, { sym: 'O', x: -1.4, y: 0.7, z: 0 }, { sym: 'O', x: 1.4, y: 0.7, z: 0 }, { sym: 'O', x: -1.0, y: -0.8, z: 0 }, { sym: 'O', x: 1.0, y: -0.8, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 0, to: 3, order: 2 }, { from: 0, to: 5, order: 2 }, { from: 1, to: 4, order: 2 }, { from: 1, to: 6, order: 2 }] }],

  76: [{ name: 'Osmium Tetroxide', formula: 'OsO₄', description: 'Dense, toxic — crucial stain in electron microscopy.',
    atoms: [{ sym: 'Os', x: 0, y: 0, z: 0 }, { sym: 'O', x: 0.9, y: 0.9, z: 0 }, { sym: 'O', x: -0.9, y: 0.9, z: 0 }, { sym: 'O', x: 0, y: -0.6, z: 1.0 }, { sym: 'O', x: 0, y: -0.6, z: -1.0 }],
    bonds: [{ from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }, { from: 0, to: 3, order: 2 }, { from: 0, to: 4, order: 2 }] }],

  77: [{ name: 'Iridium(IV) Oxide', formula: 'IrO₂', description: 'Electrocatalyst for water splitting — key to green hydrogen.',
    atoms: [{ sym: 'O', x: -1.1, y: 0, z: 0 }, { sym: 'Ir', x: 0, y: 0, z: 0 }, { sym: 'O', x: 1.1, y: 0, z: 0 }],
    bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }] }],

  78: [{ name: 'Cisplatin', formula: 'PtCl₂(NH₃)₂', description: 'Groundbreaking anti-cancer drug. Square planar geometry.',
    atoms: [{ sym: 'Pt', x: 0, y: 0, z: 0 }, { sym: 'Cl', x: -1.4, y: 1.0, z: 0 }, { sym: 'Cl', x: 1.4, y: 1.0, z: 0 }, { sym: 'N', x: -1.2, y: -1.0, z: 0 }, { sym: 'N', x: 1.2, y: -1.0, z: 0 }, { sym: 'H', x: -1.8, y: -1.5, z: 0.4 }, { sym: 'H', x: -0.6, y: -1.6, z: 0.3 }, { sym: 'H', x: -1.5, y: -1.1, z: -0.6 }, { sym: 'H', x: 1.8, y: -1.5, z: 0.4 }, { sym: 'H', x: 0.6, y: -1.6, z: 0.3 }, { sym: 'H', x: 1.5, y: -1.1, z: -0.6 }],
    bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 }, { from: 3, to: 5, order: 1 }, { from: 3, to: 6, order: 1 }, { from: 3, to: 7, order: 1 }, { from: 4, to: 8, order: 1 }, { from: 4, to: 9, order: 1 }, { from: 4, to: 10, order: 1 }] }],

  // ─── Gold (79) ───
  79: [
    {
      name: 'Gold(III) Chloride',
      formula: 'AuCl₃',
      description: 'Red solid — catalyst in organic chemistry. Gold standard, literally.',
      atoms: [
        { sym: 'Au', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.4, y: 0.8, z: 0 },
        { sym: 'Cl', x: -1.4, y: 0.8, z: 0 },
        { sym: 'Cl', x: 0, y: -1.2, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
      ],
    },
  ],

  // ─── Mercury (80) ───
  80: [
    {
      name: 'Mercury(II) Chloride',
      formula: 'HgCl₂',
      description: 'Linear molecule. "Corrosive sublimate" — historically used as a disinfectant.',
      atoms: [
        { sym: 'Cl', x: -1.6, y: 0, z: 0 },
        { sym: 'Hg', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.6, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
  ],

  // ─── Thallium (81) ───
  81: [{ name: 'Thallium(I) Sulfate', formula: 'Tl₂SO₄', description: 'Infamous poison — colorless, odorless, tasteless. Now banned.',
    atoms: [{ sym: 'Tl', x: -2.2, y: 0.5, z: 0 }, { sym: 'Tl', x: 2.2, y: 0.5, z: 0 }, { sym: 'S', x: 0, y: 0, z: 0 }, { sym: 'O', x: 0.9, y: 0.8, z: 0 }, { sym: 'O', x: -0.9, y: 0.8, z: 0 }, { sym: 'O', x: 0, y: -0.9, z: 0.5 }, { sym: 'O', x: 0, y: -0.9, z: -0.5 }],
    bonds: [{ from: 0, to: 4, order: 1 }, { from: 1, to: 3, order: 1 }, { from: 2, to: 3, order: 1 }, { from: 2, to: 4, order: 1 }, { from: 2, to: 5, order: 2 }, { from: 2, to: 6, order: 2 }] }],

  // ─── Lead (82) ───
  82: [
    {
      name: 'Lead(II) Oxide',
      formula: 'PbO',
      description: '"Litharge" — used in lead-acid batteries and crystal glass.',
      atoms: [
        { sym: 'Pb', x: -0.95, y: 0, z: 0 },
        { sym: 'O', x: 0.95, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }],
    },
  ],

  // ─── Bismuth (83) ───
  83: [
    {
      name: 'Bismuth Subsalicylate',
      formula: 'BiC₇H₅O₄',
      description: 'Pepto-Bismol! The pink stuff. Bismuth is the heaviest "safe" element.',
      atoms: [
        { sym: 'Bi', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.2, y: 0.6, z: 0 },
        { sym: 'O', x: -1.2, y: 0.6, z: 0 },
        { sym: 'C', x: 1.2, y: -0.6, z: 0 },
        { sym: 'O', x: -1.2, y: -0.6, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 },
        { from: 0, to: 4, order: 1 }, { from: 1, to: 3, order: 1 },
      ],
    },
  ],

  // ─── Polonium (84) – Astatine (85) – Radon (86) ───
  84: [{ name: 'Polonium Dioxide', formula: 'PoO₂', description: 'Intensely radioactive. Used in anti-static brushes and (infamously) assassination.',
    atoms: [{ sym: 'O', x: -1.1, y: 0, z: 0 }, { sym: 'Po', x: 0, y: 0, z: 0 }, { sym: 'O', x: 1.1, y: 0, z: 0 }],
    bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }] }],

  85: [{ name: 'Astatine (unstable)', formula: 'At', description: 'Rarest naturally occurring element. All isotopes are radioactive.',
    atoms: [{ sym: 'At', x: 0, y: 0, z: 0 }], bonds: [] }],

  86: [{ name: 'Radon (noble/radioactive)', formula: 'Rn', description: 'Radioactive noble gas — second leading cause of lung cancer.',
    atoms: [{ sym: 'Rn', x: 0, y: 0, z: 0 }], bonds: [] }],

  // ─── Period 7 (87-118) — Actinides + Superheavy ───
  87: [{ name: 'Francium (unstable)', formula: 'Fr', description: 'Most unstable first 101 elements. Half-life 22 minutes (Fr-223).',
    atoms: [{ sym: 'Fr', x: 0, y: 0, z: 0 }], bonds: [] }],

  88: [{ name: 'Radium Chloride', formula: 'RaCl₂', description: 'Marie Curie isolated this — once used in glow-in-the-dark paint.',
    atoms: [{ sym: 'Cl', x: -1.5, y: 0, z: 0 }, { sym: 'Ra', x: 0, y: 0, z: 0 }, { sym: 'Cl', x: 1.5, y: 0, z: 0 }],
    bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }] }],

  89: [{ name: 'Actinium Oxide', formula: 'Ac₂O₃', description: 'Intensely radioactive — glows blue in the dark.',
    atoms: [{ sym: 'Ac', x: -1, y: 0.4, z: 0 }, { sym: 'Ac', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  90: [{ name: 'Thorium Dioxide', formula: 'ThO₂', description: 'Highest melting point of any oxide (3,300 °C). Potential nuclear fuel.',
    atoms: [{ sym: 'O', x: -1.1, y: 0, z: 0 }, { sym: 'Th', x: 0, y: 0, z: 0 }, { sym: 'O', x: 1.1, y: 0, z: 0 }],
    bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }] }],

  91: [{ name: 'Protactinium(V) Oxide', formula: 'Pa₂O₅', description: 'Extremely rare and radioactive. One of the rarest natural elements.',
    atoms: [{ sym: 'Pa', x: -0.8, y: 0, z: 0 }, { sym: 'Pa', x: 0.8, y: 0, z: 0 }, { sym: 'O', x: 0, y: 0.7, z: 0 }, { sym: 'O', x: -1.4, y: 0.6, z: 0 }, { sym: 'O', x: 1.4, y: 0.6, z: 0 }, { sym: 'O', x: -0.8, y: -0.8, z: 0 }, { sym: 'O', x: 0.8, y: -0.8, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 2 }, { from: 0, to: 5, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 2 }, { from: 1, to: 6, order: 1 }] }],

  92: [{ name: 'Uranium Hexafluoride', formula: 'UF₆', description: 'Octahedral gas used in uranium enrichment — gaseous diffusion.',
    atoms: [{ sym: 'U', x: 0, y: 0, z: 0 }, { sym: 'F', x: 1.2, y: 0, z: 0 }, { sym: 'F', x: -1.2, y: 0, z: 0 }, { sym: 'F', x: 0, y: 1.2, z: 0 }, { sym: 'F', x: 0, y: -1.2, z: 0 }, { sym: 'F', x: 0, y: 0, z: 1.2 }, { sym: 'F', x: 0, y: 0, z: -1.2 }],
    bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 }, { from: 0, to: 5, order: 1 }, { from: 0, to: 6, order: 1 }] }],

  93: [{ name: 'Neptunium Dioxide', formula: 'NpO₂', description: 'By-product of nuclear reactors. Named after planet Neptune.',
    atoms: [{ sym: 'O', x: -1.1, y: 0, z: 0 }, { sym: 'Np', x: 0, y: 0, z: 0 }, { sym: 'O', x: 1.1, y: 0, z: 0 }],
    bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }] }],

  94: [{ name: 'Plutonium Dioxide', formula: 'PuO₂', description: 'Powers deep-space probes (RTGs). Famously used in nuclear weapons.',
    atoms: [{ sym: 'O', x: -1.1, y: 0, z: 0 }, { sym: 'Pu', x: 0, y: 0, z: 0 }, { sym: 'O', x: 1.1, y: 0, z: 0 }],
    bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }] }],

  // Elements 95-118: mostly synthetic, short-lived
  95: [{ name: 'Americium Dioxide', formula: 'AmO₂', description: 'In every household smoke detector. Named after the Americas.',
    atoms: [{ sym: 'O', x: -1.1, y: 0, z: 0 }, { sym: 'Am', x: 0, y: 0, z: 0 }, { sym: 'O', x: 1.1, y: 0, z: 0 }],
    bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }] }],

  96: [{ name: 'Curium Oxide', formula: 'Cm₂O₃', description: 'Named after Marie & Pierre Curie. Used in alpha particle X-ray spectrometers on Mars rovers.',
    atoms: [{ sym: 'Cm', x: -1, y: 0.4, z: 0 }, { sym: 'Cm', x: 1, y: 0.4, z: 0 }, { sym: 'O', x: 0, y: -0.4, z: 0 }, { sym: 'O', x: -1.3, y: -0.5, z: 0 }, { sym: 'O', x: 1.3, y: -0.5, z: 0 }],
    bonds: [{ from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 1, to: 4, order: 1 }] }],

  97: [{ name: 'Berkelium (synthetic)', formula: 'Bk', description: 'Named after Berkeley, CA. Only micrograms ever produced.',
    atoms: [{ sym: 'Bk', x: 0, y: 0, z: 0 }], bonds: [] }],
  98: [{ name: 'Californium (synthetic)', formula: 'Cf', description: 'Neutron source for nuclear reactors and cancer treatment. 1g costs ~$27M.',
    atoms: [{ sym: 'Cf', x: 0, y: 0, z: 0 }], bonds: [] }],
  99: [{ name: 'Einsteinium (synthetic)', formula: 'Es', description: 'First produced in debris of first hydrogen bomb test (1952).',
    atoms: [{ sym: 'Es', x: 0, y: 0, z: 0 }], bonds: [] }],
  100: [{ name: 'Fermium (synthetic)', formula: 'Fm', description: 'Also discovered in H-bomb debris. Named after Enrico Fermi.',
    atoms: [{ sym: 'Fm', x: 0, y: 0, z: 0 }], bonds: [] }],
  101: [{ name: 'Mendelevium (synthetic)', formula: 'Md', description: 'Named after Mendeleev. Made atom-by-atom.',
    atoms: [{ sym: 'Md', x: 0, y: 0, z: 0 }], bonds: [] }],
  102: [{ name: 'Nobelium (synthetic)', formula: 'No', description: 'Named after Alfred Nobel. Half-life of most stable isotope: 58 min.',
    atoms: [{ sym: 'No', x: 0, y: 0, z: 0 }], bonds: [] }],
  103: [{ name: 'Lawrencium (synthetic)', formula: 'Lr', description: 'Last actinide. Named after E.O. Lawrence, inventor of the cyclotron.',
    atoms: [{ sym: 'Lr', x: 0, y: 0, z: 0 }], bonds: [] }],
  104: [{ name: 'Rutherfordium (synthetic)', formula: 'Rf', description: 'First transactinide. Predicted to behave like hafnium.',
    atoms: [{ sym: 'Rf', x: 0, y: 0, z: 0 }], bonds: [] }],
  105: [{ name: 'Dubnium (synthetic)', formula: 'Db', description: 'Named after Dubna, Russia. Subject of Cold War naming disputes.',
    atoms: [{ sym: 'Db', x: 0, y: 0, z: 0 }], bonds: [] }],
  106: [{ name: 'Seaborgium (synthetic)', formula: 'Sg', description: 'Named after Glenn Seaborg — first living person with an element named after them.',
    atoms: [{ sym: 'Sg', x: 0, y: 0, z: 0 }], bonds: [] }],
  107: [{ name: 'Bohrium (synthetic)', formula: 'Bh', description: 'Named after Niels Bohr. Only atoms have been produced.',
    atoms: [{ sym: 'Bh', x: 0, y: 0, z: 0 }], bonds: [] }],
  108: [{ name: 'Hassium (synthetic)', formula: 'Hs', description: 'Named after Hesse, Germany. Predicted to be the densest element.',
    atoms: [{ sym: 'Hs', x: 0, y: 0, z: 0 }], bonds: [] }],
  109: [{ name: 'Meitnerium (synthetic)', formula: 'Mt', description: 'Named after Lise Meitner, who co-discovered nuclear fission.',
    atoms: [{ sym: 'Mt', x: 0, y: 0, z: 0 }], bonds: [] }],
  110: [{ name: 'Darmstadtium (synthetic)', formula: 'Ds', description: 'Named after Darmstadt, Germany. Half-life ~11 seconds.',
    atoms: [{ sym: 'Ds', x: 0, y: 0, z: 0 }], bonds: [] }],
  111: [{ name: 'Roentgenium (synthetic)', formula: 'Rg', description: 'Named after Wilhelm Röntgen, discoverer of X-rays.',
    atoms: [{ sym: 'Rg', x: 0, y: 0, z: 0 }], bonds: [] }],
  112: [{ name: 'Copernicium (synthetic)', formula: 'Cn', description: 'Named after Copernicus. Predicted to be a liquid or gas at room temp.',
    atoms: [{ sym: 'Cn', x: 0, y: 0, z: 0 }], bonds: [] }],
  113: [{ name: 'Nihonium (synthetic)', formula: 'Nh', description: 'First element discovered in Asia (Japan). "Nihon" = Japan.',
    atoms: [{ sym: 'Nh', x: 0, y: 0, z: 0 }], bonds: [] }],
  114: [{ name: 'Flerovium (synthetic)', formula: 'Fl', description: 'Named after Georgy Flyorov. Predicted to be unusually volatile for its group.',
    atoms: [{ sym: 'Fl', x: 0, y: 0, z: 0 }], bonds: [] }],
  115: [{ name: 'Moscovium (synthetic)', formula: 'Mc', description: 'Named after Moscow Oblast. Half-life ~0.65 seconds.',
    atoms: [{ sym: 'Mc', x: 0, y: 0, z: 0 }], bonds: [] }],
  116: [{ name: 'Livermorium (synthetic)', formula: 'Lv', description: 'Named after Lawrence Livermore National Lab.',
    atoms: [{ sym: 'Lv', x: 0, y: 0, z: 0 }], bonds: [] }],
  117: [{ name: 'Tennessine (synthetic)', formula: 'Ts', description: 'Named after Tennessee. Heaviest known halogen.',
    atoms: [{ sym: 'Ts', x: 0, y: 0, z: 0 }], bonds: [] }],
  118: [{ name: 'Oganesson (synthetic)', formula: 'Og', description: 'Heaviest known element. Named after Yuri Oganessian. May be a solid noble gas.',
    atoms: [{ sym: 'Og', x: 0, y: 0, z: 0 }], bonds: [] }],
};
