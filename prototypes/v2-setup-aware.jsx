import { useState, useRef, useEffect } from "react";

// ── Theme ──
const C = {
  bg: "#07080c",
  chatBg: "#0c0d12",
  userBubble: "#1a3a6e",
  botBubble: "#161720",
  botBorder: "#252630",
  accent: "#3b82f6",
  accentSoft: "#3b82f620",
  green: "#22c55e",
  greenSoft: "#22c55e18",
  yellow: "#eab308",
  yellowSoft: "#eab30818",
  red: "#ef4444",
  redSoft: "#ef444418",
  orange: "#f97316",
  text: "#e2e2e8",
  textDim: "#8b8b9e",
  textMuted: "#55556a",
  white: "#ffffff",
  border: "#1e1f2a",
  inputBg: "#111218",
  inputBorder: "#2a2b38",
  qr: "#171822",
  qrBorder: "#2a2b3a",
  qrActive: "#253a6a",
  setupBg: "#0f1018",
  setupBorder: "#1c1d28",
  delta: "#f59e0b",
};

// ── B7 Kit Baseline (verified from PDF) ──
const B7_SETUP = {
  front_suspension: {
    ride_height: { value: "13mm", label: "Ride Height" },
    camber: { value: "-1°", label: "Camber" },
    toe: { value: "0°", label: "Toe" },
    anti_roll_bar: { value: "1.0mm", label: "Anti-Roll Bar" },
    kick_up_angle: { value: "0°", label: "Kick-Up Angle" },
    caster_block_insert: { value: "+2.5", label: "Caster Block Insert" },
    steering_plate: { value: "+1", label: "Steering Plate" },
    steering_block_kpi: { value: "2", label: "Steering Block KPI" },
    bellcrank_position: { value: "Up", label: "Bellcrank Position" },
    bulkhead_type: { value: "Aluminum", label: "Bulkhead Type" },
    wheel_hex: { value: "6.5mm", label: "Wheel Hex" },
    axle_height: { value: "+3", label: "Axle Height" },
  },
  front_shocks: {
    spring: { value: "Orange", label: "Spring" },
    fluid: { value: "35wt", label: "Shock Fluid" },
    piston: { value: "2x1.6", label: "Piston" },
    stroke: { value: "23.5mm", label: "Stroke" },
    eyelet: { value: "0", label: "Eyelet" },
    cup_offset: { value: "+5", label: "Cup Offset" },
    ext_limiter: { value: "1", label: "Ext. Limiter" },
    thickness: { value: "2.5mm", label: "Piston Thickness" },
  },
  rear_suspension: {
    ride_height: { value: "13mm", label: "Ride Height" },
    camber: { value: "-1°", label: "Camber" },
    anti_roll_bar: { value: "1.2mm", label: "Anti-Roll Bar" },
    hub_type: { value: "HRC", label: "Hub Type" },
    hub_spacing: { value: "Mid", label: "Hub Spacing" },
    arm_spacing: { value: "Mid", label: "Arm Spacing" },
    axle_height: { value: "+2", label: "Axle Height" },
    wheel_hex: { value: "5mm", label: "Wheel Hex" },
    drive_shaft: { value: "CVA's", label: "Drive Shaft" },
    camber_link_spacing: { value: "2mm", label: "Camber Link Spacing" },
    c_mount: { value: "Aluminum", label: "C Mount" },
    d_mount: { value: "Aluminum", label: "D Mount" },
  },
  rear_shocks: {
    spring: { value: "Gray", label: "Spring" },
    fluid: { value: "30wt", label: "Shock Fluid" },
    piston: { value: "2x1.9", label: "Piston" },
    stroke: { value: "27.5mm", label: "Stroke" },
    eyelet: { value: "+2", label: "Eyelet" },
    cup_offset: { value: "0", label: "Cup Offset" },
    ext_limiter: { value: "2", label: "Ext. Limiter" },
    thickness: { value: "2.5mm", label: "Piston Thickness" },
  },
  drivetrain: {
    diff_type: { value: "Gear Diff", label: "Differential" },
    diff_height: { value: "2", label: "Diff Height" },
    diff_setting: { value: "30k", label: "Diff Fluid" },
    slipper_type: { value: "HD", label: "Slipper Type" },
    slipper_pads: { value: "2x11mm", label: "Slipper Pads" },
    battery_position: { value: "3", label: "Battery Position" },
    battery_mount: { value: "Std", label: "Battery Mount" },
  },
  body: {
    body_shell: { value: "RC10B7", label: "Body" },
    front_wing: { value: "RC10B7", label: "Front Wing" },
    rear_wing: { value: 'RC10B7 7"', label: "Rear Wing" },
    wing_angle: { value: "6°", label: "Wing Angle" },
    servo_weights: { value: "None", label: "Servo Weights" },
    electronic_weights: { value: "Aluminum", label: "Electronic Weights" },
  },
};

// Current running setup starts as kit baseline — changes get tracked here
const createMutableSetup = () => {
  const setup = {};
  for (const section of Object.keys(B7_SETUP)) {
    setup[section] = {};
    for (const [key, entry] of Object.entries(B7_SETUP[section])) {
      setup[section][key] = { ...entry };
    }
  }
  return setup;
};

const SECTION_LABELS = {
  front_suspension: "Front Suspension",
  front_shocks: "Front Shocks",
  rear_suspension: "Rear Suspension",
  rear_shocks: "Rear Shocks",
  drivetrain: "Drivetrain",
  body: "Body & Wings",
};

const TRACKS = [
  { id: "beaver", name: "Beaver RC", desc: "Old grey Ozite · Low-med grip" },
  { id: "eds", name: "Ed's Hobby Shop", desc: "Black CRC carpet · High grip" },
  { id: "other", name: "Other track", desc: "I'll describe it" },
];
const LAYOUTS = ["Tight / Technical", "Open / Fast", "Mixed"];
const TEMPS = ["Cold (<55°F)", "Cool (55-65°F)", "Warm (65-75°F)", "Hot (75°F+)"];
const ATTENDANCE_OPTIONS = ["Light (<15)", "Moderate (15-25)", "Packed (25+)"];
const GRIP_OPTIONS = ["Very low", "Low", "Low-medium", "Medium", "Medium-high"];

const SYMPTOMS = [
  "Loose on corner entry",
  "Loose on corner exit",
  "Pushes on entry",
  "Pushes on exit",
  "No steering at all",
  "Snappy / unpredictable",
  "Lazy / slow to respond",
  "Traction rolling",
  "Bouncing / hopping",
  "Feels good but slow",
  "Something else",
];

const RESULT_OPTIONS = [
  { label: "Better", color: C.green },
  { label: "A little better", color: C.green },
  { label: "About the same", color: C.yellow },
  { label: "Worse", color: C.red },
  { label: "Much worse", color: C.red },
];

// ── Setup-aware recommendation engine ──
function generateCoachReply(symptom, conditions, history, setup) {
  const lowGrip = ["Very low", "Low", "Low-medium"].includes(conditions.grip);
  const tight = conditions.layout === "Tight / Technical";
  const isBeaver = conditions.track === "beaver";
  const changeCount = history.length;

  const f = setup.front_suspension;
  const fs = setup.front_shocks;
  const r = setup.rear_suspension;
  const rs = setup.rear_shocks;
  const d = setup.drivetrain;

  // Guardrail
  const worseCount = history.filter((h) => h.result?.includes("orse")).length;
  if (worseCount >= 2) {
    return {
      text: `⚠️ Hold up — ${changeCount} changes tonight and the car has gotten worse twice. That's a spiral.\n\nWhat felt best tonight? We should consider rolling back there instead of chasing forward.`,
      quickReplies: ["Roll back to start", "Tell me what I changed", "Keep going anyway"],
      isWarning: true,
    };
  }

  const recs = {
    "No steering at all": (() => {
      const kickUp = f.kick_up_angle.value;
      const caster = f.caster_block_insert.value;
      const frontOil = fs.fluid.value;

      if (kickUp === "0°" || kickUp === "0") {
        return {
          text: `No steering — ${isBeaver ? "Beaver's old Ozite makes this the #1 complaint there" : "front end isn't biting"}.\n\nYour kick-up is at **${kickUp}** right now — that's flat. **Go to +2.5° kick-up.** This creates camber gain as the wheels turn, giving you mechanical front grip without touching springs or shocks.\n\nYour caster insert is at **${caster}** and front oil is **${frontOil}** — leave those alone for now. One change.`,
          quickReplies: ["I'll try that", "Already tried kick-up", "What else could help?"],
          change: { section: "front_suspension", key: "kick_up_angle", from: kickUp, to: "+2.5°" },
        };
      } else {
        return {
          text: `Still no steering even with kick-up at **${kickUp}**. Let's look at the front end.\n\nYour front shock oil is **${frontOil}** — that's on the heavy side. **Drop to ${frontOil === "35wt" ? "30wt" : "27.5wt"}.** Lighter front oil lets the suspension compress faster on turn-in, loading the front tire quicker.\n\nFront springs are **${fs.spring.value}** and your ARB is **${f.anti_roll_bar.value}** — we'll leave those for now.`,
          quickReplies: ["I'll try that", "What about the tires?", "It's not entry, it's mid-corner"],
          change: { section: "front_shocks", key: "fluid", from: frontOil, to: frontOil === "35wt" ? "30wt" : "27.5wt" },
        };
      }
    })(),

    "Loose on corner exit": (() => {
      const diffFluid = d.diff_setting.value;
      const diffNum = parseInt(diffFluid);
      const newDiff = diffNum < 50 ? "50k" : diffNum < 80 ? "80k" : "100k";

      return {
        text: `Loose on exit — rear is unloading on power. ${lowGrip ? "Low grip amplifies this since there's less traction holding the rear." : ""}\n\nYour rear diff is at **${diffFluid}**. **Step it up to ${newDiff}.** Heavier diff fluid keeps more torque on both rear tires instead of letting the inside wheel spin up.\n\nRear springs are **${rs.spring.value}**, rear oil is **${rs.fluid.value}** — don't touch those yet. Isolate the diff change first.${changeCount > 0 ? `\n\nThis is change #${changeCount + 1} tonight — stay disciplined.` : ""}`,
        quickReplies: ["I'll try that", "Already running heavy diff", "It's more mid-corner"],
        change: { section: "drivetrain", key: "diff_setting", from: diffFluid, to: newDiff },
      };
    })(),

    "Pushes on entry": (() => {
      const frontOil = fs.fluid.value;
      const frontOilNum = parseFloat(frontOil);
      const newOil = frontOilNum > 32 ? "30wt" : "27.5wt";

      return {
        text: `Push on entry — front isn't loading fast enough when you turn in. ${tight ? "On a tight layout this really costs you." : ""}\n\nYour front shock oil is **${frontOil}** — **drop it to ${newOil}.** Lighter oil lets the front compress quicker, transferring weight to the front tires sooner for more initial bite.\n\nFront springs (**${fs.spring.value}**), ARB (**${f.anti_roll_bar.value}**), and kick-up (**${f.kick_up_angle.value}**) stay the same. One change at a time.`,
        quickReplies: ["I'll try that", "Already running light oil", "What about springs?"],
        change: { section: "front_shocks", key: "fluid", from: frontOil, to: newOil },
      };
    })(),

    "Pushes on exit": (() => {
      const rearSpring = rs.spring.value;
      const diffFluid = d.diff_setting.value;
      const diffNum = parseInt(diffFluid);

      if (diffNum > 40) {
        return {
          text: `Push on exit — car won't tighten on power. Your rear diff is at **${diffFluid}** which is fairly locked — that can actually cause push because the rear is too planted.\n\n**Drop the rear diff to ${diffNum > 60 ? "50k" : "30k"}.** A freer diff lets the rear rotate more on throttle, which helps the car pivot around on exit.\n\nRear springs are **${rearSpring}**, rear oil is **${rs.fluid.value}** — leave those.`,
          quickReplies: ["I'll try that", "Already tried lighter diff", "What about rear springs?"],
          change: { section: "drivetrain", key: "diff_setting", from: diffFluid, to: diffNum > 60 ? "50k" : "30k" },
        };
      }
      return {
        text: `Push on exit with diff already at **${diffFluid}** — let's look at springs.\n\nYour rear springs are **${rearSpring}**. **Go one step softer.** Softer rears let the car squat more on acceleration, shifting weight rearward and freeing the front to rotate.\n\nLeave the diff and rear oil (**${rs.fluid.value}**) alone for now.`,
        quickReplies: ["I'll try softer springs", "Already soft on springs", "What about the front?"],
        change: { section: "rear_shocks", key: "spring", from: rearSpring, to: "Softer (1 step down)" },
      };
    })(),

    "Loose on corner entry": (() => {
      const rearArb = r.anti_roll_bar.value;
      const arbNum = parseFloat(rearArb);
      const newArb = `${(arbNum + 0.2).toFixed(1)}mm`;

      return {
        text: `Rear stepping out on turn-in. ${lowGrip ? "Low grip makes the rear sketchy on entry — common at Beaver." : ""}\n\nYour rear ARB is at **${rearArb}**. **Go up to ${newArb}.** A stiffer rear bar reduces body roll on entry, keeping the rear planted during initial turn-in.\n\nRear diff is **${d.diff_setting.value}**, rear springs are **${rs.spring.value}** — leave those alone. ARB is a clean, isolated change.`,
        quickReplies: ["I'll try that", "Already stiff on ARB", "Would more rear toe help?"],
        change: { section: "rear_suspension", key: "anti_roll_bar", from: rearArb, to: newArb },
      };
    })(),

    "Snappy / unpredictable": (() => {
      const frontSpring = fs.spring.value;
      const frontOil = fs.fluid.value;

      return {
        text: `Snappy car — weight is transferring too aggressively. You can't trust it.\n\nYour front springs are **${frontSpring}** and front oil is **${frontOil}**. **Go one step softer on front springs.** This slows down the initial weight transfer rate, making the car more progressive and predictable.\n\n${isBeaver ? "At Beaver with inconsistent grip, a more forgiving front end gives you way more consistency." : ""}\n\nLeave the oil at **${frontOil}** — changing both would stack variables.`,
        quickReplies: ["I'll try softer springs", "Already soft", "It's the rear that's snappy"],
        change: { section: "front_shocks", key: "spring", from: frontSpring, to: "Softer (1 step down)" },
      };
    })(),

    "Lazy / slow to respond": (() => {
      const frontArb = f.anti_roll_bar.value;
      const arbNum = parseFloat(frontArb);
      const newArb = `${(arbNum + 0.2).toFixed(1)}mm`;

      return {
        text: `Lazy car — won't change direction quick enough. ${tight ? "That kills you on a tight layout." : ""}\n\nYour front ARB is **${frontArb}**. **Go up to ${newArb}.** Stiffer front bar speeds up weight transfer on turn-in without changing straight-line handling.\n\nFront springs are **${fs.spring.value}**, oil is **${fs.fluid.value}** — both stay the same. ARB is a clean isolated change.`,
        quickReplies: ["I'll try that", "Already stiff on ARB", "What about front shock oil?"],
        change: { section: "front_suspension", key: "anti_roll_bar", from: frontArb, to: newArb },
      };
    })(),

    "Traction rolling": (() => {
      const fRH = f.ride_height.value;
      const rRH = r.ride_height.value;

      return {
        text: `Traction rolling — too much grip flipping the car. ${!lowGrip ? "Grip must have come up tonight." : "Rolling on low grip is unusual — might be tripping on a carpet seam."}\n\nYour ride height is **${fRH} front / ${rRH} rear**. **Raise both by 1mm.** Higher CG reduces the leverage the tires have to roll the car.\n\nIf that's not enough, next step is softer rear springs (currently **${rs.spring.value}**) or thinner rear ARB (currently **${r.anti_roll_bar.value}**).`,
        quickReplies: ["I'll raise ride height", "Already tried that", "Might be a carpet seam"],
        change: null,
      };
    })(),

    "Bouncing / hopping": (() => {
      return {
        text: `Bouncing usually means the shocks aren't controlling the suspension — spring and oil aren't matched.\n\nYour front is **${fs.spring.value} springs / ${fs.fluid.value} oil**, rear is **${rs.spring.value} springs / ${rs.fluid.value} oil**.\n\nWhere is it bouncing — front or rear? That tells me which end to address.`,
        quickReplies: ["Front is bouncing", "Rear is hopping", "Both ends", "Not sure"],
      };
    })(),

    "Feels good but slow": (() => {
      return {
        text: `⚠️ Most dangerous symptom in RC. Car feels balanced but you're not fast.\n\n**Do NOT change the setup.** If it feels good, protect that.\n\nSpeed issues when the car is balanced are almost always gearing or line choice. Your battery position is at **${d.battery_position.value}**, wing angle is **${B7_SETUP.body.wing_angle.value}**.\n\nIf you think it's straight-line speed, you could try **+1 tooth on the pinion** — but if the car starts handling different after, **roll back the pinion immediately.** Don't chase the new symptom.\n\n${isBeaver ? "At Beaver, line choice matters a lot. The fast line isn't always obvious on old carpet." : ""}`,
        quickReplies: ["I'll try +1 pinion", "Gearing is good", "Maybe it's my driving", "Show me my setup"],
        change: null,
      };
    })(),
  };

  const match = recs[symptom];
  if (match) return match;

  return {
    text: "Tell me more — is it happening on entry, mid-corner, or exit? And is it the front end or rear end misbehaving?",
    quickReplies: ["It's on entry", "It's mid-corner", "It's on exit", "It's everywhere"],
  };
}

// ── Setup Viewer Component ──
function SetupViewer({ setup, changes }) {
  const [activeTab, setActiveTab] = useState("front_suspension");
  const tabs = Object.keys(SECTION_LABELS);

  return (
    <div style={{ background: C.setupBg, border: `1px solid ${C.setupBorder}`, borderRadius: 12, overflow: "hidden", margin: "4px 0" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.setupBorder}` }}>
        <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 2 }}>RC10B7 · Current Setup</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.white, marginTop: 2 }}>
          {changes.length > 0 ? `Kit Baseline + ${changes.length} change${changes.length !== 1 ? "s" : ""}` : "Kit Baseline (no changes)"}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", overflowX: "auto", borderBottom: `1px solid ${C.setupBorder}` }}>
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 12px",
              fontSize: 11,
              color: activeTab === tab ? C.accent : C.textMuted,
              borderBottom: `2px solid ${activeTab === tab ? C.accent : "transparent"}`,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {SECTION_LABELS[tab]}
          </div>
        ))}
      </div>

      {/* Settings */}
      <div style={{ maxHeight: 280, overflowY: "auto" }}>
        {Object.entries(setup[activeTab] || {}).map(([key, entry]) => {
          const change = changes.find((c) => c.section === activeTab && c.key === key);
          const isChanged = !!change;
          return (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 16px",
                borderBottom: `1px solid ${C.setupBorder}`,
                borderLeft: isChanged ? `3px solid ${C.delta}` : `3px solid transparent`,
                background: isChanged ? `${C.delta}08` : "transparent",
              }}
            >
              <span style={{ fontSize: 12, color: C.textDim }}>{entry.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {isChanged && (
                  <span style={{ fontSize: 11, color: C.textMuted, textDecoration: "line-through" }}>
                    {change.from}
                  </span>
                )}
                <span style={{ fontSize: 13, fontWeight: isChanged ? 600 : 400, color: isChanged ? C.delta : C.white }}>
                  {entry.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Typing dots ──
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "8px 0", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 7, height: 7, borderRadius: "50%", background: C.textMuted,
            animation: `tp 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes tp { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-6px);opacity:1} }`}</style>
    </div>
  );
}

// ── Change pill shown after a recommendation ──
function ChangePill({ change }) {
  if (!change) return null;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: `${C.delta}15`, border: `1px solid ${C.delta}35`,
      borderRadius: 8, padding: "6px 12px", margin: "6px 0 2px", fontSize: 12,
    }}>
      <span style={{ color: C.textDim }}>{change.from}</span>
      <span style={{ color: C.delta }}>→</span>
      <span style={{ color: C.delta, fontWeight: 600 }}>{change.to}</span>
    </div>
  );
}

// ── Main App ──
export default function RaceModeV2() {
  const [msgs, setMsgs] = useState([]);
  const [phase, setPhase] = useState("init");
  const [cond, setCond] = useState({});
  const [hist, setHist] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [qr, setQr] = useState([]);
  const [setup, setSetup] = useState(createMutableSetup);
  const [changes, setChanges] = useState([]);
  const [lastChange, setLastChange] = useState(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  useEffect(() => {
    setTimeout(() => botSay("Hey! 🏁 Where are you racing tonight?", TRACKS.map((t) => t.name)), 600);
  }, []);

  const botSay = (text, replies = [], extra = null) => {
    setTyping(true);
    setQr([]);
    const delay = Math.min(700 + text.length * 6, 2000);
    setTimeout(() => {
      setTyping(false);
      setMsgs((p) => [...p, { role: "bot", text, extra }]);
      if (replies.length) setQr(replies);
    }, delay);
  };

  const userSay = (text) => {
    setMsgs((p) => [...p, { role: "user", text }]);
    setQr([]);
  };

  const applyChange = (change) => {
    if (!change) return;
    const newSetup = { ...setup };
    const section = { ...newSetup[change.section] };
    section[change.key] = { ...section[change.key], value: change.to };
    newSetup[change.section] = section;
    setSetup(newSetup);
    setChanges((p) => [...p, change]);
    setLastChange(change);
  };

  const rollbackAll = () => {
    setSetup(createMutableSetup());
    setChanges([]);
    setLastChange(null);
    setHist([]);
  };

  const handle = (reply) => {
    userSay(reply);

    // Setup viewer trigger
    const lower = reply.toLowerCase();
    if (lower.includes("show") && lower.includes("setup") || lower === "show me my setup") {
      setTimeout(() => {
        setMsgs((p) => [...p, { role: "bot", text: changes.length > 0
          ? `Here's your B7 — kit baseline with ${changes.length} change${changes.length !== 1 ? "s" : ""} tonight. Changed settings are highlighted.`
          : "Here's your B7 running kit baseline — no changes yet tonight.", extra: "setup" }]);
        setQr(["Thanks", "What should I change?", ...SYMPTOMS.slice(0, 4)]);
      }, 500);
      return;
    }

    if (phase === "init") {
      const track = TRACKS.find((t) => t.name === reply);
      if (track) {
        setCond((p) => ({ ...p, track: track.id }));
        setPhase("layout");
        setTimeout(() => botSay(
          track.id === "beaver" ? "Beaver — nice. What's the layout like this week?"
            : track.id === "eds" ? "Ed's — that black carpet hooks up. What's the layout tonight?"
            : "Cool. What kind of layout is it?",
          LAYOUTS
        ), 300);
      }
    } else if (phase === "layout") {
      setCond((p) => ({ ...p, layout: reply }));
      setPhase("temp");
      setTimeout(() => botSay("How's the temperature tonight?", TEMPS), 300);
    } else if (phase === "temp") {
      setCond((p) => ({ ...p, temp: reply }));
      setPhase("attendance");
      setTimeout(() => botSay(
        cond.track === "beaver" ? "How packed is Beaver tonight? (Affects humidity and grip.)" : "How many people showed up?",
        ATTENDANCE_OPTIONS
      ), 300);
    } else if (phase === "attendance") {
      setCond((p) => ({ ...p, attendance: reply }));
      setPhase("grip");
      setTimeout(() => botSay("After your first run, how's the grip level?", GRIP_OPTIONS), 300);
    } else if (phase === "grip") {
      const c = { ...cond, grip: reply };
      setCond(c);
      setPhase("ready");
      const packed = c.attendance?.includes("Packed");
      const beaverNote = c.track === "beaver" && packed ? " Packed house — grip should build as humidity goes up." : "";
      setTimeout(() => botSay(
        `Got it. ${c.layout}, ${reply.toLowerCase()} grip, ${c.temp?.toLowerCase()}.${beaverNote}\n\nYour B7 is loaded with kit baseline. After each run, tell me what the car is doing.\n\nYou can also say **"show me my setup"** anytime to see your current settings.\n\nWhat's the car doing?`,
        SYMPTOMS
      ), 300);
    } else if (phase === "ready" || phase === "coaching") {
      setPhase("coaching");
      if (SYMPTOMS.includes(reply)) {
        setTimeout(() => {
          const rec = generateCoachReply(reply, cond, hist, setup);
          botSay(rec.text, rec.quickReplies || [], rec.change ? { type: "change", data: rec.change } : null);
          setHist((p) => [...p, { symptom: reply, recommendation: rec.text, change: rec.change }]);
          setPhase("awaiting_result");
        }, 300);
      } else if (reply === "Roll back to start") {
        rollbackAll();
        setTimeout(() => {
          botSay("Clean slate. Setup is back to kit baseline.\n\nRun a heat and tell me how it feels.", ["Car feels better now", "Still having issues", "Show me my setup"]);
          setPhase("ready");
        }, 300);
      } else if (reply === "Keep going anyway") {
        setTimeout(() => { botSay("Your call. 👀 What's the car doing?", SYMPTOMS); setPhase("ready"); }, 300);
      } else {
        setTimeout(() => followUp(reply), 300);
      }
    } else if (phase === "awaiting_result") {
      const isResult = RESULT_OPTIONS.some((r) => r.label === reply);
      if (isResult) {
        const last = hist[hist.length - 1];
        if (last) { last.result = reply; setHist([...hist]); }
        const pos = reply.includes("etter");
        const neg = reply.includes("orse");

        if (pos && last?.change) applyChange(last.change);

        setTimeout(() => {
          if (pos) {
            botSay(
              `${reply === "A little better" ? "Heading the right direction." : "Solid improvement."} ${last?.change ? `Logged: **${last.change.from} → ${last.change.to}**.` : ""}\n\nWant to keep dialing or ride this into the main?`,
              ["Keep dialing", "I'm good for the main", "Show me my setup", ...SYMPTOMS.slice(0, 3)]
            );
          } else if (neg) {
            const wc = hist.filter((h) => h.result?.includes("orse")).length;
            if (wc >= 2) {
              botSay(`Two changes that made it worse. ⚠️\n\nThis is how race nights spiral. Roll back to where the car felt best.`, ["Roll back to start", "Tell me what I changed", "Keep going anyway"]);
            } else {
              botSay(`Didn't help. **Roll that change back** — go back to what you had.\n\nOnce you're back, tell me what the car is doing and we'll try a different approach.`, ["Rolled it back", "What should I try instead?", ...SYMPTOMS.slice(0, 3)]);
            }
          } else {
            botSay("Same as before — that wasn't the issue. Let's try a different angle. What's the car doing?", SYMPTOMS);
          }
          setPhase("ready");
        }, 300);
      } else {
        setPhase("coaching");
        setTimeout(() => followUp(reply), 300);
      }
    } else if (phase === "post_race") {
      setTimeout(() => {
        botSay(`Session logged. 📋\n\n${cond.layout}, ${cond.grip} grip, ${cond.temp}\nChanges made: ${changes.length}\n\nSee you next race night. 🏁`, []);
        setPhase("done");
      }, 300);
    }
  };

  const followUp = (reply) => {
    if (reply === "I'll try that") {
      botSay("Go run it. 👊 Better, worse, or same?", RESULT_OPTIONS.map((r) => r.label));
      setPhase("awaiting_result");
    } else if (reply === "I'm good for the main") {
      botSay(`${changes.length} change${changes.length !== 1 ? "s" : ""} tonight.${changes.length <= 2 ? " Clean session — that's discipline." : ""}\n\nGo get 'em. 🏁`, ["Won the main! 🏆", "Podium", "Ran well", "It was okay", "Rough main"]);
      setPhase("post_race");
    } else if (reply === "Keep dialing" || reply === "What's the car doing now?" || reply === "What should I change?" || reply === "Car feels better now" || reply === "Still having issues" || reply === "Rolled it back" || reply === "What should I try instead?") {
      botSay("What's the car doing?", SYMPTOMS);
      setPhase("ready");
    } else if (reply === "Tell me what I changed") {
      const log = hist.map((h, i) => `${i + 1}. ${h.symptom} → ${h.result || "pending"}${h.change ? ` (${h.change.from}→${h.change.to})` : ""}`).join("\n");
      botSay(`Tonight's changes:\n\n${log || "None yet."}\n\nWhat do you want to do?`, ["Roll back to start", "Show me my setup", "Keep going"]);
      setPhase("ready");
    } else if (reply === "Maybe it's my driving") {
      botSay(`Sometimes it is — and that's fine. It means your setup is in a good window.\n\nFocus on hitting the same line every lap instead of pushing harder. Consistency beats aggression. ${cond.track === "beaver" ? "At Beaver, the fast line changes with grip level." : ""}\n\nKeep the setup for the main?`, ["Yeah I'll keep it", "Let me try one more thing"]);
      setPhase("ready");
    } else if (reply.includes("Thanks") || reply === "Keep going") {
      botSay("What's the car doing now?", SYMPTOMS);
      setPhase("ready");
    } else if (reply === "Already tried kick-up" || reply === "Already running light oil" || reply === "Already running heavy diff" || reply === "Already soft on springs" || reply === "Already stiff on ARB" || reply === "Already soft" || reply === "Already tried that" || reply === "Already tried lighter diff") {
      botSay("Good — you've already gone that direction. Tell me the symptom again more specifically and I'll find a different approach.\n\nWhat exactly is the car doing?", SYMPTOMS);
      setPhase("ready");
    } else if (reply.includes("main") || reply.includes("Main") || reply.includes("Won") || reply.includes("Podium") || reply.includes("well") || reply.includes("okay") || reply.includes("Rough")) {
      botSay(`Session logged. 📋\n\nConditions: ${cond.layout}, ${cond.grip} grip, ${cond.temp}\nChanges: ${changes.length}\n\nGood session. See you next time. 🏁`, []);
      setPhase("done");
    } else {
      botSay("Got it. What's the main symptom you want to fix?", SYMPTOMS);
      setPhase("ready");
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const t = input.trim();
    setInput("");
    const lo = t.toLowerCase();

    if (lo.includes("show") && lo.includes("setup")) {
      handle("Show me my setup");
      return;
    }

    userSay(t);
    setTimeout(() => {
      if (lo.includes("loose") && lo.includes("exit")) handle("Loose on corner exit");
      else if (lo.includes("loose") && lo.includes("entry")) handle("Loose on corner entry");
      else if (lo.includes("push") && lo.includes("entry")) handle("Pushes on entry");
      else if (lo.includes("push") && lo.includes("exit")) handle("Pushes on exit");
      else if (lo.includes("no steering") || lo.includes("won't turn") || lo.includes("wont turn")) handle("No steering at all");
      else if (lo.includes("snappy") || lo.includes("twitchy")) handle("Snappy / unpredictable");
      else if (lo.includes("lazy") || lo.includes("slow to respond")) handle("Lazy / slow to respond");
      else if (lo.includes("roll") && !lo.includes("back")) handle("Traction rolling");
      else if (lo.includes("bounc") || lo.includes("hop")) handle("Bouncing / hopping");
      else if (lo.includes("good but slow") || lo.includes("balanced but slow")) handle("Feels good but slow");
      else botSay("Tell me as a handling symptom — what's the car doing out there?", SYMPTOMS.slice(0, 6));
    }, 400);
  };

  return (
    <div style={{ background: C.bg, height: "100vh", display: "flex", flexDirection: "column", fontFamily: "-apple-system,'SF Pro Text','Segoe UI',sans-serif", color: C.text, maxWidth: 500, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", background: C.chatBg, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${C.accent},#1d4ed8)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏁</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.white }}>Race Mode Coach</div>
          <div style={{ fontSize: 12, color: C.textDim }}>
            {phase === "done" ? "Session complete" : phase === "init" ? "Starting up..." : `B7 · ${cond.track === "beaver" ? "Beaver RC" : cond.track === "eds" ? "Ed's" : "Racing"}`}
          </div>
        </div>
        {phase !== "init" && phase !== "done" && (
          <div style={{ background: C.greenSoft, border: `1px solid ${C.green}30`, borderRadius: 20, padding: "3px 10px", fontSize: 11, color: C.green, fontWeight: 500 }}>● Live</div>
        )}
      </div>

      {/* Conditions bar */}
      {cond.layout && (
        <div style={{ padding: "6px 16px", background: C.chatBg, borderBottom: `1px solid ${C.border}`, display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
          {[cond.layout, cond.grip, cond.temp, cond.attendance].filter(Boolean).map((t) => (
            <span key={t} style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "2px 8px", fontSize: 10, color: C.textMuted }}>{t}</span>
          ))}
          {changes.length > 0 && (
            <span style={{ background: C.accentSoft, border: `1px solid ${C.accent}30`, borderRadius: 12, padding: "2px 8px", fontSize: 10, color: C.accent, marginLeft: "auto" }}>
              {changes.length} change{changes.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        {msgs.map((m, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 4 }}>
              <div style={{
                maxWidth: "88%", padding: "10px 14px",
                borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.role === "user" ? C.userBubble : C.botBubble,
                border: m.role === "bot" ? `1px solid ${C.botBorder}` : "none",
                fontSize: 14, lineHeight: 1.55, color: C.text, whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                {m.text.split(/(\*\*.*?\*\*)/).map((part, j) =>
                  part.startsWith("**") && part.endsWith("**")
                    ? <strong key={j} style={{ color: C.white, fontWeight: 600 }}>{part.slice(2, -2)}</strong>
                    : <span key={j}>{part}</span>
                )}
              </div>
            </div>
            {/* Change pill */}
            {m.role === "bot" && m.extra?.type === "change" && (
              <div style={{ paddingLeft: 8, marginBottom: 4 }}>
                <ChangePill change={m.extra.data} />
              </div>
            )}
            {/* Setup viewer */}
            {m.role === "bot" && m.extra === "setup" && (
              <div style={{ marginBottom: 4 }}>
                <SetupViewer setup={setup} changes={changes} />
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4 }}>
            <div style={{ padding: "10px 16px", borderRadius: "16px 16px 16px 4px", background: C.botBubble, border: `1px solid ${C.botBorder}` }}>
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick replies */}
      {qr.length > 0 && (
        <div style={{ padding: "8px 16px", display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0, maxHeight: 200, overflowY: "auto" }}>
          {qr.map((r) => {
            const ro = RESULT_OPTIONS.find((x) => x.label === r);
            return (
              <button key={r} onClick={() => handle(r)} style={{
                padding: "8px 14px", background: ro ? ro.color + "12" : C.qr,
                border: `1px solid ${ro ? ro.color + "40" : C.qrBorder}`,
                borderRadius: 20, color: ro ? ro.color : C.accent, fontSize: 13,
                cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = ro ? ro.color + "25" : C.qrActive; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ro ? ro.color + "12" : C.qr; }}
              >{r}</button>
            );
          })}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, background: C.chatBg, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            placeholder={phase === "done" ? "Session complete" : "Tell me what the car is doing..."}
            disabled={phase === "done"}
            style={{
              flex: 1, padding: "12px 16px", background: C.inputBg, border: `1px solid ${C.inputBorder}`,
              borderRadius: 24, color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none",
            }}
            onFocus={(e) => { e.target.style.borderColor = C.accent; }}
            onBlur={(e) => { e.target.style.borderColor = C.inputBorder; }}
          />
          <button onClick={handleSend} disabled={!input.trim() || phase === "done"} style={{
            width: 42, height: 42, borderRadius: "50%",
            background: input.trim() ? C.accent : C.inputBg,
            border: `1px solid ${input.trim() ? C.accent : C.inputBorder}`,
            color: C.white, fontSize: 18, cursor: input.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>↑</button>
        </div>
      </div>
    </div>
  );
}
