// Featured projects. `figure` picks the diagram drawn in ProjectFigure.jsx.
const projects = [
  {
    id: 'geoextract',
    figure: 'geoextract',
    category: 'Computer vision, final year project',
    title: 'GeoExtract',
    description:
      'Ask questions about a satellite image in plain language. A small router model decides which specialist to call: YOLOv11x-seg for building footprints, EfficientNet-B2 for land use, or a LoRA-tuned Qwen2.5-VL for open questions. The answers are merged into one report.',
    note: '3rd place, FYDP poster competition, June 2026',
    stack: 'React, FastAPI, YOLOv11x-seg, EfficientNet-B2, Qwen2.5-VL',
    githubUrl: null,
    liveUrl: null,
    isClosedSource: true,
  },
  {
    id: 'opsecguard',
    figure: 'opsecguard',
    category: 'Security',
    title: 'OpSecGuard API',
    description:
      'A self-hosted service that strips API keys, tokens and database URIs out of production logs before they are stored. Eight detectors, regex patterns that cannot be pushed into catastrophic backtracking, and a WebSocket mode for streaming.',
    note: '30,000+ lines per second at 48 ms P99',
    stack: 'Python, FastAPI, RE2, WebSocket, Docker',
    githubUrl: 'https://github.com/CS-Fasih/OpSecGuard-API',
    liveUrl: 'https://opsecguard-app.vercel.app',
  },
  {
    id: 'sentinel',
    figure: 'sentinel',
    category: 'Systems, security',
    title: 'Sentinel EDR',
    description:
      'An endpoint security daemon for Linux, written in C. It watches /home and /tmp with inotify, scans new files through ClamAV over a UNIX socket and moves anything infected into a locked quarantine. An Electron dashboard shows the scan log live.',
    note: 'Runs as a systemd service',
    stack: 'C, POSIX, inotify, ClamAV, Electron',
    githubUrl: 'https://github.com/CS-Fasih/Endpoint-Security-Quarantine-Tool-for-Linux',
    liveUrl: null,
  },
  {
    id: 'traffic',
    figure: 'traffic',
    category: 'Optimization',
    title: 'Smart Traffic Signal',
    description:
      'A simulator that tunes green-light durations across a grid of intersections and compares three metaheuristics: genetic algorithms, particle swarm optimization and simulated annealing. Built as a team project for Evolutionary Computing.',
    note: 'With Syed Masood Hussain and Syed Tehmeed Jafar',
    stack: 'React, Python, GA, PSO, SA',
    githubUrl: 'https://github.com/CS-Fasih/Smart-Traffic-Signal-Timing',
    liveUrl: null,
  },
  {
    id: 'truecost',
    figure: 'truecost',
    category: 'Web application',
    title: 'TrueCost',
    description:
      'Tracks product prices across Amazon, Shopee, Lazada and Flipkart, keeps the history, and gives a buy-now or wait recommendation. Price drops trigger an email alert.',
    note: 'Keepa, SerpApi and ScraperAPI for data',
    stack: 'React, TypeScript, Express, PostgreSQL, SendGrid',
    githubUrl: 'https://github.com/CS-Fasih/TrueCost',
    liveUrl: null,
  },
  {
    id: 'omni-agent',
    figure: 'omni',
    category: 'Developer tool',
    title: 'Omni-Agent',
    description:
      'A command-line AI agent that talks to Groq, Gemini, Cerebras, SambaNova and OpenRouter with your own keys. When one provider rate-limits, it switches to the next and compacts the context to fit the new model.',
    note: 'npx omnillm',
    stack: 'TypeScript, Node.js',
    githubUrl: 'https://github.com/CS-Fasih/Omni-Agent',
    liveUrl: null,
  },
];

export default projects;
