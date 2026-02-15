// B7 Kit Baseline — all 90 fields
export const KIT = {
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
  bs_rear_top:"1mm",bs_rear_bottom:"2mm",camber_link_spacing:"2mm",
  hub_spacing:"Mid",arm_spacing:"Mid",front_wheel_hex:"6.5mm",rear_wheel_hex:"5mm",
  diff_type:"Gear Diff",slipper_type:"HD",pinion:"",spur:"",
  front_tires:"",front_compound:"",rear_tires:"",rear_compound:"",
};

export const LABELS = {
  front_springs:"Front Springs",front_shock_oil:"Front Shock Oil",rear_springs:"Rear Springs",
  rear_shock_oil:"Rear Shock Oil",diff_fluid:"Diff Fluid",front_ride_height:"Front Ride Height",
  rear_ride_height:"Rear Ride Height",kick_up:"Kick-Up",battery_position:"Battery Position",
  wing_angle:"Wing Angle",front_arb:"Front ARB",rear_arb:"Rear ARB",front_camber:"Front Camber",
  rear_camber:"Rear Camber",front_toe:"Front Toe",front_piston:"Front Piston",rear_piston:"Rear Piston",
  caster_insert:"Caster Insert",kpi:"KPI",rear_axle_height:"Rear Axle Height",
  front_axle_height:"Front Axle Height",front_eyelet:"Front Eyelet",rear_eyelet:"Rear Eyelet",
  front_cup_offset:"Front Cup Offset",rear_cup_offset:"Rear Cup Offset",front_stroke:"Front Stroke",
  rear_stroke:"Rear Stroke",steering_plate:"Steering Plate",bellcrank:"Bellcrank",
  diff_height:"Diff Height",hub_spacing:"Hub Spacing",arm_spacing:"Arm Spacing",
  front_wheel_hex:"Front Hex",rear_wheel_hex:"Rear Hex",diff_type:"Diff Type",
  front_piston_thickness:"Front Piston Thickness",rear_piston_thickness:"Rear Piston Thickness",
  front_limiter_in:"Front Limiter In",front_limiter_out:"Front Limiter Out",
  rear_limiter_in:"Rear Limiter In",rear_limiter_out:"Rear Limiter Out",bump_steer:"Bump Steer",
  bs_front_left_top:"BS Front Left Top",bs_front_right_1:"BS Front Right Top",
  bs_rear_top:"BS Rear Top",bs_rear_bottom:"BS Rear Bottom",camber_link_spacing:"Camber Link Spacing",
  front_arm_type:"Front Arms",rear_arm_type:"Rear Arms",hub_type:"Hub Type",drive_shaft:"Drive Shaft",
  slipper_type:"Slipper",pinion:"Pinion",spur:"Spur",
  front_tires:"Front Tires",front_compound:"Front Compound",rear_tires:"Rear Tires",
  rear_compound:"Rear Compound",
};

export const SECTIONS = {
  "Front Susp":["front_springs","front_shock_oil","front_ride_height","kick_up","front_arb","front_camber","front_toe","caster_insert","kpi","front_piston","front_stroke","front_eyelet","front_cup_offset","front_axle_height","front_wheel_hex"],
  "Rear Susp":["rear_springs","rear_shock_oil","rear_ride_height","rear_arb","rear_camber","rear_piston","rear_stroke","rear_eyelet","rear_cup_offset","rear_axle_height","rear_wheel_hex","hub_spacing","arm_spacing"],
  "Drivetrain":["diff_type","diff_fluid","diff_height","battery_position","slipper_type","pinion","spur"],
  "Body":["wing_angle"],
};

export const SYMPTOMS = [
  "No steering at all","Loose on corner exit","Pushes on entry","Pushes on exit",
  "Loose on corner entry","Snappy / unpredictable","Lazy / slow to respond",
  "Traction rolling","Feels good but slow"
];
