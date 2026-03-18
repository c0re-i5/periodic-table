/**
 * COMPOUNDS-EXTRA.js — Additional molecules/compounds for elements
 * Merged into ELEMENT_COMPOUNDS at load time
 * Adds 2-4 extra compounds per element for the most important elements
 */

const EXTRA_COMPOUNDS = {
  // ─── Hydrogen (1) — add H₂O₂, HCl ───
  1: [
    {
      name: 'Hydrogen Peroxide',
      formula: 'H₂O₂',
      description: 'Antiseptic and rocket propellant. The O–O single bond is relatively weak.',
      atoms: [
        { sym: 'O', x: -0.37, y: 0.33, z: 0.20 },
        { sym: 'O', x: 0.37, y: -0.33, z: 0.20 },
        { sym: 'H', x: -0.85, y: -0.28, z: -0.30 },
        { sym: 'H', x: 0.85, y: 0.28, z: -0.30 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 1, to: 3, order: 1 },
      ],
    },
    {
      name: 'Hydrochloric Acid',
      formula: 'HCl',
      description: 'Strong acid found in stomach acid (gastric juice). pH ≈ 1.',
      atoms: [
        { sym: 'H', x: -0.64, y: 0, z: 0 },
        { sym: 'Cl', x: 0.64, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Lithium (3) — add Li₂O, LiOH ───
  3: [
    {
      name: 'Lithium Oxide',
      formula: 'Li₂O',
      description: 'White solid used in ceramics. Strong base when dissolved.',
      atoms: [
        { sym: 'Li', x: -1.0, y: 0.5, z: 0 },
        { sym: 'O', x: 0, y: 0, z: 0 },
        { sym: 'Li', x: 1.0, y: 0.5, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
    {
      name: 'Lithium Hydroxide',
      formula: 'LiOH',
      description: 'Used in CO₂ scrubbers on spacecraft and submarines.',
      atoms: [
        { sym: 'Li', x: -1.2, y: 0, z: 0 },
        { sym: 'O', x: 0, y: 0, z: 0 },
        { sym: 'H', x: 0.48, y: 0.48, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
  ],

  // ─── Beryllium (4) — add BeO ───
  4: [
    {
      name: 'Beryllium Oxide',
      formula: 'BeO',
      description: 'Excellent thermal conductor. Used in high-power electronics.',
      atoms: [
        { sym: 'Be', x: -0.65, y: 0, z: 0 },
        { sym: 'O', x: 0.65, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }],
    },
  ],

  // ─── Boron (5) — add B₂H₆ ───
  5: [
    {
      name: 'Diborane',
      formula: 'B₂H₆',
      description: 'Electron-deficient — features 3-center-2-electron bonds, a bonding oddity.',
      atoms: [
        { sym: 'B', x: -0.88, y: 0, z: 0 },
        { sym: 'B', x: 0.88, y: 0, z: 0 },
        { sym: 'H', x: -1.6, y: 0.8, z: 0 },
        { sym: 'H', x: -1.6, y: -0.8, z: 0 },
        { sym: 'H', x: 0, y: 0.5, z: 0 },
        { sym: 'H', x: 0, y: -0.5, z: 0 },
        { sym: 'H', x: 1.6, y: 0.8, z: 0 },
        { sym: 'H', x: 1.6, y: -0.8, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
        { from: 0, to: 4, order: 0.5 }, { from: 0, to: 5, order: 0.5 },
        { from: 1, to: 4, order: 0.5 }, { from: 1, to: 5, order: 0.5 },
        { from: 1, to: 6, order: 1 }, { from: 1, to: 7, order: 1 },
      ],
    },
  ],

  // ─── Carbon (6) — add CO, C₂H₄, C₂H₂ ───
  6: [
    {
      name: 'Carbon Monoxide',
      formula: 'CO',
      description: 'Silent killer — colorless, odorless poison. Triple bond like N₂.',
      atoms: [
        { sym: 'C', x: -0.56, y: 0, z: 0 },
        { sym: 'O', x: 0.56, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 3 }],
    },
    {
      name: 'Ethylene',
      formula: 'C₂H₄',
      description: 'Simplest alkene. Fruit ripening hormone. Most produced organic compound.',
      atoms: [
        { sym: 'C', x: -0.67, y: 0, z: 0 },
        { sym: 'C', x: 0.67, y: 0, z: 0 },
        { sym: 'H', x: -1.24, y: 0.93, z: 0 },
        { sym: 'H', x: -1.24, y: -0.93, z: 0 },
        { sym: 'H', x: 1.24, y: 0.93, z: 0 },
        { sym: 'H', x: 1.24, y: -0.93, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 2 },
        { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
        { from: 1, to: 4, order: 1 }, { from: 1, to: 5, order: 1 },
      ],
    },
    {
      name: 'Acetylene',
      formula: 'C₂H₂',
      description: 'Triple bond between carbons — used in welding torches (3300 °C flame).',
      atoms: [
        { sym: 'C', x: -0.60, y: 0, z: 0 },
        { sym: 'C', x: 0.60, y: 0, z: 0 },
        { sym: 'H', x: -1.66, y: 0, z: 0 },
        { sym: 'H', x: 1.66, y: 0, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 3 }, { from: 0, to: 2, order: 1 }, { from: 1, to: 3, order: 1 },
      ],
    },
    {
      name: 'Ethanol',
      formula: 'C₂H₅OH',
      description: 'Drinking alcohol. Also a biofuel and universal solvent.',
      atoms: [
        { sym: 'C', x: -0.76, y: 0, z: 0 },
        { sym: 'C', x: 0.76, y: 0, z: 0 },
        { sym: 'O', x: 1.52, y: 1.0, z: 0 },
        { sym: 'H', x: -1.20, y: 0.63, z: 0.63 },
        { sym: 'H', x: -1.20, y: -0.63, z: 0.63 },
        { sym: 'H', x: -1.20, y: 0, z: -0.89 },
        { sym: 'H', x: 0.76, y: -0.63, z: 0.63 },
        { sym: 'H', x: 0.76, y: -0.63, z: -0.63 },
        { sym: 'H', x: 2.3, y: 0.7, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 },
        { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 }, { from: 0, to: 5, order: 1 },
        { from: 1, to: 6, order: 1 }, { from: 1, to: 7, order: 1 },
        { from: 2, to: 8, order: 1 },
      ],
    },
  ],

  // ─── Nitrogen (7) — add NO₂, N₂O, HNO₃ ───
  7: [
    {
      name: 'Nitrogen Dioxide',
      formula: 'NO₂',
      description: 'Brown toxic gas — gives smog its color. Bent geometry with unpaired electron.',
      atoms: [
        { sym: 'N', x: 0, y: 0, z: 0 },
        { sym: 'O', x: -1.0, y: 0.65, z: 0 },
        { sym: 'O', x: 1.0, y: 0.65, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1.5 }, { from: 0, to: 2, order: 1.5 }],
    },
    {
      name: 'Nitrous Oxide',
      formula: 'N₂O',
      description: '"Laughing gas" — anesthetic and whipped cream propellant. Also a greenhouse gas.',
      atoms: [
        { sym: 'N', x: -1.13, y: 0, z: 0 },
        { sym: 'N', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.19, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }],
    },
    {
      name: 'Nitric Acid',
      formula: 'HNO₃',
      description: 'Strong acid and powerful oxidizer. Used in fertilizer and explosives production.',
      atoms: [
        { sym: 'N', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.05, y: 0.65, z: 0 },
        { sym: 'O', x: -1.05, y: 0.65, z: 0 },
        { sym: 'O', x: 0, y: -1.0, z: 0 },
        { sym: 'H', x: 0.7, y: -1.5, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 1.5 },
        { from: 0, to: 3, order: 1 }, { from: 3, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Oxygen (8) — add H₂O₂, O₂ ───
  8: [
    {
      name: 'Oxygen Gas',
      formula: 'O₂',
      description: 'Double bond, paramagnetic. 21% of Earth\'s atmosphere.',
      atoms: [
        { sym: 'O', x: -0.60, y: 0, z: 0 },
        { sym: 'O', x: 0.60, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }],
    },
    {
      name: 'Hydrogen Peroxide',
      formula: 'H₂O₂',
      description: 'Weak O–O bond makes it a powerful oxidizer. Used as bleach and disinfectant.',
      atoms: [
        { sym: 'O', x: -0.37, y: 0.33, z: 0.20 },
        { sym: 'O', x: 0.37, y: -0.33, z: 0.20 },
        { sym: 'H', x: -0.85, y: -0.28, z: -0.30 },
        { sym: 'H', x: 0.85, y: 0.28, z: -0.30 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 1, to: 3, order: 1 },
      ],
    },
  ],

  // ─── Fluorine (9) — add F₂ ───
  9: [
    {
      name: 'Fluorine Gas',
      formula: 'F₂',
      description: 'Most reactive element — attacks glass. Pale yellow, extremely dangerous.',
      atoms: [
        { sym: 'F', x: -0.71, y: 0, z: 0 },
        { sym: 'F', x: 0.71, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
    {
      name: 'Sodium Fluoride',
      formula: 'NaF',
      description: 'In toothpaste — strengthens tooth enamel against decay.',
      atoms: [
        { sym: 'Na', x: -0.96, y: 0, z: 0 },
        { sym: 'F', x: 0.96, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Sodium (11) — add NaOH, Na₂CO₃ ───
  11: [
    {
      name: 'Sodium Hydroxide',
      formula: 'NaOH',
      description: 'Lye/caustic soda — used in soap, drain cleaners, and paper manufacturing.',
      atoms: [
        { sym: 'Na', x: -1.4, y: 0, z: 0 },
        { sym: 'O', x: 0, y: 0, z: 0 },
        { sym: 'H', x: 0.48, y: 0.48, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
    {
      name: 'Sodium Bicarbonate',
      formula: 'NaHCO₃',
      description: 'Baking soda — releases CO₂ when heated. Also an antacid.',
      atoms: [
        { sym: 'Na', x: -2.4, y: 0, z: 0 },
        { sym: 'C', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.0, y: 0.7, z: 0 },
        { sym: 'O', x: -0.6, y: 1.0, z: 0 },
        { sym: 'O', x: -0.6, y: -1.0, z: 0 },
        { sym: 'H', x: -1.2, y: -1.3, z: 0 },
      ],
      bonds: [
        { from: 0, to: 3, order: 1 },
        { from: 1, to: 2, order: 2 }, { from: 1, to: 3, order: 1 }, { from: 1, to: 4, order: 1 },
        { from: 4, to: 5, order: 1 },
      ],
    },
  ],

  // ─── Magnesium (12) — add MgCl₂, Mg(OH)₂ ───
  12: [
    {
      name: 'Magnesium Chloride',
      formula: 'MgCl₂',
      description: 'De-icing salt. Also used to make tofu (as a coagulant).',
      atoms: [
        { sym: 'Cl', x: -1.8, y: 0, z: 0 },
        { sym: 'Mg', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.8, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
    {
      name: 'Magnesium Hydroxide',
      formula: 'Mg(OH)₂',
      description: 'Milk of Magnesia — famous antacid and laxative.',
      atoms: [
        { sym: 'Mg', x: 0, y: 0, z: 0 },
        { sym: 'O', x: -1.0, y: 0.7, z: 0 },
        { sym: 'O', x: 1.0, y: 0.7, z: 0 },
        { sym: 'H', x: -1.5, y: 1.2, z: 0 },
        { sym: 'H', x: 1.5, y: 1.2, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 },
        { from: 1, to: 3, order: 1 }, { from: 2, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Aluminum (13) — add AlCl₃ ───
  13: [
    {
      name: 'Aluminum Chloride',
      formula: 'AlCl₃',
      description: 'Lewis acid catalyst — key in Friedel-Crafts reactions.',
      atoms: [
        { sym: 'Al', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.4, y: 0.8, z: 0 },
        { sym: 'Cl', x: -1.4, y: 0.8, z: 0 },
        { sym: 'Cl', x: 0, y: -1.2, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
      ],
    },
  ],

  // ─── Silicon (14) — add SiH₄ ───
  14: [
    {
      name: 'Silane',
      formula: 'SiH₄',
      description: 'Tetrahedral like methane. Pyrophoric — burns spontaneously in air.',
      atoms: [
        { sym: 'Si', x: 0, y: 0, z: 0 },
        { sym: 'H', x: 0.85, y: 0.85, z: 0.85 },
        { sym: 'H', x: -0.85, y: -0.85, z: 0.85 },
        { sym: 'H', x: -0.85, y: 0.85, z: -0.85 },
        { sym: 'H', x: 0.85, y: -0.85, z: -0.85 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 },
        { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Phosphorus (15) — add PCl₃, PCl₅ ───
  15: [
    {
      name: 'Phosphorus Trichloride',
      formula: 'PCl₃',
      description: 'Trigonal pyramidal — key intermediate in pesticide and flame retardant synthesis.',
      atoms: [
        { sym: 'P', x: 0, y: 0, z: 0.16 },
        { sym: 'Cl', x: 0, y: 1.40, z: -0.48 },
        { sym: 'Cl', x: 1.21, y: -0.70, z: -0.48 },
        { sym: 'Cl', x: -1.21, y: -0.70, z: -0.48 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
      ],
    },
    {
      name: 'Phosphorus Pentachloride',
      formula: 'PCl₅',
      description: 'Trigonal bipyramidal — phosphorus exceeds the octet rule using d orbitals.',
      atoms: [
        { sym: 'P', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.3, y: 0, z: 0 },
        { sym: 'Cl', x: -0.65, y: 1.13, z: 0 },
        { sym: 'Cl', x: -0.65, y: -1.13, z: 0 },
        { sym: 'Cl', x: 0, y: 0, z: 1.3 },
        { sym: 'Cl', x: 0, y: 0, z: -1.3 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
        { from: 0, to: 4, order: 1 }, { from: 0, to: 5, order: 1 },
      ],
    },
  ],

  // ─── Sulfur (16) — add SO₂, H₂S, SO₃ ───
  16: [
    {
      name: 'Sulfur Dioxide',
      formula: 'SO₂',
      description: 'Bent molecule from volcanic eruptions. Causes acid rain.',
      atoms: [
        { sym: 'S', x: 0, y: 0, z: 0 },
        { sym: 'O', x: -1.05, y: 0.6, z: 0 },
        { sym: 'O', x: 1.05, y: 0.6, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }],
    },
    {
      name: 'Hydrogen Sulfide',
      formula: 'H₂S',
      description: 'Rotten egg smell. Toxic — deadlier than CO at similar concentrations.',
      atoms: [
        { sym: 'S', x: 0, y: 0, z: 0 },
        { sym: 'H', x: -0.96, y: 0.58, z: 0 },
        { sym: 'H', x: 0.96, y: 0.58, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }],
    },
    {
      name: 'Sulfur Trioxide',
      formula: 'SO₃',
      description: 'Trigonal planar. Intermediate in sulfuric acid production (contact process).',
      atoms: [
        { sym: 'S', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.20, y: 0, z: 0 },
        { sym: 'O', x: -0.60, y: 1.04, z: 0 },
        { sym: 'O', x: -0.60, y: -1.04, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }, { from: 0, to: 3, order: 2 },
      ],
    },
  ],

  // ─── Chlorine (17) — add Cl₂ ───
  17: [
    {
      name: 'Chlorine Gas',
      formula: 'Cl₂',
      description: 'Yellow-green toxic gas. Used in water purification and PVC production.',
      atoms: [
        { sym: 'Cl', x: -0.99, y: 0, z: 0 },
        { sym: 'Cl', x: 0.99, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Potassium (19) — add KCl ───
  19: [
    {
      name: 'Potassium Chloride',
      formula: 'KCl',
      description: 'Salt substitute (low-sodium). Also used in fertilizers and medicine.',
      atoms: [
        { sym: 'K', x: -1.33, y: 0, z: 0 },
        { sym: 'Cl', x: 1.33, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Calcium (20) — add CaO, Ca(OH)₂ ───
  20: [
    {
      name: 'Calcium Oxide',
      formula: 'CaO',
      description: 'Quicklime — exothermic reaction with water. Used in cement production.',
      atoms: [
        { sym: 'Ca', x: -0.96, y: 0, z: 0 },
        { sym: 'O', x: 0.96, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }],
    },
    {
      name: 'Calcium Hydroxide',
      formula: 'Ca(OH)₂',
      description: 'Slaked lime — used in mortar, plaster, and water treatment.',
      atoms: [
        { sym: 'Ca', x: 0, y: 0, z: 0 },
        { sym: 'O', x: -1.0, y: 0.8, z: 0 },
        { sym: 'O', x: 1.0, y: 0.8, z: 0 },
        { sym: 'H', x: -1.5, y: 1.3, z: 0 },
        { sym: 'H', x: 1.5, y: 1.3, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 },
        { from: 1, to: 3, order: 1 }, { from: 2, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Titanium (22) — add TiCl₄ ───
  22: [
    {
      name: 'Titanium Tetrachloride',
      formula: 'TiCl₄',
      description: 'Fumes in moist air (makes "smoke"). Used to produce Ti metal and TiO₂ pigment.',
      atoms: [
        { sym: 'Ti', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.1, y: 1.1, z: 0.5 },
        { sym: 'Cl', x: -1.1, y: -1.1, z: 0.5 },
        { sym: 'Cl', x: -1.1, y: 1.1, z: -0.5 },
        { sym: 'Cl', x: 1.1, y: -1.1, z: -0.5 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 },
        { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Chromium (24) — add CrO₃, Cr₂O₃ ───
  24: [
    {
      name: 'Chromium(III) Oxide',
      formula: 'Cr₂O₃',
      description: 'Chrome green — pigment in paints and the green on US dollar bills.',
      atoms: [
        { sym: 'Cr', x: -0.9, y: 0.4, z: 0 },
        { sym: 'Cr', x: 0.9, y: 0.4, z: 0 },
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

  // ─── Manganese (25) — add MnO₂ ───
  25: [
    {
      name: 'Manganese Dioxide',
      formula: 'MnO₂',
      description: 'Black powder in alkaline batteries. Ancient cave painters used this pigment.',
      atoms: [
        { sym: 'O', x: -1.1, y: 0, z: 0 },
        { sym: 'Mn', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.1, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }],
    },
  ],

  // ─── Iron (26) — add FeCl₃, FeO, FeSO₄ (showing Fe²⁺ vs Fe³⁺) ───
  26: [
    {
      name: 'Iron(II) Oxide',
      formula: 'FeO',
      description: 'Wüstite — contains Fe²⁺ ions. Black mineral found in meteorites.',
      atoms: [
        { sym: 'Fe', x: -0.85, y: 0, z: 0 },
        { sym: 'O', x: 0.85, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }],
    },
    {
      name: 'Iron(III) Chloride',
      formula: 'FeCl₃',
      description: 'Fe³⁺ — yellow-brown. Used to etch copper in PCB manufacturing.',
      atoms: [
        { sym: 'Fe', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.4, y: 0.8, z: 0 },
        { sym: 'Cl', x: -1.4, y: 0.8, z: 0 },
        { sym: 'Cl', x: 0, y: -1.2, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
      ],
    },
    {
      name: 'Iron(II) Sulfate',
      formula: 'FeSO₄',
      description: 'Fe²⁺ — green vitriol. Iron supplement in vitamins and food fortification.',
      atoms: [
        { sym: 'Fe', x: -2.0, y: 0, z: 0 },
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

  // ─── Cobalt (27) — add Co₂O₃ ───
  27: [
    {
      name: 'Cobalt(II,III) Oxide',
      formula: 'Co₃O₄',
      description: 'Black spinel. Used in cobalt blue pigment for ceramics and glass.',
      atoms: [
        { sym: 'Co', x: -1.0, y: 0.6, z: 0 },
        { sym: 'Co', x: 1.0, y: 0.6, z: 0 },
        { sym: 'Co', x: 0, y: -0.8, z: 0 },
        { sym: 'O', x: 0, y: 1.2, z: 0 },
        { sym: 'O', x: -1.2, y: -0.4, z: 0 },
        { sym: 'O', x: 1.2, y: -0.4, z: 0 },
        { sym: 'O', x: 0, y: 0, z: 0.8 },
      ],
      bonds: [
        { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 }, { from: 0, to: 6, order: 1 },
        { from: 1, to: 3, order: 1 }, { from: 1, to: 5, order: 1 },
        { from: 2, to: 4, order: 1 }, { from: 2, to: 5, order: 1 }, { from: 2, to: 6, order: 1 },
      ],
    },
  ],

  // ─── Nickel (28) — add NiO ───
  28: [
    {
      name: 'Nickel(II) Oxide',
      formula: 'NiO',
      description: 'Green powder. Used in nickel-cadmium batteries and ceramics.',
      atoms: [
        { sym: 'Ni', x: -0.85, y: 0, z: 0 },
        { sym: 'O', x: 0.85, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }],
    },
  ],

  // ─── Copper (29) — add CuO, Cu₂O ───
  29: [
    {
      name: 'Copper(II) Oxide',
      formula: 'CuO',
      description: 'Black powder — Cu²⁺. Used in ceramics to create blue/green glazes.',
      atoms: [
        { sym: 'Cu', x: -0.85, y: 0, z: 0 },
        { sym: 'O', x: 0.85, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }],
    },
    {
      name: 'Copper(I) Oxide',
      formula: 'Cu₂O',
      description: 'Red powder — Cu⁺. First semiconductor used in rectifiers (1924).',
      atoms: [
        { sym: 'Cu', x: -1.0, y: 0.5, z: 0 },
        { sym: 'O', x: 0, y: 0, z: 0 },
        { sym: 'Cu', x: 1.0, y: 0.5, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
  ],

  // ─── Zinc (30) — add ZnCl₂, ZnS ───
  30: [
    {
      name: 'Zinc Chloride',
      formula: 'ZnCl₂',
      description: 'Soldering flux. Also used in deodorants and as a wood preservative.',
      atoms: [
        { sym: 'Cl', x: -1.6, y: 0, z: 0 },
        { sym: 'Zn', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.6, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
    {
      name: 'Zinc Sulfide',
      formula: 'ZnS',
      description: 'Glows under UV light (phosphorescence). Used in glow-in-the-dark materials.',
      atoms: [
        { sym: 'Zn', x: -1.0, y: 0, z: 0 },
        { sym: 'S', x: 1.0, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }],
    },
  ],

  // ─── Bromine (35) — add Br₂ ───
  35: [
    {
      name: 'Bromine',
      formula: 'Br₂',
      description: 'Dark red fuming liquid — only non-metal liquid at room temperature besides mercury.',
      atoms: [
        { sym: 'Br', x: -1.14, y: 0, z: 0 },
        { sym: 'Br', x: 1.14, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Silver (47) — add AgCl, Ag₂O ───
  47: [
    {
      name: 'Silver Chloride',
      formula: 'AgCl',
      description: 'White solid that darkens in light — basis of photographic film.',
      atoms: [
        { sym: 'Ag', x: -1.2, y: 0, z: 0 },
        { sym: 'Cl', x: 1.2, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
    {
      name: 'Silver Oxide',
      formula: 'Ag₂O',
      description: 'Powers silver-oxide button batteries (watches, calculators).',
      atoms: [
        { sym: 'Ag', x: -1.1, y: 0.5, z: 0 },
        { sym: 'O', x: 0, y: 0, z: 0 },
        { sym: 'Ag', x: 1.1, y: 0.5, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
  ],

  // ─── Iodine (53) — add I₂ ───
  53: [
    {
      name: 'Iodine',
      formula: 'I₂',
      description: 'Purple vapor. Turns starch dark blue — a classic chemistry test.',
      atoms: [
        { sym: 'I', x: -1.33, y: 0, z: 0 },
        { sym: 'I', x: 1.33, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Gold (79) — add Au₂O₃ ───
  79: [
    {
      name: 'Gold(I) Chloride',
      formula: 'AuCl',
      description: 'Au⁺ — less common than Au³⁺. Decomposes easily. Used in gold plating.',
      atoms: [
        { sym: 'Au', x: -1.0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.0, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Mercury (80) — add Hg₂Cl₂ ───
  80: [
    {
      name: 'Calomel',
      formula: 'Hg₂Cl₂',
      description: 'Mercury(I) — Hg₂²⁺ dimer. Historic medicine and reference electrode.',
      atoms: [
        { sym: 'Cl', x: -2.0, y: 0, z: 0 },
        { sym: 'Hg', x: -0.7, y: 0, z: 0 },
        { sym: 'Hg', x: 0.7, y: 0, z: 0 },
        { sym: 'Cl', x: 2.0, y: 0, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }, { from: 2, to: 3, order: 1 },
      ],
    },
  ],

  // ─── Lead (82) — add PbO₂, PbCl₂ ───
  82: [
    {
      name: 'Lead(IV) Oxide',
      formula: 'PbO₂',
      description: 'Pb⁴⁺ — brown powder. Cathode in lead-acid car batteries.',
      atoms: [
        { sym: 'O', x: -1.1, y: 0, z: 0 },
        { sym: 'Pb', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.1, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }],
    },
    {
      name: 'Lead(II) Chloride',
      formula: 'PbCl₂',
      description: 'White solid — poorly soluble. Historic identification test for lead.',
      atoms: [
        { sym: 'Cl', x: -1.6, y: 0, z: 0 },
        { sym: 'Pb', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.6, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
  ],

  // ─── Uranium (92) — add UO₂ ───
  92: [
    {
      name: 'Uranium Dioxide',
      formula: 'UO₂',
      description: 'Nuclear fuel pellets in reactors. Black ceramic with fluorite structure.',
      atoms: [
        { sym: 'O', x: -1.1, y: 0, z: 0 },
        { sym: 'U', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.1, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 1, to: 2, order: 2 }],
    },
  ],

  // ──── Polyatomic ion examples as "compounds" for their key elements ────

  // ─── Phosphorus (15) — Phosphate ion ───
  // Already added PCl₃ and PCl₅ above

  // ─── Sulfur (16) — already have SO₂, H₂S, SO₃

  // ─── Xenon (54) — add XeF₂ ───
  54: [
    {
      name: 'Xenon Difluoride',
      formula: 'XeF₂',
      description: 'Linear noble gas compound. Used as a fluorinating agent and in silicon etching.',
      atoms: [
        { sym: 'F', x: -1.5, y: 0, z: 0 },
        { sym: 'Xe', x: 0, y: 0, z: 0 },
        { sym: 'F', x: 1.5, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
  ],

  // ─── Platinum (78) — add PtCl₂ ───
  78: [
    {
      name: 'Platinum(II) Chloride',
      formula: 'PtCl₂',
      description: 'Catalyst precursor for many reactions. Olive-green solid.',
      atoms: [
        { sym: 'Cl', x: -1.4, y: 0, z: 0 },
        { sym: 'Pt', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.4, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
  ],

  // ─── Tungsten (74) — add WO₃ ───
  74: [
    {
      name: 'Tungsten Trioxide',
      formula: 'WO₃',
      description: 'Yellow powder. Electrochromic — changes color with voltage (smart windows).',
      atoms: [
        { sym: 'W', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.2, y: 0, z: 0 },
        { sym: 'O', x: -0.6, y: 1.04, z: 0 },
        { sym: 'O', x: -0.6, y: -1.04, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }, { from: 0, to: 3, order: 2 },
      ],
    },
  ],

  // ─── Helium (2) — noble gas compound ───
  2: [
    {
      name: 'Helium Dimer (van der Waals)',
      formula: 'He₂',
      description: 'Weakest known molecular bond. Exists only at extremely low temperatures (~1 mK).',
      atoms: [
        { sym: 'He', x: -1.5, y: 0, z: 0 },
        { sym: 'He', x: 1.5, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Neon (10) — noble gas ───
  10: [
    {
      name: 'Neon (monatomic)',
      formula: 'Ne',
      description: 'Noble gas. Used in neon signs — emits characteristic red-orange glow when electrified.',
      atoms: [{ sym: 'Ne', x: 0, y: 0, z: 0 }],
      bonds: [],
    },
  ],

  // ─── Argon (18) — noble gas ───
  18: [
    {
      name: 'Argon Fluorohydride',
      formula: 'HArF',
      description: 'First true argon compound, discovered in 2000. Stable only below 17 K.',
      atoms: [
        { sym: 'H', x: -1.3, y: 0, z: 0 },
        { sym: 'Ar', x: 0, y: 0, z: 0 },
        { sym: 'F', x: 1.3, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 }],
    },
  ],

  // ─── Scandium (21) ───
  21: [
    {
      name: 'Scandium Oxide',
      formula: 'Sc₂O₃',
      description: 'Used in high-intensity discharge lamps and solid oxide fuel cells.',
      atoms: [
        { sym: 'Sc', x: -0.9, y: 0.5, z: 0 },
        { sym: 'O', x: 0, y: 0, z: 0 },
        { sym: 'Sc', x: 0.9, y: 0.5, z: 0 },
        { sym: 'O', x: -0.9, y: -0.5, z: 0 },
        { sym: 'O', x: 0.9, y: -0.5, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 2, to: 1, order: 1 },
        { from: 0, to: 3, order: 1 }, { from: 2, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Vanadium (23) ───
  23: [
    {
      name: 'Vanadium Pentoxide',
      formula: 'V₂O₅',
      description: 'Key industrial catalyst (contact process for H₂SO₄). Orange-yellow solid.',
      atoms: [
        { sym: 'V', x: -0.8, y: 0, z: 0 },
        { sym: 'V', x: 0.8, y: 0, z: 0 },
        { sym: 'O', x: 0, y: 0.6, z: 0 },
        { sym: 'O', x: -1.4, y: 0.7, z: 0 },
        { sym: 'O', x: 1.4, y: 0.7, z: 0 },
        { sym: 'O', x: -1.4, y: -0.7, z: 0 },
        { sym: 'O', x: 1.4, y: -0.7, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 1, to: 2, order: 1 },
        { from: 0, to: 3, order: 2 }, { from: 1, to: 4, order: 2 },
        { from: 0, to: 5, order: 1 }, { from: 1, to: 6, order: 1 },
      ],
    },
  ],

  // ─── Gallium (31) ───
  31: [
    {
      name: 'Gallium Arsenide',
      formula: 'GaAs',
      description: 'Semiconductor used in solar cells, LEDs, and laser diodes. Direct bandgap.',
      atoms: [
        { sym: 'Ga', x: -0.6, y: 0, z: 0 },
        { sym: 'As', x: 0.6, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
    {
      name: 'Gallium(III) Chloride',
      formula: 'GaCl₃',
      description: 'Lewis acid catalyst. Trigonal planar geometry.',
      atoms: [
        { sym: 'Ga', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.2, y: 0, z: 0 },
        { sym: 'Cl', x: -0.6, y: 1.04, z: 0 },
        { sym: 'Cl', x: -0.6, y: -1.04, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
      ],
    },
  ],

  // ─── Germanium (32) ───
  32: [
    {
      name: 'Germanium Dioxide',
      formula: 'GeO₂',
      description: 'Used in fiber optics and as a catalyst for PET plastic production.',
      atoms: [
        { sym: 'Ge', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.0, y: 0.5, z: 0 },
        { sym: 'O', x: -1.0, y: 0.5, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }],
    },
  ],

  // ─── Arsenic (33) ───
  33: [
    {
      name: 'Arsenic Trioxide',
      formula: 'As₂O₃',
      description: 'Known as "inheritance powder" — famous poison in history. Now used to treat leukemia.',
      atoms: [
        { sym: 'As', x: -0.8, y: 0.5, z: 0 },
        { sym: 'As', x: 0.8, y: 0.5, z: 0 },
        { sym: 'O', x: 0, y: 0, z: 0 },
        { sym: 'O', x: -1.2, y: -0.4, z: 0 },
        { sym: 'O', x: 1.2, y: -0.4, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 1, to: 2, order: 1 },
        { from: 0, to: 3, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Selenium (34) ───
  34: [
    {
      name: 'Hydrogen Selenide',
      formula: 'H₂Se',
      description: 'Extremely toxic gas with a foul odor. Similar structure to H₂S.',
      atoms: [
        { sym: 'Se', x: 0, y: 0, z: 0 },
        { sym: 'H', x: -0.8, y: -0.6, z: 0 },
        { sym: 'H', x: 0.8, y: -0.6, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }],
    },
    {
      name: 'Selenium Dioxide',
      formula: 'SeO₂',
      description: 'Useful oxidizing agent in organic chemistry. White needle-like crystals.',
      atoms: [
        { sym: 'Se', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.0, y: 0.5, z: 0 },
        { sym: 'O', x: -1.0, y: 0.5, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }],
    },
  ],

  // ─── Krypton (36) ───
  36: [
    {
      name: 'Krypton Difluoride',
      formula: 'KrF₂',
      description: 'One of the few noble gas compounds. Powerful oxidizer, unstable above -30°C.',
      atoms: [
        { sym: 'Kr', x: 0, y: 0, z: 0 },
        { sym: 'F', x: -1.0, y: 0, z: 0 },
        { sym: 'F', x: 1.0, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }],
    },
  ],

  // ─── Rubidium (37) ───
  37: [
    {
      name: 'Rubidium Chloride',
      formula: 'RbCl',
      description: 'Used in specialized fireworks and in atomic clocks. Highly soluble in water.',
      atoms: [
        { sym: 'Rb', x: -0.8, y: 0, z: 0 },
        { sym: 'Cl', x: 0.8, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Strontium (38) ───
  38: [
    {
      name: 'Strontium Carbonate',
      formula: 'SrCO₃',
      description: 'Gives red color to fireworks and flares. Found in the mineral strontianite.',
      atoms: [
        { sym: 'Sr', x: -1.0, y: 0, z: 0 },
        { sym: 'C', x: 0.4, y: 0, z: 0 },
        { sym: 'O', x: 1.2, y: 0.6, z: 0 },
        { sym: 'O', x: 1.2, y: -0.6, z: 0 },
        { sym: 'O', x: -0.2, y: 0.8, z: 0 },
      ],
      bonds: [
        { from: 0, to: 4, order: 1 }, { from: 1, to: 2, order: 2 },
        { from: 1, to: 3, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Yttrium (39) ───
  39: [
    {
      name: 'Yttrium Barium Copper Oxide',
      formula: 'YBa₂Cu₃O₇',
      description: 'First high-temp superconductor (Tc=93 K). Revolutionized physics in 1987.',
      atoms: [
        { sym: 'Y', x: 0, y: 0, z: 0 },
        { sym: 'Ba', x: 0, y: 1.2, z: 0 },
        { sym: 'Cu', x: 0.8, y: 0.6, z: 0 },
        { sym: 'O', x: -0.8, y: 0.6, z: 0 },
        { sym: 'O', x: 0.8, y: -0.6, z: 0 },
      ],
      bonds: [
        { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 },
        { from: 2, to: 3, order: 1 }, { from: 1, to: 3, order: 1 },
      ],
    },
  ],

  // ─── Zirconium (40) ───
  40: [
    {
      name: 'Zirconium Dioxide (Zirconia)',
      formula: 'ZrO₂',
      description: 'Cubic zirconia — diamond simulant in jewelry. Also used in dental crowns.',
      atoms: [
        { sym: 'Zr', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.0, y: 0.5, z: 0 },
        { sym: 'O', x: -1.0, y: 0.5, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }],
    },
  ],

  // ─── Niobium (41) ───
  41: [
    {
      name: 'Niobium Pentoxide',
      formula: 'Nb₂O₅',
      description: 'Used in camera lenses, capacitors, and acoustic sensors.',
      atoms: [
        { sym: 'Nb', x: -0.7, y: 0, z: 0 },
        { sym: 'Nb', x: 0.7, y: 0, z: 0 },
        { sym: 'O', x: 0, y: 0.6, z: 0 },
        { sym: 'O', x: -1.3, y: 0.6, z: 0 },
        { sym: 'O', x: 1.3, y: 0.6, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 1, to: 2, order: 1 },
        { from: 0, to: 3, order: 2 }, { from: 1, to: 4, order: 2 },
      ],
    },
  ],

  // ─── Molybdenum (42) ───
  42: [
    {
      name: 'Molybdenum Disulfide',
      formula: 'MoS₂',
      description: 'Excellent lubricant (like graphite). Layered structure yields 2D materials.',
      atoms: [
        { sym: 'Mo', x: 0, y: 0, z: 0 },
        { sym: 'S', x: 0.8, y: 0.8, z: 0 },
        { sym: 'S', x: -0.8, y: -0.8, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }],
    },
    {
      name: 'Molybdenum Trioxide',
      formula: 'MoO₃',
      description: 'Starting material for Mo catalysts. Used in petroleum refining.',
      atoms: [
        { sym: 'Mo', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.2, y: 0, z: 0 },
        { sym: 'O', x: -0.6, y: 1.04, z: 0 },
        { sym: 'O', x: -0.6, y: -1.04, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }, { from: 0, to: 3, order: 2 },
      ],
    },
  ],

  // ─── Technetium (43) ───
  43: [
    {
      name: 'Technetium-99m Pertechnetate',
      formula: 'TcO₄⁻',
      description: 'Most widely used medical radioisotope — 30 million diagnostic scans per year.',
      atoms: [
        { sym: 'Tc', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 0.95, y: 0.55, z: 0.55 },
        { sym: 'O', x: -0.95, y: -0.55, z: 0.55 },
        { sym: 'O', x: 0.55, y: -0.95, z: -0.55 },
        { sym: 'O', x: -0.55, y: 0.95, z: -0.55 },
      ],
      bonds: [
        { from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 },
        { from: 0, to: 3, order: 2 }, { from: 0, to: 4, order: 2 },
      ],
    },
  ],

  // ─── Ruthenium (44) ───
  44: [
    {
      name: 'Ruthenium Tetroxide',
      formula: 'RuO₄',
      description: 'Powerful oxidizer used in electron microscopy staining. Volatile and toxic.',
      atoms: [
        { sym: 'Ru', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 0.9, y: 0.52, z: 0.52 },
        { sym: 'O', x: -0.9, y: -0.52, z: 0.52 },
        { sym: 'O', x: 0.52, y: -0.9, z: -0.52 },
        { sym: 'O', x: -0.52, y: 0.9, z: -0.52 },
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
      description: 'Starting material for rhodium catalysts. Wilkinson\'s catalyst precursor.',
      atoms: [
        { sym: 'Rh', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 1.3, y: 0, z: 0 },
        { sym: 'Cl', x: -0.65, y: 1.13, z: 0 },
        { sym: 'Cl', x: -0.65, y: -1.13, z: 0 },
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
      description: 'Catalyst in Wacker process and cross-coupling reactions. 2010 Nobel Prize in Chemistry.',
      atoms: [
        { sym: 'Pd', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: -1.2, y: 0, z: 0 },
        { sym: 'Cl', x: 1.2, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }],
    },
  ],

  // ─── Cadmium (48) ───
  48: [
    {
      name: 'Cadmium Sulfide',
      formula: 'CdS',
      description: 'Bright yellow pigment used by artists (cadmium yellow). Also in photocells.',
      atoms: [
        { sym: 'Cd', x: -0.6, y: 0, z: 0 },
        { sym: 'S', x: 0.6, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }],
    },
  ],

  // ─── Indium (49) ───
  49: [
    {
      name: 'Indium Tin Oxide',
      formula: 'In₂O₃·SnO₂',
      description: 'Transparent conductor in every touchscreen, LCD, and OLED display.',
      atoms: [
        { sym: 'In', x: -0.7, y: 0, z: 0 },
        { sym: 'Sn', x: 0.7, y: 0, z: 0 },
        { sym: 'O', x: 0, y: 0.8, z: 0 },
        { sym: 'O', x: -1.2, y: 0.6, z: 0 },
        { sym: 'O', x: 1.2, y: 0.6, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 1, to: 2, order: 1 },
        { from: 0, to: 3, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Tin (50) ───
  50: [
    {
      name: 'Tin(IV) Chloride',
      formula: 'SnCl₄',
      description: 'Fume-producing liquid — used in Friedel-Crafts catalysis and mirror coatings.',
      atoms: [
        { sym: 'Sn', x: 0, y: 0, z: 0 },
        { sym: 'Cl', x: 0.9, y: 0.52, z: 0.52 },
        { sym: 'Cl', x: -0.9, y: -0.52, z: 0.52 },
        { sym: 'Cl', x: 0.52, y: -0.9, z: -0.52 },
        { sym: 'Cl', x: -0.52, y: 0.9, z: -0.52 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 },
        { from: 0, to: 3, order: 1 }, { from: 0, to: 4, order: 1 },
      ],
    },
    {
      name: 'Stannous Fluoride',
      formula: 'SnF₂',
      description: 'Active ingredient in many toothpastes — prevents tooth decay.',
      atoms: [
        { sym: 'Sn', x: 0, y: 0, z: 0 },
        { sym: 'F', x: -0.9, y: -0.5, z: 0 },
        { sym: 'F', x: 0.9, y: -0.5, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }],
    },
  ],

  // ─── Antimony (51) ───
  51: [
    {
      name: 'Antimony Trioxide',
      formula: 'Sb₂O₃',
      description: 'Primary flame retardant additive in plastics, textiles, and electronics.',
      atoms: [
        { sym: 'Sb', x: -0.8, y: 0.5, z: 0 },
        { sym: 'Sb', x: 0.8, y: 0.5, z: 0 },
        { sym: 'O', x: 0, y: 0, z: 0 },
        { sym: 'O', x: -1.2, y: -0.4, z: 0 },
        { sym: 'O', x: 1.2, y: -0.4, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 1, to: 2, order: 1 },
        { from: 0, to: 3, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Tellurium (52) ───
  52: [
    {
      name: 'Cadmium Telluride',
      formula: 'CdTe',
      description: 'Thin-film solar cell material — second most common PV technology.',
      atoms: [
        { sym: 'Cd', x: -0.7, y: 0, z: 0 },
        { sym: 'Te', x: 0.7, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Cesium (55) ───
  55: [
    {
      name: 'Cesium Chloride',
      formula: 'CsCl',
      description: 'Defines the CsCl crystal structure type. Used in ultracentrifuge separations.',
      atoms: [
        { sym: 'Cs', x: -0.9, y: 0, z: 0 },
        { sym: 'Cl', x: 0.9, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }],
    },
  ],

  // ─── Barium (56) ───
  56: [
    {
      name: 'Barium Sulfate',
      formula: 'BaSO₄',
      description: 'Barium meal — patients drink it for X-ray/CT imaging of the GI tract.',
      atoms: [
        { sym: 'Ba', x: -1.2, y: 0, z: 0 },
        { sym: 'S', x: 0.3, y: 0, z: 0 },
        { sym: 'O', x: 1.1, y: 0.6, z: 0 },
        { sym: 'O', x: 1.1, y: -0.6, z: 0 },
        { sym: 'O', x: -0.3, y: 0.8, z: 0 },
        { sym: 'O', x: -0.3, y: -0.8, z: 0 },
      ],
      bonds: [
        { from: 0, to: 4, order: 1 }, { from: 0, to: 5, order: 1 },
        { from: 1, to: 2, order: 2 }, { from: 1, to: 3, order: 2 },
        { from: 1, to: 4, order: 1 }, { from: 1, to: 5, order: 1 },
      ],
    },
    {
      name: 'Barium Titanate',
      formula: 'BaTiO₃',
      description: 'Piezoelectric ceramic — converts pressure to electricity. Used in sensors.',
      atoms: [
        { sym: 'Ba', x: 0, y: 1.2, z: 0 },
        { sym: 'Ti', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.0, y: 0, z: 0 },
        { sym: 'O', x: -1.0, y: 0, z: 0 },
        { sym: 'O', x: 0, y: -1.0, z: 0 },
      ],
      bonds: [
        { from: 1, to: 2, order: 1 }, { from: 1, to: 3, order: 1 },
        { from: 1, to: 4, order: 1 }, { from: 0, to: 2, order: 1 },
      ],
    },
  ],

  // ─── Lanthanum (57) ───
  57: [
    {
      name: 'Lanthanum Oxide',
      formula: 'La₂O₃',
      description: 'Used in optical glass and camera lenses — increases refractive index.',
      atoms: [
        { sym: 'La', x: -0.9, y: 0.5, z: 0 },
        { sym: 'La', x: 0.9, y: 0.5, z: 0 },
        { sym: 'O', x: 0, y: 0, z: 0 },
        { sym: 'O', x: -1.2, y: -0.4, z: 0 },
        { sym: 'O', x: 1.2, y: -0.4, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 1, to: 2, order: 1 },
        { from: 0, to: 3, order: 1 }, { from: 1, to: 4, order: 1 },
      ],
    },
  ],

  // ─── Cerium (58) ───
  58: [
    {
      name: 'Cerium(IV) Oxide',
      formula: 'CeO₂',
      description: 'Catalytic converter component. Also used as glass polishing compound (jeweler\'s rouge).',
      atoms: [
        { sym: 'Ce', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.0, y: 0.5, z: 0 },
        { sym: 'O', x: -1.0, y: 0.5, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }],
    },
  ],

  // ─── Neodymium (60) ───
  60: [
    {
      name: 'Neodymium Iron Boron',
      formula: 'Nd₂Fe₁₄B',
      description: 'Strongest permanent magnets — in every hard drive, EV motor, and MRI machine.',
      atoms: [
        { sym: 'Nd', x: -0.8, y: 0.6, z: 0 },
        { sym: 'Fe', x: 0, y: 0, z: 0 },
        { sym: 'B', x: 0.8, y: 0.6, z: 0 },
        { sym: 'Fe', x: 0, y: -0.8, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 1, to: 2, order: 1 },
        { from: 1, to: 3, order: 1 }, { from: 0, to: 3, order: 1 },
      ],
    },
  ],

  // ─── Gadolinium (64) ───
  64: [
    {
      name: 'Gadolinium DTPA',
      formula: 'Gd-DTPA',
      description: 'MRI contrast agent — Gd³⁺ has 7 unpaired electrons, highly paramagnetic.',
      atoms: [
        { sym: 'Gd', x: 0, y: 0, z: 0 },
        { sym: 'N', x: 1.0, y: 0.5, z: 0 },
        { sym: 'O', x: -1.0, y: 0.5, z: 0 },
        { sym: 'O', x: 0, y: -1.0, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }, { from: 0, to: 3, order: 1 },
      ],
    },
  ],

  // ─── Hafnium (72) ───
  72: [
    {
      name: 'Hafnium Dioxide',
      formula: 'HfO₂',
      description: 'High-k dielectric in modern CPU transistors (replaced SiO₂ at 45nm node).',
      atoms: [
        { sym: 'Hf', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.0, y: 0.5, z: 0 },
        { sym: 'O', x: -1.0, y: 0.5, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }],
    },
  ],

  // ─── Tantalum (73) ───
  73: [
    {
      name: 'Tantalum Pentoxide',
      formula: 'Ta₂O₅',
      description: 'Capacitor dielectric in cell phones. Biocompatible — used in surgical implants.',
      atoms: [
        { sym: 'Ta', x: -0.7, y: 0, z: 0 },
        { sym: 'Ta', x: 0.7, y: 0, z: 0 },
        { sym: 'O', x: 0, y: 0.6, z: 0 },
        { sym: 'O', x: -1.3, y: 0.6, z: 0 },
        { sym: 'O', x: 1.3, y: 0.6, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 1, to: 2, order: 1 },
        { from: 0, to: 3, order: 2 }, { from: 1, to: 4, order: 2 },
      ],
    },
  ],

  // ─── Rhenium (75) ───
  75: [
    {
      name: 'Rhenium Heptoxide',
      formula: 'Re₂O₇',
      description: 'Highest oxidation state oxide (+7). Catalyst for olefin metathesis.',
      atoms: [
        { sym: 'Re', x: -0.7, y: 0, z: 0 },
        { sym: 'Re', x: 0.7, y: 0, z: 0 },
        { sym: 'O', x: 0, y: 0.5, z: 0 },
        { sym: 'O', x: -1.3, y: 0.6, z: 0 },
        { sym: 'O', x: 1.3, y: 0.6, z: 0 },
      ],
      bonds: [
        { from: 0, to: 2, order: 1 }, { from: 1, to: 2, order: 1 },
        { from: 0, to: 3, order: 2 }, { from: 1, to: 4, order: 2 },
      ],
    },
  ],

  // ─── Osmium (76) ───
  76: [
    {
      name: 'Osmium Tetroxide',
      formula: 'OsO₄',
      description: 'Powerful biological stain for electron microscopy. Adds to C=C double bonds.',
      atoms: [
        { sym: 'Os', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 0.9, y: 0.52, z: 0.52 },
        { sym: 'O', x: -0.9, y: -0.52, z: 0.52 },
        { sym: 'O', x: 0.52, y: -0.9, z: -0.52 },
        { sym: 'O', x: -0.52, y: 0.9, z: -0.52 },
      ],
      bonds: [
        { from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 },
        { from: 0, to: 3, order: 2 }, { from: 0, to: 4, order: 2 },
      ],
    },
  ],

  // ─── Iridium (77) ───
  77: [
    {
      name: 'Iridium(IV) Oxide',
      formula: 'IrO₂',
      description: 'Best catalyst for oxygen evolution in water electrolysis (green hydrogen).',
      atoms: [
        { sym: 'Ir', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.0, y: 0.5, z: 0 },
        { sym: 'O', x: -1.0, y: 0.5, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }],
    },
  ],

  // ─── Thallium (81) ───
  81: [
    {
      name: 'Thallium(I) Sulfate',
      formula: 'Tl₂SO₄',
      description: 'Historically used as rat poison — odorless, tasteless, highly toxic.',
      atoms: [
        { sym: 'Tl', x: -1.3, y: 0, z: 0 },
        { sym: 'Tl', x: 1.3, y: 0, z: 0 },
        { sym: 'S', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 0.6, y: 0.6, z: 0 },
        { sym: 'O', x: -0.6, y: -0.6, z: 0 },
      ],
      bonds: [
        { from: 0, to: 4, order: 1 }, { from: 1, to: 3, order: 1 },
        { from: 2, to: 3, order: 2 }, { from: 2, to: 4, order: 2 },
      ],
    },
  ],

  // ─── Bismuth (83) ───
  83: [
    {
      name: 'Bismuth Subsalicylate',
      formula: 'C₇H₅BiO₄',
      description: 'Active ingredient in Pepto-Bismol — soothes upset stomach.',
      atoms: [
        { sym: 'Bi', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.0, y: 0.5, z: 0 },
        { sym: 'O', x: -1.0, y: 0.5, z: 0 },
        { sym: 'C', x: 0, y: -1.0, z: 0 },
        { sym: 'O', x: 0.8, y: -1.3, z: 0 },
      ],
      bonds: [
        { from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 },
        { from: 3, to: 4, order: 2 }, { from: 0, to: 3, order: 1 },
      ],
    },
  ],

  // ─── Radon (86) ───
  86: [
    {
      name: 'Radon Difluoride',
      formula: 'RnF₂',
      description: 'Predicted noble gas compound. Radon\'s higher polarizability makes bonding possible.',
      atoms: [
        { sym: 'Rn', x: 0, y: 0, z: 0 },
        { sym: 'F', x: -1.0, y: 0, z: 0 },
        { sym: 'F', x: 1.0, y: 0, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }],
    },
  ],

  // ─── Thorium (90) ───
  90: [
    {
      name: 'Thorium Dioxide',
      formula: 'ThO₂',
      description: 'Highest melting point of any oxide (3300°C). Thorium fuel cycle research.',
      atoms: [
        { sym: 'Th', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.0, y: 0.5, z: 0 },
        { sym: 'O', x: -1.0, y: 0.5, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }],
    },
  ],

  // ─── Plutonium (94) ───
  94: [
    {
      name: 'Plutonium Dioxide',
      formula: 'PuO₂',
      description: 'Powers RTGs on deep-space probes (Voyager, Curiosity, Perseverance).',
      atoms: [
        { sym: 'Pu', x: 0, y: 0, z: 0 },
        { sym: 'O', x: 1.0, y: 0.5, z: 0 },
        { sym: 'O', x: -1.0, y: 0.5, z: 0 },
      ],
      bonds: [{ from: 0, to: 1, order: 2 }, { from: 0, to: 2, order: 2 }],
    },
  ],
};

// Merge extra compounds into ELEMENT_COMPOUNDS (skip duplicates by formula)
Object.keys(EXTRA_COMPOUNDS).forEach(key => {
  const num = parseInt(key);
  if (ELEMENT_COMPOUNDS[num]) {
    const existing = new Set(ELEMENT_COMPOUNDS[num].map(c => c.formula));
    const unique = EXTRA_COMPOUNDS[num].filter(c => !existing.has(c.formula));
    ELEMENT_COMPOUNDS[num] = ELEMENT_COMPOUNDS[num].concat(unique);
  }
});
