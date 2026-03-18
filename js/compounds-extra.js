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
};

// Merge extra compounds into ELEMENT_COMPOUNDS
Object.keys(EXTRA_COMPOUNDS).forEach(key => {
  const num = parseInt(key);
  if (ELEMENT_COMPOUNDS[num]) {
    ELEMENT_COMPOUNDS[num] = ELEMENT_COMPOUNDS[num].concat(EXTRA_COMPOUNDS[num]);
  }
});
