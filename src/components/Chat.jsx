import { useState, useRef, useEffect } from "react";
import KNOWLEDGE_ENGINE from "../lib/knowledge-engine.js";
import { db, getDeviceProfileId, setDeviceProfileId } from "../lib/db.js";

const C = {
  bg: "#07080c", chatBg: "#0c0d12", userBubble: "#1a3a6e", botBubble: "#161720",
  botBorder: "#252630", accent: "#3b82f6", green: "#22c55e",
  greenSoft: "#22c55e18", yellow: "#eab308", red: "#ef4444",
  text: "#e2e2e8", textDim: "#8b8b9e", textMuted: "#55556a", white: "#fff",
  border: "#1e1f2a", inputBg: "#111218", inputBorder: "#2a2b38",
  navBg: "#0a0b10", navBorder: "#1a1b25", navActive: "#3b82f6",
};

const B7_KIT = {
  front_springs:"Orange",front_shock_oil:"35wt",rear_springs:"Gray",rear_shock_oil:"30wt",
  diff_fluid:"30k",front_ride_height:"13mm",rear_ride_height:"13mm",kick_up:"0deg",
  battery_position:"3",wing_angle:"6deg",front_arb:"1.0mm",rear_arb:"1.2mm",
  front_camber:"-1deg",rear_camber:"-1deg",front_toe:"0deg",front_piston:"2x1.6",
  rear_piston:"2x1.9",caster_insert:"+2.5",kpi:"2",rear_axle_height:"+2",
  front_axle_height:"+3",front_eyelet:"0",rear_eyelet:"+2",front_cup_offset:"+5",
  rear_cup_offset:"0",front_stroke:"23.5mm",rear_stroke:"27.5mm",
  steering_plate:"+1",bellcrank:"Up",diff_height:"2",diff_type:"Gear Diff",
  slipper_type:"HD",hub_spacing:"Mid",arm_spacing:"Mid",
  front_wheel_hex:"6.5mm",rear_wheel_hex:"5mm",
};

const LBL = {
  front_springs:"Front Springs",front_shock_oil:"Front Oil",rear_springs:"Rear Springs",
  rear_shock_oil:"Rear Oil",diff_fluid:"Diff Fluid",front_ride_height:"Front Ride Height",
  rear_ride_height:"Rear Ride Height",kick_up:"Kick-Up",battery_position:"Battery Pos",
  wing_angle:"Wing Angle",front_arb:"Front ARB",rear_arb:"Rear ARB",front_camber:"Front Camber",
  rear_camber:"Rear Camber",front_toe:"Front Toe",front_piston:"Front Piston",rear_piston:"Rear Piston",
  caster_insert:"Caster",kpi:"KPI",rear_axle_height:"Rear Axle Height",
  front_axle_height:"Front Axle Height",front_eyelet:"Front Eyelet",rear_eyelet:"Rear Eyelet",
  front_cup_offset:"Front Cup Offset",rear_cup_offset:"Rear Cup Offset",
  front_stroke:"Front Stroke",rear_stroke:"Rear Stroke",steering_plate:"Steering Plate",
  bellcrank:"Bellcrank",diff_height:"Diff Height",diff_type:"Diff Type",
  slipper_type:"Slipper",hub_spacing:"Hub Spacing",arm_spacing:"Arm Spacing",
  front_wheel_hex:"Front Hex",rear_wheel_hex:"Rear Hex",
};

function buildSys(prof, setup, sessions, allTrackSetups, approvedCorrections) {
  const sStr = setup ? Object.entries(setup).filter(([,v])=>v&&v!=="unknown").map(([k,v])=>`${LBL[k]||k}: ${v}${B7_KIT[k]&&v!==B7_KIT[k]?` (kit: ${B7_KIT[k]})`:""}`).join("\n") : "No setup loaded.";
  const pStr = prof ? `Name: ${prof.name||"?"}, Car: ${prof.car||"?"}, Location: ${prof.location||"?"}, Track: ${prof.track||"?"}, Experience: ${prof.experience||"?"}, Goals: ${prof.goals||"?"}, Class: ${prof.racingClass||"?"}, Setup source: ${prof.setupSource||"?"}` : "No profile — first-time user.";
  
  // Build rich session history
  let hStr = "None yet.";
  if(sessions?.length){
    hStr = sessions.slice(-10).map(s=>{
      let entry = `[${s.date}]`;
      if(s.track) entry += ` at ${s.track}`;
      if(s.notes) entry += ` — ${s.notes}`;
      if(s.changes && s.changes.length) entry += ` | Changes: ${JSON.stringify(s.changes)}`;
      if(s.starting_setup && s.ending_setup) entry += ` | Setup went from ${JSON.stringify(s.starting_setup)} to ${JSON.stringify(s.ending_setup)}`;
      return entry;
    }).join("\n");
  }

  // Build track intelligence from other drivers (future)
  let trackStr = "No other driver data available yet.";
  if(allTrackSetups?.length){
    trackStr = `${allTrackSetups.length} setups from other drivers at this track:\n` + 
      allTrackSetups.map(s=>`- ${s.brand} ${s.model}: ${JSON.stringify(s.setup)}`).join("\n");
  }

  // Build verified corrections from experienced drivers
  let corrStr = "None yet.";
  if(approvedCorrections?.length){
    corrStr = approvedCorrections.map(c=>`- ${c.topic}: ${c.correction} (from ${c.driver_name||"experienced driver"}${c.reasoning?`, reason: ${c.reasoning}`:""})`).join("\n");
  }

  return `You are Race Mode Engine, an AI pit crew chief for 1/10 scale RC racing. You are an expert on all major platforms: Team Associated (B7, B84, T7), TLR (22X-4, 22 5.0), Yokomo (YZ-2 DTM, CAL), Schumacher, XRAY, Kyosho, and others.

PERSONALITY: Patient, encouraging, knowledgeable. Talk like a friendly expert — not a textbook, not a chatbot. Adjust your language to the person. If they're a beginner, use plain English — no jargon without explanation. If they're advanced, get technical. The goal is that ANYONE can use this app — even someone who has never touched an RC car.

CRITICAL RULES:
- Never guess or suggest what car someone has. Always ask.
- Never assume track location. Always ask.
- One question at a time during onboarding. Don't stack multiple questions.
- Keep responses SHORT. 1-3 sentences during onboarding. 2-5 sentences during coaching. Longer only when teaching a concept.
- If someone uses non-technical language ("my car won't turn", "it feels weird", "it's bouncy"), that's perfectly valid. Translate it into diagnostics yourself — don't make them learn your vocabulary.
- When you mention a setting, briefly say what it does in parentheses if the user is a beginner. Example: "Your front shock oil (controls how fast the suspension moves) is at 35wt."
- Never make someone feel dumb for not knowing something.

TRUST & ACCURACY — THE #1 PRIORITY:
The moment this app says something wrong, the user loses trust forever. These rules are non-negotiable:

1. NEVER HALLUCINATE SETTINGS. If you don't know a value, say "I don't have that info." Never fill in a guess. Mark it unknown.
2. NEVER CLAIM CERTAINTY YOU DON'T HAVE. Use "typically", "in most cases", "I'd suggest trying" — not "this will fix it" or "you need to do this."
3. NEVER INVENT PART NUMBERS, SPRING COLORS, OR SPECIFICATIONS. If you're not 100% sure of a car's kit spec, say "I'd need to verify that — can you check your manual?"
4. NEVER CLAIM TO SEE THINGS IN PHOTOS THAT AREN'T VISIBLE. Pistons, shock oil, diff fluid, eyelets, cup offsets, slipper settings — these are INSIDE sealed components and cannot be identified from a photo. If you can't see it without disassembly, don't claim to identify it.
5. ALWAYS REFERENCE THE USER'S ACTUAL SETUP VALUES. Don't say "soften your springs." Say "Your front springs are Red — try Orange, which is one step softer."
6. IF UNSURE, ASK. "I want to make sure I'm giving you the right advice — can you tell me [specific thing]?" is always better than guessing.
7. NEVER RECOMMEND CHANGES TO SETTINGS YOU DON'T KNOW. If front springs are marked unknown, don't say "soften your front springs." Say "I don't know what front springs you're running — can you check? They're the colored coils on your front shocks."
8. DISTINGUISH BETWEEN FACT AND OPINION. Kit specs are facts. "This usually helps on low grip" is experience-based advice. "This will definitely fix your car" is a claim you cannot make.
9. ONE CHANGE AT A TIME. Never recommend multiple changes. If two changes are needed, do the first one, test it, THEN consider the second.
10. WHEN IN DOUBT, SAY SO. "I'm not sure about that specific car — let me know what options your manual shows" is a perfectly good answer. It builds MORE trust than a confident wrong answer.
11. HARDWARE ACCURACY. RC cars use hex hardware (1.5mm, 2mm, 2.5mm hex drivers), NOT Phillips screwdrivers. Never reference Phillips, flathead, or other non-RC tools. Turnbuckle wrenches, wheel nuts, nut drivers — know the actual tools racers use. Getting basic tool references wrong destroys credibility instantly.
12. CAR-SPECIFIC ACCURACY. Only reference settings, parts, and options that ACTUALLY EXIST on the driver's specific car. For the B7: springs are White/Silver/Orange(kit)/Red/Blue — no other colors. Kick-up is -2.5°, 0°(kit), +2.5° — no other values. Caster inserts are 0, +2.5(kit), +5 — no other values. If you're not 100% sure a specific option exists on their car, say so. Never invent part options.
13. SURFACE CONTEXT. This app is primarily for carpet/indoor racing. Don't give dirt/outdoor advice unless the driver specifically says they race on dirt. Tire recommendations, setup philosophy, and geometry advice differ MASSIVELY between carpet and dirt. Beaver RC and Ed's are both indoor carpet tracks.

ROLES:
1. COACH: Race night tuning. One change at a time. Reference actual values. Roll back if worse.
2. SETUP SHEET: Track every setting. Know kit vs changed vs unknown.
3. LOGBOOK: Remember sessions, changes, results.
4. MANUAL: Explain any RC concept in plain language. Cover what MORE does, what LESS does, which settings control it, and how to adjust it on their specific car.
5. TEACHER: Match driver experience level. Beginners get full explanations. Advanced get straight answers.

DRIVER: ${pStr}
SETUP: ${sStr}
KIT BASELINE: ${Object.entries(B7_KIT).map(([k,v])=>`${LBL[k]||k}: ${v}`).join(", ")}

SESSION HISTORY (USE THIS — this is what the driver has tried before):
${hStr}
INSTRUCTIONS FOR SESSION HISTORY:
- If the driver reports a problem they've had before, check session history FIRST
- If a change was already tried and made things worse, DO NOT suggest it again
- If a change worked well in the past, reference it: "Last time you went to 50k diff and it helped"
- Look for PATTERNS: if the driver keeps changing the same setting back and forth, point it out
- Track which direction the setup is moving over time — are they trending softer? stiffer?

TRACK INTELLIGENCE (setups from other drivers at the same track):
${trackStr}
INSTRUCTIONS FOR TRACK INTELLIGENCE:
- If multiple drivers at the same track converge on similar settings, that's a strong signal
- Present patterns as evidence, not commands: "3 out of 5 drivers at Beaver run 50k+ diff"
- Universal settings carry more weight (oils, diff fluid, ride height)
- Brand-specific settings need translation before comparing
- Never copy another driver's setup blindly — use patterns to inform direction

FIRST-TIME ONBOARDING:
If no profile exists, you MUST build one step by step. This is NOT casual conversation — it's structured profile creation. The user needs to complete this before coaching begins.

Step 1: Welcome. "Welcome to Race Mode — your personal RC coach. Let's build your profile so I can give you the best help possible. What's your name?"
Step 2: Location. "Where are you located?" (state/region is fine)
Step 3: Home track. "What's your home track?" (If they name one you know, confirm details like surface type. If unknown, ask about surface.)
Step 4: Car. "What car are you running?" (Accept any brand/model. Do NOT suggest or guess.)
Step 5: How they got it. "Did you build it from the kit, buy it used, or have you been running it a while?"
Step 6: Current setup situation based on their answer:
  - Kit build: "Your kit baseline is loaded. Every setting is at factory spec. We can go through what each section means, or jump straight to prepping for your first race."
  - Used car: "Let's figure out what's on it. We'll go through the car section by section — I'll tell you what to look for. Grab your car and we'll get started."
  - Been running it: "Tell me what you know about your current setup — rattle off whatever you remember and I'll fill in the rest as kit spec."
Step 7: Experience. "How would you rate your setup knowledge? Brand new, know the basics, comfortable tuning, or advanced?"
Step 8: Goals. "What do you want to get out of this app? Learn setup? Get faster? Stop making bad changes on race night? All of the above?"
Step 9: Racing class. "What class do you race? 17.5T stock, 13.5T mod, 21.5T spec, or something else?"
Step 10: Summary. Show them their complete profile and setup status. Offer next steps.

Ask ONE question at a time. Wait for their answer before moving on. Keep each response to 1-3 sentences max during onboarding.

COACHING: ONE change at a time. Reference actual values. If worse, roll back first. After 2 worse results, pause. Low-impact changes first. Diagnose what the car is doing before prescribing changes. You are the expert — don't just take orders.

TRACKS:
- Beaver RC (Beaver, PA) = old grey Ozite, low-medium grip, layout changes frequently
- Ed's Hobby Shop (WV) = black CRC carpet, higher grip
- For unknown tracks, ask about surface type and grip level.

CROSS-PLATFORM INTELLIGENCE:
You support ALL major RC platforms. When a driver tells you their car, adapt your knowledge accordingly.
Universal settings (same across all brands): shock oil weight, diff fluid weight, ride height, camber angle, toe angle, caster angle.
Brand-specific settings (need translation): spring rates/colors, piston sizes, ball stud positions, arm geometry.
When translating setups between platforms, explain WHAT the setting achieves, not just the number.

VERIFIED CORRECTIONS FROM EXPERIENCED DRIVERS (these override your built-in knowledge):
${corrStr}
IMPORTANT: If a correction contradicts your knowledge engine below, the correction wins. Real-world experience from verified drivers outranks textbook knowledge.

${KNOWLEDGE_ENGINE}

TRIBAL KNOWLEDGE & NON-STANDARD PARTS:
Racers do things that aren't in any manual. Cross-compatible parts from other models (B6 arms on a B7), custom modifications, aftermarket parts, shims, spacers from other cars. This is REAL and VALUABLE data.
- If someone mentions a non-standard part or mod, ALWAYS capture it: [SETUP:front_arms=B6.4 front arms] [LOG:Running B6.4 arms on B7 — cross-compatible swap]
- Don't question whether it fits — the driver is running it, so it works
- These mods are often the difference between a good car and a great car
- When multiple drivers report the same non-standard mod, it becomes track intelligence
- Capture WHY they did it if they mention it: "B6 arms give more clearance" or "stiffer flex"

KNOWLEDGE CORRECTIONS FROM EXPERIENCED DRIVERS:
Experienced drivers may correct something you said. This is VALUABLE — it makes the app better for everyone.
When a driver says something like "that's wrong", "that's not how it works", "actually on the B7...", or corrects your advice:
1. ACKNOWLEDGE the correction respectfully: "Thanks for catching that — that's good to know."
2. ASK them to explain: "Can you tell me more about how it actually works?"
3. CAPTURE the correction with a tag: [CORRECTION:topic|what_was_wrong|what_is_correct|reasoning]
4. DO NOT argue or defend your original statement. The driver with hands-on experience outranks your general knowledge.
5. IMMEDIATELY use the corrected info for the rest of this conversation.
6. Thank them: "This kind of feedback makes the app better for everyone."

If you're not sure whether they're right, say so honestly: "I appreciate the correction. I'll flag this so it can be verified."

DATA TAGS (include in response when you learn new info — user wont see these):
[PROFILE:key=value] keys: name, car, track, experience, goals, racingClass, setupSource, location
[SETUP:key=value] keys use underscores: front_springs, diff_fluid, etc. You can create ANY key — the database is flexible. If someone mentions tire compound, use [SETUP:tire_compound=Green Fuzzbites]. If they mention tire sauce, use [SETUP:tire_sauce=SXT 3.0 45min]. Motor timing, gearing, body, wing brand, track temp — anything relevant goes in setup.
[SETUP:key=unknown] mark settings as unknown when not yet determined
[COND:key=value] track/session conditions: track_temp, humidity, grip_level, tire_rule, motor_limit, event_name, layout — any condition that affects setup
[LOG:note text] log important events — setup changes, coaching results, observations
[CORRECTION:topic|original|corrected|reasoning] when a driver corrects something you said. Example: [CORRECTION:anti-squat|rear axle height changes anti-squat|rear axle height changes rear roll center not anti-squat|B7 specific geometry]
Always include relevant tags when conversation reveals new information. The more data you capture, the smarter you get over time.`;
}

async function ask(msgs, sys) {
  const r = await fetch("/api/chat", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system: sys,
      messages: msgs.map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }))
    })
  });
  const d = await r.json();
  if (d.error) throw new Error(JSON.stringify(d));
  return d.content?.map(c => c.text || "").join("\n") || "Something went wrong.";
}

function parse(text) {
  const pu={},su={},cond={},logs=[],corrections=[];let c=text;
  for(const m of text.matchAll(/\[PROFILE:(\w+)=(.+?)\]/g)){pu[m[1]]=m[2];c=c.replace(m[0],"");}
  for(const m of text.matchAll(/\[SETUP:([\w_]+)=(.+?)\]/g)){su[m[1]]=m[2];c=c.replace(m[0],"");}
  for(const m of text.matchAll(/\[COND:([\w_]+)=(.+?)\]/g)){cond[m[1]]=m[2];c=c.replace(m[0],"");}
  for(const m of text.matchAll(/\[CORRECTION:(.+?)\|(.+?)\|(.+?)\|(.+?)\]/g)){corrections.push({topic:m[1],original:m[2],corrected:m[3],reasoning:m[4]});c=c.replace(m[0],"");}
  for(const m of text.matchAll(/\[LOG:(.+?)\]/g)){logs.push(m[1]);c=c.replace(m[0],"");}
  return{c:c.trim(),pu,su,cond,logs,corrections};
}

function Dots(){return(<div style={{display:"flex",gap:4,padding:"8px 0",alignItems:"center"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.textMuted,animation:`tp 1.2s ease-in-out ${i*.15}s infinite`}}/>)}<style>{`@keyframes tp{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}`}</style></div>);}

const SEC={"Front":["front_springs","front_shock_oil","front_ride_height","kick_up","front_arb","front_camber","front_toe","caster_insert","kpi","front_piston","front_stroke","front_eyelet","front_cup_offset","front_axle_height","front_wheel_hex"],"Rear":["rear_springs","rear_shock_oil","rear_ride_height","rear_arb","rear_camber","rear_piston","rear_stroke","rear_eyelet","rear_cup_offset","rear_axle_height","rear_wheel_hex","hub_spacing","arm_spacing"],"Drive":["diff_type","diff_fluid","diff_height","battery_position","slipper_type"],"Aero":["wing_angle","steering_plate","bellcrank"]};

function SetupView({setup}){const[tab,setTab]=useState("Front");if(!setup)return null;return(<div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}><div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>{Object.keys(SEC).map(s=>(<div key={s} onClick={()=>setTab(s)} style={{flex:1,padding:"8px 4px",fontSize:10,textAlign:"center",color:tab===s?C.accent:C.textMuted,borderBottom:`2px solid ${tab===s?C.accent:"transparent"}`,cursor:"pointer"}}>{s}</div>))}</div><div style={{maxHeight:240,overflowY:"auto"}}>{(SEC[tab]||[]).map(k=>{const v=setup[k];if(!v||v==="")return null;const kit=v===B7_KIT[k],unk=v==="unknown";return(<div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 12px",borderBottom:`1px solid ${C.border}22`,borderLeft:unk?`3px solid ${C.yellow}`:!kit?`3px solid ${C.accent}`:"3px solid transparent"}}><span style={{fontSize:11,color:C.textDim}}>{LBL[k]||k}</span><span style={{fontSize:12,fontWeight:kit?400:600,color:unk?C.yellow:kit?C.textDim:C.white}}>{unk?"? check":v}</span></div>);})}</div><div style={{padding:"6px 12px",display:"flex",gap:12,borderTop:`1px solid ${C.border}`}}><div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:3,height:10,background:C.accent,borderRadius:1}}/><span style={{fontSize:9,color:C.textMuted}}>Changed</span></div><div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:3,height:10,background:C.yellow,borderRadius:1}}/><span style={{fontSize:9,color:C.textMuted}}>Unknown</span></div></div></div>);}

export default function App(){
  const[tab,setTab]=useState("chat");
  const[msgs,setMsgs]=useState([]);
  const[input,setInput]=useState("");
  const[busy,setBusy]=useState(false);
  const[prof,setProf]=useState(null);
  const[setup,setSetup]=useState(null);
  const[sessions,setSessions]=useState([]);
  const[profileId,setProfileId]=useState(null);
  const[carId,setCarId]=useState(null);
  const[loading,setLoading]=useState(true);
  const[report,setReport]=useState(null);
  const[reportBusy,setReportBusy]=useState(false);
  const end=useRef(null);
  const saveTimer=useRef(null);
  const inputRef=useRef(null);

  useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"});},[msgs,busy]);

  // Load existing profile from database on startup
  useEffect(()=>{
    (async()=>{
      try{
        const existingId=getDeviceProfileId();
        if(existingId){
          const p=await db.getProfile(existingId);
          if(p){
            setProfileId(p.id);
            setProf({name:p.name,location:p.location,track:p.home_track,experience:p.experience,goals:p.goals,racingClass:p.racing_class});
            // Load their car and setup
            const cars=await db.getCars(p.id);
            if(cars.length){
              setCarId(cars[0].id);
              setSetup(cars[0].setup&&Object.keys(cars[0].setup).length?cars[0].setup:null);
            }
            // Load sessions
            const sess=await db.getSessions(p.id,10);
            if(sess.length)setSessions(sess.map(s=>({date:new Date(s.created_at).toLocaleDateString(),notes:s.notes||""})));
            // Load conversation
            const conv=await db.getConversation(p.id);
            if(conv&&conv.messages&&conv.messages.length){
              setMsgs(conv.messages);
              setLoading(false);
              return;
            }
          }
        }
      }catch(e){console.warn("DB load failed, starting fresh:",e);}
      // No existing profile — start onboarding
      setLoading(false);
      go([{role:"user",text:"I just opened the Race Mode app for the first time. Start the onboarding."}],true);
    })();
  },[]);

  // Save to database after profile/setup/messages change (debounced)
  useEffect(()=>{
    if(!profileId||loading)return;
    clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(async()=>{
      try{
        if(prof)await db.updateProfile(profileId,{name:prof.name,location:prof.location,home_track:prof.track,experience:prof.experience,goals:prof.goals,racing_class:prof.racingClass});
        if(setup&&carId)await db.updateCar(carId,{setup});
        if(msgs.length)await db.saveConversation(profileId,msgs);
      }catch(e){console.warn("DB save failed:",e);}
    },2000); // Save 2s after last change
  },[prof,setup,msgs]);

  const go=async(h,init=false)=>{
    setBusy(true);
    try{
      // Fetch track intelligence — other drivers' setups at the same track
      let trackSetups=null;
      if(prof?.track&&profileId){
        try{
          const allCars=await db.getTrackSetups(prof.track,profileId);
          if(allCars&&allCars.length)trackSetups=allCars;
        }catch(e){}
      }
      // Fetch approved corrections from experienced drivers
      let approvedCorrections=null;
      try{
        const corrs=await db.getApprovedCorrections(20);
        if(corrs&&corrs.length)approvedCorrections=corrs;
      }catch(e){}
      const raw=await ask(h,buildSys(prof,setup,sessions,trackSetups,approvedCorrections));
      const{c,pu,su,cond:condUpdates,logs,corrections}=parse(raw);

      // Save corrections to database
      if(corrections.length&&profileId){
        for(const cor of corrections){
          try{await db.createCorrection({profile_id:profileId,driver_name:prof?.name||"unknown",driver_experience:prof?.experience||"unknown",topic:cor.topic,original_claim:cor.original,correction:cor.corrected,reasoning:cor.reasoning});}catch(e){}
        }
      }
      
      // Handle profile updates
      if(Object.keys(pu).length){
        const newProf={...(prof||{}),...pu};
        setProf(newProf);
        // Create profile in DB if first time
        if(!profileId&&(pu.name||pu.car)){
          try{
            const created=await db.createProfile({name:newProf.name,location:newProf.location,home_track:newProf.track,experience:newProf.experience,goals:newProf.goals,racing_class:newProf.racingClass});
            if(created){
              setProfileId(created.id);
              setDeviceProfileId(created.id);
              // Create car if we know it
              if(newProf.car){
                const brand=newProf.car.includes("TLR")||newProf.car.includes("22")?"TLR":newProf.car.includes("Yokomo")||newProf.car.includes("YZ")?"Yokomo":"Team Associated";
                const car=await db.createCar({profile_id:created.id,brand,model:newProf.car,setup:{...B7_KIT},kit_baseline:{...B7_KIT},setup_source:newProf.setupSource||"kit"});
                if(car)setCarId(car.id);
              }
            }
          }catch(e){console.warn("DB create failed:",e);}
        }
      }
      
      // Handle setup updates  
      if(Object.keys(su).length){
        const newSetup={...(setup||{...B7_KIT}),...su};
        setSetup(newSetup);
      }
      
      if(logs.length){
        const newSessions=logs.map(l=>({date:new Date().toLocaleDateString(),notes:l,track:prof?.track||""}));
        setSessions(p=>[...p,...newSessions]);
        // Save to database
        if(profileId&&carId){
          for(const l of logs){
            try{await db.createSession({profile_id:profileId,car_id:carId,track:prof?.track||"unknown",notes:l,starting_setup:setup||{},ending_setup:{...(setup||{}),...su},changes:Object.entries(su).map(([k,v])=>({setting:k,from:setup?.[k]||"unknown",to:v}))});}catch(e){}
          }
        }
      }
      if(init)setMsgs([{role:"bot",text:c}]);else setMsgs(p=>[...p,{role:"bot",text:c}]);
    }catch(e){
      const err="Error: " + (e.message || "Connection issue. Check internet and try again.");
      if(init)setMsgs([{role:"bot",text:err}]);else setMsgs(p=>[...p,{role:"bot",text:err}]);
    }
    setBusy(false);
    setTimeout(()=>inputRef.current?.focus(),100);
  };

  const send=()=>{if(!input.trim()||busy)return;const t=input.trim();setInput("");const nm=[...msgs,{role:"user",text:t}];setMsgs(nm);go(nm);};

  const resetProfile=async()=>{
    localStorage.removeItem('race_mode_profile_id');
    setProf(null);setSetup(null);setSessions([]);setMsgs([]);setProfileId(null);setCarId(null);setReport(null);
    go([{role:"user",text:"I just opened the Race Mode app for the first time. Start the onboarding."}],true);
  };

  const generateReport=async(sessionData)=>{
    setReportBusy(true);
    try{
      const sys=`You generate race reports for social media sharing. Write a clean, shareable race report based on the session data provided. Format it exactly like this with line breaks:

🏁 RACE REPORT — [TRACK NAME]
[Driver Name] | [Car] | [Class]
[Date]

📊 Results
Qualifying: [position or "N/A"]
Main: [result]
Best Lap: [time or "N/A"]

🔧 Setup Changes
[List key changes made during the session, with before → after values]

📝 Notes
[2-3 sentence summary of how the session went, what worked, what didn't]

${prof?.track?`Track: ${prof.track}`:""}
${prof?.name?`Driver: ${prof.name}`:""}

Keep it concise and hype — this goes on Facebook/Instagram. End with:

Powered by Race Mode Engine 🏁`;

      const userMsg=sessionData||`Generate a race report from my recent session. Here's what I know:
Driver: ${prof?.name||"?"}
Car: ${prof?.car||"?"}
Track: ${prof?.track||"?"}  
Class: ${prof?.racingClass||"?"}
Setup changes: ${sessions.length?sessions.slice(-3).map(s=>s.notes).join("; "):"None logged"}
Current setup highlights: ${setup?Object.entries(setup).filter(([k,v])=>v&&v!==B7_KIT[k]&&v!=="unknown").slice(0,8).map(([k,v])=>`${LBL[k]||k}: ${v}`).join(", "):"Kit spec"}`;

      const r=await fetch("/api/chat",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({system:sys,messages:[{role:"user",content:userMsg}]})
      });
      const d=await r.json();
      if(d.error)throw new Error(JSON.stringify(d));
      const text=d.content?.map(c=>c.text||"").join("\n")||"Couldn't generate report.";
      setReport(text);
    }catch(e){
      setReport("Error generating report. Try again.");
    }
    setReportBusy(false);
  };

  const copyReport=()=>{
    if(!report)return;
    navigator.clipboard.writeText(report).then(()=>{
      alert("Report copied! Paste it on Facebook, Instagram, or anywhere.");
    }).catch(()=>{
      // Fallback for mobile
      const ta=document.createElement("textarea");
      ta.value=report;document.body.appendChild(ta);ta.select();
      document.execCommand("copy");document.body.removeChild(ta);
      alert("Report copied!");
    });
  };

  const shareReport=async()=>{
    if(!report)return;
    if(navigator.share){
      try{await navigator.share({title:"Race Report",text:report});}catch(e){}
    }else{copyReport();}
  };

  if(loading)return(
    <div style={{background:C.bg,height:"100dvh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"-apple-system,'SF Pro Text','Segoe UI',system-ui,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:12}}>🏁</div>
        <div style={{color:C.textDim,fontSize:14}}>Loading your profile...</div>
      </div>
    </div>
  );

  return(
    <div style={{background:C.bg,height:"100dvh",display:"flex",flexDirection:"column",fontFamily:"-apple-system,'SF Pro Text','Segoe UI',system-ui,sans-serif",color:C.text,maxWidth:500,margin:"0 auto"}}>
      <div style={{padding:"12px 16px",background:C.chatBg,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.accent},#1d4ed8)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>🏁</div>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:C.white}}>Race Mode</div><div style={{fontSize:11,color:C.textDim}}>{prof?.name?`${prof.name} · ${prof.car||"B7"}`:"Your AI Pit Crew Chief"}</div></div>
        {prof?.name&&<div style={{width:32,height:32,borderRadius:"50%",background:`${C.accent}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:C.accent,fontWeight:700}}>{prof.name[0].toUpperCase()}</div>}
      </div>

      {tab==="chat"?(<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{flex:1,overflowY:"auto",padding:"14px 14px 8px",display:"flex",flexDirection:"column",gap:6}}>
          {msgs.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"88%",padding:"10px 14px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.role==="user"?C.userBubble:C.botBubble,border:`1px solid ${m.role==="user"?"transparent":C.botBorder}`,fontSize:14,lineHeight:1.55,color:C.text,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{m.text.split(/(\*\*.*?\*\*)/).map((p,j)=>p.startsWith("**")&&p.endsWith("**")?<strong key={j} style={{color:C.white,fontWeight:600}}>{p.slice(2,-2)}</strong>:<span key={j}>{p}</span>)}</div></div>))}
          {busy&&<div style={{display:"flex"}}><div style={{padding:"10px 16px",borderRadius:"16px 16px 16px 4px",background:C.botBubble,border:`1px solid ${C.botBorder}`}}><Dots/></div></div>}
          <div ref={end}/>
        </div>
        <div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`,background:C.chatBg,flexShrink:0}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey)send();}} placeholder={busy?"Thinking...":"Message your pit crew chief..."} disabled={busy} style={{flex:1,padding:"11px 16px",background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:24,color:C.text,fontSize:14,fontFamily:"inherit",outline:"none",opacity:busy?.5:1}} onFocus={e=>{e.target.style.borderColor=C.accent;}} onBlur={e=>{e.target.style.borderColor=C.inputBorder;}}/>
            <button onClick={send} disabled={!input.trim()||busy} style={{width:40,height:40,borderRadius:"50%",background:input.trim()&&!busy?C.accent:C.inputBg,border:`1px solid ${input.trim()&&!busy?C.accent:C.inputBorder}`,color:C.white,fontSize:17,cursor:input.trim()&&!busy?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>↑</button>
          </div>
        </div>
      </div>):tab==="setup"?(<div style={{flex:1,overflowY:"auto",padding:14}}>
        <div style={{fontSize:14,fontWeight:600,color:C.white,marginBottom:10}}>{prof?.name?`${prof.name}'s`:"My"} Setup</div>
        {setup?<SetupView setup={setup}/>:<div style={{textAlign:"center",padding:40,color:C.textMuted,fontSize:13}}>No setup yet. Chat with the coach to get started.</div>}
      </div>):tab==="log"?(<div style={{flex:1,overflowY:"auto",padding:14}}>
        <div style={{fontSize:14,fontWeight:600,color:C.white,marginBottom:10}}>Session Log</div>
        
        {/* Race Report Generator */}
        <div style={{padding:14,background:C.botBubble,border:`1px solid ${C.botBorder}`,borderRadius:12,marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,color:C.white,marginBottom:8}}>📝 Race Report</div>
          {!report?(<div>
            <div style={{fontSize:12,color:C.textDim,marginBottom:10}}>Tell the AI about your results and it'll generate a shareable race report.</div>
            <input id="reportInput" placeholder='e.g. "Qualified 3rd, won the A main, best lap 18.2"' style={{width:"100%",padding:"10px 12px",background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:8,color:C.text,fontSize:13,fontFamily:"inherit",outline:"none",marginBottom:8,boxSizing:"border-box"}}/>
            <button onClick={()=>{const v=document.getElementById("reportInput").value;generateReport(v||null);}} disabled={reportBusy} style={{width:"100%",padding:"10px",background:reportBusy?C.inputBg:C.accent,border:"none",borderRadius:8,color:C.white,fontSize:13,fontWeight:600,cursor:reportBusy?"default":"pointer",fontFamily:"inherit",opacity:reportBusy?.5:1}}>{reportBusy?"Generating...":"Generate Race Report 🏁"}</button>
          </div>):(<div>
            <div style={{padding:12,background:C.bg,borderRadius:8,marginBottom:10,whiteSpace:"pre-wrap",fontSize:13,lineHeight:1.6,color:C.text}}>{report}</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={shareReport} style={{flex:1,padding:"10px",background:C.accent,border:"none",borderRadius:8,color:C.white,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Share 📤</button>
              <button onClick={copyReport} style={{flex:1,padding:"10px",background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:8,color:C.text,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Copy 📋</button>
              <button onClick={()=>setReport(null)} style={{padding:"10px 14px",background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:8,color:C.textMuted,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>↻</button>
            </div>
          </div>)}
        </div>

        {/* Session List */}
        {sessions.length?sessions.map((s,i)=>(<div key={i} style={{padding:12,background:C.botBubble,border:`1px solid ${C.botBorder}`,borderRadius:10,marginBottom:6}}><div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>{s.date}{s.track?` · ${s.track}`:""}</div><div style={{fontSize:13,color:C.text}}>{s.notes}</div></div>)):<div style={{textAlign:"center",padding:20,color:C.textMuted,fontSize:13}}>No sessions logged yet. Chat with the coach during a race night to start logging.</div>}
      </div>):(<div style={{flex:1,overflowY:"auto",padding:14}}>
        <div style={{fontSize:14,fontWeight:600,color:C.white,marginBottom:10}}>Driver Profile</div>
        {prof?<div style={{display:"flex",flexDirection:"column",gap:6}}>{[["Name",prof.name],["Location",prof.location],["Car",prof.car],["Track",prof.track],["Experience",prof.experience],["Class",prof.racingClass],["Goals",prof.goals]].filter(([,v])=>v).map(([l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:C.botBubble,border:`1px solid ${C.botBorder}`,borderRadius:8}}><span style={{fontSize:12,color:C.textMuted}}>{l}</span><span style={{fontSize:12,color:C.white,fontWeight:500}}>{v}</span></div>))}<button onClick={resetProfile} style={{marginTop:20,padding:"10px",background:"transparent",border:`1px solid #ef444440`,borderRadius:8,color:"#ef4444",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Reset Profile &amp; Start Over</button></div>:<div style={{textAlign:"center",padding:40,color:C.textMuted,fontSize:13}}>Chat with the coach to build your profile.</div>}
      </div>)}

      <div style={{display:"flex",borderTop:`1px solid ${C.navBorder}`,background:C.navBg,flexShrink:0}}>
        {[{id:"chat",label:"Coach",d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"},{id:"setup",label:"Setup",d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"},{id:"log",label:"Log",d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"},{id:"profile",label:"Profile",d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"}].map(n=>(<button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 0 6px",background:"transparent",border:"none",cursor:"pointer",color:tab===n.id?C.navActive:C.textMuted,fontSize:10,fontFamily:"inherit"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={n.d}/></svg>{n.label}</button>))}
      </div>
    </div>
  );
}
