// RC Setup Knowledge Base — 25+ concepts explained in plain language

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
    less: "**No kick-up (0°)** — neutral geometry. Relies on tire grip and suspension alone for steering. More stable in straights.",
    settings: ["kick_up"],
    how: "On the B7: **-2.5°, 0° (kit), or +2.5°**. At Beaver, +2.5° is very common."
  },
  "caster": {
    kw: ["caster","castor","trail","caster block","caster insert"],
    title: "Caster (Trail)",
    what: "Caster tilts the steering axis backward, like a shopping cart wheel. Creates 'trail' — the tire follows behind the steering axis, producing self-centering force.",
    more: "**More caster (+5)** — heavier steering, more self-centering, more high-speed stability. Can feel sluggish on low grip.",
    less: "**Less caster (0)** — lighter, quicker steering. The car turns in faster. Great for low-grip tracks.",
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
    how: "On the B7: **1, 2 (kit), or 3**."
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
    more: "**More negative (-2°)** — more corner grip. Less straight-line traction.",
    less: "**Less negative (0°)** — more straight-line grip. Less corner grip.",
    settings: ["front_camber","rear_camber"],
    how: "On the B7, kit is **-1° front and rear**."
  },
  "toe": {
    kw: ["toe","toe in","toe out","toe-in","toe-out"],
    title: "Toe",
    what: "The angle of the wheels relative to each other from above. Toe-in = fronts point inward. Toe-out = fronts point outward.",
    more: "**Toe-in** — more straight-line stability, less aggressive turn-in.",
    less: "**Toe-out** — more aggressive turn-in, less stable in straights.",
    settings: ["front_toe"],
    how: "On the B7, kit is **0° (neutral)**."
  },
  "ackermann": {
    kw: ["ackermann","ackerman","steering plate"],
    title: "Ackermann",
    what: "How much more the inside wheel turns vs the outside in a corner.",
    more: "**More Ackermann** — more initial bite, better for tight tracks. Can scrub at speed.",
    less: "**Less Ackermann** — more consistent mid-corner grip. Better for fast sweepers.",
    settings: ["steering_plate"],
    how: "Controlled by **steering plate** position."
  },
  "shock oil": {
    kw: ["shock oil","shock fluid","damping","oil weight","wt oil"],
    title: "Shock Oil / Damping",
    what: "Controls how fast the suspension moves. Heavier oil = slower movement. Like pushing through water vs honey.",
    more: "**Heavier oil (40wt)** — slower suspension, more stability. Can feel sluggish on low grip.",
    less: "**Lighter oil (25wt)** — faster suspension, more responsive. Can feel bouncy if too light.",
    settings: ["front_shock_oil","rear_shock_oil"],
    how: "Kit is **35wt front, 30wt rear**. Dropping front to 30wt is the classic low-grip steering fix."
  },
  "springs": {
    kw: ["spring","springs","spring rate","spring color"],
    title: "Springs",
    what: "Springs support the car's weight and control compression. Stiffer = less body roll.",
    more: "**Stiffer (Red/Blue/Black)** — less body roll, faster weight transfer. Harsh on bumps.",
    less: "**Softer (White/Silver)** — more body roll, more forgiving. Slower transitions.",
    settings: ["front_springs","rear_springs"],
    how: "Soft→stiff: **White → Silver → Orange (kit F) → Yellow → Gray (kit R) → Red → Blue → Black**."
  },
  "anti-roll bar": {
    kw: ["anti roll bar","arb","sway bar","anti-roll","antiroll","roll bar"],
    title: "Anti-Roll Bar (ARB)",
    what: "Connects left and right suspension. Resists body roll in corners.",
    more: "**Thicker ARB** — less body roll, faster weight transfer, sharper. Less independent wheel action.",
    less: "**Thinner/no ARB** — more body roll, more independent wheel action. More grip but slower transitions.",
    settings: ["front_arb","rear_arb"],
    how: "Kit is **1.0mm front, 1.2mm rear**. 0.2mm steps are noticeable."
  },
  "differential": {
    kw: ["diff","differential","diff fluid","gear diff","ball diff"],
    title: "Differential",
    what: "Allows left/right wheels to spin at different speeds. Fluid weight controls how 'locked' it feels.",
    more: "**Heavier fluid (80-100k)** — more locked. More traction but car can push.",
    less: "**Lighter fluid (3-10k)** — more free. More rotation but can get loose on power.",
    settings: ["diff_type","diff_fluid","diff_height"],
    how: "Kit is **gear diff at 30k**. 30k→50k is a massive change."
  },
  "ride height": {
    kw: ["ride height","ground clearance"],
    title: "Ride Height",
    what: "Distance between chassis and ground. Affects center of gravity and clearance.",
    more: "**Higher (14-15mm)** — more body roll. More clearance. Common on low-grip carpet.",
    less: "**Lower (12mm)** — less roll, more responsive. Risk bottoming out.",
    settings: ["front_ride_height","rear_ride_height"],
    how: "Kit is **13mm F&R**. 14mm common at Beaver."
  },
  "battery position": {
    kw: ["battery position","battery weight","weight balance","weight distribution","battery forward"],
    title: "Battery Position",
    what: "Battery is the heaviest component. Position shifts front/rear weight balance.",
    more: "**Forward (pos 5)** — more front traction = more steering. Aggressive for low grip.",
    less: "**Rearward (pos 1-2)** — more rear traction. Better for high grip.",
    settings: ["battery_position"],
    how: "Kit is **position 3** (centered). 5 = full forward."
  },
  "wing": {
    kw: ["wing","wing angle","downforce","rear wing","front wing","aero"],
    title: "Wing / Downforce",
    what: "Pushes the car down at speed, creating grip. More angle = more downforce = more drag.",
    more: "**More wing (6°)** — more grip at speed. More drag = lower top speed.",
    less: "**Less wing (0°)** — less drag, higher top speed. Less grip in fast corners.",
    settings: ["wing_angle","rear_wing","front_wing"],
    how: "Kit is **6°**. Many Beaver racers run 0°."
  },
  "droop": {
    kw: ["droop","down travel","extension","rebound travel"],
    title: "Droop (Down Travel)",
    what: "How far the wheel drops when unloaded. Controls weight transfer.",
    more: "**More droop** — tires stay on ground longer. More grip, more weight transfer.",
    less: "**Less droop** — inside tires lift sooner. Less weight transfer, more consistent.",
    settings: ["front_stroke","rear_stroke","front_limiter_out","rear_limiter_out"],
    how: "Controlled by **shock stroke** and **external limiters**."
  },
  "pistons": {
    kw: ["piston","pistons","shock piston","holes","hole size"],
    title: "Shock Pistons",
    what: "Discs inside the shock with holes. Oil flows through — size and count determine damping curve.",
    more: "**Bigger/more holes** — less resistance, softer, faster response.",
    less: "**Smaller/fewer holes** — more resistance, firmer, more controlled.",
    settings: ["front_piston","rear_piston"],
    how: "Kit is **2x1.6 front, 2x1.9 rear**."
  },
  "ball stud": {
    kw: ["ball stud","ballstud","ball stud spacing"],
    title: "Ball Stud Spacing",
    what: "Pivot points for suspension links. Directly controls roll center height and camber curve.",
    more: "**Raising outer ball studs** — higher roll center. More responsive, can get snappy.",
    less: "**Lowering outer ball studs** — lower roll center. More forgiving, more grip.",
    settings: ["bs_front_left_top","bs_front_right_1","bs_rear_top"],
    how: "Adjustable with 1mm spacers. **Even 1mm is noticeable.**"
  },
  "slipper": {
    kw: ["slipper","slipper clutch","eliminator"],
    title: "Slipper Clutch",
    what: "Between motor and drivetrain. Slips under high torque to control power delivery.",
    more: "**Tighter/eliminated** — more direct power. Can cause wheelspin on low grip.",
    less: "**Looser** — smoother power. More forgiving, helps traction.",
    settings: ["slipper_type"],
    how: "Kit is HD slipper. Some run an **Eliminator** (fully locked)."
  },
  "eyelet": {
    kw: ["eyelet","shock eyelet"],
    title: "Shock Eyelet",
    what: "Where shock bottom connects to arm. Changes leverage ratio.",
    more: "**Higher number** — more leverage, firmer feel, more progressive.",
    less: "**Lower number** — less leverage, softer, more linear.",
    settings: ["front_eyelet","rear_eyelet"],
    how: "Kit is **0 front, +2 rear**."
  },
  "limiters": {
    kw: ["limiter","limiters","internal limiter","external limiter"],
    title: "Limiters",
    what: "Restrict suspension travel. **Internal** = compression limit. **External** = droop limit.",
    more: "**More internal** — less compression.\n**More external** — less droop, less weight transfer.",
    less: "**No limiters (kit)** — full travel both directions.",
    settings: ["front_limiter_in","front_limiter_out","rear_limiter_in","rear_limiter_out"],
    how: "Kit is **0 all around**."
  },
  "gearing": {
    kw: ["gear","gearing","pinion","spur","gear ratio","final drive"],
    title: "Gearing",
    what: "Pinion and spur set the final drive ratio. Balances acceleration vs top speed.",
    more: "**Taller (bigger pinion)** — more top speed, less acceleration, more heat.",
    less: "**Shorter (smaller pinion)** — more acceleration, less top speed, cooler motor.",
    settings: ["pinion","spur"],
    how: "⚠️ **Never change gearing and handling at the same time.**"
  },
  "tires": {
    kw: ["tire","tires","compound","rubber","tread","fuzzbite","swagger","spitfire","talon","insert"],
    title: "Tires & Compound",
    what: "Most important setup element. Compound = grip. Tread = how grip is delivered.",
    more: "**Softer compound** — more grip, wears faster.\n**Aggressive tread (Fuzzbites)** — max grip on carpet.",
    less: "**Harder compound** — less peak grip, more consistent.\n**Smoother tread** — less aggressive, more consistent.",
    settings: ["front_tires","front_compound","rear_tires","rear_compound"],
    how: "Depends on surface. Beaver = softer helps. Ed's = less aggressive can work."
  },
  "hub spacing": {
    kw: ["hub spacing","hub position","wheelbase"],
    title: "Hub Spacing / Wheelbase",
    what: "Moves rear axle position, changing effective wheelbase.",
    more: "**Back** — longer wheelbase. More stable, less agile.",
    less: "**Forward** — shorter wheelbase. More agile, less stable.",
    settings: ["hub_spacing"],
    how: "Kit is **Mid**. Options: Fwd, Mid, Back."
  },
  "bump steer": {
    kw: ["bump steer","bumpsteer"],
    title: "Bump Steer",
    what: "When toe changes as suspension moves. Makes the car steer over bumps.",
    more: "**More** — toe changes through travel. Can stabilize or create nervousness.",
    less: "**Zero (kit)** — most predictable. Car only steers when you tell it to.",
    settings: ["bump_steer"],
    how: "Kit is **0**."
  },
  "wheel hex": {
    kw: ["wheel hex","hex","track width"],
    title: "Wheel Hex / Track Width",
    what: "Hex width = how far wheels sit from car. Wider = wider track.",
    more: "**Wider (6.5mm)** — more stability, more scrub in tight turns.",
    less: "**Narrower (5.0mm)** — quicker direction changes, less scrub.",
    settings: ["front_wheel_hex","rear_wheel_hex"],
    how: "Kit is **6.5mm front, 5mm rear**. 5mm front popular at Beaver."
  },
  "cup offset": {
    kw: ["cup offset","shock cup","upper mount"],
    title: "Shock Cup Offset",
    what: "Upper shock mount position. Changes shock angle and damping progression.",
    more: "**More offset (+9)** — more progressive damping at top of travel.",
    less: "**Less offset (0)** — more consistent damping throughout.",
    settings: ["front_cup_offset","rear_cup_offset"],
    how: "Kit is **+5 front, 0 rear**."
  },
};

export function findKB(text) {
  const lo = text.toLowerCase().replace(/[?!.,'"]/g, "");
  const triggers = ["what is","what's","whats","what does","what do","what are","explain",
    "tell me about","how does","how do","help me understand","describe","meaning of","define"];
  if (!triggers.some(t => lo.includes(t))) return null;
  for (const entry of Object.values(KB)) {
    for (const kw of entry.kw) { if (lo.includes(kw)) return entry; }
  }
  return null;
}

export function formatKB(entry, setup, LABELS) {
  let r = `📘 **${entry.title}**\n\n${entry.what}\n\n${entry.more}\n\n${entry.less}\n\n${entry.how}`;
  if (entry.settings?.length) {
    const vals = entry.settings.filter(k => setup[k] && setup[k] !== "").map(k => `• ${LABELS[k]||k}: **${setup[k]}**`);
    if (vals.length) r += `\n\n🔧 **Your current settings:**\n${vals.join("\n")}`;
  }
  return r;
}

export const TOPICS = Object.values(KB).map(e => e.title).sort();
export default KB;
