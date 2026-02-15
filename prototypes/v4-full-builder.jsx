import { useState, useRef, useEffect, useCallback } from "react";

// ── Theme ──
const C = {
  bg: "#07080c", chatBg: "#0c0d12", userBubble: "#1a3a6e", botBubble: "#161720",
  botBorder: "#252630", accent: "#3b82f6", accentSoft: "#3b82f620", green: "#22c55e",
  greenSoft: "#22c55e18", yellow: "#eab308", red: "#ef4444",
  text: "#e2e2e8", textDim: "#8b8b9e", textMuted: "#55556a", white: "#fff",
  border: "#1e1f2a", inputBg: "#111218", inputBorder: "#2a2b38",
  qr: "#171822", qrBorder: "#2a2b3a", qrActive: "#253a6a", delta: "#f59e0b",
  setupBg: "#0f1018", setupBorder: "#1c1d28",
  tierAccent: "#8b5cf6", tierBg: "#8b5cf610",
};

// ── Complete B7 Kit Baseline (90 fields) ──
const KIT = {
  // Tier 1
  front_springs:"Orange",front_shock_oil:"35wt",rear_springs:"Gray",rear_shock_oil:"30wt",
  diff_fluid:"30k",front_ride_height:"13mm",rear_ride_height:"13mm",kick_up:"0°",
  battery_position:"3",wing_angle:"6°",
  // Tier 2
  front_arb:"1.0mm",rear_arb:"1.2mm",front_camber:"-1°",rear_camber:"-1°",front_toe:"0°",
  front_piston:"2x1.6",rear_piston:"2x1.9",front_piston_thickness:"2.5mm",rear_piston_thickness:"2.5mm",
  caster_insert:"+2.5",kpi:"2",rear_axle_height:"+2",front_axle_height:"+3",
  // Tier 3
  front_eyelet:"0",rear_eyelet:"+2",front_cup_offset:"+5",rear_cup_offset:"0",
  front_stroke:"23.5mm",rear_stroke:"27.5mm",front_limiter_in:"0",front_limiter_out:"0",
  rear_limiter_in:"0",rear_limiter_out:"0",steering_plate:"+1",bellcrank:"Up",
  bump_steer:"0",steering_stop:"-",diff_height:"2",
  // Tier 4
  bs_front_left_top:"0",bs_front_left_bottom:"0",bs_front_right_1:"1mm",bs_front_right_2:"1mm",
  bs_front_right_3:"1mm",bs_rear_top:"1mm",bs_rear_bottom:"2mm",
  camber_link_spacing:"2mm",front_bulkhead_spacing:"N/A",caster_block_spacing:"N/A",
  caster_block_link_mount:"Kit",hub_spacing:"Mid",arm_spacing:"Mid",
  front_wheel_hex:"6.5mm",rear_wheel_hex:"5mm",
  // Tier 5
  front_arm_type:"Kit",rear_arm_type:"Kit",tower_type:"Kit",bulkhead_type:"Aluminum",
  hub_type:"HRC",drive_shaft:"CVA's",c_mount:"Aluminum",d_mount:"Aluminum",
  battery_mount:"Std",diff_type:"Gear Diff",slipper_type:"HD",slipper_pads:"2x11mm",
  // Tier 6
  body:"RC10B7",front_wing:"RC10B7",rear_wing:'RC10B7 7"',chassis_length:"Std",
  servo_weights:"None",electronic_weights:"Aluminum",total_weight:"",
  // Tier 7
  radio:"",servo:"",esc:"",esc_settings:"",motor_wind:"17.5",timing:"",pinion:"",spur:"",battery_mah:"",
  // Tier 8
  front_tires:"",front_compound:"",front_insert:"",rear_tires:"",rear_compound:"",rear_insert:"",wheels:"",
  // Extras
  kashima_bodies:false,chrome_shafts:false,machined_spacers:false,vehicle_notes:"",
};

const LABELS = {
  front_springs:"Front Springs",front_shock_oil:"Front Shock Oil",rear_springs:"Rear Springs",
  rear_shock_oil:"Rear Shock Oil",diff_fluid:"Diff Fluid",front_ride_height:"Front Ride Height",
  rear_ride_height:"Rear Ride Height",kick_up:"Kick-Up Angle",battery_position:"Battery Position",
  wing_angle:"Wing Angle",front_arb:"Front ARB",rear_arb:"Rear ARB",front_camber:"Front Camber",
  rear_camber:"Rear Camber",front_toe:"Front Toe",front_piston:"Front Piston",rear_piston:"Rear Piston",
  front_piston_thickness:"Front Piston Thickness",rear_piston_thickness:"Rear Piston Thickness",
  caster_insert:"Caster Insert",kpi:"Steering Block KPI",rear_axle_height:"Rear Axle Height",
  front_axle_height:"Front Axle Height",front_eyelet:"Front Eyelet",rear_eyelet:"Rear Eyelet",
  front_cup_offset:"Front Cup Offset",rear_cup_offset:"Rear Cup Offset",front_stroke:"Front Stroke",
  rear_stroke:"Rear Stroke",front_limiter_in:"Front Limiter (In)",front_limiter_out:"Front Limiter (Out)",
  rear_limiter_in:"Rear Limiter (In)",rear_limiter_out:"Rear Limiter (Out)",steering_plate:"Steering Plate",
  bellcrank:"Bellcrank Position",bump_steer:"Bump Steer Spacing",steering_stop:"Steering Stop",
  diff_height:"Diff Height",bs_front_left_top:"BS Front Left Top",bs_front_left_bottom:"BS Front Left Bottom",
  bs_front_right_1:"BS Front Right 1",bs_front_right_2:"BS Front Right 2",bs_front_right_3:"BS Front Right 3",
  bs_rear_top:"BS Rear Top",bs_rear_bottom:"BS Rear Bottom",camber_link_spacing:"Camber Link Spacing",
  front_bulkhead_spacing:"Front Bulkhead Spacing",caster_block_spacing:"Caster Block Spacing",
  caster_block_link_mount:"Caster Block Link Mount",hub_spacing:"Hub Spacing",arm_spacing:"Arm Spacing",
  front_wheel_hex:"Front Wheel Hex",rear_wheel_hex:"Rear Wheel Hex",front_arm_type:"Front Arm Type",
  rear_arm_type:"Rear Arm Type",tower_type:"Tower Type",bulkhead_type:"Bulkhead Type",hub_type:"Hub Type",
  drive_shaft:"Drive Shaft",c_mount:"C Mount",d_mount:"D Mount",battery_mount:"Battery Mount",
  diff_type:"Diff Type",slipper_type:"Slipper Type",slipper_pads:"Slipper Pads",body:"Body",
  front_wing:"Front Wing",rear_wing:"Rear Wing",chassis_length:"Chassis Length",
  servo_weights:"Servo Weights",electronic_weights:"Electronic Weights",total_weight:"Total Weight",
  radio:"Radio",servo:"Servo",esc:"ESC",esc_settings:"ESC Settings",motor_wind:"Motor/Wind",
  timing:"Timing",pinion:"Pinion",spur:"Spur",battery_mah:"Battery (mAh)",
  front_tires:"Front Tires",front_compound:"Front Compound",front_insert:"Front Insert",
  rear_tires:"Rear Tires",rear_compound:"Rear Compound",rear_insert:"Rear Insert",wheels:"Wheels",
  kashima_bodies:"Kashima Bodies",chrome_shafts:"Chrome Shafts",machined_spacers:"Machined Spacers",
  vehicle_notes:"Vehicle Notes",
};

const SECTIONS = {
  "Front Suspension":["front_springs","front_shock_oil","front_ride_height","kick_up","front_arb","front_camber","front_toe","caster_insert","kpi","steering_plate","bellcrank","front_piston","front_piston_thickness","front_stroke","front_eyelet","front_cup_offset","front_limiter_in","front_limiter_out","front_axle_height","front_wheel_hex","bump_steer","steering_stop"],
  "Rear Suspension":["rear_springs","rear_shock_oil","rear_ride_height","rear_arb","rear_camber","rear_piston","rear_piston_thickness","rear_stroke","rear_eyelet","rear_cup_offset","rear_limiter_in","rear_limiter_out","rear_axle_height","rear_wheel_hex","hub_spacing","arm_spacing","hub_type"],
  "Geometry":["bs_front_left_top","bs_front_left_bottom","bs_front_right_1","bs_front_right_2","bs_front_right_3","bs_rear_top","bs_rear_bottom","camber_link_spacing","front_bulkhead_spacing","caster_block_spacing","caster_block_link_mount"],
  "Drivetrain":["diff_type","diff_fluid","diff_height","battery_position","battery_mount","slipper_type","slipper_pads"],
  "Body & Wings":["body","front_wing","rear_wing","wing_angle","chassis_length","servo_weights","electronic_weights","total_weight"],
  "Electronics":["radio","servo","esc","motor_wind","timing","pinion","spur","battery_mah"],
  "Tires":["front_tires","front_compound","front_insert","rear_tires","rear_compound","rear_insert","wheels"],
  "Hardware":["front_arm_type","rear_arm_type","tower_type","bulkhead_type","drive_shaft","c_mount","d_mount","kashima_bodies","chrome_shafts","machined_spacers"],
};

// ── COMPLETE BUILDER CONVERSATION ──
// Grouped naturally — asks related things together
const BUILDER_STEPS = [
  // ── TIER 1: The Big Stuff ──
  { tier: 1, intro: "Let's start with **springs and shock oil** — these define how the car feels more than almost anything.", fields: [
    { key: "front_springs", q: "**Front springs?**", opts: ["White","Silver","Orange (Kit)","Red","Blue","Black","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "I'll use kit (Orange) for now." : `Kit is Orange — ${["White","Silver"].includes(v) ? "softer = more progressive, slower weight transfer" : "stiffer = quicker response, faster weight transfer"}.` },
    { key: "rear_springs", q: "**Rear springs?**", opts: ["White","Silver","Yellow","Gray (Kit)","Orange","Red","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (Gray) for now." : `Kit is Gray — ${["White","Silver","Yellow"].includes(v) ? "softer rear = more traction, more squat on power" : "stiffer = less body roll, quicker transitions"}.` },
    { key: "front_shock_oil", q: "**Front shock oil?**", opts: ["25wt","27.5wt","30wt","32.5wt","35wt (Kit)","37.5wt","40wt","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (35wt)." : `Kit is 35wt — ${parseFloat(v) < 35 ? "lighter = front loads faster = more steering" : "heavier = more stable, less twitchy"}.` },
    { key: "rear_shock_oil", q: "**Rear shock oil?**", opts: ["25wt","27.5wt","30wt (Kit)","32.5wt","35wt","37.5wt","40wt","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (30wt)." : `Kit is 30wt — ${parseFloat(v) > 30 ? "heavier = more rear stability on power" : "lighter = more responsive rear"}.` },
  ]},
  { tier: 1, intro: "Now **diff, ride height, and weight balance** — where the grip comes from.", fields: [
    { key: "diff_fluid", q: "**Diff fluid weight?**", opts: ["3k","5k","7k","10k","20k","30k (Kit)","50k","80k","100k","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Big one to check before race night. Kit (30k) for now." : `Kit is 30k — ${parseInt(v) > 30 ? "heavier = more locked, better traction, less rotation" : "lighter = freer, more corner speed, can get loose"}.` },
    { key: "front_ride_height", q: "**Front ride height?**", opts: ["12mm","13mm (Kit)","14mm","15mm","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (13mm). Easy to measure." : `Kit is 13mm — ${parseInt(v) > 13 ? "higher = more clearance, more body roll. Common on low grip." : "lower = less roll, more responsive. Watch for bottoming out."}` },
    { key: "rear_ride_height", q: "**Rear ride height?**", opts: ["12mm","13mm (Kit)","14mm","15mm","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (13mm)." : `Kit is 13mm.` },
    { key: "kick_up", q: "**Kick-up angle?** Huge for mechanical steering on low-grip.", opts: ["-2.5°","0° (Kit)","+2.5°","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec — neutral." : v === "Not sure" ? "Kit (0°). This is often the first thing we change for low-grip steering." : v.includes("+") ? "More kick-up = more camber gain in turns = more mechanical front grip. Great for Beaver." : "Negative kick-up is rare — makes front lazier." },
    { key: "battery_position", q: "**Battery position?** (1=back, 5=full forward)", opts: ["1","2","3 (Kit)","4","5","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec — balanced." : v === "Not sure" ? "Kit (3)." : parseInt(v) >= 4 ? "Forward = more front weight = more front traction. Aggressive." : "Rearward = more rear traction." },
    { key: "wing_angle", q: "**Wing angle?**", opts: ["0°","3°","6° (Kit)","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec — full downforce." : v === "Not sure" ? "Kit (6°)." : "Less wing = less downforce, less drag. Trade rear stability for straight speed." },
  ]},

  // ── TIER 2: Suspension Details ──
  { tier: 2, intro: "Nice. Now let's dial in the **suspension details** — ARBs, camber, pistons, and geometry.", fields: [
    { key: "front_arb", q: "**Front anti-roll bar thickness?**", opts: ["None","0.8mm","1.0mm (Kit)","1.2mm","1.4mm","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (1.0mm)." : `Kit is 1.0mm — ${parseFloat(v) > 1.0 ? "stiffer = faster weight transfer, quicker direction changes" : parseFloat(v) < 1.0 ? "thinner = slower transfer, more progressive feel" : "no bar = maximum body roll, maximum grip but slow transitions"}.` },
    { key: "rear_arb", q: "**Rear anti-roll bar?**", opts: ["None","1.0mm","1.2mm (Kit)","1.3mm","1.4mm","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (1.2mm)." : `Kit is 1.2mm — ${parseFloat(v) > 1.2 ? "stiffer rear bar = less rear roll = more entry stability" : "thinner = more rear grip but can be loose on entry"}.` },
    { key: "front_camber", q: "**Front camber?**", opts: ["0°","-0.5°","-1° (Kit)","-1.5°","-2°","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (-1°)." : `Kit is -1° — ${parseFloat(v) < -1 ? "more negative = more grip in corners but less on straights" : "less negative = more straight-line traction"}.` },
    { key: "rear_camber", q: "**Rear camber?**", opts: ["0°","-0.5°","-1° (Kit)","-1.5°","-2°","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (-1°)." : "Kit is -1°." },
    { key: "front_toe", q: "**Front toe?**", opts: ["-1°","0° (Kit)","+1°","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec — neutral." : v === "Not sure" ? "Kit (0°)." : v.includes("+") ? "Toe-in = more stability, less turn-in." : "Toe-out = more aggressive turn-in, less stable." },
  ]},
  { tier: 2, intro: "**Pistons and caster geometry** — these shape the damping curve and steering feel.", fields: [
    { key: "front_piston", q: "**Front piston?** (holes x size)", opts: ["2x1.5","2x1.6 (Kit)","2x1.7","1.6","1.7","1.8","3x1.3","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (2x1.6)." : "Different pistons change the damping curve — bigger/more holes = less damping, smaller/fewer = more control." },
    { key: "rear_piston", q: "**Rear piston?**", opts: ["2x1.7","2x1.8","2x1.9 (Kit)","2x2.0","1.8","1.9","3x1.4","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (2x1.9)." : "Rear pistons control how the rear reacts to bumps and weight transfer." },
    { key: "front_piston_thickness", q: "**Front piston thickness?**", opts: ["2.0mm","2.5mm (Kit)","3.0mm","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (2.5mm)." : `Thicker pistons have more effect — they change how aggressively the oil is pushed through the holes.` },
    { key: "rear_piston_thickness", q: "**Rear piston thickness?**", opts: ["2.0mm","2.5mm (Kit)","3.0mm","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (2.5mm)." : "Same idea as front." },
    { key: "caster_insert", q: "**Caster block insert?** This controls trail and steering weight.", opts: ["0","+2.5 (Kit)","+5","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (+2.5)." : v === "0" ? "Zero caster = lighter steering, less trail. Good for low grip where you need the front to react fast." : "More caster = more trail = heavier but more stable steering." },
    { key: "kpi", q: "**Steering block KPI?**", opts: ["1","2 (Kit)","3","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (2)." : `KPI changes the scrub radius — affects how the steering feels and how the car reacts mid-corner. Subtle but real at 1/10 scale.` },
    { key: "front_axle_height", q: "**Front axle height?**", opts: ["+0","+1","+2","+3 (Kit)","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (+3)." : `Kit is +3 — ${v.includes("+0") || v.includes("+1") ? "lower = lower roll center = more planted but less reactive" : "higher = more responsive but can get snappy"}.` },
    { key: "rear_axle_height", q: "**Rear axle height?**", opts: ["+0","+1","+2 (Kit)","+3","Not sure"],
      teach: v => v.includes("Kit") ? "Kit spec." : v === "Not sure" ? "Kit (+2)." : `Kit is +2 — ${parseInt(v) < 2 ? "lower rear roll center = more rear traction, more planted. Rob Martin runs +0 at Beaver." : "higher = more reactive rear"}.` },
  ]},

  // ── TIER 3: Fine Tuning ──
  { tier: 3, intro: "Getting into the **fine tuning** now — shock geometry, limiters, steering setup. This is where the detail-oriented racers separate themselves.", fields: [
    { key: "front_eyelet", q: "**Front shock eyelet position?**", opts: ["-2","-1","0 (Kit)","+1","+2","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (0)." : "Eyelet changes the shock leverage ratio — affects how progressive the damping feels through the travel." },
    { key: "rear_eyelet", q: "**Rear shock eyelet?**", opts: ["-2","-1","0","+1","+2 (Kit)","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (+2)." : "Same concept — changes the effective damping rate through suspension travel." },
    { key: "front_cup_offset", q: "**Front shock cup offset?**", opts: ["0","+5 (Kit)","+9","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (+5)." : "Cup offset changes the shock mounting angle — affects how the shock loads through travel." },
    { key: "rear_cup_offset", q: "**Rear shock cup offset?**", opts: ["0 (Kit)","+5","+9","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (0)." : "" },
    { key: "front_stroke", q: "**Front shock stroke?**", opts: ["20.5mm","21.5mm","22.5mm","23.5mm (Kit)","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (23.5mm)." : `${parseFloat(v) < 23.5 ? "Less stroke = more controlled front end, less dive under braking" : "More stroke = more travel available"}.` },
    { key: "rear_stroke", q: "**Rear shock stroke?**", opts: ["26.5mm","27.5mm (Kit)","28.5mm","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (27.5mm)." : "" },
    { key: "front_limiter_in", q: "**Front limiters — internal?**", opts: ["0 (Kit)","1","2","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (0)." : "Internal limiters restrict compression travel — changes the ride height under load." },
    { key: "front_limiter_out", q: "**Front limiters — external?**", opts: ["0 (Kit)","1","2","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (0)." : "External limiters limit droop — affects how much weight transfers off that corner." },
    { key: "rear_limiter_in", q: "**Rear limiters — internal?**", opts: ["0 (Kit)","1","2","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (0)." : "" },
    { key: "rear_limiter_out", q: "**Rear limiters — external?**", opts: ["0 (Kit)","1","2","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (0)." : "Rear external limiters affect how much the rear unloads in corners." },
  ]},
  { tier: 3, intro: "**Steering system and diff height.**", fields: [
    { key: "steering_plate", q: "**Steering plate?** Controls Ackermann.", opts: ["Kit","+1 (Kit default)","Not sure"],
      teach: v => v === "Not sure" ? "Kit (+1)." : "Steering plate changes Ackermann — how much the inside wheel turns relative to the outside in corners." },
    { key: "bellcrank", q: "**Bellcrank position?**", opts: ["Up (Kit)","Down","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (Up)." : "Bellcrank position changes the steering ratio and response." },
    { key: "bump_steer", q: "**Bump steer spacing?**", opts: ["0 (Kit)","1mm","2mm","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (0)." : "Bump steer changes how the toe angle shifts as the suspension moves. Can make the car more or less stable over bumps." },
    { key: "diff_height", q: "**Diff height setting?**", opts: ["1","2 (Kit)","3","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (2)." : "Diff height affects the rear anti-squat angle — changes how the rear reacts under acceleration." },
  ]},

  // ── TIER 4: Ball Studs & Geometry ──
  { tier: 4, intro: "Now for the **geometry details** — ball stud spacings, link positions, hex widths. These are the 1mm changes that make 1/10 scale racing what it is. 🔧", fields: [
    { key: "bs_front_left_top", q: "**Front left ball stud spacing — top (on arm)?**", opts: ["0 (Kit)","1mm","2mm","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (0)." : "This changes the front roll center height on the inner side. Even 1mm changes weight transfer character." },
    { key: "bs_front_left_bottom", q: "**Front left ball stud — bottom (on arm)?**", opts: ["0 (Kit)","1mm","2mm","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (0)." : "Combined with the top, this sets the front anti-dive and roll geometry." },
    { key: "bs_front_right_1", q: "**Front right ball stud spacing — top (on tower/bulkhead)?**", opts: ["0","1mm (Kit)","2mm","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (1mm)." : "This is the upper arm pivot height — directly affects the front roll center." },
    { key: "bs_front_right_2", q: "**Front right ball stud — middle?**", opts: ["0","1mm (Kit)","2mm","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (1mm)." : "" },
    { key: "bs_front_right_3", q: "**Front right ball stud — bottom?**", opts: ["0","1mm (Kit)","2mm","3mm","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (1mm)." : "" },
    { key: "bs_rear_top", q: "**Rear ball stud spacing — top?**", opts: ["0","1mm (Kit)","2mm","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (1mm)." : "Rear ball stud positions control the rear roll center — massive impact on rear grip and stability." },
    { key: "bs_rear_bottom", q: "**Rear ball stud — bottom?**", opts: ["0","1mm","2mm (Kit)","3mm","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (2mm)." : "" },
    { key: "camber_link_spacing", q: "**Rear camber link spacing?**", opts: ["1mm","2mm (Kit)","3mm","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (2mm)." : "Changes the rear upper arm effective length — affects camber gain through travel." },
    { key: "hub_spacing", q: "**Hub spacing?**", opts: ["Fwd","Mid (Kit)","Back","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (Mid)." : "Hub spacing shifts the rear axle position — affects wheelbase and rear weight bias." },
    { key: "arm_spacing", q: "**Rear arm spacing?**", opts: ["Fwd","Mid (Kit)","Back","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (Mid)." : "Arm spacing changes the rear hinge pin angle — affects how the rear suspension reacts." },
    { key: "front_wheel_hex", q: "**Front wheel hex?**", opts: ["5.0mm","6.0mm","6.5mm (Kit)","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (6.5mm)." : `${parseFloat(v) < 6.5 ? "Narrower track width = less front leverage. Can help on tight tracks." : ""}` },
    { key: "rear_wheel_hex", q: "**Rear wheel hex?**", opts: ["4.5mm","5mm (Kit)","5.5mm","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (5mm)." : "" },
  ]},

  // ── TIER 5: Hardware ──
  { tier: 5, intro: "**Hardware choices** — arms, mounts, shafts. These don't change often but they matter.", fields: [
    { key: "front_arm_type", q: "**Front arms?**", opts: ["Kit (plastic)","Carbon","Not sure"],
      teach: v => v === "Carbon" ? "Carbon arms are lighter with different flex — popular upgrade." : "Kit spec." },
    { key: "rear_arm_type", q: "**Rear arms?**", opts: ["Kit (plastic)","Carbon","Not sure"],
      teach: v => v === "Carbon" ? "Carbon rears — lighter, different rebound characteristics." : "Kit spec." },
    { key: "hub_type", q: "**Hub type?**", opts: ["Std","HRC (Kit)","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (HRC)." : "Std hubs have different geometry than HRC." },
    { key: "drive_shaft", q: "**Drive shafts?**", opts: ["CVA's (Kit)","Universal","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (CVAs)." : "Universals are smoother but heavier." },
    { key: "c_mount", q: "**C mount material?**", opts: ["Aluminum (Kit)","Steel","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (Aluminum)." : "Steel is heavier — adds weight low and rear. Some racers use this for traction." },
    { key: "d_mount", q: "**D mount?**", opts: ["Aluminum (Kit)","Steel","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (Aluminum)." : "" },
    { key: "diff_type", q: "**Diff type?**", opts: ["Gear Diff (Kit)","Ball Diff","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit (Gear Diff)." : "Ball diff is more tunable but requires more maintenance." },
  ]},

  // ── TIER 6: Body, Weight, Electronics ──
  { tier: 6, intro: "Almost done! **Body, electronics, and tires.** This rounds out the full picture.", fields: [
    { key: "rear_wing", q: "**Rear wing?**", opts: ['RC10B7 7" (Kit)',"JConcepts","Other","None","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "Kit wing." : v === "JConcepts" ? "JConcepts wing — different downforce profile." : "" },
    { key: "front_wing", q: "**Front wing?**", opts: ["RC10B7 (Kit)","None","Other","Not sure"],
      teach: v => v === "None" ? "No front wing — less front downforce but cleaner airflow." : "Kit spec." },
    { key: "servo_weights", q: "**Any servo or chassis weights?**", opts: ["None (Kit)","Brass under servo","Other weight","Not sure"],
      teach: v => v.includes("Kit") || v === "Not sure" ? "No extra weight." : "Added weight changes the balance — where you put it matters as much as how much." },
    { key: "motor_wind", q: "**Motor wind/turns?**", opts: ["13.5T","17.5T","21.5T","Other","Not sure"],
      teach: v => v === "Not sure" ? "I'll skip this for now." : "" },
    { key: "pinion", q: "**Pinion tooth count?**", opts: ["28","29","30","31","32","33","Other","Not sure"],
      teach: v => v === "Not sure" ? "Gearing is important but we can figure it out later." : "" },
    { key: "spur", q: "**Spur gear?**", opts: ["69","72","75","78","81","Other","Not sure"],
      teach: v => v === "Not sure" ? "No worries." : "" },
  ]},
  { tier: 6, intro: "**Tires** — arguably the most important part of the whole car.", fields: [
    { key: "front_tires", q: "**Front tires?** (brand/model)", opts: ["JConcepts Fuzzbites","JConcepts Swaggers","Pro-Motion Spitfire","Pro-Motion Talon","Viper","Other","Not sure"],
      teach: v => v === "Not sure" ? "Tires are huge — if you can check before race night, do." : `${v} — got it.` },
    { key: "front_compound", q: "**Front compound?**", opts: ["Green","Gold","Aqua","Blue","Pink","Other","Not sure"],
      teach: v => v === "Not sure" ? "Compound determines grip level." : "" },
    { key: "front_insert", q: "**Front insert?**", opts: ["PM","Pro-Motion","JConcepts Dirt-Tech","Other","Not sure"],
      teach: v => v === "Not sure" ? "" : "" },
    { key: "rear_tires", q: "**Rear tires?**", opts: ["JConcepts Fuzzbites","JConcepts Swaggers","Pro-Motion Spitfire","Pro-Motion Talon","Viper","Other","Not sure"],
      teach: v => "" },
    { key: "rear_compound", q: "**Rear compound?**", opts: ["Green","Gold","Aqua","Blue","Pink","Other","Not sure"],
      teach: v => "" },
    { key: "rear_insert", q: "**Rear insert?**", opts: ["PM","Pro-Motion","JConcepts Dirt-Tech","Other","Not sure"],
      teach: v => "" },
  ]},
];

// Tier labels for progress display
const TIER_NAMES = {
  1: "The Big Stuff",
  2: "Suspension Details",
  3: "Fine Tuning",
  4: "Geometry & Spacing",
  5: "Hardware",
  6: "Body, Electronics & Tires",
};

// Count total fields
const TOTAL_FIELDS = BUILDER_STEPS.reduce((a, s) => a + s.fields.length, 0);

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
      <div style={{ display: "flex", overflowX: "auto", borderBottom: `1px solid ${C.setupBorder}`, WebkitOverflowScrolling: "touch" }}>
        {Object.keys(SECTIONS).map((s) => (
          <div key={s} onClick={() => setTab(s)} style={{
            padding: "7px 10px", fontSize: 10, color: tab === s ? C.accent : C.textMuted,
            borderBottom: `2px solid ${tab === s ? C.accent : "transparent"}`, cursor: "pointer", whiteSpace: "nowrap",
          }}>{s}</div>
        ))}
      </div>
      <div style={{ maxHeight: 240, overflowY: "auto" }}>
        {(SECTIONS[tab] || []).map((key) => {
          const diff = diffs.find((d) => d.key === key);
          const val = setup[key]; if (val === undefined || val === "") return null;
          const display = typeof val === "boolean" ? (val ? "Yes" : "No") : val;
          return (
            <div key={key} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "6px 14px", borderBottom: `1px solid ${C.setupBorder}`,
              borderLeft: diff ? `3px solid ${C.delta}` : "3px solid transparent",
              background: diff ? `${C.delta}08` : "transparent",
            }}>
              <span style={{ fontSize: 11, color: C.textDim }}>{LABELS[key] || key}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {diff && <span style={{ fontSize: 10, color: C.textMuted, textDecoration: "line-through" }}>{diff.from}</span>}
                <span style={{ fontSize: 12, fontWeight: diff ? 600 : 400, color: diff ? C.delta : C.white }}>{display}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Dots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "8px 0", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (<div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.textMuted, animation: `tp 1.2s ease-in-out ${i * 0.15}s infinite` }} />))}
      <style>{`@keyframes tp{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}`}</style>
    </div>
  );
}

// ── Progress Bar ──
function ProgressBar({ current, total, tier }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ margin: "4px 0 8px", padding: "0 4px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: C.tierAccent, fontWeight: 600 }}>Tier {tier}: {TIER_NAMES[tier]}</span>
        <span style={{ fontSize: 10, color: C.textMuted }}>{current}/{total} fields</span>
      </div>
      <div style={{ height: 3, background: C.border, borderRadius: 2 }}>
        <div style={{ height: 3, background: C.tierAccent, borderRadius: 2, width: `${pct}%`, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

// ── Main App ──
export default function RaceModeV4() {
  const [msgs, setMsgs] = useState([]);
  const [phase, setPhase] = useState("init");
  const [cond, setCond] = useState({});
  const [hist, setHist] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [qr, setQr] = useState([]);
  const [setup, setSetup] = useState({ ...KIT });
  const [diffs, setDiffs] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [fieldIdx, setFieldIdx] = useState(0);
  const [fieldsCompleted, setFieldsCompleted] = useState(0);
  const [currentTier, setCurrentTier] = useState(1);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);
  useEffect(() => { setTimeout(() => bot("Hey! 🏁 Let's get you set up. What car are we working with?", ["RC10B7", "RC10B84", "RC10T7"]), 500); }, []);

  const bot = (text, replies = [], extra = null) => {
    setTyping(true); setQr([]);
    const d = Math.min(500 + text.length * 4, 1600);
    setTimeout(() => { setTyping(false); setMsgs((p) => [...p, { role: "bot", text, extra }]); if (replies.length) setQr(replies); }, d);
  };
  const user = (text) => { setMsgs((p) => [...p, { role: "user", text }]); setQr([]); };

  const setVal = (key, val) => {
    const clean = val.replace(/\s*\(Kit\)|\s*\(Kit default\)|\s*\(plastic\)|\s*\(softest\)|\s*\(stiffest\)/gi, "").trim();
    if (clean === "Not sure" || clean === KIT[key]) return;
    setSetup((p) => ({ ...p, [key]: clean }));
    setDiffs((p) => [...p.filter((d) => d.key !== key), { key, from: KIT[key], to: clean }]);
  };

  const askNextField = (sIdx, fIdx) => {
    if (sIdx >= BUILDER_STEPS.length) {
      // ALL DONE
      bot(`**Setup complete!** 🎉\n\nYour B7 is fully loaded — ${diffs.length} change${diffs.length !== 1 ? "s" : ""} from kit baseline across ${TOTAL_FIELDS} fields.\n\nThis is a complete setup sheet. Every ball stud, every spacer, every setting. The more detail you gave me, the better I can coach you tonight.\n\nSay **"show my setup"** anytime. Ready to race?`,
        ["Let's race!", "Show my setup", "Change something"]);
      setPhase("setup_done");
      return;
    }

    const step = BUILDER_STEPS[sIdx];

    // Check if we're starting a new step (need intro)
    if (fIdx === 0) {
      setCurrentTier(step.tier);
      // If new tier, offer to stop
      const prevTier = sIdx > 0 ? BUILDER_STEPS[sIdx - 1].tier : 0;
      if (step.tier > prevTier && step.tier > 1) {
        const tierName = TIER_NAMES[step.tier];
        bot(`✅ Tier ${prevTier} done!\n\nNext up: **Tier ${step.tier} — ${tierName}**\n\nYou've covered the ${step.tier <= 2 ? "highest" : "high"}-impact settings. Want to keep going deeper, or is this enough to start racing?\n\nThe more I know, the better my advice gets. Every detail matters at 1/10 scale.`,
          ["Keep going — every detail matters", "This is enough, let's race", "Show my setup"]);
        setPhase("tier_gate");
        return;
      }
      // Show intro then first field
      bot(step.intro);
      setTimeout(() => {
        const f = step.fields[0];
        bot(f.q, f.opts, { type: "progress", tier: step.tier, count: fieldsCompleted });
        setPhase("building");
      }, 800);
    } else {
      const f = step.fields[fIdx];
      if (!f) {
        // Move to next step
        askNextField(sIdx + 1, 0);
        return;
      }
      bot(f.q, f.opts, { type: "progress", tier: step.tier, count: fieldsCompleted });
      setPhase("building");
    }
  };

  const handle = (reply) => {
    user(reply);
    const lo = reply.toLowerCase();

    // Global: show setup
    if ((lo.includes("show") && lo.includes("setup")) || lo === "show my setup") {
      setTimeout(() => {
        setMsgs((p) => [...p, { role: "bot", text: diffs.length > 0
          ? `Your B7 — ${diffs.length} change${diffs.length !== 1 ? "s" : ""} from kit.`
          : "Running kit baseline.", extra: "setup" }]);
        setQr(phase === "setup_done" ? ["Let's race!", "Change something"] : ["Continue building", "Let's race"]);
      }, 400);
      return;
    }

    if (phase === "init") {
      if (reply === "RC10B7") {
        setPhase("onboard");
        setTimeout(() => bot("B7 — let's get your setup loaded. How do you want to do this?",
          ["Build it with me (guided)", "Start from kit — tell you what's different", "Upload a setup sheet"]), 300);
      } else {
        setTimeout(() => bot(`${reply} is coming soon! Let's use the B7 for now.`, ["RC10B7"]), 300);
      }
    }

    else if (phase === "onboard") {
      if (reply.includes("Build")) {
        setTimeout(() => {
          bot(`Let's build your complete setup. I'll go section by section — **${TOTAL_FIELDS} fields total** across 6 tiers, from high-impact settings down to every ball stud spacing.\n\nFor anything you're not sure about, just say so — I'll use kit spec and we can figure it out later.\n\nI'll teach you what each setting does as we go. Ready?`, ["Let's do it!"]);
        }, 300);
        setPhase("pre_build");
      } else if (reply.includes("kit") || reply.includes("Kit")) {
        setTimeout(() => bot("Starting from kit. Tell me what's different — rattle it off however you want.\n\nLike: *\"red front springs, 50k diff, battery forward\"*", ["That's all kit actually", "Let me list changes"]), 300);
        setPhase("kit_diff");
      } else {
        setTimeout(() => bot("Upload is coming in the next version! Let's build it together for now — it's worth the time.", ["Build it with me (guided)", "Start from kit — tell you what's different"]), 300);
      }
    }

    else if (phase === "pre_build" && reply === "Let's do it!") {
      setStepIdx(0); setFieldIdx(0); setFieldsCompleted(0);
      askNextField(0, 0);
    }

    else if (phase === "tier_gate") {
      if (reply.includes("Keep going") || reply.includes("every detail")) {
        const step = BUILDER_STEPS[stepIdx];
        bot(step.intro);
        setTimeout(() => {
          const f = step.fields[0];
          bot(f.q, f.opts, { type: "progress", tier: step.tier, count: fieldsCompleted });
          setPhase("building");
        }, 800);
      } else if (reply.includes("enough") || reply.includes("race")) {
        bot(`Setup loaded with ${diffs.length} change${diffs.length !== 1 ? "s" : ""} from kit. The settings you didn't fill in are at kit spec — we can always come back and add more detail.\n\nReady to pick a track?`,
          ["Let's race!", "Show my setup"]);
        setPhase("setup_done");
      } else if (reply.includes("Continue")) {
        const step = BUILDER_STEPS[stepIdx];
        const f = step.fields[fieldIdx];
        bot(f.q, f.opts);
        setPhase("building");
      }
    }

    else if (phase === "building") {
      const step = BUILDER_STEPS[stepIdx];
      const field = step.fields[fieldIdx];
      if (field) {
        const clean = reply.replace(/\s*\(Kit.*?\)|\s*\(plastic\)|\s*\(softest\)|\s*\(stiffest\)/gi, "").trim();
        if (clean !== "Not sure") setVal(field.key, clean);
        const teach = field.teach(reply);
        const newFieldsCompleted = fieldsCompleted + 1;
        setFieldsCompleted(newFieldsCompleted);

        const nextFieldIdx = fieldIdx + 1;
        if (teach && teach.length > 0) {
          setTimeout(() => bot(teach), 200);
          setTimeout(() => {
            setFieldIdx(nextFieldIdx);
            setStepIdx(stepIdx);
            askNextField(nextFieldIdx >= step.fields.length ? stepIdx + 1 : stepIdx,
                         nextFieldIdx >= step.fields.length ? 0 : nextFieldIdx);
          }, 900);
        } else {
          setFieldIdx(nextFieldIdx);
          setTimeout(() => {
            askNextField(nextFieldIdx >= step.fields.length ? stepIdx + 1 : stepIdx,
                         nextFieldIdx >= step.fields.length ? 0 : nextFieldIdx);
          }, 300);
        }
        if (nextFieldIdx >= step.fields.length) {
          setStepIdx(stepIdx + 1);
          setFieldIdx(0);
        }
      }
    }

    else if (phase === "kit_diff") {
      if (reply === "That's all kit actually") {
        bot("Pure kit — let's see what the track tells us. Ready?", ["Let's race!", "Show my setup"]);
        setPhase("setup_done");
      } else if (reply === "Let me list changes" || reply === "More changes") {
        bot("Go ahead — tell me what's different.", []);
      } else if (reply === "That's everything") {
        bot(`Loaded — ${diffs.length} change${diffs.length !== 1 ? "s" : ""} from kit. Ready to race?`, ["Let's race!", "Show my setup"]);
        setPhase("setup_done");
      } else {
        // Try to parse
        const changes = [];
        const springs = { white:"White",silver:"Silver",orange:"Orange",red:"Red",blue:"Blue",black:"Black",yellow:"Yellow",gray:"Gray" };
        for (const [k, v] of Object.entries(springs)) {
          if (lo.includes(k) && lo.includes("front") && lo.includes("spring")) { setVal("front_springs", v); changes.push(`Front springs → ${v}`); }
          if (lo.includes(k) && lo.includes("rear") && lo.includes("spring")) { setVal("rear_springs", v); changes.push(`Rear springs → ${v}`); }
        }
        const diffMatch = lo.match(/(\d+)\s*k\s*(diff|fluid)/); if (diffMatch) { setVal("diff_fluid", diffMatch[1]+"k"); changes.push(`Diff → ${diffMatch[1]}k`); }
        if (lo.includes("battery") && (lo.includes("forward") || lo.includes("5"))) { setVal("battery_position", "5"); changes.push("Battery → 5 (forward)"); }
        if (lo.includes("kick") && lo.includes("2.5")) { setVal("kick_up", "+2.5°"); changes.push("Kick-up → +2.5°"); }
        if (lo.includes("14") && lo.includes("ride")) { setVal("front_ride_height","14mm"); setVal("rear_ride_height","14mm"); changes.push("Ride height → 14mm F&R"); }
        if (lo.includes("carbon") && lo.includes("arm")) { setVal("front_arm_type","Carbon"); setVal("rear_arm_type","Carbon"); changes.push("Arms → Carbon F&R"); }

        if (changes.length > 0) {
          bot(`Got it:\n${changes.map(c => `• **${c}**`).join("\n")}\n\nAnything else?`, ["That's everything", "More changes", "Show my setup"]);
        } else {
          bot("Can you be specific? Like \"front springs are Red\" or \"diff is 50k\".", []);
        }
      }
    }

    else if (phase === "setup_done") {
      if (reply === "Let's race!" || reply === "Let's race") {
        setPhase("pick_track");
        setTimeout(() => bot("Where are you racing tonight?", ["Beaver RC", "Ed's Hobby Shop", "Somewhere else"]), 300);
      } else if (reply === "Change something") {
        bot("What do you want to change? Tell me the setting and value.", []);
        setPhase("kit_diff");
      }
    }

    // Track selection flow
    else if (phase === "pick_track") {
      const tracks = { "Beaver RC": "beaver", "Ed's Hobby Shop": "eds", "Somewhere else": "other" };
      setCond(p => ({ ...p, track: tracks[reply] || "other" })); setPhase("pick_layout");
      setTimeout(() => bot(reply === "Beaver RC" ? "Beaver — what's the layout this week?" : "What's the layout?", ["Tight / Technical", "Open / Fast", "Mixed"]), 300);
    } else if (phase === "pick_layout") {
      setCond(p => ({ ...p, layout: reply })); setPhase("pick_temp");
      setTimeout(() => bot("Temperature?", ["Cold (<55°F)", "Cool (55-65°F)", "Warm (65-75°F)", "Hot (75°F+)"]), 300);
    } else if (phase === "pick_temp") {
      setCond(p => ({ ...p, temp: reply })); setPhase("pick_att");
      setTimeout(() => bot("How packed tonight?", ["Light (<15)", "Moderate (15-25)", "Packed (25+)"]), 300);
    } else if (phase === "pick_att") {
      setCond(p => ({ ...p, attendance: reply })); setPhase("pick_grip");
      setTimeout(() => bot("Grip after first run?", ["Very low", "Low", "Low-medium", "Medium", "Medium-high"]), 300);
    } else if (phase === "pick_grip") {
      const c = { ...cond, grip: reply }; setCond(c); setPhase("racing");
      setTimeout(() => bot(`${c.layout}, ${reply.toLowerCase()} grip, ${c.temp?.toLowerCase()}.\n\nYour B7 is loaded — I know ${Object.keys(setup).filter(k => setup[k] && setup[k] !== "").length} settings on your car. The more you gave me, the smarter my advice.\n\n**What's the car doing?**`,
        ["Loose on corner entry","Loose on corner exit","Pushes on entry","Pushes on exit","No steering at all","Snappy / unpredictable","Lazy / slow to respond","Traction rolling","Bouncing / hopping","Feels good but slow"]), 300);
    }

    // Racing/coaching (simplified for space — same logic as V3)
    else if (phase === "racing") {
      if (["Loose on corner entry","Loose on corner exit","Pushes on entry","Pushes on exit","No steering at all","Snappy / unpredictable","Lazy / slow to respond","Traction rolling","Bouncing / hopping","Feels good but slow"].includes(reply)) {
        setTimeout(() => {
          const val = (k) => setup[k] || KIT[k];
          // Quick inline recommendations with actual setup values
          const recs = {
            "No steering at all": `No steering. Kick-up is **${val("kick_up")}**, caster insert **${val("caster_insert")}**, front oil **${val("front_shock_oil")}**, battery pos **${val("battery_position")}**.\n\n${val("kick_up") === "0°" ? "**Add +2.5° kick-up** — mechanical front grip without changing springs." : `Kick-up already at ${val("kick_up")}. **Drop front oil to ${parseFloat(val("front_shock_oil")) > 30 ? "30wt" : "27.5wt"}** for faster front loading.`}\n\nOne change at a time.`,
            "Loose on corner exit": `Loose on power. Diff is **${val("diff_fluid")}**, rear springs **${val("rear_springs")}**, rear oil **${val("rear_shock_oil")}**.\n\n**Step diff up to ${parseInt(val("diff_fluid")) < 50 ? "50k" : "80k"}**. Isolate the diff — leave springs and oil alone.`,
            "Pushes on entry": `Push on entry. Front oil **${val("front_shock_oil")}**, front springs **${val("front_springs")}**, ARB **${val("front_arb")}**.\n\n**Drop front oil to ${parseFloat(val("front_shock_oil")) > 30 ? "30wt" : "27.5wt"}** — faster front compression = more entry bite.`,
            "Pushes on exit": `Push on exit. Diff **${val("diff_fluid")}**, rear springs **${val("rear_springs")}**.\n\n${parseInt(val("diff_fluid")) > 40 ? `Diff at ${val("diff_fluid")} is fairly locked — **drop to ${parseInt(val("diff_fluid")) > 60 ? "50k" : "30k"}** for more rotation.` : "**Softer rear spring** — more squat frees the front."}`,
            "Snappy / unpredictable": `Snappy. Front springs **${val("front_springs")}**, oil **${val("front_shock_oil")}**, front ARB **${val("front_arb")}**.\n\n**Softer front spring (one step down).** Slows weight transfer, more forgiving.`,
            "Lazy / slow to respond": `Lazy car. Front ARB **${val("front_arb")}**, springs **${val("front_springs")}**, oil **${val("front_shock_oil")}**.\n\n**Stiffer front ARB (+0.2mm)** — faster weight transfer on turn-in.`,
            "Loose on corner entry": `Rear loose on entry. Rear ARB **${val("rear_arb")}**, rear springs **${val("rear_springs")}**, rear axle height **${val("rear_axle_height")}**.\n\n**Stiffer rear ARB (+0.2mm)** — reduces rear roll on entry.`,
            "Traction rolling": `Traction roll. Ride height **${val("front_ride_height")}F / ${val("rear_ride_height")}R**, rear ARB **${val("rear_arb")}**.\n\n**Raise ride height 1mm both ends.** If that's not enough, softer rear springs or thinner rear ARB.`,
            "Bouncing / hopping": `Bouncing. Front: **${val("front_springs")} / ${val("front_shock_oil")}**, Rear: **${val("rear_springs")} / ${val("rear_shock_oil")}**.\n\nWhere is it bouncing — front or rear?`,
            "Feels good but slow": `⚠️ **Don't touch the setup.** Battery is at **${val("battery_position")}**, wing at **${val("wing_angle")}**, pinion **${val("pinion") || "unknown"}**.\n\nTry +1 pinion. If handling changes, roll it back immediately.`,
          };
          bot(recs[reply] || "Tell me more.", ["I'll try that", "Already tried that", "What else?", "Show my setup"]);
          setHist(p => [...p, { symptom: reply }]);
          setPhase("result");
        }, 300);
      } else if (reply === "Roll back to start") {
        setSetup({...KIT}); setDiffs([]); setHist([]);
        bot("Back to starting setup. Run it and tell me.", ["Loose on corner entry","Loose on corner exit","No steering at all","Pushes on entry"]);
      } else {
        bot("What's the car doing?", ["Loose on corner entry","Loose on corner exit","Pushes on entry","Pushes on exit","No steering at all","Snappy / unpredictable","Lazy / slow to respond","Feels good but slow"]);
      }
    }

    else if (phase === "result") {
      if (reply === "I'll try that") {
        bot("Run it. 👊 How'd it go?", ["Better","A little better","About the same","Worse","Much worse"]);
      } else if (["Better","A little better","About the same","Worse","Much worse"].includes(reply)) {
        const pos = reply.includes("etter"); const neg = reply.includes("orse");
        if (pos) bot(`${reply === "Better" ? "Nice!" : "Right direction."} Keep dialing or ride it into the main?`, ["Keep dialing","I'm good for the main","Show my setup"]);
        else if (neg) bot("Roll that back. Then tell me what the car is doing fresh.", ["Rolled it back"]);
        else bot("Didn't move the needle. Different approach — what's the car doing?", ["Loose on corner entry","Loose on corner exit","No steering at all","Pushes on entry"]);
        setPhase("racing");
      } else { setPhase("racing"); handle(reply); return; }
    }

    else if (reply === "I'm good for the main") {
      bot(`Go get 'em. 🏁\n\n${hist.length} change${hist.length !== 1 ? "s" : ""} tonight. ${diffs.length} total from kit.\n\nAll this data gets smarter over time. See you next race night.`, []);
      setPhase("done");
    }
  };

  const handleSend = () => { if (!input.trim()) return; const t = input.trim(); setInput(""); handle(t); };

  return (
    <div style={{ background: C.bg, height: "100vh", display: "flex", flexDirection: "column", fontFamily: "-apple-system,'SF Pro Text','Segoe UI',sans-serif", color: C.text, maxWidth: 500, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "12px 20px", background: C.chatBg, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${C.accent},#1d4ed8)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏁</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.white }}>Race Mode Coach</div>
          <div style={{ fontSize: 11, color: C.textDim }}>
            {phase === "done" ? "Session complete" : phase === "building" || phase === "tier_gate" || phase === "pre_build" ? `Building setup · ${fieldsCompleted}/${TOTAL_FIELDS}` : `B7${cond.track ? " · " + (cond.track === "beaver" ? "Beaver" : cond.track === "eds" ? "Ed's" : "") : ""}`}
          </div>
        </div>
        {diffs.length > 0 && <div style={{ background: `${C.delta}15`, border: `1px solid ${C.delta}35`, borderRadius: 20, padding: "3px 10px", fontSize: 11, color: C.delta, fontWeight: 600 }}>{diffs.length}Δ</div>}
        {(phase === "racing" || phase === "result") && <div style={{ background: C.greenSoft, border: `1px solid ${C.green}30`, borderRadius: 20, padding: "3px 10px", fontSize: 11, color: C.green }}>● Live</div>}
      </div>

      {/* Progress bar during building */}
      {(phase === "building" || phase === "tier_gate") && (
        <div style={{ padding: "4px 16px 0", background: C.chatBg, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <ProgressBar current={fieldsCompleted} total={TOTAL_FIELDS} tier={currentTier} />
        </div>
      )}

      {/* Conditions bar */}
      {cond.layout && (
        <div style={{ padding: "5px 16px", background: C.chatBg, borderBottom: `1px solid ${C.border}`, display: "flex", gap: 5, flexWrap: "wrap", flexShrink: 0 }}>
          {[cond.layout, cond.grip, cond.temp, cond.attendance].filter(Boolean).map((t) => (
            <span key={t} style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "2px 8px", fontSize: 10, color: C.textMuted }}>{t}</span>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 3 }}>
        {msgs.map((m, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 3 }}>
              <div style={{
                maxWidth: "88%", padding: "9px 13px",
                borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: m.role === "user" ? C.userBubble : C.botBubble,
                border: m.role === "bot" ? `1px solid ${C.botBorder}` : "none",
                fontSize: 14, lineHeight: 1.5, color: C.text, whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                {m.text.split(/(\*\*.*?\*\*)/).map((p, j) =>
                  p.startsWith("**") && p.endsWith("**")
                    ? <strong key={j} style={{ color: C.white, fontWeight: 600 }}>{p.slice(2, -2)}</strong>
                    : <span key={j}>{p}</span>
                )}
              </div>
            </div>
            {m.role === "bot" && m.extra === "setup" && <SetupViewer setup={setup} diffs={diffs} />}
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 3 }}>
            <div style={{ padding: "10px 16px", borderRadius: "14px 14px 14px 4px", background: C.botBubble, border: `1px solid ${C.botBorder}` }}><Dots /></div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick replies */}
      {qr.length > 0 && (
        <div style={{ padding: "6px 14px", display: "flex", gap: 5, flexWrap: "wrap", flexShrink: 0, maxHeight: 180, overflowY: "auto" }}>
          {qr.map((r) => {
            const isRes = ["Better","A little better","About the same","Worse","Much worse"].includes(r);
            const rc = isRes ? (r.includes("etter") ? C.green : r.includes("orse") ? C.red : C.yellow) : null;
            return (
              <button key={r} onClick={() => handle(r)} style={{
                padding: "7px 13px", background: rc ? rc + "12" : C.qr,
                border: `1px solid ${rc ? rc + "40" : C.qrBorder}`, borderRadius: 18,
                color: rc || C.accent, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                whiteSpace: "nowrap", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = rc ? rc + "25" : C.qrActive; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = rc ? rc + "12" : C.qr; }}
              >{r}</button>
            );
          })}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}`, background: C.chatBg, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            placeholder={phase === "done" ? "Session complete" : "Type here..."}
            disabled={phase === "done"}
            style={{ flex: 1, padding: "11px 16px", background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: 24, color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none" }}
            onFocus={(e) => { e.target.style.borderColor = C.accent; }}
            onBlur={(e) => { e.target.style.borderColor = C.inputBorder; }}
          />
          <button onClick={handleSend} disabled={!input.trim() || phase === "done"} style={{
            width: 40, height: 40, borderRadius: "50%", background: input.trim() ? C.accent : C.inputBg,
            border: `1px solid ${input.trim() ? C.accent : C.inputBorder}`, color: C.white, fontSize: 17,
            cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>↑</button>
        </div>
      </div>
    </div>
  );
}
