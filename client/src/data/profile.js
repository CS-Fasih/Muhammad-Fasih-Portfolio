// Homepage content. Edit text here rather than inside the components.

export const currentRole = {
  title: 'Research Scholar & AR/VR Systems Developer',
  organization: 'NED',
  since: 'Nov 2026',
};

export const heroFacts = [
  { label: 'Now', value: 'Research Scholar & AR/VR Systems Developer', detail: 'NED, since Nov 2026' },
  { label: 'Previously', value: 'XR Engineer', detail: 'AIDL, Aug to Oct 2026' },
  { label: 'Education', value: 'BS Computer Science', detail: 'DUET Karachi, 2026' },
];

export const aboutText =
  "I'm a software engineer from Karachi. Most of my recent work is in extended reality. At AIDL I built VR and AR simulations with WorldViz Vizard and Python, and since November 2026 I have been researching and developing AR/VR systems at NED. Before that I worked mostly on computer vision, Linux security tools and full-stack web apps.";

export const numbers = [
  { value: '22', label: 'public repositories' },
  { value: '428', label: 'GitHub contributions in the last year' },
  { value: '25', label: 'certifications' },
  { value: '3rd', label: 'place, FYDP poster competition' },
];

export const experience = [
  {
    id: 'ned',
    role: 'Research Scholar & AR/VR Systems Developer',
    organization: 'NED',
    location: 'Karachi',
    period: 'Nov 2026 to present',
    current: true,
    summary: 'Research and development of augmented and virtual reality systems.',
    points: [],
    tools: '',
  },
  {
    id: 'aidl',
    role: 'XR Engineer',
    organization: 'AIDL (Associated Instrument Distributors)',
    location: 'Karachi',
    period: 'Aug to Oct 2026',
    current: false,
    summary:
      'AIDL is the authorized distributor of WorldViz VR/XR research and training solutions in Pakistan.',
    points: [
      'Built interactive VR and AR simulations with WorldViz Vizard and Python.',
      'Prepared 3D assets for those scenes in Blender.',
    ],
    tools: 'Vizard, Python, Blender',
  },
  {
    id: 'duet',
    role: 'BS Computer Science',
    organization: 'Dawood University of Engineering & Technology',
    location: 'Karachi',
    period: '2022 to 2026',
    current: false,
    summary:
      'Final year project: GeoExtract, a multi-model vision-language system for satellite imagery. It placed 3rd in the FYDP poster competition in June 2026.',
    points: [],
    tools: '',
  },
];

export const focusAreas = [
  {
    id: 'xr',
    title: 'Extended reality',
    description: 'VR and AR simulations, research prototypes and the 3D scenes behind them.',
    tools: 'Vizard, Unity, Blender, Python',
  },
  {
    id: 'ai',
    title: 'Computer vision and AI',
    description: 'Segmentation, classification and vision-language models, served through APIs.',
    tools: 'PyTorch, YOLO, Qwen2.5-VL, FastAPI',
  },
  {
    id: 'web',
    title: 'Web applications',
    description: 'Full-stack products with React, Node.js and SQL or document databases.',
    tools: 'React, Next.js, Node.js, PostgreSQL, MongoDB',
  },
  {
    id: 'sys',
    title: 'Systems and security',
    description: 'Linux daemons in C, log redaction services, compilers and socket networking.',
    tools: 'C / POSIX, Linux, Docker, ClamAV',
  },
];
