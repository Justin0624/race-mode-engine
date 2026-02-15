import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#07080c", chatBg: "#0c0d12", userBubble: "#1a3a6e", botBubble: "#161720",
  botBorder: "#252630", accent: "#3b82f6", accentSoft: "#3b82f620", green: "#22c55e",
  greenSoft: "#22c55e18", yellow: "#eab308", red: "#ef4444",
  text: "#e2e2e8", textDim: "#8b8b9e", textMuted: "#55556a", white: "#fff",
  border: "#1e1f2a", inputBg: "#111218", inputBorder: "#2a2b38",
  qr: "#171822", qrBorder: "#2a2b3a", qrActive: "#253a6a", delta: "#f59e0b",
  setupBg: "#0f1018", setupBorder: "#1c1d28",
  know: "#a78bfa", knowBg: "#a78bfa08", knowBorder: "#a78bfa25",
};

// ── Knowledge Base — 25+ concepts ──
const KB = {
  "anti-squat": {
    kw: ["anti squat","antisquat","anti-squat","squat"],
    title: "Anti-Squat",
    what: "Anti-squat controls how much the rear compresses when you accelerate. It's geometry built into the suspension.",
    more: "**More anti-squat** — rear stays higher under throttle. More rear tire loading = better forward traction. But can feel nervous over bumps under power.",
    less: "**Less anti-squat** — rear squats down on the gas. More planted and stable, but can lose punch off corners.",
    settings: ["rear_axle_height","diff_height"],
    how: "On the B7, adjusted through **rear axle height** and **diff height**. Lower axle = less anti-squat."
  },
  "anti-dive": {
    kw: ["anti dive","antidive","anti-dive","dive"],
    title: "Anti-Dive",
    what: "Anti-dive controls how much the front compresses under braking or turn-in. The front-end version of anti-squat.",
    more: "**More anti-dive** — front stays higher under braking. More stable on entry, but less front tire loading = can lose steering.",
    less: "**Less anti-dive** — front dives more. More weight on front tires = more steering. Can feel nose-heavy.",
    settings: ["front_axle_height","caster_insert"],
    how: "Affected by **front axle height** and **caster insert**."
  },
  "kick-up": {
    kw: ["kick up","kickup","kick-up"],
    title: "Kick-Up Angle",
    what: "Kick-up tilts the front hinge pin so the wheels gain camber as they turn — creating mechanical front grip without touching springs or shocks.",
    more: "**More kick-up (+2.5°)** — more camber gain = more mechanical steering. The #1 fix for no steering on low-grip carpet like Beaver. Small trade-off in straight-line stability.",
    less: "**No kick-up (0°)** — neutral geometry. Relies on tire grip and suspension alone for steering. More stable in straights but can push on low grip.",
    settings: ["kick_up"],
    how: "On the B7: **-2.5°, 0° (kit), or +2.5°**. At Beaver, +2.5° is very common."
  },
  "caster": {
    kw: ["caster","castor","trail","caster block","caster insert"],
    title: "Caster (Trail)",
    what: "Caster tilts the steering axis backward, like a shopping cart wheel. Creates 'trail' — the tire follows behind the steering axis, producing self-centering force.",
    more: "**More caster (+5)** — heavier steering, more self-centering, more high-speed stability. Can feel sluggish on low grip.",
    less: "**Less caster (0)** — lighter, quicker steering. The car turns in faster. Great for low-grip tracks where you need every bit of front response.",
    settings: ["caster_insert"],
    how: "Set by **caster block insert**: 0, +2.5 (kit), or +5."
  },
  "kpi": {
    kw: ["kpi","king pin","kingpin","king pin inclination","steering block kpi"],
    title: "KPI (King Pin Inclination)",
    what: "KPI is the inward tilt of the steering axis from the front. Controls scrub radius — distance between where the steering axis hits the ground and the tire contact center.",
    more: "**More KPI (3)** — smaller scrub radius. Lighter, more direct steering. Quicker but can feel twitchy.",
    less: "**Less KPI (1)** — larger scrub radius. Heavier with more feedback. More stable, less responsive.",
    settings: ["kpi"],
    how: "On the B7: **1, 2 (kit), or 3**. A B7-specific tuning feature."
  },
  "roll center": {
    kw: ["roll center","roll centre","rollcenter"],
    title: "Roll Center",
    what: "An imaginary point the chassis rotates around in corners. Its height determines how much the car rolls and how fast weight transfers. Controlled by ball stud positions.",
    more: "**Higher roll center** — less body roll, faster weight transfer, sharper handling. Can get snappy, and at the extreme, causes traction rolling.",
    less: "**Lower roll center** — more body roll, slower weight transfer, more forgiving. Better for inconsistent surfaces.",
    settings: ["bs_front_left_top","bs_front_right_1","bs_rear_top","front_axle_height","rear_axle_height"],
    how: "Controlled by **ball stud spacings** and **axle heights**. Each 1mm spacer change is noticeable."
  },
  "camber": {
    kw: ["camber"],
    title: "Camber",
    what: "The tilt of the tire viewed from the front. Negative camber = top leans inward. Balances corner grip vs straight-line traction.",
    more: "**More negative (-2°)** — more corner grip (more tire contacts ground when car rolls). Less straight-line traction.",
    less: "**Less negative (0°)** — more straight-line grip, better acceleration. Less corner grip.",
    settings: ["front_camber","rear_camber"],
    how: "On the B7, kit is **-1° front and rear**. Adjusted with turnbuckles."
  },
  "toe": {
    kw: ["toe","toe in","toe out","toe-in","toe-out"],
    title: "Toe",
    what: "The angle of the wheels relative to each other from above. Toe-in = fronts point inward. Toe-out = fronts point outward.",
    more: "**Toe-in** — more straight-line stability, less aggressive turn-in. Car wants to go straight.",
    less: "**Toe-out** — more aggressive turn-in, car wants to turn. Less stable in straights. Used on tight layouts.",
    settings: ["front_toe"],
    how: "On the B7, kit is **0° (neutral)**. Rear toe is fixed by hub geometry."
  },
  "ackermann": {
    kw: ["ackermann","ackerman","steering plate"],
    title: "Ackermann",
    what: "How much more the inside wheel turns vs the outside in a corner. Since the inside traces a tighter arc, it theoretically needs more angle.",
    more: "**More Ackermann** — inside wheel turns more. More initial bite, better for tight tracks. Can scrub the inside tire at speed.",
    less: "**Less Ackermann** — wheels turn more equally. Better for high-speed sweepers. Less initial bite but more consistent mid-corner grip.",
    settings: ["steering_plate"],
    how: "On the B7, controlled by **steering plate** position."
  },
  "shock oil": {
    kw: ["shock oil","shock fluid","damping","oil weight","wt oil"],
    title: "Shock Oil / Damping",
    what: "Controls how fast the suspension moves. Heavier oil = slower movement. Like pushing through water vs honey.",
    more: "**Heavier oil (40wt)** — slower suspension, more stability, more planted. Can feel sluggish on low grip.",
    less: "**Lighter oil (25wt)** — faster suspension, more responsive. Can feel bouncy if too light.",
    settings: ["front_shock_oil","rear_shock_oil"],
    how: "On the B7, kit is **35wt front, 30wt rear**. Dropping front to 30wt is the classic low-grip steering fix."
  },
  "springs": {
    kw: ["spring","springs","spring rate","spring color"],
    title: "Springs",
    what: "Springs support the car's weight and control how much the suspension compresses. Stiffer springs = less compression = less body roll.",
    more: "**Stiffer (Red/Blue/Black)** — less body roll, faster weight transfer, quicker direction changes. Harsh on bumps or low grip.",
    less: "**Softer (White/Silver)** — more body roll, more forgiving, absorbs bumps better. Slower transitions.",
    settings: ["front_springs","rear_springs"],
    how: "Soft→stiff: **White → Silver → Orange (kit F) → Yellow → Gray (kit R) → Red → Blue → Black**."
  },
  "anti-roll bar": {
    kw: ["anti roll bar","arb","sway bar","anti-roll","antiroll","roll bar"],
    title: "Anti-Roll Bar (ARB)",
    what: "Connects left and right suspension. When one side compresses in a corner, the bar transfers force to the other side, resisting body roll.",
    more: "**Thicker ARB** — less body roll, faster weight transfer, sharper. Less independent wheel action over bumps.",
    less: "**Thinner/no ARB** — more body roll, more independent wheel action. More grip on rough surfaces but slower transitions.",
    settings: ["front_arb","rear_arb"],
    how: "On the B7, kit is **1.0mm front, 1.2mm rear**. 0.2mm steps are noticeable."
  },
  "differential": {
    kw: ["diff","differential","diff fluid","gear diff","ball diff"],
    title: "Differential",
    what: "Allows left/right wheels to spin at different speeds in corners. Fluid weight controls how 'locked' it feels — how equally power splits between wheels.",
    more: "**Heavier fluid (80-100k)** — more locked. Both wheels get equal power. More traction, but car can push because the rear won't rotate.",
    less: "**Lighter fluid (3-10k)** — more free. Wheels spin independently. More rotation, but can get loose on power.",
    settings: ["diff_type","diff_fluid","diff_height"],
    how: "On the B7, kit is **gear diff at 30k**. 30k→50k is a massive change. One of the highest-impact settings."
  },
  "ride height": {
    kw: ["ride height","ground clearance"],
    title: "Ride Height",
    what: "Distance between the chassis bottom and the ground. Affects center of gravity and clearance over bumps.",
    more: "**Higher (14-15mm)** — higher CG = more body roll and weight transfer. More clearance. Common on low-grip carpet.",
    less: "**Lower (12mm)** — lower CG = less roll, more responsive. Risk bottoming out.",
    settings: ["front_ride_height","rear_ride_height"],
    how: "On the B7, kit is **13mm F&R**. 14mm is common at Beaver due to the old carpet."
  },
  "battery position": {
    kw: ["battery position","battery weight","weight balance","weight distribution","battery forward"],
    title: "Battery Position",
    what: "Battery is the heaviest single component. Its position shifts the front/rear weight balance of the entire car.",
    more: "**Forward (pos 5)** — more front weight = more front traction = more steering. Aggressive for low grip. Less rear traction.",
    less: "**Rearward (pos 1-2)** — more rear weight = more rear traction. Better for high grip. Less steering.",
    settings: ["battery_position"],
    how: "On the B7, kit is **position 3** (centered). 5 = full forward. One of the biggest tuning tools you have."
  },
  "wing": {
    kw: ["wing","wing angle","downforce","rear wing","front wing","aero"],
    title: "Wing / Downforce",
    what: "The wing pushes the car down at speed, creating grip through aerodynamic force. More angle = more downforce = more drag.",
    more: "**More wing (6°)** — more grip at speed, especially fast sweepers. More drag = lower top speed. Handling changes more between slow and fast corners.",
    less: "**Less wing (0°)** — less drag, higher top speed, more consistent handling at all speeds. Less grip in fast corners.",
    settings: ["wing_angle","rear_wing","front_wing"],
    how: "Kit is **6°**. Many Beaver racers run 0° — speeds are lower on the small track."
  },
  "droop": {
    kw: ["droop","down travel","extension","rebound travel"],
    title: "Droop (Down Travel)",
    what: "How far the wheel drops when the car is lifted. Controls weight transfer and how long tires maintain surface contact.",
    more: "**More droop** — tires stay on the ground longer in corners. More grip, but more weight transfer.",
    less: "**Less droop** — inside tires lift sooner. Less weight transfer, more consistent but less peak grip.",
    settings: ["front_stroke","rear_stroke","front_limiter_out","rear_limiter_out"],
    how: "Controlled by **shock stroke** and **external limiters**. Kit: 23.5mm front, 27.5mm rear stroke."
  },
  "pistons": {
    kw: ["piston","pistons","shock piston","holes","hole size"],
    title: "Shock Pistons",
    what: "Discs inside the shock with holes in them. Oil flows through these holes — their size and count determine the damping curve.",
    more: "**Bigger/more holes (2x1.9)** — less resistance, softer feel, faster suspension response.",
    less: "**Smaller/fewer holes (2x1.5)** — more resistance, firmer feel, more controlled. Better for high-grip tracks.",
    settings: ["front_piston","rear_piston","front_piston_thickness","rear_piston_thickness"],
    how: "Kit is **2x1.6 front, 2x1.9 rear**. Piston thickness also matters — thicker = more aggressive damping effect."
  },
  "ball stud": {
    kw: ["ball stud","ballstud","ball stud spacing"],
    title: "Ball Stud Spacing",
    what: "Ball studs are the pivot points for suspension links. Their spacing directly sets the roll center height and camber curve — how camber changes through suspension travel.",
    more: "**Raising outer ball studs** — higher roll center. Less body roll, faster weight transfer. More responsive, can get snappy.",
    less: "**Lowering outer ball studs** — lower roll center. More body roll, more forgiving, more overall grip on rough surfaces.",
    settings: ["bs_front_left_top","bs_front_right_1","bs_rear_top"],
    how: "Adjustable with 1mm spacers. **Even 1mm is noticeable.** This is the fine-tuning that separates fast guys from everyone else."
  },
  "slipper": {
    kw: ["slipper","slipper clutch","eliminator"],
    title: "Slipper Clutch",
    what: "Sits between motor and drivetrain. Slips under high torque to control power delivery and protect the gears from shock loads.",
    more: "**Tighter/eliminated** — more direct power. More aggressive, harder on drivetrain. Can cause wheelspin on low grip.",
    less: "**Looser** — smoother power delivery. More forgiving, helps with traction. Less punch off corners.",
    settings: ["slipper_type"],
    how: "Kit is HD slipper. Some racers run an **Eliminator** (fully locked — no slip at all)."
  },
  "eyelet": {
    kw: ["eyelet","shock eyelet","shock mount position"],
    title: "Shock Eyelet",
    what: "Where the shock bottom connects to the arm. Changes the leverage ratio — how hard the shock works per mm of wheel movement.",
    more: "**Higher number** — more leverage, shock works harder. Feels firmer, more progressive damping.",
    less: "**Lower number** — less leverage, softer feel, more linear damping.",
    settings: ["front_eyelet","rear_eyelet"],
    how: "Kit is **0 front, +2 rear**. Changes effective damping without swapping oil."
  },
  "limiters": {
    kw: ["limiter","limiters","internal limiter","external limiter","droop screw"],
    title: "Limiters",
    what: "Restrict suspension travel. **Internal limiters** limit compression (up). **External limiters** limit droop/extension (down).",
    more: "**More internal** — less compression, car bottoms sooner, higher effective ride height under load.\n\n**More external** — less droop, inside wheels lift sooner, less weight transfer.",
    less: "**No limiters (kit)** — full travel both directions. Maximum grip, maximum weight transfer.",
    settings: ["front_limiter_in","front_limiter_out","rear_limiter_in","rear_limiter_out"],
    how: "Kit is **0 all around**. Add to fine-tune travel in each direction."
  },
  "gearing": {
    kw: ["gear","gearing","pinion","spur","gear ratio","final drive","fdr"],
    title: "Gearing",
    what: "Pinion (motor gear) and spur (diff gear) set the final drive ratio. Balances acceleration vs top speed.",
    more: "**Taller (bigger pinion / smaller spur)** — more top speed, less acceleration, more heat, smoother throttle feel.",
    less: "**Shorter (smaller pinion / bigger spur)** — more acceleration, less top speed, motor runs cooler, more aggressive feel.",
    settings: ["pinion","spur"],
    how: "⚠️ **Never change gearing and a handling setting at the same time.** If gearing makes handling different, roll it back first."
  },
  "tires": {
    kw: ["tire","tires","compound","rubber","tread","fuzzbite","swagger","spitfire","talon","insert"],
    title: "Tires & Compound",
    what: "The most important setup element. Compound = grip level. Tread pattern = how grip is delivered. Insert = tire support and rebound.",
    more: "**Softer compound (Gold/Pink)** — more grip, wears faster, can get greasy on high-traction surfaces.\n\n**Aggressive tread (Fuzzbites)** — pins interlock with carpet fibers. Maximum grip.",
    less: "**Harder compound (Blue)** — less peak grip, more consistent wear. Better for high-traction surfaces.\n\n**Smoother tread (Swaggers)** — less aggressive, more consistent.",
    settings: ["front_tires","front_compound","rear_tires","rear_compound"],
    how: "Depends on surface. Beaver (old Ozite) = softer compounds help. Ed's (CRC carpet) = less aggressive can work."
  },
  "hub spacing": {
    kw: ["hub spacing","hub position","wheelbase"],
    title: "Hub Spacing / Wheelbase",
    what: "Moves the rear axle relative to the arm, changing the effective wheelbase and rear weight distribution.",
    more: "**Back** — longer wheelbase. More straight-line stability, less twitchy, more planted.",
    less: "**Forward** — shorter wheelbase. More agile, quicker rotation, less stable.",
    settings: ["hub_spacing"],
    how: "On the B7: **Fwd, Mid (kit), or Back**."
  },
  "bump steer": {
    kw: ["bump steer","bumpsteer"],
    title: "Bump Steer",
    what: "When the toe angle changes as the suspension moves up and down. Makes the car steer itself over bumps.",
    more: "**More bump steer** — toe changes more through travel. Can help stabilize over bumps or make the car nervous, depending on direction.",
    less: "**Zero bump steer (kit)** — toe stays constant. Most predictable — car only steers when you tell it to.",
    settings: ["bump_steer"],
    how: "Kit is **0**. Add spacers to introduce bump steer on very bumpy tracks."
  },
  "wheel hex": {
    kw: ["wheel hex","hex","track width"],
    title: "Wheel Hex / Track Width",
    what: "Hex width = how far wheels sit from the car. Wider hex = wider track width = different mechanical leverage.",
    more: "**Wider (6.5mm)** — more stability, more grip, more scrub in tight turns.",
    less: "**Narrower (5.0mm)** — quicker direction changes, less scrub. Popular on tight carpet tracks.",
    settings: ["front_wheel_hex","rear_wheel_hex"],
    how: "Kit is **6.5mm front, 5mm rear**. 5mm front is common at Beaver."
  },
  "cup offset": {
    kw: ["cup offset","shock cup","upper mount","shock tower"],
    title: "Shock Cup Offset",
    what: "The position of the shock's upper mount on the tower. Changes the shock angle, affecting how damping loads through travel.",
    more: "**More offset (+9)** — shock angles more. More progressive damping at the top of travel.",
    less: "**Less offset (0)** — shock is more vertical. More consistent damping throughout travel.",
    settings: ["front_cup_offset","rear_cup_offset"],
    how: "Kit is **+5 front, 0 rear**. Fine-tuning adjustment."
  },
  "camber link": {
    kw: ["camber link","camber link spacing","upper arm"],
    title: "Camber Link Spacing",
    what: "The upper arm link that controls how camber changes through suspension travel. Spacing adjusts the effective length and angle.",
    more: "**More spacing** — changes the camber gain curve through travel, affecting how much grip builds as the car rolls.",
    less: "**Less spacing** — opposite effect on the camber gain curve.",
    settings: ["camber_link_spacing"],
    how: "Kit is **2mm**. Measured at the hub end of the rear camber link."
  },
  "arm spacing": {
    kw: ["arm spacing","hinge pin angle","hinge pin"],
    title: "Arm Spacing / Hinge Pin Angle",
    what: "Changes the rear hinge pin angle — the axis the rear arm pivots around. Affects anti-squat geometry and how the rear reacts to acceleration.",
    more: "**Back** — changes the hinge pin angle, creating different anti-squat and squat characteristics under power.",
    less: "**Forward** — opposite geometry effect.",
    settings: ["arm_spacing"],
    how: "Kit is **Mid**. Part of the rear geometry triangle with axle height and diff height."
  },
};

const LABELS = {
  front_springs:"Front Springs",front_shock_oil:"Front Shock Oil",rear_springs:"Rear Springs",
  rear_shock_oil:"Rear Shock Oil",diff_fluid:"Diff Fluid",front_ride_height:"Front Ride Height",
  rear_ride_height:"Rear Ride Height",kick_up:"Kick-Up",battery_position:"Battery Position",
  wing_angle:"Wing Angle",front_arb:"Front ARB",rear_arb:"Rear ARB",front_camber:"Front Camber",
  rear_camber:"Rear Camber",front_toe:"Front Toe",front_piston:"Front Piston",rear_piston:"Rear Piston",
  caster_insert:"Caster Insert",kpi:"KPI",rear_axle_height:"Rear Axle Height",
  front_axle_height:"Front Axle Height",front_eyelet:"Front Eyelet",rear_eyelet:"Rear Eyelet",
  front_cup_offset:"Front Cup Offset",rear_cup_offset:"Rear Cup Offset",front_stroke:"Front Stroke",
  rear_stroke:"Rear Stroke",diff_height:"Diff Height",hub_spacing:"Hub Spacing",arm_spacing:"Arm Spacing",
  front_wheel_hex:"Front Hex",rear_wheel_hex:"Rear Hex",diff_type:"Diff Type",
  front_piston_thickness:"Front Piston Thickness",rear_piston_thickness:"Rear Piston Thickness",
  front_limiter_in:"Front Limiter In",front_limiter_out:"Front Limiter Out",
  rear_limiter_in:"Rear Limiter In",rear_limiter_out:"Rear Limiter Out",bump_steer:"Bump Steer",
  bs_front_left_top:"BS Front Left Top",bs_front_right_1:"BS Front Right Top",
  bs_rear_top:"BS Rear Top",slipper_type:"Slipper",pinion:"Pinion",spur:"Spur",
  front_tires:"Front Tires",front_compound:"Front Compound",rear_tires:"Rear Tires",
  rear_compound:"Rear Compound",camber_link_spacing:"Camber Link Spacing",
  steering_plate:"Steering Plate",bellcrank:"Bellcrank",
};

const KIT = {
  front_springs:"Orange",front_shock_oil:"35wt",rear_springs:"Gray",rear_shock_oil:"30wt",
  diff_fluid:"30k",front_ride_height:"13mm",rear_ride_height:"13mm",kick_up:"0°",
  battery_position:"3",wing_angle:"6°",front_arb:"1.0mm",rear_arb:"1.2mm",
  front_camber:"-1°",rear_camber:"-1°",front_toe:"0°",front_piston:"2x1.6",
  rear_piston:"2x1.9",front_piston_thickness:"2.5mm",rear_piston_thickness:"2.5mm",
  caster_insert:"+2.5",kpi:"2",rear_axle_height:"+2",front_axle_height:"+3",
  front_eyelet:"0",rear_eyelet:"+2",front_cup_offset:"+5",rear_cup_offset:"0",
  front_stroke:"23.5mm",rear_stroke:"27.5mm",front_limiter_in:"0",front_limiter_out:"0",
  rear_limiter_in:"0",rear_limiter_out:"0",steering_plate:"+1",bellcrank:"Up",
  bump_steer:"0",diff_height:"2",bs_front_left_top:"0",bs_front_right_1:"1mm",
  bs_rear_top:"1mm",hub_spacing:"Mid",arm_spacing:"Mid",front_wheel_hex:"6.5mm",
  rear_wheel_hex:"5mm",diff_type:"Gear Diff",slipper_type:"HD",pinion:"",spur:"",
  front_tires:"",front_compound:"",rear_tires:"",rear_compound:"",camber_link_spacing:"2mm",
};

// ── Knowledge lookup ──
function findKB(text) {
  const lo = text.toLowerCase().replace(/[?!.,'"]/g, "");
  const triggers = ["what is","what's","whats","what does","what do","what are","explain","tell me about",
    "how does","how do","help me understand","what about","describe","meaning of","define"];
  if (!triggers.some(t => lo.includes(t))) return null;
  for (const entry of Object.values(KB)) {
    for (const kw of entry.kw) { if (lo.includes(kw)) return entry; }
  }
  return null;
}

function fmtKB(entry, setup) {
  let r = `📘 **${entry.title}**\n\n${entry.what}\n\n${entry.more}\n\n${entry.less}\n\n${entry.how}`;
  if (entry.settings?.length) {
    const vals = entry.settings.filter(k => setup[k] && setup[k] !== "").map(k => `• ${LABELS[k]||k}: **${setup[k]}**`);
    if (vals.length) r += `\n\n🔧 **Your current settings:**\n${vals.join("\n")}`;
  }
  return r;
}

const TOPICS = Object.values(KB).map(e => e.title).sort();
const SYMPTOMS = ["No steering at all","Loose on corner exit","Pushes on entry","Pushes on exit",
  "Loose on corner entry","Snappy / unpredictable","Lazy / slow to respond","Traction rolling","Feels good but slow"];

function Dots() {
  return (
    <div style={{ display:"flex",gap:4,padding:"8px 0",alignItems:"center" }}>
      {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.textMuted,animation:`tp 1.2s ease-in-out ${i*.15}s infinite`}}/>)}
      <style>{`@keyframes tp{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}`}</style>
    </div>
  );
}

// ── SetupViewer ──
const SECTIONS = {
  "Front Susp":["front_springs","front_shock_oil","front_ride_height","kick_up","front_arb","front_camber","front_toe","caster_insert","kpi","front_piston","front_stroke","front_eyelet","front_cup_offset","front_axle_height","front_wheel_hex"],
  "Rear Susp":["rear_springs","rear_shock_oil","rear_ride_height","rear_arb","rear_camber","rear_piston","rear_stroke","rear_eyelet","rear_cup_offset","rear_axle_height","rear_wheel_hex","hub_spacing","arm_spacing"],
  "Drivetrain":["diff_type","diff_fluid","diff_height","battery_position","slipper_type","pinion","spur"],
  "Body":["wing_angle"],
};

function SetupViewer({ setup, diffs }) {
  const [tab, setTab] = useState("Front Susp");
  return (
    <div style={{background:C.setupBg,border:`1px solid ${C.setupBorder}`,borderRadius:12,overflow:"hidden",margin:"4px 0"}}>
      <div style={{display:"flex",borderBottom:`1px solid ${C.setupBorder}`}}>
        {Object.keys(SECTIONS).map(s=>(
          <div key={s} onClick={()=>setTab(s)} style={{flex:1,padding:"8px 4px",fontSize:10,textAlign:"center",
            color:tab===s?C.accent:C.textMuted,borderBottom:`2px solid ${tab===s?C.accent:"transparent"}`,cursor:"pointer"}}>{s}</div>
        ))}
      </div>
      <div style={{maxHeight:220,overflowY:"auto"}}>
        {(SECTIONS[tab]||[]).map(key=>{
          const diff=diffs.find(d=>d.key===key);const val=setup[key];if(!val||val==="")return null;
          return(
            <div key={key} style={{display:"flex",justifyContent:"space-between",padding:"5px 12px",
              borderBottom:`1px solid ${C.setupBorder}`,borderLeft:diff?`3px solid ${C.delta}`:"3px solid transparent",
              background:diff?`${C.delta}08`:"transparent"}}>
              <span style={{fontSize:11,color:C.textDim}}>{LABELS[key]||key}</span>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                {diff&&<span style={{fontSize:10,color:C.textMuted,textDecoration:"line-through"}}>{diff.from}</span>}
                <span style={{fontSize:12,fontWeight:diff?600:400,color:diff?C.delta:C.white}}>{val}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main ──
export default function RaceModeKB() {
  const [msgs,setMsgs]=useState([]);
  const [phase,setPhase]=useState("init");
  const [input,setInput]=useState("");
  const [typing,setTyping]=useState(false);
  const [qr,setQr]=useState([]);
  const [setup,setSetup]=useState({...KIT});
  const [diffs,setDiffs]=useState([]);
  const [cond,setCond]=useState({});
  const [prevPhase,setPrevPhase]=useState(null);
  const endRef=useRef(null);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[msgs,typing]);
  useEffect(()=>{
    setTimeout(()=>bot(
      "Hey! 🏁 I'm your Race Mode Coach.\n\nI can **build your setup**, **coach you at the track**, and **teach you about any RC concept**.\n\n💡 Ask me **\"What is anti-squat?\"** or **\"What does caster do?\"** anytime — even mid-coaching — and I'll explain it with how it applies to your car.\n\nWhat do you want to do?",
      ["Build my B7 setup","Explore concepts","Let's go racing"]
    ),500);
  },[]);

  const bot=(text,replies=[],extra=null)=>{
    setTyping(true);setQr([]);
    const d=Math.min(400+text.length*2.5,1400);
    setTimeout(()=>{setTyping(false);setMsgs(p=>[...p,{role:"bot",text,extra}]);if(replies.length)setQr(replies);},d);
  };
  const user=(text)=>{setMsgs(p=>[...p,{role:"user",text}]);setQr([]);};
  const setVal=(k,v)=>{
    if(v===KIT[k])return;
    setSetup(p=>({...p,[k]:v}));
    setDiffs(p=>[...p.filter(d=>d.key!==k),{key:k,from:KIT[k],to:v}]);
  };

  const handle=(reply)=>{
    user(reply);
    const lo=reply.toLowerCase();

    // ── GLOBAL: Knowledge check (ANY phase) ──
    const kb=findKB(reply);
    if(kb){
      if(phase!=="init"&&phase!=="explore") setPrevPhase(phase);
      setTimeout(()=>{
        const resumeQr = prevPhase==="racing"||phase==="racing"
          ? ["Back to coaching","Ask another question"]
          : phase==="building"||prevPhase==="building"
          ? ["Continue building","Ask another question"]
          : ["Ask another question","What topics can you explain?","Build my B7 setup","Let's go racing"];
        bot(fmtKB(kb,setup),resumeQr);
      },300);
      return;
    }

    // ── GLOBAL: Show setup ──
    if((lo.includes("show")&&lo.includes("setup"))||lo==="show my setup"){
      setTimeout(()=>{
        setMsgs(p=>[...p,{role:"bot",text:diffs.length?`${diffs.length} change${diffs.length!==1?"s":""} from kit:`:"Kit baseline:",extra:"setup"}]);
        setQr(phase==="racing"?SYMPTOMS.slice(0,4):["Build my B7 setup","Let's go racing"]);
      },400); return;
    }

    // ── GLOBAL: Topic browser ──
    if(lo.includes("topic")||lo.includes("what can you explain")||lo==="ask another question"||lo.includes("explore concept")){
      setTimeout(()=>bot(
        `I can explain **${TOPICS.length} concepts**:\n\n${TOPICS.map(t=>`• ${t}`).join("\n")}\n\nJust ask **"What is [concept]?"**`,
        ["What is anti-squat?","What does kick-up do?","Explain differential","What is roll center?"]
      ),300); return;
    }

    // ── Resume after knowledge ──
    if(lo==="back to coaching"){ setPhase("racing"); setTimeout(()=>bot("Back to it. What's the car doing?",SYMPTOMS),300); return; }
    if(lo==="continue building"){ setPhase("building"); setTimeout(()=>bot("Where were we — what else is different from kit?"),300); return; }

    // ── INIT ──
    if(phase==="init"){
      if(lo.includes("build")){
        setPhase("building");
        setTimeout(()=>bot("Let's build your B7. Starting from kit baseline.\n\nTell me what's different — rattle off changes however you want. Like *\"red front springs, 50k diff, kick-up at +2.5\"*\n\nOr say **\"walk me through it\"** and I'll ask one at a time.\n\n💡 Not sure what a setting does? Just ask — *\"What is kick-up?\"*",
          ["Walk me through it","I'll list my changes","What is kick-up?","What is anti-squat?"]),300);
      } else if(lo.includes("explore")){
        setPhase("explore");
        setTimeout(()=>bot(`Pick a topic or just ask:\n\n${TOPICS.slice(0,10).map(t=>`• ${t}`).join("\n")}\n\n...and ${TOPICS.length-10} more.`,
          ["What is anti-squat?","Explain roll center","What does caster do?","What are ball studs?"]),300);
      } else if(lo.includes("racing")){
        setPhase("track_pick");
        setTimeout(()=>bot("Where are you racing?",["Beaver RC","Ed's Hobby Shop","Somewhere else"]),300);
      }
    }

    // ── BUILDING ──
    else if(phase==="building"){
      if(lo==="walk me through it"){
        setTimeout(()=>bot("**Front springs?** Kit is Orange.\n\n💡 *Not sure what springs do? Ask \"What are springs?\"*",
          ["White","Silver","Orange (Kit)","Red","Blue","Not sure","What are springs?"]),300);
        setPhase("b_fsprings");
      } else {
        // Parse freetext
        const ch=[];
        if(lo.includes("red")&&(lo.includes("front")||lo.includes("spring"))){setVal("front_springs","Red");ch.push("Front springs → Red");}
        if(lo.includes("yellow")&&lo.includes("rear")){setVal("rear_springs","Yellow");ch.push("Rear springs → Yellow");}
        const dm=lo.match(/(\d+)\s*k\s*(diff|fluid)/);if(dm){setVal("diff_fluid",dm[1]+"k");ch.push(`Diff → ${dm[1]}k`);}
        if(lo.includes("battery")&&lo.includes("forward")){setVal("battery_position","5");ch.push("Battery → 5 (forward)");}
        if(lo.includes("kick")&&lo.includes("2.5")){setVal("kick_up","+2.5°");ch.push("Kick-up → +2.5°");}
        if(lo.includes("14")&&lo.includes("ride")){setVal("front_ride_height","14mm");setVal("rear_ride_height","14mm");ch.push("Ride height → 14mm F&R");}
        if(lo.includes("carbon")&&lo.includes("arm")){setVal("front_arm_type","Carbon");setVal("rear_arm_type","Carbon");ch.push("Arms → Carbon F&R");}
        if(lo.includes("30")&&lo.includes("front")&&lo.includes("oil")){setVal("front_shock_oil","30wt");ch.push("Front oil → 30wt");}
        if(ch.length>0){
          setTimeout(()=>bot(`Got it:\n${ch.map(c=>`• **${c}**`).join("\n")}\n\nAnything else?`,["That's everything","More changes","Show my setup"]),300);
        } else if(lo==="that's everything"||lo==="thats everything"){
          setTimeout(()=>{bot(`Setup loaded — ${diffs.length} change${diffs.length!==1?"s":""} from kit. Ready to race?`,["Let's go racing","Show my setup"]);setPhase("ready");},300);
        } else {
          setTimeout(()=>bot("Tell me specific settings — like \"front springs are Red\" or \"diff is 50k\". Or ask \"What is [concept]?\" if you're not sure what something does.",[]),300);
        }
      }
    }

    // ── Guided build steps ──
    else if(phase==="b_fsprings"){
      const v=reply.replace(/\s*\(Kit\)/i,"");
      if(v!=="Not sure"&&v!==KIT.front_springs)setVal("front_springs",v);
      const teach=v==="Not sure"?"Kit (Orange) for now.":v===KIT.front_springs||v.includes("Kit")?"Kit spec.":
        `${["White","Silver"].includes(v)?"Softer than kit — more progressive steering feel.":"Stiffer than kit — quicker response, faster weight transfer."}`;
      setTimeout(()=>bot(`${teach}\n\n**Rear springs?** Kit is Gray.`,
        ["White","Silver","Yellow","Gray (Kit)","Red","Not sure","What are springs?"]),300);
      setPhase("b_rsprings");
    }
    else if(phase==="b_rsprings"){
      const v=reply.replace(/\s*\(Kit\)/i,"");
      if(v!=="Not sure"&&v!==KIT.rear_springs)setVal("rear_springs",v);
      setTimeout(()=>bot(`Got it.\n\n**Front shock oil?** Kit is 35wt.\n\n💡 *\"What is shock oil?\"*`,
        ["25wt","27.5wt","30wt","35wt (Kit)","40wt","Not sure","What is shock oil?"]),300);
      setPhase("b_foil");
    }
    else if(phase==="b_foil"){
      const v=reply.replace(/\s*\(Kit\)/i,"");
      if(v!=="Not sure"&&v!=="35wt")setVal("front_shock_oil",v);
      const teach=v==="Not sure"?"Kit (35wt).":v==="35wt"||v.includes("Kit")?"Kit spec.":
        parseFloat(v)<35?"Lighter than kit — front loads faster, more steering.":"Heavier than kit — more stable, less twitchy.";
      setTimeout(()=>bot(`${teach}\n\n**Rear shock oil?** Kit is 30wt.`,
        ["25wt","27.5wt","30wt (Kit)","32.5wt","35wt","Not sure","What is shock oil?"]),300);
      setPhase("b_roil");
    }
    else if(phase==="b_roil"){
      const v=reply.replace(/\s*\(Kit\)/i,"");
      if(v!=="Not sure"&&v!=="30wt")setVal("rear_shock_oil",v);
      setTimeout(()=>bot(`Got it.\n\n**Diff fluid?** Kit is 30k. This is a big one.\n\n💡 *\"What is a differential?\"*`,
        ["3k","5k","10k","20k","30k (Kit)","50k","80k","100k","Not sure","What is a differential?"]),300);
      setPhase("b_diff");
    }
    else if(phase==="b_diff"){
      const v=reply.replace(/\s*\(Kit\)/i,"");
      if(v!=="Not sure"&&v!=="30k")setVal("diff_fluid",v);
      const teach=v==="Not sure"?"Big one to check before race night. Kit (30k) for now.":v==="30k"||v.includes("Kit")?"Kit spec.":
        parseInt(v)>30?"Heavier — more locked feel, more traction, less corner rotation.":"Lighter — freer, more rotation, can get loose on power.";
      setTimeout(()=>bot(`${teach}\n\n**Kick-up angle?** Kit is 0°. This is the #1 low-grip steering fix.\n\n💡 *\"What is kick-up?\"*`,
        ["-2.5°","0° (Kit)","+2.5°","Not sure","What is kick-up?"]),300);
      setPhase("b_kickup");
    }
    else if(phase==="b_kickup"){
      const v=reply.replace(/\s*\(Kit\)/i,"");
      if(v!=="Not sure"&&v!=="0°")setVal("kick_up",v);
      const teach=v==="+2.5°"?"More mechanical steering — great for low grip.":v==="-2.5°"?"Unusual choice — reduces steering.":"Kit spec.";
      setTimeout(()=>bot(`${teach}\n\n**Battery position?** (1=back, 5=forward) Kit is 3.\n\n💡 *\"What does battery position do?\"*`,
        ["1","2","3 (Kit)","4","5","Not sure","What does battery position do?"]),300);
      setPhase("b_batt");
    }
    else if(phase==="b_batt"){
      const v=reply.replace(/\s*\(Kit\)/i,"");
      if(v!=="Not sure"&&v!=="3")setVal("battery_position",v);
      setTimeout(()=>bot(`Got it.\n\nThat's the Tier 1 big stuff — ${diffs.length} change${diffs.length!==1?"s":""} from kit so far.\n\nWant to keep going into **suspension details** (ARBs, camber, pistons, caster, axle heights)? The more I know, the smarter my coaching gets. Every 1mm matters.\n\nOr we can race with what we have and fill in details later.`,
        ["Keep going — every detail matters","This is enough, let's race","Show my setup"]),300);
      setPhase("tier_gate");
    }

    // ── TIER GATE ──
    else if(phase==="tier_gate"){
      if(lo.includes("keep going")||lo.includes("every detail")){
        setTimeout(()=>bot("**Front anti-roll bar?** Kit is 1.0mm.\n\n💡 *\"What is an anti-roll bar?\"*",
          ["None","0.8mm","1.0mm (Kit)","1.2mm","1.4mm","Not sure","What is an anti-roll bar?"]),300);
        setPhase("b_farb");
      } else {
        setTimeout(()=>{bot(`Loaded with ${diffs.length} change${diffs.length!==1?"s":""} from kit. Unfilled settings are at kit spec.\n\nReady to race?`,["Let's go racing","Show my setup"]);setPhase("ready");},300);
      }
    }

    // ── Tier 2 continuation ──
    else if(phase==="b_farb"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!==KIT.front_arb)setVal("front_arb",v);
      setTimeout(()=>bot("**Rear anti-roll bar?** Kit is 1.2mm.",["None","1.0mm","1.2mm (Kit)","1.3mm","1.4mm","Not sure"]),300);
      setPhase("b_rarb");
    }
    else if(phase==="b_rarb"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!==KIT.rear_arb)setVal("rear_arb",v);
      setTimeout(()=>bot("**Caster block insert?** Controls trail and steering weight.\n\n💡 *\"What is caster?\"*",["0","+2.5 (Kit)","+5","Not sure","What is caster?"]),300);
      setPhase("b_caster");
    }
    else if(phase==="b_caster"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!==KIT.caster_insert)setVal("caster_insert",v);
      setTimeout(()=>bot("**Steering block KPI?**\n\n💡 *\"What is KPI?\"*",["1","2 (Kit)","3","Not sure","What is KPI?"]),300);
      setPhase("b_kpi");
    }
    else if(phase==="b_kpi"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!==KIT.kpi)setVal("kpi",v);
      setTimeout(()=>bot("**Front axle height?**\n\n💡 *\"What is anti-dive?\"*",["+0","+1","+2","+3 (Kit)","Not sure","What is anti-dive?"]),300);
      setPhase("b_faxle");
    }
    else if(phase==="b_faxle"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!==KIT.front_axle_height)setVal("front_axle_height",v);
      setTimeout(()=>bot("**Rear axle height?** This is big for anti-squat.\n\n💡 *\"What is anti-squat?\"*",["+0","+1","+2 (Kit)","+3","Not sure","What is anti-squat?"]),300);
      setPhase("b_raxle");
    }
    else if(phase==="b_raxle"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!==KIT.rear_axle_height)setVal("rear_axle_height",v);
      setTimeout(()=>bot(`Nice — Tier 2 done. ${diffs.length} change${diffs.length!==1?"s":""} from kit.\n\nWant to go into **fine tuning** (eyelets, cup offsets, stroke, limiters, ball studs)? This is the detail that makes 1/10 scale special.\n\nOr race with what we have.`,
        ["Keep going deeper","This is enough, let's race","Show my setup"]),300);
      setPhase("tier_gate_2");
    }
    else if(phase==="tier_gate_2"){
      if(lo.includes("keep")||lo.includes("deeper")){
        setTimeout(()=>bot("**Front piston?**\n\n💡 *\"What are pistons?\"*",["2x1.5","2x1.6 (Kit)","2x1.7","1.6","1.7","1.8","Not sure","What are pistons?"]),300);
        setPhase("b_fpiston");
      } else {
        setTimeout(()=>{bot(`Loaded — ${diffs.length} changes. Let's race.`,["Let's go racing","Show my setup"]);setPhase("ready");},300);
      }
    }
    else if(phase==="b_fpiston"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!==KIT.front_piston)setVal("front_piston",v);
      setTimeout(()=>bot("**Rear piston?**",["2x1.7","2x1.8","2x1.9 (Kit)","2x2.0","1.8","1.9","Not sure"]),300);
      setPhase("b_rpiston");
    }
    else if(phase==="b_rpiston"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!==KIT.rear_piston)setVal("rear_piston",v);
      setTimeout(()=>bot("**Front eyelet?**\n\n💡 *\"What is an eyelet?\"*",["-2","-1","0 (Kit)","+1","+2","Not sure","What is an eyelet?"]),300);
      setPhase("b_feyelet");
    }
    else if(phase==="b_feyelet"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!==KIT.front_eyelet)setVal("front_eyelet",v);
      setTimeout(()=>bot("**Rear eyelet?**",["-2","-1","0","+1","+2 (Kit)","Not sure"]),300);
      setPhase("b_reyelet");
    }
    else if(phase==="b_reyelet"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!==KIT.rear_eyelet)setVal("rear_eyelet",v);
      setTimeout(()=>bot("**Front cup offset?**\n\n💡 *\"What is cup offset?\"*",["0","+5 (Kit)","+9","Not sure","What is cup offset?"]),300);
      setPhase("b_fcup");
    }
    else if(phase==="b_fcup"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!==KIT.front_cup_offset)setVal("front_cup_offset",v);
      setTimeout(()=>bot("**Rear cup offset?**",["0 (Kit)","+5","+9","Not sure"]),300);
      setPhase("b_rcup");
    }
    else if(phase==="b_rcup"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!==KIT.rear_cup_offset)setVal("rear_cup_offset",v);
      setTimeout(()=>bot(`Tier 3 done! ${diffs.length} change${diffs.length!==1?"s":""} from kit.\n\nWant to go into **ball stud spacings**? This is the geometry layer — where 1mm changes everything.\n\n💡 *\"What are ball studs?\"*`,
        ["Yes — every mm matters","That's enough, let's race","What are ball studs?","Show my setup"]),300);
      setPhase("tier_gate_3");
    }
    else if(phase==="tier_gate_3"){
      if(lo.includes("yes")||lo.includes("every")){
        setTimeout(()=>bot("**Front left ball stud — top (arm side)?**\n\n💡 *\"What is roll center?\"*",["0 (Kit)","1mm","2mm","Not sure","What is roll center?"]),300);
        setPhase("b_bsflt");
      } else {
        setTimeout(()=>{bot(`Setup complete with ${diffs.length} changes. Let's go.`,["Let's go racing","Show my setup"]);setPhase("ready");},300);
      }
    }
    else if(phase==="b_bsflt"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!=="0")setVal("bs_front_left_top",v);
      setTimeout(()=>bot("**Front right ball stud — top (tower side)?**",["0","1mm (Kit)","2mm","Not sure"]),300);
      setPhase("b_bsfr1");
    }
    else if(phase==="b_bsfr1"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!=="1mm")setVal("bs_front_right_1",v);
      setTimeout(()=>bot("**Rear ball stud — top?**",["0","1mm (Kit)","2mm","Not sure"]),300);
      setPhase("b_bsrt");
    }
    else if(phase==="b_bsrt"){
      const v=reply.replace(/\s*\(Kit\)/i,"");if(v!=="Not sure"&&v!=="1mm")setVal("bs_rear_top",v);
      setTimeout(()=>{bot(`Geometry done. ${diffs.length} total changes from kit.\n\nYou've built a seriously detailed setup. Ready to race?`,["Let's go racing","Show my setup"]);setPhase("ready");},300);
    }

    // ── READY → Track ──
    else if(phase==="ready"){
      if(lo.includes("racing")||lo.includes("race")){
        setPhase("track_pick");
        setTimeout(()=>bot("Where are you racing tonight?",["Beaver RC","Ed's Hobby Shop","Somewhere else"]),300);
      }
    }

    // ── Track flow ──
    else if(phase==="track_pick"){
      setCond(p=>({...p,track:lo.includes("beaver")?"beaver":lo.includes("ed")?"eds":"other"}));
      setPhase("pick_grip");
      setTimeout(()=>bot("Grip level after your first run?",["Very low","Low","Low-medium","Medium","Medium-high"]),300);
    }
    else if(phase==="pick_grip"){
      setCond(p=>({...p,grip:reply}));setPhase("racing");
      setTimeout(()=>bot(`${reply} grip. Your B7 is loaded${diffs.length?` with ${diffs.length} changes from kit`:""} — I know your full setup.\n\nAfter each run, tell me what the car is doing.\n\n💡 **You can ask \"What is [concept]?\" anytime** — even between runs. I'll explain it and come right back to coaching.\n\n**What's the car doing?**`,SYMPTOMS),300);
    }

    // ── RACING ──
    else if(phase==="racing"){
      if(SYMPTOMS.includes(reply)){
        const val=k=>setup[k]||KIT[k];
        const recs={
          "No steering at all":`No steering${cond.track==="beaver"?" — classic Beaver problem":""}.\n\nYour kick-up is **${val("kick_up")}**, caster **${val("caster_insert")}**, front oil **${val("front_shock_oil")}**, battery **pos ${val("battery_position")}**.\n\n${val("kick_up")==="0°"?`**Add +2.5° kick-up.** Creates mechanical front grip.\n\n💡 *Not sure what kick-up does? Ask \"What is kick-up?\"*`:`Kick-up at ${val("kick_up")} already. **Drop front oil to ${parseFloat(val("front_shock_oil"))>30?"30wt":"27.5wt"}** for faster front loading.\n\n💡 *\"What does shock oil do?\"*`}`,
          "Loose on corner exit":`Loose on power. Diff is **${val("diff_fluid")}**, rear springs **${val("rear_springs")}**, rear oil **${val("rear_shock_oil")}**.\n\n**Step diff to ${parseInt(val("diff_fluid"))<50?"50k":"80k"}.** More locked = more traction.\n\n💡 *\"What does differential fluid do?\"*`,
          "Pushes on entry":`Push on entry. Front oil **${val("front_shock_oil")}**, springs **${val("front_springs")}**, ARB **${val("front_arb")}**.\n\n**Drop front oil to ${parseFloat(val("front_shock_oil"))>30?"30wt":"27.5wt"}.** Faster compression = more entry bite.\n\n💡 *\"What is shock oil?\"*`,
          "Pushes on exit":`Push on exit. Diff **${val("diff_fluid")}**.\n\n${parseInt(val("diff_fluid"))>40?`Diff at ${val("diff_fluid")} is fairly locked. **Drop to ${parseInt(val("diff_fluid"))>60?"50k":"30k"}** for more rotation.`:"**Softer rear spring** — more squat frees the front."}\n\n💡 *\"What is a differential?\"*`,
          "Loose on corner entry":`Rear loose on entry. Rear ARB **${val("rear_arb")}**, rear axle **${val("rear_axle_height")}**.\n\n**Stiffer rear ARB (+0.2mm).** Less rear roll on entry.\n\n💡 *\"What is an anti-roll bar?\"*`,
          "Snappy / unpredictable":`Snappy car. Springs **${val("front_springs")}F/${val("rear_springs")}R**, oil **${val("front_shock_oil")}F/${val("rear_shock_oil")}R**.\n\n**Softer front spring (one step).** Slows weight transfer, more forgiving.\n\n💡 *\"What does roll center do?\"*`,
          "Lazy / slow to respond":`Lazy. Front ARB **${val("front_arb")}**, springs **${val("front_springs")}**.\n\n**Stiffer front ARB (+0.2mm).** Faster weight transfer.\n\n💡 *\"What is an anti-roll bar?\"*`,
          "Traction rolling":`Traction roll! Ride height **${val("front_ride_height")}F/${val("rear_ride_height")}R**.\n\n**Raise ride height 1mm both ends.**\n\n💡 *\"What is roll center?\"*`,
          "Feels good but slow":`⚠️ **Don't touch the setup.** If it drives well, protect that.\n\nGearing: pinion **${val("pinion")||"unknown"}**, spur **${val("spur")||"unknown"}**. Try +1 pinion.\n\n💡 *\"What does gearing do?\"*`,
        };
        setTimeout(()=>bot(recs[reply]||"Tell me more.",["I'll try that","Already tried that","What else?","Show my setup"]),300);
      } else if(reply==="I'll try that"){
        setTimeout(()=>bot("Run it. 👊",["Better","A little better","Same","Worse"]),300);
      } else if(["Better","A little better","Same","Worse"].includes(reply)){
        if(reply.includes("etter")) setTimeout(()=>bot("Nice! Keep dialing or ride it?",["Keep dialing","I'm good","Show my setup",...SYMPTOMS.slice(0,3)]),300);
        else if(reply==="Worse") setTimeout(()=>bot("Roll it back. What's the car doing now?",SYMPTOMS),300);
        else setTimeout(()=>bot("Didn't move it. Different approach.",SYMPTOMS),300);
      } else if(reply==="Keep dialing") setTimeout(()=>bot("What's the car doing?",SYMPTOMS),300);
      else if(reply==="I'm good") setTimeout(()=>bot(`🏁 Go get 'em! ${diffs.length} changes from kit tonight.\n\n💡 All this data gets smarter over time. See you next race night.`,[]),300);
      else setTimeout(()=>bot("What's the car doing out there?",SYMPTOMS),300);
    }
  };

  const handleSend=()=>{if(!input.trim())return;const t=input.trim();setInput("");handle(t);};

  return(
    <div style={{background:C.bg,height:"100vh",display:"flex",flexDirection:"column",fontFamily:"-apple-system,'SF Pro Text','Segoe UI',sans-serif",color:C.text,maxWidth:500,margin:"0 auto"}}>
      {/* Header */}
      <div style={{padding:"12px 20px",background:C.chatBg,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.accent},#1d4ed8)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>🏁</div>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:600,color:C.white}}>Race Mode Coach</div>
          <div style={{fontSize:11,color:C.textDim}}>B7 · Ask me anything</div>
        </div>
        {diffs.length>0&&<div style={{background:`${C.delta}15`,border:`1px solid ${C.delta}35`,borderRadius:20,padding:"3px 10px",fontSize:11,color:C.delta,fontWeight:600}}>{diffs.length}Δ</div>}
        {phase==="racing"&&<div style={{background:C.greenSoft,border:`1px solid ${C.green}30`,borderRadius:20,padding:"3px 10px",fontSize:11,color:C.green}}>● Live</div>}
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 8px",display:"flex",flexDirection:"column",gap:3}}>
        {msgs.map((m,i)=>(
          <div key={i}>
            <div style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:3}}>
              <div style={{
                maxWidth:"88%",padding:"9px 13px",
                borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",
                background:m.role==="user"?C.userBubble: m.text.startsWith("📘")?C.knowBg:C.botBubble,
                border:`1px solid ${m.role==="user"?"transparent":m.text.startsWith("📘")?C.knowBorder:C.botBorder}`,
                fontSize:14,lineHeight:1.5,color:C.text,whiteSpace:"pre-wrap",wordBreak:"break-word",
              }}>
                {m.text.split(/(\*\*.*?\*\*)/).map((p,j)=>
                  p.startsWith("**")&&p.endsWith("**")?<strong key={j} style={{color:C.white,fontWeight:600}}>{p.slice(2,-2)}</strong>:<span key={j}>{p}</span>
                )}
              </div>
            </div>
            {m.role==="bot"&&m.extra==="setup"&&<SetupViewer setup={setup} diffs={diffs}/>}
          </div>
        ))}
        {typing&&(
          <div style={{display:"flex",justifyContent:"flex-start",marginBottom:3}}>
            <div style={{padding:"10px 16px",borderRadius:"14px 14px 14px 4px",background:C.botBubble,border:`1px solid ${C.botBorder}`}}><Dots/></div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Quick replies */}
      {qr.length>0&&(
        <div style={{padding:"6px 14px",display:"flex",gap:5,flexWrap:"wrap",flexShrink:0,maxHeight:180,overflowY:"auto"}}>
          {qr.map(r=>{
            const isKB=r.startsWith("What")||r.startsWith("Explain");
            const isRes=["Better","A little better","Same","Worse"].includes(r);
            const rc=isRes?(r.includes("etter")?C.green:r==="Worse"?C.red:C.yellow):isKB?C.know:null;
            return(
              <button key={r} onClick={()=>handle(r)} style={{
                padding:"7px 13px",background:rc?rc+"12":C.qr,
                border:`1px solid ${rc?rc+"40":C.qrBorder}`,borderRadius:18,
                color:rc||C.accent,fontSize:13,cursor:"pointer",fontFamily:"inherit",
                whiteSpace:"nowrap",transition:"all 0.15s",
                fontStyle:isKB?"italic":"normal",
              }}
              onMouseEnter={e=>{e.currentTarget.style.background=rc?rc+"25":C.qrActive;}}
              onMouseLeave={e=>{e.currentTarget.style.background=rc?rc+"12":C.qr;}}
              >{r}</button>
            );
          })}
        </div>
      )}

      {/* Input */}
      <div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`,background:C.chatBg,flexShrink:0}}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter")handleSend();}}
            placeholder='Ask "What is anti-squat?" or tell me what the car is doing...'
            style={{flex:1,padding:"11px 16px",background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:24,color:C.text,fontSize:14,fontFamily:"inherit",outline:"none"}}
            onFocus={e=>{e.target.style.borderColor=C.accent;}}
            onBlur={e=>{e.target.style.borderColor=C.inputBorder;}}
          />
          <button onClick={handleSend} disabled={!input.trim()} style={{
            width:40,height:40,borderRadius:"50%",background:input.trim()?C.accent:C.inputBg,
            border:`1px solid ${input.trim()?C.accent:C.inputBorder}`,color:C.white,fontSize:17,
            cursor:input.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
          }}>↑</button>
        </div>
      </div>
    </div>
  );
}
