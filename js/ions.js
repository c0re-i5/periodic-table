/**
 * IONS.js — Ionic states, oxidation states, and common ions for each element
 * Provides educational data about how elements form ions
 */

const ELEMENT_IONS = {
  // ─── Period 1 ───
  1: {
    oxidationStates: ['-1', '+1'],
    commonOx: '+1',
    ions: [
      { symbol: 'H⁺', charge: +1, name: 'Hydrogen ion', config: '(no electrons)', note: 'Bare proton; in water forms hydronium H₃O⁺', color: '#ff6b6b' },
      { symbol: 'H⁻', charge: -1, name: 'Hydride', config: '1s²', note: 'Found in NaH, LiH — strong reducing agent', color: '#4ecdc4' },
    ],
  },
  2: {
    oxidationStates: ['0'],
    commonOx: '0',
    ions: [],
  },

  // ─── Period 2 ───
  3: {
    oxidationStates: ['+1'],
    commonOx: '+1',
    ions: [
      { symbol: 'Li⁺', charge: +1, name: 'Lithium ion', config: '1s² (He core)', note: 'Small and polarizing; key to lithium-ion batteries', color: '#CC80FF' },
    ],
  },
  4: {
    oxidationStates: ['+2'],
    commonOx: '+2',
    ions: [
      { symbol: 'Be²⁺', charge: +2, name: 'Beryllium ion', config: '1s² (He core)', note: 'Very small — highly polarizing, mostly covalent bonding', color: '#C2FF00' },
    ],
  },
  5: {
    oxidationStates: ['+3'],
    commonOx: '+3',
    ions: [
      { symbol: 'B³⁺', charge: +3, name: 'Boron ion', config: '1s² (He core)', note: 'Rarely truly ionic — boron prefers covalent bonding', color: '#FFB5B5' },
    ],
  },
  6: {
    oxidationStates: ['-4', '-3', '-2', '-1', '+1', '+2', '+3', '+4'],
    commonOx: '+4, -4',
    ions: [
      { symbol: 'C⁴⁻', charge: -4, name: 'Carbide (methanide)', config: '1s² 2s² 2p⁶ (Ne core)', note: 'In CaC₂ (calcium carbide) — produces acetylene with water', color: '#909090' },
    ],
  },
  7: {
    oxidationStates: ['-3', '-2', '-1', '+1', '+2', '+3', '+4', '+5'],
    commonOx: '-3, +5',
    ions: [
      { symbol: 'N³⁻', charge: -3, name: 'Nitride', config: '1s² 2s² 2p⁶ (Ne core)', note: 'In Li₃N — one of the fastest lithium-ion conductors', color: '#3050F8' },
      { symbol: 'NO₃⁻', charge: -1, name: 'Nitrate', config: 'polyatomic', note: 'In fertilizers (KNO₃) and explosives. N is +5', color: '#3050F8' },
      { symbol: 'NH₄⁺', charge: +1, name: 'Ammonium', config: 'polyatomic', note: 'Conjugate acid of ammonia. In smelling salts and fertilizers', color: '#3050F8' },
    ],
  },
  8: {
    oxidationStates: ['-2', '-1'],
    commonOx: '-2',
    ions: [
      { symbol: 'O²⁻', charge: -2, name: 'Oxide', config: '1s² 2s² 2p⁶ (Ne core)', note: 'Most common — found in metal oxides, water, minerals', color: '#FF0D0D' },
      { symbol: 'O₂²⁻', charge: -2, name: 'Peroxide', config: 'polyatomic', note: 'In H₂O₂, Na₂O₂ — the O–O bond is intact', color: '#FF0D0D' },
      { symbol: 'OH⁻', charge: -1, name: 'Hydroxide', config: 'polyatomic', note: 'Base — makes solutions alkaline (pH > 7)', color: '#FF0D0D' },
    ],
  },
  9: {
    oxidationStates: ['-1'],
    commonOx: '-1',
    ions: [
      { symbol: 'F⁻', charge: -1, name: 'Fluoride', config: '1s² 2s² 2p⁶ (Ne core)', note: 'Most electronegative element — always -1 in compounds', color: '#90E050' },
    ],
  },
  10: {
    oxidationStates: ['0'],
    commonOx: '0',
    ions: [],
  },

  // ─── Period 3 ───
  11: {
    oxidationStates: ['+1'],
    commonOx: '+1',
    ions: [
      { symbol: 'Na⁺', charge: +1, name: 'Sodium ion', config: '[Ne] (= 1s² 2s² 2p⁶)', note: 'Essential for nerve impulse transmission. In NaCl, NaOH', color: '#AB5CF2' },
    ],
  },
  12: {
    oxidationStates: ['+2'],
    commonOx: '+2',
    ions: [
      { symbol: 'Mg²⁺', charge: +2, name: 'Magnesium ion', config: '[Ne]', note: 'Center of chlorophyll molecule. Essential for photosynthesis', color: '#8AFF00' },
    ],
  },
  13: {
    oxidationStates: ['+3'],
    commonOx: '+3',
    ions: [
      { symbol: 'Al³⁺', charge: +3, name: 'Aluminum ion', config: '[Ne]', note: 'In alum, clay minerals, and gemstones (ruby, sapphire)', color: '#BFA6A6' },
    ],
  },
  14: {
    oxidationStates: ['-4', '+2', '+4'],
    commonOx: '+4',
    ions: [
      { symbol: 'Si⁴⁺', charge: +4, name: 'Silicide/Silicon(IV)', config: '[Ne]', note: 'Rarely truly ionic — forms covalent SiO₂ and silicates', color: '#F0C8A0' },
    ],
  },
  15: {
    oxidationStates: ['-3', '+3', '+5'],
    commonOx: '-3, +5',
    ions: [
      { symbol: 'P³⁻', charge: -3, name: 'Phosphide', config: '[Ne] 3s² 3p⁶ (Ar core)', note: 'In GaP semiconductors — infrared LEDs', color: '#FF8000' },
      { symbol: 'PO₄³⁻', charge: -3, name: 'Phosphate', config: 'polyatomic', note: 'In DNA, ATP, bones, and teeth. P is +5', color: '#FF8000' },
    ],
  },
  16: {
    oxidationStates: ['-2', '+2', '+4', '+6'],
    commonOx: '-2, +6',
    ions: [
      { symbol: 'S²⁻', charge: -2, name: 'Sulfide', config: '[Ne] 3s² 3p⁶ (Ar core)', note: 'In pyrite (fool\'s gold), galena, and volcanic gases', color: '#FFFF30' },
      { symbol: 'SO₄²⁻', charge: -2, name: 'Sulfate', config: 'polyatomic', note: 'In gypsum, Epsom salt. S is +6', color: '#FFFF30' },
      { symbol: 'SO₃²⁻', charge: -2, name: 'Sulfite', config: 'polyatomic', note: 'Food preservative (E220-E228). S is +4', color: '#FFFF30' },
    ],
  },
  17: {
    oxidationStates: ['-1', '+1', '+3', '+5', '+7'],
    commonOx: '-1',
    ions: [
      { symbol: 'Cl⁻', charge: -1, name: 'Chloride', config: '[Ne] 3s² 3p⁶ (Ar core)', note: 'Table salt, stomach acid. Most common halide', color: '#1FF01F' },
      { symbol: 'ClO⁻', charge: -1, name: 'Hypochlorite', config: 'polyatomic', note: 'Bleach (NaClO). Cl is +1', color: '#1FF01F' },
      { symbol: 'ClO₄⁻', charge: -1, name: 'Perchlorate', config: 'polyatomic', note: 'Rocket fuel oxidizer. Cl is +7', color: '#1FF01F' },
    ],
  },
  18: {
    oxidationStates: ['0'],
    commonOx: '0',
    ions: [],
  },

  // ─── Period 4 ───
  19: {
    oxidationStates: ['+1'],
    commonOx: '+1',
    ions: [
      { symbol: 'K⁺', charge: +1, name: 'Potassium ion', config: '[Ar]', note: 'Essential for heart rhythm and nerve function. In bananas!', color: '#8F40D4' },
    ],
  },
  20: {
    oxidationStates: ['+2'],
    commonOx: '+2',
    ions: [
      { symbol: 'Ca²⁺', charge: +2, name: 'Calcium ion', config: '[Ar]', note: 'In bones, teeth, shells. Triggers muscle contraction', color: '#3DFF00' },
    ],
  },
  21: {
    oxidationStates: ['+3'],
    commonOx: '+3',
    ions: [
      { symbol: 'Sc³⁺', charge: +3, name: 'Scandium(III)', config: '[Ar]', note: 'Used in high-intensity lamps and scandium-aluminum alloys', color: '#BFC2C7' },
    ],
  },
  22: {
    oxidationStates: ['+2', '+3', '+4'],
    commonOx: '+4',
    ions: [
      { symbol: 'Ti⁴⁺', charge: +4, name: 'Titanium(IV)', config: '[Ar]', note: 'In TiO₂ (white pigment), titanium implants', color: '#BFC2C7' },
      { symbol: 'Ti³⁺', charge: +3, name: 'Titanium(III)', config: '[Ar] 3d¹', note: 'Purple solutions — strong reducing agent', color: '#BFC2C7' },
    ],
  },
  23: {
    oxidationStates: ['+2', '+3', '+4', '+5'],
    commonOx: '+5',
    ions: [
      { symbol: 'V⁵⁺', charge: +5, name: 'Vanadate', config: '[Ar]', note: 'Yellow — in V₂O₅ catalyst', color: '#A6A6AB' },
      { symbol: 'V⁴⁺', charge: +4, name: 'Vanadyl', config: '[Ar] 3d¹', note: 'Blue VO²⁺ — vanadium\'s most stable oxidation state', color: '#A6A6AB' },
      { symbol: 'V³⁺', charge: +3, name: 'Vanadium(III)', config: '[Ar] 3d²', note: 'Green solutions', color: '#A6A6AB' },
      { symbol: 'V²⁺', charge: +2, name: 'Vanadium(II)', config: '[Ar] 3d³', note: 'Violet solutions — strong reducing agent', color: '#A6A6AB' },
    ],
  },
  24: {
    oxidationStates: ['+2', '+3', '+6'],
    commonOx: '+3, +6',
    ions: [
      { symbol: 'Cr³⁺', charge: +3, name: 'Chromium(III)', config: '[Ar] 3d³', note: 'Green — in chrome plating, ruby, and emerald', color: '#8A99C7' },
      { symbol: 'Cr₂O₇²⁻', charge: -2, name: 'Dichromate', config: 'polyatomic', note: 'Orange — powerful oxidizer. Cr is +6', color: '#8A99C7' },
      { symbol: 'CrO₄²⁻', charge: -2, name: 'Chromate', config: 'polyatomic', note: 'Yellow — used in chrome yellow pigment. Cr is +6', color: '#8A99C7' },
    ],
  },
  25: {
    oxidationStates: ['+2', '+3', '+4', '+7'],
    commonOx: '+2, +7',
    ions: [
      { symbol: 'Mn²⁺', charge: +2, name: 'Manganese(II)', config: '[Ar] 3d⁵', note: 'Pale pink — very stable half-filled d shell', color: '#9C7AC7' },
      { symbol: 'MnO₄⁻', charge: -1, name: 'Permanganate', config: 'polyatomic', note: 'Deep purple — strong oxidizer. Mn is +7', color: '#9C7AC7' },
      { symbol: 'Mn⁴⁺', charge: +4, name: 'Manganese(IV)', config: '[Ar] 3d³', note: 'In MnO₂ batteries and water treatment', color: '#9C7AC7' },
    ],
  },
  26: {
    oxidationStates: ['+2', '+3'],
    commonOx: '+2, +3',
    ions: [
      { symbol: 'Fe²⁺', charge: +2, name: 'Ferrous / Iron(II)', config: '[Ar] 3d⁶', note: 'Green solutions. In hemoglobin — carries oxygen in blood', color: '#4ecdc4' },
      { symbol: 'Fe³⁺', charge: +3, name: 'Ferric / Iron(III)', config: '[Ar] 3d⁵', note: 'Yellow-brown. Rust (Fe₂O₃). Half-filled d⁵ is extra stable', color: '#E06633' },
    ],
  },
  27: {
    oxidationStates: ['+2', '+3'],
    commonOx: '+2, +3',
    ions: [
      { symbol: 'Co²⁺', charge: +2, name: 'Cobalt(II)', config: '[Ar] 3d⁷', note: 'Pink (aqueous) — in vitamin B₁₂', color: '#F090A0' },
      { symbol: 'Co³⁺', charge: +3, name: 'Cobalt(III)', config: '[Ar] 3d⁶', note: 'Strong oxidizer — forms very stable complexes', color: '#F090A0' },
    ],
  },
  28: {
    oxidationStates: ['+2', '+3'],
    commonOx: '+2',
    ions: [
      { symbol: 'Ni²⁺', charge: +2, name: 'Nickel(II)', config: '[Ar] 3d⁸', note: 'Green solutions. In NiMH batteries and stainless steel', color: '#50D050' },
    ],
  },
  29: {
    oxidationStates: ['+1', '+2'],
    commonOx: '+1, +2',
    ions: [
      { symbol: 'Cu⁺', charge: +1, name: 'Cuprous / Copper(I)', config: '[Ar] 3d¹⁰', note: 'Colorless. Stable d¹⁰ — in Cu₂O (red)', color: '#C88033' },
      { symbol: 'Cu²⁺', charge: +2, name: 'Cupric / Copper(II)', config: '[Ar] 3d⁹', note: 'Blue solutions. Blue vitriol (CuSO₄·5H₂O)', color: '#4A90D9' },
    ],
  },
  30: {
    oxidationStates: ['+2'],
    commonOx: '+2',
    ions: [
      { symbol: 'Zn²⁺', charge: +2, name: 'Zinc(II)', config: '[Ar] 3d¹⁰', note: 'Colorless. Full d¹⁰ shell — always +2. In over 300 enzymes', color: '#7D80B0' },
    ],
  },
  31: {
    oxidationStates: ['+3'],
    commonOx: '+3',
    ions: [
      { symbol: 'Ga³⁺', charge: +3, name: 'Gallium(III)', config: '[Ar] 3d¹⁰', note: 'In GaAs LEDs and semiconductors', color: '#C28F8F' },
    ],
  },
  33: {
    oxidationStates: ['-3', '+3', '+5'],
    commonOx: '+3, +5',
    ions: [
      { symbol: 'AsO₄³⁻', charge: -3, name: 'Arsenate', config: 'polyatomic', note: 'Toxic — mimics phosphate in biochemistry. As is +5', color: '#BD80E3' },
    ],
  },
  35: {
    oxidationStates: ['-1', '+1', '+3', '+5'],
    commonOx: '-1',
    ions: [
      { symbol: 'Br⁻', charge: -1, name: 'Bromide', config: '[Ar] 3d¹⁰ 4s² 4p⁶ (Kr core)', note: 'In AgBr (photography), as a sedative (historically)', color: '#A62929' },
    ],
  },
  36: {
    oxidationStates: ['0', '+2'],
    commonOx: '0',
    ions: [],
  },

  // ─── Period 5 ───
  37: {
    oxidationStates: ['+1'],
    commonOx: '+1',
    ions: [
      { symbol: 'Rb⁺', charge: +1, name: 'Rubidium ion', config: '[Kr]', note: 'Used in atomic clocks and GPS satellites', color: '#702EB0' },
    ],
  },
  38: {
    oxidationStates: ['+2'],
    commonOx: '+2',
    ions: [
      { symbol: 'Sr²⁺', charge: +2, name: 'Strontium ion', config: '[Kr]', note: 'Red flame test. ⁹⁰Sr is a dangerous nuclear fallout product', color: '#00FF00' },
    ],
  },
  42: {
    oxidationStates: ['+2', '+3', '+4', '+5', '+6'],
    commonOx: '+6',
    ions: [
      { symbol: 'MoO₄²⁻', charge: -2, name: 'Molybdate', config: 'polyatomic', note: 'Essential cofactor in nitrogenase — fixes atmospheric N₂. Mo is +6', color: '#54B5B5' },
    ],
  },
  46: {
    oxidationStates: ['+2', '+4'],
    commonOx: '+2',
    ions: [
      { symbol: 'Pd²⁺', charge: +2, name: 'Palladium(II)', config: '[Kr] 4d⁸', note: 'Key catalyst in Suzuki coupling (Nobel 2010)', color: '#D0D0E0' },
    ],
  },
  47: {
    oxidationStates: ['+1'],
    commonOx: '+1',
    ions: [
      { symbol: 'Ag⁺', charge: +1, name: 'Silver ion', config: '[Kr] 4d¹⁰', note: 'Antimicrobial. In AgNO₃ — photosensitive', color: '#C0C0C0' },
    ],
  },
  48: {
    oxidationStates: ['+2'],
    commonOx: '+2',
    ions: [
      { symbol: 'Cd²⁺', charge: +2, name: 'Cadmium(II)', config: '[Kr] 4d¹⁰', note: 'Toxic — accumulates in kidneys. In NiCd batteries', color: '#668F8F' },
    ],
  },
  50: {
    oxidationStates: ['+2', '+4'],
    commonOx: '+2, +4',
    ions: [
      { symbol: 'Sn²⁺', charge: +2, name: 'Stannous / Tin(II)', config: '[Kr] 4d¹⁰ 5s²', note: 'In tin cans (SnCl₂) and dentistry. "Inert pair effect"', color: '#668080' },
      { symbol: 'Sn⁴⁺', charge: +4, name: 'Stannic / Tin(IV)', config: '[Kr] 4d¹⁰', note: 'In SnO₂ (cassiterite) — main tin ore', color: '#668080' },
    ],
  },
  53: {
    oxidationStates: ['-1', '+1', '+3', '+5', '+7'],
    commonOx: '-1',
    ions: [
      { symbol: 'I⁻', charge: -1, name: 'Iodide', config: '[Kr] 4d¹⁰ 5s² 5p⁶ (Xe core)', note: 'Essential for thyroid hormones (T₃, T₄)', color: '#940094' },
      { symbol: 'IO₃⁻', charge: -1, name: 'Iodate', config: 'polyatomic', note: 'In iodized salt as a supplement. I is +5', color: '#940094' },
    ],
  },

  // ─── Period 6 ───
  55: {
    oxidationStates: ['+1'],
    commonOx: '+1',
    ions: [
      { symbol: 'Cs⁺', charge: +1, name: 'Cesium ion', config: '[Xe]', note: 'Largest common ion. ¹³³Cs defines the second (atomic clock)', color: '#57178F' },
    ],
  },
  56: {
    oxidationStates: ['+2'],
    commonOx: '+2',
    ions: [
      { symbol: 'Ba²⁺', charge: +2, name: 'Barium ion', config: '[Xe]', note: 'Green flame test. BaSO₄ is safe to swallow (insoluble) for X-rays', color: '#00C900' },
    ],
  },
  74: {
    oxidationStates: ['+2', '+3', '+4', '+5', '+6'],
    commonOx: '+6',
    ions: [
      { symbol: 'WO₄²⁻', charge: -2, name: 'Tungstate', config: 'polyatomic', note: 'In scheelite mineral (CaWO₄). W is +6', color: '#2194D6' },
    ],
  },
  78: {
    oxidationStates: ['+2', '+4'],
    commonOx: '+2, +4',
    ions: [
      { symbol: 'Pt²⁺', charge: +2, name: 'Platinum(II)', config: '[Xe] 4f¹⁴ 5d⁸', note: 'Square planar complexes — cisplatin (anti-cancer)', color: '#D0D0E0' },
      { symbol: 'Pt⁴⁺', charge: +4, name: 'Platinum(IV)', config: '[Xe] 4f¹⁴ 5d⁶', note: 'Octahedral complexes — catalytic converters', color: '#D0D0E0' },
    ],
  },
  79: {
    oxidationStates: ['+1', '+3'],
    commonOx: '+3',
    ions: [
      { symbol: 'Au⁺', charge: +1, name: 'Aurous / Gold(I)', config: '[Xe] 4f¹⁴ 5d¹⁰', note: 'Linear complexes. In gold cyanide plating', color: '#FFD123' },
      { symbol: 'Au³⁺', charge: +3, name: 'Auric / Gold(III)', config: '[Xe] 4f¹⁴ 5d⁸', note: 'Square planar — in AuCl₃ catalyst. "Aqua regia" dissolves gold', color: '#FFD123' },
    ],
  },
  80: {
    oxidationStates: ['+1', '+2'],
    commonOx: '+1, +2',
    ions: [
      { symbol: 'Hg₂²⁺', charge: +2, name: 'Mercurous (dimer)', config: 'Hg–Hg bonded pair', note: 'Unique Hg–Hg metal bond. In calomel electrode', color: '#B8B8D0' },
      { symbol: 'Hg²⁺', charge: +2, name: 'Mercuric / Mercury(II)', config: '[Xe] 4f¹⁴ 5d¹⁰', note: 'In HgCl₂ — once used as medicine (dangerous!)', color: '#B8B8D0' },
    ],
  },
  82: {
    oxidationStates: ['+2', '+4'],
    commonOx: '+2',
    ions: [
      { symbol: 'Pb²⁺', charge: +2, name: 'Plumbous / Lead(II)', config: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', note: '"Inert pair effect" — 6s² electrons resist ionization', color: '#575961' },
      { symbol: 'Pb⁴⁺', charge: +4, name: 'Plumbic / Lead(IV)', config: '[Xe] 4f¹⁴ 5d¹⁰', note: 'In PbO₂ (battery cathode). Increasingly unstable — oxidizer', color: '#575961' },
    ],
  },
  83: {
    oxidationStates: ['+3', '+5'],
    commonOx: '+3',
    ions: [
      { symbol: 'Bi³⁺', charge: +3, name: 'Bismuth(III)', config: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', note: 'Pink in Pepto-Bismol. Heaviest "safe" heavy metal', color: '#9E4FB5' },
    ],
  },
};

// Polyatomic ions reference (shown in educational context)
const POLYATOMIC_IONS = [
  { symbol: 'OH⁻', name: 'Hydroxide', charge: -1, geometry: 'Linear', note: 'Strong base' },
  { symbol: 'NH₄⁺', name: 'Ammonium', charge: +1, geometry: 'Tetrahedral', note: 'Conjugate acid of NH₃' },
  { symbol: 'NO₃⁻', name: 'Nitrate', charge: -1, geometry: 'Trigonal planar', note: 'In fertilizers' },
  { symbol: 'NO₂⁻', name: 'Nitrite', charge: -1, geometry: 'Bent', note: 'Food preservative' },
  { symbol: 'SO₄²⁻', name: 'Sulfate', charge: -2, geometry: 'Tetrahedral', note: 'In gypsum, Epsom salt' },
  { symbol: 'SO₃²⁻', name: 'Sulfite', charge: -2, geometry: 'Trigonal pyramidal', note: 'Preservative (wine)' },
  { symbol: 'CO₃²⁻', name: 'Carbonate', charge: -2, geometry: 'Trigonal planar', note: 'In limestone, shells' },
  { symbol: 'HCO₃⁻', name: 'Bicarbonate', charge: -1, geometry: 'Trigonal planar', note: 'In baking soda' },
  { symbol: 'PO₄³⁻', name: 'Phosphate', charge: -3, geometry: 'Tetrahedral', note: 'In DNA, ATP, bones' },
  { symbol: 'ClO⁻', name: 'Hypochlorite', charge: -1, geometry: 'Linear', note: 'Bleach (NaClO)' },
  { symbol: 'ClO₃⁻', name: 'Chlorate', charge: -1, geometry: 'Trigonal pyramidal', note: 'In matches, fireworks' },
  { symbol: 'ClO₄⁻', name: 'Perchlorate', charge: -1, geometry: 'Tetrahedral', note: 'Rocket fuel oxidizer' },
  { symbol: 'MnO₄⁻', name: 'Permanganate', charge: -1, geometry: 'Tetrahedral', note: 'Purple oxidizer' },
  { symbol: 'CrO₄²⁻', name: 'Chromate', charge: -2, geometry: 'Tetrahedral', note: 'Yellow pigment' },
  { symbol: 'Cr₂O₇²⁻', name: 'Dichromate', charge: -2, geometry: 'Two tetrahedra', note: 'Orange oxidizer' },
  { symbol: 'C₂O₄²⁻', name: 'Oxalate', charge: -2, geometry: 'Planar', note: 'In kidney stones, rhubarb' },
  { symbol: 'CN⁻', name: 'Cyanide', charge: -1, geometry: 'Linear', note: 'Extremely toxic. Gold extraction' },
  { symbol: 'SCN⁻', name: 'Thiocyanate', charge: -1, geometry: 'Linear', note: 'Blood-red with Fe³⁺ (test)' },
];
