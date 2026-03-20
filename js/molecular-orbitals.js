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
    notes: 'The simplest molecule — a textbook example of σ bonding and σ* antibonding. The constructive overlap of two 1s orbitals creates the bond.',
    orbitals: [
      {
        name: 'σ₁s',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between He — head-on s overlap along the bond axis.',
      energy: 1, desc: 'σ bonding between H — head-on s overlap along the bond axis.',
        ao: [
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.707 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.707 },
        ],
      },
      {
        name: 'σ*₁s',
        type: 'antibonding',
        electrons: 0,
      energy: 2, desc: 'σ* antibonding — destructive overlap creates a nodal plane between H. Occupying this weakens the bond.',
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
    notes: 'A highly polar covalent bond where fluorine dominates the electron density. The MO coefficients are asymmetric, reflecting the electronegativity difference.',
    orbitals: [
      {
        name: '1σ (F 1s core)',
        type: 'core',
        electrons: 2,
      energy: 1, desc: 'Core electrons on F — tightly bound and not involved in bonding.',
        ao: [
          { atom: 1, n: 1, l: 0, m: 0, zeff: 8.65, c: 1.0 },
        ],
      },
      {
        name: '2σ (F 2s)',
        type: 'nonbonding',
        electrons: 2,
      energy: 1, desc: 'Non-bonding orbital — electrons that don\'t significantly contribute to bond formation.',
      energy: 2, desc: 'Non-bonding orbital — electrons that don\'t significantly contribute to bond formation.',
      energy: 2, desc: 'Non-bonding orbital — electrons that don\'t significantly contribute to bond formation.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 5.13, c: 0.95 },
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.10 },
        ],
      },
      {
        name: '3σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from p/s overlap between Cl and H. Head-on overlap concentrates electron density along the bond axis.',
      energy: 3, desc: 'σ bonding from p/s overlap between F and H. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.70 },  // F 2px along bond
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.52 },  // H 1s
        ],
      },
      {
        name: '1π (F lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },  // F 2py
        ],
      },
      {
        name: '1π\' (F lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },   // F 2pz
        ],
      },
    ],
  },

  // ═══════════════════ HCl — Hydrochloric Acid ═══════════════════
  // Atoms: H(-0.64,0,0) Cl(0.64,0,0) — bond along x-axis
  'HCl': {
    notes: 'Similar to HF but less polar. The bond MO shows more equal sharing between H 1s and Cl 3p.',
    orbitals: [
      {
        name: '3σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on p/s overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.65 },  // Cl 3px along bond
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.55 },  // H 1s
        ],
      },
      {
        name: '1π (Cl lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },  // Cl 3py
        ],
      },
      {
        name: '1π\' (Cl lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },   // Cl 3pz
        ],
      },
      {
        name: 'Cl 3s (inner)',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital localized on Cl.',
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
    notes: 'Triple bond (σ + 2π). One of the strongest bonds known (945 kJ/mol). The MO ordering shows σ₂p below π₂p — a key teaching point.',
    orbitals: [
      {
        name: '2σ_g',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between N — head-on s overlap along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.90, c:  0.707 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.90, c:  0.707 },
        ],
      },
      {
        name: '2σ*_u',
        type: 'antibonding',
        electrons: 2,
      energy: 2, desc: 'σ* antibonding — destructive overlap creates a nodal plane between N. Occupying this weakens the bond.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.90, c:  0.707 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.90, c: -0.707 },
        ],
      },
      {
        name: '1π_u (y)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'π bonding — lateral p overlap between C and O. Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding — lateral p overlap between N. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.90, c:  0.707 },  // N₁ 2py
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.90, c:  0.707 },  // N₂ 2py
        ],
      },
      {
        name: '1π_u (z)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'π bonding — lateral p overlap between C and O. Electron density above and below the bond axis.',
      energy: 4, desc: 'π bonding — lateral p overlap between N. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.90, c:  0.707 },  // N₁ 2pz
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.90, c:  0.707 },  // N₂ 2pz
        ],
      },
      {
        name: '3σ_g',
        type: 'bonding',
        electrons: 2,
      energy: 5, desc: 'σ bonding between N — head-on p overlap along the bond axis.',
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
    notes: 'Bent geometry (104.5°) creates two distinct lone pairs visible in the 3a₁ and 1b₁ orbitals. The sp³-like hybridization explains the angle.',
    orbitals: [
      {
        name: '2a₁ (inner valence)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'Bonding orbital — constructive s overlap between Si and H concentrates electron density between the nuclei.',
      energy: 1, desc: 'Bonding orbital — constructive s overlap between P and H concentrates electron density between the nuclei.',
      energy: 1, desc: 'Bonding orbital — constructive s overlap between S and H concentrates electron density between the nuclei.',
      energy: 1, desc: 'Bonding orbital — constructive s overlap between C and H concentrates electron density between the nuclei.',
      energy: 1, desc: 'Bonding orbital — constructive s/p overlap between N and H concentrates electron density between the nuclei.',
      energy: 1, desc: 'Bonding orbital — constructive s/p overlap between O and H concentrates electron density between the nuclei.',
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
      energy: 2, desc: 'Bonding orbital — constructive p/s overlap between O and H concentrates electron density between the nuclei.',
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
      energy: 4, desc: 'Lone pair localized on P. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on S. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on N. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
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
      energy: 4, desc: 'Lone pair localized on S. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Pyramidal geometry with one lone pair. The inversion barrier creates the famous "nitrogen umbrella" effect.',
    orbitals: [
      {
        name: '2a₁ (inner valence)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'Bonding orbital with s/p character.',
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
      energy: 2, desc: 'Bonding orbital — constructive p/s overlap between N and H concentrates electron density between the nuclei.',
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
      energy: 3, desc: 'σ bonding — head-on overlap concentrates electron density along the bond axis.',
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
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Perfect tetrahedral symmetry. Four equivalent C-H bonds arise from sp³ hybridization of carbon.',
    orbitals: [
      {
        name: '2a₁ (inner valence)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'Bonding orbital with s character.',
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
      energy: 2, desc: 'Bonding orbital — constructive p/s overlap between Si and H concentrates electron density between the nuclei.',
      energy: 2, desc: 'Bonding orbital — constructive p/s overlap between C and H concentrates electron density between the nuclei.',
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
      energy: 3, desc: 'Bonding orbital — constructive p/s overlap between Si and H concentrates electron density between the nuclei.',
      energy: 3, desc: 'Bonding orbital — constructive p/s overlap between C and H concentrates electron density between the nuclei.',
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
      energy: 4, desc: 'Bonding orbital — constructive p/s overlap between Si and H concentrates electron density between the nuclei.',
      energy: 4, desc: 'Bonding orbital — constructive p/s overlap between C and H concentrates electron density between the nuclei.',
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
    notes: 'Linear molecule with two π systems perpendicular to each other. A classic example of sp hybridization and delocalized π bonding.',
    orbitals: [
      {
        name: '3σ_g (C-O σ bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between C and O. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding between C and O — head-on p overlap along the bond axis.',
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
      energy: 3, desc: 'π bonding — lateral p overlap. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'π bonding — lateral p overlap. Electron density above and below the bond axis.',
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
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.707 },  // O₁ 2py
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.707 },  // O₂ 2py
        ],
      },
      {
        name: '1π_g (O lone pair, z)',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Ethylene — the simplest alkene. The π bond restricts rotation around the C=C axis, enabling cis/trans isomerism.',
    orbitals: [
      {
        name: 'σ_CC (C-C σ)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from p/s overlap between C. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from p/s overlap between C and H. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'σ bonding — head-on overlap concentrates electron density along the bond axis.',
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
      energy: 4, desc: 'π bonding — lateral p overlap between C. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.25, c:  0.707 },  // C₁ 2pz (⊥ to plane)
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.25, c:  0.707 },  // C₂ 2pz
        ],
      },
      {
        name: 'π* (C=C π* antibond)',
        type: 'antibonding',
        electrons: 0,
      energy: 5, desc: 'π* antibonding — a node between C in the π system. Occupation reduces bond order.',
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
    notes: 'Ionic bonding: Na donates its 3s electron almost entirely to Cl. The MO coefficients show extreme polarization.',
    orbitals: [
      {
        name: 'σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between Cs and Cl. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between Rb and Cl. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between K and Cl. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between Ca and O. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between Mg and O. Head-on overlap concentrates electron density along the bond axis.',
      energy: 2, desc: 'σ bonding from p/s overlap between F and Na. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between Na and Cl. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.20, c:  0.15 },  // Na 3s (tiny contribution)
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.90 },  // Cl 3px (almost all on Cl)
        ],
      },
      {
        name: 'Cl 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 2, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 2, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 2, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 2, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3s',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Non-bonding orbital localized on undefined.',
      energy: 4, desc: 'Non-bonding orbital localized on Cl.',
      energy: 4, desc: 'Non-bonding orbital localized on Cl.',
      energy: 4, desc: 'Non-bonding orbital localized on Cl.',
      energy: 4, desc: 'Non-bonding orbital localized on Cl.',
      energy: 4, desc: 'Non-bonding orbital localized on Cl.',
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
    notes: 'Paramagnetic! Two unpaired electrons in degenerate π* orbitals explain why liquid oxygen is attracted to magnets.',
    orbitals: [
      {
        name: '2σg',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between F — head-on s overlap along the bond axis.',
      energy: 1, desc: 'σ bonding between O — head-on s overlap along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.707 },
        ],
      },
      {
        name: '2σ*u',
        type: 'antibonding',
        electrons: 2,
      energy: 2, desc: 'σ* antibonding — destructive overlap creates a nodal plane between F. Occupying this weakens the bond.',
      energy: 2, desc: 'σ* antibonding — destructive overlap creates a nodal plane between O. Occupying this weakens the bond.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: '3σg',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between Cl — head-on s overlap along the bond axis.',
      energy: 3, desc: 'σ bonding between F — head-on p overlap along the bond axis.',
      energy: 3, desc: 'σ bonding between O — head-on p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: '1πu (y)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'π bonding — lateral p overlap between C. Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding — lateral p overlap between Si and O. Electron density above and below the bond axis.',
      energy: 4, desc: 'π bonding — lateral p overlap between Cl. Electron density above and below the bond axis.',
      energy: 4, desc: 'π bonding — lateral p overlap between F. Electron density above and below the bond axis.',
      energy: 4, desc: 'π bonding — lateral p overlap between O. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
      {
        name: '1πu (z)',
        type: 'bonding',
        electrons: 2,
      energy: 5, desc: 'π bonding — lateral p overlap between C. Electron density above and below the bond axis.',
      energy: 4, desc: 'π bonding — lateral p overlap between Si and O. Electron density above and below the bond axis.',
      energy: 5, desc: 'π bonding — lateral p overlap between Cl. Electron density above and below the bond axis.',
      energy: 5, desc: 'π bonding — lateral p overlap between F. Electron density above and below the bond axis.',
      energy: 5, desc: 'π bonding — lateral p overlap between O. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
        ],
      },
      {
        name: '1π*g (y) ↑',
        type: 'antibonding',
        electrons: 1,
      energy: 6, desc: 'π* antibonding — a node between O in the π system. Occupation reduces bond order.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: '1π*g (z) ↑',
        type: 'antibonding',
        electrons: 1,
      energy: 7, desc: 'π* antibonding — a node between O in the π system. Occupation reduces bond order.',
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
    notes: 'Weak single bond despite high electronegativity. Lone pair repulsion weakens the bond — F₂ is actually less stable than expected.',
    orbitals: [
      {
        name: '2σg',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 5.13, c:  0.707 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 5.13, c:  0.707 },
        ],
      },
      {
        name: '2σ*u',
        type: 'antibonding',
        electrons: 2,
      energy: 2, desc: 'σ* antibonding — destructive overlap with a nodal plane between atoms. Occupation weakens the bond.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 5.13, c:  0.707 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 5.13, c: -0.707 },
        ],
      },
      {
        name: '3σg',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.707 },
        ],
      },
      {
        name: '1πu (y)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'π bonding — lateral p overlap. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: '1πu (z)',
        type: 'bonding',
        electrons: 2,
      energy: 5, desc: 'π bonding — lateral p overlap. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: '1π*g (y)',
        type: 'antibonding',
        electrons: 2,
      energy: 6, desc: 'π* antibonding — a node between Cl in the π system. Occupation reduces bond order.',
      energy: 6, desc: 'π* antibonding — a node between F in the π system. Occupation reduces bond order.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 5.13, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: -0.707 },
        ],
      },
      {
        name: '1π*g (z)',
        type: 'antibonding',
        electrons: 2,
      energy: 7, desc: 'π* antibonding — a node between Cl in the π system. Occupation reduces bond order.',
      energy: 7, desc: 'π* antibonding — a node between F in the π system. Occupation reduces bond order.',
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
    notes: 'Isoelectronic with N₂. The carbon lone pair acts as a strong σ-donor in metal carbonyls. HOMO is surprisingly carbon-centered.',
    orbitals: [
      {
        name: '3σ (O inner)',
        type: 'nonbonding',
        electrons: 2,
      energy: 1, desc: 'Non-bonding orbital — electrons that don\'t significantly contribute to bond formation.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.90 },
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.25, c: 0.20 },
        ],
      },
      {
        name: '4σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding between  — head-on p overlap along the bond axis.',
      energy: 2, desc: 'σ bonding from s/p overlap between C and O. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'π bonding — lateral p overlap between . Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding — lateral p overlap between N and O. Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding — lateral p overlap between C and O. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.25, c: 0.55 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.63 },
        ],
      },
      {
        name: '1π (z)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'π bonding — lateral p overlap between N and O. Electron density above and below the bond axis.',
      energy: 4, desc: 'π bonding — lateral p overlap between C and O. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.25, c: 0.55 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.63 },
        ],
      },
      {
        name: '5σ (C lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair localized on C. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Highly ionic. Li 2s electron transfers almost completely to F, creating one of the largest dipole moments among diatomics.',
    orbitals: [
      {
        name: '1σ (Li core)',
        type: 'core',
        electrons: 2,
      energy: 1, desc: 'Core electrons on Li — tightly bound and not involved in bonding.',
        ao: [
          { atom: 0, n: 1, l: 0, m: 0, zeff: 2.70, c: 1.0 },
        ],
      },
      {
        name: '2σ (F 2s)',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 5.13, c: 0.95 },
          { atom: 0, n: 2, l: 0, m: 0, zeff: 1.30, c: 0.10 },
        ],
      },
      {
        name: '3σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding from p/s overlap between F and Li. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.92 },
          { atom: 0, n: 2, l: 0, m: 0, zeff: 1.30, c: 0.25 },
        ],
      },
      {
        name: '1π (F lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: '1π\' (F lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Single σ bond between two 3p orbitals. The four lone pairs per atom are non-bonding.',
    orbitals: [
      {
        name: '3σg',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 6.12, c:  0.707 },
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c:  0.707 },
        ],
      },
      {
        name: '3σ*u',
        type: 'antibonding',
        electrons: 2,
      energy: 2, desc: 'σ* antibonding — destructive overlap creates a nodal plane between Cl. Occupying this weakens the bond.',
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 6.12, c:  0.707 },
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: -0.707 },
        ],
      },
      {
        name: '4σg',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding between Cl — head-on p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.707 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.707 },
        ],
      },
      {
        name: '1πu (y)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'π bonding — lateral p overlap. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: '1πu (z)',
        type: 'bonding',
        electrons: 2,
      energy: 5, desc: 'π bonding — lateral p overlap. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: '1π*g (y)',
        type: 'antibonding',
        electrons: 2,
      energy: 6, desc: 'π* antibonding — a node in the π system. Occupation reduces bond order.',
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c:  0.707 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: -0.707 },
        ],
      },
      {
        name: '1π*g (z)',
        type: 'antibonding',
        electrons: 2,
      energy: 7, desc: 'π* antibonding — a node in the π system. Occupation reduces bond order.',
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
    notes: 'Weaker bond than HCl — the trend HF › HCl › HBr › HI shows how orbital size mismatch reduces overlap.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between K and I. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding between  — head-on p overlap along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between . Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between . Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between . Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding between  — head-on p overlap along the bond axis.',
      energy: 1, desc: 'σ bonding between  — head-on p overlap along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between W and C. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding between Pb and O — head-on p overlap along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between Cu and O. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between Ni and O. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between Fe and O. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between Zn and S. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between Zn and O. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between Cd and S. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between Ag and Cl. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from p/s overlap between Br and H. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 4, l: 1, m: 1, zeff: 7.60, c: 0.70 },
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.52 },
        ],
      },
      {
        name: '1π (Br lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Lone pair localized on Br. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 4, l: 1, m: -1, zeff: 7.60, c: 1.0 },
        ],
      },
      {
        name: '1π\' (Br lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 4, l: 1, m: 0, zeff: 7.60, c: 1.0 },
        ],
      },
      {
        name: 'Br 4s (inner)',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital localized on Br.',
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
    notes: 'Nearly pure ionic bond. Useful comparison with NaCl to show the effect of anion electronegativity.',
    orbitals: [
      {
        name: '2σ (F 2s)',
        type: 'nonbonding',
        electrons: 2,
      energy: 1, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 5.13, c: 0.96 },
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.20, c: 0.08 },
        ],
      },
      {
        name: 'σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding — head-on p/s overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.93 },
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.20, c: 0.20 },
        ],
      },
      {
        name: 'F 2py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Ozone — bent molecule with delocalized π electrons across all three oxygens. Resonance structures explain the equal O-O bond lengths.',
    orbitals: [
      {
        name: 'π₁ (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'π bonding — lateral p overlap between Se and O. Electron density above and below the bond axis.',
      energy: 1, desc: 'π bonding — lateral p overlap between S and O. Electron density above and below the bond axis.',
      energy: 1, desc: 'π bonding — lateral p overlap between O. Electron density above and below the bond axis.',
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
      energy: 5, desc: 'Non-bonding orbital localized on O.',
      energy: 2, desc: 'Non-bonding orbital localized on O.',
      energy: 2, desc: 'Non-bonding orbital localized on O.',
      energy: 2, desc: 'Non-bonding orbital localized on O.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: 'σ₁ (O-O bond)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding from p/s overlap between O. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 4, desc: 'σ bonding from s/p overlap between O. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 4, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on Ti. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.85 },
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.40 },
        ],
      },
      {
        name: 'O₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
      energy: 8, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 7, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.85 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.40 },
        ],
      },
      {
        name: 'Central O lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'π* (empty)',
        type: 'antibonding',
        electrons: 0,
      energy: 8, desc: 'π* antibonding — a node between Se and O in the π system. Occupation reduces bond order.',
      energy: 9, desc: 'π* antibonding — a node between N and O in the π system. Occupation reduces bond order.',
      energy: 8, desc: 'π* antibonding — a node between S and O in the π system. Occupation reduces bond order.',
      energy: 8, desc: 'π* antibonding — a node between O in the π system. Occupation reduces bond order.',
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
    notes: 'Bent like water but with a smaller bond angle (92°) due to less s-p mixing in sulfur.',
    orbitals: [
      {
        name: '2a₁ (inner valence)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'Bonding orbital with s character.',
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
      energy: 2, desc: 'Bonding orbital — constructive p/s overlap between S and H concentrates electron density between the nuclei.',
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
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 5.45, c: 0.85 },
          { atom: 0, n: 3, l: 0, m: 0, zeff: 5.45, c: 0.35 },
        ],
      },
      {
        name: '1b₁ (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Bent molecule with resonance — sulfur uses d-orbital participation for expanded octet.',
    orbitals: [
      {
        name: 'π₁ (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: 'σ₁ (S-O bond)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding between S and O — head-on p overlap along the bond axis.',
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
      energy: 4, desc: 'σ bonding between S and O — head-on s overlap along the bond axis.',
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
      energy: 5, desc: 'Lone pair localized on S. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 5.45, c: 0.90 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 7, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 7, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 7, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 7, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'π* (empty)',
        type: 'antibonding',
        electrons: 0,
      energy: 8, desc: 'π* antibonding — a node in the π system. Occupation reduces bond order.',
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
    notes: 'Linear but asymmetric (N-N-O). A greenhouse gas with resonance structures: N=N=O ↔ N≡N⁻-O⁺.',
    orbitals: [
      {
        name: '4σ (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between N and O — head-on s overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding between N and O — head-on p overlap along the bond axis.',
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
      energy: 3, desc: 'π bonding — lateral p overlap. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'π bonding — lateral p overlap. Electron density above and below the bond axis.',
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
      energy: 5, desc: 'Lone pair localized on N. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.90, c: -0.80 },
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.90, c:  0.40 },
        ],
      },
      {
        name: '2π (y, nonbonding)',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Non-bonding orbital — electrons that don\'t significantly contribute to bond formation.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.90, c:  0.65 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.65 },
        ],
      },
      {
        name: '2π (z, nonbonding)',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Non-bonding orbital — electrons that don\'t significantly contribute to bond formation.',
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
    notes: 'Linear — sp hybridization produces 180° bond angle. An electron-deficient compound (only 4 valence electrons on Be).',
    orbitals: [
      {
        name: 'σg (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between . Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between Mg and Cl. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding between I — head-on p overlap along the bond axis.',
      energy: 1, desc: 'σ bonding between Br — head-on p overlap along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between Be and Cl. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding between  — head-on p overlap along the bond axis.',
      energy: 2, desc: 'σ bonding between Mg and Cl — head-on p overlap along the bond axis.',
      energy: 2, desc: 'σ bonding between Be and Cl — head-on p overlap along the bond axis.',
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
      energy: 3, desc: 'Non-bonding orbital localized on Cl.',
      energy: 3, desc: 'Non-bonding orbital localized on Cl.',
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₁ π (z)',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital localized on Cl.',
      energy: 4, desc: 'Non-bonding orbital localized on Cl.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₂ π (y)',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Non-bonding orbital localized on Cl.',
      energy: 5, desc: 'Non-bonding orbital localized on Cl.',
        ao: [
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₂ π (z)',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Non-bonding orbital localized on Cl.',
      energy: 6, desc: 'Non-bonding orbital localized on Cl.',
        ao: [
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₁ 3s',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Non-bonding orbital localized on Cl.',
      energy: 7, desc: 'Non-bonding orbital localized on Cl.',
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₂ 3s',
        type: 'nonbonding',
        electrons: 2,
      energy: 8, desc: 'Non-bonding orbital localized on Cl.',
      energy: 8, desc: 'Non-bonding orbital localized on Cl.',
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
    notes: 'Linear noble gas compound — the 1962 discovery of XeF₂ overturned the "inert gas" dogma. Three-center four-electron bond.',
    orbitals: [
      {
        name: '3c-σ (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between Kr and F — head-on p overlap along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between H and Ar and F. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding between F and Xe — head-on p overlap along the bond axis.',
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
      energy: 2, desc: 'Non-bonding orbital — electrons that don\'t significantly contribute to bond formation.',
      energy: 2, desc: 'Non-bonding orbital localized on F.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.707 },
        ],
      },
      {
        name: 'F₁ lone pair (y)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair localized on Kr. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₁ lone pair (z)',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair localized on Kr. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₂ lone pair (y)',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₂ lone pair (z)',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'Xe 5s',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Non-bonding orbital localized on Xe.',
        ao: [
          { atom: 1, n: 5, l: 0, m: 0, zeff: 8.25, c: 1.0 },
        ],
      },
      {
        name: 'Xe 5py',
        type: 'nonbonding',
        electrons: 2,
      energy: 8, desc: 'Non-bonding orbital localized on Xe.',
        ao: [
          { atom: 1, n: 5, l: 1, m: -1, zeff: 8.25, c: 1.0 },
        ],
      },
      {
        name: 'Xe 5pz',
        type: 'nonbonding',
        electrons: 2,
      energy: 9, desc: 'Non-bonding orbital localized on Xe.',
        ao: [
          { atom: 1, n: 5, l: 1, m: 0, zeff: 8.25, c: 1.0 },
        ],
      },
      {
        name: '3c-σ* (empty)',
        type: 'antibonding',
        electrons: 0,
      energy: 10, desc: 'σ* antibonding — destructive overlap creates a nodal plane between Kr and F. Occupying this weakens the bond.',
      energy: 10, desc: 'σ* antibonding — destructive overlap creates a nodal plane between F and Xe. Occupying this weakens the bond.',
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
    notes: 'Silicon dioxide — building block of glass and quartz. Strong Si-O σ and π bonds.',
    orbitals: [
      {
        name: 'σg (Si-O bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between Si and O. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding between Si and O — head-on p overlap along the bond axis.',
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
      energy: 3, desc: 'π bonding — lateral p overlap. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'π bonding — lateral p overlap. Electron density above and below the bond axis.',
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
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.85 },
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.40 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Trigonal planar, electron-deficient. The empty p orbital on boron creates a classic Lewis acid.',
    orbitals: [
      {
        name: 'a₁\' (σ symmetric)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding — head-on overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'σ bonding — head-on overlap concentrates electron density along the bond axis.',
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
      energy: 4, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₂ lone pairs',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 0, m: 0, zeff: 5.13, c: 0.85 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.40 },
        ],
      },
      {
        name: 'F₃ lone pairs',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 3, n: 2, l: 0, m: 0, zeff: 5.13, c: 0.85 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.40 },
        ],
      },
      {
        name: 'F 2s (inner)',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Non-bonding orbital localized on F.',
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
      energy: 8, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
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
      energy: 9, desc: 'Antibonding — electron density pushed away from the internuclear region.',
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
    notes: 'Acetylene — sp hybridized carbons with two orthogonal π bonds forming the triple bond.',
    orbitals: [
      {
        name: '2σg (C-H bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between C and H — head-on s overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding between C and H — head-on s overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding between C — head-on p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.25, c: -0.707 },
        ],
      },
      {
        name: '1πu (y)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'π bonding — lateral p overlap. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.25, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.25, c: 0.707 },
        ],
      },
      {
        name: '1πu (z)',
        type: 'bonding',
        electrons: 2,
      energy: 5, desc: 'π bonding — lateral p overlap. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.25, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.25, c: 0.707 },
        ],
      },
      {
        name: '1π*g (y)',
        type: 'antibonding',
        electrons: 0,
      energy: 6, desc: 'π* antibonding — a node between C in the π system. Occupation reduces bond order.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.25, c:  0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.25, c: -0.707 },
        ],
      },
      {
        name: '1π*g (z)',
        type: 'antibonding',
        electrons: 0,
      energy: 7, desc: 'π* antibonding — a node between C in the π system. Occupation reduces bond order.',
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
    notes: 'Pyramidal like NH₃ but with a much smaller bond angle (~93°) — almost pure p bonding with minimal s mixing.',
    orbitals: [
      {
        name: '2a₁ (inner valence)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'Bonding orbital with s character.',
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
      energy: 2, desc: 'Bonding orbital — constructive p/s overlap between P and H concentrates electron density between the nuclei.',
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
      energy: 3, desc: 'σ bonding — head-on overlap concentrates electron density along the bond axis.',
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
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Trigonal planar with resonating π bonds across all S-O linkages. A strong Lewis acid and precursor to sulfuric acid.',
    orbitals: [
      {
        name: 'a₁\' (σ framework)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding — head-on overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'σ bonding — head-on overlap concentrates electron density along the bond axis.',
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
      energy: 4, desc: 'σ bonding — head-on overlap concentrates electron density along the bond axis.',
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
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.85 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.40 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.85 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.40 },
        ],
      },
      {
        name: 'O₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 3, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.85 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.40 },
        ],
      },
      {
        name: 'O pz (lone pairs)',
        type: 'nonbonding',
        electrons: 2,
      energy: 8, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Hydrogen peroxide — the weak O-O single bond and non-planar geometry explain its reactivity as an oxidizer.',
    orbitals: [
      {
        name: 'σ (O-O bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between O. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from p/s overlap between O and H. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.65 },
        ],
      },
      {
        name: 'σ (O₂-H₂)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding from p/s overlap between O and H. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.65 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.90 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Silane — tetrahedral like CH₄. The longer Si-H bonds and lower electronegativity difference affect terminal orbital shapes.',
    orbitals: [
      {
        name: '2a₁ (inner valence)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'Bonding orbital with s character.',
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
      energy: 2, desc: 'σ bonding — head-on p/s overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'σ bonding — head-on p/s overlap concentrates electron density along the bond axis.',
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
      energy: 4, desc: 'σ bonding — head-on p/s overlap concentrates electron density along the bond axis.',
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
    notes: 'Diborane features unusual three-center two-electron bonds — electron-deficient "banana bonds" bridging the two borons.',
    orbitals: [
      {
        name: 'σg (B-Ht sym)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between B and H — head-on s overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding between B and H — head-on s overlap along the bond axis.',
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
      energy: 3, desc: 'Bonding orbital — constructive p/s overlap between B and H concentrates electron density between the nuclei.',
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
      energy: 4, desc: 'Bonding orbital — constructive p/s overlap between B and H concentrates electron density between the nuclei.',
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
      energy: 5, desc: 'Bonding orbital — constructive p/s overlap between B and H concentrates electron density between the nuclei.',
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
      energy: 6, desc: 'Antibonding orbital — electron density pushed away from the internuclear region.',
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
    notes: 'Bent radical with one unpaired electron. Brown gas responsible for smog. Dimerizes to N₂O₄.',
    orbitals: [
      {
        name: 'σ₁ (s framework)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between N and O — head-on s overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding between N and O — head-on p overlap along the bond axis.',
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
      energy: 3, desc: 'π bonding — lateral p overlap between N and O. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'Non-bonding orbital localized on O.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: 'N lone pair (y)',
        type: 'nonbonding',
        electrons: 1,
      energy: 5, desc: 'Lone pair localized on N. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.90, c: 0.90 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'σ (N-O antibond)',
        type: 'bonding',
        electrons: 2,
      energy: 8, desc: 'σ bonding from s/p overlap between N and O. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 9, desc: 'π* antibonding — a node in the π system. Occupation reduces bond order.',
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
    notes: 'Ionic compound where two Li atoms donate to oxygen. The O 2p orbitals dominate the bonding MOs.',
    orbitals: [
      {
        name: 'σ₁ (ionic bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between O and Li — head-on s overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from p/s overlap between O and Li. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'Non-bonding orbital localized on undefined.',
      energy: 3, desc: 'Non-bonding orbital localized on undefined.',
      energy: 3, desc: 'Non-bonding orbital localized on O.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital localized on undefined.',
      energy: 4, desc: 'Non-bonding orbital localized on undefined.',
      energy: 4, desc: 'Non-bonding orbital localized on O.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'Li₁ 1s (core)',
        type: 'core',
        electrons: 2,
      energy: 5, desc: 'Core electrons on Li — tightly bound and not involved in bonding.',
        ao: [
          { atom: 0, n: 1, l: 0, m: 0, zeff: 2.70, c: 1.0 },
        ],
      },
      {
        name: 'Li₂ 1s (core)',
        type: 'core',
        electrons: 2,
      energy: 6, desc: 'Core electrons on Li — tightly bound and not involved in bonding.',
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
    notes: 'One of the most refractory oxides. Predominantly ionic with partial covalent character.',
    orbitals: [
      {
        name: 'σ (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between Ga and As — head-on p overlap along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between Be and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 1.95, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (bonding, y)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'π bonding — lateral p overlap between Ga and As. Electron density above and below the bond axis.',
      energy: 2, desc: 'π bonding — lateral p overlap between Be and O. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 1.95, c:  0.40 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.80 },
        ],
      },
      {
        name: 'π (bonding, z)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'π bonding — lateral p overlap between Ga and As. Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding — lateral p overlap between Be and O. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 1.95, c:  0.40 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.80 },
        ],
      },
      {
        name: 'O 2s (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.90 },
        ],
      },
      {
        name: 'σ* (empty)',
        type: 'antibonding',
        electrons: 0,
      energy: 6, desc: 'σ* antibonding — destructive overlap creates a nodal plane between Ga and As. Occupying this weakens the bond.',
      energy: 5, desc: 'σ* antibonding — destructive overlap creates a nodal plane between Be and O. Occupying this weakens the bond.',
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
    notes: 'Highly ionic — wide bandgap (7.8 eV) makes it an excellent insulator. Isoelectronic with NaF.',
    orbitals: [
      {
        name: 'σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.85, c:  0.20 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.88 },
        ],
      },
      {
        name: 'O 2py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 2, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 2, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 2, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Non-bonding orbital localized on undefined.',
      energy: 2, desc: 'Non-bonding orbital localized on undefined.',
      energy: 4, desc: 'Non-bonding orbital localized on undefined.',
      energy: 4, desc: 'Non-bonding orbital localized on O.',
      energy: 4, desc: 'Non-bonding orbital localized on O.',
      energy: 5, desc: 'Non-bonding orbital localized on O.',
      energy: 4, desc: 'Non-bonding orbital localized on O.',
      energy: 4, desc: 'Non-bonding orbital localized on O.',
      energy: 4, desc: 'Non-bonding orbital localized on O.',
      energy: 4, desc: 'Non-bonding orbital localized on O.',
      energy: 4, desc: 'Non-bonding orbital localized on O.',
      energy: 4, desc: 'Non-bonding orbital localized on O.',
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
    notes: 'Quicklime — important industrial chemical. Ionic bonding with Ca 4s → O 2p electron transfer.',
    orbitals: [
      {
        name: 'σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 2.85, c:  0.18 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.90 },
        ],
      },
      {
        name: 'O 2py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
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
    notes: 'Model ionic compound. The potassium 4s electron transfers almost completely to chlorine 3p.',
    orbitals: [
      {
        name: 'σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 2.20, c:  0.12 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.92 },
        ],
      },
      {
        name: 'Cl 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
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
    notes: 'Heavier alkali halide — comparing with KCl shows how larger atomic radii affect orbital overlap.',
    orbitals: [
      {
        name: 'σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 2.20, c:  0.10 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.93 },
        ],
      },
      {
        name: 'Cl 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
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
    notes: 'Famous for its body-centered cubic crystal structure. Extreme ionic character with the largest alkali cation.',
    orbitals: [
      {
        name: 'σ (ionic bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 2.20, c:  0.08 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.94 },
        ],
      },
      {
        name: 'Cl 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
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
    notes: 'Silver chloride — a partially covalent "ionic" compound. Ag 4d participation gives it photosensitivity.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.25, c:  0.30 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c:  0.80 },
        ],
      },
      {
        name: 'Cl 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Ag 5s (antibond)',
        type: 'antibonding',
        electrons: 0,
      energy: 5, desc: 'Antibonding orbital — electron density pushed away from the internuclear region.',
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
    notes: 'Bromine — the only liquid nonmetal at room temperature. Single σ bond between 4p orbitals.',
    orbitals: [
      {
        name: 'σg (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 1, m: 1, zeff: 7.60, c:  0.707 },
          { atom: 1, n: 4, l: 1, m: 1, zeff: 7.60, c: -0.707 },
        ],
      },
      {
        name: 'πu (bonding, y)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'π bonding — lateral f/p overlap between O and Pa. Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding — lateral f/p overlap between O and Cm. Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding — lateral f/p overlap between O and Am. Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding — lateral f/p overlap between O and Np. Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding — lateral p overlap between . Electron density above and below the bond axis.',
      energy: 2, desc: 'π bonding — lateral p overlap between I. Electron density above and below the bond axis.',
      energy: 2, desc: 'π bonding — lateral p overlap between Br. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 1, m: -1, zeff: 7.60, c:  0.707 },
          { atom: 1, n: 4, l: 1, m: -1, zeff: 7.60, c:  0.707 },
        ],
      },
      {
        name: 'πu (bonding, z)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'π bonding — lateral f/p overlap between O and Pa. Electron density above and below the bond axis.',
      energy: 4, desc: 'π bonding — lateral f/p overlap between O and Cm. Electron density above and below the bond axis.',
      energy: 4, desc: 'π bonding — lateral f/p overlap between O and Am. Electron density above and below the bond axis.',
      energy: 4, desc: 'π bonding — lateral f/p overlap between O and Np. Electron density above and below the bond axis.',
      energy: 4, desc: 'π bonding — lateral p overlap between . Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding — lateral p overlap between I. Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding — lateral p overlap between Br. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 7.60, c:  0.707 },
          { atom: 1, n: 4, l: 1, m: 0, zeff: 7.60, c:  0.707 },
        ],
      },
      {
        name: 'πg* (antibond, y)',
        type: 'antibonding',
        electrons: 2,
      energy: 4, desc: 'Antibonding orbital — electron density pushed away from the internuclear region.',
      energy: 4, desc: 'Antibonding orbital — electron density pushed away from the internuclear region.',
        ao: [
          { atom: 0, n: 4, l: 1, m: -1, zeff: 7.60, c:  0.707 },
          { atom: 1, n: 4, l: 1, m: -1, zeff: 7.60, c: -0.707 },
        ],
      },
      {
        name: 'πg* (antibond, z)',
        type: 'antibonding',
        electrons: 2,
      energy: 5, desc: 'Antibonding orbital — electron density pushed away from the internuclear region.',
      energy: 5, desc: 'Antibonding orbital — electron density pushed away from the internuclear region.',
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 7.60, c:  0.707 },
          { atom: 1, n: 4, l: 1, m: 0, zeff: 7.60, c: -0.707 },
        ],
      },
      {
        name: 'σg (4s bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 6, desc: 'σ bonding between Br — head-on s overlap along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 7.60, c:  0.707 },
          { atom: 1, n: 4, l: 0, m: 0, zeff: 7.60, c:  0.707 },
        ],
      },
      {
        name: 'σu* (antibond)',
        type: 'antibonding',
        electrons: 0,
      energy: 7, desc: 'Antibonding orbital — electron density pushed away from the internuclear region.',
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
    notes: 'Iodine — a semiconductor in solid form. The weakest halogen-halogen bond due to poor 5p-5p overlap.',
    orbitals: [
      {
        name: 'σg (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 7.00, c:  0.707 },
          { atom: 1, n: 5, l: 1, m: 1, zeff: 7.00, c: -0.707 },
        ],
      },
      {
        name: 'πu (bonding, y)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 1, m: -1, zeff: 7.00, c:  0.707 },
          { atom: 1, n: 5, l: 1, m: -1, zeff: 7.00, c:  0.707 },
        ],
      },
      {
        name: 'πu (bonding, z)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 1, m: 0, zeff: 7.00, c:  0.707 },
          { atom: 1, n: 5, l: 1, m: 0, zeff: 7.00, c:  0.707 },
        ],
      },
      {
        name: 'πg* (antibond, y)',
        type: 'antibonding',
        electrons: 2,
      energy: 4, desc: 'π* antibonding — a node in the π system. Occupation reduces bond order.',
        ao: [
          { atom: 0, n: 5, l: 1, m: -1, zeff: 7.00, c:  0.707 },
          { atom: 1, n: 5, l: 1, m: -1, zeff: 7.00, c: -0.707 },
        ],
      },
      {
        name: 'πg* (antibond, z)',
        type: 'antibonding',
        electrons: 2,
      energy: 5, desc: 'π* antibonding — a node in the π system. Occupation reduces bond order.',
        ao: [
          { atom: 0, n: 5, l: 1, m: 0, zeff: 7.00, c:  0.707 },
          { atom: 1, n: 5, l: 1, m: 0, zeff: 7.00, c: -0.707 },
        ],
      },
      {
        name: 'σg (5s bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 6, desc: 'σ bonding between I — head-on s overlap along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 7.00, c:  0.707 },
          { atom: 1, n: 5, l: 0, m: 0, zeff: 7.00, c:  0.707 },
        ],
      },
      {
        name: 'σu* (empty)',
        type: 'antibonding',
        electrons: 0,
      energy: 7, desc: 'Antibonding orbital — electron density pushed away from the internuclear region.',
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
    notes: 'Gallium arsenide — the semiconductor behind LEDs, solar cells, and fast transistors. Direct bandgap material.',
    orbitals: [
      {
        name: 'σ (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 1, m: 1, zeff: 5.00, c:  0.55 },
          { atom: 1, n: 4, l: 1, m: 1, zeff: 5.80, c: -0.65 },
        ],
      },
      {
        name: 'π (bonding, y)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 1, m: -1, zeff: 5.00, c:  0.50 },
          { atom: 1, n: 4, l: 1, m: -1, zeff: 5.80, c:  0.70 },
        ],
      },
      {
        name: 'π (bonding, z)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 5.00, c:  0.50 },
          { atom: 1, n: 4, l: 1, m: 0, zeff: 5.80, c:  0.70 },
        ],
      },
      {
        name: 'As lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair localized on As. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 4, l: 0, m: 0, zeff: 5.80, c: 0.90 },
        ],
      },
      {
        name: 'Ga 4s',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Non-bonding orbital localized on Ga.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 5.00, c: 1.0 },
        ],
      },
      {
        name: 'σ* (empty)',
        type: 'antibonding',
        electrons: 0,
      energy: 6, desc: 'σ* antibonding — destructive overlap with a nodal plane between atoms. Occupation weakens the bond.',
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
    notes: 'Cadmium sulfide — a quantum dot material. The Cd 5s and S 3p orbitals form the band edges.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.55, c:  0.30 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 5.45, c:  0.80 },
        ],
      },
      {
        name: 'S 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Lone pair localized on S. Non-bonding electrons that can act as a Lewis base.',
      energy: 2, desc: 'Lone pair localized on S. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 5.45, c: 1.0 },
        ],
      },
      {
        name: 'S 3pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair localized on S. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on S. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 5.45, c: 1.0 },
        ],
      },
      {
        name: 'S 3s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital localized on S.',
      energy: 4, desc: 'Non-bonding orbital localized on S.',
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
    notes: 'Zinc oxide — a wide-bandgap semiconductor used in sunscreen, LEDs, and varistors.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 4.35, c:  0.30 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.80 },
        ],
      },
      {
        name: 'O 2py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
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
    notes: 'Zinc sulfide — the phosphor in vintage TV screens. Two crystal forms: zinc blende and wurtzite.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 4.35, c:  0.30 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 5.45, c:  0.80 },
        ],
      },
      {
        name: 'S 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 5.45, c: 1.0 },
        ],
      },
      {
        name: 'S 3pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 5.45, c: 1.0 },
        ],
      },
      {
        name: 'S 3s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
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
    notes: 'Wüstite — always iron-deficient in nature. Fe 3d electrons create the magnetic and conducting properties.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.75, c:  0.35 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (d-p bond, y)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'π bonding from d-p lateral overlap between . Electron density above and below the bond axis.',
      energy: 2, desc: 'π bonding from d-p lateral overlap between W and C. Electron density above and below the bond axis.',
      energy: 2, desc: 'π bonding from d-p lateral overlap between Cu and O. Electron density above and below the bond axis.',
      energy: 2, desc: 'π bonding from d-p lateral overlap between Ni and O. Electron density above and below the bond axis.',
      energy: 2, desc: 'π bonding from d-p lateral overlap between Fe and O. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -1, zeff: 6.25, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (d-p bond, z)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'π bonding from d-p lateral overlap between . Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding from d-p lateral overlap between W and C. Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding from d-p lateral overlap between Cu and O. Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding from d-p lateral overlap between Ni and O. Electron density above and below the bond axis.',
      energy: 3, desc: 'π bonding from d-p lateral overlap between Fe and O. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 1, zeff: 6.25, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'Fe dxy',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Non-bonding orbital localized on Fe.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -2, zeff: 6.25, c: 1.0 },
        ],
      },
      {
        name: 'Fe dx²-y²',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Non-bonding orbital localized on Fe.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 2, zeff: 6.25, c: 1.0 },
        ],
      },
      {
        name: 'Fe dz²',
        type: 'nonbonding',
        electrons: 1,
      energy: 7, desc: 'Non-bonding orbital localized on Fe.',
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
    notes: 'A textbook Mott insulator — should be metallic by band theory but electron correlations localize the d-electrons.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 4.05, c:  0.35 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (d-p bond, y)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -1, zeff: 7.55, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (d-p bond, z)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 1, zeff: 7.55, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'Ni dxy',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Non-bonding orbital localized on undefined.',
      energy: 5, desc: 'Non-bonding orbital localized on Ni.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -2, zeff: 7.55, c: 1.0 },
        ],
      },
      {
        name: 'Ni dx²-y²',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital localized on undefined.',
      energy: 6, desc: 'Non-bonding orbital localized on Ni.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 2, zeff: 7.55, c: 1.0 },
        ],
      },
      {
        name: 'Ni dz²',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Non-bonding orbital localized on Ni.',
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
    notes: 'Copper(II) oxide — important in high-temperature superconductor parent compounds.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.70, c:  0.35 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (d-p bond, y)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -1, zeff: 7.85, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (d-p bond, z)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 1, zeff: 7.85, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'Cu dxy',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Non-bonding orbital localized on Cu.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -2, zeff: 7.85, c: 1.0 },
        ],
      },
      {
        name: 'Cu dx²-y²',
        type: 'nonbonding',
        electrons: 1,
      energy: 6, desc: 'Non-bonding orbital localized on Cu.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 2, zeff: 7.85, c: 1.0 },
        ],
      },
      {
        name: 'Cu dz²',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Non-bonding orbital localized on Cu.',
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
    notes: 'Lead(II) oxide — the Pb 6s² lone pair drives its unusual litharge crystal structure.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 6, l: 1, m: 1, zeff: 6.50, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'Pb 6s (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Lone pair localized on Pb. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 6.50, c: 1.0 },
        ],
      },
      {
        name: 'O 2py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
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
    notes: 'Tungsten carbide — hardness approaching diamond. Strong W 5d — C 2p covalent bonds explain its properties.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.35, c:  0.40 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.70 },
        ],
      },
      {
        name: 'π (d-p bond, y)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 2, m: -1, zeff: 8.50, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.25, c:  0.65 },
        ],
      },
      {
        name: 'π (d-p bond, z)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 2, m: 1, zeff: 8.50, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.25, c:  0.65 },
        ],
      },
      {
        name: 'C 2s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital localized on C.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.25, c: 1.0 },
        ],
      },
      {
        name: 'W dxy',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Non-bonding orbital localized on W.',
        ao: [
          { atom: 0, n: 5, l: 2, m: -2, zeff: 8.50, c: 1.0 },
        ],
      },
      {
        name: 'W dx²-y²',
        type: 'nonbonding',
        electrons: 0,
      energy: 6, desc: 'Non-bonding orbital localized on W.',
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
    notes: 'Sodium hydroxide — the O-H bond and metal-oxygen interaction make this a strong base.',
    orbitals: [
      {
        name: 'σ (O-H bond)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding from p/s overlap between O and H. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from p/s overlap between O and H. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from p/s overlap between O and H. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from p/s overlap between O and Na. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.85 },
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.20, c:  0.10 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
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
    notes: 'Lithium hydroxide — used in spacecraft CO₂ scrubbers. More covalent than NaOH.',
    orbitals: [
      {
        name: 'σ (O-H bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on p/s overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from p/s overlap between O and Li. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.85 },
          { atom: 0, n: 2, l: 0, m: 0, zeff: 1.30, c:  0.12 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'Li 1s (core)',
        type: 'core',
        electrons: 2,
      energy: 5, desc: 'Core electrons on Li — tightly bound and not involved in bonding.',
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
    notes: 'Hydrogen selenide — toxic gas. Even smaller bond angle than H₂S (~91°), approaching pure p-orbital bonding.',
    orbitals: [
      {
        name: 'σ₁ (Se-H bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from p/s overlap between Se and H. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from p/s overlap between Se and H. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'Lone pair localized on Se. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 6.20, c: 1.0 },
        ],
      },
      {
        name: 'Se 4s (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair localized on Se. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Hydrogen telluride — bond angle ~90° shows almost pure p-orbital bonding with negligible hybridization.',
    orbitals: [
      {
        name: 'σ₁ (Te-H bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from p/s overlap between Te and H. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from p/s overlap between Te and H. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'Lone pair localized on Te. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 5, l: 1, m: 0, zeff: 6.55, c: 1.0 },
        ],
      },
      {
        name: 'Te 5s (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair localized on Te. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Selenium dioxide — polymeric chain in solid state. The Se=O double bond uses 4p-2p π overlap.',
    orbitals: [
      {
        name: 'π₁ (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: 'σ₁ (Se-O bond)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding between Se and O — head-on p overlap along the bond axis.',
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
      energy: 4, desc: 'σ bonding between Se and O — head-on s overlap along the bond axis.',
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
      energy: 5, desc: 'Lone pair localized on Se. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 4, l: 1, m: -1, zeff: 6.20, c: 0.90 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'π* (empty)',
        type: 'antibonding',
        electrons: 0,
      energy: 8, desc: 'π* antibonding — a node in the π system. Occupation reduces bond order.',
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
    notes: 'Argon compound — one of few true Ar compounds, only stable below 17 K. Discovery in 2000 was groundbreaking.',
    orbitals: [
      {
        name: '3c-σ (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding between Ar and F — head-on p overlap along the bond axis.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.76, c:  0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.70 },
        ],
      },
      {
        name: 'Ar 3s',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Non-bonding orbital localized on Ar.',
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.76, c: 1.0 },
        ],
      },
      {
        name: 'Ar 3py',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital localized on Ar.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.76, c: 1.0 },
        ],
      },
      {
        name: 'Ar 3pz',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Non-bonding orbital localized on Ar.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.76, c: 1.0 },
        ],
      },
      {
        name: 'F lone pair (y)',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F lone pair (z)',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Krypton difluoride — a powerful fluorinating agent. Three-center four-electron bonding like XeF₂.',
    orbitals: [
      {
        name: '3c-σ (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.707 },
        ],
      },
      {
        name: 'F₁ lone pair (y)',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₁ lone pair (z)',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₂ lone pair (y)',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₂ lone pair (z)',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'Kr 4s',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Non-bonding orbital localized on F.',
        ao: [
          { atom: 1, n: 4, l: 0, m: 0, zeff: 8.25, c: 1.0 },
        ],
      },
      {
        name: 'Kr 4py',
        type: 'nonbonding',
        electrons: 2,
      energy: 8, desc: 'Non-bonding orbital localized on F.',
        ao: [
          { atom: 1, n: 4, l: 1, m: -1, zeff: 8.25, c: 1.0 },
        ],
      },
      {
        name: 'Kr 4pz',
        type: 'nonbonding',
        electrons: 2,
      energy: 9, desc: 'Non-bonding orbital localized on F.',
        ao: [
          { atom: 1, n: 4, l: 1, m: 0, zeff: 8.25, c: 1.0 },
        ],
      },
      {
        name: '3c-σ* (empty)',
        type: 'antibonding',
        electrons: 0,
      energy: 10, desc: 'σ* antibonding — destructive overlap with a nodal plane between atoms. Occupation weakens the bond.',
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
    notes: 'Magnesium chloride — ionic bonding with two Cl atoms. Used as a Ziegler-Natta catalyst component.',
    orbitals: [
      {
        name: 'σg (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₁ π (z)',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₂ π (y)',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₂ π (z)',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₁ 3s',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl₂ 3s',
        type: 'nonbonding',
        electrons: 2,
      energy: 8, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
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
    notes: 'Aluminum chloride — a Lewis acid catalyst crucial in Friedel-Crafts reactions. Dimeric (Al₂Cl₆) in gas phase.',
    orbitals: [
      {
        name: 'a₁\' (σ framework)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding — head-on overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'σ bonding — head-on overlap concentrates electron density along the bond axis.',
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
      energy: 5, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 2, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 7, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 3, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl pz (lone pairs)',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
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
      energy: 8, desc: 'Antibonding orbital — electron density pushed away from the internuclear region.',
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
    notes: 'Phosphorus trichloride — pyramidal geometry like NH₃. The lone pair makes it a good nucleophile.',
    orbitals: [
      {
        name: 'a₁ (σ bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between Sn and Cl. Head-on overlap concentrates electron density along the bond axis.',
      energy: 1, desc: 'σ bonding from s/p overlap between P and Cl. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding between P and Cl — head-on p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding between P and Cl — head-on p overlap along the bond axis.',
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
      energy: 4, desc: 'Lone pair localized on P. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 4.80, c:  0.85 },
          { atom: 0, n: 3, l: 0, m: 0, zeff: 4.80, c:  0.35 },
        ],
      },
      {
        name: 'Cl₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Nitric acid — resonance-stabilized with delocalized π electrons across the N-O bonds.',
    orbitals: [
      {
        name: 'σ₁ (N-O₃-H chain)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from p/s overlap between N and O and H. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding between N and O — head-on p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding between Xe and F — head-on s overlap along the bond axis.',
      energy: 3, desc: 'σ bonding between N and O — head-on s overlap along the bond axis.',
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
      energy: 4, desc: 'π bonding — lateral p overlap between N and O. Electron density above and below the bond axis.',
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
      energy: 5, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'O₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 8, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Square planar xenon compound. Six electron pairs but four bonds — two lone pairs occupy axial positions.',
    orbitals: [
      {
        name: 'σ₁ (Xe-F bond, +x)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between Xe and F — head-on p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding between Xe and F — head-on p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding — head-on s overlap concentrates electron density along the bond axis.',
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
      energy: 7, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 8, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 9, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 3, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'F₄ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 10, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
      energy: 7, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 4, n: 2, l: 1, m: 0, zeff: 5.13, c: 1.0 },
        ],
      },
      {
        name: 'Xe 5pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 8, desc: 'Lone pair localized on Xe. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Ethanol — the O-H and C-O bonds demonstrate how polarity varies within a single molecule.',
    orbitals: [
      {
        name: 'σ (C-C bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between C — head-on p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.55 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.25, c: -0.55 },
        ],
      },
      {
        name: 'σ (C-O bond)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding between C and O — head-on p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding — head-on p/s overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
          { atom: 8, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
        ],
      },
      {
        name: 'σ (C₁-H₃ bond)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding from p/s overlap between C and H. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.25, c: -0.50 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
        ],
      },
      {
        name: 'σ (C₁-H₄ bond)',
        type: 'bonding',
        electrons: 2,
      energy: 5, desc: 'σ bonding from p/s overlap between C and H. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.25, c:  0.50 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
        ],
      },
      {
        name: 'σ (C₁-H₅ bond)',
        type: 'bonding',
        electrons: 2,
      energy: 6, desc: 'σ bonding from p/s overlap between C and H. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.25, c: -0.50 },
          { atom: 5, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
        ],
      },
      {
        name: 'σ (C₂-H₆ bond)',
        type: 'bonding',
        electrons: 2,
      energy: 7, desc: 'σ bonding from p/s overlap between C and H. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.25, c: -0.50 },
          { atom: 6, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
        ],
      },
      {
        name: 'σ (C₂-H₇ bond)',
        type: 'bonding',
        electrons: 2,
      energy: 8, desc: 'σ bonding from p/s overlap between C and H. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.25, c:  0.50 },
          { atom: 7, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
        ],
      },
      {
        name: 'O lone pair (z)',
        type: 'nonbonding',
        electrons: 2,
      energy: 9, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O lone pair (s mix)',
        type: 'nonbonding',
        electrons: 2,
      energy: 10, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Tin(IV) chloride — tetrahedral. The Sn 5s electrons participate in sp³ hybridization.',
    orbitals: [
      {
        name: 'a₁ (σ bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding between Sn and Cl — head-on p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding between Sn and Cl — head-on p overlap along the bond axis.',
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
      energy: 4, desc: 'σ bonding between Sn and Cl — head-on p overlap along the bond axis.',
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
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 7, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 3, n: 3, l: 0, m: 0, zeff: 6.12, c: 0.85 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.40 },
        ],
      },
      {
        name: 'Cl₄ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 8, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Uranium hexafluoride — the gas used in isotope enrichment. Octahedral with U 5f/6d participation.',
    orbitals: [
      {
        name: 'a₁g (σ bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between U and F. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding between U and F — head-on p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding between U and F — head-on p overlap along the bond axis.',
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
      energy: 4, desc: 'σ bonding between U and F — head-on p overlap along the bond axis.',
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
      energy: 5, desc: 'σ bonding from d/p overlap between U and F. Head-on d-p overlap along the bond axis.',
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
      energy: 6, desc: 'σ bonding from d/p overlap between U and F. Head-on d-p overlap along the bond axis.',
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
      energy: 7, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'F₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 8, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'F₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 9, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 3, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.707 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'F₄ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 10, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 4, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.707 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'F₅ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 11, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 5, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.707 },
          { atom: 5, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'F₆ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 12, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Helium "molecule" — bond order zero! Equal bonding and antibonding cancels out. Not a stable species.',
    orbitals: [
      {
        name: 'σ₁s',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.70, c: 0.707 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.70, c: 0.707 },
        ],
      },
      {
        name: 'σ*₁s',
        type: 'antibonding',
        electrons: 2,
      energy: 2, desc: 'σ* antibonding — destructive overlap creates a nodal plane between He. Occupying this weakens the bond.',
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
    notes: 'Gold(I) chloride — relativistic contraction of Au 6s orbital strengthens the bond vs lighter coinage metals.',
    orbitals: [
      {
        name: 'σ (Au 6s–Cl 3p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between Au and Cl. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.20, c: 0.55 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.60 },
        ],
      },
      {
        name: 'σ* (Au 6s–Cl 3p)',
        type: 'antibonding',
        electrons: 0,
      energy: 2, desc: 'σ* antibonding — destructive overlap creates a nodal plane between Au and Cl. Occupying this weakens the bond.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.20, c: 0.60 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.55 },
        ],
      },
      {
        name: 'Au 5dσ',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Non-bonding d-electrons on Au contributing to magnetic and spectroscopic properties.',
        ao: [
          { atom: 0, n: 5, l: 2, m: 0, zeff: 10.50, c: 1.0 },
        ],
      },
      {
        name: 'Au 5dπ',
        type: 'nonbonding',
        electrons: 4,
      energy: 4, desc: 'Non-bonding d-electrons on Au contributing to magnetic and spectroscopic properties.',
        ao: [
          { atom: 0, n: 5, l: 2, m: 1, zeff: 10.50, c: 0.707 },
          { atom: 0, n: 5, l: 2, m: -1, zeff: 10.50, c: 0.707 },
        ],
      },
      {
        name: 'Au 5dδ',
        type: 'nonbonding',
        electrons: 4,
      energy: 5, desc: 'Non-bonding d-electrons on Au contributing to magnetic and spectroscopic properties.',
        ao: [
          { atom: 0, n: 5, l: 2, m: 2, zeff: 10.50, c: 0.707 },
          { atom: 0, n: 5, l: 2, m: -2, zeff: 10.50, c: 0.707 },
        ],
      },
      {
        name: 'Cl 3p lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 6, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Cadmium telluride — optimal bandgap (1.5 eV) for solar cells. Leading thin-film photovoltaic material.',
    orbitals: [
      {
        name: 'σ (Cd 5s–Te 5p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between Cd and Te. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.55, c: 0.55 },
          { atom: 1, n: 5, l: 1, m: 1, zeff: 6.55, c: 0.60 },
        ],
      },
      {
        name: 'σ* (Cd 5s–Te 5p)',
        type: 'antibonding',
        electrons: 0,
      energy: 2, desc: 'σ* antibonding — destructive overlap creates a nodal plane between Cd and Te. Occupying this weakens the bond.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.55, c: 0.60 },
          { atom: 1, n: 5, l: 1, m: 1, zeff: 6.55, c: -0.55 },
        ],
      },
      {
        name: 'Te 5p lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 3, desc: 'Lone pair localized on Te. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 5, l: 1, m: 0, zeff: 6.55, c: 0.707 },
          { atom: 1, n: 5, l: 1, m: -1, zeff: 6.55, c: 0.707 },
        ],
      },
      {
        name: 'Te 5s lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair localized on Te. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Stannous fluoride — the active ingredient in many toothpastes. Bent geometry due to Sn 5s² lone pair.',
    orbitals: [
      {
        name: 'σ₁ (Sn 5sp–F₁ 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between Sn and F. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from s/p overlap between Sn and F. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'Lone pair localized on Sn. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 6.20, c: 0.80 },
          { atom: 0, n: 5, l: 1, m: -1, zeff: 6.20, c: 0.45 },
        ],
      },
      {
        name: 'F₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 5, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'F₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 6, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on F. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Lead(II) chloride — the "inert pair effect" leaves Pb 6s² electrons non-bonding.',
    orbitals: [
      {
        name: 'σg (Pb 6s–Cl 3p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from p/s overlap between Cl and Pb. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding between Cl and Pb — head-on p overlap along the bond axis.',
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
      energy: 3, desc: 'Lone pair localized on Pb. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 6, l: 0, m: 0, zeff: 6.50, c: 1.0 },
        ],
      },
      {
        name: 'Cl₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 3, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: 'Cl₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 4, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Lead(IV) oxide — the key material in lead-acid car batteries.',
    orbitals: [
      {
        name: 'σg (Pb 6s–O 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from p/s overlap between O and Pb. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding between O and Pb — head-on p overlap along the bond axis.',
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
      energy: 3, desc: 'π bonding — lateral p overlap between O and Pb. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'π bonding — lateral p overlap between O and Pb. Electron density above and below the bond axis.',
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
      energy: 6, desc: 'Lone pair localized on Pa. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on Cm. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on Am. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on Np. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Radon difluoride — theoretically predicted, marginally stable. Three-center bonding like XeF₂ and KrF₂.',
    orbitals: [
      {
        name: 'σ (3c-4e bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between F and Rn — head-on p overlap along the bond axis.',
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
      energy: 2, desc: 'Non-bonding orbital localized on F.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'Rn 6s lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair localized on Rn. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 9.20, c: 1.0 },
        ],
      },
      {
        name: 'Rn 6p⊥ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 4, desc: 'Lone pair localized on Rn. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 6, l: 1, m: 0, zeff: 9.20, c: 0.707 },
          { atom: 0, n: 6, l: 1, m: -1, zeff: 9.20, c: 0.707 },
        ],
      },
      {
        name: 'F₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.707 },
        ],
      },
      {
        name: 'F₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Platinum(II) chloride — starting material for cisplatin, the breakthrough anticancer drug.',
    orbitals: [
      {
        name: 'σg (Pt 6s–Cl 3p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from p/s overlap between Cl and Pt. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from p/d overlap between Cl and Pt. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'Non-bonding d-electrons on Pt contributing to magnetic and spectroscopic properties.',
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
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: 'Cl₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Palladium(II) chloride — the Wacker process catalyst. Pd 4d orbitals are central to its catalytic activity.',
    orbitals: [
      {
        name: 'σg (Pd 5s–Cl 3p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from p/s overlap between Cl and Pd. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from p/d overlap between Cl and Pd. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'Non-bonding d-electrons on Pd contributing to magnetic and spectroscopic properties.',
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
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: 'Cl₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Zinc chloride — a Lewis acid and soldering flux. Zn 4s contributes to the bonding MOs.',
    orbitals: [
      {
        name: 'σg (Zn 4s–Cl 3p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from p/s overlap between Cl and Zn. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding between Cl and Zn — head-on p overlap along the bond axis.',
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
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: 'Cl₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Molybdenite — a 2D layered material similar to graphene. Mo 4d states form the band edges.',
    orbitals: [
      {
        name: 'σ₁ (Mo 4d–S₁ 3p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/p overlap between Mo and S. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 2, m: 0, zeff: 7.40, c: 0.55 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 5.45, c: 0.50 },
        ],
      },
      {
        name: 'σ₂ (Mo 4d–S₂ 3p)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding from d/p overlap between Mo and S. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 2, m: 0, zeff: 7.40, c: 0.55 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 5.45, c: 0.50 },
        ],
      },
      {
        name: 'π (Mo 4d–S 3p)',
        type: 'bonding',
        electrons: 4,
      energy: 3, desc: 'π bonding from d-p lateral overlap between Mo and S. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'Non-bonding d-electrons on Mo contributing to magnetic and spectroscopic properties.',
        ao: [
          { atom: 0, n: 4, l: 2, m: 2, zeff: 7.40, c: 0.707 },
          { atom: 0, n: 4, l: 2, m: -2, zeff: 7.40, c: 0.707 },
        ],
      },
      {
        name: 'S₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on S. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 5.45, c: 1.0 },
        ],
      },
      {
        name: 'S₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on S. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Manganese dioxide — the cathode in alkaline batteries. Mn 3d electrons drive its electrochemistry.',
    orbitals: [
      {
        name: 'σg (Mn 4s–O 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from p/s overlap between O and Mn. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from p/d overlap between O and Mn. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'π bonding from d-p lateral overlap between O and Mn. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'Non-bonding d-electrons on Mn contributing to magnetic and spectroscopic properties.',
        ao: [
          { atom: 1, n: 3, l: 2, m: 2, zeff: 5.60, c: 1.0 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Germanium dioxide — shares glass-forming ability with SiO₂ but with Ge 4s/4p character.',
    orbitals: [
      {
        name: 'σ₁ (Ge 4sp–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between Ge and O. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from s/p overlap between Ge and O. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'π bonding — lateral p overlap between Ge and O. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 5.50, c: 0.50 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'π₂ (Ge 4p–O₂ 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'π bonding — lateral p overlap between Ge and O. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 5.50, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Zirconia — used in dental crowns and oxygen sensors. The Zr 4d — O 2p bonds are highly ionic.',
    orbitals: [
      {
        name: 'σ₁ (Zr 4d/5s–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/d/p overlap between Zr and O. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from s/d/p overlap between Zr and O. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'π bonding from d-p lateral overlap between Zr and O. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Hafnium dioxide — replaced SiO₂ as the gate dielectric in modern transistors due to its high-κ value.',
    orbitals: [
      {
        name: 'σ₁ (Hf 5d/6s–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/d/p overlap between Hf and O. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from s/d/p overlap between Hf and O. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'π bonding from d-p lateral overlap between Hf and O. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Ceria — Ce 4f electron shuttles between Ce³⁺/Ce⁴⁺, enabling its use in catalytic converters.',
    orbitals: [
      {
        name: 'σ₁ (Ce 5d/6s–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/d/p overlap between Ce and O. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from s/d/p overlap between Ce and O. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'π bonding from d-p lateral overlap between Ce and O. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Iridium dioxide — the best-known electrocatalyst for oxygen evolution in water splitting.',
    orbitals: [
      {
        name: 'σ₁ (Ir 5dσ–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/s/p overlap between Ir and O. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from d/s/p overlap between Ir and O. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'π bonding from d-p lateral overlap between Ir and O. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'Non-bonding d-electrons on Ir contributing to magnetic and spectroscopic properties.',
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
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Uranium dioxide — the standard nuclear fuel. U 5f electrons create complex magnetic behavior.',
    orbitals: [
      {
        name: 'σg (U 6d–O 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from p/d overlap between O and U. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding between O and U — head-on p/f overlap along the bond axis.',
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
      energy: 3, desc: 'π bonding — lateral p/f overlap between O and U. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'π bonding from d-p lateral overlap between O and U. Electron density above and below the bond axis.',
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
      energy: 5, desc: 'Localized f-electrons on U — shielded from bonding by outer shells.',
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
    notes: 'Thorium dioxide — the most refractory oxide (m.p. 3390°C). Potential thorium fuel cycle material.',
    orbitals: [
      {
        name: 'σ₁ (Th 6d/7s–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/d/p overlap between Th and O. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from s/d/p overlap between Th and O. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'π bonding from d-p lateral overlap between Th and O. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Plutonium dioxide — used in MOX nuclear fuel and RTG power sources for space missions.',
    orbitals: [
      {
        name: 'σ₁ (Pu 5f/6d–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/f/p overlap between Pu and O. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from d/f/p overlap between Pu and O. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'π bonding — lateral f/p overlap between Pu and O. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'Localized f-electrons on Pu — shielded from bonding by outer shells.',
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
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Cuprous oxide — the first known semiconductor (1874). Cu 3d — O 2p hybridization creates a 2.1 eV bandgap.',
    orbitals: [
      {
        name: 'σg (Cu 4s–O 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between Cu and O. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from s/p overlap between Cu and O. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
      {
        name: 'Cu₁ 3d',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding d-electrons on Cu contributing to magnetic and spectroscopic properties.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 7.85, c: 1.0 },
        ],
      },
      {
        name: 'Cu₂ 3d',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Non-bonding d-electrons on Cu contributing to magnetic and spectroscopic properties.',
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
    notes: 'Silver oxide — used in button batteries. The Ag 4d contribution is deeper than Cu₂O.',
    orbitals: [
      {
        name: 'σg (Ag 5s–O 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between Ag and O. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from s/p overlap between Ag and O. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Iron(III) chloride — a Lewis acid and PCB etchant. Fe 3d orbitals are central to its chemistry.',
    orbitals: [
      {
        name: 'σ₁ (Fe–Cl₁)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/d/p overlap between Fe and Cl. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from s/d/p overlap between Fe and Cl. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding from s/d/p overlap between Fe and Cl. Head-on d-p overlap along the bond axis.',
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
      energy: 4, desc: 'Non-bonding d-electrons on Fe contributing to magnetic and spectroscopic properties.',
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
      energy: 5, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Gallium trichloride — a strong Lewis acid. The empty Ga 4p orbital accepts electron pairs.',
    orbitals: [
      {
        name: 'σ₁ (Ga sp²–Cl₁ 3p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between Ga and Cl. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from s/p overlap between Ga and Cl. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'σ bonding from s/p overlap between Ga and Cl. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Rhodium trichloride — precursor to Wilkinson\'s catalyst. Rh 4d orbital splitting enables catalytic selectivity.',
    orbitals: [
      {
        name: 'σ₁ (Rh–Cl₁)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/d/p overlap between Rh and Cl. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from s/d/p overlap between Rh and Cl. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding from s/d/p overlap between Rh and Cl. Head-on d-p overlap along the bond axis.',
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
      energy: 4, desc: 'Non-bonding d-electrons on Rh contributing to magnetic and spectroscopic properties.',
        ao: [
          { atom: 0, n: 4, l: 2, m: 2, zeff: 8.50, c: 0.707 },
          { atom: 0, n: 4, l: 2, m: -2, zeff: 8.50, c: 0.707 },
        ],
      },
      {
        name: 'Cl lone pairs',
        type: 'nonbonding',
        electrons: 12,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Molybdenum trioxide — a layered oxide used in catalysis. Mo 4d states near the Fermi level.',
    orbitals: [
      {
        name: 'σ₁ (Mo–O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/s/p overlap between Mo and O. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from d/s/p overlap between Mo and O. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding from d/s/p overlap between Mo and O. Head-on d-p overlap along the bond axis.',
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
      energy: 4, desc: 'π bonding from d-p lateral overlap between Mo and O. Electron density above and below the bond axis.',
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
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 3, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Tungsten trioxide — electrochromic material for smart windows. W 5d electron density tunes the color.',
    orbitals: [
      {
        name: 'σ₁ (W–O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/s/p overlap between W and O. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from d/s/p overlap between W and O. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding from d/s/p overlap between W and O. Head-on d-p overlap along the bond axis.',
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
      energy: 4, desc: 'π bonding from d-p lateral overlap between W and O. Electron density above and below the bond axis.',
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
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Calomel — historic reference electrode. Contains the unusual [Hg-Hg]²⁺ metal-metal bond.',
    orbitals: [
      {
        name: 'σ (Hg-Hg)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between Hg — head-on s overlap along the bond axis.',
        ao: [
          { atom: 1, n: 6, l: 0, m: 0, zeff: 4.35, c: 0.707 },
          { atom: 2, n: 6, l: 0, m: 0, zeff: 4.35, c: 0.707 },
        ],
      },
      {
        name: 'σ₁ (Hg₁–Cl₁)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding from s/p overlap between Hg and Cl. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 6, l: 0, m: 0, zeff: 4.35, c: 0.50 },
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.60 },
        ],
      },
      {
        name: 'σ₂ (Hg₂–Cl₂)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding from s/p overlap between Hg and Cl. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 2, n: 6, l: 0, m: 0, zeff: 4.35, c: 0.50 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.60 },
        ],
      },
      {
        name: 'Cl₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: 'Cl₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Titanium tetrachloride — precursor for TiO₂ pigment and Ziegler-Natta polymerization catalysts.',
    orbitals: [
      {
        name: 'σ₁ (Ti–Cl₁)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/d/p overlap between Ti and Cl. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from s/d/p overlap between Ti and Cl. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding from s/d/p overlap between Ti and Cl. Head-on d-p overlap along the bond axis.',
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
      energy: 4, desc: 'σ bonding from s/d/p overlap between Ti and Cl. Head-on d-p overlap along the bond axis.',
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
      energy: 5, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Osmium tetroxide — a powerful oxidizer for cis-dihydroxylation. Tetrahedral with Os 5d participation.',
    orbitals: [
      {
        name: 'σ₁ (Os–O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/s/p overlap between Os and O. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from d/s/p overlap between Os and O. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding from d/s/p overlap between Os and O. Head-on d-p overlap along the bond axis.',
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
      energy: 4, desc: 'σ bonding from d/s/p overlap between Os and O. Head-on d-p overlap along the bond axis.',
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
      energy: 5, desc: 'π bonding from d-p lateral overlap between Os and O. Electron density above and below the bond axis.',
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
    notes: 'Ruthenium tetroxide — volatile and toxic. Isovalent with OsO₄ but less thermally stable.',
    orbitals: [
      {
        name: 'σ₁ (Ru–O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/s/p overlap between Ru and O. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from d/s/p overlap between Ru and O. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding from d/s/p overlap between Ru and O. Head-on d-p overlap along the bond axis.',
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
      energy: 4, desc: 'σ bonding from d/s/p overlap between Ru and O. Head-on d-p overlap along the bond axis.',
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
      energy: 5, desc: 'π bonding from d-p lateral overlap between Ru and O. Electron density above and below the bond axis.',
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
    notes: 'Slaked lime — pH buffer and mortar ingredient. The Ca-O bond is predominantly ionic.',
    orbitals: [
      {
        name: 'σ₁ (Ca 4s–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between Ca and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 2.85, c: 0.40 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.65 },
        ],
      },
      {
        name: 'σ₂ (Ca 4s–O₂ 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding from s/p overlap between Ca and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 2.85, c: 0.40 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.65 },
        ],
      },
      {
        name: 'σ (O₁–H₁)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding from p/s overlap between O and H. Head-on overlap concentrates electron density along the bond axis.',
      energy: 3, desc: 'σ bonding from p/s overlap between O and H. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.55 },
        ],
      },
      {
        name: 'σ (O₂–H₂)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding from p/s overlap between O and H. Head-on overlap concentrates electron density along the bond axis.',
      energy: 4, desc: 'σ bonding from p/s overlap between O and H. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.55 },
        ],
      },
      {
        name: 'O₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 3, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
      {
        name: 'O₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 4, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
      energy: 6, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Milk of magnesia — antacid. Layered brucite structure with Mg-O ionic bonds.',
    orbitals: [
      {
        name: 'σ₁ (Mg 3s–O₁ 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between Mg and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.85, c: 0.40 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.65 },
        ],
      },
      {
        name: 'σ₂ (Mg 3s–O₂ 2p)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding from s/p overlap between Mg and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.85, c: 0.40 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.65 },
        ],
      },
      {
        name: 'σ (O₁–H₁)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding — head-on p/s overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.55 },
        ],
      },
      {
        name: 'σ (O₂–H₂)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding — head-on p/s overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.24, c: 0.55 },
        ],
      },
      {
        name: 'O₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.707 },
        ],
      },
      {
        name: 'O₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Phosphorus pentachloride — trigonal bipyramidal. Axial and equatorial bonds have different lengths.',
    orbitals: [
      {
        name: 'σ₁ᵉᑫ (P sp²–Cl₁)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between P and Cl. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 2, desc: 'σ bonding from s/p overlap between P and Cl. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 3, desc: 'σ bonding from s/p overlap between P and Cl. Head-on overlap concentrates electron density along the bond axis.',
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
      energy: 4, desc: 'σ bonding from d/p overlap between P and Cl. Head-on d-p overlap along the bond axis.',
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
      energy: 5, desc: 'σ bonding from d/p overlap between P and Cl. Head-on d-p overlap along the bond axis.',
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
      energy: 6, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Scandia — used in solid oxide fuel cells. Sc 3d participation in bonding is minimal (mostly ionic).',
    orbitals: [
      {
        name: 'σ (Sc₁–O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/d/p overlap between Sc and O. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from s/d/p overlap between Sc and O. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding from s/p overlap between Sc and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 2.85, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Sc₂–O₃)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding from s/p overlap between Sc and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 2, n: 4, l: 0, m: 0, zeff: 2.85, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 6,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Chromia — the green pigment. Cr 3d³ configuration creates strong crystal field effects.',
    orbitals: [
      {
        name: 'σ (Cr₁–O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/p overlap between Cr and O. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 5.20, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Cr₂–O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding from d/p overlap between Cr and O. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 1, n: 3, l: 2, m: 0, zeff: 5.20, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.60 },
        ],
      },
      {
        name: 'σ (Cr₁–O₂)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding from s/p overlap between Cr and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.30, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Cr₂–O₃)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding from s/p overlap between Cr and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 4, l: 0, m: 0, zeff: 3.30, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'Cr 3d nonbonding',
        type: 'nonbonding',
        electrons: 6,
      energy: 5, desc: 'Non-bonding d-electrons on Cr contributing to magnetic and spectroscopic properties.',
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
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Arsenious oxide — the "inheritance powder." Molecular As₄O₆ cages in vapor phase.',
    orbitals: [
      {
        name: 'σ (As₁–O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between As and O — head-on p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 1, m: 1, zeff: 5.80, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ (As₂–O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding between As and O — head-on p overlap along the bond axis.',
        ao: [
          { atom: 1, n: 4, l: 1, m: 1, zeff: 5.80, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
        ],
      },
      {
        name: 'σ (As₁–O₂)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding from s/p overlap between As and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 5.80, c: 0.45 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ (As₂–O₃)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding from s/p overlap between As and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 4, l: 0, m: 0, zeff: 5.80, c: 0.45 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'As lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 5, desc: 'Lone pair localized on As. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 5.80, c: 0.707 },
          { atom: 1, n: 4, l: 0, m: 0, zeff: 5.80, c: 0.707 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 6,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Antimony trioxide — a flame retardant. Sb 5s lone pair influences crystal structure.',
    orbitals: [
      {
        name: 'σ (Sb₁–O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between Sb and O — head-on p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 6.10, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ (Sb₂–O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding between Sb and O — head-on p overlap along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 1, m: 1, zeff: 6.10, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
        ],
      },
      {
        name: 'σ (Sb₁–O₂)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding from s/p overlap between Sb and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 6.10, c: 0.45 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ (Sb₂–O₃)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding from s/p overlap between Sb and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 0, m: 0, zeff: 6.10, c: 0.45 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'Sb lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 5, desc: 'Lone pair localized on Sb. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 6.10, c: 0.707 },
          { atom: 1, n: 5, l: 0, m: 0, zeff: 6.10, c: 0.707 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 6,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Lanthanum oxide — strong base, reacts exothermically with water and CO₂. La 5d contributes to La-O bonds.',
    orbitals: [
      {
        name: 'σ (La₁–O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/s/p overlap between La and O. Head-on d-p overlap along the bond axis.',
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
      energy: 2, desc: 'σ bonding from d/s/p overlap between La and O. Head-on d-p overlap along the bond axis.',
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
      energy: 3, desc: 'σ bonding from s/p overlap between La and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 3.60, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (La₂–O₃)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding from s/p overlap between La and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 6, l: 0, m: 0, zeff: 3.60, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 6,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Vanadium pentoxide — catalyst for the contact process (H₂SO₄). Layered structure with mixed V-O bonding.',
    orbitals: [
      {
        name: 'σ (V₁–O_br)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/p overlap between V and O. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 5.20, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (V₂–O_br)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding from d/p overlap between V and O. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 1, n: 3, l: 2, m: 0, zeff: 5.20, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.60 },
        ],
      },
      {
        name: 'σ (V₁=O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding from s/p overlap between V and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.30, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (V₂=O₂)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding from s/p overlap between V and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 4, l: 0, m: 0, zeff: 3.30, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (V₁–O₃)',
        type: 'bonding',
        electrons: 2,
      energy: 5, desc: 'σ bonding from d/p overlap between V and O. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 1, zeff: 5.20, c: 0.45 },
          { atom: 5, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (V₂–O₄)',
        type: 'bonding',
        electrons: 2,
      energy: 6, desc: 'σ bonding from d/p overlap between V and O. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 1, n: 3, l: 2, m: -1, zeff: 5.20, c: 0.45 },
          { atom: 6, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'π (V=O terminal)',
        type: 'bonding',
        electrons: 4,
      energy: 7, desc: 'π bonding from d-p lateral overlap between V and O. Electron density above and below the bond axis.',
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
      energy: 8, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
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
    notes: 'Niobium pentoxide — used in optical coatings and lithium-ion battery anodes.',
    orbitals: [
      {
        name: 'σ (Nb₁–O_br)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/p overlap between Nb and O. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 2, m: 0, zeff: 6.40, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Nb₂–O_br)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding from d/p overlap between Nb and O. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 1, n: 4, l: 2, m: 0, zeff: 6.40, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.60 },
        ],
      },
      {
        name: 'σ (Nb₁=O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding from s/p overlap between Nb and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 3.30, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Nb₂=O₂)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding from s/p overlap between Nb and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 0, m: 0, zeff: 3.30, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'π (Nb=O terminal)',
        type: 'bonding',
        electrons: 4,
      energy: 5, desc: 'π bonding from d-p lateral overlap between Nb and O. Electron density above and below the bond axis.',
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
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Tantalum pentoxide — high-κ dielectric used in capacitors. Very similar to Nb₂O₅.',
    orbitals: [
      {
        name: 'σ (Ta₁–O_br)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/p overlap between Ta and O. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 2, m: 0, zeff: 8.80, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Ta₂–O_br)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding from d/p overlap between Ta and O. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 2, m: 0, zeff: 8.80, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.60 },
        ],
      },
      {
        name: 'σ (Ta₁=O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding from s/p overlap between Ta and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.15, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Ta₂=O₂)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding from s/p overlap between Ta and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 6, l: 0, m: 0, zeff: 4.15, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'π (Ta=O terminal)',
        type: 'bonding',
        electrons: 4,
      energy: 5, desc: 'π bonding from d-p lateral overlap between Ta and O. Electron density above and below the bond axis.',
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
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
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
    notes: 'Rhenium heptoxide — one of the few molecular metal oxides. Re in its highest oxidation state (+7).',
    orbitals: [
      {
        name: 'σ (Re₁–O_br)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/p overlap between Re and O. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 2, m: 0, zeff: 9.20, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Re₂–O_br)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding from d/p overlap between Re and O. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 2, m: 0, zeff: 9.20, c: 0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.60 },
        ],
      },
      {
        name: 'σ (Re₁=O₁)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding from s/p overlap between Re and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.20, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ (Re₂=O₂)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding from s/p overlap between Re and O. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 6, l: 0, m: 0, zeff: 4.20, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'π (Re=O terminal)',
        type: 'bonding',
        electrons: 4,
      energy: 5, desc: 'π bonding from d-p lateral overlap between Re and O. Electron density above and below the bond axis.',
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
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  //  BATCH 2 — Additional molecules (40 new entries)
  // ═══════════════════════════════════════════════════════════

  // ─── Simple / organic molecules for already-covered elements ───

  'HCN': {
    // atoms: H(0), C(1), N(2) — linear, along x-axis
    notes: 'Hydrogen cyanide — the C≡N triple bond is isoelectronic with N₂. The carbon lone pair acts as a ligand in metal complexes.',
    orbitals: [
      {
        name: '3σ (C-H bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from p/s overlap between . Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.25, c: -0.60 },
          { atom: 0, n: 1, l: 0, m: 0, zeff: 1.24, c:  0.55 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.25, c:  0.30 },
        ],
      },
      {
        name: '4σ (C-N bond)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding between  — head-on p overlap along the bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 3.90, c:  0.65 },
        ],
      },
      {
        name: '1π (C≡N, y)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'π bonding — lateral p overlap between . Electron density above and below the bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.25, c: 0.55 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 3.90, c: 0.65 },
        ],
      },
      {
        name: '1π\' (C≡N, z)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'π bonding — lateral overlap creates electron density above and below the bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.25, c: 0.55 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 3.90, c: 0.65 },
        ],
      },
      {
        name: '5σ (N lone pair)',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 0, m: 0, zeff: 3.90, c: 0.80 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 3.90, c: -0.35 },
        ],
      },
    ],
  },

  'CCl₄': {
    // atoms: C(0), Cl(1-4) — tetrahedral
    notes: 'Carbon tetrachloride — formerly a dry-cleaning solvent. Perfect tetrahedral symmetry like CH₄.',
    orbitals: [
      {
        name: 'a₁ (inner valence)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'Bonding orbital — constructive s/p overlap between  concentrates electron density between the nuclei.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.25, c: -0.75 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.30 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.30 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.30 },
          { atom: 4, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.30 },
        ],
      },
      {
        name: 't₂ (C-Cl bond 1)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'Bonding orbital — constructive p overlap between  concentrates electron density between the nuclei.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.50 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.55 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.10, c: -0.18 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.10, c: -0.18 },
          { atom: 4, n: 3, l: 1, m: 1, zeff: 6.10, c: -0.18 },
        ],
      },
      {
        name: 't₂ (C-Cl bond 2)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'Bonding orbital — constructive p overlap between  concentrates electron density between the nuclei.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.25, c:  0.50 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.10, c:  0.55 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.10, c: -0.18 },
          { atom: 3, n: 3, l: 1, m: -1, zeff: 6.10, c: -0.18 },
          { atom: 4, n: 3, l: 1, m: -1, zeff: 6.10, c: -0.18 },
        ],
      },
      {
        name: 't₂ (C-Cl bond 3)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'Bonding orbital — constructive p overlap between  concentrates electron density between the nuclei.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.25, c:  0.50 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.10, c:  0.55 },
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.10, c: -0.18 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.10, c: -0.18 },
          { atom: 4, n: 3, l: 1, m: 0, zeff: 6.10, c: -0.18 },
        ],
      },
      {
        name: 'Cl lone pairs (12e)',
        type: 'nonbonding',
        electrons: 12,
      energy: 5, desc: 'Lone pair localized on Cl. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
      energy: 5, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.50 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.50 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.50 },
          { atom: 4, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.50 },
        ],
      },
    ],
  },

  'NO': {
    // atoms: N(0), O(1) — along x-axis
    notes: 'Nitric oxide — a radical with one unpaired electron in π*. A crucial biological signaling molecule.',
    orbitals: [
      {
        name: '3σ (inner valence)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between  — head-on s overlap along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.90, c: -0.65 },
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.58 },
        ],
      },
      {
        name: '4σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.90, c:  0.60 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.65 },
        ],
      },
      {
        name: '1π (y)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'π bonding — lateral p overlap. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.90, c: 0.55 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.65 },
        ],
      },
      {
        name: '1π\' (z)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'π bonding — lateral overlap creates electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.90, c: 0.55 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.65 },
        ],
      },
      {
        name: '2π* (radical)',
        type: 'antibonding',
        electrons: 1,
      energy: 5, desc: 'π* antibonding — a node between  in the π system. Occupation reduces bond order.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.90, c:  0.65 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.55 },
        ],
      },
    ],
  },

  'CS₂': {
    // atoms: C(0), S(1), S(2) — linear, along x-axis
    notes: 'Carbon disulfide — linear like CO₂ but with weaker π bonding due to poorer C 2p — S 3p overlap.',
    orbitals: [
      {
        name: 'σg (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.25, c: -0.70 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 5.45, c:  0.45 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 5.45, c:  0.45 },
        ],
      },
      {
        name: 'σu (bonding)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.55 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 5.45, c:  0.50 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 5.45, c: -0.50 },
        ],
      },
      {
        name: 'πu (bonding, y)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.25, c:  0.55 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 5.45, c:  0.50 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 5.45, c:  0.50 },
        ],
      },
      {
        name: 'πu (bonding, z)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.25, c:  0.55 },
          { atom: 1, n: 3, l: 1, m: 0, zeff: 5.45, c:  0.50 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 5.45, c:  0.50 },
        ],
      },
      {
        name: 'S₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 5.45, c: 0.85 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 5.45, c: -0.35 },
        ],
      },
      {
        name: 'S₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 3, l: 0, m: 0, zeff: 5.45, c: 0.85 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 5.45, c:  0.35 },
        ],
      },
    ],
  },

  'SF₆': {
    // atoms: S(0), F(1-6) — octahedral
    notes: 'Sulfur hexafluoride — inert gas used as electrical insulator. Octahedral hypervalent compound.',
    orbitals: [
      {
        name: 'a₁g (inner valence)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'Bonding orbital — constructive s/p overlap between  concentrates electron density between the nuclei.',
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 5.45, c: -0.70 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.27 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.27 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.27 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.27 },
          { atom: 5, n: 2, l: 1, m: 0, zeff: 5.13, c:  0.27 },
          { atom: 6, n: 2, l: 1, m: 0, zeff: 5.13, c:  0.27 },
        ],
      },
      {
        name: 't₁u (S-F bond, x)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'Bonding orbital — constructive p overlap between  concentrates electron density between the nuclei.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 5.45, c:  0.50 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 5.13, c: -0.55 },
        ],
      },
      {
        name: 't₁u (S-F bond, y)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'Bonding orbital — constructive p overlap between  concentrates electron density between the nuclei.',
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 5.45, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.55 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 5.13, c: -0.55 },
        ],
      },
      {
        name: 't₁u (S-F bond, z)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'Bonding orbital — constructive p overlap between  concentrates electron density between the nuclei.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 5.45, c:  0.50 },
          { atom: 5, n: 2, l: 1, m: 0, zeff: 5.13, c:  0.55 },
          { atom: 6, n: 2, l: 1, m: 0, zeff: 5.13, c: -0.55 },
        ],
      },
      {
        name: 'eg (S-F d-hybrid, dz²)',
        type: 'bonding',
        electrons: 2,
      energy: 5, desc: 'Bonding orbital — constructive d/p overlap between  concentrates electron density between the nuclei.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 5.45, c:  0.45 },
          { atom: 5, n: 2, l: 1, m: 0, zeff: 5.13, c:  0.50 },
          { atom: 6, n: 2, l: 1, m: 0, zeff: 5.13, c:  0.50 },
        ],
      },
      {
        name: 'eg (S-F d-hybrid, dx²-y²)',
        type: 'bonding',
        electrons: 2,
      energy: 6, desc: 'Bonding orbital — constructive d/p overlap between  concentrates electron density between the nuclei.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 2, zeff: 5.45, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.13, c:  0.50 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.50 },
        ],
      },
      {
        name: 'F lone pairs (24e)',
        type: 'nonbonding',
        electrons: 24,
      energy: 7, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.408 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.408 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.408 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 5.13, c: 0.408 },
          { atom: 5, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.408 },
          { atom: 6, n: 2, l: 1, m: -1, zeff: 5.13, c: 0.408 },
        ],
      },
    ],
  },

  'BN': {
    // atoms: B(0), N(1) — along x-axis
    notes: 'Boron nitride — isoelectronic with carbon. Forms both diamond-like (cubic BN) and graphite-like (hBN) phases.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 2.60, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.90, c:  0.70 },
        ],
      },
      {
        name: 'π (y)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'π bonding — lateral p overlap between . Electron density above and below the bond axis.',
      energy: 2, desc: 'π bonding — lateral p overlap between . Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 2.60, c: 0.45 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.90, c: 0.70 },
        ],
      },
      {
        name: 'π\' (z)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'π bonding — lateral overlap creates electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 2.60, c: 0.45 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.90, c: 0.70 },
        ],
      },
      {
        name: 'N lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.90, c: 0.85 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.90, c: -0.30 },
        ],
      },
    ],
  },

  'SiC': {
    // atoms: Si(0), C(1) — along x-axis
    notes: 'Silicon carbide — a wide-bandgap semiconductor for power electronics. Tetrahedral Si-C σ bonds.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 4.15, c:  0.50 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.65 },
        ],
      },
      {
        name: 'π (y)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'π bonding — lateral p overlap. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 4.15, c: 0.45 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.25, c: 0.70 },
        ],
      },
      {
        name: 'Si lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 4.15, c: 0.85 },
          { atom: 0, n: 3, l: 1, m: 1, zeff: 4.15, c: -0.30 },
        ],
      },
      {
        name: 'C lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.25, c: 0.85 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.25, c:  0.30 },
        ],
      },
    ],
  },

  'TiO₂': {
    // atoms: Ti(0), O(1), O(2) — bent, Ti in center
    notes: 'Titanium dioxide — the world\'s most important white pigment. Ti 3d — O 2p bonding creates a 3.2 eV bandgap.',
    orbitals: [
      {
        name: 'σ₁ (Ti-O bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/p overlap between O and Ti. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 4.82, c:  0.40 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
        ],
      },
      {
        name: 'σ₂ (Ti-O bond)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding from s/p overlap between O and Ti. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.15, c:  0.40 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
        ],
      },
      {
        name: 'π₁ (d-p, y)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'π bonding from d-p lateral overlap between O and Ti. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -1, zeff: 4.82, c: 0.40 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'π₂ (d-p, z)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'π bonding from d-p lateral overlap between O and Ti. Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 1, zeff: 4.82, c:  0.40 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.60 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.60 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.80 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.80 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.45 },
        ],
      },
    ],
  },

  'CrO₃': {
    // atoms: Cr(0), O(1), O(2), O(3) — trigonal planar
    notes: 'Chromium trioxide — a powerful oxidizer. Cr 3d participation enables the +6 oxidation state.',
    orbitals: [
      {
        name: 'σ₁ (Cr-O bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/p overlap between . Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 5.13, c:  0.40 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.55 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.55 },
        ],
      },
      {
        name: 'σ₂ (Cr-O antisym)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding from s/p overlap between . Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.45, c:  0.35 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.27 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.27 },
        ],
      },
      {
        name: 'π (d-p, out-of-plane)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'π bonding from d-p lateral overlap between . Electron density above and below the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 1, zeff: 5.13, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.55 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.55 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.55 },
        ],
      },
      {
        name: 'O₁ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.80 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'O₂ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.80 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.45 },
        ],
      },
      {
        name: 'O₃ lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 3, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.80 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.45 },
        ],
      },
    ],
  },

  'NiCl₂': {
    // atoms: Ni(0), Cl(1), Cl(2) — linear
    notes: 'Nickel(II) chloride — catalyst precursor. Ni 3d⁸ configuration creates the characteristic green color.',
    orbitals: [
      {
        name: 'σ₁ (Ni-Cl bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between . Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 4.05, c:  0.35 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.55 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.55 },
        ],
      },
      {
        name: 'σ₂ (Ni-Cl antisym)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding from d/p overlap between . Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 7.55, c:  0.35 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.55 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.10, c: -0.55 },
        ],
      },
      {
        name: 'Ni dxy',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -2, zeff: 7.55, c: 1.0 },
        ],
      },
      {
        name: 'Ni dx²-y²',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 2, zeff: 7.55, c: 1.0 },
        ],
      },
      {
        name: 'Ni dyz',
        type: 'nonbonding',
        electrons: 2,
      energy: 5, desc: 'Non-bonding orbital localized on undefined.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -1, zeff: 7.55, c: 1.0 },
        ],
      },
      {
        name: 'Ni dxz',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Non-bonding orbital localized on undefined.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 1, zeff: 7.55, c: 1.0 },
        ],
      },
      {
        name: 'Cl lone pairs (8e)',
        type: 'nonbonding',
        electrons: 8,
      energy: 7, desc: 'Lone pair localized on Co. Non-bonding electrons that can act as a Lewis base.',
      energy: 7, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.50 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.50 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.50 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.50 },
        ],
      },
    ],
  },

  // ─── Transition metal compounds for uncovered elements ───

  'CoO': {
    // atoms: Co(0), O(1) — along x-axis, Co²⁺ d7
    notes: 'Cobalt(II) oxide — antiferromagnetic. Co 3d⁷ electrons split in the octahedral crystal field.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.90, c:  0.35 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (d-p bond, y)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -1, zeff: 6.90, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'π (d-p bond, z)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 1, zeff: 6.90, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.75 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'Co dxy',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Non-bonding orbital localized on Cl.',
      energy: 5, desc: 'Non-bonding orbital localized on undefined.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -2, zeff: 6.90, c: 1.0 },
        ],
      },
      {
        name: 'Co dx²-y²',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital localized on Cl.',
      energy: 6, desc: 'Non-bonding orbital localized on undefined.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 2, zeff: 6.90, c: 1.0 },
        ],
      },
      {
        name: 'Co dz²',
        type: 'nonbonding',
        electrons: 1,
      energy: 7, desc: 'Non-bonding orbital localized on undefined.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 6.90, c: 1.0 },
        ],
      },
    ],
  },

  'CoCl₂': {
    // atoms: Co(0), Cl(1), Cl(2) — linear, Co²⁺ d7
    notes: 'Cobalt(II) chloride — blue when dry, pink when hydrated. A classic humidity indicator.',
    orbitals: [
      {
        name: 'σ₁ (Co-Cl bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between Cl and Co. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.90, c:  0.35 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.55 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.55 },
        ],
      },
      {
        name: 'σ₂ (Co-Cl antisym)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding from d/p overlap between Cl and Co. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 6.90, c:  0.35 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.55 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.10, c: -0.55 },
        ],
      },
      {
        name: 'Co dxy',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -2, zeff: 6.90, c: 1.0 },
        ],
      },
      {
        name: 'Co dx²-y²',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 2, zeff: 6.90, c: 1.0 },
        ],
      },
      {
        name: 'Co dyz',
        type: 'nonbonding',
        electrons: 1,
      energy: 5, desc: 'Non-bonding orbital localized on Cl.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -1, zeff: 6.90, c: 1.0 },
        ],
      },
      {
        name: 'Co dxz',
        type: 'nonbonding',
        electrons: 2,
      energy: 6, desc: 'Non-bonding orbital localized on Cl.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 1, zeff: 6.90, c: 1.0 },
        ],
      },
      {
        name: 'Cl lone pairs (8e)',
        type: 'nonbonding',
        electrons: 8,
      energy: 7, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.50 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.50 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.50 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.50 },
        ],
      },
    ],
  },

  'SrO': {
    // atoms: Sr(0), O(1) — along x-axis, ionic Sr²⁺O²⁻
    notes: 'Strontium oxide — a strong base. Comparing CaO/SrO/BaO shows increasing ionic character down Group 2.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 2.85, c:  0.30 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.80 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2py',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  'Y₂O₃': {
    // atoms: Y(0), Y(1), O(2), O(3), O(4) — bixbyite unit
    notes: 'Yttria — the host material for YAG lasers. Y 4d contributes weakly to bonding.',
    orbitals: [
      {
        name: 'σ₁ (Y-O bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/p overlap between Y and O. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 2, m: 0, zeff: 6.26, c:  0.35 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
        ],
      },
      {
        name: 'σ₂ (Y-O bond)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding from d/p overlap between Y and O. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 1, n: 4, l: 2, m: 0, zeff: 6.26, c:  0.35 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
        ],
      },
      {
        name: 'O₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.70 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'O₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 3, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.70 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'O₃ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 5, desc: 'Lone pair localized on O. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 4, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.70 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.70 },
        ],
      },
    ],
  },

  'InCl₃': {
    // atoms: In(0), Cl(1), Cl(2), Cl(3) — trigonal planar
    notes: 'Indium trichloride — used in organic synthesis. In 5s/5p electrons form the In-Cl bonds.',
    orbitals: [
      {
        name: 'σ₁ (In-Cl bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between . Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 5.00, c:  0.35 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.55 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.55 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.55 },
        ],
      },
      {
        name: 'σ₂ (In-Cl bond)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding between  — head-on p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 5.00, c:  0.40 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.55 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.10, c: -0.27 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.10, c: -0.27 },
        ],
      },
      {
        name: 'σ₃ (In-Cl bond)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding between  — head-on p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 1, m: -1, zeff: 5.00, c: 0.40 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.55 },
          { atom: 3, n: 3, l: 1, m: -1, zeff: 6.10, c: -0.55 },
        ],
      },
      {
        name: 'In 5s lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 5.00, c: 0.85 },
        ],
      },
      {
        name: 'Cl lone pairs (12e)',
        type: 'nonbonding',
        electrons: 12,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.408 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.408 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.408 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.408 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.408 },
          { atom: 3, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.408 },
        ],
      },
    ],
  },

  'BaO': {
    // atoms: Ba(0), O(1) — along x-axis, ionic Ba²⁺O²⁻
    notes: 'Barium oxide — desiccant and cathode coating. The most ionic of the alkaline earth oxides.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 2.85, c:  0.25 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.82 },
        ],
      },
      {
        name: 'O 2s',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2py',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  'TlCl': {
    // atoms: Tl(0), Cl(1) — along x-axis, Tl⁺ [Xe]4f¹⁴5d¹⁰6s²
    notes: 'Thallium(I) chloride — the inert pair effect leaves Tl 6s² electrons non-bonding.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 6, l: 1, m: 1, zeff: 6.95, c:  0.35 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.75 },
        ],
      },
      {
        name: 'Tl 6s lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 6.95, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3s',
        type: 'nonbonding',
        electrons: 2,
      energy: 3, desc: 'Non-bonding orbital — electrons not significantly involved in bond formation.',
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 6.10, c: 1.0 },
        ],
      },
      {
        name: 'Cl lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 4, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.707 },
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.707 },
        ],
      },
    ],
  },

  'BiCl₃': {
    // atoms: Bi(0), Cl(1), Cl(2), Cl(3) — trigonal pyramidal (like NH₃)
    notes: 'Bismuth trichloride — pyramidal geometry. Bi 6s² lone pair is stereochemically active.',
    orbitals: [
      {
        name: 'σ₁ (Bi-Cl bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding between  — head-on p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 6, l: 1, m: 1, zeff: 7.41, c:  0.40 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.70 },
        ],
      },
      {
        name: 'σ₂ (Bi-Cl bond)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding between  — head-on p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 6, l: 1, m: -1, zeff: 7.41, c: 0.40 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.70 },
        ],
      },
      {
        name: 'σ₃ (Bi-Cl bond)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding between  — head-on p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 6, l: 1, m: 0, zeff: 7.41, c:  0.40 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.10, c:  0.70 },
        ],
      },
      {
        name: 'Bi 6s² lone pair',
        type: 'nonbonding',
        electrons: 2,
      energy: 4, desc: 'Lone pair localized on ?. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 7.41, c: 1.0 },
        ],
      },
      {
        name: 'Cl lone pairs (12e)',
        type: 'nonbonding',
        electrons: 12,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.408 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.408 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.408 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.10, c: 0.408 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.10, c: 0.408 },
          { atom: 3, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.408 },
        ],
      },
    ],
  },

  'RaCl₂': {
    // atoms: Ra(0), Cl(1), Cl(2) — bent/linear
    notes: 'Radium chloride — the compound Marie Curie first isolated to discover radium.',
    orbitals: [
      {
        name: 'σ₁ (Ra-Cl bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from s/p overlap between Ra and Cl. Head-on overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 7, l: 0, m: 0, zeff: 2.85, c:  0.25 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.55 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.55 },
        ],
      },
      {
        name: 'σ₂ (Ra-Cl antisym)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding between Ra and Cl — head-on p overlap along the bond axis.',
        ao: [
          { atom: 0, n: 7, l: 1, m: 1, zeff: 2.85, c:  0.25 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.10, c:  0.55 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.10, c: -0.55 },
        ],
      },
      {
        name: 'Cl₁ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.707 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.707 },
        ],
      },
      {
        name: 'Cl₂ lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.707 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.707 },
        ],
      },
    ],
  },

  'KI': {
    // atoms: K(0), I(1) — along x-axis, ionic
    notes: 'Potassium iodide — used to protect thyroid from radioactive iodine. Highly ionic K⁺I⁻.',
    orbitals: [
      {
        name: 'σ (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on s/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 2.20, c:  0.25 },
          { atom: 1, n: 5, l: 1, m: 1, zeff: 7.60, c:  0.80 },
        ],
      },
      {
        name: 'I 5s',
        type: 'nonbonding',
        electrons: 2,
      energy: 2, desc: 'Non-bonding orbital localized on I.',
        ao: [
          { atom: 1, n: 5, l: 0, m: 0, zeff: 7.60, c: 1.0 },
        ],
      },
      {
        name: 'I lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
      energy: 3, desc: 'Lone pair localized on I. Non-bonding electrons that can act as a Lewis base.',
        ao: [
          { atom: 1, n: 5, l: 1, m: -1, zeff: 7.60, c: 0.707 },
          { atom: 1, n: 5, l: 1, m: 0, zeff: 7.60, c: 0.707 },
        ],
      },
    ],
  },

  // ─── Actinide dioxide series ───

  'NpO₂': {
    // atoms: O(0), Np(1), O(2) — linear, Np⁴⁺ 5f³
    notes: 'Neptunium dioxide — fluorite structure like UO₂. Np 5f electrons create complex magnetic behavior.',
    orbitals: [
      {
        name: 'σg (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding from d/p overlap between O and Pa. Head-on d-p overlap along the bond axis.',
      energy: 1, desc: 'σ bonding from d/p overlap between O and Cm. Head-on d-p overlap along the bond axis.',
      energy: 1, desc: 'σ bonding from d/p overlap between O and Am. Head-on d-p overlap along the bond axis.',
      energy: 1, desc: 'σ bonding from d/p overlap between O and Np. Head-on d-p overlap along the bond axis.',
        ao: [
          { atom: 1, n: 6, l: 2, m: 0, zeff: 10.6, c:  0.30 },
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
        ],
      },
      {
        name: 'σu (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding between O and Pa — head-on f/p overlap along the bond axis.',
      energy: 2, desc: 'σ bonding between O and Cm — head-on f/p overlap along the bond axis.',
      energy: 2, desc: 'σ bonding between O and Am — head-on f/p overlap along the bond axis.',
      energy: 2, desc: 'σ bonding between O and Np — head-on f/p overlap along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 3, m: 0, zeff: 8.20, c:  0.35 },
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
        ],
      },
      {
        name: 'πu (bonding, y)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding — head-on f/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 3, m: -1, zeff: 8.20, c: 0.35 },
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'πu (bonding, z)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding — head-on f/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 3, m: 1, zeff: 8.20, c:  0.35 },
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.60 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.60 },
        ],
      },
      {
        name: 'Np 5f nonbonding (3e)',
        type: 'nonbonding',
        electrons: 3,
      energy: 5, desc: 'Localized f-electrons on O — shielded from bonding by outer shells.',
        ao: [
          { atom: 1, n: 5, l: 3, m: -2, zeff: 8.20, c: 0.577 },
          { atom: 1, n: 5, l: 3, m: 2, zeff: 8.20, c: 0.577 },
          { atom: 1, n: 5, l: 3, m: -3, zeff: 8.20, c: 0.577 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
    ],
  },

  'AmO₂': {
    // atoms: O(0), Am(1), O(2) — linear, Am⁴⁺ 5f⁵
    notes: 'Americium dioxide — used in smoke detectors (Am-241). Am 5f electrons are more localized than U/Np.',
    orbitals: [
      {
        name: 'σg (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 6, l: 2, m: 0, zeff: 11.2, c:  0.30 },
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
        ],
      },
      {
        name: 'σu (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding — head-on f/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 3, m: 0, zeff: 8.80, c:  0.35 },
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
        ],
      },
      {
        name: 'πu (bonding, y)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding — head-on f/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 3, m: -1, zeff: 8.80, c: 0.35 },
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'πu (bonding, z)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding — head-on f/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 3, m: 1, zeff: 8.80, c:  0.35 },
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.60 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.60 },
        ],
      },
      {
        name: 'Am 5f nonbonding (5e)',
        type: 'nonbonding',
        electrons: 5,
      energy: 5, desc: 'Localized f-electrons on O — shielded from bonding by outer shells.',
        ao: [
          { atom: 1, n: 5, l: 3, m: -2, zeff: 8.80, c: 0.447 },
          { atom: 1, n: 5, l: 3, m: 2, zeff: 8.80, c: 0.447 },
          { atom: 1, n: 5, l: 3, m: -3, zeff: 8.80, c: 0.447 },
          { atom: 1, n: 5, l: 3, m: 3, zeff: 8.80, c: 0.447 },
          { atom: 1, n: 5, l: 3, m: -1, zeff: 8.80, c: 0.447 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
    ],
  },

  'CmO₂': {
    // atoms: O(0), Cm(1), O(2) — linear, Cm⁴⁺ 5f⁶
    notes: 'Curium dioxide — intensely radioactive. Cm 5f⁷ half-filled shell creates unique magnetic properties.',
    orbitals: [
      {
        name: 'σg (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 6, l: 2, m: 0, zeff: 11.5, c:  0.30 },
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
        ],
      },
      {
        name: 'σu (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding — head-on f/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 3, m: 0, zeff: 9.10, c:  0.35 },
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
        ],
      },
      {
        name: 'πu (bonding, y)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding — head-on f/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 3, m: -1, zeff: 9.10, c: 0.35 },
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'πu (bonding, z)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding — head-on f/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 3, m: 1, zeff: 9.10, c:  0.35 },
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.60 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.60 },
        ],
      },
      {
        name: 'Cm 5f nonbonding (6e)',
        type: 'nonbonding',
        electrons: 6,
      energy: 5, desc: 'Localized f-electrons on O — shielded from bonding by outer shells.',
        ao: [
          { atom: 1, n: 5, l: 3, m: -2, zeff: 9.10, c: 0.408 },
          { atom: 1, n: 5, l: 3, m: 2, zeff: 9.10, c: 0.408 },
          { atom: 1, n: 5, l: 3, m: -3, zeff: 9.10, c: 0.408 },
          { atom: 1, n: 5, l: 3, m: 3, zeff: 9.10, c: 0.408 },
          { atom: 1, n: 5, l: 3, m: -1, zeff: 9.10, c: 0.408 },
          { atom: 1, n: 5, l: 3, m: 1, zeff: 9.10, c: 0.408 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
    ],
  },

  'PaO₂': {
    // atoms: O(0), Pa(1), O(2) — linear, Pa⁴⁺ 5f¹
    notes: 'Protactinium dioxide — one of the rarest actinide compounds. Pa 5f contribution to bonding is debated.',
    orbitals: [
      {
        name: 'σg (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 6, l: 2, m: 0, zeff: 10.2, c:  0.30 },
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.60 },
        ],
      },
      {
        name: 'σu (bond)',
        type: 'bonding',
        electrons: 2,
      energy: 2, desc: 'σ bonding — head-on f/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 3, m: 0, zeff: 7.80, c:  0.35 },
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.55 },
        ],
      },
      {
        name: 'πu (bonding, y)',
        type: 'bonding',
        electrons: 2,
      energy: 3, desc: 'σ bonding — head-on f/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 3, m: -1, zeff: 7.80, c: 0.35 },
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'πu (bonding, z)',
        type: 'bonding',
        electrons: 2,
      energy: 4, desc: 'σ bonding — head-on f/p overlap concentrates electron density along the bond axis.',
        ao: [
          { atom: 1, n: 5, l: 3, m: 1, zeff: 7.80, c:  0.35 },
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.60 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.60 },
        ],
      },
      {
        name: 'Pa 5f nonbonding (1e)',
        type: 'nonbonding',
        electrons: 1,
      energy: 5, desc: 'Localized f-electrons on O — shielded from bonding by outer shells.',
        ao: [
          { atom: 1, n: 5, l: 3, m: -2, zeff: 7.80, c: 1.0 },
        ],
      },
      {
        name: 'O lone pairs',
        type: 'nonbonding',
        electrons: 4,
      energy: 6, desc: 'Lone pair electrons — localized and can act as a Lewis base.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
    ],
  },

  // ─── Lanthanide sesquioxides (Ln₂O₃) ───
  // Same structure as La₂O₃: atoms Ln(0), Ln(1), O(2), O(3), O(4)
  // 4f electrons are nonbonding, Zeff from Slater's rules for each Ln

  'Pr₂O₃': {
    notes: 'Praseodymium sesquioxide — Pr 4f² electrons are localized and barely participate in bonding.',
    orbitals: [
      { name: 'σ₁ (Pr-O bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: 0, zeff: 7.60, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'σ₂ (Pr-O bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 1, n: 5, l: 2, m: 0, zeff: 7.60, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'Pr 4f nonbonding (4e)', type: 'nonbonding', electrons: 4,
      energy: 3, desc: 'Localized f-electrons — shielded from bonding by outer electron shells.', ao: [
        { atom: 0, n: 4, l: 3, m: -3, zeff: 7.60, c: 0.50 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 7.60, c: 0.50 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 7.60, c: 0.50 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 7.60, c: 0.50 },
      ]},
      { name: 'O lone pairs', type: 'nonbonding', electrons: 6,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
      ]},
    ],
  },

  'Nd₂O₃': {
    notes: 'Neodymium sesquioxide — Nd is used in the strongest permanent magnets. 4f³ electrons are non-bonding.',
    orbitals: [
      { name: 'σ₁ (Nd-O bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: 0, zeff: 7.95, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'σ₂ (Nd-O bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 1, n: 5, l: 2, m: 0, zeff: 7.95, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'Nd 4f nonbonding (6e)', type: 'nonbonding', electrons: 6,
      energy: 3, desc: 'Localized f-electrons — shielded from bonding by outer electron shells.', ao: [
        { atom: 0, n: 4, l: 3, m: -3, zeff: 7.95, c: 0.408 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 7.95, c: 0.408 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 7.95, c: 0.408 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 7.95, c: 0.408 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 7.95, c: 0.408 }, { atom: 1, n: 4, l: 3, m: -1, zeff: 7.95, c: 0.408 },
      ]},
      { name: 'O lone pairs', type: 'nonbonding', electrons: 6,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
      ]},
    ],
  },

  'Sm₂O₃': {
    notes: 'Samarium sesquioxide — Sm 4f⁵ near the half-filled shell. Used in nuclear reactor control rods.',
    orbitals: [
      { name: 'σ₁ (Sm-O bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: 0, zeff: 8.65, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'σ₂ (Sm-O bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 1, n: 5, l: 2, m: 0, zeff: 8.65, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'Sm 4f nonbonding (10e)', type: 'nonbonding', electrons: 10,
      energy: 3, desc: 'Localized f-electrons — shielded from bonding by outer electron shells.', ao: [
        { atom: 0, n: 4, l: 3, m: -3, zeff: 8.65, c: 0.316 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 8.65, c: 0.316 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 8.65, c: 0.316 }, { atom: 0, n: 4, l: 3, m: 0, zeff: 8.65, c: 0.316 }, { atom: 0, n: 4, l: 3, m: 1, zeff: 8.65, c: 0.316 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 8.65, c: 0.316 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 8.65, c: 0.316 }, { atom: 1, n: 4, l: 3, m: -1, zeff: 8.65, c: 0.316 }, { atom: 1, n: 4, l: 3, m: 0, zeff: 8.65, c: 0.316 }, { atom: 1, n: 4, l: 3, m: 1, zeff: 8.65, c: 0.316 },
      ]},
      { name: 'O lone pairs', type: 'nonbonding', electrons: 6,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
      ]},
    ],
  },

  'Eu₂O₃': {
    notes: 'Europium sesquioxide — red phosphor in displays. Eu 4f⁶→4f⁷ transitions produce sharp emission lines.',
    orbitals: [
      { name: 'σ₁ (Eu-O bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: 0, zeff: 9.00, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'σ₂ (Eu-O bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 1, n: 5, l: 2, m: 0, zeff: 9.00, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'Eu 4f nonbonding (12e)', type: 'nonbonding', electrons: 12,
      energy: 3, desc: 'Localized f-electrons — shielded from bonding by outer electron shells.', ao: [
        { atom: 0, n: 4, l: 3, m: -3, zeff: 9.00, c: 0.289 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 9.00, c: 0.289 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 9.00, c: 0.289 }, { atom: 0, n: 4, l: 3, m: 0, zeff: 9.00, c: 0.289 }, { atom: 0, n: 4, l: 3, m: 1, zeff: 9.00, c: 0.289 }, { atom: 0, n: 4, l: 3, m: 2, zeff: 9.00, c: 0.289 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 9.00, c: 0.289 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 9.00, c: 0.289 }, { atom: 1, n: 4, l: 3, m: -1, zeff: 9.00, c: 0.289 }, { atom: 1, n: 4, l: 3, m: 0, zeff: 9.00, c: 0.289 }, { atom: 1, n: 4, l: 3, m: 1, zeff: 9.00, c: 0.289 }, { atom: 1, n: 4, l: 3, m: 2, zeff: 9.00, c: 0.289 },
      ]},
      { name: 'O lone pairs', type: 'nonbonding', electrons: 6,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
      ]},
    ],
  },

  'Gd₂O₃': {
    notes: 'Gadolinium sesquioxide — Gd 4f⁷ half-filled shell gives the highest magnetic moment among lanthanides.',
    orbitals: [
      { name: 'σ₁ (Gd-O bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: 0, zeff: 9.35, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'σ₂ (Gd-O bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 1, n: 5, l: 2, m: 0, zeff: 9.35, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'Gd 4f nonbonding (14e)', type: 'nonbonding', electrons: 14,
      energy: 3, desc: 'Localized f-electrons — shielded from bonding by outer electron shells.', ao: [
        { atom: 0, n: 4, l: 3, m: -3, zeff: 9.35, c: 0.267 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 9.35, c: 0.267 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 9.35, c: 0.267 }, { atom: 0, n: 4, l: 3, m: 0, zeff: 9.35, c: 0.267 }, { atom: 0, n: 4, l: 3, m: 1, zeff: 9.35, c: 0.267 }, { atom: 0, n: 4, l: 3, m: 2, zeff: 9.35, c: 0.267 }, { atom: 0, n: 4, l: 3, m: 3, zeff: 9.35, c: 0.267 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 9.35, c: 0.267 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 9.35, c: 0.267 }, { atom: 1, n: 4, l: 3, m: -1, zeff: 9.35, c: 0.267 }, { atom: 1, n: 4, l: 3, m: 0, zeff: 9.35, c: 0.267 }, { atom: 1, n: 4, l: 3, m: 1, zeff: 9.35, c: 0.267 }, { atom: 1, n: 4, l: 3, m: 2, zeff: 9.35, c: 0.267 }, { atom: 1, n: 4, l: 3, m: 3, zeff: 9.35, c: 0.267 },
      ]},
      { name: 'O lone pairs', type: 'nonbonding', electrons: 6,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
      ]},
    ],
  },

  'Tb₂O₃': {
    notes: 'Terbium sesquioxide — green phosphor. Tb 4f⁸ is one electron beyond the half-filled stability point.',
    orbitals: [
      { name: 'σ₁ (Tb-O bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: 0, zeff: 9.70, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'σ₂ (Tb-O bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 1, n: 5, l: 2, m: 0, zeff: 9.70, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'Tb 4f nonbonding (16e)', type: 'nonbonding', electrons: 16,
      energy: 3, desc: 'Localized f-electrons — shielded from bonding by outer electron shells.', ao: [
        { atom: 0, n: 4, l: 3, m: -3, zeff: 9.70, c: 0.250 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 9.70, c: 0.250 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 9.70, c: 0.250 }, { atom: 0, n: 4, l: 3, m: 0, zeff: 9.70, c: 0.250 }, { atom: 0, n: 4, l: 3, m: 1, zeff: 9.70, c: 0.250 }, { atom: 0, n: 4, l: 3, m: 2, zeff: 9.70, c: 0.250 }, { atom: 0, n: 4, l: 3, m: 3, zeff: 9.70, c: 0.250 }, { atom: 0, n: 4, l: 3, m: -3, zeff: 9.70, c: 0.250 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 9.70, c: 0.250 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 9.70, c: 0.250 }, { atom: 1, n: 4, l: 3, m: -1, zeff: 9.70, c: 0.250 }, { atom: 1, n: 4, l: 3, m: 0, zeff: 9.70, c: 0.250 }, { atom: 1, n: 4, l: 3, m: 1, zeff: 9.70, c: 0.250 }, { atom: 1, n: 4, l: 3, m: 2, zeff: 9.70, c: 0.250 }, { atom: 1, n: 4, l: 3, m: 3, zeff: 9.70, c: 0.250 }, { atom: 1, n: 4, l: 3, m: -3, zeff: 9.70, c: 0.250 },
      ]},
      { name: 'O lone pairs', type: 'nonbonding', electrons: 6,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
      ]},
    ],
  },

  'Dy₂O₃': {
    notes: 'Dysprosium sesquioxide — Dy magnets outperform Nd magnets at high temperatures.',
    orbitals: [
      { name: 'σ₁ (Dy-O bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: 0, zeff: 10.05, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'σ₂ (Dy-O bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 1, n: 5, l: 2, m: 0, zeff: 10.05, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'Dy 4f nonbonding (18e)', type: 'nonbonding', electrons: 18,
      energy: 3, desc: 'Localized f-electrons — shielded from bonding by outer electron shells.', ao: [
        { atom: 0, n: 4, l: 3, m: -3, zeff: 10.05, c: 0.236 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 10.05, c: 0.236 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 10.05, c: 0.236 }, { atom: 0, n: 4, l: 3, m: 0, zeff: 10.05, c: 0.236 }, { atom: 0, n: 4, l: 3, m: 1, zeff: 10.05, c: 0.236 }, { atom: 0, n: 4, l: 3, m: 2, zeff: 10.05, c: 0.236 }, { atom: 0, n: 4, l: 3, m: 3, zeff: 10.05, c: 0.236 },
        { atom: 0, n: 4, l: 3, m: -3, zeff: 10.05, c: 0.236 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 10.05, c: 0.236 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 10.05, c: 0.236 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 10.05, c: 0.236 }, { atom: 1, n: 4, l: 3, m: -1, zeff: 10.05, c: 0.236 }, { atom: 1, n: 4, l: 3, m: 0, zeff: 10.05, c: 0.236 }, { atom: 1, n: 4, l: 3, m: 1, zeff: 10.05, c: 0.236 }, { atom: 1, n: 4, l: 3, m: 2, zeff: 10.05, c: 0.236 }, { atom: 1, n: 4, l: 3, m: 3, zeff: 10.05, c: 0.236 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 10.05, c: 0.236 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 10.05, c: 0.236 },
      ]},
      { name: 'O lone pairs', type: 'nonbonding', electrons: 6,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
      ]},
    ],
  },

  'Ho₂O₃': {
    notes: 'Holmium sesquioxide — Ho has the highest magnetic moment of any element.',
    orbitals: [
      { name: 'σ₁ (Ho-O bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: 0, zeff: 10.40, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'σ₂ (Ho-O bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 1, n: 5, l: 2, m: 0, zeff: 10.40, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'Ho 4f nonbonding (20e)', type: 'nonbonding', electrons: 20,
      energy: 3, desc: 'Localized f-electrons — shielded from bonding by outer electron shells.', ao: [
        { atom: 0, n: 4, l: 3, m: -3, zeff: 10.40, c: 0.224 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 10.40, c: 0.224 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 10.40, c: 0.224 }, { atom: 0, n: 4, l: 3, m: 0, zeff: 10.40, c: 0.224 }, { atom: 0, n: 4, l: 3, m: 1, zeff: 10.40, c: 0.224 }, { atom: 0, n: 4, l: 3, m: 2, zeff: 10.40, c: 0.224 }, { atom: 0, n: 4, l: 3, m: 3, zeff: 10.40, c: 0.224 },
        { atom: 0, n: 4, l: 3, m: -3, zeff: 10.40, c: 0.224 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 10.40, c: 0.224 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 10.40, c: 0.224 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 10.40, c: 0.224 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 10.40, c: 0.224 }, { atom: 1, n: 4, l: 3, m: -1, zeff: 10.40, c: 0.224 }, { atom: 1, n: 4, l: 3, m: 0, zeff: 10.40, c: 0.224 }, { atom: 1, n: 4, l: 3, m: 1, zeff: 10.40, c: 0.224 }, { atom: 1, n: 4, l: 3, m: 2, zeff: 10.40, c: 0.224 }, { atom: 1, n: 4, l: 3, m: 3, zeff: 10.40, c: 0.224 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 10.40, c: 0.224 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 10.40, c: 0.224 }, { atom: 1, n: 4, l: 3, m: -1, zeff: 10.40, c: 0.224 },
      ]},
      { name: 'O lone pairs', type: 'nonbonding', electrons: 6,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
      ]},
    ],
  },

  'Er₂O₃': {
    notes: 'Erbium sesquioxide — Er-doped fiber amplifiers revolutionized telecommunications.',
    orbitals: [
      { name: 'σ₁ (Er-O bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: 0, zeff: 10.75, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'σ₂ (Er-O bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 1, n: 5, l: 2, m: 0, zeff: 10.75, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'Er 4f nonbonding (22e)', type: 'nonbonding', electrons: 22,
      energy: 3, desc: 'Localized f-electrons — shielded from bonding by outer electron shells.', ao: [
        { atom: 0, n: 4, l: 3, m: -3, zeff: 10.75, c: 0.213 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 10.75, c: 0.213 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 10.75, c: 0.213 }, { atom: 0, n: 4, l: 3, m: 0, zeff: 10.75, c: 0.213 }, { atom: 0, n: 4, l: 3, m: 1, zeff: 10.75, c: 0.213 }, { atom: 0, n: 4, l: 3, m: 2, zeff: 10.75, c: 0.213 }, { atom: 0, n: 4, l: 3, m: 3, zeff: 10.75, c: 0.213 },
        { atom: 0, n: 4, l: 3, m: -3, zeff: 10.75, c: 0.213 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 10.75, c: 0.213 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 10.75, c: 0.213 }, { atom: 0, n: 4, l: 3, m: 0, zeff: 10.75, c: 0.213 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 10.75, c: 0.213 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 10.75, c: 0.213 }, { atom: 1, n: 4, l: 3, m: -1, zeff: 10.75, c: 0.213 }, { atom: 1, n: 4, l: 3, m: 0, zeff: 10.75, c: 0.213 }, { atom: 1, n: 4, l: 3, m: 1, zeff: 10.75, c: 0.213 }, { atom: 1, n: 4, l: 3, m: 2, zeff: 10.75, c: 0.213 }, { atom: 1, n: 4, l: 3, m: 3, zeff: 10.75, c: 0.213 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 10.75, c: 0.213 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 10.75, c: 0.213 }, { atom: 1, n: 4, l: 3, m: -1, zeff: 10.75, c: 0.213 }, { atom: 1, n: 4, l: 3, m: 0, zeff: 10.75, c: 0.213 },
      ]},
      { name: 'O lone pairs', type: 'nonbonding', electrons: 6,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
      ]},
    ],
  },

  'Tm₂O₃': {
    notes: 'Thulium sesquioxide — Tm is the rarest lanthanide with stable isotopes. Used in X-ray sources.',
    orbitals: [
      { name: 'σ₁ (Tm-O bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: 0, zeff: 11.10, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'σ₂ (Tm-O bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 1, n: 5, l: 2, m: 0, zeff: 11.10, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'Tm 4f nonbonding (24e)', type: 'nonbonding', electrons: 24,
      energy: 3, desc: 'Localized f-electrons — shielded from bonding by outer electron shells.', ao: [
        { atom: 0, n: 4, l: 3, m: -3, zeff: 11.10, c: 0.204 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 11.10, c: 0.204 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 11.10, c: 0.204 }, { atom: 0, n: 4, l: 3, m: 0, zeff: 11.10, c: 0.204 }, { atom: 0, n: 4, l: 3, m: 1, zeff: 11.10, c: 0.204 }, { atom: 0, n: 4, l: 3, m: 2, zeff: 11.10, c: 0.204 }, { atom: 0, n: 4, l: 3, m: 3, zeff: 11.10, c: 0.204 },
        { atom: 0, n: 4, l: 3, m: -3, zeff: 11.10, c: 0.204 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 11.10, c: 0.204 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 11.10, c: 0.204 }, { atom: 0, n: 4, l: 3, m: 0, zeff: 11.10, c: 0.204 }, { atom: 0, n: 4, l: 3, m: 1, zeff: 11.10, c: 0.204 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 11.10, c: 0.204 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 11.10, c: 0.204 }, { atom: 1, n: 4, l: 3, m: -1, zeff: 11.10, c: 0.204 }, { atom: 1, n: 4, l: 3, m: 0, zeff: 11.10, c: 0.204 }, { atom: 1, n: 4, l: 3, m: 1, zeff: 11.10, c: 0.204 }, { atom: 1, n: 4, l: 3, m: 2, zeff: 11.10, c: 0.204 }, { atom: 1, n: 4, l: 3, m: 3, zeff: 11.10, c: 0.204 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 11.10, c: 0.204 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 11.10, c: 0.204 }, { atom: 1, n: 4, l: 3, m: -1, zeff: 11.10, c: 0.204 }, { atom: 1, n: 4, l: 3, m: 0, zeff: 11.10, c: 0.204 }, { atom: 1, n: 4, l: 3, m: 1, zeff: 11.10, c: 0.204 },
      ]},
      { name: 'O lone pairs', type: 'nonbonding', electrons: 6,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
      ]},
    ],
  },

  'Yb₂O₃': {
    notes: 'Ytterbium sesquioxide — Yb 4f¹³ is one electron short of full. Used in atomic clocks.',
    orbitals: [
      { name: 'σ₁ (Yb-O bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: 0, zeff: 11.45, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'σ₂ (Yb-O bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 1, n: 5, l: 2, m: 0, zeff: 11.45, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'Yb 4f nonbonding (26e)', type: 'nonbonding', electrons: 26,
      energy: 3, desc: 'Localized f-electrons — shielded from bonding by outer electron shells.', ao: [
        { atom: 0, n: 4, l: 3, m: -3, zeff: 11.45, c: 0.196 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 11.45, c: 0.196 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 11.45, c: 0.196 }, { atom: 0, n: 4, l: 3, m: 0, zeff: 11.45, c: 0.196 }, { atom: 0, n: 4, l: 3, m: 1, zeff: 11.45, c: 0.196 }, { atom: 0, n: 4, l: 3, m: 2, zeff: 11.45, c: 0.196 }, { atom: 0, n: 4, l: 3, m: 3, zeff: 11.45, c: 0.196 },
        { atom: 0, n: 4, l: 3, m: -3, zeff: 11.45, c: 0.196 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 11.45, c: 0.196 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 11.45, c: 0.196 }, { atom: 0, n: 4, l: 3, m: 0, zeff: 11.45, c: 0.196 }, { atom: 0, n: 4, l: 3, m: 1, zeff: 11.45, c: 0.196 }, { atom: 0, n: 4, l: 3, m: 2, zeff: 11.45, c: 0.196 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 11.45, c: 0.196 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 11.45, c: 0.196 }, { atom: 1, n: 4, l: 3, m: -1, zeff: 11.45, c: 0.196 }, { atom: 1, n: 4, l: 3, m: 0, zeff: 11.45, c: 0.196 }, { atom: 1, n: 4, l: 3, m: 1, zeff: 11.45, c: 0.196 }, { atom: 1, n: 4, l: 3, m: 2, zeff: 11.45, c: 0.196 }, { atom: 1, n: 4, l: 3, m: 3, zeff: 11.45, c: 0.196 },
        { atom: 1, n: 4, l: 3, m: -3, zeff: 11.45, c: 0.196 }, { atom: 1, n: 4, l: 3, m: -2, zeff: 11.45, c: 0.196 }, { atom: 1, n: 4, l: 3, m: -1, zeff: 11.45, c: 0.196 }, { atom: 1, n: 4, l: 3, m: 0, zeff: 11.45, c: 0.196 }, { atom: 1, n: 4, l: 3, m: 1, zeff: 11.45, c: 0.196 }, { atom: 1, n: 4, l: 3, m: 2, zeff: 11.45, c: 0.196 },
      ]},
      { name: 'O lone pairs', type: 'nonbonding', electrons: 6,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
      ]},
    ],
  },

  'Lu₂O₃': {
    notes: 'Lutetium sesquioxide — Lu 4f¹⁴ is completely filled (lanthanide contraction makes Lu the smallest lanthanide).',
    orbitals: [
      { name: 'σ₁ (Lu-O bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: 0, zeff: 11.80, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'σ₂ (Lu-O bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 1, n: 5, l: 2, m: 0, zeff: 11.80, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'O lone pairs', type: 'nonbonding', electrons: 6,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
      ]},
    ],
  },

  // ─── Actinide sesquioxides ───

  'Ac₂O₃': {
    notes: 'Actinium sesquioxide — intensely radioactive. Ac has no 5f electrons; bonding is purely 6d/7s.',
    orbitals: [
      { name: 'σ₁ (Ac-O bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 6, l: 2, m: 0, zeff: 8.50, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'σ₂ (Ac-O bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 1, n: 6, l: 2, m: 0, zeff: 8.50, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'O lone pairs', type: 'nonbonding', electrons: 6,
      energy: 3, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
      ]},
    ],
  },

  'Cm₂O₃': {
    notes: 'Curium sesquioxide — Cm 5f⁷ mirrors Gd 4f⁷ as the half-filled analog in the actinide series.',
    orbitals: [
      { name: 'σ₁ (Cm-O bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 6, l: 2, m: 0, zeff: 11.50, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'σ₂ (Cm-O bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 1, n: 6, l: 2, m: 0, zeff: 11.50, c: 0.35 }, { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 }, { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.60 },
      ]},
      { name: 'Cm 5f nonbonding (14e)', type: 'nonbonding', electrons: 14,
      energy: 3, desc: 'Localized f-electrons — shielded from bonding by outer electron shells.', ao: [
        { atom: 0, n: 5, l: 3, m: -3, zeff: 9.10, c: 0.267 }, { atom: 0, n: 5, l: 3, m: -2, zeff: 9.10, c: 0.267 }, { atom: 0, n: 5, l: 3, m: -1, zeff: 9.10, c: 0.267 }, { atom: 0, n: 5, l: 3, m: 0, zeff: 9.10, c: 0.267 }, { atom: 0, n: 5, l: 3, m: 1, zeff: 9.10, c: 0.267 }, { atom: 0, n: 5, l: 3, m: 2, zeff: 9.10, c: 0.267 }, { atom: 0, n: 5, l: 3, m: 3, zeff: 9.10, c: 0.267 },
        { atom: 1, n: 5, l: 3, m: -3, zeff: 9.10, c: 0.267 }, { atom: 1, n: 5, l: 3, m: -2, zeff: 9.10, c: 0.267 }, { atom: 1, n: 5, l: 3, m: -1, zeff: 9.10, c: 0.267 }, { atom: 1, n: 5, l: 3, m: 0, zeff: 9.10, c: 0.267 }, { atom: 1, n: 5, l: 3, m: 1, zeff: 9.10, c: 0.267 }, { atom: 1, n: 5, l: 3, m: 2, zeff: 9.10, c: 0.267 }, { atom: 1, n: 5, l: 3, m: 3, zeff: 9.10, c: 0.267 },
      ]},
      { name: 'O lone pairs', type: 'nonbonding', electrons: 6,
      energy: 4, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 }, { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
      ]},
    ],
  },

  'PmCl₃': {
    // atoms: Pm(0), Cl(1), Cl(2), Cl(3) — trigonal pyramidal
    notes: 'Promethium chloride — all Pm isotopes are radioactive. The 4f⁴ electrons are non-bonding.',
    orbitals: [
      { name: 'σ₁ (Pm-Cl bond)', type: 'bonding', electrons: 2,
      energy: 1, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: 0, zeff: 8.30, c: 0.35 }, { atom: 1, n: 3, l: 1, m: 1, zeff: 6.10, c: 0.70 },
      ]},
      { name: 'σ₂ (Pm-Cl bond)', type: 'bonding', electrons: 2,
      energy: 2, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: 2, zeff: 8.30, c: 0.35 }, { atom: 2, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.70 },
      ]},
      { name: 'σ₃ (Pm-Cl bond)', type: 'bonding', electrons: 2,
      energy: 3, desc: 'σ bonding — head-on d/p overlap concentrates electron density along the bond axis.', ao: [
        { atom: 0, n: 5, l: 2, m: -2, zeff: 8.30, c: 0.35 }, { atom: 3, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.70 },
      ]},
      { name: 'Pm 4f nonbonding (8e)', type: 'nonbonding', electrons: 8,
      energy: 4, desc: 'Localized f-electrons — shielded from bonding by outer electron shells.', ao: [
        { atom: 0, n: 4, l: 3, m: -3, zeff: 8.30, c: 0.354 }, { atom: 0, n: 4, l: 3, m: -2, zeff: 8.30, c: 0.354 }, { atom: 0, n: 4, l: 3, m: -1, zeff: 8.30, c: 0.354 }, { atom: 0, n: 4, l: 3, m: 0, zeff: 8.30, c: 0.354 },
        { atom: 0, n: 4, l: 3, m: 1, zeff: 8.30, c: 0.354 }, { atom: 0, n: 4, l: 3, m: 2, zeff: 8.30, c: 0.354 }, { atom: 0, n: 4, l: 3, m: 3, zeff: 8.30, c: 0.354 }, { atom: 0, n: 4, l: 3, m: -3, zeff: 8.30, c: 0.354 },
      ]},
      { name: 'Cl lone pairs (12e)', type: 'nonbonding', electrons: 12,
      energy: 5, desc: 'Lone pair electrons — localized and can act as a Lewis base.', ao: [
        { atom: 1, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.408 }, { atom: 1, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.408 },
        { atom: 2, n: 3, l: 1, m: 0, zeff: 6.10, c: 0.408 }, { atom: 2, n: 3, l: 1, m: 1, zeff: 6.10, c: 0.408 },
        { atom: 3, n: 3, l: 1, m: 1, zeff: 6.10, c: 0.408 }, { atom: 3, n: 3, l: 1, m: -1, zeff: 6.10, c: 0.408 },
      ]},
    ],
  },

  // ═══════════════════ NaTcO₄ — Sodium Pertechnetate ═══════════════════
  // Tetrahedral TcO₄⁻ anion. Tc(VII) d⁰, 24 valence electrons.
  // Atoms: Tc(0), O₁(1), O₂(2), O₃(3), O₄(4)
  'NaTcO₄': {
    notes: 'Sodium pertechnetate — the most widely used radiopharmaceutical (Tc-99m). The TcO₄⁻ anion is isoelectronic with MnO₄⁻ and RuO₄.',
    orbitals: [
      {
        name: '1a₁ (Tc-O σ, symmetric)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Fully symmetric σ bond — Tc 5s overlaps with all four O 2p orbitals in phase.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.00, c:  0.40 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.45 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.45 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.45 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.45 },
        ],
      },
      {
        name: '1t₂ (Tc-O σ, x)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Triply-degenerate σ bond (x component) — Tc 5p mixes with O 2p along each bond axis.',
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 3.80, c:  0.38 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.50 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.25 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.25 },
        ],
      },
      {
        name: '1t₂ (Tc-O σ, y)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Triply-degenerate σ bond (y component) — Tc 5p mixes with O 2p.',
        ao: [
          { atom: 0, n: 5, l: 1, m: -1, zeff: 3.80, c:  0.38 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.50 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.25 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.50 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.25 },
        ],
      },
      {
        name: '1t₂ (Tc-O σ, z)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Triply-degenerate σ bond (z component) — Tc 5p mixes with O 2p.',
        ao: [
          { atom: 0, n: 5, l: 1, m: 0, zeff: 3.80, c:  0.38 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.25 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.25 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.50 },
        ],
      },
      {
        name: '1e (Tc d-π bond)',
        type: 'bonding',
        electrons: 2,
        energy: 5, desc: 'Doubly-degenerate π bond — Tc 4d(eg) overlaps with O 2p perpendicular to bond axes.',
        ao: [
          { atom: 0, n: 4, l: 2, m: 0, zeff: 7.20, c:  0.45 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.40 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.40 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.40 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.40 },
        ],
      },
      {
        name: '1t₁ (O lone pair, x)',
        type: 'nonbonding',
        electrons: 2,
        energy: 6, desc: 'Non-bonding O lone pair — no matching Tc orbital of t₁ symmetry in a tetrahedron.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.60 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.60 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.30 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.30 },
        ],
      },
      {
        name: '1t₁ (O lone pair, y)',
        type: 'nonbonding',
        electrons: 2,
        energy: 7, desc: 'Non-bonding O lone pair — no matching Tc orbital of t₁ symmetry in a tetrahedron.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.55 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.55 },
          { atom: 3, n: 2, l: 0, m: 0, zeff: 4.45, c: -0.55 },
          { atom: 4, n: 2, l: 0, m: 0, zeff: 4.45, c: -0.55 },
        ],
      },
      {
        name: '1t₁ (O lone pair, z)',
        type: 'nonbonding',
        electrons: 2,
        energy: 8, desc: 'Non-bonding O lone pair — no matching Tc orbital of t₁ symmetry in a tetrahedron.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 3, n: 2, l: 0, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: 'O₁₂ lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
        energy: 9, desc: 'Remaining O 2s lone pairs — deep-lying, essentially atomic in character.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.50 },
          { atom: 2, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.50 },
          { atom: 3, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.50 },
          { atom: 4, n: 2, l: 0, m: 0, zeff: 4.45, c:  0.50 },
        ],
      },
    ],
  },

  // ═══════════════════ PoO₂ — Polonium Dioxide ═══════════════════
  // Linear O-Po-O. Po(IV) with 6s² inert pair. 16 valence electrons.
  // Atoms: O₁(0), Po(1), O₂(2) — along x axis
  'PoO₂': {
    notes: 'Polonium dioxide — intensely radioactive. Po is the heaviest Group 16 element with characterized compounds. The 6s² inert pair effect is prominent.',
    orbitals: [
      {
        name: '1σ_g (Po-O σ bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'σ bonding — Po 6s overlaps with O 2p along the molecular axis (gerade symmetry).',
        ao: [
          { atom: 1, n: 6, l: 0, m: 0, zeff: 8.00, c: -0.55 },
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.45 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: -0.45 },
        ],
      },
      {
        name: '1σ_u (Po-O σ bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'σ bonding — Po 6p overlaps head-on with O 2p (ungerade symmetry).',
        ao: [
          { atom: 1, n: 6, l: 1, m: 1, zeff: 7.00, c:  0.50 },
          { atom: 0, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.45 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c:  0.45 },
        ],
      },
      {
        name: '1π_u (Po-O π, y)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'π bonding — Po 6p lateral overlap with O 2p, perpendicular to the bond axis.',
        ao: [
          { atom: 1, n: 6, l: 1, m: -1, zeff: 7.00, c:  0.50 },
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.45 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.45 },
        ],
      },
      {
        name: '1π_u (Po-O π, z)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'π bonding — the second degenerate π bond, orthogonal to the first.',
        ao: [
          { atom: 1, n: 6, l: 1, m: 0, zeff: 7.00, c:  0.50 },
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.45 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.45 },
        ],
      },
      {
        name: '1π_g (O lone pair, y)',
        type: 'nonbonding',
        electrons: 2,
        energy: 5, desc: 'O lone pair combination — out-of-phase, gerade symmetry, no Po orbital to mix with.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 4.45, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: -0.707 },
        ],
      },
      {
        name: '1π_g (O lone pair, z)',
        type: 'nonbonding',
        electrons: 2,
        energy: 6, desc: 'O lone pair combination — the second degenerate non-bonding π_g orbital.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 4.45, c:  0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: -0.707 },
        ],
      },
    ],
  },

  // ─── KOH — Potassium Hydroxide (K, O, H) ───
  'KOH': {
    notes: 'Strong base widely used in industry. Extremely hygroscopic. Called caustic potash.',
    orbitals: [
      {
        name: 'σ (O-H bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'σ bonding between O 2p and H 1s — covalent O-H bond within the hydroxide ion.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.55 },
        ],
      },
      {
        name: 'O 2px (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        energy: 2, desc: 'Oxygen lone pair perpendicular to the O-H bond axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        energy: 3, desc: 'Second oxygen lone pair directed along the K-O axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2s',
        type: 'core',
        electrons: 2,
        energy: 4, desc: 'Oxygen inner 2s orbital — core electron pair.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  // ─── HgCl₂ — Mercuric Chloride (Hg, Cl, Cl) ───
  'HgCl₂': {
    notes: 'Highly toxic mercury compound. Linear gas-phase geometry. Once used as a disinfectant (corrosive sublimate).',
    orbitals: [
      {
        name: 'σg (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Symmetric σ bonding — Hg 6s combines with both Cl 3p orbitals in phase.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 3.30, c: 0.40 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.60 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.60 },
        ],
      },
      {
        name: 'σu (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Antisymmetric σ bonding — Cl 3p orbitals out of phase with Hg contribution.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.707 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: -0.707 },
        ],
      },
      {
        name: 'Cl 3py (lone pair, 1)',
        type: 'nonbonding',
        electrons: 2,
        energy: 3, desc: 'Chlorine lone pair perpendicular to the molecular axis.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3py (lone pair, 2)',
        type: 'nonbonding',
        electrons: 2,
        energy: 4, desc: 'Second chlorine lone pair perpendicular to the molecular axis.',
        ao: [
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3pz (lone pair, 1)',
        type: 'nonbonding',
        electrons: 2,
        energy: 5, desc: 'Chlorine lone pair in the third direction.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3pz (lone pair, 2)',
        type: 'nonbonding',
        electrons: 2,
        energy: 6, desc: 'Second chlorine lone pair in the third direction.',
        ao: [
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
    ],
  },

  // ─── AuCl₃ — Gold(III) Chloride ───
  'AuCl₃': {
    notes: 'Important gold catalyst. Planar dimer in solid state. Strong Lewis acid used in organic synthesis.',
    orbitals: [
      {
        name: 'σ₁ (Au-Cl bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'σ bonding between Au 6s/5d and Cl 3p — first Au-Cl bond.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.20, c: 0.35 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.75 },
        ],
      },
      {
        name: 'σ₂ (Au-Cl bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'σ bonding — second Au-Cl bond.',
        ao: [
          { atom: 0, n: 5, l: 2, m: 2, zeff: 10.9, c: 0.40 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.75 },
        ],
      },
      {
        name: 'σ₃ (Au-Cl bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'σ bonding — third Au-Cl bond.',
        ao: [
          { atom: 0, n: 5, l: 2, m: -2, zeff: 10.9, c: 0.40 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.75 },
        ],
      },
      {
        name: 'Cl lone pairs (6e)',
        type: 'nonbonding',
        electrons: 6,
        energy: 4, desc: 'Combined chlorine lone pairs — six electrons in non-bonding p orbitals.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.577 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.577 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.577 },
        ],
      },
    ],
  },

  // ─── Al₂O₃ — Aluminum Oxide (Alumina) ───
  'Al₂O₃': {
    notes: 'Corundum structure — extremely hard. Sapphire and ruby are gem varieties. Critical industrial ceramic.',
    orbitals: [
      {
        name: 'σ₁ (Al-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'σ bonding between Al 3s/3p and O 2p — ionic/covalent character.',
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 3.50, c: 0.30 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.80 },
        ],
      },
      {
        name: 'σ₂ (Al-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second σ Al-O bond.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 3.50, c: 0.30 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.80 },
        ],
      },
      {
        name: 'σ₃ (Al-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third σ Al-O bond.',
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 3.50, c: 0.30 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.80 },
        ],
      },
      {
        name: 'O lone pairs (6e)',
        type: 'nonbonding',
        electrons: 6,
        energy: 4, desc: 'Oxygen lone pairs — remaining non-bonding electrons on the three oxygens.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ─── Fe₂O₃ — Iron(III) Oxide (Hematite) ───
  'Fe₂O₃': {
    notes: 'Hematite — the most important iron ore. Gives Mars its red color. Antiferromagnetic below Morin temperature.',
    orbitals: [
      {
        name: 'σ₁ (Fe-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'σ bonding between Fe 3d and O 2p — mixed ionic/covalent.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 6.25, c: 0.30 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.80 },
        ],
      },
      {
        name: 'σ₂ (Fe-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second σ Fe-O bond.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 3.75, c: 0.25 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.80 },
        ],
      },
      {
        name: 'σ₃ (Fe-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third σ Fe-O bond using the second Fe center.',
        ao: [
          { atom: 1, n: 3, l: 2, m: 0, zeff: 6.25, c: 0.30 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.80 },
        ],
      },
      {
        name: 'O lone pairs (6e)',
        type: 'nonbonding',
        electrons: 6,
        energy: 4, desc: 'Combined non-bonding oxygen lone pairs.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
        ],
      },
      {
        name: 'Fe d electrons (8e)',
        type: 'nonbonding',
        electrons: 8,
        energy: 5, desc: 'Localized Fe³⁺ d⁵ electrons — high-spin configuration causes paramagnetism.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -2, zeff: 6.25, c: 0.707 },
          { atom: 1, n: 3, l: 2, m: -2, zeff: 6.25, c: 0.707 },
        ],
      },
    ],
  },

  // ─── CaCO₃ — Calcium Carbonate ───
  'CaCO₃': {
    notes: 'Calcite/limestone — the most common carbonate mineral. Makes up chalk, marble, and coral reefs.',
    orbitals: [
      {
        name: 'σ₁ (C-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'σ bonding in the carbonate ion — C 2p and O 2p overlap.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.14, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₂ (C-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second C-O σ bond in the carbonate ion.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.14, c: 0.45 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₃ (C-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third C-O σ bond completing the carbonate framework.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.14, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'π (delocalized)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Delocalized π orbital across all three C-O bonds — gives carbonate its resonance stability.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.14, c: 0.40 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'O lone pairs (6e)',
        type: 'nonbonding',
        electrons: 6,
        energy: 5, desc: 'Non-bonding oxygen lone pairs in the carbonate anion.',
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ─── H₂SO₄ — Sulfuric Acid ───
  'H₂SO₄': {
    notes: 'The most produced industrial chemical globally. Strong diprotic acid. Used in batteries, fertilizers, refining.',
    orbitals: [
      {
        name: 'σ₁ (S=O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Double bond between S 3p and O 2p — the two S=O bonds give sulfuric acid its stability.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 5.48, c: 0.55 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₂ (S=O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second S=O double bond — symmetric partner.',
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 5.48, c: 0.55 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₃ (S-OH bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'S-O single bond to hydroxyl group — this proton is donated in acid reactions.',
        ao: [
          { atom: 0, n: 3, l: 0, m: 0, zeff: 5.48, c: 0.45 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₄ (S-OH bond)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Second S-OH bond — sulfuric acid is diprotic, both OH groups can donate protons.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 5.48, c: 0.45 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₅ (O-H bond)',
        type: 'bonding',
        electrons: 2,
        energy: 5, desc: 'O-H covalent bond in the first hydroxyl group.',
        ao: [
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.70 },
          { atom: 5, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.55 },
        ],
      },
      {
        name: 'σ₆ (O-H bond)',
        type: 'bonding',
        electrons: 2,
        energy: 6, desc: 'O-H covalent bond in the second hydroxyl group.',
        ao: [
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.70 },
          { atom: 6, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.55 },
        ],
      },
      {
        name: 'O lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
        energy: 7, desc: 'Lone pairs on the two S=O oxygens.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
        ],
      },
    ],
  },

  // ─── AgNO₃ — Silver Nitrate ───
  'AgNO₃': {
    notes: 'Key silver compound in photography. Cauterizing agent in medicine. Precursor for silver halides.',
    orbitals: [
      {
        name: 'σ (N-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'σ bonding in the nitrate ion — N 2sp² and O 2p overlap.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.83, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₂ (N-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second N-O σ bond in nitrate.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.83, c: 0.45 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₃ (N-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third N-O σ bond completing the nitrate framework.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.83, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'π (delocalized NO₃)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Delocalized π system across the nitrate ion — resonance stabilization.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.83, c: 0.40 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'O lone pairs (6e)',
        type: 'nonbonding',
        electrons: 6,
        energy: 5, desc: 'Non-bonding lone pairs on the three nitrate oxygens.',
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ─── BaTiO₃ — Barium Titanate ───
  'BaTiO₃': {
    notes: 'Classic ferroelectric perovskite. Piezoelectric — converts mechanical stress to electricity. Used in capacitors.',
    orbitals: [
      {
        name: 'σ₁ (Ti-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Ti 3d - O 2p σ bonding along the first Ti-O axis.',
        ao: [
          { atom: 1, n: 3, l: 2, m: 0, zeff: 7.60, c: 0.40 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'σ₂ (Ti-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Ti-O σ bonding in the second direction.',
        ao: [
          { atom: 1, n: 3, l: 2, m: 2, zeff: 7.60, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'σ₃ (Ti-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Ti-O σ bonding in the third direction.',
        ao: [
          { atom: 1, n: 4, l: 0, m: 0, zeff: 5.13, c: 0.35 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'O lone pairs (6e)',
        type: 'nonbonding',
        electrons: 6,
        energy: 4, desc: 'Combined non-bonding oxygen lone pairs in the TiO₃ octahedron.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ─── Pa₂O₅ — Protactinium Pentoxide ───
  'Pa₂O₅': {
    notes: 'Protactinium oxide — extremely rare and radioactive. Pa is one of the rarest natural elements on Earth.',
    orbitals: [
      {
        name: 'σ₁ (Pa-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Pa 6d - O 2p σ bonding — mixed ionic/covalent character.',
        ao: [
          { atom: 0, n: 6, l: 2, m: 0, zeff: 5.50, c: 0.25 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.82 },
        ],
      },
      {
        name: 'σ₂ (Pa-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second Pa-O bond.',
        ao: [
          { atom: 0, n: 7, l: 0, m: 0, zeff: 3.40, c: 0.20 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.82 },
        ],
      },
      {
        name: 'σ₃ (Pa-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third Pa-O bond using second Pa center.',
        ao: [
          { atom: 1, n: 6, l: 2, m: 0, zeff: 5.50, c: 0.25 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.82 },
        ],
      },
      {
        name: 'O lone pairs bridging (2e)',
        type: 'nonbonding',
        electrons: 2,
        energy: 4, desc: 'Bridging oxygen lone pair connecting the two Pa centers.',
        ao: [
          { atom: 5, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O lone pairs terminal (8e)',
        type: 'nonbonding',
        electrons: 8,
        energy: 5, desc: 'Terminal oxygen lone pairs on the four outer oxygens.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 6, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
    ],
  },

  // ─── In₂O₃ — Indium Oxide ───
  'In₂O₃': {
    notes: 'Transparent conducting oxide — the key ingredient in ITO (indium tin oxide) for touchscreens and LCDs.',
    orbitals: [
      {
        name: 'σ₁ (In-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'In 5s/5p and O 2p σ bonding — ionic character dominates.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 5.00, c: 0.25 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.82 },
        ],
      },
      {
        name: 'σ₂ (In-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second In-O bond.',
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 5.00, c: 0.25 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.82 },
        ],
      },
      {
        name: 'σ₃ (In-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third In-O bond from the second In center.',
        ao: [
          { atom: 1, n: 5, l: 0, m: 0, zeff: 5.00, c: 0.25 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.82 },
        ],
      },
      {
        name: 'O lone pairs (6e)',
        type: 'nonbonding',
        electrons: 6,
        energy: 4, desc: 'Non-bonding oxygen lone pairs.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ─── BaSO₄ — Barium Sulfate ───
  'BaSO₄': {
    notes: 'Extremely insoluble salt. Used as "barium meal" in X-ray imaging of the GI tract. Also white pigment (blanc fixe).',
    orbitals: [
      {
        name: 'σ₁ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'S 3p - O 2p σ bonding in the sulfate tetrahedron.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 1, zeff: 5.48, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₂ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second S-O bond.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 5.48, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₃ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third S-O bond.',
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 5.48, c: 0.45 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₄ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Fourth S-O bond completing the tetrahedral sulfate.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 5.48, c: 0.50 },
          { atom: 5, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'O lone pairs (8e)',
        type: 'nonbonding',
        electrons: 8,
        energy: 5, desc: 'Non-bonding lone pairs on all four sulfate oxygens.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 5, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
    ],
  },

  // ─── FeSO₄ — Iron(II) Sulfate ───
  'FeSO₄': {
    notes: 'Green vitriol — used in water treatment, iron supplements, and ink making since antiquity.',
    orbitals: [
      {
        name: 'σ₁ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'S-O σ bonding in the sulfate tetrahedron.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 1, zeff: 5.48, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₂ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second S-O bond.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 5.48, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₃ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third S-O bond.',
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 5.48, c: 0.45 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₄ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Fourth S-O bond completing the sulfate tetrahedron.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 5.48, c: 0.50 },
          { atom: 5, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'O lone pairs (8e)',
        type: 'nonbonding',
        electrons: 8,
        energy: 5, desc: 'Non-bonding lone pairs on sulfate oxygens.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 5, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'Fe 3d (6e)',
        type: 'nonbonding',
        electrons: 6,
        energy: 6, desc: 'Fe²⁺ d⁶ electrons — localized on iron in high-spin configuration.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -2, zeff: 6.25, c: 0.707 },
          { atom: 0, n: 3, l: 2, m: 0, zeff: 6.25, c: 0.707 },
        ],
      },
    ],
  },

  // ─── NiSO₄ — Nickel Sulfate ───
  'NiSO₄': {
    notes: 'Green crystalline salt — primary nickel source for electroplating. Also used in nickel-cadmium batteries.',
    orbitals: [
      {
        name: 'σ₁ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'S-O σ bonding in the sulfate tetrahedron.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 1, zeff: 5.48, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₂ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second S-O bond.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 5.48, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₃ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third S-O bond.',
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 5.48, c: 0.45 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₄ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Fourth S-O bond.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 5.48, c: 0.50 },
          { atom: 5, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'O lone pairs (8e)',
        type: 'nonbonding',
        electrons: 8,
        energy: 5, desc: 'Non-bonding lone pairs on the four sulfate oxygens.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 5, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'Ni 3d (8e)',
        type: 'nonbonding',
        electrons: 8,
        energy: 6, desc: 'Ni²⁺ d⁸ electrons — paramagnetic configuration gives the green color.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -1, zeff: 7.64, c: 0.707 },
          { atom: 0, n: 3, l: 2, m: 1, zeff: 7.64, c: 0.707 },
        ],
      },
    ],
  },

  // ─── CuSO₄ — Copper(II) Sulfate ───
  'CuSO₄': {
    notes: 'Blue vitriol — vivid blue crystals when hydrated. Used in agriculture (Bordeaux mixture), electroplating, and as a fungicide.',
    orbitals: [
      {
        name: 'σ₁ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'S-O σ bonding in the sulfate tetrahedron.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 1, zeff: 5.48, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₂ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second S-O bond.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 5.48, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₃ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third S-O bond.',
        ao: [
          { atom: 1, n: 3, l: 0, m: 0, zeff: 5.48, c: 0.45 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₄ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Fourth S-O bond.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 5.48, c: 0.50 },
          { atom: 5, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'O lone pairs (8e)',
        type: 'nonbonding',
        electrons: 8,
        energy: 5, desc: 'Non-bonding lone pairs on sulfate oxygens.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 5, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'Cu 3d (9e)',
        type: 'nonbonding',
        electrons: 9,
        energy: 6, desc: 'Cu²⁺ d⁹ — single unpaired electron causes the characteristic blue color and paramagnetism.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 2, zeff: 7.73, c: 1.0 },
        ],
      },
    ],
  },

  // ─── Tl₂SO₄ — Thallium(I) Sulfate ───
  'Tl₂SO₄': {
    notes: 'Extremely toxic thallium salt — once used as rat poison. Odorless, tasteless, and colorless in solution, making it notoriously dangerous.',
    orbitals: [
      {
        name: 'σ₁ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'S-O σ bonding in the sulfate tetrahedron.',
        ao: [
          { atom: 2, n: 3, l: 1, m: 1, zeff: 5.48, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₂ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second S-O bond.',
        ao: [
          { atom: 2, n: 3, l: 1, m: -1, zeff: 5.48, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₃ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third S-O bond.',
        ao: [
          { atom: 2, n: 3, l: 0, m: 0, zeff: 5.48, c: 0.45 },
          { atom: 5, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₄ (S-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Fourth S-O bond.',
        ao: [
          { atom: 2, n: 3, l: 1, m: 0, zeff: 5.48, c: 0.50 },
          { atom: 6, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'O lone pairs (8e)',
        type: 'nonbonding',
        electrons: 8,
        energy: 5, desc: 'Non-bonding lone pairs on sulfate oxygens.',
        ao: [
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 5, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 6, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
    ],
  },

  // ─── SrCO₃ — Strontium Carbonate ───
  'SrCO₃': {
    notes: 'Primary strontium source mineral (strontianite). Used in fireworks (crimson red flame) and CRT glass.',
    orbitals: [
      {
        name: 'σ₁ (C-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'C-O σ bonding in the carbonate ion.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 3.14, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₂ (C-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second C-O σ bond.',
        ao: [
          { atom: 1, n: 2, l: 0, m: 0, zeff: 3.14, c: 0.45 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₃ (C-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third C-O σ bond completing the carbonate.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 3.14, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'π (delocalized CO₃)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Delocalized π orbital — resonance gives all three C-O bonds equal character.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 3.14, c: 0.40 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'O lone pairs (6e)',
        type: 'nonbonding',
        electrons: 6,
        energy: 5, desc: 'Non-bonding oxygen lone pairs in the carbonate anion.',
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.577 },
        ],
      },
    ],
  },

  // ─── KMnO₄ — Potassium Permanganate ───
  'KMnO₄': {
    notes: 'Deep purple oxidizer used in water purification, wound cleaning, and organic chemistry. Strong enough to start fires with glycerol.',
    orbitals: [
      {
        name: 'σ₁ (Mn-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Mn 3d - O 2p σ bonding — first Mn-O bond in the tetrahedral permanganate.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 6.85, c: 0.40 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'σ₂ (Mn-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second Mn-O σ bond.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 2, zeff: 6.85, c: 0.40 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'σ₃ (Mn-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third Mn-O σ bond.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -2, zeff: 6.85, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'σ₄ (Mn-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Fourth Mn-O σ bond completing the tetrahedron.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 4.80, c: 0.35 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'π (Mn-O delocalized)',
        type: 'bonding',
        electrons: 2,
        energy: 5, desc: 'Delocalized π bonding across MnO₄⁻ — Mn d orbitals overlap with O p orbitals. Responsible for the intense purple color.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 1, zeff: 6.85, c: 0.35 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'O lone pairs (8e)',
        type: 'nonbonding',
        electrons: 8,
        energy: 6, desc: 'Non-bonding oxygen lone pairs on the four permanganate oxygens.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.50 },
        ],
      },
    ],
  },

  // ─── TcO₄⁻ — Pertechnetate Ion ───
  'TcO₄⁻': {
    notes: 'Technetium-99m pertechnetate — the most widely used radiopharmaceutical in nuclear medicine imaging.',
    orbitals: [
      {
        name: 'σ₁ (Tc-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Tc 4d - O 2p σ bonding in the tetrahedral pertechnetate.',
        ao: [
          { atom: 0, n: 4, l: 2, m: 0, zeff: 7.23, c: 0.40 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'σ₂ (Tc-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second Tc-O σ bond.',
        ao: [
          { atom: 0, n: 4, l: 2, m: 2, zeff: 7.23, c: 0.40 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'σ₃ (Tc-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third Tc-O σ bond.',
        ao: [
          { atom: 0, n: 4, l: 2, m: -2, zeff: 7.23, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'σ₄ (Tc-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Fourth Tc-O σ bond completing the tetrahedron.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 5.00, c: 0.35 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'O lone pairs (8e)',
        type: 'nonbonding',
        electrons: 8,
        energy: 5, desc: 'Non-bonding oxygen lone pairs.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
    ],
  },

  // ─── NaHCO₃ — Sodium Bicarbonate (Baking Soda) ───
  'NaHCO₃': {
    notes: 'Baking soda — among the most versatile household chemicals. Leavening agent, antacid, fire extinguisher, and cleaning agent.',
    orbitals: [
      {
        name: 'σ₁ (C-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'C-O σ bonding in the bicarbonate ion.',
        ao: [
          { atom: 2, n: 2, l: 1, m: 1, zeff: 3.14, c: 0.50 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₂ (C=O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'C=O double bond — the stronger of the C-O bonds.',
        ao: [
          { atom: 2, n: 2, l: 0, m: 0, zeff: 3.14, c: 0.45 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ₃ (C-OH bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'C-OH bond — the hydroxyl-bearing C-O bond.',
        ao: [
          { atom: 2, n: 2, l: 1, m: -1, zeff: 3.14, c: 0.50 },
          { atom: 5, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'σ (O-H bond)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'O-H covalent bond in the bicarbonate.',
        ao: [
          { atom: 5, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.70 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.55 },
        ],
      },
      {
        name: 'O lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
        energy: 5, desc: 'Non-bonding lone pairs on C=O and C-O oxygens.',
        ao: [
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
        ],
      },
    ],
  },

  // ─── Co₃O₄ — Cobalt(II,III) Oxide ───
  'Co₃O₄': {
    notes: 'Spinel-structured mixed-valence oxide. Black pigment used since antiquity for blue glass. Important battery cathode material.',
    orbitals: [
      {
        name: 'σ₁ (Co-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Co 3d - O 2p σ bonding in the spinel lattice.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 7.05, c: 0.35 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'σ₂ (Co-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second Co-O bond from the Co³⁺ site.',
        ao: [
          { atom: 1, n: 3, l: 2, m: 2, zeff: 7.05, c: 0.35 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'σ₃ (Co-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Third Co-O bond from the Co²⁺ site.',
        ao: [
          { atom: 2, n: 3, l: 2, m: 0, zeff: 7.05, c: 0.35 },
          { atom: 5, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'O lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
        energy: 4, desc: 'Non-bonding oxygen lone pairs.',
        ao: [
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 5, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
          { atom: 6, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.50 },
        ],
      },
      {
        name: 'Co d electrons (mixed)',
        type: 'nonbonding',
        electrons: 6,
        energy: 5, desc: 'Mixed Co²⁺(d⁷)/Co³⁺(d⁶) d electrons — the mixed valence state gives magnetic properties.',
        ao: [
          { atom: 0, n: 3, l: 2, m: -1, zeff: 7.05, c: 0.577 },
          { atom: 1, n: 3, l: 2, m: -1, zeff: 7.05, c: 0.577 },
          { atom: 2, n: 3, l: 2, m: -1, zeff: 7.05, c: 0.577 },
        ],
      },
    ],
  },

  // ─── PtCl₂(NH₃)₂ — Cisplatin ───
  'PtCl₂(NH₃)₂': {
    notes: 'Cisplatin — revolutionary anticancer drug. Cross-links DNA to kill rapidly dividing cancer cells. One of the most important drugs in oncology.',
    orbitals: [
      {
        name: 'σ₁ (Pt-N bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Pt 5d - N 2p σ bonding — the Pt-NH₃ dative bond, amine donates lone pair to Pt.',
        ao: [
          { atom: 0, n: 5, l: 2, m: 2, zeff: 8.85, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 3.83, c: 0.70 },
        ],
      },
      {
        name: 'σ₂ (Pt-N bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second Pt-NH₃ dative bond — trans to the first.',
        ao: [
          { atom: 0, n: 5, l: 2, m: -2, zeff: 8.85, c: 0.40 },
          { atom: 4, n: 2, l: 1, m: 1, zeff: 3.83, c: 0.70 },
        ],
      },
      {
        name: 'σ₃ (Pt-Cl bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Pt-Cl bond — chloride is labile and can be displaced by DNA purine bases.',
        ao: [
          { atom: 0, n: 5, l: 2, m: 0, zeff: 8.85, c: 0.35 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.75 },
        ],
      },
      {
        name: 'σ₄ (Pt-Cl bond)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Second Pt-Cl bond — both chlorides leave during DNA cross-linking.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 4.40, c: 0.30 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.75 },
        ],
      },
      {
        name: 'Cl lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
        energy: 5, desc: 'Chloride non-bonding lone pairs — perpendicular to Pt-Cl bonds.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: 'Pt 5d (filled, 6e)',
        type: 'nonbonding',
        electrons: 6,
        energy: 6, desc: 'Filled Pt²⁺ d⁸ non-bonding orbitals — three of the four remaining d pairs.',
        ao: [
          { atom: 0, n: 5, l: 2, m: -1, zeff: 8.85, c: 0.707 },
          { atom: 0, n: 5, l: 2, m: 1, zeff: 8.85, c: 0.707 },
        ],
      },
    ],
  },

  // ─── K₂Cr₂O₇ — Potassium Dichromate ───
  'K₂Cr₂O₇': {
    notes: 'Powerful oxidizing agent — bright orange crystals. Carcinogenic. Used in leather tanning, wood staining, and as analytical reagent.',
    orbitals: [
      {
        name: 'σ₁ (Cr-O terminal)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Cr=O σ bonding to a terminal oxygen on the first CrO₃ unit.',
        ao: [
          { atom: 0, n: 3, l: 2, m: 0, zeff: 6.77, c: 0.40 },
          { atom: 3, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'σ₂ (Cr-O terminal)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Cr=O σ bonding on the second CrO₃ unit.',
        ao: [
          { atom: 1, n: 3, l: 2, m: 0, zeff: 6.77, c: 0.40 },
          { atom: 5, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'σ (Cr-O-Cr bridge)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Bridging oxygen connecting the two CrO₃ units — the Cr-O-Cr linkage.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 4.72, c: 0.30 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.55 },
          { atom: 1, n: 4, l: 0, m: 0, zeff: 4.72, c: 0.30 },
        ],
      },
      {
        name: 'O lone pairs (terminal)',
        type: 'nonbonding',
        electrons: 8,
        energy: 4, desc: 'Non-bonding lone pairs on the six terminal oxygens.',
        ao: [
          { atom: 3, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.408 },
          { atom: 4, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.408 },
          { atom: 7, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.408 },
          { atom: 5, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.408 },
          { atom: 6, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.408 },
          { atom: 8, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.408 },
        ],
      },
    ],
  },

  // ─── BeH₂ — Beryllium Hydride ───
  'BeH₂': {
    notes: 'Classic sp-hybridized molecule. Linear geometry with two equivalent Be-H bonds.',
    orbitals: [
      {
        name: '1σg (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Symmetric σ bonding — Be 2s combines with both H 1s in phase.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 1.66, c: 0.45 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.55 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.55 },
        ],
      },
      {
        name: '1σu (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Antisymmetric σ bonding — Be 2p mixes with out-of-phase H combination.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 1.66, c: 0.50 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.55 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.00, c: -0.55 },
        ],
      },
    ],
  },

  // ─── Na₂O — Sodium Oxide ───
  'Na₂O': {
    notes: 'Antifluorite structure in solid. Extremely strong base — important in glass formulation.',
    orbitals: [
      {
        name: 'σg (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Symmetric σ bonding — O 2p combines with both Na 3s in phase. Strongly ionic.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.85 },
          { atom: 0, n: 3, l: 0, m: 0, zeff: 2.20, c: 0.10 },
          { atom: 2, n: 3, l: 0, m: 0, zeff: 2.20, c: 0.10 },
        ],
      },
      {
        name: 'O 2px (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        energy: 2, desc: 'Oxygen lone pair perpendicular to the molecular axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        energy: 3, desc: 'Second oxygen lone pair perpendicular to the molecular axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  // ─── K₂O — Potassium Oxide ───
  'K₂O': {
    notes: 'Strongly ionic alkali oxide. Important glass-forming component (potash). Reacts violently with water.',
    orbitals: [
      {
        name: 'σg (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'O 2p dominant σ bond — nearly pure ionic character with K.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.90 },
          { atom: 0, n: 4, l: 0, m: 0, zeff: 2.26, c: 0.06 },
          { atom: 2, n: 4, l: 0, m: 0, zeff: 2.26, c: 0.06 },
        ],
      },
      {
        name: 'O 2px (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        energy: 2, desc: 'Oxygen lone pair.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        energy: 3, desc: 'Second oxygen lone pair.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  // ─── GeH₄ — Germane ───
  'GeH₄': {
    notes: 'Isoelectronic to methane and silane. Tetrahedral (Td) symmetry. Key precursor for germanium thin films.',
    orbitals: [
      {
        name: '1a₁ (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Totally symmetric bonding — Ge 4s mixes with all four H 1s in phase.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 5.01, c: 0.40 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.45 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.45 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.45 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.45 },
        ],
      },
      {
        name: '1t₂x (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Triply degenerate bonding — Ge 4px overlaps with appropriate H combination.',
        ao: [
          { atom: 0, n: 4, l: 1, m: 1, zeff: 5.01, c: 0.40 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.45 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.00, c: -0.45 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.00, c: -0.45 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.45 },
        ],
      },
      {
        name: '1t₂y (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Second t₂ component — Ge 4py direction.',
        ao: [
          { atom: 0, n: 4, l: 1, m: -1, zeff: 5.01, c: 0.40 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.45 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.45 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.00, c: -0.45 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.00, c: -0.45 },
        ],
      },
      {
        name: '1t₂z (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Third t₂ component — Ge 4pz direction.',
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 5.01, c: 0.40 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.45 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.00, c: -0.45 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.45 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.00, c: -0.45 },
        ],
      },
    ],
  },

  // ─── AsH₃ — Arsine ───
  'AsH₃': {
    notes: 'Extremely toxic — among the most dangerous industrial gases. Pyramidal like NH₃ but with wider bond angles.',
    orbitals: [
      {
        name: '3a₁ (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Symmetric σ bonding — As 4s mixes with in-phase H combination.',
        ao: [
          { atom: 0, n: 4, l: 0, m: 0, zeff: 5.67, c: 0.40 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.53 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.53 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.53 },
        ],
      },
      {
        name: '1e (bonding, a)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Degenerate e bonding — As 4p overlaps with H combination.',
        ao: [
          { atom: 0, n: 4, l: 1, m: 1, zeff: 5.67, c: 0.45 },
          { atom: 1, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.55 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.00, c: -0.275 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.00, c: -0.275 },
        ],
      },
      {
        name: '1e (bonding, b)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'Second degenerate e component.',
        ao: [
          { atom: 0, n: 4, l: 1, m: -1, zeff: 5.67, c: 0.45 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.50 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.00, c: -0.50 },
        ],
      },
      {
        name: '4a₁ (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        energy: 4, desc: 'As lone pair — directed upward from the pyramidal base. Gives AsH₃ its pyramidal shape.',
        ao: [
          { atom: 0, n: 4, l: 1, m: 0, zeff: 5.67, c: 0.80 },
          { atom: 0, n: 4, l: 0, m: 0, zeff: 5.67, c: 0.30 },
        ],
      },
    ],
  },

  // ─── SnCl₂ — Tin(II) Chloride ───
  'SnCl₂': {
    notes: 'Bent molecule due to lone pair on Sn. Stannous chloride is a versatile reducing agent.',
    orbitals: [
      {
        name: 'σ₁ (Sn-Cl bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Sn 5sp² - Cl 3p σ bonding.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.40, c: 0.30 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.75 },
        ],
      },
      {
        name: 'σ₂ (Sn-Cl bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second Sn-Cl bond.',
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 4.40, c: 0.30 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.75 },
        ],
      },
      {
        name: 'Sn lone pair',
        type: 'nonbonding',
        electrons: 2,
        energy: 3, desc: 'Stereochemically active Sn²⁺ lone pair — causes the bent geometry.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 4.40, c: 0.70 },
          { atom: 0, n: 5, l: 1, m: 0, zeff: 4.40, c: 0.50 },
        ],
      },
      {
        name: 'Cl lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
        energy: 4, desc: 'Chlorine non-bonding lone pairs.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
        ],
      },
    ],
  },

  // ─── TeO₂ — Tellurium Dioxide ───
  'TeO₂': {
    notes: 'Paratellurite crystal — exceptional acousto-optic properties. Bent geometry due to Te lone pair.',
    orbitals: [
      {
        name: 'σ₁ (Te=O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Te 5p - O 2p σ bonding.',
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 5.00, c: 0.40 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'σ₂ (Te=O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Second Te=O bond.',
        ao: [
          { atom: 0, n: 5, l: 1, m: -1, zeff: 5.00, c: 0.40 },
          { atom: 2, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.75 },
        ],
      },
      {
        name: 'Te lone pair',
        type: 'nonbonding',
        electrons: 2,
        energy: 3, desc: 'Active Te lone pair causing the bent molecular geometry.',
        ao: [
          { atom: 0, n: 5, l: 0, m: 0, zeff: 5.00, c: 0.80 },
          { atom: 0, n: 5, l: 1, m: 0, zeff: 5.00, c: 0.40 },
        ],
      },
      {
        name: 'O lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
        energy: 4, desc: 'Oxygen non-bonding lone pairs.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
          { atom: 2, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.707 },
        ],
      },
    ],
  },

  // ─── HgO — Mercury(II) Oxide ───
  'HgO': {
    notes: 'Priestley discovered oxygen in 1774 by heating this compound. Red (α) and yellow forms exist.',
    orbitals: [
      {
        name: '1σ (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Hg 6s - O 2p σ bonding. Significant covalent character despite being a metal oxide.',
        ao: [
          { atom: 0, n: 6, l: 0, m: 0, zeff: 3.30, c: 0.30 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.80 },
        ],
      },
      {
        name: '1π (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'Hg 5d - O 2p π bonding — weak but contributes to the double-bond character.',
        ao: [
          { atom: 0, n: 5, l: 2, m: 1, zeff: 10.0, c: 0.20 },
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 0.80 },
        ],
      },
      {
        name: 'O 2pz (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        energy: 3, desc: 'Oxygen lone pair along the perpendicular axis.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  // ─── NOCl — Nitrosyl Chloride ───
  'NOCl': {
    notes: 'Bent molecule (113° ONcl angle). Important reagent and intermediate in industrial chemistry.',
    orbitals: [
      {
        name: 'σ (N=O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'N-O σ bonding — the strong N=O double bond.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.83, c: 0.55 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.65 },
        ],
      },
      {
        name: 'π (N=O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'N-O π bonding component of the double bond.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.83, c: 0.55 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.55 },
        ],
      },
      {
        name: 'σ (N-Cl bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'N-Cl σ bonding — weaker single bond.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.83, c: 0.40 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.70 },
        ],
      },
      {
        name: 'Cl lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
        energy: 4, desc: 'Chlorine non-bonding lone pairs.',
        ao: [
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 2, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: 'O lone pair',
        type: 'nonbonding',
        electrons: 2,
        energy: 5, desc: 'Oxygen lone pair — directed away from the bond.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  // ─── COCl₂ — Phosgene ───
  'COCl₂': {
    notes: 'Extremely toxic — once a WWI chemical weapon. Now critical for polycarbonate plastics and isocyanate chemistry.',
    orbitals: [
      {
        name: 'σ (C=O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'C-O σ bonding — the strong C=O double bond.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.14, c: 0.50 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.70 },
        ],
      },
      {
        name: 'π (C=O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'C-O π bonding — π component of the carbonyl.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 0, zeff: 3.14, c: 0.50 },
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.60 },
        ],
      },
      {
        name: 'σ₁ (C-Cl bond)',
        type: 'bonding',
        electrons: 2,
        energy: 3, desc: 'First C-Cl σ bond.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.14, c: 0.40 },
          { atom: 2, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.70 },
        ],
      },
      {
        name: 'σ₂ (C-Cl bond)',
        type: 'bonding',
        electrons: 2,
        energy: 4, desc: 'Second C-Cl σ bond.',
        ao: [
          { atom: 0, n: 2, l: 1, m: -1, zeff: 3.14, c: 0.40 },
          { atom: 3, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.70 },
        ],
      },
      {
        name: 'Cl lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
        energy: 5, desc: 'Chlorine non-bonding lone pairs.',
        ao: [
          { atom: 2, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 3, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: 'O lone pair',
        type: 'nonbonding',
        electrons: 2,
        energy: 6, desc: 'Oxygen lone pair perpendicular to the molecular plane.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  // ─── CH₃OH — Methanol ───
  'CH₃OH': {
    notes: 'Simplest alcohol. Toxic — metabolized to formaldehyde and formic acid. Used as racing fuel and feedstock.',
    orbitals: [
      {
        name: 'σ (C-O bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'C-O σ bonding — the key functional group bond.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.14, c: 0.45 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 4.45, c: 0.65 },
        ],
      },
      {
        name: 'σ (O-H bond)',
        type: 'bonding',
        electrons: 2,
        energy: 2, desc: 'O-H bond — polar covalent, site of hydrogen bonding.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 4.45, c: 0.70 },
          { atom: 5, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.55 },
        ],
      },
      {
        name: 'σ (C-H bonds, 6e)',
        type: 'bonding',
        electrons: 6,
        energy: 3, desc: 'Three equivalent C-H bonds in the methyl group.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.14, c: 0.35 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.45 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.45 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.45 },
        ],
      },
      {
        name: 'O lone pair (a)',
        type: 'nonbonding',
        electrons: 2,
        energy: 4, desc: 'Oxygen lone pair — perpendicular to the C-O-H plane.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 4.45, c: 1.0 },
        ],
      },
    ],
  },

  // ─── CH₃Cl — Chloromethane ───
  'CH₃Cl': {
    notes: 'Methyl chloride — important industrial chemical. Ozone depleting substance. Tetrahedral geometry.',
    orbitals: [
      {
        name: 'σ (C-Cl bond)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'C-Cl σ bonding — polarized toward Cl due to electronegativity difference.',
        ao: [
          { atom: 0, n: 2, l: 1, m: 1, zeff: 3.14, c: 0.40 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.70 },
        ],
      },
      {
        name: 'σ (C-H bonds, 6e)',
        type: 'bonding',
        electrons: 6,
        energy: 2, desc: 'Three equivalent C-H bonds in the methyl group.',
        ao: [
          { atom: 0, n: 2, l: 0, m: 0, zeff: 3.14, c: 0.40 },
          { atom: 2, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.50 },
          { atom: 3, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.50 },
          { atom: 4, n: 1, l: 0, m: 0, zeff: 1.00, c: 0.50 },
        ],
      },
      {
        name: 'Cl lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
        energy: 3, desc: 'Chlorine non-bonding lone pairs.',
        ao: [
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
        ],
      },
    ],
  },

  // ─── ClF — Chlorine Monofluoride ───
  'ClF': {
    notes: 'Simplest interhalogen compound. Very reactive — used as a fluorinating agent.',
    orbitals: [
      {
        name: '1σ (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'Cl 3p - F 2p σ bonding along the bond axis.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.50 },
          { atom: 1, n: 2, l: 1, m: 1, zeff: 5.10, c: 0.65 },
        ],
      },
      {
        name: 'F 2px (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        energy: 2, desc: 'Fluorine lone pair perpendicular to bond.',
        ao: [
          { atom: 1, n: 2, l: 1, m: -1, zeff: 5.10, c: 1.0 },
        ],
      },
      {
        name: 'F 2py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        energy: 3, desc: 'Second fluorine lone pair perpendicular to bond.',
        ao: [
          { atom: 1, n: 2, l: 1, m: 0, zeff: 5.10, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3px (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        energy: 4, desc: 'Chlorine lone pair perpendicular to bond.',
        ao: [
          { atom: 0, n: 3, l: 1, m: -1, zeff: 6.12, c: 1.0 },
        ],
      },
      {
        name: 'Cl 3py (lone pair)',
        type: 'nonbonding',
        electrons: 2,
        energy: 5, desc: 'Second chlorine lone pair.',
        ao: [
          { atom: 0, n: 3, l: 1, m: 0, zeff: 6.12, c: 1.0 },
        ],
      },
    ],
  },

  // ─── ICl — Iodine Monochloride ───
  'ICl': {
    notes: 'Red-brown interhalogen compound. Used in Wijs solution for determining iodine values of fats.',
    orbitals: [
      {
        name: '1σ (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'I 5p - Cl 3p σ bonding along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 7.60, c: 0.45 },
          { atom: 1, n: 3, l: 1, m: 1, zeff: 6.12, c: 0.60 },
        ],
      },
      {
        name: 'Cl lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
        energy: 2, desc: 'Chlorine non-bonding lone pairs.',
        ao: [
          { atom: 1, n: 3, l: 1, m: -1, zeff: 6.12, c: 0.707 },
          { atom: 1, n: 3, l: 1, m: 0, zeff: 6.12, c: 0.707 },
        ],
      },
      {
        name: 'I lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
        energy: 3, desc: 'Iodine non-bonding lone pairs.',
        ao: [
          { atom: 0, n: 5, l: 1, m: -1, zeff: 7.60, c: 0.707 },
          { atom: 0, n: 5, l: 1, m: 0, zeff: 7.60, c: 0.707 },
        ],
      },
    ],
  },

  // ─── IBr — Iodine Monobromide ───
  'IBr': {
    notes: 'Dark-red interhalogen. Less stable than ICl — decomposes at higher temperatures.',
    orbitals: [
      {
        name: '1σ (bonding)',
        type: 'bonding',
        electrons: 2,
        energy: 1, desc: 'I 5p - Br 4p σ bonding along the bond axis.',
        ao: [
          { atom: 0, n: 5, l: 1, m: 1, zeff: 7.60, c: 0.50 },
          { atom: 1, n: 4, l: 1, m: 1, zeff: 7.85, c: 0.55 },
        ],
      },
      {
        name: 'Br lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
        energy: 2, desc: 'Bromine non-bonding lone pairs.',
        ao: [
          { atom: 1, n: 4, l: 1, m: -1, zeff: 7.85, c: 0.707 },
          { atom: 1, n: 4, l: 1, m: 0, zeff: 7.85, c: 0.707 },
        ],
      },
      {
        name: 'I lone pairs (4e)',
        type: 'nonbonding',
        electrons: 4,
        energy: 3, desc: 'Iodine non-bonding lone pairs.',
        ao: [
          { atom: 0, n: 5, l: 1, m: -1, zeff: 7.60, c: 0.707 },
          { atom: 0, n: 5, l: 1, m: 0, zeff: 7.60, c: 0.707 },
        ],
      },
    ],
  },
};
