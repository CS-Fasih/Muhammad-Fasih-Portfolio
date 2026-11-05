// Single source for the profile content shown on the homepage.

export const currentRole = {
  title: 'Research Scholar & AR/VR Systems Developer',
  organization: 'NED',
  since: 'Nov 2026',
};

export const heroRoles = [
  'AR / VR systems',
  'immersive simulations',
  'AI & computer vision',
  'full-stack products',
  'secure Linux tools',
];

export const stats = [
  { value: 22, suffix: '+', label: 'Public repositories' },
  { value: 428, suffix: '+', label: 'GitHub contributions in a year' },
  { value: 25, suffix: '', label: 'Professional certifications' },
  { value: 3, suffix: 'rd', label: 'Place, FYDP poster competition' },
];

export const experience = [
  {
    id: 'ned',
    role: 'Research Scholar & AR/VR Systems Developer',
    organization: 'NED',
    location: 'Karachi, Pakistan',
    period: 'Nov 2026 — Present',
    current: true,
    summary:
      'Researching and developing augmented and virtual reality systems, from immersive prototypes to the software that drives them.',
    points: [],
    tags: ['AR', 'VR', 'XR Research', 'Spatial Computing'],
  },
  {
    id: 'aidl',
    role: 'XR Engineer',
    organization: 'AIDL — Associated Instrument Distributors',
    location: 'Karachi, Pakistan',
    period: 'Aug 2026 — Oct 2026',
    duration: '3 months',
    current: false,
    summary:
      'AIDL is the authorized distributor of WorldViz VR/XR research and training solutions in Pakistan.',
    points: [
      'Built interactive VR and AR simulations with WorldViz Vizard and Python',
      'Worked on 3D assets for those scenes in Blender',
    ],
    tags: ['WorldViz Vizard', 'Python', 'Blender', 'VR / AR'],
  },
  {
    id: 'duet',
    role: 'BS Computer Science',
    organization: 'Dawood University of Engineering & Technology',
    location: 'Karachi, Pakistan',
    period: '2022 — 2026',
    current: false,
    summary:
      'Final Year Design Project: GeoExtract, a multi-model vision-language system for satellite imagery.',
    points: ['3rd place, FYDP poster competition (June 2026)'],
    tags: ['Computer Vision', 'Compilers', 'Evolutionary Computing'],
    education: true,
  },
];

export const focusAreas = [
  {
    id: 'xr',
    title: 'XR & Spatial Computing',
    description:
      'AR/VR research and development, interactive simulations in WorldViz Vizard, and 3D scenes built with Blender and Unity.',
    tags: ['Vizard', 'Unity', 'Blender', 'Python'],
  },
  {
    id: 'ai',
    title: 'AI & Computer Vision',
    description:
      'YOLO segmentation, EfficientNet classifiers, LoRA-tuned vision-language models, and LLM-backed tools.',
    tags: ['PyTorch', 'YOLO', 'Qwen-VL', 'FastAPI'],
  },
  {
    id: 'web',
    title: 'Full-Stack Development',
    description:
      'MERN and Next.js products, REST and WebSocket APIs, relational and document databases, cloud deploys.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'MongoDB'],
  },
  {
    id: 'sys',
    title: 'Security & Systems',
    description:
      'Linux endpoint security in C/POSIX, credential redaction services, compilers, and multi-threaded networking.',
    tags: ['C / POSIX', 'Linux', 'Docker', 'ClamAV'],
  },
];

export const marquee = [
  'AR / VR',
  'WorldViz Vizard',
  'Unity',
  'Blender',
  'Python',
  'PyTorch',
  'YOLOv11',
  'Qwen2.5-VL',
  'React',
  'Next.js',
  'Node.js',
  'TypeScript',
  'FastAPI',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'C / POSIX',
  'Linux',
  'Neo4j',
];
