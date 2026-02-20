import AppShell from "./layout/AppShell";
import LeftRail from "./rails/LeftRail";
import kpmgLogo from "./assets/kpmg-logo.png";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Mic,
    Bell,
    Sparkles,
    Layers,
    Rocket,
    ShieldCheck,
    Play,
    FileText,
    Download,
    Sun,
    Moon,
    X,
    Activity,
    ArrowRight,
} from "lucide-react";

/**
 * UltraAIDeliveryHubUI — enhanced
 * - Connected SDLC curve + animated progress dot
 * - Per-phase pulse while scenario runs
 * - 3D tiles, better light theme, polished animations
 *
 * Replace your existing src/UltraAIDeliveryHubUI.jsx with this file.
 */

/* ---------- Data ---------- */
const phases = [
    { name: "Discover", icon: <Sparkles size={18} />, color: "from-indigo-500 to-violet-600" },
    { name: "Design", icon: <Layers size={18} />, color: "from-pink-500 to-rose-500" },
    { name: "Engineer", icon: <Rocket size={18} />, color: "from-sky-500 to-blue-600" },
    { name: "Secure", icon: <ShieldCheck size={18} />, color: "from-emerald-500 to-teal-600" },
];

const agentsByPhase = {
    Discover: ["Requirements Intelligence", "Stakeholder Mapper", "Domain Terminology Extractor", "User Journey Synthesizer", "Impact Estimator", "Scope Minimizer"],
    Design: ["Architecture Copilot", "UX Generator", "Component Pattern Builder", "Data Model Advisor", "API Contract Designer", "Design Token Extractor"],
    Engineer: ["Code Quality Sentinel", "API Builder", "Test Case Generator", "Dependency Auditor", "CI/CD Optimizer", "Performance Profiler"],
    Secure: ["Threat Analyzer", "Compliance Validator", "Secrets Guardian", "Access Matrix Assessor", "Policy Enforcer", "Jailbreak Detector"],
};

const scenarios = [
    { id: "payments_brd", title: "Payments BRD Generation", agents: ["Requirements Intelligence", "Architecture Copilot", "Code Quality Sentinel", "Threat Analyzer"], summary: "BRD for payments modernization and reconciliation." },
    { id: "kyc_migration", title: "KYC Modernization", agents: ["Stakeholder Mapper", "UX Generator", "Test Case Generator", "Compliance Validator"], summary: "Migrate KYC flows with UX improvements and compliance." },
    { id: "core_bank", title: "Core Banking Migration", agents: ["Domain Terminology Extractor", "Data Model Advisor", "API Builder", "Policy Enforcer"], summary: "Core ledger migration plan and acceptance criteria." },
    { id: "fraud_rollout", title: "Fraud Detection Rollout", agents: ["User Journey Synthesizer", "Component Pattern Builder", "Performance Profiler", "Threat Analyzer"], summary: "Real-time fraud detection rollout plan." },
];

const cannedOutputs = {
    "Requirements Intelligence": "Summarizing stakeholder goals: reduce reconciliation time and improve auditability.",
    "Architecture Copilot": "Proposed architecture: event-driven processors with idempotency and reconciliation service.",
    "Code Quality Sentinel": "Static analysis highlights: 3 medium issues, 12 low-risk items.",
    "Threat Analyzer": "Top threats: replay, injection, privilege escalation. Mitigations suggested.",
    "Stakeholder Mapper": "Stakeholders: Product, Ops, Risk, Legal. Interview templates created.",
    "UX Generator": "Wireframe: single-step payment with inline validation and clear failure states.",
    "Jailbreak Detector": "Simulated malicious pattern detected and blocked at gateway.",
    default: "Simulated output for agent - summarizing key points and action items.",
};

/* ---------- Main component ---------- */
export default function UltraAIDeliveryHubUI() {
    const [activePhase, setActivePhase] = useState("Discover");
    const [dark, setDark] = useState(true);
    const [openAgent, setOpenAgent] = useState(null);

    const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
    const [runningScenario, setRunningScenario] = useState(null);
    const [scenarioText, setScenarioText] = useState("");
    const [scenarioActiveAgent, setScenarioActiveAgent] = useState(null);

    const [paletteOpen, setPaletteOpen] = useState(false);
    const [paletteQuery, setPaletteQuery] = useState("");
    const paletteRef = useRef(null);

    // SVG path refs for animated dot
    const pathRef = useRef(null);
    const dotRef = useRef(null);
    const requestRef = useRef(null);

    // keep dark styles for components; background tone is handled separately
    useEffect(() => {
        document.documentElement.classList.add("dark");
        return () => document.documentElement.classList.remove("dark");
    }, []);

    // keyboard shortcuts
    useEffect(() => {
        function onKey(e) {
            const isMac = navigator.platform?.toUpperCase().indexOf("MAC") >= 0;
            const mod = isMac ? e.metaKey : e.ctrlKey;
            if (mod && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setPaletteOpen((p) => !p);
                setTimeout(() => paletteRef.current?.focus(), 60);
            }
            if (e.key === "Escape") {
                setPaletteOpen(false);
                setScenarioModalOpen(false);
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // scenario runner streaming simulation
    useEffect(() => {
        if (!runningScenario) {
            setScenarioText("");
            setScenarioActiveAgent(null);
            return;
        }
        let interval = null;
        let idx = 0;
        const sc = scenarios.find((s) => s.id === runningScenario);
        if (!sc) return;

        function runNext() {
            if (idx >= sc.agents.length) {
                setTimeout(() => {
                    setRunningScenario(null);
                    setOpenAgent(null);
                    setScenarioActiveAgent(null);
                }, 900);
                return;
            }
            const agentName = sc.agents[idx];
            setOpenAgent(agentName);
            setScenarioActiveAgent(agentName);
            const full = cannedOutputs[agentName] || cannedOutputs.default;
            setScenarioText("");
            let i = 0;
            interval = setInterval(() => {
                i += Math.max(1, Math.floor(Math.random() * 6));
                setScenarioText(full.slice(0, i));
                if (i >= full.length) {
                    clearInterval(interval);
                    idx += 1;
                    setTimeout(runNext, 700);
                }
            }, 30 + Math.random() * 40);
        }

        runNext();
        return () => clearInterval(interval);
    }, [runningScenario]);

    const commands = [
        { id: "run_payments", title: "Run Payments BRD Scenario", action: () => startScenario("payments_brd") },
        { id: "toggle_theme", title: "Toggle Theme", action: () => setDark((d) => !d) },
        { id: "open_discover", title: "Open Discover Phase", action: () => setActivePhase("Discover") },
    ];
    const filteredCommands = commands.filter((c) => c.title.toLowerCase().includes(paletteQuery.toLowerCase()));

    function startScenario(id) {
        setScenarioModalOpen(false);
        setRunningScenario(id);
    }

    /* animate dot along the path while a scenario is running (or when projectMode is set) */
    useEffect(() => {
        const pathEl = pathRef.current;
        const dotEl = dotRef.current;
        if (!pathEl || !dotEl) return;

        let length = pathEl.getTotalLength();
        let running = !!runningScenario; // animate only when scenario running
        let loopStart = null;

        function step(ts) {
            if (!loopStart) loopStart = ts;
            const elapsed = ts - loopStart;
            const duration = 3500; // ms (one lap)
            const t = (elapsed % duration) / duration; // 0..1
            const point = pathEl.getPointAtLength(t * length);
            dotEl.setAttribute("cx", point.x.toString());
            dotEl.setAttribute("cy", point.y.toString());
            requestRef.current = requestAnimationFrame(step);
        }

        if (running) {
            requestRef.current = requestAnimationFrame(step);
        } else {
            // if not running, set dot to leftmost/start
            const p = pathEl.getPointAtLength(0);
            dotEl.setAttribute("cx", p.x.toString());
            dotEl.setAttribute("cy", p.y.toString());
        }

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        };
    }, [runningScenario]);

    /* ---------- styles helpers ---------- */

    const panelBg = (extra = "") => `bg-white/6 ${extra}`;
    const subtleBorder = (extra = "") => `border border-white/8 ${extra}`;
    const heroSurface = "bg-gradient-to-br from-indigo-600/80 to-cyan-500/70 border border-white/10 text-white";

    /* ---------- Render ---------- */
    return (
        <AppShell
            left={<LeftRail isLight={!dark} />}
            isLight={!dark}
        >
            <div className="h-full relative">
                {/* ambient glows */}
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute -top-40 -left-44 w-[640px] h-[640px] rounded-full blur-[140px]"
                        style={{ background: "rgba(99,102,241,0.12)" }}
                    />
                    <div
                        className="absolute -bottom-32 -right-20 w-[520px] h-[520px] rounded-full blur-[160px]"
                        style={{ background: "rgba(6,182,212,0.08)" }}
                    />
                </div>


                <div className="relative z-10 w-full px-6 py-8">

                    {/* NAV */}
                    <header className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center">
                                <img
                                    src={kpmgLogo}
                                    alt="KPMG"
                                    className="h-6 w-auto object-contain"
                                />
                            </div>
                            <div>
                                <div className="font-semibold">AI First @ GTS.</div>
                                <div className="text-xs opacity-70">Enterprise SDLC Intelligence</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div
                                className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-full border ${dark
                                    ? "bg-white/10 border-white/10 text-white"
                                    : "bg-white/80 border-slate-200 text-slate-900 shadow-[0_8px_16px_rgba(15,23,42,0.16)]"
                                    }`}
                            >
                                <Search size={16} />
                                <input placeholder="Search agents, scenarios…" className="bg-transparent outline-none text-sm w-[260px]" />
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    className={`p-2 rounded-full border ${dark
                                        ? "bg-white/10 border-white/10 text-white"
                                        : "bg-white/80 border-slate-200 text-slate-900 shadow-[0_6px_12px_rgba(15,23,42,0.18)]"
                                        }`}
                                    title="Voice"><Mic size={18} /></button>
                                <button
                                    className={`p-2 rounded-full border ${dark
                                        ? "bg-white/10 border-white/10 text-white"
                                        : "bg-white/80 border-slate-200 text-slate-900 shadow-[0_6px_12px_rgba(15,23,42,0.18)]"
                                        }`}
                                    title="Notifications"><Bell size={18} /></button>
                                <button
                                    onClick={() => setDark((d) => !d)}
                                    className={`p-2 rounded-full border ${dark
                                        ? "bg-white/10 border-white/10 text-white"
                                        : "bg-white/80 border-slate-200 text-slate-900 shadow-[0_6px_12px_rgba(15,23,42,0.18)]"
                                        }`}
                                    title="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold border ${dark
                                        ? "bg-white/10 border-white/10 text-white"
                                        : "bg-white/80 border-slate-200 text-slate-900 shadow-[0_6px_12px_rgba(15,23,42,0.18)]"
                                        }`}
                                >
                                    KS
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* HERO */}
                    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-6 mb-8 ${heroSurface}`}>

                        <div className="flex items-start justify-between gap-6">
                            <div className="min-w-0">
                                <h1 className="text-3xl font-extrabold leading-tight">Autonomous Software Delivery</h1>
                                <p className="mt-2 opacity-80 max-w-xl">Watch AI move across the SDLC, generating BRD/TAP, validating architecture and enforcing guardrails in real time.</p>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button onClick={() => setScenarioModalOpen(true)} className="px-4 py-2 rounded-lg bg-violet-600 text-white shadow-lg">Open Scenario Library</button>
                                    <button onClick={() => setPaletteOpen(true)} className="px-4 py-2 rounded-lg bg-white/10">Quick Actions ⌘K</button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 items-end">
                                <div className="p-2 rounded-md bg-white/8 text-sm">Live • Demo</div>
                                <div className="p-2 rounded-md bg-white/8 text-sm flex items-center gap-2"><Activity size={14} /> <span>Agents online: 24</span></div>
                            </div>
                        </div>
                    </motion.section>

                    {/* SDLC + curve */}
                    <div className="relative mb-10">
                        {/* the curved svg sits behind the tiles — we provide pathRef for animation */}
                        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                            <svg viewBox="0 0 100 36" preserveAspectRatio="none" className="w-full h-28">
                                <path d="M6 28 C20 8, 40 12, 52 22 C64 32, 80 28, 94 18" fill="none" stroke="rgba(99,102,241,0.25)" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
                                <motion.path d="M6 28 C20 8, 40 12, 52 22 C64 32, 80 28, 94 18" fill="none" stroke="#60a5fa" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} style={{ filter: "drop-shadow(0 8px 20px rgba(96,165,250,0.12))" }} />
                                {/* moving dot */}
                                <circle ref={dotRef} r="0.8" fill="#a5b4fc" />
                                {/* path for point calculations — invisible but referenced by JS */}
                                <path ref={pathRef} d="M6 28 C20 8, 40 12, 52 22 C64 32, 80 28, 94 18" fill="none" stroke="transparent" />
                            </svg>
                        </div>

                        {/* phase tiles — 3D perspective wrapper */}


                        <div style={{ perspective: 1600 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 items-end">
                            {phases.map((p, i) => {
                                const pulseActive =
                                    scenarioActiveAgent && agentsByPhase[p.name].includes(scenarioActiveAgent);

                                const isActive = activePhase === p.name;

                                return (
                                    <div key={p.name} className="flex flex-col items-center text-center">
                                        <motion.div
                                            whileHover={{ rotateX: -10, rotateY: 10, scale: 1.06 }}
                                            animate={{
                                                y: isActive ? -6 : 0,
                                                scale: isActive ? 1.08 : 1,
                                                rotateX: isActive ? -4 : 0,
                                            }}
                                            transition={{ type: "spring", stiffness: 180, damping: 14 }}
                                            style={{ transformStyle: "preserve-3d" }}
                                            className="relative w-24 h-24 cursor-pointer"
                                            onClick={() => setActivePhase(p.name)}
                                        >
                                            {/* deep shadow base */}
                                            <div
                                                className="absolute inset-0 rounded-2xl"
                                                style={{
                                                    transform: "translateZ(-18px)",
                                                    filter: "blur(18px)",
                                                    background:
                                                        "radial-gradient(circle at 50% 60%, rgba(0,0,0,0.35), transparent 70%)",
                                                }}
                                            />

                                            {/* glow halo when active */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId={`active-glow-${p.name}`}
                                                    className="absolute inset-0 rounded-2xl"
                                                    initial={{ opacity: 0.4, scale: 0.9 }}
                                                    animate={{ opacity: 0.9, scale: 1.15 }}
                                                    transition={{ duration: 0.6 }}
                                                    style={{
                                                        background:
                                                            "radial-gradient(circle at 50% 40%, rgba(99,102,241,0.35), transparent 70%)",
                                                        filter: "blur(20px)",
                                                    }}
                                                />
                                            )}

                                            {/* main 3D tile */}
                                            <div
                                                className="relative w-full h-full rounded-2xl flex items-center justify-center"
                                                style={{
                                                    background: `linear-gradient(160deg, rgba(255,255,255,0.12), rgba(0,0,0,0.25)), linear-gradient(135deg, ${i === 0
                                                        ? "#7c3aed"
                                                        : i === 1
                                                            ? "#ef476f"
                                                            : i === 2
                                                                ? "#3b82f6"
                                                                : "#10b981"
                                                        }, rgba(0,0,0,0))`,
                                                    boxShadow: isActive
                                                        ? "0 25px 60px rgba(2,6,23,0.7), inset 0 3px 8px rgba(255,255,255,0.08)"
                                                        : "0 14px 32px rgba(2,6,23,0.45), inset 0 2px 6px rgba(255,255,255,0.05)",
                                                    borderRadius: 18,
                                                    transform: isActive ? "translateZ(22px)" : "translateZ(14px)",
                                                    border: isActive
                                                        ? "1px solid rgba(255,255,255,0.25)"
                                                        : "1px solid rgba(255,255,255,0.08)",
                                                    backdropFilter: "blur(6px)",
                                                }}
                                            >
                                                {/* glossy top reflection */}
                                                <div
                                                    className="absolute inset-0 rounded-2xl"
                                                    style={{
                                                        background:
                                                            "linear-gradient(180deg, rgba(255,255,255,0.18), transparent 45%)",
                                                        mixBlendMode: "overlay",
                                                    }}
                                                />

                                                {/* icon */}
                                                <div className="text-white/95 relative z-10">{p.icon}</div>

                                                {/* pulse when scenario running */}
                                                {pulseActive && (
                                                    <motion.div
                                                        layoutId={`pulse-${p.name}`}
                                                        initial={{ scale: 1 }}
                                                        animate={{ scale: [1, 1.2, 1], opacity: [0.9, 0.5, 0] }}
                                                        transition={{ duration: 1.2, repeat: Infinity }}
                                                        className="absolute inset-0 rounded-2xl"
                                                        style={{
                                                            background:
                                                                "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.25), transparent 70%)",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </motion.div>

                                        <div className="mt-3 font-semibold tracking-wide">{p.name}</div>
                                    </div>
                                );
                            })}
                        </div>


                    </div>

                    {/* agents grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {agentsByPhase[activePhase].map((agent, i) => (
                            <motion.div
                                key={agent}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.035, duration: 0.35 }}
                                whileHover={{ y: -6, scale: 1.02 }}
                                style={{ perspective: 1200 }}
                                className="group relative rounded-2xl"
                            >
                                {/* elevation shadow */}
                                <div
                                    className="absolute inset-0 rounded-2xl"
                                    style={{
                                        transform: "translateY(8px) scale(0.96)",
                                        background:
                                            "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.6))",
                                        filter: "blur(14px)",
                                        opacity: 0.6,
                                    }}
                                />

                                {/* main surface */}
                                <motion.div
                                    className={`${panelBg()} ${subtleBorder()} relative rounded-2xl p-5 overflow-hidden`}
                                    whileHover={{ rotateX: -3, rotateY: 4 }}
                                    transition={{ type: "spring", stiffness: 160, damping: 18 }}
                                    style={{
                                        transformStyle: "preserve-3d",
                                        background:
                                            "linear-gradient(165deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))",
                                        boxShadow:
                                            "0 10px 30px rgba(2,6,23,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
                                    }}
                                >
                                    {/* SDLC phase accent line */}
                                    <div
                                        className="absolute top-0 left-0 h-1 w-full opacity-80"
                                        style={{
                                            background:
                                                activePhase === "Discover"
                                                    ? "#6366f1"
                                                    : activePhase === "Design"
                                                        ? "#f43f5e"
                                                        : activePhase === "Engineer"
                                                            ? "#3b82f6"
                                                            : "#10b981",
                                        }}
                                    />

                                    {/* subtle shine sweep */}
                                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                                        <div
                                            className="absolute -left-1/2 top-0 h-full w-1/2 rotate-12"
                                            style={{
                                                background:
                                                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                                            }}
                                        />
                                    </div>

                                    {/* content */}
                                    <div className="relative z-10 flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="font-semibold text-lg truncate">{agent}</div>
                                            <div className="text-sm opacity-60 mt-1">
                                                AI-powered automation
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-xs text-emerald-400 font-medium">
                                                Verified
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setOpenAgent(agent)}
                                                    className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition"
                                                >
                                                    <Play size={14} />
                                                </button>

                                                <button className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition">
                                                    <FileText size={14} />
                                                </button>

                                                <button className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition">
                                                    <Download size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 text-sm opacity-70 relative z-10">
                                        Quick actions: preview, generate sample, export.
                                    </div>
                                </motion.div>
                            </motion.div>

                        ))}
                    </div>

                    {/* layout grid for the right column */}

                </div>

                {/* Agent drawer */}
                <AnimatePresence>
                    {openAgent && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex justify-end">
                            <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ type: "spring", stiffness: 120 }} className="w-full sm:w-[420px] h-full bg-[#071226] border-l border-white/10 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="text-lg font-semibold truncate">{openAgent}</div>
                                    <button onClick={() => { setOpenAgent(null); setRunningScenario(null); }}><X /></button>
                                </div>

                                <div className="space-y-4 text-sm opacity-80">
                                    {runningScenario ? (
                                        <>
                                            <div className="text-xs opacity-60">Scenario in progress — agent output</div>
                                            <pre className="font-mono text-sm bg-[#051826] p-3 rounded-md min-h-[80px]">{scenarioText || "Preparing output..."}</pre>
                                        </>
                                    ) : (
                                        <>
                                            <p>Understanding requirements…</p>
                                            <p>Generating BRD document…</p>
                                            <p>Validating architecture & risks…</p>
                                            <p className="text-emerald-400">✔ Ready for export</p>
                                        </>
                                    )}
                                </div>

                                <button className="mt-8 w-full py-3 rounded-xl bg-white text-black font-semibold">Export to Word</button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Scenario modal */}
                <AnimatePresence>
                    {scenarioModalOpen && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black" onClick={() => setScenarioModalOpen(false)} />
                            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                                <div className="w-full max-w-[980px] bg-white/6 backdrop-blur rounded-2xl border border-white/10 p-4 sm:p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <div className="text-xl font-semibold">Scenario Library</div>
                                            <div className="text-sm opacity-60">Pick a demo playbook and run a cinematic multi-agent flow.</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="px-3 py-2 rounded-md bg-white/8" onClick={() => setScenarioModalOpen(false)}>Close</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {scenarios.map((s) => (
                                            <motion.div key={s.id} whileHover={{ scale: 1.02 }} className="p-4 rounded-lg bg-[#071b29] border border-white/6 flex flex-col justify-between">
                                                <div>
                                                    <div className="font-semibold">{s.title}</div>
                                                    <div className="text-sm opacity-70 mt-1">{s.summary}</div>
                                                    <div className="mt-2 text-xs opacity-60">Agents: {s.agents.join(", ")}</div>
                                                </div>

                                                <div className="mt-4 flex gap-2">
                                                    <button className="px-3 py-2 rounded-md bg-indigo-600 text-white" onClick={() => startScenario(s.id)}>Run</button>
                                                    <button className="px-3 py-2 rounded-md bg-white/8" onClick={() => setOpenAgent(s.agents[0])}>Preview</button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Command palette */}
                <AnimatePresence>
                    {paletteOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center pt-28 pointer-events-none">
                            <div className="w-full max-w-[720px] pointer-events-auto px-4 sm:px-0">
                                <motion.div initial={{ y: -8 }} animate={{ y: 0 }} exit={{ y: -8 }} className="rounded-xl bg-[#081426] border border-white/8 shadow-xl">
                                    <div className="p-3 border-b border-white/6 flex items-center gap-3">
                                        <Search size={16} />
                                        <input ref={paletteRef} value={paletteQuery} onChange={(e) => setPaletteQuery(e.target.value)} placeholder="Type command (e.g. 'Run Payments BRD')" className="bg-transparent outline-none w-full text-sm p-1" />
                                        <div className="text-xs opacity-60">Esc to close</div>
                                    </div>

                                    <div className="max-h-64 overflow-auto p-3">
                                        {filteredCommands.length === 0 && <div className="text-sm opacity-60 p-2">No commands found</div>}
                                        {filteredCommands.map((c) => (
                                            <button key={c.id} onClick={() => { c.action(); setPaletteOpen(false); }} className="w-full text-left p-3 rounded-md hover:bg-white/6">
                                                <div className="font-medium">{c.title}</div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AppShell>
    );
}