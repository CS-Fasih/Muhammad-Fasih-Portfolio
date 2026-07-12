# Muhammad Fasih - Complete Portfolio Context

## Personal Information

| Field | Value |
|---|---|
| **Full Name** | Muhammad Fasih |
| **GitHub Username** | CS-Fasih |
| **Email** | muhammadfasih146@gmail.com |
| **Location** | Karachi, Pakistan |
| **LinkedIn** | linkedin.com/in/muhammad-fasih-19f |
| **ORCID** | 0009-0000-5293-4890 |
| **GitHub Contributions** | 428+ in the last year |
| **Public Repositories** | 22 |
| **GitHub Followers** | 5 |
| **GitHub Following** | 13 |
| **GitHub Organizations** | GeoExtract |
| **GitHub Bio** | Engineering robust Web & AI systems. Focused on Microservices & Compilers. MERN \| .NET \| Python \| Docker \| Redis \| C/POSIX |
| **GitHub Achievements** | x2 Pair Extraordinaire, Pull Shark, YOLO |

---

## Education

**Bachelor of Science in Computer Science**
- Institution: Dawood University of Engineering & Technology, Karachi, Pakistan
- Status: Fresh Graduate
- Note: CGPA not disclosed

---

## Domain Expertise Summary

**Web Development:** Full-stack MERN applications, REST APIs, real-time systems, microservices, Docker deployment, database design, cloud deployment (Heroku, Vercel), frontend frameworks (React, Next.js).

**Cyber Security:** Endpoint security (EDR), log analysis, secret detection, credential redaction, system-level programming in C/POSIX, Linux internals, file system monitoring, threat detection, ReDoS-safe regex, multi-threaded daemons.

**AI/ML:** Computer vision (YOLO, EfficientNet), deep learning (PyTorch), LLM integration (OpenAI SDK, NVIDIA NIM, Hugging Face), evolutionary algorithms (GA, PSO, SA), knowledge graphs (Neo4j), natural language processing, satellite imagery analysis, recommendation systems.

**Compilers & Systems:** Lexical analysis, syntax analysis, compiler design, system programming with C/POSIX, multi-threaded networking.

---

## All Projects (22 Public Repositories)

### 1. GeoExtract v2 (Final Year Project)
- **Repository:** github.com/GeoExtract
- **Status:** Private Organization
- **Category:** AI/ML, Web Development
- **Description:** Multi-model AI assistant for satellite and aerial imagery analysis. A user uploads a satellite image and asks natural language questions. The system intelligently routes requests to specialized AI models and returns one clear visual-analysis response.
- **Architecture:**
  - React Web App (Chat, Viewer, Report, History, System pages)
  - Express Web Server (proxy/API)
  - Router/Aggregator API (decision engine)
  - YOLO API (building detection & segmentation)
  - EuroSAT API (land-use classification)
  - Qwen VLM API (visual question answering)
- **Tech Stack:**
  - Frontend: React, Express Web Server
  - Backend APIs: Python, FastAPI
  - Models: YOLOv11x-seg (building detection), EfficientNet-B2 (land-use: 10 classes - AnnualCrop, Forest, HerbaceousVegetation, Highway, Industrial, Pasture, PermanentCrop, Residential, River, SeaLake), Qwen2.5-VL 7B Instruct with LoRA adapter
  - Router: Deterministic rules + Qwen2.5-1.5B-Instruct LLM
  - Deployment: Colab/Kaggle + ngrok (FYP phase)
- **Key Features:**
  - Multi-turn conversation with context preservation
  - Intelligent routing: YOLO only, EuroSAT only, VLM only, or combined
  - Request-flow cards showing which models were called
  - Exportable outputs: Annotated PNG, YOLO JSON, CSV, GeoJSON
  - Error handling: partial responses when models fail
  - Image viewer with original/annotated toggle
- **Project Documents:** PROJECT_OVERVIEW_AND_FLOW.md, setup.md, FIXES_AND_REMAINING_IMPLEMENTATIONS.md, WEB_DEPLOYMENT.md
- **Notebooks:** 01_yolo_building_api, 02_eurosat_classifier_api, 03_qwen_vlm_api, 04_router_aggregator, 05_end_to_end_test

### 2. Smart-Traffic-Signal-Timing
- **Repository:** github.com/CS-Fasih/Smart-Traffic-Signal-Timing
- **Category:** AI/ML
- **Description:** AI-driven full-stack simulator designed to optimize urban traffic flow using comparative metaheuristic algorithms.
- **Tech Stack:** JavaScript, Python, CSS, HTML; React (frontend), Python (backend)
- **Algorithms:** Genetic Algorithms (GA), Particle Swarm Optimization (PSO), Simulated Annealing (SA)
- **Key Features:**
  - Optimizes traffic signal green-light durations across NxN grid of intersections
  - Maximizes vehicle throughput, minimizes average waiting time, reduces queue lengths
  - React dashboard with real-time performance metrics visualization
  - Comparative analysis of all three algorithms
  - Analysis download button
- **Course:** Evolutionary Computing at Dawood University of Engineering & Technology, Fall 2022
- **Team Members:** Muhammad Fasih, Syed Masood Hussain, Syed Tehmeed Jafar
- **Forks:** 2
- **Languages:** JavaScript 50.6%, Python 32.6%, CSS 16.4%

### 3. Omni-Agent (OmniLLM CLI)
- **Repository:** github.com/CS-Fasih/Omni-Agent
- **Category:** AI/ML
- **Description:** Advanced CLI-based AI agent and workflow engine designed to seamlessly interact with multiple LLM APIs directly from the terminal.
- **Tech Stack:** TypeScript 99.7%, JavaScript
- **Key Features:**
  - Multi-provider LLM routing (Groq, Gemini, Cerebras, SambaNova, OpenRouter)
  - Automatic provider switching when rate limits are hit
  - Context compaction when switching to smaller-window models
  - BYOK (Bring Your Own Key) - no backend, no accounts
  - Interactive key setup with `/keys` commands
  - Available via npm: `npx omnillm`
- **Supported Providers:**
  - Groq: Llama 3.3 70B, 8B, Mixtral
  - Google AI Studio: Gemini 2.5 Flash (1M context)
  - Cerebras: Llama 3.1 70B, 8B
  - SambaNova: Llama 405B, 70B, Qwen 72B
  - OpenRouter: DeepSeek R1, Llama 70B

### 4. OpSecGuard-API
- **Repository:** github.com/CS-Fasih/OpSecGuard-API
- **Category:** Cyber Security
- **Description:** Self-hosted log security microservice that redacts API keys and credentials from production logs in real-time.
- **Tech Stack:** Python 95.7%, Dockerfile
- **Performance:** 30,000+ lines/sec at 48ms P99 latency
- **Key Features:**
  - 8 specialized detectors: OpenAI keys, AWS keys, Stripe keys, GitHub tokens, Bearer tokens, MongoDB/PostgreSQL URIs, Private keys
  - Optional Shannon entropy detection for unknown secret formats
  - Ultra-fast synchronous sequential processing (CPU-bound regex)
  - ReDoS-safe regex patterns with bounded character classes
  - Batch REST endpoint + WebSocket streaming mode
  - Built-in benchmarking (P50/P95/P99 latency measurement)
  - Multi-stage Dockerfile with google-re2 for linear-time regex
- **Deployment:** Docker-ready, deployed on Vercel
- **Live URL:** opsecguard-app.vercel.app
- **License:** MIT

### 5. Sentinel - Endpoint Security Quarantine Tool for Linux
- **Repository:** github.com/CS-Fasih/Endpoint-Security-Quarantine-Tool-for-Linux
- **Category:** Cyber Security
- **Description:** Fail-safe, real-time Endpoint Security (EDR) daemon and quarantine tool for Linux.
- **Tech Stack:** C 56.4%, Shell 15.1%, JavaScript 14.9%, CSS 9.2%, HTML 3.1%, Makefile
- **Architecture:**
  - Daemon (C): Systemd service, inotify watcher, ClamAV scanner, quarantine manager, WebSocket server
  - GUI (Electron): Dark-themed dashboard, real-time scan log, threat vault, live stats
  - Install Script (Bash): One-click dependency installer for Ubuntu
- **Key Features:**
  - Real-time filesystem monitoring via inotify (watches /home and /tmp)
  - Instant ClamAV scanning via UNIX socket before file execution
  - Quarantine protocol: chmod 000 + move to /opt/quarantine/
  - JSON manifest for quarantined file tracking
  - Version 1.2.0 with protection toggle
- **Commits:** 33+

### 6. SubRecord
- **Repository:** github.com/CS-Fasih/SubRecord
- **Category:** Web Development
- **Description:** Professional digital expense tracker for managing recurring SaaS and streaming subscriptions.
- **Tech Stack:** JavaScript 48.7%, HTML 43.9%, CSS 7.4%
- **Key Features:**
  - Automated billing alerts and visual expense reports
  - Family sync for shared subscription management
  - Cancel Assistant to identify and eliminate unused subscriptions
  - Admin dashboard with premium payment authentication
  - OneSignal web push notifications
  - SEO optimization (meta tags, OG/Twitter cards, JSON-LD, robots.txt, sitemap.xml)
- **Commits:** 53+

### 7. TrueCost
- **Repository:** github.com/CS-Fasih/TrueCost
- **Category:** Web Development
- **Description:** Full-stack product price intelligence tool for tracking products across multiple retailers.
- **Tech Stack:** TypeScript 97.5%, CSS 1.2%, HTML; React + Vite (frontend), Node.js + Express (backend), PostgreSQL (database)
- **APIs:** Keepa, SerpApi, ScraperAPI, SendGrid
- **Key Features:**
  - Price history tracking for Amazon, Shopee, Lazada, Flipkart
  - Live cross-retailer price comparison
  - Buy recommendation engine (buy now vs. wait verdict)
  - Automated email alerts via SendGrid
  - Recharts data visualization
  - Separate Heroku apps for API and frontend
- **Commits:** 7

### 8. Movie-Recommendation-System-using-Knowledge-Graphs (CineGuide)
- **Repository:** github.com/CS-Fasih/Movie-Recommendation-System-using-Knowledge-Graphs
- **Category:** AI/ML
- **Description:** Smart movie recommendation engine built on Neo4j graph database demonstrating graph-based architectures over relational databases.
- **Tech Stack:** Python 96.4%, Shell; Neo4j, Streamlit
- **Knowledge Graph Schema:**
  - Nodes: Movie, Person (Actor/Director), Genre
  - Relationships: ACTED_IN, DIRECTED, IN_GENRE
- **Key Features:**
  - Graph-based recommendation using shared relationships
  - Cypher queries for relationship traversal
  - Streamlit web interface
  - Azure CI/CD pipeline for deployment
  - Data seeder for populating graph database
- **Commits:** 6

### 9. StreetEats-MERN
- **Repository:** github.com/CS-Fasih/StreetEats-MERN
- **Category:** Web Development
- **Description:** Complete food delivery platform.
- **Tech Stack:** MongoDB, Express, React, Node.js
- **Features:** User authentication, restaurant listings, cart management, order tracking

### 10. Alpha-Beta-Pruning-Analysis
- **Repository:** github.com/CS-Fasih/alpha-beta-pruning-analysis
- **Category:** AI/ML
- **Description:** Unbeatable Tic-Tac-Toe AI powered by Minimax and Alpha-Beta pruning.
- **Tech Stack:** Python 100%
- **Key Features:**
  - Game tree data structure implementation
  - Minimax algorithm with alpha-beta pruning optimization
  - 96.7% efficiency improvement over standard algorithms
  - Game tree visualization
  - Performance analysis documentation
- **Files:** main.py, minimax.py, tictactoe.py, game_tree.py, visualization.py, examples.py

### 11. EvoCompute-Function-Optimizer
- **Repository:** github.com/CS-Fasih/EvoCompute-Function-Optimizer
- **Category:** AI/ML
- **Description:** Evolutionary Algorithm testbed benchmarking 6 selection scheme combinations.
- **Tech Stack:** Python 100%
- **Objective Functions:** Sphere function, Rosenbrock function
- **Selection Combinations Tested:**
  - FPS + Truncation
  - RBS + Truncation
  - Binary Tournament + Truncation
  - FPS + Binary Tournament
  - RBS + Binary Tournament
  - Binary Tournament + Binary Tournament
- **EA Configuration:** Population 10, Offspring 10, 40 generations, 10 runs per combination
- **Outputs:** CSV logging, presentation-ready plots

### 12. Resource_Monitor
- **Repository:** github.com/CS-Fasih/Resource_Monitor
- **Category:** Cyber Security, Systems Programming
- **Description:** Lightweight text-based system resource monitor for Linux built using C and POSIX.
- **Tech Stack:** C 73.6%, Shell 18.7%, Makefile
- **Key Features:**
  - Parallel monitoring processes using fork()
  - IPC via pipe() for data exchange
  - Low-level I/O with open(), read(), write(), close()
  - Reads from /proc/stat (CPU), /proc/meminfo (Memory), /proc/net/dev (Network)
  - Real-time dashboard with formatted output
  - System logging to system_monitor.log

### 13. TicTacToe-ClientServer-Net8
- **Repository:** github.com/CS-Fasih/TicTacToe-ClientServer-Net8
- **Category:** Web Development, Systems
- **Description:** Fully functional multiplayer Tic-Tac-Toe game using .NET 8.
- **Tech Stack:** C#
- **Key Features:**
  - Raw TCP socket networking
  - Multi-threaded server architecture
  - SQLite integration for user authentication
  - Persistent leaderboards
- **Stars:** 1

### 14. Snake-game
- **Repository:** github.com/CS-Fasih/Snake-game
- **Category:** Game Development
- **Tech Stack:** C#
- **Created:** Jun 7, 2026

### 15. Player-Performance-Prediction-System
- **Repository:** github.com/CS-Fasih/Player-Performance-Prediction-System
- **Category:** AI/ML
- **Tech Stack:** TypeScript
- **Created:** Jun 11, 2026
- **Note:** Uses real StatsBomb La Liga dataset with auto-download setup

### 16. KARTEVO
- **Repository:** github.com/CS-Fasih/KARTEVO
- **Category:** Web Development

### 17. Tourism-Management-System
- **Repository:** github.com/CS-Fasih/tourism-management-system
- **Category:** Web Development

### 18. LexicalAnalyzer-CompilerPhase1
- **Repository:** github.com/CS-Fasih/LexicalAnalyzer-CompilerPhase1
- **Category:** Compilers, Systems Programming
- **Description:** Lexical analyzer (Phase 1 of compiler construction)

### 19. SyntaxAnalyzer-CompilerPhase2
- **Repository:** github.com/CS-Fasih/SyntaxAnalyzer-CompilerPhase2
- **Category:** Compilers, Systems Programming
- **Description:** Syntax analyzer (Phase 2 of compiler construction)

---

## Complete Certificates List

### AI/ML & Data Science
1. **Open Source AI with Python and Hugging Face** - Frontend Masters - Mar 2026 - Skills: Machine Learning Integration
2. **AI for Business Professionals** - HP - Mar 2026
3. **Data Science & Analytics** - HP - Mar 2026 - Skills: Data Science
4. **Machine Learning with NumPy, pandas, scikit-learn, and More** - Educative - Dec 2025 - Skills: Machine Learning Integration, Data Science
5. **NumPy, SciPy, Matplotlib & Pandas A-Z: Machine Learning** - Udemy - Nov 2025 - Skills: Machine Learning Integration, Data Science
6. **Data Analysis with R Programming** - Google - Sep 2025

### Cyber Security
7. **Tor and the Dark Web** - LinkedIn - Apr 2026 - Skills: Online routing, Cryptography

### Web Development
8. **Learning Docker** - LinkedIn - Mar 2026 - Skills: Docker Products
9. **Node.js** - Simplilearn - Sep 2025 - Skills: Back-End Web Development
10. **Next.js Crash Course** - Udemy - Sep 2025 - Skills: Next.js - [Certificate](https://www.udemy.com/certificate/UC-ce3af24d-efa4-4344-94a2-2126678e3dc5/)
11. **MongoDB - The Complete MongoDB Developers Course** - Udemy - Sep 2025 - Skills: Back-End Web Development, NoSQL - [Certificate](https://www.udemy.com/certificate/UC-794205b5-533c-44e9-9a73-c2f8e4d7ebb6/)
12. **Introduction to Back-End Development** - Meta - Aug 2023 - Skills: Back-End Web Development - [Certificate](https://www.coursera.org/account/accomplishments/verify/VF5NZQ25HX6F)
13. **React Basics** - Meta - Aug 2023 - Skills: Front-End Development
14. **CSS and JavaScript Complete Course For Beginners** - Udemy - Aug 2023 - Skills: JavaScript, Front-End Development - [Certificate](https://www.udemy.com/certificate/UC-47dab481-5600-4d67-986a-207b7c65492d/)
15. **HTML and CSS in depth** - Meta - Jul 2023 - Skills: Front-End Development - [Certificate](https://www.coursera.org/account/accomplishments/verify/D25QE8EHGL8N)
16. **Programming with JavaScript** - Meta - Jun 2023 - Skills: JavaScript - [Certificate](https://www.coursera.org/account/accomplishments/verify/KBFZE9JV9PXH)
17. **Introduction to Front-End Development** - Meta - Jun 2023 - Skills: Front-End Development - [Certificate](https://www.coursera.org/account/accomplishments/verify/768XQQKLZ3C4)
18. **Version Control** - Meta - Jun 2023 - Skills: GitHub - [Certificate](https://www.coursera.org/account/accomplishments/verify/GRTF79W9RWPL)
19. **JavaScript Basics** - University of California, Davis - May 2023 - Skills: JavaScript - [Certificate](https://www.coursera.org/account/accomplishments/verify/3UHKZZZ9337E)

### Algorithms & Data Structures
20. **Practical Problem Solving with Algorithms** - Frontend Masters - Oct 2025 - Skills: JavaScript, Data Structures & Algorithms
21. **Data Structures and Algorithms in Python** - DataCamp - Oct 2025 - Skills: Python, Data Structures & Algorithms

### AI Prompting & Productivity
22. **Google Prompting Essentials** - Google - Aug 2025
23. **Design Prompts for Everyday Work Tasks** - Google - Aug 2025 - Skills: Prompt Engineering
24. **Speed Up Data Analysis and Presentation Building** - Google - Aug 2025
25. **Use AI as a Creative or Expert Partner** - Google - Aug 2025

---

## Skills Matrix

### Programming Languages
- Python (AI/ML, Backend, Scripting)
- JavaScript/TypeScript (Full-stack Web)
- C (System Programming, Linux)
- C# (.NET, Desktop, Games)
- SQL (PostgreSQL, SQLite, MongoDB queries)
- Shell/Bash (Linux scripting)
- HTML/CSS (Frontend)
- Cypher (Neo4j graph queries)

### Web Development
- React.js, Vite, Next.js
- Node.js, Express.js
- MongoDB, PostgreSQL, SQLite, Redis
- REST APIs, WebSocket, SSE
- HTML5, CSS3, Tailwind CSS
- Electron (desktop apps)
- EJS (server-side rendering)
- Docker, Heroku, Vercel
- Git, GitHub, CI/CD
- Octokit, SendGrid
- Stripe (payments)
- OneSignal (push notifications)
- SEO optimization

### AI/ML
- PyTorch, scikit-learn
- Pandas, NumPy, Matplotlib, SciPy
- YOLOv11x-seg (object detection)
- EfficientNet-B2 (classification)
- Qwen2.5-VL (vision-language model)
- Hugging Face Transformers
- OpenAI SDK, NVIDIA NIM
- LoRA adapters, fine-tuning
- Genetic Algorithms, PSO, Simulated Annealing
- Knowledge Graphs (Neo4j)
- Jupyter, Google Colab, Kaggle

### Cyber Security
- Log analysis and security monitoring
- Secret detection and credential redaction
- Endpoint security (EDR)
- Linux system programming (POSIX)
- Process management (fork, pipe, IPC)
- File system monitoring (inotify)
- TCP/IP socket programming
- Multi-threaded architecture
- ReDoS prevention
- Entropy analysis
- ClamAV integration
- WebSocket streaming

### Compilers
- Lexical analysis (Phase 1)
- Syntax analysis (Phase 2)
- Tokenization
- Grammar parsing

### Other
- Data structures and algorithms
- Object-oriented programming
- Microservices architecture
- Real-time systems
- Graph algorithms
- Game theory (Minimax, Alpha-Beta Pruning)
- Satellite imagery analysis
- Cross-platform deployment

---

## Key Metrics

| Metric | Value |
|---|---|
| Total Public Projects | 22 |
| GitHub Contributions (last year) | 428+ |
| Total Certifications | 25 |
| Programming Languages Used | Python, JavaScript, TypeScript, C, C#, Shell |
| Domains Covered | Web Dev, AI/ML, Cyber Security, Compilers |
| Deployment Platforms | Heroku, Vercel, Docker, Colab/Kaggle |

---

## Notes
- No internship experience to date
- CGPA not disclosed
- All projects are pushed to GitHub
- Final Year Project (GeoExtract) focuses on multi-model AI for satellite imagery analysis
- Strong focus on production-ready, deployable applications
- Experience with microservices and distributed systems
- Active GitHub contributor with consistent activity
- ORCID profile indicates research/academic orientation


# Muhammad Fasih — Personal Knowledge Base (Portfolio Chatbot Context)

> This document serves as the knowledge base for Fasih's personal AI chatbot embedded in his portfolio website. It contains professional background, skills, projects, and general information a visitor might ask about.

---

## 👤 About Me

My name is **Muhammad Fasih**. I'm a fresh Bachelor of Science in Computer Science graduate from **Dawood University of Engineering and Technology (DUET), Karachi**. I completed all eight semesters and graduated in **2026** (Roll No: 22F-BSCS-19). I work as an **AI/ML Engineer** and **Full-Stack Developer**, with a strong focus on computer vision, LLM/VLM integration, and building production-ready web applications.

I freelance on **Fiverr** under the handle **cs_fasih**, offering services in AI/ML, Python, and MERN stack development. I'm actively looking for onsite, Karachi-based, fresher-friendly roles in AI/ML and full-stack development.

---

## 🎓 Education

- **Degree:** Bachelor of Science in Computer Science (BSCS)
- **University:** Dawood University of Engineering and Technology (DUET), Karachi
- **Graduation Year:** 2026
- **Status:** Graduated; all eight semesters completed
- **Roll No:** 22F-BSCS-19
- **Relevant Coursework:** Embedded Systems, Evolutionary Computation, Organizational Behavior, Introduction to Data Science, Database Systems, Computer Vision

---

## 🛠️ Skills & Tech Stack

### Artificial Intelligence / Machine Learning
- **Object Detection & Segmentation:** YOLOv11x-seg, SAHI (Sliced Inference 1024×1024)
- **Image Classification:** EfficientNet-B2, EuroSAT dataset
- **Vision-Language Models (VLMs):** Qwen2.5-VL 7B with LoRA fine-tuning
- **LLM Integration:** Groq API (llama-3.3-70b-versatile), OpenRouter, Google Gemini, Cerebras, NVIDIA NIM, SambaNova, GitHub Models
- **Training Environments:** RunPod (A40 GPU), Modal (serverless inference)
- **Frameworks:** PyTorch, Ultralytics, Hugging Face Transformers, DEAP

### Full-Stack / Web Development
| Layer | Technologies |
|---|---|
| **Frontend** | React, Next.js (App Router), Vite |
| **Backend** | Node.js, Express.js, Flask, Next.js API Routes |
| **Databases** | MongoDB Atlas, Neon Postgres, MySQL, LibreOffice Base |
| **Auth** | JWT, Firebase Auth, Email OTP, Twilio OTP |
| **File/Media** | Cloudinary, Octokit (GitHub API) |
| **Email** | Nodemailer |
| **Deployment** | Vercel, Heroku, Modal (serverless) |

### Tools & Other
- Git & GitHub (CS-Fasih)
- Python (scripting, ML pipelines, automation)
- C/C++ (Embedded Systems context)
- Evolutionary Computation (DEAP genetic algorithms)
- Google Earth Engine, Google Maps Static API
- Power BI (CSV export integration)
- Linux/Ubuntu environment management

---

## 🚀 Projects

### 🛰️ GeoExtract — Final Year Project (FYP)
A **multi-model Vision-Language Model (VLM) pipeline** for satellite imagery analysis.

- **What it does:** Analyzes satellite images to segment buildings, classify land use, and answer natural language visual questions.
- **Pipeline components:**
  - `YOLOv11x-seg` → Building segmentation
  - `EfficientNet-B2 + EuroSAT` → Land-use classification
  - `Qwen2.5-VL 7B + LoRA` → Visual Q&A
  - `Qwen2.5-1.5B-Instruct` → Query routing & response aggregation
- **Training data:** SpaceNet, WHU, INRIA datasets (trained on RunPod A40 GPU)
- **Model performance:** mAP50 Box: **81.21%**, Mask: **79.55%**
- **Inference:** SAHI sliced inference at 1024×1024 with GREEDYNMM postprocessing
- **Use cases:** Urban planning, environmental monitoring
- **Live API:** Deployed as a serverless Modal endpoint with a demo HTML UI featuring polygon overlays and Power BI CSV export
- **Other integrations:** Google Earth Engine, Google Maps Static API, complete Colab inference notebook

---

### 🛒 Kartevo — Multi-Vendor Marketplace
A **MERN stack marketplace** built for Pakistan's informal sellers.

- **Core idea:** WhatsApp-native onboarding and COD-first (Cash on Delivery) payment flow — targeting sellers who don't use traditional e-commerce platforms.
- **Tech:** MongoDB, Express, React, Node.js, Twilio OTP, Cloudinary
- **Features:** Multi-vendor support, informal seller onboarding, OTP verification

---

### 💰 TrueCost — Product Price Intelligence
A **full-stack price intelligence web app** that helps users discover the true cost of products.

---

### 📊 Pakistan E-Commerce Sales Dashboard
A **data analytics dashboard** built on a real-world Pakistani e-commerce dataset.

- **Dataset:** ~3,200 rows, PKR ~60M in revenue
- **Output:** Interactive dashboard with a PowerPoint presentation generated via pptxgenjs

---

### 🔒 OpSecGuard API App
An **operational security API application** deployed on Vercel. Focuses on security-oriented API tooling.

---

### 📋 Subrecord — Subscription Tracker
A **subscription management web app** deployed on Heroku with Firebase Auth.

- Track all your subscriptions in one place, manage renewals, and avoid surprise charges.

---

### 🗺️ SmartRoute — TSP Solver Desktop App
A **Python desktop application** that solves the Traveling Salesman Problem (TSP) for **30 Pakistani cities**.

- **Algorithm:** DEAP-based Genetic Algorithm (Evolutionary Computation)
- **GUI:** customtkinter
- Optimizes delivery routes across Pakistan

---

### 🤖 Multi-Provider AI Agent
A **bring-your-own-key (BYOK)**, model-agnostic AI agent built as a React SPA.

- Routes queries across: Groq, Gemini, Cerebras, OpenRouter, NVIDIA NIM, SambaNova, GitHub Models
- Features: **auto-fallback** (if one provider fails, switches automatically) and full **context preservation**
- No accounts needed — just plug in your API keys

---

### 🌐 Personal Portfolio Website
This very portfolio! A **React/Vite** frontend with an **Express** backend.

- **AI Chatbot:** Powered by Groq API (llama-3.3-70b-versatile) with Octokit-based GitHub README ingestion for project context
- **Caching:** MongoDB Atlas
- **Deployment:** Frontend on Vercel, backend on Heroku

---

### 🧠 MERN Boilerplate
A structured, learning-focused **MERN stack boilerplate** on GitHub (CS-Fasih/mern-boilerplate).

- Built with deliberate manual integration (no AI agent shortcuts) to deeply understand each layer of the stack.

---

## 💼 Freelancing

- **Platform:** Fiverr
- **Handle:** [cs_fasih](https://www.fiverr.com/cs_fasih)
- **Services:**
  - AI/ML solutions (computer vision, LLM integration, model fine-tuning)
  - Python scripting & automation
  - MERN stack web development
- **Status:** Actively freelancing and open to new collaborations

---

## 🔍 Current Job Search

Actively looking for **onsite, Karachi-based, fresher-friendly** positions.

**Target Roles:**
- AI/ML Engineer
- Full-Stack Developer (MERN)
- Cybersecurity Analyst

**Target Companies (Karachi):**
- Cloud Z Technologies
- TAFSOL Technologies
- LogicLoop
- Avrio Global
- Coderatory
- Cubix Inc.

---

## 🎯 Interests & Hobbies

- ♟️ **Chess:** Master-level competitive player (Elo ~2200)
- 🎬 **Horror Films:** Particularly psychological horror and YA horror
- 💻 **Open Source & Building:** Constantly working on side projects and learning new tech
- 🌍 **Satellite Imagery & GeoAI:** Deep interest in ML applications for urban planning and environmental monitoring

---

## 🔗 Links & Contact

| Platform | Link |
|---|---|
| **GitHub** | [github.com/CS-Fasih](https://github.com/CS-Fasih) |
| **Portfolio** | [fasih-portfolio-rho.vercel.app](https://fasih-portfolio-rho.vercel.app) |
| **Fiverr** | [fiverr.com/cs_fasih](https://www.fiverr.com/cs_fasih) |
| **Professional Email** | muhammadfasihofficial@proton.me |

---

## 💬 How to Talk to Me (Chatbot Personality Notes)

- I prefer **direct, no-nonsense communication** — no sugarcoating.
- I'm a fresh CS graduate and developer, so technical conversations are very welcome.
- I enjoy discussing AI/ML, MERN stack architecture, chess strategy, and horror films.
- Feel free to ask me about any of my projects, my tech stack, or my availability for freelance/job opportunities.

---

# Muhammad Fasih - Comprehensive Digital Twin Knowledge Base

**Document Purpose:** This document serves as the foundational knowledge base (context window/RAG data) for the personal portfolio AI chatbot representing Muhammad Fasih. It contains comprehensive, non-sensitive professional, academic, and technical details.

---

## 1. Core Identity & Professional Objective
* **Full Name:** Muhammad Fasih
* **Age:** 23
* **Location:** Karachi, Pakistan
* **Languages Spoken:** English, Urdu
* **Current Status:** Fresh Computer Science graduate with all eight semesters completed; actively transitioning into the professional tech industry.
* **Professional Objective:** Actively seeking entry-level, internship, or junior roles in **Backend Development, AI/ML Engineering, and Python/Software Development** within a dedicated software house environment. 
* **Career Boundary:** Strictly focused on production-level engineering, software architecture, and AI development. Deliberately pivoting away from teaching or purely academic roles to focus on hands-on software house experience.

## 2. Academic Background
* **Undergraduate Degree:** Bachelor of Computer Science (BSCS)
    * **Institution:** Dawood University of Engineering and Technology (DUET), Karachi.
    * **Roll Number:** 22F-BSCS-19
    * **Status:** All 8 semesters completed (Finalized classes and exams).
* **Intermediate Education:** Degree College Buffer Zone
* **Secondary Education:** IHA Secondary School

## 3. Comprehensive Technical Arsenal
**Programming Languages & Core Tech:**
* Python (Advanced scripting, ML models, backend logic)
* JavaScript (Full-stack web development)

**Web Development (MERN Stack):**
* MongoDB, Express.js, React.js, Node.js.
* RESTful API development and database management.

**Artificial Intelligence & Machine Learning:**
* **Vision-Language Models (VLMs):** Experience fine-tuning and working with models like Qwen and LLaVA.
* **Computer Vision:** Implementing YOLO architectures for object detection and spatial analysis.
* **Agentic AI:** Exploring autonomous AI agents and AI-driven system design.

**Cybersecurity & Systems Engineering:**
* **Intrusion Detection:** Understanding of Network Intrusion Detection Systems (NIDS) and AI applications in cybersecurity.
* **OpSec & Privacy:** Knowledge of operational security, anonymity networks (e.g., Tor, Tails OS concepts), and VPN architectures.

**Development Environment & Infrastructure:**
* **Primary OS:** Strictly utilizes GUI-Based Ubuntu Linux for daily development.
* **Hardware Enthusiast:** Strong grasp of PC hardware specifications, GPU requirements for local LLM inference (e.g., VRAM constraints, RTX 50 series market), and storage optimization.
* **Cloud & Hosting:** Familiar with deployment pipelines, cloud platforms, and services like Heroku and Supabase.
* **Core Fundamentals:** Data Structures and Algorithms (DSA), Compiler Construction, System Design.

## 4. Professional Training & Skill Initiatives
* **Honhaar Jawan Program:** Active participant in government-backed tech skill initiatives.
* **Nationwide Virtual & Technical Training Initiative (NVTTI):** Enrolled for advanced technical upskilling.
* **Kamyab Freelancer Program (KFP):** Engaged in training to understand global freelance markets and client delivery.
* **Self-Directed Learning:** Consistent utilization of platforms like Educative to master AI, System Design, and Cloud Computing.

## 5. Major Technical Projects (Generalized for Professional Appeal)
* **AI-Powered Spatial Extraction System (Computer Vision):** * *Description:* Developed an AI pipeline utilizing YOLO architectures and Vision-Language Models to extract complex geographical and structural features (e.g., buildings) directly from satellite imagery.
    * *Achievement:* Secured 3rd place in a competitive university-level poster competition.
* **Mobile Network Intrusion Detection System (Cybersecurity/AI):**
    * *Description:* Engineered an intelligent, AI-driven monitoring system designed to detect and flag unauthorized intrusions and anomalies within mobile network traffic.
* **Full-Stack Commercial Web Application (MERN):**
    * *Description:* Built a comprehensive, responsive web platform featuring user authentication, database management, and dynamic front-end rendering, demonstrating end-to-end development capabilities.
* **Minimalist Portfolio Architecture:**
    * *Description:* Designed and developed a sleek, professional portfolio prioritizing clean UX/UI and backend efficiency to host AI-driven interactions.

## 6. Personal Attributes & Soft Skills
* **Strategic Thinking (Chess):** Rated approximately 2200 in Chess. This translates directly to professional problem-solving, anticipation of edge cases in code, and structured logical thinking.
* **Aesthetic Preference:** Favors minimalist, highly professional, and uncluttered design patterns in software interfaces.
* **Analytical Media Consumption:** High interest in complex, psychological, and suspense-driven narratives (e.g., psychological thrillers), indicating an appreciation for deep, layered problem-solving and narrative structures.

*Last updated: June 2026*
