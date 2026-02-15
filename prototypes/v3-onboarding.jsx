import { useState, useRef, useEffect } from "react";

// ── Theme ──
const C = {
  bg: "#07080c", chatBg: "#0c0d12", userBubble: "#1a3a6e", botBubble: "#161720",
  botBorder: "#252630", accent: "#3b82f6", accentSoft: "#3b82f620", green: "#22c55e",
  greenSoft: "#22c55e18", yellow: "#eab308", yellowSoft: "#eab30818", red: "#ef4444",
  redSoft: "#ef444418", text: "#e2e2e8", textDim: "#8b8b9e", textMuted: "#55556a",
  white: "#fff", border: "#1e1f2a", inputBg: "#111218", inputBorder: "#2a2b38",
  qr: "#171822", qrBorder: "#2a2b3a", qrActive: "#253a6a", delta: "#f59e0b",
  setupBg: "#0f1018", setupBorder: "#1c1d28",
};

// ── B7 Kit Baseline ──
const KIT = {
  front_springs: "Orange", front_shock_oil: "35wt", front_ride_height: "13mm",
  front_camber: "-1°", front_toe: "0°", front_anti_roll_bar: "1.0mm",
  front_kick_up: "0°", front_caster_insert: "+2.5", front_kpi: "2",
  front_steering_plate: "+1", front_piston: "2x1.6", front_piston_thickness: "2.5mm",
  front_stroke: "23.5mm", front_eyelet: "0", front_cup_offset: "+5",
  front_axle_height: "+3", front_wheel_hex: "6.5mm", front_bellcrank: "Up",
  front_bulkhead: "Aluminum",
  rear_springs: "Gray", rear_shock_oil: "30wt", rear_ride_height: "13mm",
  rear_camber: "-1°", rear_anti_roll_bar: "1.2mm", rear_piston: "2x1.9",
  rear_piston_thickness: "2.5mm", rear_stroke: "27.5mm", rear_eyelet: "+2",
  rear_cup_offset: "0", rear_axle_height: "+2", rear_wheel_hex: "5mm",
  rear_hub_type: "HRC", rear_hub_spacing: "Mid", rear_arm_spacing: "Mid",
  rear_drive_shaft: "CVA's",
  diff_type: "Gear Diff", diff_fluid: "30k", diff_height: "2",
  battery_position: "3", battery_mount: "Std",
  wing_angle: "6°", rear_wing: 'RC10B7 7"', front_wing: "RC10B7",
};

const SECTION_ORDER = {
  "Front Suspension": ["front_springs", "front_shock_oil", "front_ride_height", "front_kick_up",
    "front_anti_roll_bar", "front_camber", "front_toe", "front_caster_insert", "front_kpi",
    "front_steering_plate", "front_piston", "front_stroke", "front_eyelet", "front_cup_offset",
    "front_axle_height", "front_wheel_hex", "front_bellcrank"],
  "Rear Suspension": ["rear_springs", "rear_shock_oil", "rear_ride_height", "rear_anti_roll_bar",
    "rear_camber", "rear_piston", "rear_stroke", "rear_eyelet", "rear_cup_offset",
    "rear_axle_height", "rear_wheel_hex", "rear_hub_type", "rear_hub_spacing", "rear_arm_spacing"],
  "Drivetrain": ["diff_type", "diff_fluid", "diff_height", "battery_position", "battery_mount"],
  "Body & Wings": ["wing_angle", "rear_wing", "front_wing"],
};

const LABELS = {
  front_springs: "Front Springs", front_shock_oil: "Front Shock Oil", front_ride_height: "Front Ride Height",
  front_camber: "Front Camber", front_toe: "Front Toe", front_anti_roll_bar: "Front ARB",
  front_kick_up: "Kick-Up Angle", front_caster_insert: "Caster Insert", front_kpi: "Steering Block KPI",
  front_steering_plate: "Steering Plate", front_piston: "Front Piston", front_piston_thickness: "Front Piston Thickness",
  front_stroke: "Front Stroke", front_eyelet: "Front Eyelet", front_cup_offset: "Front Cup Offset",
  front_axle_height: "Front Axle Height", front_wheel_hex: "Front Wheel Hex", front_bellcrank: "Bellcrank Position",
  front_bulkhead: "Bulkhead Type",
  rear_springs: "Rear Springs", rear_shock_oil: "Rear Shock Oil", rear_ride_height: "Rear Ride Height",
  rear_camber: "Rear Camber", rear_anti_roll_bar: "Rear ARB", rear_piston: "Rear Piston",
  rear_piston_thickness: "Rear Piston Thickness", rear_stroke: "Rear Stroke", rear_eyelet: "Rear Eyelet",
  rear_cup_offset: "Rear Cup Offset", rear_axle_height: "Rear Axle Height", rear_wheel_hex: "Rear Wheel Hex",
  rear_hub_type: "Hub Type", rear_hub_spacing: "Hub Spacing", rear_arm_spacing: "Arm Spacing",
  rear_drive_shaft: "Drive Shaft",
  diff_type: "Differential", diff_fluid: "Diff Fluid", diff_height: "Diff Height",
  battery_position: "Battery Position", battery_mount: "Battery Mount",
  wing_angle: "Wing Angle", rear_wing: "Rear Wing", front_wing: "Front Wing",
};

const TRACKS = [
  { id: "beaver", name: "Beaver RC", desc: "Old grey Ozite · Low-med grip" },
  { id: "eds", name: "Ed's Hobby Shop", desc: "Black CRC carpet · High grip" },
  { id: "other", name: "Somewhere else", desc: "I'll describe it" },
];
const LAYOUTS = ["Tight / Technical", "Open / Fast", "Mixed"];
const TEMPS = ["Cold (<55°F)", "Cool (55-65°F)", "Warm (65-75°F)", "Hot (75°F+)"];
const ATTENDANCE_OPTIONS = ["Light (<15)", "Moderate (15-25)", "Packed (25+)"];
const GRIP_OPTIONS = ["Very low", "Low", "Low-medium", "Medium", "Medium-high"];
const SYMPTOMS = [
  "Loose on corner entry", "Loose on corner exit", "Pushes on entry", "Pushes on exit",
  "No steering at all", "Snappy / unpredictable", "Lazy / slow to respond",
  "Traction rolling", "Bouncing / hopping", "Feels good but slow", "Something else",
];
const RESULT_OPTIONS = [
  { label: "Better", c: C.green }, { label: "A little better", c: C.green },
  { label: "About the same", c: C.yellow }, { label: "Worse", c: C.red }, { label: "Much worse", c: C.red },
];

// ── Guided Builder Questions (Tier 1 first) ──
const BUILDER_QUESTIONS = [
  {
    key: "front_springs", q: "What **front springs** are you running?",
    opts: ["White (softest)", "Silver", "Orange", "Red", "Blue", "Black (stiffest)", "Not sure"],
    teach: (v) => {
      const kit = KIT.front_springs;
      if (v === kit) return `Same as kit (${kit}). Got it.`;
      if (v === "Not sure") return "No problem — I'll keep it as kit spec for now. If steering feel comes up, we might revisit.";
      const softer = ["White", "Silver"].includes(v.split(" ")[0]);
      return `Kit is ${kit}, you're on ${v.split(" ")[0]}. That's ${softer ? "softer — more progressive steering, slower weight transfer" : "stiffer — quicker initial response, faster weight transfer"}.`;
    }
  },
  {
    key: "rear_springs", q: "What about **rear springs**?",
    opts: ["White (softest)", "Silver", "Yellow", "Gray", "Orange", "Red", "Not sure"],
    teach: (v) => {
      const kit = KIT.rear_springs;
      if (v.startsWith(kit)) return `Same as kit (${kit}).`;
      if (v === "Not sure") return "I'll keep kit spec. We can figure it out if rear behavior comes up.";
      const softer = ["White", "Silver", "Yellow"].includes(v.split(" ")[0]) && kit === "Gray";
      return `Kit is ${kit}, you're on ${v.split(" ")[0]}. ${softer ? "Softer rear = more rear traction, more squat on power. Good for low grip." : "Stiffer rear = less body roll, quicker transitions. More aggressive."}`;
    }
  },
  {
    key: "front_shock_oil", q: "**Front shock oil** weight?",
    opts: ["25wt", "27.5wt", "30wt", "32.5wt", "35wt", "37.5wt", "40wt", "Not sure"],
    teach: (v) => {
      if (v === "Not sure") return "I'll assume kit (35wt). Shock oil is easy to check later if needed.";
      if (v === KIT.front_shock_oil) return "Same as kit (35wt).";
      const lighter = parseFloat(v) < 35;
      return `Kit is 35wt, you're at ${v}. ${lighter ? "Lighter oil = front loads faster on turn-in = more steering response." : "Heavier oil = front loads slower = more stability, less twitchy."}`;
    }
  },
  {
    key: "rear_shock_oil", q: "**Rear shock oil**?",
    opts: ["25wt", "27.5wt", "30wt", "32.5wt", "35wt", "37.5wt", "40wt", "Not sure"],
    teach: (v) => {
      if (v === "Not sure") return "Kit spec (30wt) it is.";
      if (v === KIT.rear_shock_oil) return "Same as kit (30wt).";
      const heavier = parseFloat(v) > 30;
      return `Kit is 30wt, you're at ${v}. ${heavier ? "Heavier rear oil = more rear stability, controls weight transfer on accel." : "Lighter rear = more responsive, but rear can get loose easier."}`;
    }
  },
  {
    key: "diff_fluid", q: "**Diff fluid** — what weight are you running in the gear diff?",
    opts: ["3k", "5k", "7k", "10k", "20k", "30k", "50k", "80k", "100k", "Not sure"],
    teach: (v) => {
      if (v === "Not sure") return "Diff fluid is a big one — if you can check it before race night, it helps a lot. I'll use kit (30k) for now.";
      if (v === KIT.diff_fluid) return "Same as kit (30k).";
      const heavier = parseInt(v) > 30;
      return `Kit is 30k, you're at ${v}. ${heavier ? "Heavier diff = more locked feel = better traction on power but less rotation mid-corner." : "Lighter diff = freer, more corner rotation but can get loose on power."}`;
    }
  },
  {
    key: "front_ride_height", q: "**Front ride height**?",
    opts: ["12mm", "13mm", "14mm", "15mm", "Not sure"],
    teach: (v) => {
      if (v === "Not sure") return "Kit spec (13mm). Easy to measure at the track.";
      if (v === KIT.front_ride_height) return "Same as kit (13mm).";
      const higher = parseInt(v) > 13;
      return `Kit is 13mm, you're at ${v}. ${higher ? "Higher = more ground clearance, more body roll. Common on low-grip carpet." : "Lower = less body roll, more responsive but can bottom out."}`;
    }
  },
  {
    key: "rear_ride_height", q: "**Rear ride height**?",
    opts: ["12mm", "13mm", "14mm", "15mm", "Not sure"],
    teach: (v) => {
      if (v === "Not sure") return "Kit spec (13mm).";
      if (v === KIT.rear_ride_height) return "Same as kit (13mm).";
      return `Kit is 13mm, you're at ${v}.`;
    }
  },
  {
    key: "front_kick_up", q: "**Kick-up angle**? This affects how much mechanical steering you get.",
    opts: ["-2.5°", "0°", "+2.5°", "Not sure"],
    teach: (v) => {
      if (v === "Not sure") return "Kit is 0°. Kick-up is one of the first things we might change if you have no steering at Beaver.";
      if (v === "0°") return "Same as kit — neutral kick-up.";
      const more = v.includes("+");
      return `Kit is 0°, you're at ${v}. ${more ? "More kick-up = more camber gain in turns = more mechanical front grip. Great for low-grip carpet." : "Negative kick-up is unusual — makes the front lazier on turn-in."}`;
    }
  },
  {
    key: "battery_position", q: "**Battery position**? (1 = back, 5 = full forward)",
    opts: ["1 (Back)", "2", "3 (Kit)", "4", "5 (Full Forward)", "Not sure"],
    teach: (v) => {
      if (v === "Not sure") return "Kit is position 3 (middle).";
      if (v.includes("3")) return "Kit position. Balanced weight.";
      const fwd = v.includes("4") || v.includes("5");
      return `Kit is 3. ${fwd ? "Forward battery = more front weight = more front traction. Aggressive for low grip." : "Rearward battery = more rear traction, less front grip."}`;
    }
  },
  {
    key: "wing_angle", q: "Last big one — **wing angle**?",
    opts: ["0°", "3°", "6° (Kit)", "Not sure"],
    teach: (v) => {
      if (v === "Not sure") return "Kit is 6°.";
      if (v.includes("6")) return "Kit spec — full downforce.";
      const less = v.includes("0") || v.includes("3");
      return `Kit is 6°. ${less ? "Less wing = less downforce = less drag. You trade rear stability at speed for straight-line speed." : ""}`;
    }
  },
];

// ── Setup Viewer ──
function SetupViewer({ setup, diffs }) {
  const [tab, setTab] = useState("Front Suspension");
  return (
    <div style={{ background: C.setupBg, border: `1px solid ${C.setupBorder}`, borderRadius: 12, overflow: "hidden", margin: "4px 0" }}>
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.setupBorder}` }}>
        <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 2 }}>RC10B7 · Current Setup</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginTop: 2 }}>
          {diffs.length > 0 ? `${diffs.length} change${diffs.length !== 1 ? "s" : ""} from kit` : "Kit Baseline"}
        </div>
      </div>
      <div style={{ display: "flex", overflowX: "auto", borderBottom: `1px solid ${C.setupBorder}` }}>
        {Object.keys(SECTION_ORDER).map((s) => (
          <div key={s} onClick={() => setTab(s)} style={{
            padding: "7px 10px", fontSize: 10, color: tab === s ? C.accent : C.textMuted,
            borderBottom: `2px solid ${tab === s ? C.accent : "transparent"}`, cursor: "pointer", whiteSpace: "nowrap",
          }}>{s}</div>
        ))}
      </div>
      <div style={{ maxHeight: 260, overflowY: "auto" }}>
        {(SECTION_ORDER[tab] || []).map((key) => {
          const diff = diffs.find((d) => d.key === key);
          return (
            <div key={key} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "7px 14px", borderBottom: `1px solid ${C.setupBorder}`,
              borderLeft: diff ? `3px solid ${C.delta}` : "3px solid transparent",
              background: diff ? `${C.delta}08` : "transparent",
            }}>
              <span style={{ fontSize: 12, color: C.textDim }}>{LABELS[key] || key}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {diff && <span style={{ fontSize: 11, color: C.textMuted, textDecoration: "line-through" }}>{diff.from}</span>}
                <span style={{ fontSize: 13, fontWeight: diff ? 600 : 400, color: diff ? C.delta : C.white }}>
                  {setup[key] || KIT[key]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Typing Dots ──
function Dots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "8px 0", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.textMuted,
          animation: `tp 1.2s ease-in-out ${i * 0.15}s infinite` }} />
      ))}
      <style>{`@keyframes tp{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}`}</style>
    </div>
  );
}

// ── Recommendation Engine ──
function getCoachRec(symptom, cond, hist, setup) {
  const lowGrip = ["Very low", "Low", "Low-medium"].includes(cond.grip);
  const tight = cond.layout === "Tight / Technical";
  const isBeaver = cond.track === "beaver";
  const wc = hist.filter((h) => h.result?.includes("orse")).length;

  if (wc >= 2) {
    return { text: `⚠️ Two changes that made it worse. That's a spiral starting.\n\nWhat felt best tonight? Let's consider rolling back.`, qr: ["Roll back to start", "Tell me what I changed", "Keep going"] };
  }

  const val = (k) => setup[k] || KIT[k];
  const recs = {
    "No steering at all": (() => {
      const ku = val("front_kick_up");
      if (ku === "0°" || ku === "0") {
        return { text: `No steering${isBeaver ? " — Beaver's old Ozite makes this the #1 issue" : ""}.\n\nYour kick-up is **${ku}** — that's flat. **Go to +2.5° kick-up.** This creates camber gain as the wheels turn, giving mechanical front grip without changing springs or shocks.\n\nFront oil is **${val("front_shock_oil")}**, springs are **${val("front_springs")}** — leave those. One change.`, qr: ["I'll try that", "Already tried kick-up", "What else?"],
          change: { key: "front_kick_up", from: ku, to: "+2.5°" } };
      }
      const fo = val("front_shock_oil");
      const newOil = parseFloat(fo) > 30 ? "30wt" : "27.5wt";
      return { text: `Kick-up is already at **${ku}** — good. Front oil is **${fo}**. **Drop to ${newOil}.** Lighter oil lets the front compress quicker on turn-in.\n\nBattery is at position **${val("battery_position")}**${val("battery_position") !== "5" ? " — if oil doesn't help, moving battery forward is the next step." : " (already full forward, good)."}`,
        qr: ["I'll try that", "Already running light oil", "What about tires?"],
        change: { key: "front_shock_oil", from: fo, to: newOil } };
    })(),
    "Loose on corner exit": (() => {
      const df = val("diff_fluid");
      const n = parseInt(df); const nd = n < 50 ? "50k" : n < 80 ? "80k" : "100k";
      return { text: `Loose on exit — rear unloading on power.${lowGrip ? " Low grip makes this worse." : ""}\n\nDiff fluid is **${df}**. **Step up to ${nd}.** Heavier diff keeps torque on both tires.\n\nRear springs (**${val("rear_springs")}**), oil (**${val("rear_shock_oil")}**) — leave those. Isolate the diff.`,
        qr: ["I'll try that", "Already heavy on diff", "It's mid-corner not exit"],
        change: { key: "diff_fluid", from: df, to: nd } };
    })(),
    "Pushes on entry": (() => {
      const fo = val("front_shock_oil"); const nf = parseFloat(fo) > 30 ? "30wt" : "27.5wt";
      return { text: `Push on entry — front won't load.${tight ? " Tight layout makes this costly." : ""}\n\nFront oil is **${fo}**. **Drop to ${nf}.** Faster front compression = quicker weight transfer = more entry bite.\n\nSprings (**${val("front_springs")}**), ARB (**${val("front_anti_roll_bar")}**) stay the same.`,
        qr: ["I'll try that", "Already light on oil", "What about springs?"],
        change: { key: "front_shock_oil", from: fo, to: nf } };
    })(),
    "Pushes on exit": (() => {
      const df = val("diff_fluid"); const n = parseInt(df);
      if (n > 40) {
        return { text: `Push on exit with diff at **${df}** — that's fairly locked. Rear is too planted to rotate.\n\n**Drop diff to ${n > 60 ? "50k" : "30k"}.** Freer diff lets the rear rotate on power.`,
          qr: ["I'll try that", "Already tried lighter diff", "What about springs?"],
          change: { key: "diff_fluid", from: df, to: n > 60 ? "50k" : "30k" } };
      }
      return { text: `Push on exit, diff already at **${df}**. Rear springs are **${val("rear_springs")}**. **Go one step softer.** More squat on power frees the front.`,
        qr: ["I'll try softer springs", "Already soft", "What about front?"],
        change: { key: "rear_springs", from: val("rear_springs"), to: "Softer (1 step)" } };
    })(),
    "Snappy / unpredictable": (() => {
      return { text: `Snappy car — weight transferring too aggressively.\n\nFront springs are **${val("front_springs")}**, oil is **${val("front_shock_oil")}**. **Go one step softer on front springs.** Slows initial weight transfer, makes the car more forgiving.${isBeaver ? "\n\nAt Beaver with inconsistent grip, a forgiving front end is worth its weight in gold." : ""}`,
        qr: ["I'll try softer springs", "Already soft", "It's the rear that's snappy"],
        change: { key: "front_springs", from: val("front_springs"), to: "Softer (1 step)" } };
    })(),
    "Lazy / slow to respond": (() => {
      const arb = val("front_anti_roll_bar"); const n = parseFloat(arb);
      return { text: `Lazy car${tight ? " — kills you on a tight layout" : ""}.\n\nFront ARB is **${arb}**. **Go up to ${(n + 0.2).toFixed(1)}mm.** Stiffer bar speeds up weight transfer on turn-in.\n\nSprings (**${val("front_springs")}**), oil (**${val("front_shock_oil")}**) stay the same.`,
        qr: ["I'll try that", "Already stiff on ARB", "What about shock oil?"],
        change: { key: "front_anti_roll_bar", from: arb, to: `${(n + 0.2).toFixed(1)}mm` } };
    })(),
    "Loose on corner entry": (() => {
      const arb = val("rear_anti_roll_bar"); const n = parseFloat(arb);
      return { text: `Rear stepping out on turn-in.${lowGrip ? " Low grip makes the rear sketchy on entry." : ""}\n\nRear ARB is **${arb}**. **Go to ${(n + 0.2).toFixed(1)}mm.** Stiffer rear bar reduces body roll on entry, keeps the rear planted.\n\nDiff is **${val("diff_fluid")}**, rear springs **${val("rear_springs")}** — leave those.`,
        qr: ["I'll try that", "Already stiff on ARB", "Would more rear toe help?"],
        change: { key: "rear_anti_roll_bar", from: arb, to: `${(n + 0.2).toFixed(1)}mm` } };
    })(),
    "Traction rolling": (() => {
      return { text: `Traction rolling — too much grip.${!lowGrip ? " Grip probably came up." : ""}\n\nRide height is **${val("front_ride_height")}F / ${val("rear_ride_height")}R**. **Raise both 1mm.** Less leverage for the tires to flip the car.\n\nIf that's not enough: softer rear springs (**${val("rear_springs")}**) or thinner rear ARB (**${val("rear_anti_roll_bar")}**).`,
        qr: ["I'll raise ride height", "Already tried that", "Might be a carpet seam"] };
    })(),
    "Feels good but slow": (() => {
      return { text: `⚠️ **Don't change the setup.** If it feels good, protect that.\n\nSpeed issues with a balanced car = gearing or line choice. Battery is at **${val("battery_position")}**, wing at **${val("wing_angle")}**.\n\nTry **+1 tooth on pinion**. But if the car starts handling different, **roll back immediately.**${isBeaver ? "\n\nAt Beaver, the fast line changes with grip. Consistency beats aggression." : ""}`,
        qr: ["I'll try +1 pinion", "Gearing is good", "Maybe it's my driving", "Show my setup"] };
    })(),
    "Bouncing / hopping": (() => {
      return { text: `Bouncing = shocks not controlling suspension.\n\nFront: **${val("front_springs")} springs / ${val("front_shock_oil")} oil**\nRear: **${val("rear_springs")} springs / ${val("rear_shock_oil")} oil**\n\nWhere is it bouncing?`,
        qr: ["Front is bouncing", "Rear is hopping", "Both", "Not sure"] };
    })(),
  };
  return recs[symptom] || { text: "Tell me more — entry, mid-corner, or exit? Front or rear?", qr: ["Entry", "Mid-corner", "Exit", "Both ends"] };
}

// ── Main App ──
export default function RaceModeV3() {
  const [msgs, setMsgs] = useState([]);
  const [phase, setPhase] = useState("init");
  const [cond, setCond] = useState({});
  const [hist, setHist] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [qr, setQr] = useState([]);
  const [setup, setSetup] = useState({ ...KIT });
  const [diffs, setDiffs] = useState([]);
  const [builderIdx, setBuilderIdx] = useState(0);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);
  useEffect(() => {
    setTimeout(() => bot("Hey! 🏁 Let's get you set up. What car are you running today?", ["RC10B7", "RC10B84", "RC10T7"]), 500);
  }, []);

  const bot = (text, replies = [], extra = null) => {
    setTyping(true); setQr([]);
    const d = Math.min(600 + text.length * 5, 1800);
    setTimeout(() => { setTyping(false); setMsgs((p) => [...p, { role: "bot", text, extra }]); if (replies.length) setQr(replies); }, d);
  };
  const user = (text) => { setMsgs((p) => [...p, { role: "user", text }]); setQr([]); };

  const setVal = (key, val) => {
    const clean = val.split(" (")[0]; // strip labels like "(softest)"
    const newSetup = { ...setup, [key]: clean };
    setSetup(newSetup);
    const kitVal = KIT[key];
    if (clean !== kitVal && clean !== "Not sure") {
      setDiffs((p) => {
        const filtered = p.filter((d) => d.key !== key);
        return [...filtered, { key, from: kitVal, to: clean }];
      });
    }
  };

  const applyChange = (ch) => {
    if (!ch) return;
    setSetup((p) => ({ ...p, [ch.key]: ch.to }));
    setDiffs((p) => [...p.filter((d) => d.key !== ch.key), { key: ch.key, from: ch.from, to: ch.to }]);
  };

  const rollback = () => { setSetup({ ...KIT }); setDiffs([]); setHist([]); };

  const nextBuilderQ = (idx) => {
    if (idx >= BUILDER_QUESTIONS.length) {
      const cnt = diffs.length;
      bot(
        `That's the big stuff covered. Your B7 is loaded with ${cnt > 0 ? `**${cnt} change${cnt !== 1 ? "s" : ""}** from kit` : "kit baseline"}.\n\nYou can always say **"show my setup"** to see everything, or **"change my [setting]"** to update something later.\n\n${cnt > 0 ? "I can see the philosophy behind your setup — " + (diffs.some(d => d.key.includes("front")) ? "you've been working on the front end" : "interesting choices") + ". " : ""}Ready to pick a track and race?`,
        ["Let's race!", "Show my setup", "I want to add more details", "Change something"]
      );
      setPhase("setup_done");
      return;
    }
    const bq = BUILDER_QUESTIONS[idx];
    bot(bq.q, bq.opts);
    setBuilderIdx(idx);
    setPhase("building");
  };

  const handle = (reply) => {
    user(reply);
    const lo = reply.toLowerCase();

    // Global commands
    if (lo.includes("show") && lo.includes("setup")) {
      setTimeout(() => {
        setMsgs((p) => [...p, { role: "bot", text: diffs.length > 0
          ? `Here's your B7 — ${diffs.length} change${diffs.length !== 1 ? "s" : ""} from kit highlighted.`
          : "Your B7 on kit baseline — no changes yet.", extra: "setup" }]);
        setQr(phase === "racing" ? SYMPTOMS.slice(0, 5) : ["Let's race!", "Change something", "Looks good"]);
      }, 400);
      return;
    }

    // ── INIT: Car selection ──
    if (phase === "init") {
      if (reply === "RC10B7") {
        setPhase("onboard_choice");
        setTimeout(() => bot(
          "B7 — great choice. How do you want to load your setup?",
          ["Upload a setup sheet", "Build it with me", "I'm running kit — tell you what I changed"]
        ), 300);
      } else {
        setTimeout(() => bot(`${reply} support is coming soon! For now, let's work with the B7. Select it to continue.`, ["RC10B7"]), 300);
      }
    }

    // ── ONBOARD CHOICE ──
    else if (phase === "onboard_choice") {
      if (reply === "Upload a setup sheet") {
        setTimeout(() => bot(
          "Upload support is coming in the next version! For now, let's build it together — it only takes a minute and I'll teach you what each setting does along the way.\n\nOr if you're close to kit, just tell me what you changed.",
          ["Build it with me", "I'm running kit — tell you what I changed"]
        ), 300);
      } else if (reply === "Build it with me") {
        setPhase("building");
        setTimeout(() => bot(
          "Let's do it. I'll start with kit baseline and ask about the **high-impact stuff** first — springs, oils, diff, ride height. We can go deeper later if you want.\n\nIf you don't know something, just say so. No judgment — we'll work with what you know. 👊",
          ["Ready!"]
        ), 300);
      } else if (reply.includes("kit")) {
        setPhase("kit_diff");
        setTimeout(() => bot(
          "Nice — starting from kit. Tell me what you changed. Just rattle them off however you want.\n\nLike: *\"I changed front springs to red, diff is 50k, battery is full forward\"*\n\nOr one at a time — whatever works.",
          ["That's actually all kit", "Let me list the changes"]
        ), 300);
      }
    }

    // ── KIT DIFF MODE ──
    else if (phase === "kit_diff") {
      if (reply === "That's actually all kit") {
        setTimeout(() => {
          bot("Pure kit setup — respect. Let's see what the track tells us tonight. Ready to pick a track?", ["Let's race!", "Show my setup"]);
          setPhase("setup_done");
        }, 300);
      } else if (reply === "Let me list the changes") {
        setTimeout(() => bot("Go ahead — tell me what's different from kit. I'll catch it all.", []), 300);
      } else {
        // Parse free-text changes
        const changes = [];
        if (lo.includes("spring")) {
          if (lo.includes("red") && lo.includes("front")) { setVal("front_springs", "Red"); changes.push("Front springs → Red"); }
          if (lo.includes("yellow") && lo.includes("rear")) { setVal("rear_springs", "Yellow"); changes.push("Rear springs → Yellow"); }
          if (lo.includes("red") && !lo.includes("front") && !lo.includes("rear")) { setVal("front_springs", "Red"); changes.push("Front springs → Red (assumed front)"); }
        }
        if (lo.includes("diff") && lo.match(/\d+k/)) { const m = lo.match(/(\d+)k/); setVal("diff_fluid", m[1] + "k"); changes.push(`Diff fluid → ${m[1]}k`); }
        if (lo.includes("battery") && lo.includes("forward")) { setVal("battery_position", "5"); changes.push("Battery → position 5 (full forward)"); }
        if (lo.includes("30") && lo.includes("oil") && lo.includes("front")) { setVal("front_shock_oil", "30wt"); changes.push("Front shock oil → 30wt"); }
        if (lo.includes("ride height") && lo.includes("14")) { setVal("front_ride_height", "14mm"); setVal("rear_ride_height", "14mm"); changes.push("Ride height → 14mm F&R"); }
        if (lo.includes("kick") && lo.includes("2.5")) { setVal("front_kick_up", "+2.5°"); changes.push("Kick-up → +2.5°"); }

        if (changes.length > 0) {
          setTimeout(() => bot(`Got it:\n${changes.map((c) => `• **${c}**`).join("\n")}\n\nAnything else, or is that it?`, ["That's everything", "More changes", "Show my setup"]), 300);
        } else {
          setTimeout(() => bot("I want to make sure I catch that right. Can you tell me the specific setting and value? Like \"front springs are Red\" or \"diff is 50k\".", []), 300);
        }
      }
      if (reply === "That's everything") {
        setTimeout(() => {
          bot(`Setup loaded — ${diffs.length} change${diffs.length !== 1 ? "s" : ""} from kit. Ready to race?`, ["Let's race!", "Show my setup", "Add more changes"]);
          setPhase("setup_done");
        }, 300);
      }
    }

    // ── BUILDER: Ready prompt ──
    else if (phase === "building" && reply === "Ready!") {
      nextBuilderQ(0);
    }

    // ── BUILDER: Answering questions ──
    else if (phase === "building") {
      const bq = BUILDER_QUESTIONS[builderIdx];
      if (bq) {
        const clean = reply.split(" (")[0];
        if (reply !== "Not sure") setVal(bq.key, clean);
        const teach = bq.teach(reply);
        const nextIdx = builderIdx + 1;
        setTimeout(() => {
          bot(teach);
          setTimeout(() => nextBuilderQ(nextIdx), 800);
        }, 300);
      }
    }

    // ── SETUP DONE → pick track ──
    else if (phase === "setup_done") {
      if (reply === "Let's race!" || reply === "Looks good") {
        setPhase("pick_track");
        setTimeout(() => bot("Where are you racing tonight?", TRACKS.map((t) => t.name)), 300);
      } else if (reply === "I want to add more details") {
        setPhase("building");
        nextBuilderQ(builderIdx + 1);
      } else if (reply === "Change something" || reply === "Add more changes") {
        setTimeout(() => bot("What do you want to change? Tell me the setting and value.", []), 300);
        setPhase("kit_diff");
      }
    }

    // ── TRACK SELECTION FLOW ──
    else if (phase === "pick_track") {
      const t = TRACKS.find((x) => x.name === reply);
      if (t) { setCond((p) => ({ ...p, track: t.id })); setPhase("pick_layout"); setTimeout(() => bot(t.id === "beaver" ? "Beaver — nice. What's the layout this week?" : t.id === "eds" ? "Ed's — that black carpet hooks up. Layout?" : "What kind of layout?", LAYOUTS), 300); }
    } else if (phase === "pick_layout") {
      setCond((p) => ({ ...p, layout: reply })); setPhase("pick_temp");
      setTimeout(() => bot("Temperature tonight?", TEMPS), 300);
    } else if (phase === "pick_temp") {
      setCond((p) => ({ ...p, temp: reply })); setPhase("pick_attendance");
      setTimeout(() => bot(cond.track === "beaver" ? "How packed is Beaver? (Affects humidity & grip.)" : "How many people?", ATTENDANCE_OPTIONS), 300);
    } else if (phase === "pick_attendance") {
      setCond((p) => ({ ...p, attendance: reply })); setPhase("pick_grip");
      setTimeout(() => bot("Grip level after your first run?", GRIP_OPTIONS), 300);
    } else if (phase === "pick_grip") {
      const c = { ...cond, grip: reply }; setCond(c); setPhase("racing");
      const packed = c.attendance?.includes("Packed");
      const bn = c.track === "beaver" && packed ? " Packed house — grip should climb with humidity." : "";
      setTimeout(() => bot(`${c.layout}, ${reply.toLowerCase()} grip, ${c.temp?.toLowerCase()}.${bn}\n\nYour B7 is loaded${diffs.length > 0 ? ` with ${diffs.length} changes from kit` : ""}. I know your full setup. After each run, tell me what the car is doing.\n\n**What's the car doing?**`, SYMPTOMS), 300);
    }

    // ── RACING / COACHING ──
    else if (phase === "racing") {
      if (SYMPTOMS.includes(reply)) {
        setTimeout(() => {
          const rec = getCoachRec(reply, cond, hist, setup);
          bot(rec.text, rec.qr || [], rec.change ? { type: "change", data: rec.change } : null);
          setHist((p) => [...p, { symptom: reply, change: rec.change }]);
          setPhase("result");
        }, 300);
      } else if (reply === "Roll back to start") {
        rollback();
        setTimeout(() => { bot("Clean slate — back to your starting setup. Run it and tell me what happens.", SYMPTOMS); setPhase("racing"); }, 300);
      } else if (reply === "Tell me what I changed") {
        const log = hist.map((h, i) => `${i + 1}. ${h.symptom}${h.change ? ` (${h.change.from}→${h.change.to})` : ""} → ${h.result || "pending"}`).join("\n");
        setTimeout(() => { bot(`Tonight:\n\n${log || "Nothing yet."}\n\nWhat do you want to do?`, ["Roll back to start", "Keep going", "Show my setup"]); }, 300);
      } else {
        setTimeout(() => { bot("What's the car doing out there?", SYMPTOMS); }, 300);
      }
    }

    // ── RESULT ──
    else if (phase === "result") {
      const isRes = RESULT_OPTIONS.some((r) => r.label === reply);
      if (isRes) {
        const last = hist[hist.length - 1]; if (last) { last.result = reply; setHist([...hist]); }
        if (reply.includes("etter") && last?.change) applyChange(last.change);
        setTimeout(() => {
          if (reply.includes("etter")) {
            bot(`${reply === "A little better" ? "Right direction." : "Nice!"} ${last?.change ? `Logged: **${last.change.from} → ${last.change.to}**.` : ""}\n\nKeep dialing or ride this into the main?`,
              ["Keep dialing", "I'm good for the main", "Show my setup", ...SYMPTOMS.slice(0, 3)]);
          } else if (reply.includes("orse")) {
            bot("Roll that back — go to what you had before. Then tell me what the car is doing.", ["Rolled it back", "What should I try instead?"]);
          } else {
            bot("Same as before. Let's try a different angle.", SYMPTOMS);
          }
          setPhase("racing");
        }, 300);
      } else if (reply === "I'll try that") {
        bot("Go run it. 👊", RESULT_OPTIONS.map((r) => r.label));
      } else {
        setPhase("racing"); setTimeout(() => handle(reply), 100); return;
      }
    }

    // ── POST RACE ──
    else if (reply === "I'm good for the main" || phase === "post") {
      setPhase("post");
      if (reply === "I'm good for the main") {
        bot(`${diffs.length} change${diffs.length !== 1 ? "s" : ""} from where you started.${diffs.length <= 2 ? " Clean session." : ""}\n\nGo get 'em. 🏁`, ["Won! 🏆", "Podium", "Ran well", "Rough main"]);
      } else {
        bot(`Session logged. 📋\nConditions: ${cond.layout}, ${cond.grip} grip\nChanges tonight: ${hist.length}\n\n🏁 See you next race night.`, []);
        setPhase("done");
      }
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const t = input.trim(); setInput("");
    handle(t);
  };

  const renderMsg = (m, i) => (
    <div key={i}>
      <div style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 4 }}>
        <div style={{
          maxWidth: "88%", padding: "10px 14px",
          borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          background: m.role === "user" ? C.userBubble : C.botBubble,
          border: m.role === "bot" ? `1px solid ${C.botBorder}` : "none",
          fontSize: 14, lineHeight: 1.55, color: C.text, whiteSpace: "pre-wrap", wordBreak: "break-word",
        }}>
          {m.text.split(/(\*\*.*?\*\*)/).map((p, j) =>
            p.startsWith("**") && p.endsWith("**")
              ? <strong key={j} style={{ color: C.white, fontWeight: 600 }}>{p.slice(2, -2)}</strong>
              : <span key={j}>{p}</span>
          )}
        </div>
      </div>
      {m.role === "bot" && m.extra?.type === "change" && (
        <div style={{ paddingLeft: 8, marginBottom: 4 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${C.delta}15`, border: `1px solid ${C.delta}35`, borderRadius: 8, padding: "6px 12px", fontSize: 12 }}>
            <span style={{ color: C.textDim }}>{m.extra.data.from}</span>
            <span style={{ color: C.delta }}>→</span>
            <span style={{ color: C.delta, fontWeight: 600 }}>{m.extra.data.to}</span>
          </div>
        </div>
      )}
      {m.role === "bot" && m.extra === "setup" && <SetupViewer setup={setup} diffs={diffs} />}
    </div>
  );

  return (
    <div style={{ background: C.bg, height: "100vh", display: "flex", flexDirection: "column", fontFamily: "-apple-system,'SF Pro Text','Segoe UI',sans-serif", color: C.text, maxWidth: 500, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", background: C.chatBg, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${C.accent},#1d4ed8)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏁</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.white }}>Race Mode Coach</div>
          <div style={{ fontSize: 12, color: C.textDim }}>
            {phase === "done" ? "Session complete" : phase === "init" ? "Let's get started" : `B7${cond.track ? " · " + (cond.track === "beaver" ? "Beaver" : cond.track === "eds" ? "Ed's" : "Track") : ""}`}
          </div>
        </div>
        {(phase === "racing" || phase === "result") && <div style={{ background: C.greenSoft, border: `1px solid ${C.green}30`, borderRadius: 20, padding: "3px 10px", fontSize: 11, color: C.green, fontWeight: 500 }}>● Live</div>}
        {diffs.length > 0 && <div style={{ background: C.accentSoft, border: `1px solid ${C.accent}30`, borderRadius: 20, padding: "3px 10px", fontSize: 11, color: C.accent }}>{diffs.length}Δ</div>}
      </div>

      {/* Conditions bar */}
      {cond.layout && (
        <div style={{ padding: "5px 16px", background: C.chatBg, borderBottom: `1px solid ${C.border}`, display: "flex", gap: 5, flexWrap: "wrap", flexShrink: 0 }}>
          {[cond.layout, cond.grip, cond.temp, cond.attendance].filter(Boolean).map((t) => (
            <span key={t} style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "2px 8px", fontSize: 10, color: C.textMuted }}>{t}</span>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        {msgs.map(renderMsg)}
        {typing && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4 }}>
            <div style={{ padding: "10px 16px", borderRadius: "16px 16px 16px 4px", background: C.botBubble, border: `1px solid ${C.botBorder}` }}><Dots /></div>
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
                padding: "8px 14px", background: ro ? ro.c + "12" : C.qr,
                border: `1px solid ${ro ? ro.c + "40" : C.qrBorder}`, borderRadius: 20,
                color: ro ? ro.c : C.accent, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                whiteSpace: "nowrap", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = ro ? ro.c + "25" : C.qrActive; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ro ? ro.c + "12" : C.qr; }}
              >{r}</button>
            );
          })}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, background: C.chatBg, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            placeholder={phase === "done" ? "Session complete" : phase === "building" ? "Or type your answer..." : "Tell me what the car is doing..."}
            disabled={phase === "done"}
            style={{ flex: 1, padding: "12px 16px", background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: 24, color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none" }}
            onFocus={(e) => { e.target.style.borderColor = C.accent; }}
            onBlur={(e) => { e.target.style.borderColor = C.inputBorder; }}
          />
          <button onClick={handleSend} disabled={!input.trim() || phase === "done"} style={{
            width: 42, height: 42, borderRadius: "50%", background: input.trim() ? C.accent : C.inputBg,
            border: `1px solid ${input.trim() ? C.accent : C.inputBorder}`, color: C.white, fontSize: 18,
            cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>↑</button>
        </div>
      </div>
    </div>
  );
}
