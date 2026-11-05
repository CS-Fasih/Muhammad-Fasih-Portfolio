import useReducedMotion from '../hooks/useReducedMotion';

// Technical drawings for the featured projects, built from what each project does.
// Classes: pf-draw paths draw in when the figure scrolls into view; pf-fade items fade in.

const d = (i) => ({ '--i': i });

function Header({ left, right }) {
  return (
    <g className="pf-fade" style={d(0)}>
      <text x="40" y="52" className="pf-label">{left}</text>
      <text x="760" y="52" className="pf-label" textAnchor="end">{right}</text>
      <line x1="40" y1="72" x2="760" y2="72" className="pf-rule" />
    </g>
  );
}

function Box({ x, y, w, h, title, sub, accent = false, i = 0 }) {
  return (
    <g className="pf-fade" style={d(i)}>
      <rect x={x} y={y} width={w} height={h} rx="6" className={accent ? 'pf-box pf-box--accent' : 'pf-box'} />
      <text x={x + 16} y={y + (sub ? h / 2 - 3 : h / 2 + 6)} className="pf-title">{title}</text>
      {sub && <text x={x + 16} y={y + h / 2 + 19} className="pf-sub">{sub}</text>}
    </g>
  );
}

function Pulse({ path, dur = '2.6s', begin = '0s', motion }) {
  if (!motion) return null;
  return (
    <circle r="4.5" className="pf-pulse">
      <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={path} />
    </circle>
  );
}

function GeoExtract({ motion }) {
  const buildings = [
    [58, 218, 34, 24, 0], [100, 216, 22, 30, 1], [132, 220, 40, 22, 0], [178, 218, 18, 26, 0],
    [56, 252, 26, 34, 0], [90, 258, 44, 24, 1], [142, 254, 30, 30, 0], [180, 256, 16, 20, 0],
    [60, 296, 40, 22, 0], [110, 292, 24, 28, 0], [142, 298, 44, 24, 1], [62, 330, 30, 22, 0],
    [100, 330, 52, 24, 0], [160, 326, 30, 28, 1],
  ];
  const route = 'M210 285 H460 C500 285 500 150 540 150';
  return (
    <>
      <Header left="Request routing" right="GeoExtract" />
      <Pulse path={route} motion={motion} />
      <g className="pf-fade" style={d(1)}>
        <rect x="40" y="200" width="170" height="170" rx="4" className="pf-box" />
        {buildings.map(([x, y, w, h, hit]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} className={hit ? 'pf-seg' : 'pf-building'} />
        ))}
        <text x="40" y="398" className="pf-sub">Satellite tile</text>
        <text x="40" y="420" className="pf-sub pf-dim">Masks shown in red</text>
      </g>
      <path d="M210 285 H290" className="pf-line pf-draw" pathLength="1" style={d(2)} />
      <Box x={290} y={238} w={170} h={94} title="Router" sub="Qwen2.5-1.5B" i={3} />
      <path d="M460 285 C500 285 500 150 540 150" className="pf-line pf-line--accent pf-draw" pathLength="1" style={d(4)} />
      <path d="M460 285 H540" className="pf-line pf-draw" pathLength="1" style={d(5)} />
      <path d="M460 285 C500 285 500 420 540 420" className="pf-line pf-draw" pathLength="1" style={d(6)} />
      <Box x={540} y={110} w={220} h={80} title="YOLOv11x-seg" sub="Building footprints" accent i={5} />
      <Box x={540} y={245} w={220} h={80} title="EfficientNet-B2" sub="Land use, 10 classes" i={6} />
      <Box x={540} y={380} w={220} h={80} title="Qwen2.5-VL 7B" sub="LoRA, visual Q&A" i={7} />
      <path d="M760 150 H784 M760 285 H784 M760 420 H784 M784 150 V500 H460" className="pf-line pf-draw" pathLength="1" style={d(8)} />
      <Box x={290} y={466} w={170} h={68} title="Answer" sub="Merged report" i={9} />
      <g className="pf-fade" style={d(10)}>
        <text x="40" y="562" className="pf-mono pf-dim">mAP50  box 81.2%  mask 79.6%</text>
        <text x="760" y="562" className="pf-sub pf-dim" textAnchor="end">Trained on SpaceNet, WHU, INRIA</text>
      </g>
    </>
  );
}

const LOG_LINES = [
  ['09:41:02.118', 'INFO', 'POST /v1/charge 200 user=8812', ''],
  ['09:41:02.121', 'DEBUG', 'stripe key=', '[REDACTED:stripe]'],
  ['09:41:02.207', 'INFO', 'GET /health 200 3ms', ''],
  ['09:41:02.311', 'WARN', 'retry db=', '[REDACTED:postgres_uri]'],
  ['09:41:02.402', 'DEBUG', 'Authorization: Bearer ', '[REDACTED:bearer]'],
  ['09:41:02.455', 'INFO', 'deploy token=', '[REDACTED:github]'],
  ['09:41:02.590', 'ERROR', 'upstream 502 key=', '[REDACTED:openai]'],
  ['09:41:02.611', 'INFO', 'AWS_ACCESS_KEY_ID=', '[REDACTED:aws]'],
];

function OpSecGuard() {
  return (
    <>
      <Header left="Example output" right="OpSecGuard API" />
      {LOG_LINES.map(([time, level, message, secret], index) => (
        <g key={time} className="pf-fade" style={d(index + 1)}>
          <text x="40" y={122 + index * 40} className="pf-mono pf-dim">{time}</text>
          <text x="172" y={122 + index * 40} className={`pf-mono ${level === 'ERROR' ? 'pf-red' : level === 'WARN' ? 'pf-strong' : 'pf-dim'}`}>
            {level}
          </text>
          <text x="236" y={122 + index * 40} className="pf-mono">
            {message}
            {secret && <tspan className="pf-red">{secret}</tspan>}
          </text>
        </g>
      ))}
      <line x1="40" y1="460" x2="760" y2="460" className="pf-rule pf-fade" style={d(9)} />
      <g className="pf-fade" style={d(10)}>
        <text x="40" y="522" className="pf-big">30,000+</text>
        <text x="40" y="552" className="pf-sub">Lines per second</text>
        <text x="300" y="522" className="pf-big">48 ms</text>
        <text x="300" y="552" className="pf-sub">P99 latency</text>
        <text x="760" y="522" className="pf-sub" textAnchor="end">8 detectors</text>
        <text x="760" y="552" className="pf-sub pf-dim" textAnchor="end">plus optional entropy check</text>
      </g>
    </>
  );
}

const SENTINEL_LOG = [
  ['[watch]', '/home/user/Downloads/setup.sh  created', ''],
  ['[scan ]', 'clamd: OK', ''],
  ['[watch]', '/tmp/payload.bin  created', ''],
  ['[scan ]', 'clamd: Eicar-Test-Signature FOUND', 'red'],
  ['[quar ]', '/tmp/payload.bin -> /opt/quarantine/  mode 000', 'red'],
  ['[note ]', 'manifest.json updated', ''],
];

function Sentinel({ motion }) {
  return (
    <>
      <Header left="Event flow" right="Sentinel EDR" />
      <Pulse path="M115 180 H560 C585 180 585 232 610 232" dur="3s" motion={motion} />
      <Box x={40} y={140} w={150} h={80} title="/home, /tmp" sub="Watched paths" i={1} />
      <path d="M190 180 H230" className="pf-line pf-draw" pathLength="1" style={d(2)} />
      <Box x={230} y={140} w={140} h={80} title="inotify" sub="File created" i={2} />
      <path d="M370 180 H410" className="pf-line pf-draw" pathLength="1" style={d(3)} />
      <Box x={410} y={140} w={150} h={80} title="ClamAV" sub="UNIX socket" i={3} />
      <path d="M560 180 C585 180 585 128 610 128" className="pf-line pf-draw" pathLength="1" style={d(4)} />
      <path d="M560 180 C585 180 585 232 610 232" className="pf-line pf-line--accent pf-draw" pathLength="1" style={d(5)} />
      <Box x={610} y={98} w={150} h={60} title="Clean" sub="Left alone" i={4} />
      <Box x={610} y={202} w={150} h={60} title="Infected" sub="Quarantined" accent i={5} />
      <g className="pf-fade" style={d(6)}>
        <rect x="40" y="300" width="720" height="250" rx="6" className="pf-panel" />
        <text x="64" y="334" className="pf-label">sentineld.log</text>
      </g>
      {SENTINEL_LOG.map(([tag, text, tone], index) => (
        <g key={text} className="pf-fade" style={d(index + 7)}>
          <text x="64" y={374 + index * 30} className={`pf-mono ${tone ? 'pf-red' : 'pf-dim'}`}>{tag}</text>
          <text x="150" y={374 + index * 30} className={`pf-mono ${tone ? 'pf-red' : ''}`}>{text}</text>
        </g>
      ))}
    </>
  );
}

function Traffic({ motion }) {
  const roads = [85, 175, 265, 355];
  const rows = [155, 245, 335, 425];
  const cars = [
    { path: 'M40 155 H400', dur: '6s', begin: '0s' },
    { path: 'M175 470 V110', dur: '7s', begin: '-2s' },
    { path: 'M400 335 H40', dur: '5.5s', begin: '-1s' },
    { path: 'M355 110 V470', dur: '6.5s', begin: '-4s' },
  ];
  return (
    <>
      <Header left="4 x 4 intersections" right="Smart Traffic Signal" />
      <g className="pf-fade" style={d(1)}>
        {roads.map((x) => <line key={`v${x}`} x1={x} y1="110" x2={x} y2="470" className="pf-road" />)}
        {rows.map((y) => <line key={`h${y}`} x1="40" y1={y} x2="400" y2={y} className="pf-road" />)}
        {roads.map((x) => <line key={`vc${x}`} x1={x} y1="110" x2={x} y2="470" className="pf-lane" />)}
        {rows.map((y) => <line key={`hc${y}`} x1="40" y1={y} x2="400" y2={y} className="pf-lane" />)}
      </g>
      {motion && cars.map((car) => (
        <rect key={car.path} x="-4" y="-4" width="8" height="8" rx="2" className="pf-car">
          <animateMotion path={car.path} dur={car.dur} begin={car.begin} repeatCount="indefinite" />
        </rect>
      ))}
      {roads.map((x, col) => rows.map((y, row) => (
        <rect
          key={`${x}-${y}`}
          x={x - 7}
          y={y - 7}
          width="14"
          height="14"
          rx="2"
          className="pf-signal pf-fade"
          style={{ '--i': 2, animationDelay: `${-((col * 4 + row) * 0.73) % 4}s` }}
        />
      )))}
      <g className="pf-fade" style={d(3)}>
        <line x1="450" y1="120" x2="450" y2="440" className="pf-axis" />
        <line x1="450" y1="440" x2="760" y2="440" className="pf-axis" />
        <text x="450" y="104" className="pf-sub">Average wait</text>
        <text x="760" y="466" className="pf-sub" textAnchor="end">Iterations</text>
      </g>
      <path d="M452 160 C520 190 540 330 600 360 S700 392 750 396" className="pf-line pf-line--strong pf-draw" pathLength="1" style={d(4)} />
      <path d="M452 150 C500 230 560 300 620 340 S710 372 750 378" className="pf-line pf-line--dashed pf-fade" style={d(5)} />
      <path d="M452 170 C540 200 580 280 640 320 S720 350 750 352" className="pf-line pf-line--accent pf-draw" pathLength="1" style={d(6)} />
      <g className="pf-fade" style={d(7)}>
        <text x="756" y="400" className="pf-mono pf-small">GA</text>
        <text x="756" y="382" className="pf-mono pf-small pf-dim">PSO</text>
        <text x="756" y="356" className="pf-mono pf-small pf-red">SA</text>
      </g>
      <g className="pf-fade" style={d(8)}>
        <text x="40" y="530" className="pf-sub">Green-light durations tuned per intersection.</text>
        <text x="40" y="556" className="pf-sub pf-dim">Curves are illustrative; the simulator plots the real runs.</text>
      </g>
    </>
  );
}

function TrueCost() {
  const price = 'M60 170 L130 170 L130 210 L220 210 L220 160 L300 160 L300 250 L390 250 L390 230 L470 230 L470 300 L560 300 L560 280 L650 280 L650 330 L740 330';
  const lowest = 'M60 230 L160 230 L160 270 L300 270 L300 300 L470 300 L470 340 L600 340 L600 360 L740 360';
  return (
    <>
      <Header left="Price history, example" right="TrueCost" />
      <g className="pf-fade" style={d(1)}>
        {[130, 210, 290, 370].map((y) => <line key={y} x1="60" y1={y} x2="740" y2={y} className="pf-grid" />)}
        <line x1="60" y1="430" x2="740" y2="430" className="pf-axis" />
        <text x="60" y="458" className="pf-sub pf-dim">12 weeks ago</text>
        <text x="740" y="458" className="pf-sub pf-dim" textAnchor="end">Today</text>
      </g>
      <path d={price} className="pf-line pf-line--strong pf-draw" pathLength="1" style={d(2)} />
      <path d={lowest} className="pf-line pf-line--accent pf-line--dashed pf-fade" style={d(3)} />
      <g className="pf-fade" style={d(5)}>
        <circle cx="740" cy="330" r="5" className="pf-dot" />
        <circle cx="740" cy="360" r="5" className="pf-dot pf-dot--accent" />
        <rect x="560" y="96" width="180" height="56" rx="6" className="pf-box" />
        <text x="576" y="120" className="pf-title">Verdict: wait</text>
        <text x="576" y="140" className="pf-sub">Price is trending down</text>
      </g>
      <g className="pf-fade" style={d(6)}>
        <line x1="60" y1="510" x2="84" y2="510" className="pf-line pf-line--strong" />
        <text x="94" y="515" className="pf-sub">This store</text>
        <line x1="210" y1="510" x2="234" y2="510" className="pf-line pf-line--accent pf-line--dashed" />
        <text x="244" y="515" className="pf-sub">Lowest across Amazon, Shopee, Lazada, Flipkart</text>
        <text x="60" y="556" className="pf-mono pf-dim">alert: email when price drops below target</text>
      </g>
    </>
  );
}

const TERMINAL = [
  { text: '$ npx omnillm', tone: 'strong' },
  { text: 'providers: groq, gemini, cerebras, sambanova, openrouter', tone: 'dim' },
  { text: '' },
  { text: '> explain the auth flow in this repo', tone: 'strong' },
  { text: '  groq / llama-3.3-70b ........... ', tail: '429 rate limited', tone: '' },
  { text: '  switching to gemini-2.5-flash', tone: '' },
  { text: '  compacting context for the new model', tone: 'dim' },
  { text: '  streaming answer', tone: '' },
];

function OmniAgent() {
  return (
    <>
      <g className="pf-fade" style={d(0)}>
        <rect x="40" y="40" width="720" height="520" rx="10" className="pf-panel" />
        <circle cx="66" cy="66" r="5" className="pf-light" />
        <circle cx="84" cy="66" r="5" className="pf-light" />
        <circle cx="102" cy="66" r="5" className="pf-light" />
        <text x="400" y="71" className="pf-label" textAnchor="middle">Terminal</text>
        <line x1="40" y1="92" x2="760" y2="92" className="pf-rule" />
      </g>
      {TERMINAL.map((line, index) => (
        <text
          key={`${index}-${line.text}`}
          x="68"
          y={146 + index * 40}
          className={`pf-mono pf-term pf-fade ${line.tone === 'dim' ? 'pf-dim' : line.tone === 'strong' ? 'pf-strong' : ''}`}
          style={{ '--i': index + 1, '--step': '260ms' }}
          xmlSpace="preserve"
        >
          {line.text}
          {line.tail && <tspan className="pf-red">{line.tail}</tspan>}
        </text>
      ))}
      <g className="pf-fade" style={{ '--i': 9, '--step': '260ms' }}>
        <text x="68" y={146 + 8 * 40} className="pf-mono pf-strong">&gt;</text>
        <rect x="88" y={146 + 8 * 40 - 15} width="10" height="19" className="pf-cursor" />
      </g>
    </>
  );
}

const FIGURES = {
  geoextract: { component: GeoExtract, label: 'Diagram of GeoExtract routing a satellite image through a router model to YOLO, EfficientNet and Qwen-VL specialists.' },
  opsecguard: { component: OpSecGuard, label: 'Example log output with API keys and tokens replaced by redaction markers.' },
  sentinel: { component: Sentinel, label: 'Flow from watched folders through inotify and ClamAV to quarantine, with a sample event log.' },
  traffic: { component: Traffic, label: 'A four by four road grid with changing signals, next to convergence curves for three optimizers.' },
  truecost: { component: TrueCost, label: 'A price history chart comparing one store with the lowest price across four retailers.' },
  omni: { component: OmniAgent, label: 'Terminal session where the agent hits a rate limit and switches provider.' },
};

export default function ProjectFigure({ id }) {
  const reduceMotion = useReducedMotion();
  const figure = FIGURES[id];
  if (!figure) return null;
  const Drawing = figure.component;

  return (
    <svg className="pfig" viewBox="0 0 800 600" role="img" aria-label={figure.label}>
      <rect width="800" height="600" className="pf-bg" />
      <Drawing motion={!reduceMotion} />
    </svg>
  );
}
