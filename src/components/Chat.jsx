import { useState, useRef, useEffect } from "react";

// ── Theme ──
const C = {
  bg: "#07080c", chatBg: "#0c0d12", userBubble: "#1a3a6e", botBubble: "#161720",
  botBorder: "#252630", accent: "#3b82f6", accentSoft: "#3b82f620", green: "#22c55e",
  greenSoft: "#22c55e18", yellow: "#eab308", red: "#ef4444",
  text: "#e2e2e8", textDim: "#8b8b9e", textMuted: "#55556a", white: "#fff",
  border: "#1e1f2a", inputBg: "#111218", inputBorder: "#2a2b38",
  modeBg: "#1a1b26", modeBorder: "#2a2b3a", modeActive: "#253a6a",
};

// ── B7 Kit Baseline ──
const B7_KIT = {
  car: "Team Associated RC10B7", type: "2WD Buggy",
  front: { springs:"Orange", shock_oil:"35wt", ride_height:"13mm", camber:"-1°", toe:"0°", arb:"1.0mm", kick_up:"0°", caster_insert:"+2.5", kpi:"2", steering_plate:"+1", bellcrank:"Up", piston:"2x1.6", piston_thickness:"2.5mm", stroke:"23.5mm", eyelet:"0", cup_offset:"+5", axle_height:"+3", wheel_hex:"6.5mm" },
  rear: { springs:"Gray", shock_oil:"30wt", ride_height:"13mm", camber:"-1°", arb:"1.2mm", piston:"2x1.9", piston_thickness:"2.5mm", stroke:"27.5mm", eyelet:"+2", cup_offset:"0", axle_height:"+2", wheel_hex:"5mm", hub_type:"HRC", hub_spacing:"Mid", arm_spacing:"Mid", drive_shaft:"CVAs" },
  drivetrain: { diff_type:"Gear Diff", diff_fluid:"30k", diff_height:"2", battery_position:"3", battery_mount:"Std" },
  body: { wing_angle:"6°", rear_wing:'RC10B7 7"', front_wing:"RC10B7" },
};

// ── System Prompt ──
function buildSystemPrompt(profile, setup, sessionLog, mode) {
  return `You are the Race Mode Engine — an expert AI pit crew chief for 1/10 scale RC racing. You specialize in Team Associated vehicles (RC10B7, B84, T7) on carpet surfaces.

PERSONALITY:
- Talk like a knowledgeable friend at the track, not a textbook
- Be encouraging but honest
- Use "we" language — "let's try..." not "you should..."
- Keep responses concise (2-4 sentences usually, longer when teaching)
- Never overwhelm — answer what was asked
- Use **bold** for important values and settings
- Every 1mm matters in 1/10 scale

USER PROFILE:
${profile.name ? `Name: ${profile.name}` : "Name: Unknown"}
${profile.car ? `Car: ${profile.car}` : "Car: Unknown"}
${profile.track ? `Home Track: ${profile.track}` : "Home Track: Unknown"}
${profile.experience ? `Experience Level: ${profile.experience}` : "Experience: Unknown"}
${profile.struggle ? `Biggest Struggle: ${profile.struggle}` : ""}
${profile.racingClass ? `Class: ${profile.racingClass}` : ""}
${profile.carCondition ? `Car Condition: ${profile.carCondition}` : ""}
${profile.goals ? `Goals: ${profile.goals}` : ""}

EXPERIENCE CALIBRATION:
${profile.experience === "beginner" ? "User is brand new. Explain EVERYTHING plainly. Define terms before using them. Be patient. Never assume knowledge." :
  profile.experience === "intermediate" ? "User knows basics. Explain 'why' behind changes. Don't define springs/shocks but do explain geometry." :
  profile.experience === "advanced" ? "User is experienced. Be technical and direct. Focus on nuance and track-specific tuning." :
  "Calibrate based on their questions. Match their technical level."}

CURRENT SETUP:
${JSON.stringify(setup, null, 2)}

B7 KIT BASELINE (factory starting point):
${JSON.stringify(B7_KIT, null, 2)}

SESSION LOG:
${sessionLog.length > 0 ? sessionLog.map((s,i) => `${i+1}. ${s}`).join("\n") : "No changes yet."}

CURRENT MODE: ${mode}

MODE BEHAVIOR:

${mode === "onboarding" ? `ONBOARDING — First-time setup. Have a natural conversation to learn:
1. Their name
2. What car they run (B7, B84, T7)
3. Home track and surface type
4. Experience level with setup
5. How they got their car (built from kit? bought used? hand-me-down?)
6. Current setup situation (on kit setup? modified? unknown?)
7. What they want from this app
8. Racing class (17.5T stock, 13.5T mod, etc)

Ask ONE question at a time. React naturally. Don't rush through a checklist — have a real conversation.

KEY SCENARIOS:
- If they BUILT FROM KIT: confirm kit baseline, explain what that means for their level
- If they BOUGHT USED and don't know setup: ask if they want help figuring it out (Detective mode). Guide them through visual checks.
- If they have a MODIFIED setup: ask them to describe what's different from kit
- If they're BRAND NEW: be extra welcoming, explain the app will grow with them

When you have enough info (usually 6-8 exchanges), give a summary of what you know and tell them about the modes available:
🏁 Coach — live race-night coaching, one change at a time
📋 Logbook — view/edit their full setup, track changes
📘 Manual — learn any RC concept, connected to their car
🔍 Detective — figure out unknown settings by visual inspection
🎯 Prep — pre-race planning and checklists

Ask which they'd like to start with.` :

mode === "detective" ? `SETUP DETECTIVE — Help user figure out their setup by visual inspection.
Guide through HIGH-IMPACT settings first:
- Spring colors (front and rear)
- Shock oil (any writing on bottles they have, or on shock bodies)
- Ride height (with ruler)
- Diff fluid weight
- Kick-up angle
- Battery position
- Caster block inserts

Walk step by step: "Flip the car over — what color are the front springs?"
For each answer, confirm: "Red front springs — stiffer than kit Orange. More responsive steering."
For unknown settings, mark as unknown and move on.
After high-impact settings, ask about secondary settings if they want to continue.
Summarize findings when done.` :

mode === "logbook" ? `LOGBOOK — User's car record.
- Show current setup when asked
- Accept changes: "I changed front springs to Red" → confirm change and what it means
- Compare to kit baseline
- Log notes about sessions
- Track history of changes
When showing setup, organize by section (Front, Rear, Drivetrain, Body) and bold anything different from kit.` :

mode === "manual" ? `MANUAL / TEACHING — Explain RC concepts.
For each concept explain:
1. WHAT it is (plain language)
2. MORE of it does what (and when you'd want more)
3. LESS of it does what (and when you'd want less)
4. HOW to change it on their car specifically
5. What THEIR current setting is

Connect to their track: "At ${profile.track || "your track"}, you'd typically want..."
Use analogies for beginners. Be technical for advanced users.` :

mode === "coach" ? `RACE NIGHT COACH — User is at the track.
RULES:
1. ONE change at a time. Never suggest multiple.
2. Reference ACTUAL current values: "Your front oil is **35wt** — drop to **30wt**"
3. After testing, ask how it went
4. BETTER: log it, keep dialing
5. WORSE: roll back immediately
6. TWO consecutive "worse": pump the brakes, suggest rolling back to best setup
7. If it feels good but slow: "Don't touch setup. Speed = lines + consistency."
8. Ask about track conditions first if unknown

Start by asking: what track, what layout, how's the grip today?` :

mode === "prep" ? `PRE-RACE PREP — Before heading to the track.
Help with:
- Setup review for the track they're visiting
- Changes to consider for the surface/conditions
- Tire and gear recommendations
- Checklist (batteries charged, parts bag, tools, spares)
- Strategy (practice plan, what to focus on)

If going to a new track, explain surface differences and suggest adjustments.
If going to home track, review current setup and any changes from last time.` : ""}

ALWAYS:
- If user asks "what is [concept]?" — explain it regardless of mode
- Keep mental model of setup changes
- Never fabricate settings
- If frustrated, acknowledge and simplify
- Use their name occasionally (not every message)`;
}

// ── AI Call ──
async function callAI(messages, systemPrompt) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: systemPrompt, messages }),
    });
    const data = await res.json();
    return data.content?.map(b => b.text || "").join("") || "Sorry, I had trouble responding. Try again?";
  } catch (err) {
    console.error("AI error:", err);
    return "I'm having trouble connecting. Check your connection and try again.";
  }
}

// ── Components ──
function Dots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "8px 0", alignItems: "center" }}>
      {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:C.textMuted, animation:`tp 1.2s ease-in-out ${i*0.15}s infinite` }}/>)}
      <style>{`@keyframes tp{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}`}</style>
    </div>
  );
}

const MODES = [
  { id:"coach", icon:"🏁", label:"Coach" },
  { id:"logbook", icon:"📋", label:"Logbook" },
  { id:"manual", icon:"📘", label:"Manual" },
  { id:"detective", icon:"🔍", label:"Detective" },
  { id:"prep", icon:"🎯", label:"Prep" },
];

function ModeBar({ mode, setMode, onSwitch }) {
  return (
    <div style={{ display:"flex", gap:4, padding:"6px 12px", overflowX:"auto", borderBottom:`1px solid ${C.border}`, background:C.chatBg, flexShrink:0 }}>
      {MODES.map(m => (
        <button key={m.id} onClick={() => { setMode(m.id); onSwitch(m.id); }}
          style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:14,
            background: mode===m.id ? C.modeActive : C.modeBg,
            border:`1px solid ${mode===m.id ? C.accent+"50" : C.modeBorder}`,
            color: mode===m.id ? C.accent : C.textMuted, fontSize:12, cursor:"pointer",
            fontFamily:"inherit", whiteSpace:"nowrap", transition:"all 0.15s" }}>
          <span>{m.icon}</span> {m.label}
        </button>
      ))}
    </div>
  );
}

// ── Main ──
export default function RaceModeV5() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState("onboarding");
  const [showModes, setShowModes] = useState(false);
  const [profile, setProfile] = useState({ name:"", car:"", track:"", experience:"", struggle:"", racingClass:"", carCondition:"", goals:"" });
  const [setup, setSetup] = useState({ ...B7_KIT });
  const [sessionLog, setSessionLog] = useState([]);
  const [history, setHistory] = useState([]);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, typing]);

  // Welcome
  useEffect(() => {
    const w = "Hey! 🏁 Welcome to **Race Mode**.\n\nI'm your AI pit crew chief — think of me as that fast guy at the track who actually wants to help you get better.\n\nI'll learn your car, your track, and how you race so everything I tell you is tailored to you.\n\nLet's start simple — **what's your name?**";
    setMsgs([{ role:"bot", text:w }]);
    setHistory([{ role:"assistant", content:w }]);
  }, []);

  const send = async () => {
    if (!input.trim() || typing) return;
    const text = input.trim();
    setInput("");
    setMsgs(p => [...p, { role:"user", text }]);
    setTyping(true);

    const newHist = [...history, { role:"user", content:text }];
    const sys = buildSystemPrompt(profile, setup, sessionLog, mode);
    const reply = await callAI(newHist, sys);

    setHistory([...newHist, { role:"assistant", content:reply }]);
    setMsgs(p => [...p, { role:"bot", text:reply }]);
    setTyping(false);

    // Extract profile hints during onboarding
    if (mode === "onboarding") {
      const lo = text.toLowerCase();
      if (!profile.name && history.length <= 3) {
        const words = text.trim().split(/\s+/);
        if (words.length <= 3) {
          const name = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
          setProfile(p => ({ ...p, name }));
        }
      }
      if (lo.includes("b7")) setProfile(p => ({ ...p, car:"RC10B7" }));
      if (lo.includes("b84")) setProfile(p => ({ ...p, car:"RC10B84" }));
      if (lo.includes("t7")) setProfile(p => ({ ...p, car:"RC10T7" }));
      if (lo.includes("beaver")) setProfile(p => ({ ...p, track:"Beaver RC" }));
      if (lo.includes("ed's") || lo.includes("eds") || lo.includes("ed ")) setProfile(p => ({ ...p, track:"Ed's Hobby Shop" }));
      if (lo.includes("used") || lo.includes("bought")) setProfile(p => ({ ...p, carCondition:"used" }));
      if (lo.includes("kit") || lo.includes("built") || lo.includes("new")) setProfile(p => ({ ...p, carCondition:"kit-built" }));

      // Show mode bar when AI wraps up onboarding
      const rLo = reply.toLowerCase();
      if (rLo.includes("coach") && rLo.includes("logbook") && rLo.includes("manual") || 
          rLo.includes("which") && (rLo.includes("mode") || rLo.includes("start") || rLo.includes("like to"))) {
        setShowModes(true);
      }
    }
  };

  const switchMode = (newMode) => {
    const intros = {
      coach: "🏁 **Coach Mode** — Tell me what the car is doing. I'll give you one change to try.",
      logbook: "📋 **Logbook** — Your complete car setup. Check settings, make changes, compare to kit.",
      manual: "📘 **Manual** — Ask me about anything. \"What is anti-squat?\" \"How does caster work?\" I'll explain it using your car as the example.",
      detective: "🔍 **Detective** — Let's figure out what your car is set to. Grab your car — I'll walk you through it.",
      prep: "🎯 **Pre-Race Prep** — Where are you racing next? Let's make sure you're ready.",
    };
    const intro = intros[newMode];
    setMsgs(p => [...p, { role:"bot", text:intro }]);
    setHistory(p => [...p, { role:"assistant", content:intro }]);
  };

  // Render helpers
  const renderText = (text) => {
    return text.split(/(\*\*.*?\*\*)/).map((p,j) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={j} style={{ color:C.white, fontWeight:600 }}>{p.slice(2,-2)}</strong>
        : <span key={j}>{p}</span>
    );
  };

  return (
    <div style={{ background:C.bg, height:"100dvh", display:"flex", flexDirection:"column", fontFamily:"-apple-system,'SF Pro Text','Segoe UI',sans-serif", color:C.text, maxWidth:500, margin:"0 auto" }}>

      {/* Header */}
      <div style={{ padding:"12px 16px", background:C.chatBg, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${C.accent},#1d4ed8)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🏁</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:600, color:C.white }}>Race Mode Engine</div>
          <div style={{ fontSize:11, color:C.textDim }}>{profile.name ? `${profile.name}${profile.car ? ` · ${profile.car}` : ""}` : "Let's get started"}</div>
        </div>
        {profile.name && (
          <div style={{ width:32, height:32, borderRadius:"50%", background:"#3b82f620", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:C.accent, fontWeight:700 }}>
            {profile.name[0].toUpperCase()}
          </div>
        )}
      </div>

      {/* Mode bar */}
      {showModes && <ModeBar mode={mode} setMode={setMode} onSwitch={switchMode} />}

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 8px", display:"flex", flexDirection:"column", gap:3 }}>
        {msgs.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent: m.role==="user" ? "flex-end":"flex-start", marginBottom:3 }}>
            <div style={{
              maxWidth:"88%", padding:"10px 14px",
              borderRadius: m.role==="user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role==="user" ? C.userBubble : C.botBubble,
              border: m.role==="bot" ? `1px solid ${C.botBorder}` : "none",
              fontSize:14, lineHeight:1.55, color:C.text, whiteSpace:"pre-wrap", wordBreak:"break-word",
            }}>
              {renderText(m.text)}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display:"flex", justifyContent:"flex-start", marginBottom:3 }}>
            <div style={{ padding:"10px 16px", borderRadius:"16px 16px 16px 4px", background:C.botBubble, border:`1px solid ${C.botBorder}` }}><Dots /></div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Input */}
      <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.border}`, background:C.chatBg, flexShrink:0 }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); }}}
            placeholder={mode==="onboarding" ? "Type here..." : mode==="coach" ? "What's the car doing?" : mode==="manual" ? 'Ask "What is anti-squat?"...' : "Type here..."}
            disabled={typing}
            style={{ flex:1, padding:"12px 16px", background:C.inputBg, border:`1px solid ${C.inputBorder}`, borderRadius:24, color:C.text, fontSize:14, fontFamily:"inherit", outline:"none", opacity:typing?0.5:1 }}
            onFocus={e => { e.target.style.borderColor=C.accent; }}
            onBlur={e => { e.target.style.borderColor=C.inputBorder; }}
          />
          <button onClick={send} disabled={!input.trim()||typing}
            style={{ width:42, height:42, borderRadius:"50%", background: input.trim()&&!typing ? C.accent : C.inputBg, border:`1px solid ${input.trim()&&!typing ? C.accent : C.inputBorder}`, color:C.white, fontSize:18, cursor: input.trim()&&!typing ? "pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>↑</button>
        </div>
      </div>
    </div>
  );
}
