/**
 * MOLECULAR-ORBITALS.js — LCAO molecular orbital coefficients for key molecules
 *
 * Each entry is keyed by compound formula (matching compounds.js).
 * MO data defines LCAO coefficients: ψ_MO(r) = Σ c_i × φ_i(r − R_i)
 *
 * Format:
 *   orbitals: [{
 *     name:      string,       // MO label (e.g. 'σ₁s', 'π*₂p')
 *     type:      string,       // bonding | antibonding | nonbonding | core
 *     electrons: number,       // 0, 1, or 2
 *     ao: [{                   // LCAO contributions
 *       atom:  number,         // index into compound.atoms[]
 *       n:     number,         // principal quantum number
 *       l:     number,         // angular momentum (0=s, 1=p, 2=d)
 *       m:     number,         // magnetic quantum number
 *       zeff:  number,         // effective nuclear charge (Slater)
 *       c:     number,         // LCAO coefficient (sign matters!)
 *     }]
 *   }]
 *
 * Angular convention (matches app.js angularY):
 *   m= 0: pz (points along z-axis)
 *   m= 1: px (points along x-axis)
 *   m=-1: py (points along y-axis)
 *
 * Zeff values use Slater rules: Zeff = n × ζ_slater
 *   H 1s: Zeff ≈ 1.24 (molecular optimized)
 *   C 2s,2p: Zeff ≈ 3.25 | C 1s: Zeff ≈ 5.67
 *   N 2s,2p: Zeff ≈ 3.90 | N 1s: Zeff ≈ 6.67
 *   O 2s,2p: Zeff ≈ 4.45 | O 1s: Zeff ≈ 7.66
 *   F 2s,2p: Zeff ≈ 5.13 | F 1s: Zeff ≈ 8.65
 *   Cl 3s,3p: Zeff ≈ 6.12
 *   Na 3s: Zeff ≈ 2.20
 *   Li 1s: Zeff ≈ 2.70 | Li 2s: Zeff ≈ 1.30
 *   Be 2s: Zeff ≈ 1.95
 *   B 2s,2p: Zeff ≈ 2.60
 *   Si 3s,3p: Zeff ≈ 4.15
 *   P 3s,3p: Zeff ≈ 4.80
 *   S 3s,3p: Zeff ≈ 5.45
 *   Br 4s,4p: Zeff ≈ 7.60
 *   Xe 5s,5p: Zeff ≈ 8.25
 *   K 4s: Zeff ≈ 2.20 | Ca 4s: Zeff ≈ 2.85 | Mg 3s: Zeff ≈ 2.85
 *   Al 3s,3p: Zeff ≈ 3.50 | Ga 4s,4p: Zeff ≈ 5.00 | As 4s,4p: Zeff ≈ 5.80
 *   Se 4s,4p: Zeff ≈ 6.20 | Te 5s,5p: Zeff ≈ 6.55 | I 5s,5p: Zeff ≈ 7.00
 *   Rb 5s: Zeff ≈ 2.20 | Cs 6s: Zeff ≈ 2.20 | Ag 5s: Zeff ≈ 4.25
 *   Cd 5s: Zeff ≈ 4.55 | Sn 5s,5p: Zeff ≈ 6.20 | Pb 6s,6p: Zeff ≈ 6.50
 *   Fe 3d: Zeff ≈ 6.25, 4s: 3.75 | Ni 3d: 7.55, 4s: 4.05
 *   Cu 3d: Zeff ≈ 7.85, 4s: 3.70 | Zn 4s: Zeff ≈ 4.35
 *   Ar 3s,3p: Zeff ≈ 6.76 | Kr 4s,4p: Zeff ≈ 8.25
 *   W 5d: Zeff ≈ 8.50, 6s: 4.35 | U 5f: 9.20, 6d/6p: 8.00
 *   He 1s: Zeff ≈ 1.70 | Ge 4s,4p: Zeff ≈ 5.50
 *   Au 5d: Zeff ≈ 10.50, 6s: 4.20 | Pt 5d: 10.20, 6s: 4.00
 *   Pd 4d: Zeff ≈ 8.85, 5s: 4.30 | Rh 4d: 8.50, 5s: 4.10
 *   Mo 4d: Zeff ≈ 7.40, 5s: 3.60 | Mn 3d: 5.60, 4s: 3.50
 *   Zr 4d: Zeff ≈ 6.80, 5s: 3.40 | Hf 5d: 9.00, 6s: 4.10
 *   Ce 4f: Zeff ≈ 8.20, 5d: 7.50, 6s: 3.80
 *   Ir 5d: Zeff ≈ 10.00, 6s: 4.10 | Os 5d: 9.60, 6s: 4.00
 *   Th 6d: Zeff ≈ 7.50, 7s: 3.80 | Pu 5f: 9.50, 6d: 8.20, 7s: 3.90
 *   Ru 4d: Zeff ≈ 7.55, 5s: 3.70 | Ti 3d: 4.80, 4s: 3.15
 *   Rn 6s,6p: Zeff ≈ 9.20 | Hg 5d: 10.80, 6s: 4.35
 *   Sc 3d: Zeff ≈ 4.35, 4s: 2.85 | V 3d: 5.20, 4s: 3.30
 *   Co 3d: Zeff ≈ 6.90, 4s: 3.90 | Sb 5s,5p: 6.10
 *   La 5d: Zeff ≈ 7.40, 6s: 3.60 | Nb 4d: 6.40, 5s: 3.30
 *   Ta 5d: Zeff ≈ 8.80, 6s: 4.15 | Re 5d: 9.20, 6s: 4.20
 *   Ba 6s: Zeff ≈ 3.40 | Sr 5s: 3.00 | Tl 6s,6p: 6.30
 */

const MOLECULAR_ORBITALS = {

  // ═══════════════════ H₂ — Hydrogen Molecule ═══════════════════
  // Simplest molecule. Shows σ bonding vs σ* antibonding perfectly.
  // Atoms: H₁(-0.37,0,0) H₂(0.37,0,0) — bond along x-axis
  'H₂': {
    orbitals: [
      {
        name: 'σ₁s',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.707 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.707 },
        ],
      },
      {
        name: 'σ*₁s',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.707 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c: -0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ HF — Hydrogen Fluoride ═══════════════════
  // Polar bond: F is much more electronegative. MO coefficients asymmetric.
  // Atoms: H(-0.46,0,0) F(0.46,0,0) — bond along x-axis
  'HF': {
    orbitals: [
      {
        name: '1σ (F 1s core)',
        type: 'core',
        electrons: 2,
        ao: [
          { atom: 1, n: 1, l: 0, m: 0, zeff: 8.65, c: 1.0 },
        ],
      },
      {
        name: '2σ (F 2s)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 5.13, c: 0.95 },
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.10 },
        ],
      },
      {
        name: '3σ (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.70 },  // F 2px along bond
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.52 },  // H 1s
        ],
      },
      {
        name: '1π (F lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },  // F 2py
        ],
      },
      {
        name: '1π\' (F lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },   // F 2pz
        ],
      },
    ],
  },

  // ═══════════════════ HCl — Hydrochloric Acid ═══════════════════
  // Atoms: H(-0.64,0,0) Cl(0.64,0,0) — bond along x-axis
  'HCl': {
    orbitals: [
      {
        name: '3σ (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.65 },  // Cl 3px along bond
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.55 },  // H 1s
        ],
      },
      {
        name: '1π (Cl lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },  // Cl 3py
        ],
      },
      {
        name: '1π\' (Cl lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },   // Cl 3pz
        ],
      },
      {
        name: 'Cl 3s (inner)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ N₂ — Nitrogen Molecule ═══════════════════
  // Triple bond! σ + 2π. Strongest homonuclear diatomic bond.
  // Atoms: N₁(-0.55,0,0) N₂(0.55,0,0) — bond along x-axis
  'N₂': {
    orbitals: [
      {
        name: '2σ_g',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.90, c:  0.707 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.90, c:  0.707 },
        ],
      },
      {
        name: '2σ*_u',
        type: 'antibonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.90, c:  0.707 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.90, c: -0.707 },
        ],
      },
      {
        name: '1π_u (y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.90, c:  0.707 },  // N₁ 2py
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.90, c:  0.707 },  // N₂ 2py
        ],
      },
      {
        name: '1π_u (z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.90, c:  0.707 },  // N₁ 2pz
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.90, c:  0.707 },  // N₂ 2pz
        ],
      },
      {
        name: '3σ_g',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.90, c:  0.707 },  // N₁ 2px (σ along bond)
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.90, c:  0.707 },  // N₂ 2px
        ],
      },
    ],
  },

  // ═══════════════════ O₂ — Oxygen Molecule ═══════════════════
  // Paramagnetic! Two unpaired electrons in π* orbitals.
  // This is the textbook example of MO theory's predictive power.
  // Atoms: (we'll refererence O₂ however it appears — may need to check)
  // Using homonuclear diatomic with bond along x-axis

  // ═══════════════════ H₂O — Water ═══════════════════
  // The most important molecule. Shows lone pairs beautifully.
  // Atoms: O(0,0,0) H₁(-0.76,0.59,0) H₂(0.76,0.59,0)
  // Molecular plane: xy. C₂ axis along y. Out-of-plane: z.
  'H₂O': {
    orbitals: [
      {
        name: '2a₁ (inner valence)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0,  zeff: 4.45, c: -0.83 },  // O 2s
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.14 },  // O 2py (toward Hs)
          { atom: 1, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.24 },  // H₁ 1s
          { atom: 2, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.24 },  // H₂ 1s
        ],
      },
      {
        name: '1b₂ (O-H bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1,  zeff: 4.45, c:  0.62 },  // O 2px (antisymmetric)
          { atom: 1, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.45 },  // H₁ 1s
          { atom: 2, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.45 },  // H₂ 1s (antisymmetric)
        ],
      },
      {
        name: '3a₁ (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0,  zeff: 4.45, c:  0.48 },  // O 2s
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.75 },  // O 2py (points between Hs)
          { atom: 1, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.26 },  // H₁ (small antibonding)
          { atom: 2, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.26 },  // H₂
        ],
      },
      {
        name: '1b₁ (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },    // O 2pz (out of plane)
        ],
      },
    ],
  },

  // ═══════════════════ NH₃ — Ammonia ═══════════════════
  // Pyramidal geometry (sp³), one lone pair pointing up.
  // Atoms: N(0,0,0.12) H₁(0,0.94,-0.36) H₂(0.81,-0.47,-0.36) H₃(-0.81,-0.47,-0.36)
  // The lone pair points along +z. N-H bonds point downward.
  'NH₃': {
    orbitals: [
      {
        name: '2a₁ (inner valence)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0,  zeff: 3.90, c: -0.80 },  // N 2s
          { atom: 0, n: 2, l: 1, m: 0,  zeff: 3.90, c:  0.15 },  // N 2pz
          { atom: 1, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.22 },  // H₁
          { atom: 2, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.22 },  // H₂
          { atom: 3, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.22 },  // H₃
        ],
      },
      {
        name: '1e (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1,  zeff: 3.90, c:  0.55 },  // N 2px
          { atom: 1, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.15 },  // H₁ (small)
          { atom: 2, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.42 },  // H₂
          { atom: 3, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.42 },  // H₃
        ],
      },
      {
        name: '1e\' (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.90, c:  0.55 },  // N 2py
          { atom: 1, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.50 },  // H₁
          { atom: 2, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.25 },  // H₂
          { atom: 3, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.25 },  // H₃
        ],
      },
      {
        name: '3a₁ (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.90, c:  0.42 },  // N 2s
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.90, c:  0.82 },  // N 2pz (lone pair up)
        ],
      },
    ],
  },

  // ═══════════════════ CH₄ — Methane ═══════════════════
  // Perfect tetrahedral sp³. All four C-H bonds equivalent.
  // Atoms: C(0,0,0) H₁(0.63,0.63,0.63) H₂(-0.63,-0.63,0.63)
  //        H₃(-0.63,0.63,-0.63) H₄(0.63,-0.63,-0.63)
  'CH₄': {
    orbitals: [
      {
        name: '2a₁ (inner valence)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.25, c: -0.75 },  // C 2s
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.28 },  // H₁
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.28 },  // H₂
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.28 },  // H₃
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.28 },  // H₄
        ],
      },
      {
        name: '1t₂ (bond, x)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1,  zeff: 3.25, c:  0.58 },  // C 2px
          { atom: 1, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.35 },  // H₁ (+x)
          { atom: 2, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.35 },  // H₂ (-x)
          { atom: 3, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.35 },  // H₃ (-x)
          { atom: 4, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.35 },  // H₄ (+x)
        ],
      },
      {
        name: '1t₂ (bond, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.25, c:  0.58 },  // C 2py
          { atom: 1, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.35 },  // H₁ (+y)
          { atom: 2, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.35 },  // H₂ (-y)
          { atom: 3, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.35 },  // H₃ (+y)
          { atom: 4, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.35 },  // H₄ (-y)
        ],
      },
      {
        name: '1t₂ (bond, z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0,  zeff: 3.25, c:  0.58 },  // C 2pz
          { atom: 1, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.35 },  // H₁ (+z)
          { atom: 2, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.35 },  // H₂ (+z)
          { atom: 3, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.35 },  // H₃ (-z)
          { atom: 4, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.35 },  // H₄ (-z)
        ],
      },
    ],
  },

  // ═══════════════════ CO₂ — Carbon Dioxide ═══════════════════
  // Linear molecule. σ bonds + π bonds perpendicular.
  // Atoms: O₁(-1.16,0,0) C(0,0,0) O₂(1.16,0,0) — bond along x-axis
  'CO₂': {
    orbitals: [
      {
        name: '3σ_g (C-O σ bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.25, c: -0.70 },  // C 2s
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.42 },  // O₁ 2px (toward C)
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.42 },  // O₂ 2px (toward C)
        ],
      },
      {
        name: '4σ_u (C-O σ bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.58 },  // C 2px (σ along bond)
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.42 },  // O₁ 2px
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.42 },  // O₂ 2px
        ],
      },
      {
        name: '1π_u (y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.25, c:  0.60 },  // C 2py
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.40 },  // O₁ 2py
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.40 },  // O₂ 2py
        ],
      },
      {
        name: '1π_u (z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.25, c:  0.60 },  // C 2pz
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.40 },  // O₁ 2pz
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.40 },  // O₂ 2pz
        ],
      },
      {
        name: '1π_g (O lone pair, y)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.707 },  // O₁ 2py
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.707 },  // O₂ 2py
        ],
      },
      {
        name: '1π_g (O lone pair, z)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.707 },  // O₁ 2pz
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.707 },  // O₂ 2pz
        ],
      },
    ],
  },

  // ═══════════════════ C₂H₄ — Ethylene ═══════════════════
  // Classic π bond example. C=C double bond = σ + π.
  // Atoms: C₁(-0.67,0,0) C₂(0.67,0,0) H₁(-1.24,0.93,0) H₂(-1.24,-0.93,0)
  //        H₃(1.24,0.93,0) H₄(1.24,-0.93,0)
  // Molecule is in xy plane. π bond lobes above/below in z.
  'C₂H₄': {
    orbitals: [
      {
        name: 'σ_CC (C-C σ)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.50 },  // C₁ 2px (along bond)
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.50 },  // C₂ 2px
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.25, c: -0.35 },  // C₁ 2s
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.25, c: -0.35 },  // C₂ 2s
        ],
      },
      {
        name: 'σ_CH (C₁-H)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.25, c:  0.55 },  // C₁ 2py (toward Hs)
          { atom: 2, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.42 },  // H₁
          { atom: 3, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.42 },  // H₂
        ],
      },
      {
        name: 'σ_CH\' (C₂-H)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.25, c:  0.55 },  // C₂ 2py
          { atom: 4, n: 1, l: 0, m: 0,  zeff: 1.24, c:  0.42 },  // H₃
          { atom: 5, n: 1, l: 0, m: 0,  zeff: 1.24, c: -0.42 },  // H₄
        ],
      },
      {
        name: 'π (C=C π bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.25, c:  0.707 },  // C₁ 2pz (⊥ to plane)
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.25, c:  0.707 },  // C₂ 2pz
        ],
      },
      {
        name: 'π* (C=C π* antibond)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.25, c:  0.707 },  // C₁ 2pz
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.25, c: -0.707 },  // C₂ 2pz
        ],
      },
    ],
  },

  // ═══════════════════ NaCl — Sodium Chloride ═══════════════════
  // Ionic bond. Electrons almost entirely on Cl.
  // Atoms: Na(-1.18,0,0) Cl(1.18,0,0)
  'NaCl': {
    orbitals: [
      {
        name: 'σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.20, c:  0.15 },  // Na 3s (tiny contribution)
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.90 },  // Cl 3px (almost all on Cl)
        ],
      },
      {
        name: 'Cl 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ O₂ — Oxygen (Paramagnetic!) ═══════════════════
  // 16e. Two unpaired electrons in degenerate π* orbitals → paramagnetic.
  // Bond along x-axis. Atoms: O₁(-0.6,0,0) O₂(0.6,0,0)
  // Bond order = (8 bonding − 4 antibonding)/2 = 2 (double bond)
  'O₂': {
    orbitals: [
      {
        name: '2σg',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.707 },
        ],
      },
      {
        name: '2σ*u',
        type: 'antibonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: '3σg',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: '1πu (y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
      {
        name: '1πu (z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
        ],
      },
      {
        name: '1π*g (y) ↑',
        type: 'antibonding',
        electrons: 1,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: '1π*g (z) ↑',
        type: 'antibonding',
        electrons: 1,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ F₂ — Fluorine Gas ═══════════════════
  // 18e. All π* filled → weak single bond. Bond order 1.
  // Atoms: F₁(-0.71,0,0) F₂(0.71,0,0)
  'F₂': {
    orbitals: [
      {
        name: '2σg',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 5.13, c:  0.707 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 5.13, c:  0.707 },
        ],
      },
      {
        name: '2σ*u',
        type: 'antibonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 5.13, c:  0.707 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 5.13, c: -0.707 },
        ],
      },
      {
        name: '3σg',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.707 },
        ],
      },
      {
        name: '1πu (y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: '1πu (z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: '1π*g (y)',
        type: 'antibonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 5.13, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: -0.707 },
        ],
      },
      {
        name: '1π*g (z)',
        type: 'antibonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 5.13, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: -0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ CO — Carbon Monoxide ═══════════════════
  // 14e, isoelectronic with N₂. 5σ HOMO is the C lone pair (σ-donor).
  // Atoms: C(-0.56,0,0) O(0.56,0,0)
  'CO': {
    orbitals: [
      {
        name: '3σ (O inner)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.90 },
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.25, c: 0.20 },
        ],
      },
      {
        name: '4σ (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.25, c:  0.65 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: -0.55 },
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.35 },
        ],
      },
      {
        name: '1π (y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.25, c: 0.55 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.63 },
        ],
      },
      {
        name: '1π (z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.25, c: 0.55 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.63 },
        ],
      },
      {
        name: '5σ (C lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.25, c: -0.80 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.30 },
        ],
      },
    ],
  },

  // ═══════════════════ LiF — Lithium Fluoride ═══════════════════
  // 12e. Highly ionic (>90% on F). One of the most polar diatomics.
  // Atoms: Li(-0.8,0,0) F(0.8,0,0)
  'LiF': {
    orbitals: [
      {
        name: '1σ (Li core)',
        type: 'core',
        electrons: 2,
        ao: [
          { atom: 0, n: 1, l: 0, m: 0, zeff: 2.70, c: 1.0 },
        ],
      },
      {
        name: '2σ (F 2s)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 5.13, c: 0.95 },
          { atom: 0, n: 2, l: 0, m: 0, zeff: 1.30, c: 0.10 },
        ],
      },
      {
        name: '3σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.92 },
          { atom: 0, n: 2, l: 0, m: 0, zeff: 1.30, c: 0.25 },
        ],
      },
      {
        name: '1π (F lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: '1π\' (F lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ Cl₂ — Chlorine Gas ═══════════════════
  // 34e total, showing 3s3p valence (14e). Bond order 1.
  // Atoms: Cl₁(-0.99,0,0) Cl₂(0.99,0,0)
  'Cl₂': {
    orbitals: [
      {
        name: '3σg',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 6.12, c:  0.707 },
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c:  0.707 },
        ],
      },
      {
        name: '3σ*u',
        type: 'antibonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 6.12, c:  0.707 },
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: -0.707 },
        ],
      },
      {
        name: '4σg',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.707 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.707 },
        ],
      },
      {
        name: '1πu (y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: '1πu (z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: '1π*g (y)',
        type: 'antibonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c:  0.707 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: -0.707 },
        ],
      },
      {
        name: '1π*g (z)',
        type: 'antibonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c:  0.707 },
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: -0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ HBr — Hydrobromic Acid ═══════════════════
  // 36e total, showing valence (8e). Completes H-halide series.
  // Atoms: H(-0.71,0,0) Br(0.71,0,0)
  'HBr': {
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 4, l: 1, m: 1, zeff: 7.60, c: 0.70 },
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.52 },
        ],
      },
      {
        name: '1π (Br lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 4, l: 1, m: -1, zeff: 7.60, c: 1.0 },
        ],
      },
      {
        name: '1π\' (Br lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 4, l: 1, m: 0, zeff: 7.60, c: 1.0 },
        ],
      },
      {
        name: 'Br 4s (inner)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 4, l: 0, m: 0, zeff: 7.60, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ NaF — Sodium Fluoride ═══════════════════
  // Strongly ionic. Almost all electron density on F.
  // Atoms: Na(-0.96,0,0) F(0.96,0,0)
  'NaF': {
    orbitals: [
      {
        name: '2σ (F 2s)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 5.13, c: 0.96 },
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.20, c: 0.08 },
        ],
      },
      {
        name: 'σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.93 },
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.20, c: 0.20 },
        ],
      },
      {
        name: 'F 2py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ O₃ — Ozone ═══════════════════
  // 18 valence e. Delocalized π system: bonding π + nonbonding π.
  // Bent: O₁(-1.08,0.34,0) O₂(0,0,0) O₃(1.08,0.34,0) — mol in xy plane.
  // π system uses pz (m=0, perpendicular to molecular plane).
  'O₃': {
    orbitals: [
      {
        name: 'π₁ (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.50 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.50 },
        ],
      },
      {
        name: 'π₂ (nonbonding)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: 'σ₁ (O-O bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.55 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.60 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
        ],
      },
      {
        name: 'σ₂ (O-O bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.65 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.55 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.85 },
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.40 },
        ],
      },
      {
        name: 'O₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.85 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.40 },
        ],
      },
      {
        name: 'Central O lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'π* (empty)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.50 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.50 },
        ],
      },
    ],
  },

  // ═══════════════════ H₂S — Hydrogen Sulfide ═══════════════════
  // 18e total, valence 8e. Bent like H₂O but 92° bond angle.
  // Atoms: S(0,0,0) H₁(-0.96,0.58,0) H₂(0.96,0.58,0) — mol in xy plane
  'H₂S': {
    orbitals: [
      {
        name: '2a₁ (inner valence)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 5.45, c: 0.75 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.35 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.35 },
        ],
      },
      {
        name: '1b₂ (S-H bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 5.45, c: 0.50 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c:-0.50 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.50 },
        ],
      },
      {
        name: '3a₁ (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 5.45, c: 0.85 },
          { atom: 0, n: 3, l: 0, m: 0, zeff: 5.45, c: 0.35 },
        ],
      },
      {
        name: '1b₁ (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 5.45, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ SO₂ — Sulfur Dioxide ═══════════════════
  // 32e total, showing valence (18e). Bent, resonance structures.
  // Atoms: S(0,0,0) O₁(-1.05,0.6,0) O₂(1.05,0.6,0) — mol in xy plane
  // π uses pz (m=0). Zeff: S 3s/3p=5.45, O 2s/2p=4.45
  'SO₂': {
    orbitals: [
      {
        name: 'π₁ (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 5.45, c:  0.60 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.55 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.55 },
        ],
      },
      {
        name: 'π₂ (nonbonding)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: 'σ₁ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 5.45, c:  0.50 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.55 },
        ],
      },
      {
        name: 'σ₂ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 5.45, c:  0.60 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.50 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.50 },
        ],
      },
      {
        name: 'S lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 5.45, c: 0.90 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'π* (empty)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 5.45, c: -0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.50 },
        ],
      },
    ],
  },

  // ═══════════════════ N₂O — Nitrous Oxide ═══════════════════
  // 22e. Linear N=N=O. Asymmetric — interesting MO structure.
  // Atoms: N₁(-1.13,0,0) N₂(0,0,0) O(1.19,0,0)
  'N₂O': {
    orbitals: [
      {
        name: '4σ (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.90, c: 0.45 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.90, c: 0.55 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: '5σ (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.90, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.90, c: -0.20 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.60 },
        ],
      },
      {
        name: '1π (y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.90, c: 0.45 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.90, c: 0.60 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: '1π (z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.90, c: 0.45 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.90, c: 0.60 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: '6σ (N₁ lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.90, c: -0.80 },
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.90, c:  0.40 },
        ],
      },
      {
        name: '2π (y, nonbonding)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.90, c:  0.65 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.65 },
        ],
      },
      {
        name: '2π (z, nonbonding)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.90, c:  0.65 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.65 },
        ],
      },
    ],
  },

  // ═══════════════════ BeCl₂ — Beryllium Chloride ═══════════════════
  // Linear, sp hybridized Be. 3c bonding.
  // Atoms: Cl₁(-1.75,0,0) Be(0,0,0) Cl₂(1.75,0,0)
  'BeCl₂': {
    orbitals: [
      {
        name: 'σg (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 1.95, c:  0.55 },
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.50 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.50 },
        ],
      },
      {
        name: 'σu (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 1.95, c:  0.55 },
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.50 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.50 },
        ],
      },
      {
        name: 'Cl₁ π (y)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₁ π (z)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₂ π (y)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₂ π (z)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₁ 3s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₂ 3s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 3, l: 0, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ XeF₂ — Xenon Difluoride ═══════════════════
  // Noble gas compound! 3-center-4-electron bond (hypervalent).
  // Linear: F₁(-1.5,0,0) Xe(0,0,0) F₂(1.5,0,0)
  'XeF₂': {
    orbitals: [
      {
        name: '3c-σ (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.50 },
          { atom: 1, n: 5, l: 1, m: 1, zeff: 8.25, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.50 },
        ],
      },
      {
        name: '3c-nb (nonbonding)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.707 },
        ],
      },
      {
        name: 'F₁ lone pair (y)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₁ lone pair (z)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₂ lone pair (y)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₂ lone pair (z)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'Xe 5s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 5, l: 0, m: 0, zeff: 8.25, c: 1.0 },
        ],
      },
      {
        name: 'Xe 5py',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 5, l: 1, m: -1, zeff: 8.25, c: 1.0 },
        ],
      },
      {
        name: 'Xe 5pz',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 5, l: 1, m: 0, zeff: 8.25, c: 1.0 },
        ],
      },
      {
        name: '3c-σ* (empty)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.50 },
          { atom: 1, n: 5, l: 1, m: 1, zeff: 8.25, c: -0.707 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.50 },
        ],
      },
    ],
  },

  // ═══════════════════ SiO₂ — Silicon Dioxide (linear) ═══════════════════
  // Linear O=Si=O. Si uses sp hybrid + two π bonds.
  // Atoms: O₁(-1.16,0,0) Si(0,0,0) O₂(1.16,0,0)
  'SiO₂': {
    orbitals: [
      {
        name: 'σg (Si-O bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 4.15, c:  0.55 },
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.50 },
        ],
      },
      {
        name: 'σu (Si-O bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 1, zeff: 4.15, c:  0.55 },
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.50 },
        ],
      },
      {
        name: '1πu (y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 4.15, c: 0.55 },
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: '1πu (z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 4.15, c: 0.55 },
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.85 },
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.40 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.85 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.40 },
        ],
      },
    ],
  },

  // ═══════════════════ BF₃ — Boron Trifluoride ═══════════════════
  // 24 valence e. Trigonal planar, empty p orbital → Lewis acid.
  // B(0,0,0) F₁(1.3,0,0) F₂(-0.65,1.13,0) F₃(-0.65,-1.13,0) — mol in xy
  'BF₃': {
    orbitals: [
      {
        name: 'a₁\' (σ symmetric)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 2.60, c:  0.60 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.40 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.30 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.30 },
        ],
      },
      {
        name: 'e\' (σ, x)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 2.60, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.30 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.30 },
        ],
      },
      {
        name: 'e\' (σ, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 2.60, c: 0.55 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.55 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 5.13, c:-0.55 },
        ],
      },
      {
        name: 'F₁ lone pairs',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₂ lone pairs',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 0, m: 0, zeff: 5.13, c: 0.85 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.40 },
        ],
      },
      {
        name: 'F₃ lone pairs',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 3, n: 2, l: 0, m: 0, zeff: 5.13, c: 0.85 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.40 },
        ],
      },
      {
        name: 'F 2s (inner)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 5.13, c: 0.58 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.45 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.45 },
        ],
      },
      {
        name: 'F pz (lone pairs)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.58 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.58 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.58 },
        ],
      },
      {
        name: 'a₂\'\' (empty B pz)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 2.60, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: -0.30 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 5.13, c: -0.30 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 5.13, c: -0.30 },
        ],
      },
    ],
  },

  // ═══════════════════ C₂H₂ — Acetylene ═══════════════════
  // 14e. Triple bond: 1σ + 2π. Linear molecule.
  // C₁(-0.6,0,0) C₂(0.6,0,0) H₁(-1.66,0,0) H₂(1.66,0,0)
  'C₂H₂': {
    orbitals: [
      {
        name: '2σg (C-H bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.25, c:  0.50 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.25, c:  0.50 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.45 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.45 },
        ],
      },
      {
        name: '2σu (C-H bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.25, c:  0.50 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.25, c: -0.50 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.45 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c: -0.45 },
        ],
      },
      {
        name: '3σg (C≡C σ)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.25, c: -0.707 },
        ],
      },
      {
        name: '1πu (y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.25, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.25, c: 0.707 },
        ],
      },
      {
        name: '1πu (z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.25, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.25, c: 0.707 },
        ],
      },
      {
        name: '1π*g (y)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.25, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.25, c: -0.707 },
        ],
      },
      {
        name: '1π*g (z)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.25, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.25, c: -0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ PH₃ — Phosphine ═══════════════════
  // 18e total, 8 valence. Pyramidal like NH₃. Lone pair on P.
  // P(0,0,0.14) H₁(0,1.02,-0.42) H₂(0.88,-0.51,-0.42) H₃(-0.88,-0.51,-0.42)
  'PH₃': {
    orbitals: [
      {
        name: '2a₁ (inner valence)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 4.80, c: 0.70 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.35 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.35 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.35 },
        ],
      },
      {
        name: '1e (P-H bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 4.80, c: 0.55 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.50 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c:-0.50 },
        ],
      },
      {
        name: '1e\' (P-H bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 4.80, c: 0.55 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.55 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c:-0.28 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c:-0.28 },
        ],
      },
      {
        name: '3a₁ (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 4.80, c: 0.85 },
          { atom: 0, n: 3, l: 0, m: 0, zeff: 4.80, c: 0.35 },
        ],
      },
    ],
  },

  // ═══════════════════ SO₃ — Sulfur Trioxide ═══════════════════
  // Trigonal planar. Delocalized π system.
  // S(0,0,0) O₁(1.2,0,0) O₂(-0.6,1.04,0) O₃(-0.6,-1.04,0) — mol in xy
  'SO₃': {
    orbitals: [
      {
        name: 'a₁\' (σ framework)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 5.45, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.45 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.30 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.30 },
        ],
      },
      {
        name: 'e\' (σ, x)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 5.45, c:  0.50 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.30 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.30 },
        ],
      },
      {
        name: 'e\' (σ, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 5.45, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.55 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c:-0.55 },
        ],
      },
      {
        name: 'a₂\'\' (π bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 5.45, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.45 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.45 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.45 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.85 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.40 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.85 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.40 },
        ],
      },
      {
        name: 'O₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 3, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.85 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.40 },
        ],
      },
      {
        name: 'O pz (lone pairs)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:-0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ H₂O₂ — Hydrogen Peroxide ═══════════════════
  // 18e. O-O single bond + lone pairs. Gauche conformation.
  // O₁(-0.37,0.33,0.2) O₂(0.37,-0.33,0.2) H₁(-0.85,-0.28,-0.3) H₂(0.85,0.28,-0.3)
  'H₂O₂': {
    orbitals: [
      {
        name: 'σ (O-O bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.55 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.55 },
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.40 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.40 },
        ],
      },
      {
        name: 'σ (O₁-H₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.65 },
        ],
      },
      {
        name: 'σ (O₂-H₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.65 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.90 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.90 },
        ],
      },
    ],
  },

  // ═══════════════════ SiH₄ — Silane ═══════════════════
  // 18e total, 8 valence. Tetrahedral like CH₄.
  // Si(0,0,0) H₁(0.85,0.85,0.85) H₂(-0.85,-0.85,0.85)
  // H₃(-0.85,0.85,-0.85) H₄(0.85,-0.85,-0.85)
  'SiH₄': {
    orbitals: [
      {
        name: '2a₁ (inner valence)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 4.15, c: 0.70 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.32 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.32 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.32 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.32 },
        ],
      },
      {
        name: '1t₂ (bond, x)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 4.15, c: 0.60 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.40 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c:-0.40 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c:-0.40 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.40 },
        ],
      },
      {
        name: '1t₂ (bond, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 4.15, c: 0.60 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.40 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c:-0.40 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.40 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.24, c:-0.40 },
        ],
      },
      {
        name: '1t₂ (bond, z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 4.15, c: 0.60 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.40 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.40 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c:-0.40 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.24, c:-0.40 },
        ],
      },
    ],
  },

  // ═══════════════════ B₂H₆ — Diborane ═══════════════════
  // 12e. Famous 3-center-2-electron bonds! Electron-deficient.
  // B₁(-0.88,0,0) B₂(0.88,0,0) Ht₁(-1.6,0.8,0) Ht₂(-1.6,-0.8,0)
  // Hbr₁(0,0.5,0) Hbr₂(0,-0.5,0) Ht₃(1.6,0.8,0) Ht₄(1.6,-0.8,0)
  'B₂H₆': {
    orbitals: [
      {
        name: 'σg (B-Ht sym)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 2.60, c:  0.45 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 2.60, c:  0.45 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.35 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.35 },
          { atom: 6, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.35 },
          { atom: 7, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.35 },
        ],
      },
      {
        name: 'σu (B-Ht anti)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 2.60, c:  0.45 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 2.60, c: -0.45 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.35 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.35 },
          { atom: 6, n: 1, l: 0, m: 0, zeff: 1.24, c: -0.35 },
          { atom: 7, n: 1, l: 0, m: 0, zeff: 1.24, c: -0.35 },
        ],
      },
      {
        name: 'B-Ht (py)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 2.60, c: 0.55 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 2.60, c: 0.55 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.35 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c: -0.35 },
          { atom: 6, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.35 },
          { atom: 7, n: 1, l: 0, m: 0, zeff: 1.24, c: -0.35 },
        ],
      },
      {
        name: '3c2e bridge (sym)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 2.60, c: 0.50 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 2.60, c: 0.50 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.55 },
          { atom: 5, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.55 },
        ],
      },
      {
        name: '3c2e bridge (anti)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 2.60, c:  0.50 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 2.60, c: -0.50 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
          { atom: 5, n: 1, l: 0, m: 0, zeff: 1.24, c: -0.55 },
        ],
      },
      {
        name: 'B pz (empty)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 2.60, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 2.60, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ NO₂ — Nitrogen Dioxide ═══════════════════
  // 23e total — radical! Bent 134°. Valence: 17e (odd).
  // Atoms: N(0,0,0) O₁(-1.0,0.65,0) O₂(1.0,0.65,0) — mol in xy plane
  // π uses pz (m=0). Zeff: N 2s/2p=3.90, O 2s/2p=4.45
  'NO₂': {
    orbitals: [
      {
        name: 'σ₁ (s framework)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.90, c:  0.55 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.50 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.50 },
        ],
      },
      {
        name: 'σ₂ (N-O bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.90, c:  0.50 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.55 },
        ],
      },
      {
        name: 'π (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.90, c:  0.60 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.55 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.55 },
        ],
      },
      {
        name: 'π (nonbonding)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: 'N lone pair (y)',
        type: 'nonbonding',
        electrons: 1,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.90, c: 0.90 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'σ (N-O antibond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.90, c:  0.60 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.40 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.40 },
        ],
      },
      {
        name: 'π* (empty)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.90, c: -0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.50 },
        ],
      },
    ],
  },

  // ═══════════════════ Li₂O — Lithium Oxide ═══════════════════
  // 14e total. Bent. Strongly ionic: Li⁺ Li⁺ O²⁻
  // Atoms: Li₁(-1.0,0.5,0) O(0,0,0) Li₂(1.0,0.5,0)
  'Li₂O': {
    orbitals: [
      {
        name: 'σ₁ (ionic bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.85 },
          { atom: 0, n: 2, l: 0, m: 0, zeff: 1.30, c:  0.15 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 1.30, c:  0.15 },
        ],
      },
      {
        name: 'σ₂ (ionic bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.85 },
          { atom: 0, n: 2, l: 0, m: 0, zeff: 1.30, c:  0.15 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 1.30, c: -0.15 },
        ],
      },
      {
        name: 'O 2py',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'Li₁ 1s (core)',
        type: 'core',
        electrons: 2,
        ao: [
          { atom: 0, n: 1, l: 0, m: 0, zeff: 2.70, c: 1.0 },
        ],
      },
      {
        name: 'Li₂ 1s (core)',
        type: 'core',
        electrons: 2,
        ao: [
          { atom: 2, n: 1, l: 0, m: 0, zeff: 2.70, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ BeO — Beryllium Oxide ═══════════════════
  // 12e total. Polar diatomic, bond along x.
  // Atoms: Be(-0.65,0,0) O(0.65,0,0). Zeff: Be 2s=1.95, O 2s/2p=4.45
  'BeO': {
    orbitals: [
      {
        name: 'σ (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 1.95, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (bonding, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 1.95, c:  0.40 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.80 },
        ],
      },
      {
        name: 'π (bonding, z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 1.95, c:  0.40 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.80 },
        ],
      },
      {
        name: 'O 2s (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.90 },
        ],
      },
      {
        name: 'σ* (empty)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 1.95, c:  0.75 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.45 },
        ],
      },
    ],
  },

  // ═══════════════════ MgO — Magnesium Oxide ═══════════════════
  // 20e total. Ionic diatomic, bond along x.
  // Atoms: Mg(-0.87,0,0) O(0.87,0,0). Zeff: Mg 3s=2.85, O 2s/2p=4.45
  'MgO': {
    orbitals: [
      {
        name: 'σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.85, c:  0.20 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.88 },
        ],
      },
      {
        name: 'O 2py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ CaO — Calcium Oxide ═══════════════════
  // 28e total. Ionic diatomic, bond along x.
  // Atoms: Ca(-0.96,0,0) O(0.96,0,0). Zeff: Ca 4s=2.85, O 2s/2p=4.45
  'CaO': {
    orbitals: [
      {
        name: 'σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 2.85, c:  0.18 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.90 },
        ],
      },
      {
        name: 'O 2py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ KCl — Potassium Chloride ═══════════════════
  // 36e total. Ionic, bond along x.
  // Atoms: K(-1.33,0,0) Cl(1.33,0,0). Zeff: K 4s=2.20, Cl 3s/3p=6.12
  'KCl': {
    orbitals: [
      {
        name: 'σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 2.20, c:  0.12 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.92 },
        ],
      },
      {
        name: 'Cl 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ RbCl — Rubidium Chloride ═══════════════════
  // 54e total. Ionic, bond along x.
  // Atoms: Rb(-1.30,0,0) Cl(1.30,0,0). Zeff: Rb 5s=2.20, Cl 3s/3p=6.12
  'RbCl': {
    orbitals: [
      {
        name: 'σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 2.20, c:  0.10 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.93 },
        ],
      },
      {
        name: 'Cl 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ CsCl — Cesium Chloride ═══════════════════
  // 72e total. Ionic, bond along x.
  // Atoms: Cs(-1.5,0,0) Cl(1.5,0,0). Zeff: Cs 6s=2.20, Cl 3s/3p=6.12
  'CsCl': {
    orbitals: [
      {
        name: 'σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 2.20, c:  0.08 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.94 },
        ],
      },
      {
        name: 'Cl 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ AgCl — Silver Chloride ═══════════════════
  // 64e total. Ionic/covalent mix. Bond along x.
  // Atoms: Ag(-1.2,0,0) Cl(1.2,0,0). Zeff: Ag 5s=4.25, Cl 3s/3p=6.12
  'AgCl': {
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.25, c:  0.30 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.80 },
        ],
      },
      {
        name: 'Cl 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Ag 5s (antibond)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.25, c:  0.80 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.30 },
        ],
      },
    ],
  },

  // ═══════════════════ Br₂ — Bromine Gas ═══════════════════
  // 70e total. Homonuclear halogen, bond along x.
  // Atoms: Br₁(-1.14,0,0) Br₂(1.14,0,0). Zeff: Br 4s/4p=7.60
  'Br₂': {
    orbitals: [
      {
        name: 'σg (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: 1, zeff: 7.60, c:  0.707 },
          { atom: 1, n: 4, l: 1, m: 1, zeff: 7.60, c: -0.707 },
        ],
      },
      {
        name: 'πu (bonding, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: -1, zeff: 7.60, c:  0.707 },
          { atom: 1, n: 4, l: 1, m: -1, zeff: 7.60, c:  0.707 },
        ],
      },
      {
        name: 'πu (bonding, z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 7.60, c:  0.707 },
          { atom: 1, n: 4, l: 1, m: 0, zeff: 7.60, c:  0.707 },
        ],
      },
      {
        name: 'πg* (antibond, y)',
        type: 'antibonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: -1, zeff: 7.60, c:  0.707 },
          { atom: 1, n: 4, l: 1, m: -1, zeff: 7.60, c: -0.707 },
        ],
      },
      {
        name: 'πg* (antibond, z)',
        type: 'antibonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 7.60, c:  0.707 },
          { atom: 1, n: 4, l: 1, m: 0, zeff: 7.60, c: -0.707 },
        ],
      },
      {
        name: 'σg (4s bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 7.60, c:  0.707 },
          { atom: 1, n: 4, l: 0, m: 0, zeff: 7.60, c:  0.707 },
        ],
      },
      {
        name: 'σu* (antibond)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 4, l: 1, m: 1, zeff: 7.60, c:  0.707 },
          { atom: 1, n: 4, l: 1, m: 1, zeff: 7.60, c:  0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ I₂ — Iodine Gas ═══════════════════
  // 106e total. Homonuclear halogen, bond along x.
  // Atoms: I₁(-1.33,0,0) I₂(1.33,0,0). Zeff: I 5s/5p=7.00
  'I₂': {
    orbitals: [
      {
        name: 'σg (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 7.00, c:  0.707 },
          { atom: 1, n: 5, l: 1, m: 1, zeff: 7.00, c: -0.707 },
        ],
      },
      {
        name: 'πu (bonding, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: -1, zeff: 7.00, c:  0.707 },
          { atom: 1, n: 5, l: 1, m: -1, zeff: 7.00, c:  0.707 },
        ],
      },
      {
        name: 'πu (bonding, z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: 0, zeff: 7.00, c:  0.707 },
          { atom: 1, n: 5, l: 1, m: 0, zeff: 7.00, c:  0.707 },
        ],
      },
      {
        name: 'πg* (antibond, y)',
        type: 'antibonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: -1, zeff: 7.00, c:  0.707 },
          { atom: 1, n: 5, l: 1, m: -1, zeff: 7.00, c: -0.707 },
        ],
      },
      {
        name: 'πg* (antibond, z)',
        type: 'antibonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: 0, zeff: 7.00, c:  0.707 },
          { atom: 1, n: 5, l: 1, m: 0, zeff: 7.00, c: -0.707 },
        ],
      },
      {
        name: 'σg (5s bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 7.00, c:  0.707 },
          { atom: 1, n: 5, l: 0, m: 0, zeff: 7.00, c:  0.707 },
        ],
      },
      {
        name: 'σu* (empty)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 7.00, c:  0.707 },
          { atom: 1, n: 5, l: 1, m: 1, zeff: 7.00, c:  0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ GaAs — Gallium Arsenide ═══════════════════
  // 64e total. Semiconductor! Polar covalent, bond along x.
  // Atoms: Ga(-1.12,0,0) As(1.12,0,0). Zeff: Ga 4s/4p=5.00, As 4s/4p=5.80
  'GaAs': {
    orbitals: [
      {
        name: 'σ (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: 1, zeff: 5.00, c:  0.55 },
          { atom: 1, n: 4, l: 1, m: 1, zeff: 5.80, c: -0.65 },
        ],
      },
      {
        name: 'π (bonding, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: -1, zeff: 5.00, c:  0.50 },
          { atom: 1, n: 4, l: 1, m: -1, zeff: 5.80, c:  0.70 },
        ],
      },
      {
        name: 'π (bonding, z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 5.00, c:  0.50 },
          { atom: 1, n: 4, l: 1, m: 0, zeff: 5.80, c:  0.70 },
        ],
      },
      {
        name: 'As lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 4, l: 0, m: 0, zeff: 5.80, c: 0.90 },
        ],
      },
      {
        name: 'Ga 4s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 5.00, c: 1.0 },
        ],
      },
      {
        name: 'σ* (empty)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 4, l: 1, m: 1, zeff: 5.00, c:  0.65 },
          { atom: 1, n: 4, l: 1, m: 1, zeff: 5.80, c:  0.55 },
        ],
      },
    ],
  },

  // ═══════════════════ CdS — Cadmium Sulfide ═══════════════════
  // 64e total. Semiconductor. Ionic-covalent, bond along x.
  // Atoms: Cd(-1.16,0,0) S(1.16,0,0). Zeff: Cd 5s=4.55, S 3s/3p=5.45
  'CdS': {
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.55, c:  0.30 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 5.45, c:  0.80 },
        ],
      },
      {
        name: 'S 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 5.45, c: 1.0 },
        ],
      },
      {
        name: 'S 3pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 5.45, c: 1.0 },
        ],
      },
      {
        name: 'S 3s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 5.45, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ ZnO — Zinc Oxide ═══════════════════
  // 38e total. Wide-bandgap semiconductor. Bond along x.
  // Atoms: Zn(-0.85,0,0) O(0.85,0,0). Zeff: Zn 4s=4.35, O 2s/2p=4.45
  'ZnO': {
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 4.35, c:  0.30 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.80 },
        ],
      },
      {
        name: 'O 2py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ ZnS — Zinc Sulfide ═══════════════════
  // 46e total. Semiconductor (sphalerite). Bond along x.
  // Atoms: Zn(-1.0,0,0) S(1.0,0,0). Zeff: Zn 4s=4.35, S 3s/3p=5.45
  'ZnS': {
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 4.35, c:  0.30 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 5.45, c:  0.80 },
        ],
      },
      {
        name: 'S 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 5.45, c: 1.0 },
        ],
      },
      {
        name: 'S 3pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 5.45, c: 1.0 },
        ],
      },
      {
        name: 'S 3s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 5.45, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ FeO — Iron(II) Oxide ═══════════════════
  // 34e total. Transition metal oxide. Bond along x.
  // Atoms: Fe(-0.85,0,0) O(0.85,0,0). Zeff: Fe 3d=6.25, 4s=3.75, O 2s/2p=4.45
  'FeO': {
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.75, c:  0.35 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (d-p bond, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: -1, zeff: 6.25, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (d-p bond, z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: 1, zeff: 6.25, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'Fe dxy',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: -2, zeff: 6.25, c: 1.0 },
        ],
      },
      {
        name: 'Fe dx²-y²',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: 2, zeff: 6.25, c: 1.0 },
        ],
      },
      {
        name: 'Fe dz²',
        type: 'nonbonding',
        electrons: 1,
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 6.25, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ NiO — Nickel(II) Oxide ═══════════════════
  // 36e total. Antiferromagnetic insulator. Bond along x.
  // Atoms: Ni(-0.85,0,0) O(0.85,0,0). Zeff: Ni 3d=7.55, 4s=4.05, O 2s/2p=4.45
  'NiO': {
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 4.05, c:  0.35 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (d-p bond, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: -1, zeff: 7.55, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (d-p bond, z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: 1, zeff: 7.55, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'Ni dxy',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: -2, zeff: 7.55, c: 1.0 },
        ],
      },
      {
        name: 'Ni dx²-y²',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: 2, zeff: 7.55, c: 1.0 },
        ],
      },
      {
        name: 'Ni dz²',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 7.55, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ CuO — Copper(II) Oxide ═══════════════════
  // 37e total. Bond along x.
  // Atoms: Cu(-0.85,0,0) O(0.85,0,0). Zeff: Cu 3d=7.85, 4s=3.70, O 2s/2p=4.45
  'CuO': {
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.70, c:  0.35 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (d-p bond, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: -1, zeff: 7.85, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (d-p bond, z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: 1, zeff: 7.85, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'Cu dxy',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: -2, zeff: 7.85, c: 1.0 },
        ],
      },
      {
        name: 'Cu dx²-y²',
        type: 'nonbonding',
        electrons: 1,
        ao: [
          { atom: 0, n: 3, l: 2, m: 2, zeff: 7.85, c: 1.0 },
        ],
      },
      {
        name: 'Cu dz²',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 7.85, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ PbO — Lead(II) Oxide ═══════════════════
  // 90e total. Heavy p-block oxide. Bond along x.
  // Atoms: Pb(-0.95,0,0) O(0.95,0,0). Zeff: Pb 6s/6p=6.50, O 2s/2p=4.45
  'PbO': {
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 1, m: 1, zeff: 6.50, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'Pb 6s (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 6.50, c: 1.0 },
        ],
      },
      {
        name: 'O 2py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ WC — Tungsten Carbide ═══════════════════
  // 80e total. Ultra-hard material. Bond along x.
  // Atoms: W(-0.8,0,0) C(0.8,0,0). Zeff: W 5d=8.50, 6s=4.35, C 2s/2p=3.25
  'WC': {
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.35, c:  0.40 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.70 },
        ],
      },
      {
        name: 'π (d-p bond, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: -1, zeff: 8.50, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.25, c:  0.65 },
        ],
      },
      {
        name: 'π (d-p bond, z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: 1, zeff: 8.50, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.25, c:  0.65 },
        ],
      },
      {
        name: 'C 2s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.25, c: 1.0 },
        ],
      },
      {
        name: 'W dxy',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: -2, zeff: 8.50, c: 1.0 },
        ],
      },
      {
        name: 'W dx²-y²',
        type: 'nonbonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 5, l: 2, m: 2, zeff: 8.50, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ NaOH — Sodium Hydroxide ═══════════════════
  // 20e total. Ionic + O-H covalent. Na almost fully ionized.
  // Atoms: Na(-1.4,0,0) O(0,0,0) H(0.48,0.48,0)
  'NaOH': {
    orbitals: [
      {
        name: 'σ (O-H bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.30 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
        ],
      },
      {
        name: 'σ (Na-O ionic)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.85 },
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.20, c:  0.10 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ LiOH — Lithium Hydroxide ═══════════════════
  // 12e total. Ionic Li + covalent O-H.
  // Atoms: Li(-1.2,0,0) O(0,0,0) H(0.48,0.48,0)
  'LiOH': {
    orbitals: [
      {
        name: 'σ (O-H bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.30 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
        ],
      },
      {
        name: 'σ (Li-O ionic)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.85 },
          { atom: 0, n: 2, l: 0, m: 0, zeff: 1.30, c:  0.12 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'Li 1s (core)',
        type: 'core',
        electrons: 2,
        ao: [
          { atom: 0, n: 1, l: 0, m: 0, zeff: 2.70, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ H₂Se — Hydrogen Selenide ═══════════════════
  // 36e total, valence 8e. Bent, like H₂S/H₂O.
  // Atoms: Se(0,0,0) H₁(-0.92,0.60,0) H₂(0.92,0.60,0) — mol in xy plane
  // Zeff: Se 4s/4p=6.20
  'H₂Se': {
    orbitals: [
      {
        name: 'σ₁ (Se-H bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: 1, zeff: 6.20, c:  0.55 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.50 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.50 },
        ],
      },
      {
        name: 'σ₂ (Se-H bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: -1, zeff: 6.20, c:  0.55 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.50 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c: -0.50 },
        ],
      },
      {
        name: 'Se lone pair (pz)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 6.20, c: 1.0 },
        ],
      },
      {
        name: 'Se 4s (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 6.20, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ H₂Te — Hydrogen Telluride ═══════════════════
  // 54e total, valence 8e. Bent, like H₂S.
  // Atoms: Te(0,0,0) H₁(-1.0,0.60,0) H₂(1.0,0.60,0) — mol in xy plane
  // Zeff: Te 5s/5p=6.55
  'H₂Te': {
    orbitals: [
      {
        name: 'σ₁ (Te-H bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 6.55, c:  0.55 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.50 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.50 },
        ],
      },
      {
        name: 'σ₂ (Te-H bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: -1, zeff: 6.55, c:  0.55 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.50 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c: -0.50 },
        ],
      },
      {
        name: 'Te lone pair (pz)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: 0, zeff: 6.55, c: 1.0 },
        ],
      },
      {
        name: 'Te 5s (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 6.55, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ SeO₂ — Selenium Dioxide ═══════════════════
  // 50e total. Bent like SO₂. Mol in xy plane.
  // Atoms: Se(0,0,0) O₁(1.0,0.5,0) O₂(-1.0,0.5,0). Zeff: Se 4s/4p=6.20, O=4.45
  'SeO₂': {
    orbitals: [
      {
        name: 'π₁ (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 6.20, c:  0.60 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.55 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.55 },
        ],
      },
      {
        name: 'π₂ (nonbonding)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: 'σ₁ (Se-O bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: 1, zeff: 6.20, c:  0.50 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.55 },
        ],
      },
      {
        name: 'σ₂ (Se-O bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 6.20, c:  0.60 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.50 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.50 },
        ],
      },
      {
        name: 'Se lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: -1, zeff: 6.20, c: 0.90 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'π* (empty)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 6.20, c: -0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.50 },
        ],
      },
    ],
  },

  // ═══════════════════ HArF — Argon Fluorohydride ═══════════════════
  // 28e total. Exotic noble gas compound! Linear: H-Ar-F along x.
  // Atoms: H(-1.3,0,0) Ar(0,0,0) F(1.3,0,0). Zeff: Ar 3s/3p=6.76, F=5.13
  'HArF': {
    orbitals: [
      {
        name: '3c-σ (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.40 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.76, c:  0.65 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.45 },
        ],
      },
      {
        name: '3c-σ₂ (Ar-F)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.76, c:  0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.70 },
        ],
      },
      {
        name: 'Ar 3s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.76, c: 1.0 },
        ],
      },
      {
        name: 'Ar 3py',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.76, c: 1.0 },
        ],
      },
      {
        name: 'Ar 3pz',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.76, c: 1.0 },
        ],
      },
      {
        name: 'F lone pair (y)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F lone pair (z)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ KrF₂ — Krypton Difluoride ═══════════════════
  // 54e total. Noble gas compound, 3c-4e bonds like XeF₂.
  // Atoms: F₁(-1.50,0,0) Kr(0,0,0) F₂(1.50,0,0). Zeff: Kr 4s/4p=8.25, F=5.13
  'KrF₂': {
    orbitals: [
      {
        name: '3c-σ (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.50 },
          { atom: 1, n: 4, l: 1, m: 1, zeff: 8.25, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.50 },
        ],
      },
      {
        name: '3c-nb (nonbonding)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.707 },
        ],
      },
      {
        name: 'F₁ lone pair (y)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₁ lone pair (z)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₂ lone pair (y)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₂ lone pair (z)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'Kr 4s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 4, l: 0, m: 0, zeff: 8.25, c: 1.0 },
        ],
      },
      {
        name: 'Kr 4py',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 4, l: 1, m: -1, zeff: 8.25, c: 1.0 },
        ],
      },
      {
        name: 'Kr 4pz',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 4, l: 1, m: 0, zeff: 8.25, c: 1.0 },
        ],
      },
      {
        name: '3c-σ* (empty)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.50 },
          { atom: 1, n: 4, l: 1, m: 1, zeff: 8.25, c: -0.707 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.50 },
        ],
      },
    ],
  },

  // ═══════════════════ MgCl₂ — Magnesium Chloride ═══════════════════
  // 46e total. Linear like BeCl₂. sp hybridized Mg.
  // Atoms: Cl₁(-1.8,0,0) Mg(0,0,0) Cl₂(1.8,0,0). Zeff: Mg 3s=2.85, Cl=6.12
  'MgCl₂': {
    orbitals: [
      {
        name: 'σg (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 2.85, c:  0.45 },
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.55 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.55 },
        ],
      },
      {
        name: 'σu (bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 1, zeff: 2.85, c:  0.45 },
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.55 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.55 },
        ],
      },
      {
        name: 'Cl₁ π (y)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₁ π (z)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₂ π (y)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₂ π (z)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₁ 3s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₂ 3s',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 3, l: 0, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ AlCl₃ — Aluminium Chloride ═══════════════════
  // 64e total. Trigonal planar, sp² hybridized Al. Like BF₃.
  // Al(0,0,0) Cl₁(1.4,0.8,0) Cl₂(-1.4,0.8,0) Cl₃(0,-1.2,0) — xy plane
  // Zeff: Al 3s/3p=3.50, Cl=6.12
  'AlCl₃': {
    orbitals: [
      {
        name: 'a₁\' (σ framework)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 3.50, c:  0.55 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.45 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.30 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.30 },
        ],
      },
      {
        name: 'e\' (σ, x)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 3.50, c:  0.50 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.55 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.30 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.30 },
        ],
      },
      {
        name: 'e\' (σ, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 3.50, c: 0.50 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.55 },
          { atom: 3, n: 3, l: 1, m: -1, zeff: 6.12, c:-0.55 },
        ],
      },
      {
        name: 'Cl₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 3, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl pz (lone pairs)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.58 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.58 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.58 },
        ],
      },
      {
        name: 'Al pz (empty)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 3.50, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ PCl₃ — Phosphorus Trichloride ═══════════════════
  // 66e total. Pyramidal like PH₃. P lone pair on top.
  // P(0,0,0.16) Cl₁(0,1.40,-0.48) Cl₂(1.21,-0.70,-0.48) Cl₃(-1.21,-0.70,-0.48)
  // Zeff: P 3s/3p=4.80, Cl=6.12
  'PCl₃': {
    orbitals: [
      {
        name: 'a₁ (σ bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 4.80, c:  0.50 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: -0.50 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.35 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.35 },
        ],
      },
      {
        name: 'e (σ bond, x)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 4.80, c:  0.50 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.55 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.55 },
        ],
      },
      {
        name: 'e (σ bond, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 4.80, c:  0.50 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: -0.65 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c:  0.30 },
          { atom: 3, n: 3, l: 1, m: -1, zeff: 6.12, c:  0.30 },
        ],
      },
      {
        name: 'P lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 4.80, c:  0.85 },
          { atom: 0, n: 3, l: 0, m: 0, zeff: 4.80, c:  0.35 },
        ],
      },
      {
        name: 'Cl₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 3, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.40 },
        ],
      },
    ],
  },

  // ═══════════════════ HNO₃ — Nitric Acid ═══════════════════
  // 32e total. Planar, 3 N-O bonds + O-H. Delocalized π.
  // N(0,0,0) O₁(1.05,0.65,0) O₂(-1.05,0.65,0) O₃(0,-1.0,0) H(0.7,-1.5,0)
  // Zeff: N=3.90, O=4.45
  'HNO₃': {
    orbitals: [
      {
        name: 'σ₁ (N-O₃-H chain)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.90, c:  0.45 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.40 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.25 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.50 },
        ],
      },
      {
        name: 'σ₂ (N-O₁ bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.90, c:  0.50 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.55 },
        ],
      },
      {
        name: 'σ₃ (s framework)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.90, c:  0.50 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.40 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.40 },
          { atom: 3, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.40 },
        ],
      },
      {
        name: 'π (delocalized)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.90, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.50 },
        ],
      },
      {
        name: 'π₂ (nonbonding)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'O₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.80 },
        ],
      },
    ],
  },

  // ═══════════════════ XeF₄ — Xenon Tetrafluoride ═══════════════════
  // 54e valence. Square planar! d²sp³ hybridized Xe.
  // Xe(0,0,0) F₁(1.2,1.2,0) F₂(-1.2,1.2,0) F₃(-1.2,-1.2,0) F₄(1.2,-1.2,0)
  // Zeff: Xe 5s/5p=8.25, F 2s/2p=5.13
  'XeF₄': {
    orbitals: [
      {
        name: 'σ₁ (Xe-F bond, +x)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 8.25, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.35 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.35 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.35 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.35 },
        ],
      },
      {
        name: 'σ₂ (Xe-F bond, +y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: -1, zeff: 8.25, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: -0.35 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 5.13, c: -0.35 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 5.13, c:  0.35 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 5.13, c:  0.35 },
        ],
      },
      {
        name: 'σ₃ (s framework)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 8.25, c:  0.55 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 5.13, c:  0.30 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 5.13, c:  0.30 },
          { atom: 3, n: 2, l: 0, m: 0, zeff: 5.13, c:  0.30 },
          { atom: 4, n: 2, l: 0, m: 0, zeff: 5.13, c:  0.30 },
        ],
      },
      {
        name: 'F₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 3, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₄ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 4, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'Xe 5pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: 0, zeff: 8.25, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ C₂H₅OH — Ethanol ═══════════════════
  // 26e total. C-C single bond, O-H, C-O.
  // C₁(-0.76,0,0) C₂(0.76,0,0) O(1.52,1.0,0) H₃-₅(methyl) H₆-₇(CH₂) H₈(OH)
  // Zeff: C=3.25, O=4.45
  'C₂H₅OH': {
    orbitals: [
      {
        name: 'σ (C-C bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.25, c: -0.55 },
        ],
      },
      {
        name: 'σ (C-O bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.40 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.25, c:  0.30 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.50 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.35 },
        ],
      },
      {
        name: 'σ (O-H bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
          { atom: 8, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
        ],
      },
      {
        name: 'σ (C₁-H₃ bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.25, c: -0.50 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
        ],
      },
      {
        name: 'σ (C₁-H₄ bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.25, c:  0.50 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
        ],
      },
      {
        name: 'σ (C₁-H₅ bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.25, c: -0.50 },
          { atom: 5, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
        ],
      },
      {
        name: 'σ (C₂-H₆ bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.25, c: -0.50 },
          { atom: 6, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
        ],
      },
      {
        name: 'σ (C₂-H₇ bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.25, c:  0.50 },
          { atom: 7, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
        ],
      },
      {
        name: 'O lone pair (z)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O lone pair (s mix)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.90 },
        ],
      },
    ],
  },

  // ═══════════════════ SnCl₄ — Tin(IV) Chloride ═══════════════════
  // 118e total. Tetrahedral like CH₄ but with 3rd-row ligands.
  // Sn(0,0,0) Cl₁(1.0,1.0,0.5) Cl₂(-1.0,-1.0,0.5) Cl₃(-1.0,1.0,-0.5) Cl₄(1.0,-1.0,-0.5)
  // Zeff: Sn 5s/5p=6.20, Cl=6.12
  'SnCl₄': {
    orbitals: [
      {
        name: 'a₁ (σ bond)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 6.20, c:  0.50 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.35 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.35 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.35 },
          { atom: 4, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.35 },
        ],
      },
      {
        name: 't₂ (σ, x)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 6.20, c:  0.50 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.40 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.40 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.40 },
          { atom: 4, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.40 },
        ],
      },
      {
        name: 't₂ (σ, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: -1, zeff: 6.20, c:  0.50 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: -0.40 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c:  0.40 },
          { atom: 3, n: 3, l: 1, m: -1, zeff: 6.12, c: -0.40 },
          { atom: 4, n: 3, l: 1, m: -1, zeff: 6.12, c:  0.40 },
        ],
      },
      {
        name: 't₂ (σ, z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: 0, zeff: 6.20, c:  0.50 },
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: -0.40 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: -0.40 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.12, c:  0.40 },
          { atom: 4, n: 3, l: 1, m: 0, zeff: 6.12, c:  0.40 },
        ],
      },
      {
        name: 'Cl₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 3, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl₄ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 4, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 4, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.40 },
        ],
      },
    ],
  },

  // ═══════════════════ UF₆ — Uranium Hexafluoride ═══════════════════
  // 146e total. Perfect octahedron! Used in uranium enrichment.
  // U(0,0,0) F₁(1.2,0,0) F₂(-1.2,0,0) F₃(0,1.2,0) F₄(0,-1.2,0) F₅(0,0,1.2) F₆(0,0,-1.2)
  // Zeff: U 5f=9.20, U 6d=8.00, F 2s/2p=5.13
  'UF₆': {
    orbitals: [
      {
        name: 'a₁g (σ bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 7, l: 0, m: 0, zeff: 4.35, c:  0.50 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.30 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.30 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 5.13, c: -0.30 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 5.13, c:  0.30 },
          { atom: 5, n: 2, l: 1, m: 0, zeff: 5.13, c: -0.30 },
          { atom: 6, n: 2, l: 1, m: 0, zeff: 5.13, c:  0.30 },
        ],
      },
      {
        name: 't₁u (σ, x)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 1, m: 1, zeff: 8.00, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.55 },
        ],
      },
      {
        name: 't₁u (σ, y)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 1, m: -1, zeff: 8.00, c:  0.55 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 5.13, c: -0.55 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 5.13, c:  0.55 },
        ],
      },
      {
        name: 't₁u (σ, z)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 1, m: 0, zeff: 8.00, c:  0.55 },
          { atom: 5, n: 2, l: 1, m: 0, zeff: 5.13, c: -0.55 },
          { atom: 6, n: 2, l: 1, m: 0, zeff: 5.13, c:  0.55 },
        ],
      },
      {
        name: 'eg (σ, dz²)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 2, m: 0, zeff: 8.00, c:  0.55 },
          { atom: 5, n: 2, l: 1, m: 0, zeff: 5.13, c: -0.40 },
          { atom: 6, n: 2, l: 1, m: 0, zeff: 5.13, c:  0.40 },
        ],
      },
      {
        name: 'eg (σ, dx²-y²)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 2, m: 2, zeff: 8.00, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.40 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.40 },
        ],
      },
      {
        name: 'F₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'F₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'F₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 3, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.707 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'F₄ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 4, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.707 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'F₅ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 5, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.707 },
          { atom: 5, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'F₆ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 6, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.707 },
          { atom: 6, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ He₂ — Helium Dimer ═══════════════════
  // Weakly bound van der Waals dimer. Bond order = 0 (σ cancels σ*).
  // Atoms: He₁(-1.5,0,0) He₂(1.5,0,0)
  'He₂': {
    orbitals: [
      {
        name: 'σ₁s',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.70, c: 0.707 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.70, c: 0.707 },
        ],
      },
      {
        name: 'σ*₁s',
        type: 'antibonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.70, c: 0.707 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.70, c: -0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ AuCl — Gold(I) Chloride ═══════════════════
  // Linear Au-Cl. Au 5d/6s bonding with Cl 3p.
  // Atoms: Au(-1,0,0) Cl(1,0,0) — bond along x-axis
  'AuCl': {
    orbitals: [
      {
        name: 'σ (Au 6s–Cl 3p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.20, c: 0.55 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.60 },
        ],
      },
      {
        name: 'σ* (Au 6s–Cl 3p)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.20, c: 0.60 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.55 },
        ],
      },
      {
        name: 'Au 5dσ',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: 0, zeff: 10.50, c: 1.0 },
        ],
      },
      {
        name: 'Au 5dπ',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 5, l: 2, m: 1, zeff: 10.50, c: 0.707 },
          { atom: 0, n: 5, l: 2, m: -1, zeff: 10.50, c: 0.707 },
        ],
      },
      {
        name: 'Au 5dδ',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 5, l: 2, m: 2, zeff: 10.50, c: 0.707 },
          { atom: 0, n: 5, l: 2, m: -2, zeff: 10.50, c: 0.707 },
        ],
      },
      {
        name: 'Cl 3p lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ CdTe — Cadmium Telluride ═══════════════════
  // II-VI semiconductor. Cd 5s – Te 5p σ bond along x.
  // Atoms: Cd(-0.7,0,0) Te(0.7,0,0)
  'CdTe': {
    orbitals: [
      {
        name: 'σ (Cd 5s–Te 5p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.55, c: 0.55 },
          { atom: 1, n: 5, l: 1, m: 1, zeff: 6.55, c: 0.60 },
        ],
      },
      {
        name: 'σ* (Cd 5s–Te 5p)',
        type: 'antibonding',
        electrons: 0,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.55, c: 0.60 },
          { atom: 1, n: 5, l: 1, m: 1, zeff: 6.55, c: -0.55 },
        ],
      },
      {
        name: 'Te 5p lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 5, l: 1, m: 0, zeff: 6.55, c: 0.707 },
          { atom: 1, n: 5, l: 1, m: -1, zeff: 6.55, c: 0.707 },
        ],
      },
      {
        name: 'Te 5s lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 5, l: 0, m: 0, zeff: 6.55, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ SnF₂ — Tin(II) Fluoride ═══════════════════
  // Bent molecule (like H₂O). Sn at origin, F atoms at ±x shifted down.
  // Atoms: Sn(0,0,0) F₁(-0.9,-0.5,0) F₂(0.9,-0.5,0)
  'SnF₂': {
    orbitals: [
      {
        name: 'σ₁ (Sn 5sp–F₁ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 6.20, c: 0.40 },
          { atom: 0, n: 5, l: 1, m: 1, zeff: 6.20, c: 0.30 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Sn 5sp–F₂ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 6.20, c: 0.40 },
          { atom: 0, n: 5, l: 1, m: 1, zeff: 6.20, c: -0.30 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.55 },
        ],
      },
      {
        name: 'Sn 5s lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 6.20, c: 0.80 },
          { atom: 0, n: 5, l: 1, m: -1, zeff: 6.20, c: 0.45 },
        ],
      },
      {
        name: 'F₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'F₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ PbCl₂ — Lead(II) Chloride ═══════════════════
  // Linear Cl-Pb-Cl along x-axis. Pb 6sp hybrid σ bonds.
  // Atoms: Cl₁(-1.6,0,0) Pb(0,0,0) Cl₂(1.6,0,0)
  'PbCl₂': {
    orbitals: [
      {
        name: 'σg (Pb 6s–Cl 3p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.50 },
          { atom: 1, n: 6, l: 0, m: 0, zeff: 6.50, c: 0.50 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.50 },
        ],
      },
      {
        name: 'σu (Pb 6p–Cl 3p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.50 },
          { atom: 1, n: 6, l: 1, m: 1, zeff: 6.50, c: 0.50 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.50 },
        ],
      },
      {
        name: 'Pb 6s lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 6, l: 0, m: 0, zeff: 6.50, c: 1.0 },
        ],
      },
      {
        name: 'Cl₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: 'Cl₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ PbO₂ — Lead(IV) Dioxide ═══════════════════
  // Linear O=Pb=O. Double bonds along x-axis.
  // Atoms: O₁(-1.1,0,0) Pb(0,0,0) O₂(1.1,0,0)
  'PbO₂': {
    orbitals: [
      {
        name: 'σg (Pb 6s–O 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.50 },
          { atom: 1, n: 6, l: 0, m: 0, zeff: 6.50, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.50 },
        ],
      },
      {
        name: 'σu (Pb 6p–O 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.50 },
          { atom: 1, n: 6, l: 1, m: 1, zeff: 6.50, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'πg (Pb 6p–O 2p)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 1, n: 6, l: 1, m: 0, zeff: 6.50, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.50 },
        ],
      },
      {
        name: 'πu (Pb 6p–O 2p)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.50 },
          { atom: 1, n: 6, l: 1, m: -1, zeff: 6.50, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ RnF₂ — Radon Difluoride ═══════════════════
  // Linear F-Rn-F, like XeF₂. 3-center 4-electron bond.
  // Atoms: Rn(0,0,0) F₁(-1,0,0) F₂(1,0,0)
  'RnF₂': {
    orbitals: [
      {
        name: 'σ (3c-4e bonding)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.50 },
          { atom: 0, n: 6, l: 1, m: 1, zeff: 9.20, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.50 },
        ],
      },
      {
        name: 'σ nb (F–F)',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'Rn 6s lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 9.20, c: 1.0 },
        ],
      },
      {
        name: 'Rn 6p⊥ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 6, l: 1, m: 0, zeff: 9.20, c: 0.707 },
          { atom: 0, n: 6, l: 1, m: -1, zeff: 9.20, c: 0.707 },
        ],
      },
      {
        name: 'F₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'F₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ PtCl₂ — Platinum(II) Chloride ═══════════════════
  // Linear Cl-Pt-Cl. Pt 5d/6s bonding.
  // Atoms: Cl₁(-1.4,0,0) Pt(0,0,0) Cl₂(1.4,0,0)
  'PtCl₂': {
    orbitals: [
      {
        name: 'σg (Pt 6s–Cl 3p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.50 },
          { atom: 1, n: 6, l: 0, m: 0, zeff: 4.00, c: 0.50 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.50 },
        ],
      },
      {
        name: 'σu (Pt 5dσ–Cl 3p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.50 },
          { atom: 1, n: 5, l: 2, m: 0, zeff: 10.20, c: 0.50 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.50 },
        ],
      },
      {
        name: 'Pt 5d nonbonding',
        type: 'nonbonding',
        electrons: 6,
        ao: [
          { atom: 1, n: 5, l: 2, m: 1, zeff: 10.20, c: 0.577 },
          { atom: 1, n: 5, l: 2, m: -1, zeff: 10.20, c: 0.577 },
          { atom: 1, n: 5, l: 2, m: 2, zeff: 10.20, c: 0.577 },
        ],
      },
      {
        name: 'Cl₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: 'Cl₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ PdCl₂ — Palladium(II) Chloride ═══════════════════
  // Linear Pd-Cl₂. Pd 4d/5s bonding.
  // Atoms: Pd(0,0,0) Cl₁(-1.2,0,0) Cl₂(1.2,0,0)
  'PdCl₂': {
    orbitals: [
      {
        name: 'σg (Pd 5s–Cl 3p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.50 },
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.30, c: 0.50 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.50 },
        ],
      },
      {
        name: 'σu (Pd 4dσ–Cl 3p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.50 },
          { atom: 0, n: 4, l: 2, m: 0, zeff: 8.85, c: 0.50 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.50 },
        ],
      },
      {
        name: 'Pd 4d nonbonding',
        type: 'nonbonding',
        electrons: 6,
        ao: [
          { atom: 0, n: 4, l: 2, m: 1, zeff: 8.85, c: 0.577 },
          { atom: 0, n: 4, l: 2, m: -1, zeff: 8.85, c: 0.577 },
          { atom: 0, n: 4, l: 2, m: 2, zeff: 8.85, c: 0.577 },
        ],
      },
      {
        name: 'Cl₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: 'Cl₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ ZnCl₂ — Zinc Chloride ═══════════════════
  // Linear Cl-Zn-Cl. Zn 4s bonding.
  // Atoms: Cl₁(-1.6,0,0) Zn(0,0,0) Cl₂(1.6,0,0)
  'ZnCl₂': {
    orbitals: [
      {
        name: 'σg (Zn 4s–Cl 3p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.50 },
          { atom: 1, n: 4, l: 0, m: 0, zeff: 4.35, c: 0.50 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.50 },
        ],
      },
      {
        name: 'σu (Zn 4p–Cl 3p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.50 },
          { atom: 1, n: 4, l: 1, m: 1, zeff: 4.35, c: 0.50 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.50 },
        ],
      },
      {
        name: 'Cl₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: 'Cl₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ MoS₂ — Molybdenum Disulfide ═══════════════════
  // Trigonal prismatic coordination in bulk, simplified as bent S-Mo-S.
  // Atoms: Mo(0,0,0) S₁(0.8,0.8,0) S₂(-0.8,-0.8,0)
  'MoS₂': {
    orbitals: [
      {
        name: 'σ₁ (Mo 4d–S₁ 3p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 2, m: 0, zeff: 7.40, c: 0.55 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 5.45, c: 0.50 },
        ],
      },
      {
        name: 'σ₂ (Mo 4d–S₂ 3p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 2, m: 0, zeff: 7.40, c: 0.55 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 5.45, c: 0.50 },
        ],
      },
      {
        name: 'π (Mo 4d–S 3p)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 4, l: 2, m: 1, zeff: 7.40, c: 0.50 },
          { atom: 1, n: 3, l: 1, m: 0, zeff: 5.45, c: 0.35 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 5.45, c: 0.35 },
        ],
      },
      {
        name: 'Mo 4d nonbonding',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 2, m: 2, zeff: 7.40, c: 0.707 },
          { atom: 0, n: 4, l: 2, m: -2, zeff: 7.40, c: 0.707 },
        ],
      },
      {
        name: 'S₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 5.45, c: 1.0 },
        ],
      },
      {
        name: 'S₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 3, l: 1, m: -1, zeff: 5.45, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ MnO₂ — Manganese Dioxide ═══════════════════
  // Linear O=Mn=O. Mn uses 3d/4s for bonding.
  // Atoms: O₁(-1.1,0,0) Mn(0,0,0) O₂(1.1,0,0)
  'MnO₂': {
    orbitals: [
      {
        name: 'σg (Mn 4s–O 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.50 },
          { atom: 1, n: 4, l: 0, m: 0, zeff: 3.50, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.50 },
        ],
      },
      {
        name: 'σu (Mn 3dσ–O 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.50 },
          { atom: 1, n: 3, l: 2, m: 0, zeff: 5.60, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'πg (Mn 3dπ–O 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 1, n: 3, l: 2, m: 1, zeff: 5.60, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.50 },
        ],
      },
      {
        name: 'Mn 3d nonbonding',
        type: 'nonbonding',
        electrons: 1,
        ao: [
          { atom: 1, n: 3, l: 2, m: 2, zeff: 5.60, c: 1.0 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ GeO₂ — Germanium Dioxide ═══════════════════
  // Bent O=Ge=O. Ge at origin, O atoms at (±1, 0.5, 0).
  // Atoms: Ge(0,0,0) O₁(1,0.5,0) O₂(-1,0.5,0)
  'GeO₂': {
    orbitals: [
      {
        name: 'σ₁ (Ge 4sp–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 5.50, c: 0.40 },
          { atom: 0, n: 4, l: 1, m: 1, zeff: 5.50, c: 0.30 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Ge 4sp–O₂ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 5.50, c: 0.40 },
          { atom: 0, n: 4, l: 1, m: 1, zeff: 5.50, c: -0.30 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'π₁ (Ge 4p–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 5.50, c: 0.50 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'π₂ (Ge 4p–O₂ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 5.50, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ ZrO₂ — Zirconium Dioxide ═══════════════════
  // Bent O=Zr=O. 4d transition metal oxide.
  // Atoms: Zr(0,0,0) O₁(1,0.5,0) O₂(-1,0.5,0)
  'ZrO₂': {
    orbitals: [
      {
        name: 'σ₁ (Zr 4d/5s–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 3.40, c: 0.40 },
          { atom: 0, n: 4, l: 2, m: 0, zeff: 6.80, c: 0.30 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Zr 4d/5s–O₂ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 3.40, c: 0.40 },
          { atom: 0, n: 4, l: 2, m: 0, zeff: 6.80, c: -0.30 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'π (Zr 4dπ–O 2p)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 4, l: 2, m: 1, zeff: 6.80, c: 0.50 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.35 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.35 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ HfO₂ — Hafnium Dioxide ═══════════════════
  // Bent O=Hf=O. Analogous to ZrO₂ (same group).
  // Atoms: Hf(0,0,0) O₁(1,0.5,0) O₂(-1,0.5,0)
  'HfO₂': {
    orbitals: [
      {
        name: 'σ₁ (Hf 5d/6s–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.10, c: 0.40 },
          { atom: 0, n: 5, l: 2, m: 0, zeff: 9.00, c: 0.30 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Hf 5d/6s–O₂ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.10, c: 0.40 },
          { atom: 0, n: 5, l: 2, m: 0, zeff: 9.00, c: -0.30 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'π (Hf 5dπ–O 2p)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 5, l: 2, m: 1, zeff: 9.00, c: 0.50 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.35 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.35 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ CeO₂ — Cerium Dioxide ═══════════════════
  // Bent O=Ce=O. Lanthanide 4f/5d bonding.
  // Atoms: Ce(0,0,0) O₁(1,0.5,0) O₂(-1,0.5,0)
  'CeO₂': {
    orbitals: [
      {
        name: 'σ₁ (Ce 5d/6s–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 3.80, c: 0.35 },
          { atom: 0, n: 5, l: 2, m: 0, zeff: 7.50, c: 0.35 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Ce 5d/6s–O₂ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 3.80, c: 0.35 },
          { atom: 0, n: 5, l: 2, m: 0, zeff: 7.50, c: -0.35 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'π (Ce 5dπ–O 2p)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 5, l: 2, m: 1, zeff: 7.50, c: 0.50 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.35 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.35 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ IrO₂ — Iridium Dioxide ═══════════════════
  // Bent O=Ir=O. Ir 5d-O 2p bonding.
  // Atoms: Ir(0,0,0) O₁(1,0.5,0) O₂(-1,0.5,0)
  'IrO₂': {
    orbitals: [
      {
        name: 'σ₁ (Ir 5dσ–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: 0, zeff: 10.00, c: 0.45 },
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.10, c: 0.25 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Ir 5dσ–O₂ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: 0, zeff: 10.00, c: -0.45 },
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.10, c: 0.25 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'π (Ir 5dπ–O 2p)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 5, l: 2, m: 1, zeff: 10.00, c: 0.50 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.35 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.35 },
        ],
      },
      {
        name: 'Ir 5d nonbonding',
        type: 'nonbonding',
        electrons: 3,
        ao: [
          { atom: 0, n: 5, l: 2, m: -1, zeff: 10.00, c: 0.577 },
          { atom: 0, n: 5, l: 2, m: 2, zeff: 10.00, c: 0.577 },
          { atom: 0, n: 5, l: 2, m: -2, zeff: 10.00, c: 0.577 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ UO₂ — Uranyl (Uranium Dioxide) ═══════════════════
  // Linear O=U=O (uranyl). U 5f/6d participates in bonding.
  // Atoms: O₁(-1.1,0,0) U(0,0,0) O₂(1.1,0,0)
  'UO₂': {
    orbitals: [
      {
        name: 'σg (U 6d–O 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.50 },
          { atom: 1, n: 6, l: 2, m: 0, zeff: 8.00, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.50 },
        ],
      },
      {
        name: 'σu (U 5fσ–O 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.50 },
          { atom: 1, n: 5, l: 3, m: 0, zeff: 9.20, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'πg (U 5fπ–O 2p)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 1, n: 5, l: 3, m: 1, zeff: 9.20, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.50 },
        ],
      },
      {
        name: 'πu (U 6dπ–O 2p)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.50 },
          { atom: 1, n: 6, l: 2, m: 1, zeff: 8.00, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'U 5f nonbonding',
        type: 'nonbonding',
        electrons: 0,
        ao: [
          { atom: 1, n: 5, l: 3, m: 2, zeff: 9.20, c: 0.707 },
          { atom: 1, n: 5, l: 3, m: -2, zeff: 9.20, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ ThO₂ — Thorium Dioxide ═══════════════════
  // Bent O=Th=O. Th 6d/7s bonding (no 5f contribution in Th⁴⁺).
  // Atoms: Th(0,0,0) O₁(1,0.5,0) O₂(-1,0.5,0)
  'ThO₂': {
    orbitals: [
      {
        name: 'σ₁ (Th 6d/7s–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 7, l: 0, m: 0, zeff: 3.80, c: 0.35 },
          { atom: 0, n: 6, l: 2, m: 0, zeff: 7.50, c: 0.35 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Th 6d/7s–O₂ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 7, l: 0, m: 0, zeff: 3.80, c: 0.35 },
          { atom: 0, n: 6, l: 2, m: 0, zeff: 7.50, c: -0.35 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'π (Th 6dπ–O 2p)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 6, l: 2, m: 1, zeff: 7.50, c: 0.50 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.35 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.35 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ PuO₂ — Plutonium Dioxide ═══════════════════
  // Bent O=Pu=O. Pu 5f/6d bonding.
  // Atoms: Pu(0,0,0) O₁(1,0.5,0) O₂(-1,0.5,0)
  'PuO₂': {
    orbitals: [
      {
        name: 'σ₁ (Pu 5f/6d–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 2, m: 0, zeff: 8.20, c: 0.30 },
          { atom: 0, n: 5, l: 3, m: 0, zeff: 9.50, c: 0.30 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Pu 5f/6d–O₂ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 2, m: 0, zeff: 8.20, c: -0.30 },
          { atom: 0, n: 5, l: 3, m: 0, zeff: 9.50, c: -0.30 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'π (Pu 5fπ–O 2p)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 5, l: 3, m: 1, zeff: 9.50, c: 0.50 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.35 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.35 },
        ],
      },
      {
        name: 'Pu 5f nonbonding',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 5, l: 3, m: 2, zeff: 9.50, c: 0.50 },
          { atom: 0, n: 5, l: 3, m: -2, zeff: 9.50, c: 0.50 },
          { atom: 0, n: 5, l: 3, m: 3, zeff: 9.50, c: 0.50 },
          { atom: 0, n: 5, l: 3, m: -3, zeff: 9.50, c: 0.50 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ Cu₂O — Cuprous Oxide ═══════════════════
  // Linear Cu-O-Cu. Cu 4s/3d bonding with O 2p.
  // Atoms: Cu₁(-1,0.5,0) O(0,0,0) Cu₂(1,0.5,0)
  'Cu₂O': {
    orbitals: [
      {
        name: 'σg (Cu 4s–O 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.70, c: 0.45 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.45 },
          { atom: 2, n: 4, l: 0, m: 0, zeff: 3.70, c: 0.45 },
        ],
      },
      {
        name: 'σu (Cu 4s–O 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.70, c: 0.50 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 4, l: 0, m: 0, zeff: 3.70, c: -0.50 },
        ],
      },
      {
        name: 'O 2p lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
      {
        name: 'Cu₁ 3d',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 7.85, c: 1.0 },
        ],
      },
      {
        name: 'Cu₂ 3d',
        type: 'nonbonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 3, l: 2, m: 0, zeff: 7.85, c: 1.0 },
        ],
      },
    ],
  },

  // ═══════════════════ Ag₂O — Silver Oxide ═══════════════════
  // Linear Ag-O-Ag. Ag 5s bonding with O 2p.
  // Atoms: Ag₁(-1.1,0.5,0) O(0,0,0) Ag₂(1.1,0.5,0)
  'Ag₂O': {
    orbitals: [
      {
        name: 'σg (Ag 5s–O 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.25, c: 0.45 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.45 },
          { atom: 2, n: 5, l: 0, m: 0, zeff: 4.25, c: 0.45 },
        ],
      },
      {
        name: 'σu (Ag 5s–O 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.25, c: 0.50 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 5, l: 0, m: 0, zeff: 4.25, c: -0.50 },
        ],
      },
      {
        name: 'O 2p lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ FeCl₃ — Iron(III) Chloride ═══════════════════
  // Trigonal planar Fe-Cl₃. Fe 3d/4s–Cl 3p.
  // Atoms: Fe(0,0,0) Cl₁(1.4,0.8,0) Cl₂(-1.4,0.8,0) Cl₃(0,-1.2,0)
  'FeCl₃': {
    orbitals: [
      {
        name: 'σ₁ (Fe–Cl₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.75, c: 0.35 },
          { atom: 0, n: 3, l: 2, m: 0, zeff: 6.25, c: 0.30 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Fe–Cl₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.75, c: 0.35 },
          { atom: 0, n: 3, l: 2, m: 0, zeff: 6.25, c: -0.30 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'σ₃ (Fe–Cl₃)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.75, c: 0.35 },
          { atom: 0, n: 3, l: 2, m: 1, zeff: 6.25, c: 0.30 },
          { atom: 3, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'Fe 3d nonbonding',
        type: 'nonbonding',
        electrons: 3,
        ao: [
          { atom: 0, n: 3, l: 2, m: 2, zeff: 6.25, c: 0.577 },
          { atom: 0, n: 3, l: 2, m: -1, zeff: 6.25, c: 0.577 },
          { atom: 0, n: 3, l: 2, m: -2, zeff: 6.25, c: 0.577 },
        ],
      },
      {
        name: 'Cl lone pairs',
        type: 'nonbonding',
        electrons: 12,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.408 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.408 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.408 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.408 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.408 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.408 },
        ],
      },
    ],
  },

  // ═══════════════════ GaCl₃ — Gallium(III) Chloride ═══════════════════
  // Trigonal planar. Ga 4s/4p–Cl 3p sp² bonding.
  // Atoms: Ga(0,0,0) Cl₁(1.2,0,0) Cl₂(-0.6,1.04,0) Cl₃(-0.6,-1.04,0)
  'GaCl₃': {
    orbitals: [
      {
        name: 'σ₁ (Ga sp²–Cl₁ 3p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 5.00, c: 0.33 },
          { atom: 0, n: 4, l: 1, m: 1, zeff: 5.00, c: 0.47 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Ga sp²–Cl₂ 3p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 5.00, c: 0.33 },
          { atom: 0, n: 4, l: 1, m: -1, zeff: 5.00, c: 0.47 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'σ₃ (Ga sp²–Cl₃ 3p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 5.00, c: 0.33 },
          { atom: 0, n: 4, l: 1, m: -1, zeff: 5.00, c: -0.47 },
          { atom: 3, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'Cl lone pairs',
        type: 'nonbonding',
        electrons: 12,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.408 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.408 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.408 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.408 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.408 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.408 },
        ],
      },
    ],
  },

  // ═══════════════════ RhCl₃ — Rhodium(III) Chloride ═══════════════════
  // Trigonal planar. Rh 4d/5s–Cl 3p bonding.
  // Atoms: Rh(0,0,0) Cl₁(1.3,0,0) Cl₂(-0.65,1.13,0) Cl₃(-0.65,-1.13,0)
  'RhCl₃': {
    orbitals: [
      {
        name: 'σ₁ (Rh–Cl₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.10, c: 0.35 },
          { atom: 0, n: 4, l: 2, m: 0, zeff: 8.50, c: 0.30 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Rh–Cl₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.10, c: 0.35 },
          { atom: 0, n: 4, l: 2, m: 1, zeff: 8.50, c: 0.30 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'σ₃ (Rh–Cl₃)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.10, c: 0.35 },
          { atom: 0, n: 4, l: 2, m: -1, zeff: 8.50, c: 0.30 },
          { atom: 3, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'Rh 4d nonbonding',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 4, l: 2, m: 2, zeff: 8.50, c: 0.707 },
          { atom: 0, n: 4, l: 2, m: -2, zeff: 8.50, c: 0.707 },
        ],
      },
      {
        name: 'Cl lone pairs',
        type: 'nonbonding',
        electrons: 12,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.408 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.408 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.408 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.408 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.408 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.408 },
        ],
      },
    ],
  },

  // ═══════════════════ MoO₃ — Molybdenum Trioxide ═══════════════════
  // Trigonal planar. Mo 4d/5s double bonds to 3 O.
  // Atoms: Mo(0,0,0) O₁(1.2,0,0) O₂(-0.6,1.04,0) O₃(-0.6,-1.04,0)
  'MoO₃': {
    orbitals: [
      {
        name: 'σ₁ (Mo–O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 2, m: 0, zeff: 7.40, c: 0.45 },
          { atom: 0, n: 5, l: 0, m: 0, zeff: 3.60, c: 0.25 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Mo–O₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 2, m: 1, zeff: 7.40, c: 0.45 },
          { atom: 0, n: 5, l: 0, m: 0, zeff: 3.60, c: 0.25 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₃ (Mo–O₃)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 2, m: -1, zeff: 7.40, c: 0.45 },
          { atom: 0, n: 5, l: 0, m: 0, zeff: 3.60, c: 0.25 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'π (Mo 4dπ–O 2p)',
        type: 'bonding',
        electrons: 6,
        ao: [
          { atom: 0, n: 4, l: 2, m: 2, zeff: 7.40, c: 0.33 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.33 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.33 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.33 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 6,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ═══════════════════ WO₃ — Tungsten Trioxide ═══════════════════
  // Trigonal planar. W 5d/6s double bonds to 3 O.
  // Atoms: W(0,0,0) O₁(1.2,0,0) O₂(-0.6,1.04,0) O₃(-0.6,-1.04,0)
  'WO₃': {
    orbitals: [
      {
        name: 'σ₁ (W–O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: 0, zeff: 8.50, c: 0.45 },
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.35, c: 0.25 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (W–O₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: 1, zeff: 8.50, c: 0.45 },
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.35, c: 0.25 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₃ (W–O₃)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: -1, zeff: 8.50, c: 0.45 },
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.35, c: 0.25 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'π (W 5dπ–O 2p)',
        type: 'bonding',
        electrons: 6,
        ao: [
          { atom: 0, n: 5, l: 2, m: 2, zeff: 8.50, c: 0.33 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.33 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.33 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.33 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 6,
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ═══════════════════ Hg₂Cl₂ — Mercury(I) Chloride (Calomel) ═══════════════════
  // Linear Cl-Hg-Hg-Cl. Hg-Hg bond along x-axis.
  // Atoms: Cl₁(-2,0,0) Hg₁(-0.7,0,0) Hg₂(0.7,0,0) Cl₂(2,0,0)
  'Hg₂Cl₂': {
    orbitals: [
      {
        name: 'σ (Hg-Hg)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 6, l: 0, m: 0, zeff: 4.35, c: 0.707 },
          { atom: 2, n: 6, l: 0, m: 0, zeff: 4.35, c: 0.707 },
        ],
      },
      {
        name: 'σ₁ (Hg₁–Cl₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 6, l: 0, m: 0, zeff: 4.35, c: 0.50 },
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.60 },
        ],
      },
      {
        name: 'σ₂ (Hg₂–Cl₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 6, l: 0, m: 0, zeff: 4.35, c: 0.50 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.60 },
        ],
      },
      {
        name: 'Cl₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: 'Cl₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 3, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ TiCl₄ — Titanium Tetrachloride ═══════════════════
  // Tetrahedral. Ti 3d/4s sp³ bonding with 4 Cl.
  // Atoms: Ti(0,0,0) Cl₁(1.1,1.1,0.5) Cl₂(-1.1,-1.1,0.5) Cl₃(-1.1,1.1,-0.5) Cl₄(1.1,-1.1,-0.5)
  'TiCl₄': {
    orbitals: [
      {
        name: 'σ₁ (Ti–Cl₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.15, c: 0.35 },
          { atom: 0, n: 3, l: 2, m: 0, zeff: 4.80, c: 0.30 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Ti–Cl₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.15, c: 0.35 },
          { atom: 0, n: 3, l: 2, m: 0, zeff: 4.80, c: -0.30 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'σ₃ (Ti–Cl₃)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.15, c: 0.35 },
          { atom: 0, n: 3, l: 2, m: 1, zeff: 4.80, c: 0.30 },
          { atom: 3, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'σ₄ (Ti–Cl₄)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.15, c: 0.35 },
          { atom: 0, n: 3, l: 2, m: -1, zeff: 4.80, c: 0.30 },
          { atom: 4, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'Cl lone pairs',
        type: 'nonbonding',
        electrons: 16,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.354 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.354 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.354 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.354 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.354 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.354 },
          { atom: 4, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.354 },
          { atom: 4, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.354 },
        ],
      },
    ],
  },

  // ═══════════════════ OsO₄ — Osmium Tetroxide ═══════════════════
  // Tetrahedral. Os 5d/6s bonds to 4 O (double bonds).
  // Atoms: Os(0,0,0) O₁(0.9,0.52,0.52) O₂(-0.9,-0.52,0.52) O₃(0.52,-0.9,-0.52) O₄(-0.52,0.9,-0.52)
  'OsO₄': {
    orbitals: [
      {
        name: 'σ₁ (Os–O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: 0, zeff: 9.60, c: 0.40 },
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.00, c: 0.25 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Os–O₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: 0, zeff: 9.60, c: -0.40 },
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.00, c: 0.25 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₃ (Os–O₃)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: 1, zeff: 9.60, c: 0.40 },
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.00, c: 0.25 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₄ (Os–O₄)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: -1, zeff: 9.60, c: 0.40 },
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.00, c: 0.25 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'π (Os 5d–O 2p)',
        type: 'bonding',
        electrons: 8,
        ao: [
          { atom: 0, n: 5, l: 2, m: 2, zeff: 9.60, c: 0.25 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.25 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.25 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.25 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.25 },
        ],
      },
    ],
  },

  // ═══════════════════ RuO₄ — Ruthenium Tetroxide ═══════════════════
  // Tetrahedral. Ru 4d/5s bonds to 4 O. Analogous to OsO₄.
  // Atoms: Ru(0,0,0) O₁(0.9,0.52,0.52) O₂(-0.9,-0.52,0.52) O₃(0.52,-0.9,-0.52) O₄(-0.52,0.9,-0.52)
  'RuO₄': {
    orbitals: [
      {
        name: 'σ₁ (Ru–O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 2, m: 0, zeff: 7.55, c: 0.40 },
          { atom: 0, n: 5, l: 0, m: 0, zeff: 3.70, c: 0.25 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ (Ru–O₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 2, m: 0, zeff: 7.55, c: -0.40 },
          { atom: 0, n: 5, l: 0, m: 0, zeff: 3.70, c: 0.25 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₃ (Ru–O₃)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 2, m: 1, zeff: 7.55, c: 0.40 },
          { atom: 0, n: 5, l: 0, m: 0, zeff: 3.70, c: 0.25 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ₄ (Ru–O₄)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 2, m: -1, zeff: 7.55, c: 0.40 },
          { atom: 0, n: 5, l: 0, m: 0, zeff: 3.70, c: 0.25 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'π (Ru 4d–O 2p)',
        type: 'bonding',
        electrons: 8,
        ao: [
          { atom: 0, n: 4, l: 2, m: 2, zeff: 7.55, c: 0.25 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.25 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.25 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.25 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.25 },
        ],
      },
    ],
  },

  // ═══════════════════ Ca(OH)₂ — Calcium Hydroxide ═══════════════════
  // Ca bonded to 2 OH groups. Ca 4s ionic/covalent with O 2p.
  // Atoms: Ca(0,0,0) O₁(-1,0.8,0) O₂(1,0.8,0) H₁(-1.5,1.3,0) H₂(1.5,1.3,0)
  'Ca(OH)₂': {
    orbitals: [
      {
        name: 'σ₁ (Ca 4s–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 2.85, c: 0.40 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.65 },
        ],
      },
      {
        name: 'σ₂ (Ca 4s–O₂ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 2.85, c: 0.40 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.65 },
        ],
      },
      {
        name: 'σ (O₁–H₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.55 },
        ],
      },
      {
        name: 'σ (O₂–H₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.55 },
        ],
      },
      {
        name: 'O₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
      {
        name: 'O₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ Mg(OH)₂ — Magnesium Hydroxide ═══════════════════
  // Mg bonded to 2 OH groups. Mg 3s–O 2p bonding.
  // Atoms: Mg(0,0,0) O₁(-1,0.7,0) O₂(1,0.7,0) H₁(-1.5,1.2,0) H₂(1.5,1.2,0)
  'Mg(OH)₂': {
    orbitals: [
      {
        name: 'σ₁ (Mg 3s–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.85, c: 0.40 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.65 },
        ],
      },
      {
        name: 'σ₂ (Mg 3s–O₂ 2p)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.85, c: 0.40 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.65 },
        ],
      },
      {
        name: 'σ (O₁–H₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.55 },
        ],
      },
      {
        name: 'σ (O₂–H₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.55 },
        ],
      },
      {
        name: 'O₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
      {
        name: 'O₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
    ],
  },

  // ═══════════════════ PCl₅ — Phosphorus Pentachloride ═══════════════════
  // Trigonal bipyramidal. P sp³d hybridization.
  // Atoms: P(0,0,0) Cl₁(1.3,0,0) Cl₂(-0.65,1.13,0) Cl₃(-0.65,-1.13,0) Cl₄(0,0,1.3) Cl₅(0,0,-1.3)
  'PCl₅': {
    orbitals: [
      {
        name: 'σ₁ᵉᑫ (P sp²–Cl₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 4.80, c: 0.30 },
          { atom: 0, n: 3, l: 1, m: 1, zeff: 4.80, c: 0.40 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'σ₂ᵉᑫ (P sp²–Cl₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 4.80, c: 0.30 },
          { atom: 0, n: 3, l: 1, m: -1, zeff: 4.80, c: 0.40 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'σ₃ᵉᑫ (P sp²–Cl₃)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 4.80, c: 0.30 },
          { atom: 0, n: 3, l: 1, m: -1, zeff: 4.80, c: -0.40 },
          { atom: 3, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'σ₄ᵃˣ (P 3d–Cl₄)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 4.80, c: 0.45 },
          { atom: 0, n: 3, l: 1, m: 0, zeff: 4.80, c: 0.30 },
          { atom: 4, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'σ₅ᵃˣ (P 3d–Cl₅)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 4.80, c: 0.45 },
          { atom: 0, n: 3, l: 1, m: 0, zeff: 4.80, c: -0.30 },
          { atom: 5, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.55 },
        ],
      },
      {
        name: 'Cl lone pairs',
        type: 'nonbonding',
        electrons: 20,
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.316 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.316 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.316 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.316 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.316 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.316 },
          { atom: 4, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.316 },
          { atom: 4, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.316 },
          { atom: 5, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.316 },
          { atom: 5, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.316 },
        ],
      },
    ],
  },

  // ═══════════════════ Sc₂O₃ — Scandium Oxide ═══════════════════
  // Two Sc bridged by O atoms. Sc 3d/4s–O 2p bonding.
  // Atoms: Sc₁(-0.9,0.5,0) O₁(0,0,0) Sc₂(0.9,0.5,0) O₂(-0.9,-0.5,0) O₃(0.9,-0.5,0)
  'Sc₂O₃': {
    orbitals: [
      {
        name: 'σ (Sc₁–O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 2.85, c: 0.40 },
          { atom: 0, n: 3, l: 2, m: 0, zeff: 4.35, c: 0.25 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Sc₂–O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 4, l: 0, m: 0, zeff: 2.85, c: 0.40 },
          { atom: 2, n: 3, l: 2, m: 0, zeff: 4.35, c: 0.25 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.60 },
        ],
      },
      {
        name: 'σ (Sc₁–O₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 2.85, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Sc₂–O₃)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 2, n: 4, l: 0, m: 0, zeff: 2.85, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 6,
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ═══════════════════ Cr₂O₃ — Chromium(III) Oxide ═══════════════════
  // Two Cr bridged by O. Cr 3d/4s–O 2p.
  // Atoms: Cr₁(-0.9,0.4,0) Cr₂(0.9,0.4,0) O₁(0,-0.4,0.3) O₂(-1.3,-0.5,-0.3) O₃(1.3,-0.5,-0.3)
  'Cr₂O₃': {
    orbitals: [
      {
        name: 'σ (Cr₁–O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 5.20, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Cr₂–O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 2, m: 0, zeff: 5.20, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.60 },
        ],
      },
      {
        name: 'σ (Cr₁–O₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.30, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Cr₂–O₃)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 4, l: 0, m: 0, zeff: 3.30, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'Cr 3d nonbonding',
        type: 'nonbonding',
        electrons: 6,
        ao: [
          { atom: 0, n: 3, l: 2, m: 2, zeff: 5.20, c: 0.50 },
          { atom: 0, n: 3, l: 2, m: -2, zeff: 5.20, c: 0.50 },
          { atom: 1, n: 3, l: 2, m: 2, zeff: 5.20, c: 0.50 },
          { atom: 1, n: 3, l: 2, m: -2, zeff: 5.20, c: 0.50 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 6,
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ═══════════════════ As₂O₃ — Arsenic Trioxide ═══════════════════
  // Two As bridged by O atoms. As 4s/4p–O 2p.
  // Atoms: As₁(-0.8,0.5,0) As₂(0.8,0.5,0) O₁(0,0,0) O₂(-1.2,-0.4,0) O₃(1.2,-0.4,0)
  'As₂O₃': {
    orbitals: [
      {
        name: 'σ (As₁–O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 1, m: 1, zeff: 5.80, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ (As₂–O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 4, l: 1, m: 1, zeff: 5.80, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
        ],
      },
      {
        name: 'σ (As₁–O₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 5.80, c: 0.45 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ (As₂–O₃)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 4, l: 0, m: 0, zeff: 5.80, c: 0.45 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'As lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 5.80, c: 0.707 },
          { atom: 1, n: 4, l: 0, m: 0, zeff: 5.80, c: 0.707 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 6,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ═══════════════════ Sb₂O₃ — Antimony Trioxide ═══════════════════
  // Analogous to As₂O₃ — Sb 5s/5p–O 2p.
  // Atoms: Sb₁(-0.8,0.5,0) Sb₂(0.8,0.5,0) O₁(0,0,0) O₂(-1.2,-0.4,0) O₃(1.2,-0.4,0)
  'Sb₂O₃': {
    orbitals: [
      {
        name: 'σ (Sb₁–O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 6.10, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ (Sb₂–O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 5, l: 1, m: 1, zeff: 6.10, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
        ],
      },
      {
        name: 'σ (Sb₁–O₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 6.10, c: 0.45 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ (Sb₂–O₃)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 5, l: 0, m: 0, zeff: 6.10, c: 0.45 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'Sb lone pairs',
        type: 'nonbonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 6.10, c: 0.707 },
          { atom: 1, n: 5, l: 0, m: 0, zeff: 6.10, c: 0.707 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 6,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ═══════════════════ La₂O₃ — Lanthanum Oxide ═══════════════════
  // Two La bridged by O. La 5d/6s–O 2p.
  // Atoms: La₁(-0.9,0.5,0) La₂(0.9,0.5,0) O₁(0,0,0) O₂(-1.2,-0.4,0) O₃(1.2,-0.4,0)
  'La₂O₃': {
    orbitals: [
      {
        name: 'σ (La₁–O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: 0, zeff: 7.40, c: 0.35 },
          { atom: 0, n: 6, l: 0, m: 0, zeff: 3.60, c: 0.30 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (La₂–O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 5, l: 2, m: 0, zeff: 7.40, c: 0.35 },
          { atom: 1, n: 6, l: 0, m: 0, zeff: 3.60, c: 0.30 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.60 },
        ],
      },
      {
        name: 'σ (La₁–O₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 3.60, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (La₂–O₃)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 6, l: 0, m: 0, zeff: 3.60, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 6,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ═══════════════════ V₂O₅ — Vanadium Pentoxide ═══════════════════
  // Two V, bridging O, plus terminal O=V. 7 atoms.
  // Atoms: V₁(-0.8,0,0) V₂(0.8,0,0) O_br(0,0.6,0) O₁(-1.4,0.7,0) O₂(1.4,0.7,0) O₃(-1.4,-0.7,0) O₄(1.4,-0.7,0)
  'V₂O₅': {
    orbitals: [
      {
        name: 'σ (V₁–O_br)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 5.20, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (V₂–O_br)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 2, m: 0, zeff: 5.20, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.60 },
        ],
      },
      {
        name: 'σ (V₁=O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.30, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (V₂=O₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 4, l: 0, m: 0, zeff: 3.30, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (V₁–O₃)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 3, l: 2, m: 1, zeff: 5.20, c: 0.45 },
          { atom: 5, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (V₂–O₄)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 3, l: 2, m: -1, zeff: 5.20, c: 0.45 },
          { atom: 6, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'π (V=O terminal)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 3, l: 2, m: -2, zeff: 5.20, c: 0.35 },
          { atom: 1, n: 3, l: 2, m: 2, zeff: 5.20, c: 0.35 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.35 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.35 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 10,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.316 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.316 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.316 },
          { atom: 5, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.316 },
          { atom: 6, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.316 },
        ],
      },
    ],
  },

  // ═══════════════════ Nb₂O₅ — Niobium Pentoxide ═══════════════════
  // Two Nb bridged by O, plus terminal O.
  // Atoms: Nb₁(-0.7,0,0) Nb₂(0.7,0,0) O_br(0,0.6,0) O₁(-1.3,0.6,0) O₂(1.3,0.6,0)
  'Nb₂O₅': {
    orbitals: [
      {
        name: 'σ (Nb₁–O_br)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 4, l: 2, m: 0, zeff: 6.40, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Nb₂–O_br)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 4, l: 2, m: 0, zeff: 6.40, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.60 },
        ],
      },
      {
        name: 'σ (Nb₁=O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 3.30, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Nb₂=O₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 5, l: 0, m: 0, zeff: 3.30, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'π (Nb=O terminal)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 4, l: 2, m: 1, zeff: 6.40, c: 0.50 },
          { atom: 1, n: 4, l: 2, m: -1, zeff: 6.40, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 6,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ═══════════════════ Ta₂O₅ — Tantalum Pentoxide ═══════════════════
  // Analogous to Nb₂O₅. Ta 5d/6s–O 2p.
  // Atoms: Ta₁(-0.7,0,0) Ta₂(0.7,0,0) O_br(0,0.6,0) O₁(-1.3,0.6,0) O₂(1.3,0.6,0)
  'Ta₂O₅': {
    orbitals: [
      {
        name: 'σ (Ta₁–O_br)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: 0, zeff: 8.80, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Ta₂–O_br)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 5, l: 2, m: 0, zeff: 8.80, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.60 },
        ],
      },
      {
        name: 'σ (Ta₁=O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.15, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Ta₂=O₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 6, l: 0, m: 0, zeff: 4.15, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'π (Ta=O terminal)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 5, l: 2, m: 1, zeff: 8.80, c: 0.50 },
          { atom: 1, n: 5, l: 2, m: -1, zeff: 8.80, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 6,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ═══════════════════ Re₂O₇ — Rhenium Heptoxide ═══════════════════
  // Two Re bridged by O, plus terminal O.
  // Atoms: Re₁(-0.7,0,0) Re₂(0.7,0,0) O_br(0,0.5,0) O₁(-1.3,0.6,0) O₂(1.3,0.6,0)
  'Re₂O₇': {
    orbitals: [
      {
        name: 'σ (Re₁–O_br)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 5, l: 2, m: 0, zeff: 9.20, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Re₂–O_br)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 5, l: 2, m: 0, zeff: 9.20, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.60 },
        ],
      },
      {
        name: 'σ (Re₁=O₁)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.20, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Re₂=O₂)',
        type: 'bonding',
        electrons: 2,
        ao: [
          { atom: 1, n: 6, l: 0, m: 0, zeff: 4.20, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'π (Re=O terminal)',
        type: 'bonding',
        electrons: 4,
        ao: [
          { atom: 0, n: 5, l: 2, m: 1, zeff: 9.20, c: 0.50 },
          { atom: 1, n: 5, l: 2, m: -1, zeff: 9.20, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 6,
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },
};
