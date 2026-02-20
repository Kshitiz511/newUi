import React from "react";

/**
 * ENTERPRISE APP SHELL — FINAL (THEME-DRIVEN)
 * -------------------------------------------
 * • Single scroll container (center workspace)
 * • Floating left / right rails
 * • Global theme source of truth
 * • No nested scroll bugs
 * • Clean light & dark mode switching
 */

export default function AppShell({ left = null, right = null, isLight = false, children }) {
  const rootClasses = isLight
    ? "bg-[#f6f7fb] text-slate-900"
    : "bg-gradient-to-br from-[#07122b] via-[#071a36] to-[#031026] text-white";

  const railClasses = isLight
    ? "backdrop-blur-2xl bg-white/85 border border-white/70 rounded-2xl p-3 shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
    : "backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-3 shadow-[0_0_40px_rgba(99,102,241,0.25)]";

  return (
    <div className={`min-h-screen w-full overflow-x-hidden relative ${rootClasses}`}>
      
      {/* LEFT FLOATING RAIL */}
      {left && (
        <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40">
          <div className={railClasses}>
            {left}
          </div>
        </aside>
      )}

      {/* RIGHT FLOATING RAIL */}
      {right && (
        <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
          <div className={railClasses}>
            {right}
          </div>
        </aside>
      )}

      {/* MAIN WORKSPACE */}
      <main className="relative z-10 w-full">
        <div className="w-full pl-[136px] pr-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
