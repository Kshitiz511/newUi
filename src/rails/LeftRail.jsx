import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, MessageSquare, LifeBuoy, Shield, Activity, X, 
  ShieldAlert, Terminal
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Enterprise Modal — ADAPTIVE THEME (Light & Dark)                           */
/* -------------------------------------------------------------------------- */

function EnterpriseModal({ title, subtitle, onClose, children }) {
  // Portal logic to escape sidebar constraints
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 font-sans">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Shell: Now supports Light (White) & Dark (Navy) */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-[980px] max-w-full bg-white/90 dark:bg-[#0a192f]/95 backdrop-blur-2xl rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
          <div>
            <div className="text-xl font-bold tracking-tight">{title}</div>
            {subtitle && (
              <div className="text-sm text-slate-500 dark:text-white/50 mt-1">{subtitle}</div>
            )}
          </div>

          <button
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-white/70"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

/* -------------------------------------------------------------------------- */
/* Adaptive Window Contents                                                   */
/* -------------------------------------------------------------------------- */

function ChatWindow() {
  return (
    <div className="h-[450px] flex flex-col gap-4">
      <div className="flex-1 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 p-4 overflow-auto text-sm text-slate-700 dark:text-white/80 font-mono">
        <div className="mb-4 text-slate-400 dark:text-white/40 text-xs uppercase tracking-widest">System Log Initialized</div>
        <div className="space-y-3">
            <div className="flex gap-3">
                <div className="w-6 h-6 rounded bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">AI</div>
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent p-3 rounded-r-xl rounded-bl-xl shadow-sm dark:shadow-none max-w-[80%]">
                    AI delivery workspace ready. I can help you configure agents, audit code, or draft requirements.
                </div>
            </div>
        </div>
      </div>

      <div className="flex gap-3">
        <input
          className="flex-1 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 transition-all"
          placeholder="Ask the AI delivery system..."
        />
        <button className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">
          Send
        </button>
      </div>
    </div>
  );
}

function SupportWindow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
            <h3 className="text-lg font-semibold text-indigo-900 dark:text-white mb-2">Enterprise Contact</h3>
            <div className="space-y-2 text-sm text-slate-600 dark:text-white/70">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></div> Operations Online</div>
                <div>Email: <span className="text-slate-900 dark:text-white font-medium">support@ai-delivery.com</span></div>
                <div>Phone: <span className="text-slate-900 dark:text-white font-medium">+91-90000-00000</span></div>
            </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-white/50">
            Avg. Response Time: &lt; 15 mins
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <textarea
          className="flex-1 min-h-[200px] rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none placeholder:text-slate-400 dark:placeholder:text-white/30"
          placeholder="Describe your issue or feature request..."
        />
        <button className="py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-opacity">
            Submit Ticket
        </button>
      </div>
    </div>
  );
}

function StartProjectWindow() {
  const [mode, setMode] = useState("Agile");

  return (
    <div className="space-y-8">
      {/* mode switch */}
      <div className="flex gap-4 mb-6">
        {["Agile", "Waterfall"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === m 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
              : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* SDLC energy flow */}
      <div className="space-y-6">
        {["Discover", "Design", "Engineer", "Secure", "Deploy"].map(
          (step, i) => (
            <div key={step} className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-400 dark:text-white/50 uppercase tracking-wider">
                    <span>{step} Phase</span>
                    <span>Ready</span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "100%", opacity: 1 }}
                        transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                    />
                </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function GuardrailsWindow() {
  const metrics = [
    { label: "Jailbreak Attempts Blocked", value: "1,284", color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-400/10", icon: ShieldAlert },
    { label: "Prompt Injections Prevented", value: "842", color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-400/10", icon: Terminal },
    { label: "Secrets Leakage Prevented", value: "63", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-400/10", icon: Shield },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
            <div
            key={m.label}
            className="rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 p-6 flex flex-col items-center text-center hover:border-indigo-500/30 transition-colors"
            >
            <div className={`p-3 rounded-full mb-4 ${m.bg} ${m.color}`}>
                <Icon size={24} />
            </div>
            <div className={`text-3xl font-bold mb-2 ${m.color}`}>{m.value}</div>
            <div className="text-xs text-slate-500 dark:text-white/50 uppercase tracking-wide font-medium">{m.label}</div>
            </div>
        );
      })}
    </div>
  );
}

function MonitoringWindow() {
  const metrics = [
    "Total API Calls",
    "Tokens Sent",
    "Tokens Lost",
    "Agent Drift Score",
  ];

  return (
    <div className="space-y-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="h-20 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 flex items-center justify-between px-6 hover:border-indigo-500/50 transition-colors group"
        >
            <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:animate-ping" />
                <span className="text-slate-700 dark:text-white/80 font-medium">{m}</span>
            </div>
            
            {/* Sparkline */}
            <div className="flex items-end gap-1 h-8">
                {[40, 60, 45, 70, 50, 80, 65, 90].map((h, idx) => (
                    <div 
                        key={idx} 
                        style={{ height: `${h}%` }} 
                        className="w-1 bg-slate-300 dark:bg-white/10 rounded-t-sm group-hover:bg-indigo-400 transition-colors"
                    />
                ))}
            </div>
        </motion.div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Left Rail — FIXED COLORS HERE                                         */
/* -------------------------------------------------------------------------- */

const items = [
  { icon: Play, label: "Start Project", sub: "Initialize autonomous SDLC execution" },
  { icon: MessageSquare, label: "Chat", sub: "Conversational control over agents" },
  { icon: LifeBuoy, label: "Support", sub: "Direct connection to operations" },
  { icon: Shield, label: "Guardrails", sub: "Real-time threat protection" },
  { icon: Activity, label: "Monitoring", sub: "Live drift detection & telemetry" },
];

export default function LeftRail({ isLight = false }) {
  const [open, setOpen] = useState(null);

  const renderContent = () => {
    switch (open) {
      case "Start Project": return <StartProjectWindow />;
      case "Chat": return <ChatWindow />;
      case "Support": return <SupportWindow />;
      case "Guardrails": return <GuardrailsWindow />;
      case "Monitoring": return <MonitoringWindow />;
      default: return null;
    }
  };

  const activeItem = items.find(i => i.label === open);

  return (
    <>
      {/* SIDEBAR CONTAINER FIX:
         - Light mode: bg-white/40 + border-slate-200
         - Dark mode: bg-[#071226]/40 + border-white/5
      */}
      <div
        className={`flex flex-col gap-4 w-16 items-center py-4 backdrop-blur-xl h-full border-r shadow-[0_8px_18px_rgba(15,23,42,0.12)] transition-colors duration-300 ${
          isLight
            ? "bg-white/90 border-white/80"
            : "bg-[#071226]/40 border-white/5"
        }`}
      >
        {items.map((item, i) => {
          const Icon = item.icon;
          const isActive = open === item.label;

          return (
            <button
              key={i}
              onClick={() => setOpen(item.label)}
              className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/40"
                  : isLight
                    ? "bg-white/75 border-white/70 text-slate-700 shadow-[0_6px_14px_rgba(15,23,42,0.16)] hover:bg-white"
                    : "bg-transparent border-transparent text-white/40 hover:bg-white/10 hover:text-white"
              }`}
              title={item.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      {/* Modal renders into Portal */}
      <AnimatePresence>
        {open && (
          <EnterpriseModal
            title={open}
            subtitle={activeItem?.sub}
            onClose={() => setOpen(null)}
          >
            {renderContent()}
          </EnterpriseModal>
        )}
      </AnimatePresence>
    </>
  );
}