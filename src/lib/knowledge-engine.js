// RC Vehicle Dynamics Knowledge Engine
// This is the "brain" — the deep understanding layer that makes the AI
// actually think like an experienced racer, not just repeat definitions.

export const KNOWLEDGE_ENGINE = `

## VEHICLE DYNAMICS FUNDAMENTALS

### Weight Transfer — The Foundation of Everything
Every setup change ultimately affects HOW, WHEN, and HOW FAST weight transfers between tires.
A car has 4 contact patches. At any moment, load distribution across those 4 patches determines grip.
In a corner: load shifts to outside tires. Under braking: load shifts to front. Under throttle: load shifts to rear.
The RATE of weight transfer matters as much as the amount. Fast transfer = responsive but snappy. Slow transfer = forgiving but lazy.

CRITICAL CONCEPT: Springs, shocks, anti-roll bars, and geometry ALL control weight transfer rate. They are not independent — they form a system. Changing one shifts the balance of the others.

### The Two Types of Grip
1. MECHANICAL GRIP — comes from suspension geometry. Camber gain, roll center, anti-squat, caster. Built into the car's bones. Works the same regardless of tire compound or surface.
2. TIRE GRIP — comes from rubber compound, tread pattern, surface interaction. Temperature dependent. Wears out. Surface dependent.

Low-grip tracks demand more mechanical grip because tire grip is limited. This is why geometry changes (kick-up, caster, roll center) matter more at Beaver than at Ed's.
High-grip tracks can rely more on tire grip, so you tune for balance and consistency rather than max grip generation.

### Slip Angle — Why Cars Turn
Tires don't turn on a dime. They deform and slip slightly. The angle between where the tire points and where it actually goes = slip angle.
- Small slip angle (1-3°) = tire is building grip, car feels planted
- Peak slip angle (4-6°) = maximum grip, car is at the edge
- Excessive slip angle (7°+) = tire is sliding, grip is falling off

The ENTIRE car is a system designed to manage slip angles across all 4 tires. Every setup change affects slip angle somewhere.

## SUSPENSION GEOMETRY — THE SKELETON

### Roll Center Height
WHAT IT IS: An imaginary point the chassis pivots around during cornering. Determined by the intersection of lines drawn through inner and outer suspension pickup points (ball studs).

PHYSICS: Roll center height determines the LEVERAGE the chassis has on the suspension.
- HIGH roll center = less leverage = less body roll = faster weight transfer = more responsive
- LOW roll center = more leverage = more body roll = slower weight transfer = more forgiving

The roll center is NOT a fixed point — it moves as the suspension compresses and extends. This means the car's handling characteristics CHANGE through the suspension travel.

FRONT vs REAR: You have separate front and rear roll centers. Their RELATIVE heights matter:
- Front higher than rear = more front weight transfer = more steering
- Rear higher than front = more rear weight transfer = more rear traction
- Both high = aggressive, snappy, responsive — can traction roll on high grip
- Both low = forgiving, progressive, predictable — can feel lazy

ADJUSTMENT: Ball stud spacers. Every 1mm spacer moves the roll center noticeably. This is NOT an exaggeration — 1mm at 1/10 scale = 10mm at full scale. These are the most sensitive adjustments on the car.

INTERACTION WITH SPRINGS: High roll center with soft springs = contradiction. The geometry wants fast weight transfer but the springs slow it down. This creates an unpredictable transition where the car initially responds quickly then goes mushy. Match your roll center aggression to your spring rate.

INTERACTION WITH SHOCKS: Same logic. High roll center needs adequate damping (heavier oil) to control the fast weight transfer it creates. If you run high roll center with light oil, the car will oscillate.

### Anti-Squat Geometry
WHAT IT IS: The angle of the rear suspension links relative to the chassis. Creates a force that resists rear compression under acceleration.

PHYSICS: When you hit the throttle, the motor torque tries to compress the rear. Anti-squat geometry creates a counteracting force through the link angles that partially cancels this compression.
- MORE anti-squat = rear stays flatter under power = more consistent rear tire loading = better forward bite
- LESS anti-squat = rear compresses more = weight shifts onto rear tires more = more planted but less responsive

THE TRADEOFF: Anti-squat makes the car faster off corners but can make it nervous over bumps while accelerating. The suspension can't absorb bumps as freely because the geometry is fighting compression.

ADJUSTMENT ON B7: Rear axle height and diff height control the link angles. Lowering the rear axle = less anti-squat. Raising diff height = more anti-squat.

INTERACTION WITH DIFF: Anti-squat and diff fluid work together for rear traction. If you have high anti-squat AND heavy diff fluid, you've doubled up on rear traction — might push. If you have low anti-squat AND light diff, you've removed rear traction twice — might be loose.

### Anti-Dive Geometry
WHAT IT IS: Front version of anti-squat. Controls how much the front compresses under braking/deceleration.

PHYSICS: Under braking, weight shifts forward. Anti-dive geometry partially cancels front compression.
- MORE anti-dive = front stays flatter under braking = more stable = but less front tire loading = less steering
- LESS anti-dive = front dives more = more weight on front tires = more steering on entry

### Caster (Trail)
WHAT IT IS: The backward tilt of the steering axis. Creates "trail" — the distance between where the steering axis intersects the ground and the tire's contact patch center.

PHYSICS: Trail creates a self-centering moment. The tire contact patch follows behind the steering axis (like a shopping cart caster wheel). This creates:
- Stability — the wheel naturally wants to go straight
- Camber gain through steering — as the wheel turns, caster tilts the tire into the corner (adds negative camber to outside wheel)
- Mechanical trail — creates steering feel/feedback

MORE CASTER (+5): Heavier self-centering, more high-speed stability, more camber gain through turns. Can feel sluggish at low speed because the self-centering force fights your steering input.
LESS CASTER (0): Lighter, quicker turn-in, less camber gain. More responsive at low speed but can feel darty at high speed.

LOW GRIP STRATEGY: Less caster often works better on low grip because you need quick, light steering response. The track doesn't provide enough grip to fight against heavy self-centering.

### Kick-Up Angle
WHAT IT IS: The forward/backward tilt of the front hinge pin that the front arms pivot on.

PHYSICS: Changes how much camber the front wheels gain as the suspension compresses AND as the wheels turn.
- POSITIVE kick-up: Wheels gain negative camber as they steer. This is MECHANICAL steering — grip created by geometry, not by tire compound.
- The camber gain is progressive — more steering angle = more camber gain. This means the car gets MORE front grip the harder you turn.

WHY IT'S THE #1 LOW-GRIP FIX: On low-grip carpet, tires alone can't generate enough front grip. Kick-up creates front grip through geometry that works regardless of surface grip level. It's "free" steering.

TRADEOFF: Positive kick-up slightly destabilizes the car in a straight line because the front wheels gain camber over bumps. On a smooth, high-grip surface, you don't need it and it just adds instability.

B7 OPTIONS: -2.5°, 0° (kit), +2.5°. At Beaver (low grip), +2.5° is almost universal among fast drivers.

### KPI (King Pin Inclination)
WHAT IT IS: The inward tilt of the steering axis when viewed from the front.

PHYSICS: KPI determines scrub radius — the distance between where the steering axis meets the ground and the center of the tire contact patch.
- MORE KPI = less scrub radius = steering feels lighter, more direct, less tire scrub in turns
- LESS KPI = more scrub radius = steering feels heavier, more feedback from the tire

KPI also creates camber change through steering — the tire leans as it turns. This interacts with caster-induced camber gain.

### Ackermann (Steering Geometry)
WHAT IT IS: How much MORE the inside wheel turns compared to the outside wheel in a corner.

PHYSICS: In a corner, the inside wheel traces a tighter radius than the outside wheel. Ackermann makes the inside wheel turn more to match this geometry.
- MORE Ackermann = inside tire turns much more = more initial bite on turn-in, but inside tire scrubs at speed
- LESS Ackermann = both tires turn similar amounts = smoother, more consistent through sweepers, less aggressive turn-in

TRACK DEPENDENT: Tight, technical tracks with lots of hairpins = more Ackermann helps. Flowing tracks with fast sweepers = less Ackermann preferred.

## DAMPING — THE NERVOUS SYSTEM

### Shock Oil (Viscosity)
WHAT IT IS: Controls how fast the suspension moves. Heavier oil = more resistance = slower movement.

PHYSICS: Oil creates a velocity-dependent damping force. The faster the suspension moves, the more the oil resists. This is different from springs (which create a position-dependent force).

CRITICAL ROLE: Damping controls the TRANSITION — how quickly the car goes from one state to another. Springs determine WHERE the car settles; shocks determine HOW FAST it gets there.

FRONT OIL EFFECTS:
- Heavier = slower weight transfer to front under braking = less initial steering = more stable on entry
- Lighter = faster weight transfer to front = more steering on entry = can feel nervous

REAR OIL EFFECTS:
- Heavier = slower weight transfer off rear under braking AND slower weight transfer to rear under throttle = more consistent rear = less snappy
- Lighter = faster rear response = more rotation but can get unpredictable

THE MATCHING RULE: Shock oil should match the speed of your geometry and springs. Aggressive geometry (high roll center, lots of caster) needs adequate damping to control it. Soft springs with heavy oil = overdamped (sluggish). Stiff springs with light oil = underdamped (bouncy).

### Shock Pistons
WHAT IT IS: Discs inside the shock with holes. Oil passes through the holes as the shock moves.

PHYSICS: Piston hole size and count determine the damping CURVE — how resistance changes with speed.
- MORE holes / BIGGER holes = less resistance = softer = shock moves more freely
- FEWER holes / SMALLER holes = more resistance = firmer = shock moves more slowly

ADVANCED: The number of holes affects low-speed damping more than high-speed. Hole SIZE affects both. This means you can tune low-speed vs high-speed damping by changing piston configuration.

For carpet racing (relatively smooth), low-speed damping matters most because the suspension movements are small and controlled. Bumpy surfaces need more attention to high-speed damping.

### Springs
WHAT IT IS: Support the car's weight and control how much the suspension compresses under load.

PHYSICS: Spring rate determines:
1. RIDE HEIGHT (at rest) — stiffer springs = higher ride
2. BODY ROLL (in corners) — stiffer springs = less roll
3. WEIGHT TRANSFER RATE — stiffer springs = faster weight transfer (because the chassis resists rolling and transfers force through the spring more directly)
4. BUMP ABSORPTION — softer springs = better bump compliance

FRONT SPRINGS AND STEERING:
- Softer front = more front weight transfer = more steering, but slower return to center
- Stiffer front = less body roll = quicker transitions left-right, but less peak grip

REAR SPRINGS AND TRACTION:
- Softer rear = more rear weight transfer = more traction, but can feel sloppy
- Stiffer rear = less body roll = more consistent, but can break traction suddenly

THE SPLIT: Front:rear spring ratio affects balance. If front is much softer than rear, the car will have a lot of steering. If rear is much softer, the car will have a lot of rear traction.

### Anti-Roll Bars
WHAT IT IS: A wire connecting left and right suspension. Resists body roll without affecting bump absorption.

PHYSICS: ARBs ONLY work when the suspension compresses asymmetrically (one side more than the other = body roll). They don't affect straight-ahead bumps because both sides move together.
- THICKER ARB = more roll resistance = faster weight transfer TO THAT END
- Front ARB adds front weight transfer = MORE STEERING
- Rear ARB adds rear weight transfer = MORE REAR TRACTION (or less steering, depending on perspective)

CRITICAL NUANCE: ARBs reduce independent wheel action. If one side hits a bump in a corner, the ARB transmits some of that disturbance to the other side. This is why thick ARBs can feel nervous on bumpy tracks.

## DRIVETRAIN — THE POWER DELIVERY

### Differential Fluid
WHAT IT IS: Silicone fluid inside the gear diff. Controls how much the left and right wheels can spin at different speeds.

PHYSICS: In a corner, the outside wheel needs to turn faster than the inside wheel. The diff allows this by letting fluid shear between the gears.
- HEAVIER FLUID = more resistance to speed difference = more "locked" behavior
  - Under power in a turn, the inside tire drives harder = more forward drive = car tends to push
  - Off power, the locked diff slows both wheels together = car is more stable
  - More predictable and easier to drive consistently
- LIGHTER FLUID = more speed difference allowed = more "open" behavior
  - Inside tire can spin freely in turns = car rotates more
  - Less forward drive out of corners
  - Can feel unpredictable if too light

THE SWEET SPOT: Most carpet racers end up between 30k-80k. The right weight depends on driving style, track layout, and power level.
- Tight track with lots of hairpins = lighter diff helps rotation
- Fast track with long sweepers = heavier diff helps consistency
- Aggressive driver who over-drives = heavier diff calms the car
- Smooth driver who under-drives = lighter diff adds rotation

INTERACTION WITH REAR SPRINGS: Heavy diff + soft rear springs = lots of rear mechanical grip. This combo is stable but can push in corners. Heavy diff + stiff rear springs = aggressive rear end that hooks and goes. Light diff + soft springs = loose rear that rotates a lot.

### Slipper Clutch
WHAT IT IS: Between the motor and the drivetrain. Slips under high torque to smooth power delivery.

PHYSICS: The slipper absorbs torque spikes from the motor. When you punch the throttle, instead of all that torque hitting the rear tires instantly, the slipper absorbs the initial spike and delivers power progressively.
- TIGHT/ELIMINATED = direct power, all motor torque goes to wheels immediately. Can cause wheelspin on low grip.
- LOOSE = smoother power delivery, protects drivetrain, helps traction. Can feel laggy.

### Battery Position
WHAT IT IS: The heaviest single component in the car. Its position directly shifts the center of gravity.

PHYSICS: The CG location determines the STATIC weight distribution. Moving the battery:
- FORWARD = more weight on front tires = more front grip = more steering
- REARWARD = more weight on rear tires = more rear traction

This is the most direct way to change the car's front-to-rear balance. Every other change affects balance indirectly through geometry and dynamics. Battery position changes it by literally moving mass.

LOW GRIP STRATEGY: Forward battery is common because you need every bit of front grip available. The trade-off is less rear traction, but you compensate with diff fluid and rear geometry.

## AERO — SPEED-DEPENDENT GRIP

### Wing
PHYSICS: The wing generates downforce at speed. This force pushes the car into the track surface, increasing tire loading and therefore grip. But it also creates drag.
- MORE WING = more grip at speed = slower top speed = more consistent through fast sections
- LESS WING = less drag = higher top speed = less grip at speed

SPEED DEPENDENT: Wing effects are proportional to speed squared. At low speed (tight corners), the wing does almost nothing. At high speed (long straight, fast sweeper), it matters enormously.

SMALL TRACK NOTE: On a tight carpet track like Beaver, cars never reach high enough speeds for the wing to generate meaningful downforce. Many racers run minimal or no wing angle. The drag reduction actually helps lap times more than the theoretical downforce.

## INTERACTION MATRIX — HOW CHANGES CONNECT

### The Steering System
These all affect front grip/steering: front springs, front oil, front ARB, caster, kick-up, KPI, Ackermann, battery position, front ride height, front roll center (ball studs)
IMPORTANT: If you change one steering element, assess whether the total system is still balanced. Adding kick-up AND softening front springs AND moving battery forward could give you WAY too much steering.

### The Traction System  
These all affect rear grip/traction: rear springs, rear oil, rear ARB, anti-squat, diff fluid, rear roll center (ball studs), rear ride height
SAME RULE: Doubling up on traction changes can make the car push.

### The Stability System
These affect overall car stability: caster, shock oil (both), ride height, wing angle, droop
More stability = easier to drive but potentially slower. Less stability = potentially faster but easier to crash.

### The Response System
These affect how quickly the car changes direction: spring rates (both), ARBs (both), roll center heights, shock oil weight
Faster response = better for technical tracks. Slower response = better for consistency and easier to drive.

## TRACK-SPECIFIC KNOWLEDGE

### Low-Grip Carpet (like Beaver RC — old grey Ozite)
CHARACTERISTICS: Low traction, slippery, layout changes frequently, bumps develop
GENERAL APPROACH:
- Maximize mechanical grip (kick-up, geometry over tires)
- Softer springs to let tires work
- Lighter shock oils for quicker response
- Forward battery for front grip
- Medium diff (too light = unpredictable, too heavy = pushes)
- Less wing (speeds are low, drag hurts)
- Lower roll centers for forgiveness
COMMON MISTAKE: Running a high-grip setup on low-grip carpet. Stiff springs, heavy oils, high roll center — this makes the car feel like it's on ice.

### High-Grip Carpet (like Ed's — black CRC)
CHARACTERISTICS: High traction, consistent, grip builds through the day
GENERAL APPROACH:
- Less mechanical steering needed (reduce kick-up, less aggressive geometry)
- Stiffer springs for quicker transitions
- Heavier shock oils to control the extra grip
- Battery more centered
- Heavier diff for consistency
- More wing angle (speeds are higher, downforce helps)
- Higher roll centers (the grip can handle the faster weight transfer)
COMMON MISTAKE: Not enough damping. The high grip generates big forces that need adequate shock oil to control. Light oil on high grip = bouncy, unpredictable.

## DIAGNOSTIC FRAMEWORK — WHAT THE CAR IS TELLING YOU

### "The car pushes / understeers"
MEANS: Front tires reach grip limit before rear tires. Car goes wide in corners.
DIAGNOSE WHEN: Entry? Mid-corner? Exit? Each has different causes.
- Entry push: Usually front weight transfer issue. Lighter front oil, softer front springs, more caster, more kick-up.
- Mid-corner push: Balance issue. More front grip OR less rear grip needed. ARBs, roll center, battery position.
- Exit push: Usually diff too heavy, or rear is squatting too much. Lighter diff, more anti-squat.

### "The car is loose / oversteers"
MEANS: Rear tires reach grip limit before front. Car rotates too much.
DIAGNOSE WHEN: Entry? Mid? Exit?
- Entry loose: Rear isn't loaded enough on turn-in. Stiffer front (transfers weight to rear on entry), or heavier rear oil.
- Mid-corner loose: Need more rear mechanical grip. Rear ARB, rear roll center, diff fluid.
- Exit loose: Diff too light, not enough anti-squat, or too much throttle too soon.

### "The car is traction rolling"
MEANS: Car flips over in corners from too much grip.
CAUSE: Roll center too high, springs too stiff, too much overall grip for the weight transfer rate.
FIX: Lower roll centers, softer springs, lighter ARBs. Reduce the RATE of weight transfer.

### "The car is nervous / unpredictable"
MEANS: Car behavior changes randomly, hard to place consistently.
COMMON CAUSES:
1. Damping doesn't match geometry (heavy geometry, light oil)
2. Roll center too high for the spring rate
3. Tires worn or inconsistent
4. ARBs too thick for the surface roughness

### "The car is lazy / slow to respond"
MEANS: Car takes too long to change direction, feels like driving a boat.
COMMON CAUSES:
1. Springs too soft for the grip level
2. Oil too heavy
3. Roll centers too low
4. Too much droop (weight transfers too slowly)

## COACHING PRINCIPLES

1. ONE CHANGE AT A TIME — Never change two things simultaneously. You can't learn what worked.
2. LOW-IMPACT FIRST — Start with changes that are easy to reverse and have moderate effect. Save aggressive geometry changes for when you understand the car.
3. DIAGNOSE BEFORE PRESCRIBING — Understand WHAT the car is doing before deciding WHAT to change. "It doesn't steer" is not enough — WHERE doesn't it steer?
4. MATCH YOUR SYSTEMS — Springs, oils, geometry, and tires should all be working toward the same goal. Don't fight yourself with contradictory changes.
5. REFERENCE VALUES — Always tell the driver their current setting AND what you're changing to. "Front oil from 35wt to 30wt" not just "lighter front oil."
6. ROLL BACK IF WORSE — If a change makes it worse, go back. Don't stack another change on top of a bad one.
7. THE CAR IS ALWAYS RIGHT — If the driver says it pushes, it pushes. Don't argue with feel. Diagnose and adjust.
8. ENVIRONMENT MATTERS — Temperature, humidity, tire wear, track rubber buildup all change grip throughout the day. A setup that works in practice might not work in the main.

`;

export default KNOWLEDGE_ENGINE;
