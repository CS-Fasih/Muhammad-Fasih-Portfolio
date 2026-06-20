const projects = [
  {
    id: 1,
    category: "AI / Machine Learning",
    title: "GeoExtract v2",
    description:
      "Multi-model AI assistant for satellite and aerial imagery analysis. Upload a satellite image, ask natural language questions — the system routes to specialized YOLO, EuroSAT, and Qwen VLM models and returns visual-analysis responses.",
    techStack: ["React", "FastAPI", "YOLOv11x", "EfficientNet-B2", "Qwen2.5-VL"],
    image: "/images/project-geoextract.png",
    githubUrl: "https://github.com/GeoExtract",
    liveUrl: null,
  },
  {
    id: 2,
    category: "AI / Evolutionary Computing",
    title: "Smart Traffic Signal",
    description:
      "AI-driven simulator optimizing urban traffic flow using Genetic Algorithms, PSO, and Simulated Annealing. React dashboard with real-time performance visualization and comparative algorithm analysis.",
    techStack: ["React", "Python", "GA", "PSO", "SA"],
    image: "/images/project-traffic.png",
    githubUrl: "https://github.com/CS-Fasih/Smart-Traffic-Signal-Timing",
    liveUrl: null,
  },
  {
    id: 3,
    category: "Cyber Security",
    title: "OpSecGuard API",
    description:
      "Self-hosted log security microservice that redacts API keys and credentials from production logs in real-time. 30,000+ lines/sec at 48ms P99 latency with ReDoS-safe regex patterns.",
    techStack: ["Python", "FastAPI", "Docker", "RE2", "WebSocket"],
    image: "/images/project-opsecguard.png",
    githubUrl: "https://github.com/CS-Fasih/OpSecGuard-API",
    liveUrl: "https://opsecguard-app.vercel.app",
  },
  {
    id: 4,
    category: "Cyber Security / Systems",
    title: "Sentinel EDR",
    description:
      "Fail-safe, real-time Endpoint Security daemon and quarantine tool for Linux. Uses inotify filesystem monitoring, ClamAV scanning, and an Electron GUI dashboard for threat management.",
    techStack: ["C", "POSIX", "Electron", "ClamAV", "Systemd"],
    image: "/images/project-sentinel.png",
    githubUrl:
      "https://github.com/CS-Fasih/Endpoint-Security-Quarantine-Tool-for-Linux",
    liveUrl: null,
  },
  {
    id: 5,
    category: "Web Development",
    title: "TrueCost",
    description:
      "Full-stack price intelligence tool tracking products across Amazon, Shopee, Lazada, and Flipkart. Features buy recommendation engine, price history charts, and automated email alerts.",
    techStack: ["React", "Vite", "Express", "PostgreSQL", "SendGrid"],
    image: "/images/project-truecost.png",
    githubUrl: "https://github.com/CS-Fasih/TrueCost",
    liveUrl: null,
  },
  {
    id: 6,
    category: "AI / Developer Tools",
    title: "Omni-Agent",
    description:
      "Advanced CLI-based AI agent seamlessly interacting with multiple LLM APIs. Supports Groq, Gemini, Cerebras, SambaNova, and OpenRouter with automatic provider switching on rate limits.",
    techStack: ["TypeScript", "Node.js", "Groq", "Gemini", "OpenRouter"],
    image: "/images/project-omniagent.png",
    githubUrl: "https://github.com/CS-Fasih/Omni-Agent",
    liveUrl: null,
  },
];

export default projects;
