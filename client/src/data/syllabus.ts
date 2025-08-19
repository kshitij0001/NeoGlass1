import type { SubjectData } from '@shared/schema';

export const NEET_SYLLABUS: SubjectData[] = [
  /* ----------------------------- PHYSICS ----------------------------- */
  {
    id: 'physics',
    name: 'Physics',
    chapters: [
      {
        id: 'phy-physical-world',
        name: 'Physical World & Measurement',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'physics-scope', name: 'Scope and Excitement of Physics', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-physical-world' },
          { id: 'units', name: 'Units, SI System & Conventions', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-physical-world' },
          { id: 'dimensions', name: 'Dimensions & Dimensional Analysis', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-physical-world' },
          { id: 'errors', name: 'Significant Figures & Error Analysis', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-physical-world' }
        ]
      },
      {
        id: 'phy-kin',
        name: 'Kinematics',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: '1d2d', name: '1D/2D Motion & Projectile', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-kin' },
          { id: 'rel-vel', name: 'Relative Velocity', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-kin' },
          { id: 'graphs', name: 'Motion Graphs Analysis', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-kin' },
          { id: 'equations', name: 'Kinematic Equations', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-kin' }
        ]
      },
      {
        id: 'phy-mech',
        name: 'Laws of Motion',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'newton-laws', name: "Newton's Laws & Free-Body Diagrams", difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-mech' },
          { id: 'friction', name: 'Friction & Inclined Planes', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-mech' },
          { id: 'circular', name: 'Circular Motion Basics', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-mech' },
          { id: 'momentum', name: 'Conservation of Momentum', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-mech' },
          { id: 'collision', name: 'Elastic and Inelastic Collisions', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-mech' }
        ]
      },
      {
        id: 'phy-wep',
        name: 'Work, Energy & Power',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'work', name: 'Work by Variable/Constant Force', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-wep' },
          { id: 'energy', name: 'Kinetic & Potential Energy', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-wep' },
          { id: 'cons-energy', name: 'Conservation of Mechanical Energy', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-wep' },
          { id: 'power', name: 'Power & Efficiency', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-wep' }
        ]
      },
      {
        id: 'phy-rot',
        name: 'System of Particles & Rotational Motion',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'cm', name: 'Center of Mass & Motion of CM', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-rot' },
          { id: 'torque', name: 'Torque & Angular Momentum', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-rot' },
          { id: 'i-of-m', name: 'Moment of Inertia & Theorems', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-rot' },
          { id: 'rolling', name: 'Rolling Motion', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-rot' }
        ]
      },
      {
        id: 'phy-grav',
        name: 'Gravitation',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'newton-grav', name: "Newton's Law of Gravitation", difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-grav' },
          { id: 'g-potential', name: 'Gravitational Field & Potential', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-grav' },
          { id: 'satellites', name: 'Satellites & Escape Velocity', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-grav' },
          { id: 'kepler', name: "Kepler's Laws & Orbits", difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-grav' }
        ]
      },
      {
        id: 'phy-bulk',
        name: 'Properties of Bulk Matter',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'elasticity', name: 'Elasticity & Stress-Strain', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-bulk' },
          { id: 'viscosity', name: 'Viscosity & Poiseuille Flow', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-bulk' },
          { id: 'st-surface', name: 'Surface Tension & Capillarity', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-bulk' },
          { id: 'fluid-mech', name: 'Fluid Dynamics & Bernoulli', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-bulk' }
        ]
      },
      {
        id: 'phy-thermal-prop',
        name: 'Thermal Properties of Matter',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'expansion', name: 'Thermal Expansion (L, A, V)', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-thermal-prop' },
          { id: 'calorimetry2', name: 'Calorimetry & Specific Heat', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-thermal-prop' },
          { id: 'change-state', name: 'Latent Heat & Change of State', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-thermal-prop' },
          { id: 'newton-cooling', name: "Newton's Law of Cooling", difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-thermal-prop' }
        ]
      },
      {
        id: 'phy-thermo',
        name: 'Thermodynamics',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'first-law', name: 'First Law of Thermodynamics', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-thermo' },
          { id: 'heat-engines', name: 'Heat Engines & Cycles', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-thermo' },
          { id: 'entropy', name: 'Entropy & Second Law', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-thermo' },
          { id: 'kinetic-theory', name: 'Kinetic Theory of Gases', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-thermo' },
          { id: 'heat-transfer', name: 'Heat Transfer Mechanisms', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-thermo' }
        ]
      },
      {
        id: 'phy-ktg',
        name: 'Kinetic Theory of Gases',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'molecular-model', name: 'Molecular Model & Assumptions', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-ktg' },
          { id: 'pressure-derivation', name: 'Pressure of Gas (Derivation)', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-ktg' },
          { id: 'rms', name: 'RMS, Most Probable, Average Speeds', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-ktg' },
          { id: 'dof', name: 'Degrees of Freedom & γ', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-ktg' }
        ]
      },
      {
        id: 'phy-osc',
        name: 'Oscillations',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'shm-basics', name: 'SHM Equation & Energy in SHM', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-osc' },
          { id: 'damped', name: 'Damped & Forced Oscillations', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-osc' },
          { id: 'resonance-osc', name: 'Resonance Curve', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-osc' }
        ]
      },
      {
        id: 'phy-waves',
        name: 'Waves',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'wave-prop', name: 'Wave Properties & Interference', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-waves' },
          { id: 'sound', name: 'Sound Waves & Doppler Effect', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-waves' },
          { id: 'resonance', name: 'Resonance & Standing Waves', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-waves' }
        ]
      },
      {
        id: 'phy-elecstat',
        name: 'Electrostatics',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'coulomb', name: "Coulomb's Law & Electric Field", difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-elecstat' },
          { id: 'gauss', name: "Gauss's Law & Applications", difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-elecstat' },
          { id: 'potential', name: 'Electric Potential & Capacitance', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-elecstat' },
          { id: 'capacitance', name: 'Capacitors & Dielectrics', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-elecstat' },
          { id: 'field-lines', name: 'Field Lines & Flux', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-elecstat' }
        ]
      },
      {
        id: 'phy-current-elec',
        name: 'Current Electricity',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'ohms', name: "Ohm's Law & Resistivity", difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-current-elec' },
          { id: 'circuits-net', name: 'Series/Parallel & Kirchhoff Laws', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-current-elec' },
          { id: 'wheatstone', name: 'Wheatstone Bridge & Meter Bridge', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-current-elec' },
          { id: 'potentiometer', name: 'Potentiometer Applications', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-current-elec' }
        ]
      },
      {
        id: 'phy-magnetism',
        name: 'Magnetic Effects of Current & Magnetism',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'biot-savart', name: 'Biot–Savart & Ampere Law', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-magnetism' },
          { id: 'lorentz', name: 'Lorentz Force & Cyclotron', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-magnetism' },
          { id: 'mag-materials', name: 'Magnetic Materials & Hysteresis', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-magnetism' }
        ]
      },
      {
        id: 'phy-emi-ac',
        name: 'Electromagnetic Induction & AC',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'faraday', name: "Faraday's Law & Lenz's Law", difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-emi-ac' },
          { id: 'self-mutual', name: 'Self & Mutual Induction', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-emi-ac' },
          { id: 'rlc', name: 'R-L-C Circuits & Resonance', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-emi-ac' },
          { id: 'transformers', name: 'Transformers & Power Transmission', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-emi-ac' }
        ]
      },
      {
        id: 'phy-emw',
        name: 'Electromagnetic Waves',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'maxwell', name: "Maxwell's Equations (Idea)", difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-emw' },
          { id: 'spectrum', name: 'EM Spectrum & Uses', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-emw' },
          { id: 'polarization-emw', name: 'Polarization & Wave Nature', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-emw' }
        ]
      },
      {
        id: 'phy-geo-optics',
        name: 'Geometrical Optics',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'reflection', name: 'Reflection & Mirrors', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-geo-optics' },
          { id: 'refraction', name: 'Refraction & Lenses', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-geo-optics' },
          { id: 'mirror-formula', name: 'Mirror/Lens Formula & Magnification', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-geo-optics' },
          { id: 'prisms', name: 'Prisms & Total Internal Reflection', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-geo-optics' },
          { id: 'optical-instruments', name: 'Microscope & Telescope', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-geo-optics' }
        ]
      },
      {
        id: 'phy-wave-optics',
        name: 'Wave Optics',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'huygens', name: "Huygens' Principle", difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-wave-optics' },
          { id: 'young', name: "Young's Double-Slit (YDSE)", difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-wave-optics' },
          { id: 'interference', name: 'Interference & Diffraction', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-wave-optics' },
          { id: 'diffraction', name: 'Diffraction & Resolving Power', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-wave-optics' },
          { id: 'polarization', name: 'Polarization of Light', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-wave-optics' }
        ]
      },
      {
        id: 'phy-dual',
        name: 'Dual Nature of Radiation & Matter',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'photoelectric', name: 'Photoelectric Effect', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-dual' },
          { id: 'de-broglie', name: 'de Broglie Wavelength', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-dual' },
          { id: 'photons', name: 'Photons & Einstein Equation', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-dual' }
        ]
      },
      {
        id: 'phy-atoms',
        name: 'Atoms',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'rutherford', name: 'Rutherford & Bohr Models', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-atoms' },
          { id: 'bohr', name: 'Bohr Model & Atomic Spectra', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-atoms' },
          { id: 'spectra', name: 'Atomic Spectra', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-atoms' }
        ]
      },
      {
        id: 'phy-nuclei',
        name: 'Nuclei',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'binding', name: 'Nuclear Binding Energy', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-nuclei' },
          { id: 'radioactivity', name: 'Radioactive Decay Laws', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-nuclei' },
          { id: 'nuclear', name: 'Nuclear Physics & Radioactivity', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-nuclei' },
          { id: 'fission-fusion', name: 'Fission & Fusion', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-nuclei' }
        ]
      },
      {
        id: 'phy-semi',
        name: 'Semiconductor Electronics',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'pn', name: 'p-n Junction & Diodes', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-semi' },
          { id: 'rectifiers', name: 'Rectifiers & Filters', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-semi' },
          { id: 'transistors', name: 'Transistor as Amplifier/Switch', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-semi' },
          { id: 'logic-gates', name: 'Logic Gates (Basic)', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-semi' },
          { id: 'semiconductor', name: 'Semiconductors & Devices', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-semi' }
        ]
      },
      {
        id: 'phy-comm',
        name: 'Communication Systems',
        difficulty: 'Medium',
        subjectId: 'physics',
        topics: [
          { id: 'elements-comm', name: 'Elements of a Communication System', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-comm' },
          { id: 'modulation', name: 'Need for Modulation & AM', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-comm' },
          { id: 'bandwidth', name: 'Bandwidth & Channel Capacity', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'phy-comm' }
        ]
      }
    ]
  },

  /* ---------------------------- CHEMISTRY ---------------------------- */
  {
    id: 'chemistry',
    name: 'Chemistry',
    chapters: [
      {
        id: 'chem-basic-concepts',
        name: 'Some Basic Concepts of Chemistry',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'mole', name: 'Mole Concept & Stoichiometry', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-basic-concepts' },
          { id: 'empirical', name: 'Empirical & Molecular Formulae', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-basic-concepts' },
          { id: 'limiting', name: 'Limiting Reagent & Yield', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-basic-concepts' }
        ]
      },
      {
        id: 'chem-atomic',
        name: 'Atomic Structure',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'electron-config', name: 'Electronic Configuration', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-atomic' },
          { id: 'quantum-numbers', name: 'Quantum Numbers', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-atomic' },
          { id: 'periodic-trends', name: 'Periodic Trends', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-atomic' },
          { id: 'chemical-bonding', name: 'Chemical Bonding Basics', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-atomic' }
        ]
      },
      {
        id: 'chem-periodicity',
        name: 'Classification & Periodicity',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'modern-periodic', name: 'Modern Periodic Table', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-periodicity' },
          { id: 'trends', name: 'Periodic Trends (IE, EN, AR)', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-periodicity' },
          { id: 'anomalies', name: 'Anomalies & Diagonal Relationship', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-periodicity' }
        ]
      },
      {
        id: 'chem-bonding',
        name: 'Chemical Bonding',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'ionic-bonding', name: 'Ionic Bonding & Lattice Energy', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-bonding' },
          { id: 'covalent-bonding', name: 'Covalent Bonding & VSEPR', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-bonding' },
          { id: 'molecular-orbital', name: 'Molecular Orbital Theory', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-bonding' },
          { id: 'intermolecular', name: 'Intermolecular Forces', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-bonding' }
        ]
      },
      {
        id: 'chem-states',
        name: 'States of Matter',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'gas-laws', name: 'Gas Laws & Kinetic Theory', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-states' },
          { id: 'liquid-state', name: 'Liquid State Properties', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-states' },
          { id: 'solid-state', name: 'Solid State & Crystal Lattices', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-states' },
          { id: 'phase-diagrams', name: 'Phase Diagrams', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-states' }
        ]
      },
      {
        id: 'chem-thermo',
        name: 'Chemical Thermodynamics',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'enthalpy', name: 'Enthalpy & Heat of Reaction', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-thermo' },
          { id: 'entropy-gibbs', name: 'Entropy & Gibbs Free Energy', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-thermo' },
          { id: 'spontaneity', name: 'Spontaneity & Equilibrium', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-thermo' },
          { id: 'calorimetry', name: 'Calorimetry & Heat Capacity', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-thermo' }
        ]
      },
      {
        id: 'chem-equilibrium',
        name: 'Chemical Equilibrium',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'equilibrium-constant', name: 'Equilibrium Constant & Le Chatelier', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-equilibrium' },
          { id: 'acid-base', name: 'Acid-Base Equilibrium', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-equilibrium' },
          { id: 'buffer', name: 'Buffer Solutions', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-equilibrium' },
          { id: 'solubility', name: 'Solubility Equilibrium', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-equilibrium' }
        ]
      },
      {
        id: 'chem-redox',
        name: 'Redox Reactions',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'oxidation-number', name: 'Oxidation Numbers & Balancing', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-redox' },
          { id: 'electrochemistry', name: 'Electrochemical Cells', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-redox' },
          { id: 'electrolysis', name: 'Electrolysis & Faraday Laws', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-redox' }
        ]
      },
      {
        id: 'chem-solutions',
        name: 'Solutions',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'conc-terms', name: 'Concentration Terms', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-solutions' },
          { id: 'raoult', name: "Raoult's Law & V.P.", difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-solutions' },
          { id: 'colligative', name: 'Colligative Properties', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-solutions' }
        ]
      },
      {
        id: 'chem-electrochem',
        name: 'Electrochemistry',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'nernst', name: 'Nernst Equation', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-electrochem' },
          { id: 'galvanic', name: 'Galvanic & Electrolytic Cells', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-electrochem' },
          { id: 'conductance', name: 'Molar Conductance & Kohlrausch', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-electrochem' }
        ]
      },
      {
        id: 'chem-kinetics',
        name: 'Chemical Kinetics',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'rate-law', name: 'Rate Law & Order of Reaction', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-kinetics' },
          { id: 'arrhenius', name: 'Arrhenius Equation & Ea', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-kinetics' },
          { id: 'half-life', name: 'Half-life for First Order', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-kinetics' }
        ]
      },
      {
        id: 'chem-surface',
        name: 'Surface Chemistry',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'adsorption', name: 'Adsorption & Freundlich Isotherm', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-surface' },
          { id: 'colloids', name: 'Colloids & Emulsions', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-surface' },
          { id: 'catalysis', name: 'Catalysis (Hetero/Homo)', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-surface' }
        ]
      },
      {
        id: 'chem-metallurgy',
        name: 'General Principles & Processes of Isolation of Elements',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'ore-conc', name: 'Ores & Concentration', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-metallurgy' },
          { id: 'reduction', name: 'Reduction & Ellingham', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-metallurgy' },
          { id: 'refining', name: 'Refining Methods', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-metallurgy' }
        ]
      },
      {
        id: 'chem-hydrogen',
        name: 'Hydrogen',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'hydrides', name: 'Hydrides & Water Chemistry', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-hydrogen' },
          { id: 'h2o2', name: 'Hydrogen Peroxide', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-hydrogen' }
        ]
      },
      {
        id: 'chem-sblock',
        name: 's-Block Elements (Alkali & Alkaline Earth)',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'group1', name: 'Group 1 Trends & Compounds', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-sblock' },
          { id: 'group2', name: 'Group 2 Trends & Compounds', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-sblock' },
          { id: 'anomalous-li-be', name: 'Anomalous Li & Be', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-sblock' }
        ]
      },
      {
        id: 'chem-pblock',
        name: 'p-Block Elements',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'group13-14', name: 'Groups 13 & 14', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-pblock' },
          { id: 'group15-16', name: 'Groups 15 & 16', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-pblock' },
          { id: 'group17-18', name: 'Halogens & Noble Gases', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-pblock' }
        ]
      },
      {
        id: 'chem-dfblock',
        name: 'd- and f-Block Elements',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'transition', name: 'Transition Metals & Properties', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-dfblock' },
          { id: 'lanthanoids', name: 'Lanthanides & Actinides', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-dfblock' },
          { id: 'color-cat', name: 'Colored Ions & Catalysis', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-dfblock' }
        ]
      },
      {
        id: 'chem-coordination',
        name: 'Coordination Compounds',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'nomenclature', name: 'Nomenclature & Isomerism', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-coordination' },
          { id: 'cbt-vbt', name: 'CFT/VBT & Magnetic Behaviour', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-coordination' },
          { id: 'stability', name: 'Stability & Applications', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-coordination' }
        ]
      },
      {
        id: 'chem-org-basics',
        name: 'Organic Chemistry – Basic Principles & Techniques',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'iupac', name: 'IUPAC Nomenclature', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-org-basics' },
          { id: 'isomerism', name: 'Isomerism & Stereochemistry', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-org-basics' },
          { id: 'inductive', name: 'Inductive & Resonance Effects', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-org-basics' },
          { id: 'mechanisms', name: 'Basic Reaction Mechanisms', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-org-basics' }
        ]
      },
      {
        id: 'chem-hydrocarbons',
        name: 'Hydrocarbons',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'alkanes', name: 'Alkanes: Preparation & Reactions', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-hydrocarbons' },
          { id: 'alkenes', name: 'Alkenes: Addition Reactions', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-hydrocarbons' },
          { id: 'alkynes', name: 'Alkynes: Triple Bond Chemistry', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-hydrocarbons' },
          { id: 'aromatics', name: 'Aromatic Hydrocarbons & Benzene', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-hydrocarbons' }
        ]
      },
      {
        id: 'chem-haloalkanes',
        name: 'Haloalkanes & Haloarenes',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'nucleophilic-sub', name: 'Nucleophilic Substitution (SN1/SN2)', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-haloalkanes' },
          { id: 'elimination', name: 'Elimination Reactions', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-haloalkanes' },
          { id: 'haloarenes', name: 'Haloarenes & Electrophilic Substitution', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-haloalkanes' }
        ]
      },
      {
        id: 'chem-alcohols-phenols',
        name: 'Alcohols, Phenols & Ethers',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'alcohol-prep', name: 'Alcohols: Preparation & Reactions', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-alcohols-phenols' },
          { id: 'phenols', name: 'Phenols: Acidity & Reactions', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-alcohols-phenols' },
          { id: 'ethers', name: 'Ethers: Williamson Synthesis', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-alcohols-phenols' }
        ]
      },
      {
        id: 'chem-carbonyl',
        name: 'Aldehydes, Ketones & Carboxylic Acids',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'aldehydes', name: 'Aldehydes: Nucleophilic Addition', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-carbonyl' },
          { id: 'ketones', name: 'Ketones & Carbonyl Tests', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-carbonyl' },
          { id: 'carboxylic-acids', name: 'Carboxylic Acids & Derivatives', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-carbonyl' }
        ]
      },
      {
        id: 'chem-amines',
        name: 'Amines',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'amine-prep', name: 'Amine Preparation & Basicity', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-amines' },
          { id: 'diazonium', name: 'Diazonium Salts & Reactions', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-amines' }
        ]
      },
      {
        id: 'chem-biomolecules',
        name: 'Biomolecules',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'carbohydrates', name: 'Carbohydrates: Mono/Disaccharides', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-biomolecules' },
          { id: 'proteins', name: 'Proteins & Amino Acids', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-biomolecules' },
          { id: 'nucleic-acids', name: 'Nucleic Acids & Vitamins', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-biomolecules' }
        ]
      },
      {
        id: 'chem-polymers',
        name: 'Polymers',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'classification', name: 'Classification & Types', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-polymers' },
          { id: 'polymerization', name: 'Addition & Condensation Polymerization', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-polymers' },
          { id: 'synthetic', name: 'Synthetic & Natural Polymers', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-polymers' }
        ]
      },
      {
        id: 'chem-everyday',
        name: 'Chemistry in Everyday Life',
        difficulty: 'Medium',
        subjectId: 'chemistry',
        topics: [
          { id: 'drugs', name: 'Drugs & Drug-Target Interaction', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-everyday' },
          { id: 'food-chem', name: 'Food Chemistry & Preservatives', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-everyday' },
          { id: 'cleansing', name: 'Cleansing Agents & Detergents', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'chem-everyday' }
        ]
      }
    ]
  },

  /* ----------------------------- BIOLOGY ----------------------------- */
  {
    id: 'biology',
    name: 'Biology',
    chapters: [
      {
        id: 'bio-diversity',
        name: 'Diversity in Living World',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'nomenclature', name: 'Taxonomy & Nomenclature', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-diversity' },
          { id: 'five-kingdom', name: 'Five Kingdom Classification', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-diversity' },
          { id: 'monera-protist-fungi', name: 'Monera, Protista, Fungi', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-diversity' },
          { id: 'plantae-animalia', name: 'Plantae & Animalia Overview', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-diversity' }
        ]
      },
      {
        id: 'bio-plant-kingdom',
        name: 'Plant Kingdom',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'algae-bryo', name: 'Algae & Bryophytes', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-plant-kingdom' },
          { id: 'pterido', name: 'Pteridophytes', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-plant-kingdom' },
          { id: 'gymno-angio', name: 'Gymnosperms & Angiosperms', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-plant-kingdom' }
        ]
      },
      {
        id: 'bio-animal-kingdom',
        name: 'Animal Kingdom',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'non-chordates', name: 'Non-chordates (Porifera to Echinodermata)', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-animal-kingdom' },
          { id: 'chordates', name: 'Chordates & Vertebrates', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-animal-kingdom' },
          { id: 'basis-class', name: 'Basis of Classification', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-animal-kingdom' }
        ]
      },
      {
        id: 'bio-struct-org-plants',
        name: 'Structural Organisation in Plants',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'morphology', name: 'Morphology of Flowering Plants', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-struct-org-plants' },
          { id: 'anatomy', name: 'Anatomy of Flowering Plants', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-struct-org-plants' },
          { id: 'tissues', name: 'Plant Tissues & Tissue Systems', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-struct-org-plants' }
        ]
      },
      {
        id: 'bio-struct-org-animals',
        name: 'Structural Organisation in Animals',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'animal-tissues', name: 'Animal Tissues', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-struct-org-animals' },
          { id: 'cockroach-frog', name: 'Cockroach/Frog Anatomy (overview)', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-struct-org-animals' }
        ]
      },
      {
        id: 'bio-cell-structure',
        name: 'Cell: Structure & Function',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'prok-euk', name: 'Prokaryotic vs Eukaryotic', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-cell-structure' },
          { id: 'organelles', name: 'Cell Organelles & Functions', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-cell-structure' },
          { id: 'chromosomes', name: 'Chromosomes & Chromatin', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-cell-structure' }
        ]
      },
      {
        id: 'bio-biomolecules',
        name: 'Biomolecules',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'proteins-enzymes', name: 'Proteins & Enzyme Kinetics', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biomolecules' },
          { id: 'carbs-lipids', name: 'Carbohydrates & Lipids', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biomolecules' },
          { id: 'nucleic-acids', name: 'Nucleic Acids & Structure', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biomolecules' }
        ]
      },
      {
        id: 'bio-cell-cycle',
        name: 'Cell Cycle & Cell Division',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'cell-cycle-2', name: 'Cell Cycle & Checkpoints', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-cell-cycle' },
          { id: 'mitosis', name: 'Mitosis & Meiosis', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-cell-cycle' },
          { id: 'significance', name: 'Significance of Cell Division', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-cell-cycle' }
        ]
      },
      {
        id: 'bio-plant-physiology',
        name: 'Plant Physiology',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'transport', name: 'Transport in Plants', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-plant-physiology' },
          { id: 'mineral-nutrition', name: 'Mineral Nutrition', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-plant-physiology' },
          { id: 'photosynthesis', name: 'Photosynthesis', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-plant-physiology' },
          { id: 'respiration', name: 'Respiration in Plants', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-plant-physiology' },
          { id: 'plant-growth', name: 'Plant Growth & Hormones', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-plant-physiology' }
        ]
      },
      {
        id: 'bio-human-physiology',
        name: 'Human Physiology',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'digestion', name: 'Digestion & Absorption', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-human-physiology' },
          { id: 'respiration', name: 'Breathing & Respiration', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-human-physiology' },
          { id: 'circulation', name: 'Body Fluids & Circulation', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-human-physiology' },
          { id: 'excretion', name: 'Excretory Products & Elimination', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-human-physiology' },
          { id: 'locomotion', name: 'Locomotion & Movement', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-human-physiology' },
          { id: 'neural', name: 'Neural Control & Coordination', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-human-physiology' },
          { id: 'endo', name: 'Chemical Coordination & Integration', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-human-physiology' }
        ]
      },
      {
        id: 'bio-reproduction',
        name: 'Reproduction',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'repro-organisms', name: 'Reproduction in Organisms', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-reproduction' },
          { id: 'flowers', name: 'Sexual Reproduction in Flowering Plants', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-reproduction' },
          { id: 'human-repro', name: 'Human Reproduction', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-reproduction' },
          { id: 'repro-health', name: 'Reproductive Health', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-reproduction' }
        ]
      },
      {
        id: 'bio-plant-repro',
        name: 'Reproduction in Flowering Plants',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'flower-structure', name: 'Flower Structure & Micro/Megasporogenesis', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-plant-repro' },
          { id: 'pollination', name: 'Pollination & Double Fertilisation', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-plant-repro' },
          { id: 'seed-fruit', name: 'Seed & Fruit Development', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-plant-repro' }
        ]
      },
      {
        id: 'bio-human-repro',
        name: 'Human Reproduction',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'male-female', name: 'Male & Female Reproductive Systems', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-human-repro' },
          { id: 'gametogenesis', name: 'Gametogenesis & Menstrual Cycle', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-human-repro' },
          { id: 'fertilisation', name: 'Fertilisation & Implantation', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-human-repro' },
          { id: 'pregnancy-lact', name: 'Pregnancy & Lactation', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-human-repro' }
        ]
      },
      {
        id: 'bio-repro-health',
        name: 'Reproductive Health',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'contraception', name: 'Contraceptive Methods', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-repro-health' },
          { id: 'std', name: 'Sexually Transmitted Diseases', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-repro-health' },
          { id: 'infertility', name: 'Infertility & ART (IVF etc.)', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-repro-health' }
        ]
      },
      {
        id: 'bio-heredity',
        name: 'Principles of Inheritance & Variation',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'mendel', name: 'Mendelian Inheritance & Laws', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-heredity' },
          { id: 'linkage', name: 'Linkage & Recombination', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-heredity' },
          { id: 'pedigree', name: 'Pedigree Analysis', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-heredity' },
          { id: 'genetic-disorders', name: 'Genetic Disorders', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-heredity' }
        ]
      },
      {
        id: 'bio-molecular-basis',
        name: 'Molecular Basis of Inheritance',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'dna-structure', name: 'DNA Structure & Replication', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-molecular-basis' },
          { id: 'transcription', name: 'Transcription & Translation', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-molecular-basis' },
          { id: 'regulation', name: 'Gene Regulation (Lac Operon)', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-molecular-basis' }
        ]
      },
      {
        id: 'bio-evolution',
        name: 'Evolution',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'origin-of-life', name: 'Origin of Life', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-evolution' },
          { id: 'evidence-evolution', name: 'Evidence for Evolution', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-evolution' },
          { id: 'natural-selection', name: 'Natural Selection & Adaptation', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-evolution' },
          { id: 'speciation', name: 'Speciation & Reproductive Isolation', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-evolution' },
          { id: 'human-evolution', name: 'Human Evolution', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-evolution' }
        ]
      },
      {
        id: 'bio-health-disease',
        name: 'Health & Disease',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'pathogens', name: 'Pathogens & Immune System', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-health-disease' },
          { id: 'immunity', name: 'Innate & Acquired Immunity', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-health-disease' },
          { id: 'immunization', name: 'Vaccination & Immunization', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-health-disease' },
          { id: 'allergies', name: 'Allergies & Autoimmunity', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-health-disease' },
          { id: 'cancer-aids', name: 'Cancer & AIDS', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-health-disease' }
        ]
      },
      {
        id: 'bio-food-production',
        name: 'Improvement in Food Production',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'plant-breeding', name: 'Plant Breeding & Crop Improvement', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-food-production' },
          { id: 'animal-husbandry', name: 'Animal Husbandry', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-food-production' },
          { id: 'tissue-culture', name: 'Plant Tissue Culture', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-food-production' }
        ]
      },
      {
        id: 'bio-microbes-welfare',
        name: 'Microbes in Human Welfare',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'microbes-food', name: 'Microbes in Food Production', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-microbes-welfare' },
          { id: 'industrial-microbes', name: 'Industrial Products & Microbes', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-microbes-welfare' },
          { id: 'sewage-treatment', name: 'Sewage Treatment', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-microbes-welfare' },
          { id: 'biogas', name: 'Biogas & Energy Production', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-microbes-welfare' }
        ]
      },
      {
        id: 'bio-biotechnology',
        name: 'Biotechnology',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'recombinant-dna', name: 'Recombinant DNA Technology', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biotechnology' },
          { id: 'gene-therapy', name: 'Gene Therapy & Cloning', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biotechnology' },
          { id: 'pcr-sequencing', name: 'PCR & DNA Sequencing', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biotechnology' },
          { id: 'biotech-applications', name: 'Biotechnology Applications', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biotechnology' },
          { id: 'bioethics', name: 'Bioethics & Safety', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biotechnology' }
        ]
      },
      {
        id: 'bio-biotech-principles',
        name: 'Biotechnology: Principles & Processes',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'genetic-engineering', name: 'Genetic Engineering & Tools', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biotech-principles' },
          { id: 'cloning-vectors', name: 'Cloning Vectors & Host Systems', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biotech-principles' },
          { id: 'competent-host', name: 'Competent Host & Transformation', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biotech-principles' }
        ]
      },
      {
        id: 'bio-biotech-applications',
        name: 'Biotechnology & its Applications',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'gm-crops', name: 'GM Crops & Transgenic Plants', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biotech-applications' },
          { id: 'gene-therapy-apps', name: 'Gene Therapy Applications', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biotech-applications' },
          { id: 'molecular-diagnosis', name: 'Molecular Diagnosis', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biotech-applications' }
        ]
      },
      {
        id: 'bio-ecology',
        name: 'Ecology',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'ecosystem', name: 'Ecosystem Structure & Function', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-ecology' },
          { id: 'population-ecology', name: 'Population Ecology', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-ecology' },
          { id: 'community-ecology', name: 'Community Interactions', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-ecology' },
          { id: 'biodiversity', name: 'Biodiversity & Conservation', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-ecology' },
          { id: 'environmental-issues', name: 'Environmental Issues', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-ecology' }
        ]
      },
      {
        id: 'bio-organisms-populations',
        name: 'Organisms & Populations',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'abiotic-factors', name: 'Abiotic Factors & Adaptations', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-organisms-populations' },
          { id: 'population-attributes', name: 'Population Attributes', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-organisms-populations' },
          { id: 'population-growth', name: 'Population Growth Models', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-organisms-populations' },
          { id: 'life-history', name: 'Life History Variations', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-organisms-populations' }
        ]
      },
      {
        id: 'bio-ecosystem',
        name: 'Ecosystem',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'energy-flow', name: 'Energy Flow & Productivity', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-ecosystem' },
          { id: 'nutrient-cycling', name: 'Nutrient Cycling (C, P, N)', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-ecosystem' },
          { id: 'ecological-pyramids', name: 'Ecological Pyramids', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-ecosystem' },
          { id: 'ecological-succession', name: 'Ecological Succession', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-ecosystem' }
        ]
      },
      {
        id: 'bio-biodiversity',
        name: 'Biodiversity & Conservation',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'biodiversity-patterns', name: 'Biodiversity Patterns & Importance', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biodiversity' },
          { id: 'loss-causes', name: 'Loss of Biodiversity & Causes', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biodiversity' },
          { id: 'conservation-strategies', name: 'Conservation Strategies', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biodiversity' },
          { id: 'hotspots', name: 'Biodiversity Hotspots', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-biodiversity' }
        ]
      },
      {
        id: 'bio-environmental-issues',
        name: 'Environmental Issues',
        difficulty: 'Medium',
        subjectId: 'biology',
        topics: [
          { id: 'air-pollution', name: 'Air Pollution & Control', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-environmental-issues' },
          { id: 'water-pollution', name: 'Water Pollution & Treatment', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-environmental-issues' },
          { id: 'solid-waste', name: 'Solid Waste Management', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-environmental-issues' },
          { id: 'greenhouse', name: 'Greenhouse Effect & Global Warming', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-environmental-issues' },
          { id: 'ozone-depletion', name: 'Ozone Layer Depletion', difficulty: 'Medium', coverageState: 'Not started', chapterId: 'bio-environmental-issues' }
        ]
      }
    ]
  }
];