'use client'
import { useState, createContext, useContext, useEffect, useRef } from "react";
import { supabase } from '@/lib/supabase'

// ─── THEME SYSTEM ────────────────────────────────────────────────────────────
const THEMES = {
  fire: {
    name: "Fire", emoji: "🔥",
    bg: "#1a1111", card: "#2a1c1c", card2: "#342424", border: "#4a3030", navBg: "#161010",
    primary: "#f97316", secondary: "#facc15", accent: "#fb923c",
    red: "#ef4444", green: "#4ade80", text: "#faf0f0", muted: "#b09090", dim: "#6a4a4a",
    gradA: "#f97316", gradB: "#facc15", glow: "rgba(249,115,22,0.25)",
    catColors: ["#f97316","#fb923c","#facc15","#fbbf24","#f59e0b","#ea580c","#fdba74","#fed7aa","#4ade80","#6b7280"],
    light: { bg: "#fafaf9", card: "#ffffff", card2: "#f5f0eb", border: "#e8ddd0", navBg: "#ffffff", text: "#1a1208", muted: "#78716c", dim: "#c4b5a0" },
  },
  water: {
    name: "Water", emoji: "🌊",
    bg: "#0e1620", card: "#162030", card2: "#1c2a3e", border: "#284860", navBg: "#0a1018",
    primary: "#38bdf8", secondary: "#7dd3fc", accent: "#0ea5e9",
    red: "#f87171", green: "#34d399", text: "#e8f4fe", muted: "#8ab8d8", dim: "#3a6888",
    gradA: "#38bdf8", gradB: "#818cf8", glow: "rgba(56,189,248,0.25)",
    catColors: ["#38bdf8","#0ea5e9","#7dd3fc","#818cf8","#a78bfa","#60a5fa","#93c5fd","#bae6fd","#34d399","#64748b"],
    light: { bg: "#f0f9ff", card: "#ffffff", card2: "#e0f2fe", border: "#bae6fd", navBg: "#ffffff", text: "#082f49", muted: "#4a90a4", dim: "#a5d8f0" },
  },
  nature: {
    name: "Nature", emoji: "🌿",
    bg: "#101810", card: "#1a2418", card2: "#202e1e", border: "#304830", navBg: "#0c140c",
    primary: "#4ade80", secondary: "#a3e635", accent: "#22c55e",
    red: "#f87171", green: "#86efac", text: "#f0fdf0", muted: "#90b890", dim: "#487048",
    gradA: "#4ade80", gradB: "#a3e635", glow: "rgba(74,222,128,0.25)",
    catColors: ["#4ade80","#22c55e","#a3e635","#84cc16","#65a30d","#16a34a","#86efac","#bbf7d0","#34d399","#6b7280"],
    light: { bg: "#f7fef7", card: "#ffffff", card2: "#f0fdf4", border: "#bbf7d0", navBg: "#ffffff", text: "#052e16", muted: "#4a7c59", dim: "#a7d9b2" },
  },
  earth: {
    name: "Earth", emoji: "🪨",
    bg: "#1a1208", card: "#2a1f14", card2: "#342618", border: "#4a3828", navBg: "#161008",
    primary: "#d4924f", secondary: "#ecc47a", accent: "#b8722a",
    red: "#e05a5a", green: "#7abf7a", text: "#f8f0e6", muted: "#b89878", dim: "#6a5040",
    gradA: "#d4924f", gradB: "#ecc47a", glow: "rgba(212,146,79,0.25)",
    catColors: ["#d4924f","#b8722a","#ecc47a","#d4955a","#b87040","#8b4513","#deb887","#f5deb3","#7abf7a","#6b5a4a"],
    light: { bg: "#fdf8f2", card: "#ffffff", card2: "#faf0e6", border: "#e8d5bc", navBg: "#ffffff", text: "#2c1a0a", muted: "#8b6040", dim: "#d4b896" },
  },
  floral: {
    name: "Floral", emoji: "🌸",
    bg: "#1a1020", card: "#281828", card2: "#321e34", border: "#4a2e52", navBg: "#140c18",
    primary: "#e879f9", secondary: "#f9a8d4", accent: "#c026d3",
    red: "#fb7185", green: "#4ade80", text: "#fef0ff", muted: "#d0a8d8", dim: "#6a4870",
    gradA: "#e879f9", gradB: "#f9a8d4", glow: "rgba(232,121,249,0.25)",
    catColors: ["#e879f9","#c026d3","#f9a8d4","#f0abfc","#a855f7","#db2777","#fda4af","#fbcfe8","#4ade80","#6b7280"],
    light: { bg: "#fdf4ff", card: "#ffffff", card2: "#fae8ff", border: "#f0abfc", navBg: "#ffffff", text: "#3b0764", muted: "#9d5aad", dim: "#e4b8f0" },
  },
};

const applyMode = (theme, isLight) => isLight ? { ...theme, ...theme.light } : theme;
const ThemeCtx = createContext(THEMES.fire);
const useT = () => useContext(ThemeCtx);

// ─── TRAINING PLAN DATA ───────────────────────────────────────────────────────
const WARMUP = [
  { id: "w1", num: "I",    name: "Shoulder Rotations",                    sets: 1, reps: "30",    band: null,  note: null },
  { id: "w2", num: "II",   name: "Elbow Rotations",                       sets: 1, reps: "60",    band: null,  note: null },
  { id: "w3", num: "III",  name: "Wrist Rotations",                       sets: 1, reps: "30",    band: null,  note: null },
  { id: "w4", num: "IV",   name: "Banded Shoulder Pass",                  sets: 1, reps: "20",    band: "Red", note: null },
  { id: "w5", num: "V",    name: "Banded External Rotations",             sets: 1, reps: "10",    band: "Red", note: null },
  { id: "w6", num: "V",    name: "Wrist Circles",                         sets: 1, reps: "10",    band: null,  note: null },
  { id: "w7", num: "V",    name: "Wrist Push-ups / Reverse Push-ups",     sets: 1, reps: "20",    band: null,  note: null },
  { id: "w8", num: "VI",   name: "Light Band Activation (Triceps/Biceps)",sets: 1, reps: "20",    band: "Red", note: "20/10 split (pull day: 20 bicep, 10 tricep. Push day: 20 tricep, 10 bicep)" },
];

const DAYS = [
  {
    id: "day1", label: "Day 1", title: "Push", day: "Monday",
    exercises: [
      { id: "d1e1", num: "I",   name: "Active Hangs — Static Hold",       sets: 4, reps: "5–30",  rest: "1:00", target: "BW",   note: "Shoulders depressed, aim for 30 seconds per set" },
      { id: "d1e2", num: "II",  name: "Elevated BW Bench Dips",           sets: 4, reps: "5–20",  rest: "3:00", target: "BW",   note: "Shoulders back, chest proud" },
      { id: "d1e3", num: "III", name: "Push Ups",                         sets: 3, reps: "8–20",  rest: "3:00", target: "BW",   note: "Focus on full scapular extension and retraction on each rep" },
      { id: "d1e4", num: "IV",  name: "Seated Arnold DB Press",           sets: 3, reps: "5–12",  rest: "1:30", target: 12.5,   note: null },
      { id: "d1e5", num: "V",   name: "Frog Stand Holds — Static Hold",   sets: 3, reps: "5–20",  rest: "1:00", target: "BW",   note: "Start at 5 seconds per set" },
      { id: "d1e6", num: "VI",  name: "DB Tricep Extensions",             sets: 3, reps: "5–12",  rest: "1:30", target: 20,     note: null },
    ]
  },
  {
    id: "day2", label: "Day 2", title: "Pull", day: "Tuesday",
    exercises: [
      { id: "d2e1", num: "I",   name: "Banded Chin-up Negatives",         sets: 4, reps: "8–12",  rest: "3:00", target: "Black", note: "One foot in band, set grip before you jump into it, then descend slowly controlled" },
      { id: "d2e2", num: "II",  name: "DB Hammer Curls",                  sets: 3, reps: "5–12",  rest: "1:30", target: 15,      note: "Neutral grip, don't swing the weight or your body" },
      { id: "d2e3", num: "III", name: "Scapular Pull-ups",                sets: 3, reps: "8–20",  rest: "1:30", target: "BW",    note: "Chest proud (like the active hang position), for reps" },
      { id: "d2e4", num: "IV",  name: "DB Rows",                          sets: 3, reps: "5–12",  rest: "1:30", target: 20,      note: "Slow controlled descent, full stretch" },
      { id: "d2e5", num: "V",   name: "Dead Hangs — Static Hold",         sets: 4, reps: "10–30", rest: "1:00", target: "BW",    note: "Sink into it, aim for 30 seconds per set" },
      { id: "d2e6", num: "VI",  name: "DB Reverse Wrist Curls",           sets: 3, reps: "8–20",  rest: "1:00", target: 10,      note: null },
    ]
  },
  {
    id: "day4", label: "Day 3", title: "Push", day: "Thursday",
    exercises: [
      { id: "d4e1", num: "I",   name: "Dead Hangs — Static Hold",         sets: 4, reps: "10–30", rest: "1:00", target: "BW",   note: "Sink into it, aim for 30 seconds per set" },
      { id: "d4e2", num: "II",  name: "Decline Push-ups",                 sets: 4, reps: "8–20",  rest: "3:00", target: "BW",   note: "Feet elevated, still focus on full scapular extension and retraction on each rep" },
      { id: "d4e3", num: "III", name: "Elevated BW Bench Dips",           sets: 3, reps: "5–20",  rest: "3:00", target: "BW",   note: "Shoulders back, chest proud" },
      { id: "d4e4", num: "IV",  name: "Side Delt Lateral DB Raise",       sets: 3, reps: "8–15",  rest: "1:30", target: 10,     note: "One arm holding onto something for stability, do one arm at a time" },
      { id: "d4e5", num: "V",   name: "DB Trap Shrugs",                   sets: 4, reps: "8–15",  rest: "1:30", target: 15,     note: null },
      { id: "d4e6", num: "VI",  name: "Banded External Rotations",        sets: 4, reps: "8–15",  rest: "1:00", target: "Red",  note: "Pulling away from body" },
    ]
  },
  {
    id: "day5", label: "Day 4", title: "Pull", day: "Friday",
    exercises: [
      { id: "d5e1", num: "I",   name: "Banded Chin-up Negatives",         sets: 4, reps: "8–12",  rest: "3:00", target: "Black", note: "One foot in band, set grip before you jump, hold at top for 5 seconds, then descend" },
      { id: "d5e2", num: "II",  name: "Hollow Body Holds — Static Hold",  sets: 4, reps: "5–30",  rest: "1:00", target: "BW",    note: null },
      { id: "d5e3", num: "III", name: "Band Assisted Static Holds",       sets: 4, reps: "2–10",  rest: "1:00", target: "BW",    note: "One foot in band, hold at the top for 5 seconds" },
      { id: "d5e4", num: "IV",  name: "DB Hammer Curls",                  sets: 3, reps: "5–12",  rest: "1:30", target: 15,      note: "Neutral grip, don't swing the weight or your body" },
      { id: "d5e5", num: "V",   name: "DB Rows",                          sets: 3, reps: "5–12",  rest: "1:30", target: 20,      note: null },
      { id: "d5e6", num: "VI",  name: "Scapular Pull-ups",                sets: 3, reps: "8–20",  rest: "1:30", target: "BW",    note: "Chest proud (like the active hang position), for reps" },
    ]
  },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  const T = useT();
  return <div style={{ background: T.card, borderRadius: 16, padding: 18, border: `1px solid ${T.border}`, ...style }}>{children}</div>;
}
function Label({ children }) {
  const T = useT();
  return <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{children}</div>;
}
function GhostBtn({ children, onClick, style = {} }) {
  const T = useT();
  return <button onClick={onClick} style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, color: T.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 13, padding: "6px 12px", ...style }}>{children}</button>;
}
function PrimaryBtn({ children, onClick, style = {} }) {
  const T = useT();
  return <button onClick={onClick} style={{ background: `linear-gradient(135deg,${T.gradA},${T.gradB}88)`, border: `1px solid ${T.primary}`, borderRadius: 10, color: "#000", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "11px 16px", ...style }}>{children}</button>;
}
function OutlineBtn({ children, onClick, style = {} }) {
  const T = useT();
  return <button onClick={onClick} style={{ background: "transparent", border: `1px solid ${T.primary}`, borderRadius: 10, color: T.primary, cursor: "pointer", fontFamily: "inherit", fontSize: 14, padding: "11px 16px", ...style }}>{children}</button>;
}
const Ring = ({ pct, size = 90, stroke = 8, color }) => {
  const T = useT();
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, dash = (Math.min(100, pct) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.card2} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color || T.primary} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color || T.primary})`, transition: "stroke-dasharray .6s" }} />
    </svg>
  );
};

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ tab, setTab }) {
  const T = useT();
  const tabs = [
    { id: "overview", label: "Home",  icon: "◈" },
    { id: "day1",     label: "Mon",   icon: "①" },
    { id: "day2",     label: "Tue",   icon: "②" },
    { id: "day4",     label: "Thu",   icon: "③" },
    { id: "day5",     label: "Fri",   icon: "④" },
    { id: "meals",    label: "Meals", icon: "🍽" },
    { id: "timer",    label: "Timer", icon: "◷" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto", background: T.navBg, borderTop: `1px solid ${T.border}`, display: "flex", zIndex: 100 }}>
      {tabs.map(t => {
        const active = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: "none", border: "none", padding: "10px 1px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, position: "relative" }}>
            {active && <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: `linear-gradient(90deg,${T.gradA},${T.gradB})`, borderRadius: "0 0 4px 4px", boxShadow: `0 0 10px ${T.primary}` }} />}
            <span style={{ fontSize: 15, color: active ? T.primary : T.dim, transition: "color .2s" }}>{t.icon}</span>
            <span style={{ fontSize: 8, letterSpacing: 0.3, color: active ? T.primary : T.dim, fontFamily: "'Outfit',sans-serif", textTransform: "uppercase" }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── WEIGHT INPUT CELL ────────────────────────────────────────────────────────
function WeightCell({ value, onChange, target, unit }) {
  const T = useT();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ""));
  const isBW = typeof target === "string" && (target === "BW" || target === "Black" || target === "Red");

  if (isBW) {
    return (
      <span style={{ color: T.muted, fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>
        {target === "BW" ? "BW" : `${target} band`}
      </span>
    );
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { setEditing(false); const n = parseFloat(draft); if (!isNaN(n)) onChange(n); else setDraft(String(value ?? "")); }}
        onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") { setEditing(false); setDraft(String(value ?? "")); } }}
        style={{ width: 52, background: T.card2, border: `1px solid ${T.primary}`, borderRadius: 6, color: T.text, fontFamily: "'Outfit',sans-serif", fontSize: 13, padding: "3px 6px", textAlign: "center" }}
      />
    );
  }

  const hasValue = value !== null && value !== undefined;
  const isAtTarget = hasValue && value >= target;
  return (
    <button onClick={() => { setDraft(String(value ?? target ?? "")); setEditing(true); }}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      <span style={{ fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: hasValue ? (isAtTarget ? T.green : T.primary) : T.dim }}>
        {hasValue ? `${value}` : "—"}
      </span>
      {hasValue && <span style={{ fontSize: 9, color: T.muted }}>{unit}</span>}
      {!hasValue && <span style={{ fontSize: 9, color: T.dim }}>tap</span>}
    </button>
  );
}

// ─── EXERCISE ROW ─────────────────────────────────────────────────────────────
function ExerciseRow({ ex, weights, onWeightChange, unit, expanded, onToggle }) {
  const T = useT();
  const w = weights[ex.id];
  const isBW = typeof ex.target === "string";
  const atTarget = !isBW && w !== null && w !== undefined && w >= ex.target;

  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      <div onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", cursor: "pointer" }}>
        <div style={{ width: 26, height: 26, borderRadius: 8, background: T.card2, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 9, color: T.muted, fontFamily: "'Outfit',sans-serif" }}>{ex.num}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: T.text, fontWeight: 500, lineHeight: 1.3 }}>{ex.name}</div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{ex.sets} sets · {ex.reps} reps · rest {ex.rest}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, marginRight: 6 }}>
          <WeightCell value={w} onChange={v => onWeightChange(ex.id, v)} target={ex.target} unit={unit} />
          {!isBW && (
            <div style={{ fontSize: 9, color: atTarget ? T.green : T.muted }}>
              tgt: {ex.target}{unit}
            </div>
          )}
        </div>
        <span style={{ color: T.dim, fontSize: 10 }}>{expanded ? "▲" : "▼"}</span>
      </div>
      {expanded && ex.note && (
        <div style={{ background: T.card2, borderRadius: 10, padding: "10px 12px", marginBottom: 12, borderLeft: `3px solid ${T.primary}` }}>
          <span style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>{ex.note}</span>
        </div>
      )}
    </div>
  );
}

// ─── WARMUP SECTION ───────────────────────────────────────────────────────────
function WarmupSection({ expanded, onToggle }) {
  const T = useT();
  const [expandedItem, setExpandedItem] = useState(null);
  return (
    <Card style={{ marginBottom: 14 }}>
      <div onClick={onToggle} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: expanded ? 14 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `${T.primary}22`, border: `1px solid ${T.primary}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16 }}>🔥</span>
          </div>
          <div>
            <div style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>Warmup</div>
            <div style={{ fontSize: 11, color: T.muted }}>Every session · {WARMUP.length} exercises</div>
          </div>
        </div>
        <span style={{ color: T.dim, fontSize: 12 }}>{expanded ? "▲" : "▼"}</span>
      </div>
      {expanded && (
        <div>
          {WARMUP.map(w => (
            <div key={w.id} style={{ borderBottom: `1px solid ${T.border}` }}>
              <div onClick={() => setExpandedItem(expandedItem === w.id ? null : w.id)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", cursor: w.note ? "pointer" : "default" }}>
                <span style={{ fontSize: 10, color: T.muted, width: 20, textAlign: "center", fontFamily: "'Outfit',sans-serif" }}>{w.num}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: T.text }}>{w.name}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{w.sets} set · {w.reps} reps{w.band ? ` · ${w.band} band` : ""}</div>
                </div>
                {w.note && <span style={{ color: T.dim, fontSize: 10 }}>{expandedItem === w.id ? "▲" : "▼"}</span>}
              </div>
              {expandedItem === w.id && w.note && (
                <div style={{ background: T.card2, borderRadius: 10, padding: "10px 12px", marginBottom: 10, borderLeft: `3px solid ${T.accent}` }}>
                  <span style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>{w.note}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ─── DAY TAB ──────────────────────────────────────────────────────────────────
function DayTab({ day, weights, onWeightChange, unit }) {
  const T = useT();
  const [warmupOpen, setWarmupOpen] = useState(false);
  const [expandedEx, setExpandedEx] = useState(null);
  const isPush = day.title === "Push";

  return (
    <div style={{ padding: "80px 16px 100px" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 28, fontFamily: "'Playfair Display',serif", fontWeight: 700, background: `linear-gradient(135deg,${T.gradA},${T.gradB})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {day.label}
          </span>
          <span style={{ fontSize: 14, color: T.muted, fontFamily: "'Outfit',sans-serif" }}>— {day.day}</span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: "4px 12px" }}>
          <span style={{ fontSize: 14 }}>{isPush ? "💪" : "🏋️"}</span>
          <span style={{ fontSize: 12, color: T.primary, fontWeight: 600, letterSpacing: 1 }}>{day.title.toUpperCase()}</span>
        </div>
      </div>

      <WarmupSection expanded={warmupOpen} onToggle={() => setWarmupOpen(!warmupOpen)} />

      <Card>
        <Label>Exercises — {day.exercises.length} stations</Label>
        {day.exercises.map(ex => (
          <ExerciseRow
            key={ex.id}
            ex={ex}
            weights={weights}
            onWeightChange={onWeightChange}
            unit={unit}
            expanded={expandedEx === ex.id}
            onToggle={() => setExpandedEx(expandedEx === ex.id ? null : ex.id)}
          />
        ))}
      </Card>
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({ weights, bodyweight, onBodyweightChange, height, onHeightChange, unit, todayLog, recipes }) {
  const T = useT();
  const [bwDraft, setBwDraft] = useState(String(bodyweight ?? ""));
  const [editingBw, setEditingBw] = useState(false);
  const [htDraft, setHtDraft] = useState(String(height ?? ""));
  const [editingHt, setEditingHt] = useState(false);
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  const proteinTarget = bodyweight ? Math.round(bodyweight * 2) : null;
  const todayCals = todayLog.reduce((sum, entry) => {
    const r = recipes.find(r => r.id === entry.id);
    if (!r) return sum;
    const perServing = r.servings > 0 ? r.calories / r.servings : r.calories;
    return sum + Math.round(perServing * (entry.servings ?? 1));
  }, 0);
  const todayProtein = todayLog.reduce((sum, entry) => {
    const r = recipes.find(r => r.id === entry.id);
    if (!r) return sum;
    const perServing = r.servings > 0 ? r.protein / r.servings : r.protein;
    return sum + perServing * (entry.servings ?? 1);
  }, 0);

  return (
    <div style={{ padding: "70px 0 100px" }}>
      {/* Hero banner */}
      <div style={{ padding: "28px 20px 24px", borderBottom: `1px solid ${T.border}`, marginBottom: 16, background: `linear-gradient(160deg,${T.card} 0%,${T.bg} 100%)` }}>
        <div style={{ fontSize: 10, color: T.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>{today}</div>
        <div style={{ fontSize: 42, fontFamily: "'Playfair Display',serif", fontWeight: 700, background: `linear-gradient(135deg,${T.gradA},${T.gradB})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1, marginBottom: 4 }}>
          Nico's Plan
        </div>
        <div style={{ fontSize: 12, color: T.muted, letterSpacing: 1 }}>2026 Training Regime · Push & Pull</div>

        {/* Body stats row */}
        <div style={{ marginTop: 20, display: "flex", gap: 16 }}>
          {/* Bodyweight */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Weight</div>
            {editingBw ? (
              <input autoFocus value={bwDraft} onChange={e => setBwDraft(e.target.value)}
                onBlur={() => { setEditingBw(false); const n = parseFloat(bwDraft); if (!isNaN(n)) onBodyweightChange(n); else setBwDraft(String(bodyweight ?? "")); }}
                onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
                style={{ background: T.card2, border: `1px solid ${T.primary}`, borderRadius: 8, color: T.text, fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 700, padding: "4px 10px", width: 100, outline: "none" }}
              />
            ) : (
              <div onClick={() => { setBwDraft(String(bodyweight ?? "")); setEditingBw(true); }} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 36, fontFamily: "'Outfit',sans-serif", fontWeight: 700, background: bodyweight ? `linear-gradient(135deg,${T.gradA},${T.gradB})` : "none", WebkitBackgroundClip: bodyweight ? "text" : "none", WebkitTextFillColor: bodyweight ? "transparent" : T.dim, color: bodyweight ? undefined : T.dim }}>
                  {bodyweight ?? "—"}
                </span>
                {bodyweight && <span style={{ fontSize: 13, color: T.muted }}>{unit}</span>}
              </div>
            )}
            {!bodyweight && <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>tap to log</div>}
          </div>

          {/* Height */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Height</div>
            {editingHt ? (
              <input autoFocus value={htDraft} onChange={e => setHtDraft(e.target.value)}
                onBlur={() => { setEditingHt(false); const n = parseFloat(htDraft); if (!isNaN(n)) onHeightChange(n); else setHtDraft(String(height ?? "")); }}
                onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
                style={{ background: T.card2, border: `1px solid ${T.primary}`, borderRadius: 8, color: T.text, fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 700, padding: "4px 10px", width: 100, outline: "none" }}
              />
            ) : (
              <div onClick={() => { setHtDraft(String(height ?? "")); setEditingHt(true); }} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 36, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: height ? T.primary : T.dim }}>
                  {height ?? "—"}
                </span>
                {height && <span style={{ fontSize: 13, color: T.muted }}>cm</span>}
              </div>
            )}
            {!height && <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>tap to log</div>}
          </div>

          {/* Protein target */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Protein Target</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 36, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: proteinTarget ? T.green : T.dim }}>
                {proteinTarget ?? "—"}
              </span>
              {proteinTarget && <span style={{ fontSize: 13, color: T.muted }}>g/day</span>}
            </div>
            {!proteinTarget && <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>log weight</div>}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Today's nutrition */}
        {(todayCals > 0 || todayProtein > 0) && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Today's Nutrition</div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, background: T.card, borderRadius: 14, padding: "14px 16px", border: `1px solid ${T.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 26, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: T.primary }}>{todayCals}</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>kcal</div>
              </div>
              <div style={{ flex: 1, background: T.card, borderRadius: 14, padding: "14px 16px", border: `1px solid ${T.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 26, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: proteinTarget && todayProtein >= proteinTarget ? T.green : T.primary }}>{Math.round(todayProtein)}g</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>protein {proteinTarget ? `/ ${proteinTarget}g` : ""}</div>
              </div>
              {proteinTarget && (
                <div style={{ flex: 1, background: T.card, borderRadius: 14, padding: "14px 16px", border: `1px solid ${T.border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: todayProtein >= proteinTarget ? T.green : T.red }}>
                    {todayProtein >= proteinTarget ? "✓" : `${Math.round(proteinTarget - todayProtein)}g`}
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{todayProtein >= proteinTarget ? "target hit" : "to go"}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Day summary */}
        <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>This Week</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {DAYS.map(day => (
            <div key={day.id} style={{ background: T.card, borderRadius: 14, padding: "14px 16px", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${T.primary}18`, border: `1px solid ${T.primary}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 20 }}>{day.title === "Push" ? "💪" : "🏋️"}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{day.label} — {day.title}</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{day.day} · {day.exercises.length} exercises</div>
              </div>
              <div style={{ fontSize: 11, color: T.primary, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>
                {day.exercises.reduce((a, e) => a + e.sets, 0)} sets
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MEALS TAB ────────────────────────────────────────────────────────────────
function MealsTab({ recipes, onAddRecipe, onDeleteRecipe, onEditRecipe, todayLog, onToggleLog }) {
  const T = useT();
  const [view, setView] = useState("log");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null); // recipe being edited
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [logServings, setLogServings] = useState({});
  const [form, setForm] = useState({ name: "", calories: "", protein: "", servings: "1", ingredients: "" });
  const [editForm, setEditForm] = useState({ name: "", calories: "", protein: "", servings: "1", ingredients: "" });
  const [ingredientInput, setIngredientInput] = useState("");
  const [editIngredientInput, setEditIngredientInput] = useState("");

  const todayCals = todayLog.reduce((s, entry) => {
    const r = recipes.find(r => r.id === entry.id);
    if (!r) return s;
    const perServing = r.servings > 0 ? r.calories / r.servings : r.calories;
    return s + Math.round(perServing * entry.servings);
  }, 0);
  const todayProt = todayLog.reduce((s, entry) => {
    const r = recipes.find(r => r.id === entry.id);
    if (!r) return s;
    const perServing = r.servings > 0 ? r.protein / r.servings : r.protein;
    return s + perServing * entry.servings;
  }, 0);

  const addIngredient = () => {
    if (!ingredientInput.trim()) return;
    setForm(f => ({ ...f, ingredients: f.ingredients ? f.ingredients + "\n" + ingredientInput.trim() : ingredientInput.trim() }));
    setIngredientInput("");
  };

  const addRecipe = () => {
    if (!form.name.trim()) return;
    onAddRecipe({
      id: Date.now().toString(),
      name: form.name,
      calories: Number(form.calories) || 0,
      protein: Number(form.protein) || 0,
      servings: Number(form.servings) || 1,
      ingredients: form.ingredients ? form.ingredients.split("\n").filter(Boolean) : [],
    });
    setForm({ name: "", calories: "", protein: "", servings: "1", ingredients: "" });
    setIngredientInput("");
    setAdding(false);
  };

  const openEdit = (r) => {
    setEditForm({ name: r.name, calories: String(r.calories), protein: String(r.protein), servings: String(r.servings ?? 1), ingredients: (r.ingredients ?? []).join("\n") });
    setEditIngredientInput("");
    setEditing(r);
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) return;
    onEditRecipe({ ...editing, name: editForm.name, calories: Number(editForm.calories) || 0, protein: Number(editForm.protein) || 0, servings: Number(editForm.servings) || 1, ingredients: editForm.ingredients ? editForm.ingredients.split("\n").filter(Boolean) : [] });
    setEditing(null);
  };

  const addEditIngredient = () => {
    if (!editIngredientInput.trim()) return;
    setEditForm(f => ({ ...f, ingredients: f.ingredients ? f.ingredients + "\n" + editIngredientInput.trim() : editIngredientInput.trim() }));
    setEditIngredientInput("");
  };

  const getLogEntry = (id) => todayLog.find(e => e.id === id);
  const toggleLog = (recipe) => {
    const existing = getLogEntry(recipe.id);
    if (existing) {
      onToggleLog(recipe.id, null); // remove
    } else {
      onToggleLog(recipe.id, logServings[recipe.id] ?? 1); // add with servings
    }
  };

  const inputStyle = { width: "100%", boxSizing: "border-box", background: T.card2, border: `1px solid ${T.border}`, borderRadius: 12, color: T.text, fontFamily: "inherit", fontSize: 14, padding: "12px 14px", outline: "none", marginBottom: 10 };

  return (
    <div style={{ padding: "70px 0 100px" }}>
      <div style={{ padding: "14px 16px 0", background: T.card, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 28, fontFamily: "'Playfair Display',serif", fontWeight: 700, background: `linear-gradient(135deg,${T.gradA},${T.gradB})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 12 }}>Meals</div>
        <div style={{ display: "flex" }}>
          {[{ id: "log", label: "Today's Log" }, { id: "recipes", label: "My Recipes" }].map(v => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ flex: 1, background: "none", border: "none", borderBottom: `2px solid ${view === v.id ? T.primary : "transparent"}`, color: view === v.id ? T.primary : T.muted, fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: view === v.id ? 700 : 400, padding: "8px 0 12px", cursor: "pointer" }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {view === "log" && (
        <div style={{ padding: "12px 16px", background: T.card2, borderBottom: `1px solid ${T.border}`, display: "flex", gap: 20 }}>
          <div><span style={{ fontSize: 20, fontWeight: 700, color: T.primary, fontFamily: "'Outfit',sans-serif" }}>{todayCals}</span><span style={{ fontSize: 11, color: T.muted, marginLeft: 4 }}>kcal</span></div>
          <div><span style={{ fontSize: 20, fontWeight: 700, color: T.green, fontFamily: "'Outfit',sans-serif" }}>{Math.round(todayProt)}g</span><span style={{ fontSize: 11, color: T.muted, marginLeft: 4 }}>protein</span></div>
        </div>
      )}

      <div style={{ padding: 16 }}>
        {/* TODAY LOG */}
        {view === "log" && (
          <>
            {recipes.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: T.muted, fontSize: 14 }}>Add recipes first then log what you ate</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recipes.map(r => {
                const entry = getLogEntry(r.id);
                const logged = !!entry;
                const servings = logServings[r.id] ?? 1;
                const perServing = r.servings > 0 ? r.calories / r.servings : r.calories;
                const perServingProt = r.servings > 0 ? r.protein / r.servings : r.protein;
                return (
                  <div key={r.id} style={{ background: T.card, borderRadius: 14, padding: "14px 16px", border: `2px solid ${logged ? T.primary : T.border}`, transition: "border .2s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div onClick={() => toggleLog(r)}
                        style={{ width: 28, height: 28, borderRadius: 8, background: logged ? T.primary : T.card2, border: `1.5px solid ${logged ? T.primary : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "all .2s" }}>
                        {logged && <span style={{ fontSize: 14, color: "#000" }}>✓</span>}
                      </div>
                      <div style={{ flex: 1, cursor: "pointer" }} onClick={() => toggleLog(r)}>
                        <div style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{r.name}</div>
                        <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                          {Math.round(perServing * servings)} kcal · {Math.round(perServingProt * servings)}g protein
                          {r.servings > 1 && ` · ${servings} serving${servings !== 1 ? "s" : ""}`}
                        </div>
                      </div>
                    </div>
                    {/* Servings picker */}
                    {r.servings > 1 && (
                      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 12, color: T.muted }}>Servings:</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={() => setLogServings(p => ({ ...p, [r.id]: Math.max(0.5, (p[r.id] ?? 1) - 0.5) }))}
                            style={{ width: 30, height: 30, borderRadius: 8, background: T.card2, border: `1px solid ${T.border}`, color: T.text, fontSize: 16, cursor: "pointer" }}>−</button>
                          <span style={{ fontSize: 15, fontWeight: 700, color: T.primary, minWidth: 24, textAlign: "center" }}>{logServings[r.id] ?? 1}</span>
                          <button onClick={() => setLogServings(p => ({ ...p, [r.id]: (p[r.id] ?? 1) + 0.5 }))}
                            style={{ width: 30, height: 30, borderRadius: 8, background: T.primary, border: "none", color: "#000", fontSize: 16, cursor: "pointer" }}>+</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* MY RECIPES */}
        {view === "recipes" && (
          <>
            <button onClick={() => setAdding(true)}
              style={{ width: "100%", background: `linear-gradient(135deg,${T.gradA},${T.gradB}88)`, border: `1px solid ${T.primary}`, borderRadius: 14, color: T.text, fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "14px", cursor: "pointer", marginBottom: 14 }}>
              + Add Recipe
            </button>
            {recipes.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: T.muted, fontSize: 14 }}>No recipes yet</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recipes.map(r => (
                <div key={r.id} style={{ background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                  <div onClick={() => setExpandedRecipe(expandedRecipe === r.id ? null : r.id)}
                    style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                        {r.calories} kcal · {r.protein}g protein · {r.servings} serving{r.servings !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <span style={{ color: T.dim, fontSize: 12 }}>{expandedRecipe === r.id ? "▲" : "▼"}</span>
                    <button onClick={e => { e.stopPropagation(); openEdit(r); }}
                      style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, color: T.muted, fontSize: 12, padding: "5px 10px", cursor: "pointer" }}>Edit</button>
                    <button onClick={e => { e.stopPropagation(); onDeleteRecipe(r.id); }}
                      style={{ background: "none", border: "none", color: T.dim, fontSize: 18, cursor: "pointer", padding: "4px 6px" }}>✕</button>
                  </div>
                  {expandedRecipe === r.id && r.ingredients?.length > 0 && (
                    <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${T.border}` }}>
                      <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", margin: "12px 0 8px" }}>Ingredients</div>
                      {r.ingredients.map((ing, i) => (
                        <div key={i} style={{ fontSize: 13, color: T.text, padding: "4px 0", borderBottom: i < r.ingredients.length - 1 ? `1px solid ${T.border}` : "none" }}>· {ing}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add recipe modal */}
      {adding && (
        <>
          <div onClick={() => setAdding(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200 }} />
          <div style={{ position: "fixed", top: "5%", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto", background: T.card, borderRadius: "20px 20px 0 0", padding: "24px 20px 40px", zIndex: 201, overflowY: "auto" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 18, fontFamily: "'Playfair Display',serif" }}>Add Recipe</div>

            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Recipe name" style={inputStyle} />

            <div style={{ display: "flex", gap: 10 }}>
              <input value={form.calories} onChange={e => setForm(f => ({ ...f, calories: e.target.value }))} placeholder="Total calories" type="number" style={{ ...inputStyle, flex: 1 }} />
              <input value={form.protein} onChange={e => setForm(f => ({ ...f, protein: e.target.value }))} placeholder="Protein (g)" type="number" style={{ ...inputStyle, flex: 1 }} />
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>How many servings does this recipe make?</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setForm(f => ({ ...f, servings: String(Math.max(1, Number(f.servings) - 1)) }))}
                  style={{ width: 36, height: 36, borderRadius: 10, background: T.card2, border: `1px solid ${T.border}`, color: T.text, fontSize: 18, cursor: "pointer" }}>−</button>
                <span style={{ fontSize: 20, fontWeight: 700, color: T.primary, minWidth: 32, textAlign: "center" }}>{form.servings}</span>
                <button onClick={() => setForm(f => ({ ...f, servings: String(Number(f.servings) + 1) }))}
                  style={{ width: 36, height: 36, borderRadius: 10, background: T.primary, border: "none", color: "#000", fontSize: 18, cursor: "pointer" }}>+</button>
                <span style={{ fontSize: 12, color: T.muted, marginLeft: 4 }}>servings</span>
              </div>
            </div>

            <div style={{ fontSize: 12, color: T.muted, marginBottom: 8, marginTop: 4 }}>Ingredients (optional)</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input value={ingredientInput} onChange={e => setIngredientInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addIngredient(); }}
                placeholder="e.g. 45g rolled oats"
                style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
              <button onClick={addIngredient} style={{ background: T.primary, border: "none", borderRadius: 12, color: "#000", fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "0 16px", cursor: "pointer" }}>Add</button>
            </div>
            {form.ingredients && (
              <div style={{ background: T.card2, borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
                {form.ingredients.split("\n").filter(Boolean).map((ing, i) => (
                  <div key={i} style={{ fontSize: 13, color: T.text, padding: "3px 0", display: "flex", justifyContent: "space-between" }}>
                    <span>· {ing}</span>
                    <button onClick={() => setForm(f => ({ ...f, ingredients: f.ingredients.split("\n").filter((_, j) => j !== i).join("\n") }))}
                      style={{ background: "none", border: "none", color: T.dim, cursor: "pointer", fontSize: 14 }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <button onClick={addRecipe}
              style={{ width: "100%", background: `linear-gradient(135deg,${T.gradA},${T.gradB}88)`, border: `1px solid ${T.primary}`, borderRadius: 12, color: T.text, fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "14px", cursor: "pointer" }}>
              Save Recipe
            </button>
          </div>
        </>
      )}
      {/* Edit recipe modal */}
      {editing && (
        <>
          <div onClick={() => setEditing(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200 }} />
          <div style={{ position: "fixed", top: "5%", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto", background: T.card, borderRadius: "20px 20px 0 0", padding: "24px 20px 40px", zIndex: 201, overflowY: "auto" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 18, fontFamily: "'Playfair Display',serif" }}>Edit Recipe</div>

            <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} placeholder="Recipe name" style={inputStyle} />
            <div style={{ display: "flex", gap: 10 }}>
              <input value={editForm.calories} onChange={e => setEditForm(f => ({ ...f, calories: e.target.value }))} placeholder="Total calories" type="number" style={{ ...inputStyle, flex: 1 }} />
              <input value={editForm.protein} onChange={e => setEditForm(f => ({ ...f, protein: e.target.value }))} placeholder="Protein (g)" type="number" style={{ ...inputStyle, flex: 1 }} />
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>Servings this recipe makes</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setEditForm(f => ({ ...f, servings: String(Math.max(1, Number(f.servings) - 1)) }))}
                  style={{ width: 36, height: 36, borderRadius: 10, background: T.card2, border: `1px solid ${T.border}`, color: T.text, fontSize: 18, cursor: "pointer" }}>−</button>
                <span style={{ fontSize: 20, fontWeight: 700, color: T.primary, minWidth: 32, textAlign: "center" }}>{editForm.servings}</span>
                <button onClick={() => setEditForm(f => ({ ...f, servings: String(Number(f.servings) + 1) }))}
                  style={{ width: 36, height: 36, borderRadius: 10, background: T.primary, border: "none", color: "#000", fontSize: 18, cursor: "pointer" }}>+</button>
              </div>
            </div>

            <div style={{ fontSize: 12, color: T.muted, marginBottom: 8, marginTop: 4 }}>Ingredients</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input value={editIngredientInput} onChange={e => setEditIngredientInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addEditIngredient(); }}
                placeholder="e.g. 45g rolled oats"
                style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
              <button onClick={addEditIngredient} style={{ background: T.primary, border: "none", borderRadius: 12, color: "#000", fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "0 16px", cursor: "pointer" }}>Add</button>
            </div>
            {editForm.ingredients && (
              <div style={{ background: T.card2, borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
                {editForm.ingredients.split("\n").filter(Boolean).map((ing, i) => (
                  <div key={i} style={{ fontSize: 13, color: T.text, padding: "3px 0", display: "flex", justifyContent: "space-between" }}>
                    <span>· {ing}</span>
                    <button onClick={() => setEditForm(f => ({ ...f, ingredients: f.ingredients.split("\n").filter((_, j) => j !== i).join("\n") }))}
                      style={{ background: "none", border: "none", color: T.dim, cursor: "pointer", fontSize: 14 }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <button onClick={saveEdit}
              style={{ width: "100%", background: `linear-gradient(135deg,${T.gradA},${T.gradB}88)`, border: `1px solid ${T.primary}`, borderRadius: 12, color: T.text, fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "14px", cursor: "pointer" }}>
              Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
}
function TimerTab() {
  const T = useT();
  const PRESETS = [30, 60, 90, 120, 180];
  const [duration, setDuration] = useState(90);
  const [timeLeft, setTimeLeft] = useState(90);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [editingCustom, setEditingCustom] = useState(false);
  const intervalRef = useRef(null);

  const playDone = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const beeps = [880, 880, 1100];
      beeps.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        const start = ctx.currentTime + i * 0.22;
        gain.gain.setValueAtTime(0.4, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
        osc.start(start);
        osc.stop(start + 0.2);
      });
    } catch (e) {}
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setDone(true);
            playDone();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const start = () => { setDone(false); setRunning(true); };
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setDone(false); setTimeLeft(duration); };
  const setPreset = (s) => { setDuration(s); setTimeLeft(s); setRunning(false); setDone(false); };

  const pct = duration > 0 ? (timeLeft / duration) * 100 : 0;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const ringSize = 240;
  const stroke = 10;
  const r = (ringSize - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const ringColor = done ? T.green : timeLeft <= 10 ? T.red : T.primary;

  return (
    <div style={{ padding: "80px 16px 100px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: T.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Rest Period</div>
        <div style={{ fontSize: 38, fontFamily: "'Playfair Display',serif", fontWeight: 700, background: `linear-gradient(135deg,${T.gradA},${T.gradB})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.15 }}>
          Timer
        </div>
      </div>

      {/* Ring */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <div style={{ position: "relative", width: ringSize, height: ringSize }}>
          <svg width={ringSize} height={ringSize} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={ringSize/2} cy={ringSize/2} r={r} fill="none" stroke={T.card2} strokeWidth={stroke} />
            <circle cx={ringSize/2} cy={ringSize/2} r={r} fill="none" stroke={ringColor} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 10px ${ringColor})`, transition: "stroke-dasharray .5s, stroke .3s" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
            {done ? (
              <span style={{ fontSize: 48, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: T.green }}>Done!</span>
            ) : (
              <>
                <span style={{ fontSize: 56, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: T.text, lineHeight: 1 }}>
                  {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
                </span>
                <span style={{ fontSize: 12, color: T.muted, letterSpacing: 2 }}>{duration}s total</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, justifyContent: "center" }}>
        {!running ? (
          <PrimaryBtn onClick={start} style={{ flex: 1, maxWidth: 160, fontSize: 16 }}>
            {timeLeft === duration ? "Start" : "Resume"}
          </PrimaryBtn>
        ) : (
          <PrimaryBtn onClick={pause} style={{ flex: 1, maxWidth: 160, fontSize: 16 }}>Pause</PrimaryBtn>
        )}
        <OutlineBtn onClick={reset} style={{ flex: 1, maxWidth: 160, fontSize: 16 }}>Reset</OutlineBtn>
      </div>

      {/* Presets */}
      <Card style={{ marginBottom: 14 }}>
        <Label>Quick Presets</Label>
        <div style={{ display: "flex", gap: 8 }}>
          {PRESETS.map(s => (
            <button key={s} onClick={() => setPreset(s)}
              style={{ flex: 1, background: duration === s ? `${T.primary}22` : T.card2, border: `1px solid ${duration === s ? T.primary : T.border}`, borderRadius: 10, color: duration === s ? T.primary : T.muted, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, padding: "10px 0" }}>
              {s >= 60 ? `${s/60}m` : `${s}s`}
            </button>
          ))}
        </div>
      </Card>

      {/* Custom duration */}
      <Card>
        <Label>Custom Duration</Label>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {editingCustom ? (
            <input
              autoFocus
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onBlur={() => {
                setEditingCustom(false);
                const n = parseInt(customInput);
                if (!isNaN(n) && n > 0) setPreset(n);
                setCustomInput("");
              }}
              onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
              placeholder="seconds"
              style={{ flex: 1, background: T.card2, border: `1px solid ${T.primary}`, borderRadius: 10, color: T.text, fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, padding: "10px 14px", outline: "none" }}
            />
          ) : (
            <button onClick={() => setEditingCustom(true)}
              style={{ flex: 1, background: T.card2, border: `1px solid ${T.border}`, borderRadius: 10, color: T.muted, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 14, padding: "12px 14px", textAlign: "left" }}>
              Enter custom seconds...
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────────
function SettingsTab({ themeKey, setThemeKey, lightMode, setLightMode, unit, setUnit, user, onSignOut, saveSettings }) {
  const T = useT();
  return (
    <div style={{ padding: "80px 16px 100px" }}>
      <div style={{ fontSize: 28, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: T.text, marginBottom: 24 }}>Settings</div>

      <Card style={{ marginBottom: 14 }}>
        <Label>Theme</Label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(THEMES).map(([k, v]) => (
            <button key={k} onClick={() => { setThemeKey(k); saveSettings({ forge_theme: k }); }}
              style={{ background: themeKey === k ? `${T.primary}22` : T.card2, border: `1px solid ${themeKey === k ? T.primary : T.border}`, borderRadius: 10, padding: "8px 12px", cursor: "pointer", color: themeKey === k ? T.primary : T.muted, fontFamily: "inherit", fontSize: 12 }}>
              {v.emoji} {v.name}
            </button>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <Label>Appearance</Label>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, color: T.text }}>Light Mode</span>
          <button onClick={() => { setLightMode(!lightMode); saveSettings({ forge_light_mode: !lightMode }); }}
            style={{ width: 44, height: 24, borderRadius: 12, background: lightMode ? T.primary : T.card2, border: `1px solid ${T.border}`, cursor: "pointer", position: "relative", transition: "background .2s" }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 3, left: lightMode ? 23 : 3, transition: "left .2s" }} />
          </button>
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <Label>Units</Label>
        <div style={{ display: "flex", gap: 8 }}>
          {["kg", "lbs"].map(u => (
            <button key={u} onClick={() => { setUnit(u); saveSettings({ units: u }); }}
              style={{ flex: 1, background: unit === u ? `${T.primary}22` : T.card2, border: `1px solid ${unit === u ? T.primary : T.border}`, borderRadius: 10, color: unit === u ? T.primary : T.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, padding: "10px 0" }}>
              {u}
            </button>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <Label>Account</Label>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 12 }}>{user?.email}</div>
        <OutlineBtn onClick={onSignOut} style={{ width: "100%" }}>Sign Out</OutlineBtn>
      </Card>
    </div>
  );
}

// ─── TOP HEADER ───────────────────────────────────────────────────────────────
function TopHeader({ tab, onSettingsOpen }) {
  const T = useT();
  const day = DAYS.find(d => d.id === tab);
  const label = tab === "overview" ? "Forge" : tab === "timer" ? "Timer" : tab === "meals" ? "Meals" : day ? `${day.label} · ${day.title}` : "";
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto", zIndex: 99, background: T.navBg, borderBottom: `1px solid ${T.border}`, padding: "14px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 16, fontFamily: tab === "overview" ? "'Playfair Display',serif" : "'Outfit',sans-serif", fontWeight: 700, background: tab === "overview" ? `linear-gradient(135deg,${T.gradA},${T.gradB})` : "none", WebkitBackgroundClip: tab === "overview" ? "text" : "none", WebkitTextFillColor: tab === "overview" ? "transparent" : T.text, color: tab === "overview" ? undefined : T.text }}>{label}</span>
      <button onClick={onSettingsOpen} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: T.muted, fontSize: 18, lineHeight: 1 }}>⚙</button>
    </div>
  );
}

// ─── SETTINGS DRAWER ──────────────────────────────────────────────────────────
function SettingsDrawer({ open, onClose, themeKey, setThemeKey, lightMode, setLightMode, unit, setUnit, user, onSignOut, saveSettings }) {
  const T = useT();
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "85%", maxWidth: 360, background: T.card, zIndex: 201, overflowY: "auto", padding: "24px 20px 40px", borderLeft: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: T.text }}>Settings</div>
          <button onClick={onClose} style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, color: T.muted, cursor: "pointer", fontSize: 14, padding: "6px 12px" }}>✕</button>
        </div>

        <div style={{ marginBottom: 6, fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>Theme</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {Object.entries(THEMES).map(([k, v]) => (
            <button key={k} onClick={() => { setThemeKey(k); saveSettings({ forge_theme: k }); }}
              style={{ background: themeKey === k ? `${T.primary}22` : T.card2, border: `1px solid ${themeKey === k ? T.primary : T.border}`, borderRadius: 10, padding: "8px 12px", cursor: "pointer", color: themeKey === k ? T.primary : T.muted, fontFamily: "inherit", fontSize: 12 }}>
              {v.emoji} {v.name}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 6, fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>Appearance</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontSize: 14, color: T.text }}>Light Mode</span>
          <button onClick={() => { setLightMode(!lightMode); saveSettings({ forge_light_mode: !lightMode }); }}
            style={{ width: 44, height: 24, borderRadius: 12, background: lightMode ? T.primary : T.card2, border: `1px solid ${T.border}`, cursor: "pointer", position: "relative", transition: "background .2s" }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 3, left: lightMode ? 23 : 3, transition: "left .2s" }} />
          </button>
        </div>

        <div style={{ marginBottom: 6, fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>Units</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["kg", "lbs"].map(u => (
            <button key={u} onClick={() => { setUnit(u); saveSettings({ units: u }); }}
              style={{ flex: 1, background: unit === u ? `${T.primary}22` : T.card2, border: `1px solid ${unit === u ? T.primary : T.border}`, borderRadius: 10, color: unit === u ? T.primary : T.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, padding: "10px 0" }}>
              {u}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 6, fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>Account</div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 12 }}>{user?.email}</div>
        <button onClick={onSignOut} style={{ width: "100%", background: "transparent", border: `1px solid ${T.primary}`, borderRadius: 10, color: T.primary, cursor: "pointer", fontFamily: "inherit", fontSize: 14, padding: "11px 16px" }}>Sign Out</button>
      </div>
    </>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function WorkoutApp({ user, onSignOut }) {
  const [tab, setTab] = useState("overview");
  const [themeKey, setThemeKey] = useState("earth");
  const [lightMode, setLightMode] = useState(false);
  const [unit, setUnit] = useState("kg");
  const [weights, setWeights] = useState({});
  const [bodyweight, setBodyweight] = useState(null);
  const [height, setHeight] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [todayLog, setTodayLog] = useState([]);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const T = applyMode(THEMES[themeKey] || THEMES.earth, lightMode);

  const stateRef = useRef({ themeKey: "earth", lightMode: false, unit: "kg", weights: {}, bodyweight: null, height: null, recipes: [], todayLog: [] });
  stateRef.current = { themeKey, lightMode, unit, weights, bodyweight, height, recipes, todayLog };

  const todayKey = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!user) return;
    supabase.from('settings').select('*').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data) {
          if (data.forge_theme) setThemeKey(data.forge_theme);
          if (data.forge_light_mode !== undefined && data.forge_light_mode !== null) setLightMode(data.forge_light_mode);
          if (data.units) setUnit(data.units);
          if (data.weights_data) setWeights(data.weights_data);
          if (data.bodyweight !== undefined) setBodyweight(data.bodyweight);
          if (data.height !== undefined) setHeight(data.height);
          if (data.recipes) setRecipes(data.recipes);
          if (data.meal_logs?.[todayKey]) setTodayLog(data.meal_logs[todayKey]);
        }
        setLoadingSettings(false);
      });
  }, [user]);

  const saveSettings = (patch) => {
    if (!user) return;
    const s = stateRef.current;
    const full = { forge_theme: s.themeKey, forge_light_mode: s.lightMode, units: s.unit, weights_data: s.weights, bodyweight: s.bodyweight, height: s.height, recipes: s.recipes, ...patch };
    supabase.from('settings').upsert({ user_id: user.id, ...full }, { onConflict: 'user_id' })
      .then(({ error }) => { if (error) console.error('Settings save error:', JSON.stringify(error)); });
  };

  const handleWeightChange = (exerciseId, value) => {
    const newWeights = { ...weights, [exerciseId]: value };
    setWeights(newWeights);
    saveSettings({ weights_data: newWeights });
  };
  const handleBodyweightChange = (value) => { setBodyweight(value); saveSettings({ bodyweight: value }); };
  const handleHeightChange = (value) => { setHeight(value); saveSettings({ height: value }); };

  const handleAddRecipe = (recipe) => {
    const newRecipes = [...recipes, recipe];
    setRecipes(newRecipes);
    saveSettings({ recipes: newRecipes });
  };
  const handleEditRecipe = (updated) => {
    const newRecipes = recipes.map(r => r.id === updated.id ? updated : r);
    setRecipes(newRecipes);
    saveSettings({ recipes: newRecipes });
  };
    const newRecipes = recipes.filter(r => r.id !== id);
    setRecipes(newRecipes);
    const newLog = todayLog.filter(lid => lid !== id);
    setTodayLog(newLog);
    saveSettings({ recipes: newRecipes });
  };
  const handleToggleLog = (id, servings) => {
    const newLog = servings === null
      ? todayLog.filter(e => e.id !== id)
      : [...todayLog.filter(e => e.id !== id), { id, servings }];
    setTodayLog(newLog);
    supabase.from('settings').select('meal_logs').eq('user_id', user.id).single()
      .then(({ data }) => {
        const existing = data?.meal_logs ?? {};
        const updated = { ...existing, [todayKey]: newLog };
        supabase.from('settings').upsert({ user_id: user.id, meal_logs: updated }, { onConflict: 'user_id' });
      });
  };

  if (loadingSettings) {
    return (
      <div style={{ background: "#1a1208", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#d4924f", fontFamily: "'Outfit',sans-serif", fontSize: 14, letterSpacing: 2 }}>LOADING...</div>
      </div>
    );
  }

  const activeDay = DAYS.find(d => d.id === tab);

  return (
    <ThemeCtx.Provider value={T}>
      <div style={{ background: T.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", fontFamily: "'Jost',sans-serif", transition: "background .4s", color: T.text }}>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Jost:wght@300;400;500;600&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet" />
        <style>{`*{box-sizing:border-box}input::placeholder{color:#4b5563}select{appearance:none}::-webkit-scrollbar{width:0}button{outline:none}`}</style>

        <TopHeader tab={tab} onSettingsOpen={() => setSettingsOpen(true)} />

        {tab === "overview" && <OverviewTab weights={weights} bodyweight={bodyweight} onBodyweightChange={handleBodyweightChange} height={height} onHeightChange={handleHeightChange} unit={unit} todayLog={todayLog} recipes={recipes} />}
        {activeDay && <DayTab day={activeDay} weights={weights} onWeightChange={handleWeightChange} unit={unit} />}
        {tab === "meals" && <MealsTab recipes={recipes} onAddRecipe={handleAddRecipe} onDeleteRecipe={handleDeleteRecipe} onEditRecipe={handleEditRecipe} todayLog={todayLog} onToggleLog={handleToggleLog} />}
        {tab === "timer" && <TimerTab />}

        <SettingsDrawer
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          themeKey={themeKey} setThemeKey={setThemeKey}
          lightMode={lightMode} setLightMode={setLightMode}
          unit={unit} setUnit={setUnit}
          user={user} onSignOut={onSignOut}
          saveSettings={saveSettings}
        />

        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </ThemeCtx.Provider>
  );
}
