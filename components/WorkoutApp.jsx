'use client'
import { useState, createContext, useContext, useEffect, useRef } from "react";
import { supabase } from '@/lib/supabase'

// ─── THEME SYSTEM ────────────────────────────────────────────────────────────
const THEMES = {
  fire: {
    name: "Fire", emoji: "🔥",
    bg: "#111111", card: "#1c1c1c", card2: "#242424", border: "#2a2a2a", navBg: "#161616",
    primary: "#f97316", secondary: "#facc15", accent: "#fb923c",
    red: "#ef4444", green: "#4ade80", text: "#f5f5f5", muted: "#9ca3af", dim: "#4b5563",
    gradA: "#f97316", gradB: "#facc15", glow: "rgba(249,115,22,0.25)",
    catColors: ["#f97316","#fb923c","#facc15","#fbbf24","#f59e0b","#ea580c","#fdba74","#fed7aa","#4ade80","#6b7280"],
    light: { bg: "#fafaf9", card: "#ffffff", card2: "#f5f0eb", border: "#e8ddd0", navBg: "#ffffff", text: "#1a1208", muted: "#78716c", dim: "#c4b5a0" },
  },
  water: {
    name: "Water", emoji: "🌊",
    bg: "#080f1a", card: "#0d1929", card2: "#112236", border: "#1a3a5c", navBg: "#060d16",
    primary: "#38bdf8", secondary: "#7dd3fc", accent: "#0ea5e9",
    red: "#f87171", green: "#34d399", text: "#e0f2fe", muted: "#7ea8c9", dim: "#2d5a7a",
    gradA: "#38bdf8", gradB: "#818cf8", glow: "rgba(56,189,248,0.25)",
    catColors: ["#38bdf8","#0ea5e9","#7dd3fc","#818cf8","#a78bfa","#60a5fa","#93c5fd","#bae6fd","#34d399","#64748b"],
    light: { bg: "#f0f9ff", card: "#ffffff", card2: "#e0f2fe", border: "#bae6fd", navBg: "#ffffff", text: "#082f49", muted: "#4a90a4", dim: "#a5d8f0" },
  },
  nature: {
    name: "Nature", emoji: "🌿",
    bg: "#0a110a", card: "#121a12", card2: "#182018", border: "#243824", navBg: "#080e08",
    primary: "#4ade80", secondary: "#a3e635", accent: "#22c55e",
    red: "#f87171", green: "#86efac", text: "#ecfdf0", muted: "#86a886", dim: "#3a5a3a",
    gradA: "#4ade80", gradB: "#a3e635", glow: "rgba(74,222,128,0.25)",
    catColors: ["#4ade80","#22c55e","#a3e635","#84cc16","#65a30d","#16a34a","#86efac","#bbf7d0","#34d399","#6b7280"],
    light: { bg: "#f7fef7", card: "#ffffff", card2: "#f0fdf4", border: "#bbf7d0", navBg: "#ffffff", text: "#052e16", muted: "#4a7c59", dim: "#a7d9b2" },
  },
  earth: {
    name: "Earth", emoji: "🪨",
    bg: "#0f0b08", card: "#1c1510", card2: "#241c14", border: "#3a2d1f", navBg: "#0c0906",
    primary: "#c8854a", secondary: "#e8b87a", accent: "#a0622a",
    red: "#e05a5a", green: "#7abf7a", text: "#f5ede3", muted: "#a08060", dim: "#5a3f28",
    gradA: "#c8854a", gradB: "#e8b87a", glow: "rgba(200,133,74,0.25)",
    catColors: ["#c8854a","#a0622a","#e8b87a","#d4955a","#b87040","#8b4513","#deb887","#f5deb3","#7abf7a","#6b5a4a"],
    light: { bg: "#fdf8f2", card: "#ffffff", card2: "#faf0e6", border: "#e8d5bc", navBg: "#ffffff", text: "#2c1a0a", muted: "#8b6040", dim: "#d4b896" },
  },
  floral: {
    name: "Floral", emoji: "🌸",
    bg: "#120a12", card: "#1c1020", card2: "#231428", border: "#3a1f42", navBg: "#0e080f",
    primary: "#e879f9", secondary: "#f9a8d4", accent: "#c026d3",
    red: "#fb7185", green: "#4ade80", text: "#fdf4ff", muted: "#c4a8cc", dim: "#5a3a62",
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
    { id: "overview",  label: "Home",     icon: "◈" },
    { id: "day1",      label: "Mon",      icon: "①" },
    { id: "day2",      label: "Tue",      icon: "②" },
    { id: "day4",      label: "Thu",      icon: "③" },
    { id: "day5",      label: "Fri",      icon: "④" },
    { id: "timer",     label: "Timer",    icon: "◷" },
    { id: "settings",  label: "Settings", icon: "◬" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto", background: T.navBg, borderTop: `1px solid ${T.border}`, display: "flex", zIndex: 100 }}>
      {tabs.map(t => {
        const active = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: "none", border: "none", padding: "10px 1px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, position: "relative" }}>
            {active && <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: `linear-gradient(90deg,${T.gradA},${T.gradB})`, borderRadius: "0 0 4px 4px", boxShadow: `0 0 10px ${T.primary}` }} />}
            <span style={{ fontSize: 14, color: active ? T.primary : T.dim, transition: "color .2s" }}>{t.icon}</span>
            <span style={{ fontSize: 7, letterSpacing: 0.3, color: active ? T.primary : T.dim, fontFamily: "'Outfit',sans-serif", textTransform: "uppercase" }}>{t.label}</span>
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
  const [warmupOpen, setWarmupOpen] = useState(true);
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
function OverviewTab({ weights, bodyweight, onBodyweightChange, unit }) {
  const T = useT();
  const [bwDraft, setBwDraft] = useState(String(bodyweight ?? ""));
  const [editingBw, setEditingBw] = useState(false);

  return (
    <div style={{ padding: "80px 16px 100px" }}>
      {/* Hero */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: T.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Training Regime · 2026</div>
        <div style={{ fontSize: 38, fontFamily: "'Playfair Display',serif", fontWeight: 700, background: `linear-gradient(135deg,${T.gradA},${T.gradB})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.15, marginBottom: 6 }}>
          Nico's Plan
        </div>
        <div style={{ fontSize: 13, color: T.muted }}>4 days/week · Push & Pull</div>
      </div>

      {/* Bodyweight hero card */}
      <Card style={{ marginBottom: 14, background: `linear-gradient(135deg,${T.card},${T.card2})` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <Label>Body Weight</Label>
            {editingBw ? (
              <input
                autoFocus
                value={bwDraft}
                onChange={e => setBwDraft(e.target.value)}
                onBlur={() => { setEditingBw(false); const n = parseFloat(bwDraft); if (!isNaN(n)) onBodyweightChange(n); else setBwDraft(String(bodyweight ?? "")); }}
                onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
                style={{ background: T.card2, border: `1px solid ${T.primary}`, borderRadius: 8, color: T.text, fontFamily: "'Outfit',sans-serif", fontSize: 36, fontWeight: 700, padding: "4px 10px", width: 120 }}
              />
            ) : (
              <div onClick={() => { setBwDraft(String(bodyweight ?? "")); setEditingBw(true); }} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 44, fontFamily: "'Outfit',sans-serif", fontWeight: 700, background: bodyweight ? `linear-gradient(135deg,${T.gradA},${T.gradB})` : "none", WebkitBackgroundClip: bodyweight ? "text" : "none", WebkitTextFillColor: bodyweight ? "transparent" : T.dim, color: bodyweight ? undefined : T.dim }}>
                  {bodyweight ?? "—"}
                </span>
                {bodyweight && <span style={{ fontSize: 16, color: T.muted }}>{unit}</span>}
              </div>
            )}
            {!bodyweight && <div style={{ fontSize: 11, color: T.dim, marginTop: 4 }}>tap to log your weight</div>}
          </div>
        </div>
      </Card>

      {/* Schedule */}
      <Card style={{ marginBottom: 14 }}>
        <Label>Weekly Schedule</Label>
        <div style={{ display: "flex", gap: 6 }}>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => {
            const active = ["Mon","Tue","Thu","Fri"].includes(d);
            const isPush = ["Mon","Thu"].includes(d);
            return (
              <div key={d} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: active ? T.primary : T.dim, marginBottom: 4, textTransform: "uppercase" }}>{d}</div>
                <div style={{ height: 36, borderRadius: 10, background: active ? `${T.primary}18` : T.card2, border: `1px solid ${active ? T.primary + "66" : T.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
                  {active ? (
                    <>
                      <span style={{ fontSize: 13 }}>{isPush ? "💪" : "🏋️"}</span>
                      <span style={{ fontSize: 7, color: T.primary, letterSpacing: 0.5 }}>{isPush ? "PUSH" : "PULL"}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 11, color: T.dim }}>·</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Day summary */}
      <Card>
        <Label>Plan Summary</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {DAYS.map(day => (
            <div key={day.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>{day.title === "Push" ? "💪" : "🏋️"}</span>
              <div>
                <div style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{day.label} — {day.title}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{day.day}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── TIMER TAB ────────────────────────────────────────────────────────────────
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

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setDone(true);
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
function TopHeader({ tab }) {
  const T = useT();
  const day = DAYS.find(d => d.id === tab);
  const label = tab === "overview" ? "Overview" : tab === "settings" ? "Settings" : day ? `${day.label} · ${day.title}` : "";
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto", zIndex: 99, background: T.navBg, borderBottom: `1px solid ${T.border}`, padding: "14px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, color: T.text }}>{label}</span>
      <div style={{ width: 8, height: 8, borderRadius: 4, background: T.primary, boxShadow: `0 0 8px ${T.primary}` }} />
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function WorkoutApp({ user, onSignOut }) {
  const [tab, setTab] = useState("overview");
  const [themeKey, setThemeKey] = useState("earth");
  const [lightMode, setLightMode] = useState(false);
  const [unit, setUnit] = useState("kg");
  // weights: { [exerciseId]: number | null }
  const [weights, setWeights] = useState({});
  const [bodyweight, setBodyweight] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const T = applyMode(THEMES[themeKey] || THEMES.fire, lightMode);

  const stateRef = useRef({ themeKey: "earth", lightMode: false, unit: "kg", weights: {}, bodyweight: null });
  stateRef.current = { themeKey, lightMode, unit, weights, bodyweight };

  // Load settings
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
        }
        setLoadingSettings(false);
      });
  }, [user]);

  const saveSettings = (patch) => {
    if (!user) return;
    const s = stateRef.current;
    const full = { forge_theme: s.themeKey, forge_light_mode: s.lightMode, units: s.unit, weights_data: s.weights, bodyweight: s.bodyweight, ...patch };
    supabase.from('settings').upsert({ user_id: user.id, ...full }, { onConflict: 'user_id' })
      .then(({ error }) => { if (error) console.error('Settings save error:', JSON.stringify(error)); });
  };

  const handleWeightChange = (exerciseId, value) => {
    const newWeights = { ...weights, [exerciseId]: value };
    setWeights(newWeights);
    saveSettings({ weights_data: newWeights });
  };

  const handleBodyweightChange = (value) => {
    setBodyweight(value);
    saveSettings({ bodyweight: value });
  };

  if (loadingSettings) {
    return (
      <div style={{ background: "#0f0b08", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#c8854a", fontFamily: "'Outfit',sans-serif", fontSize: 14, letterSpacing: 2 }}>LOADING...</div>
      </div>
    );
  }

  const activeDay = DAYS.find(d => d.id === tab);

  return (
    <ThemeCtx.Provider value={T}>
      <div style={{ background: T.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", fontFamily: "'Jost',sans-serif", transition: "background .4s", color: T.text }}>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Jost:wght@300;400;500;600&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet" />
        <style>{`*{box-sizing:border-box}input::placeholder{color:#4b5563}select{appearance:none}::-webkit-scrollbar{width:0}button{outline:none}`}</style>

        <TopHeader tab={tab} />

        {tab === "overview" && (
          <OverviewTab
            weights={weights}
            bodyweight={bodyweight}
            onBodyweightChange={handleBodyweightChange}
            unit={unit}
          />
        )}
        {activeDay && (
          <DayTab
            day={activeDay}
            weights={weights}
            onWeightChange={handleWeightChange}
            unit={unit}
          />
        )}
        {tab === "timer" && <TimerTab />}
        {tab === "settings" && (
          <SettingsTab
            themeKey={themeKey}
            setThemeKey={setThemeKey}
            lightMode={lightMode}
            setLightMode={setLightMode}
            unit={unit}
            setUnit={setUnit}
            user={user}
            onSignOut={onSignOut}
            saveSettings={saveSettings}
          />
        )}

        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </ThemeCtx.Provider>
  );
}