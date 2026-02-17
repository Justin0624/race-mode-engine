import { useState, useRef, useEffect } from "react";
import KNOWLEDGE_ENGINE from "../lib/knowledge-engine.js";

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

function buildSys(prof, setup, sessions) {
  const sStr = setup ? Object.entries(setup).filter(([,v])=>v&&v!=="unknown").map(([k,v])=>`${LBL[k]||k}: ${v}${B7_KIT[k]&&v!==B7_KIT[k]?` (kit: ${B7_KIT[k]})`:""}`).join("\n") : "No setup loaded.";
  const pStr = prof ? `Name: ${prof.name||"?"}, Car: ${prof.car||"?"}, Track: ${prof.track||"?"}, Experience: ${prof.experience||"?"}, Goals: ${prof.goals||"?"}, Class: ${prof.racingClass||"?"}, Setup source: ${prof.setupSource||"?"}` : "No profile — first-time user.";
  const hStr = sessions?.length ? sessions.slice(-5).map(s=>`[${s.date}] ${s.notes}`).join("\n") : "None.";

  return `You are Race Mode Engine, an AI pit crew chief for 1/10 scale RC carpet racing. Expert on Team Associated RC10B7, B84, T7.

PERSONALITY: Talk like an experienced racer who is patient and encouraging. Concise (2-4 sentences, longer when teaching). Never judge. Bold sparingly. No emoji except occasional flag. Sound like a real person, not a chatbot.

ROLES:
1. COACH: Race night tuning. One change at a time. Reference actual values. Roll back if worse.
2. SETUP SHEET: Track every setting. Know kit vs changed vs unknown.
3. LOGBOOK: Remember sessions, changes, results.
4. MANUAL: Explain concepts plainly. Always cover what MORE does, what LESS does, which settings control it.
5. TEACHER: Match driver experience. Beginners get "why." Advanced get direct answers.

DRIVER: ${pStr}
SETUP: ${sStr}
KIT BASELINE: ${Object.entries(B7_KIT).map(([k,v])=>`${LBL[k]||k}: ${v}`).join(", ")}
SESSIONS: ${hStr}

FIRST-TIME ONBOARDING:
If no profile, build one through natural conversation like meeting someone at the track. Learn: name, car, situation (kit build? used? racing a while?), how they got their setup, home track, experience level, what they want from the app.

PATHS:
- Kit build: Load kit baseline, explain what they have, what to expect at the track
- Used car/unknown setup: Help identify parts visually (spring colors, shock fluid, gear teeth). Mark unknowns. Give bench checklist.
- Experienced: Quick capture of known changes, fill rest as kit
After onboarding, summarize and offer next steps.

COACHING: ONE change at a time. Reference actual values. If worse, roll back first. After 2 worse results, pause. Low-impact first. Diagnose the car, dont take orders.

TRACKS: Beaver RC (Uniontown PA) = old grey Ozite, low-medium grip, layout changes weekly. Eds Hobby Shop (WV) = black CRC carpet, higher grip.

CROSS-PLATFORM INTELLIGENCE:
When multiple drivers at the same track share setups, look for PATTERNS that transcend car brands:
- Shock oil weights are universal (35wt = 35wt on any car)
- Diff fluid weights are universal
- Ride height measurements are universal
- Angles (camber, toe, caster) are universal
- Spring rates need translation between brands (use stiffness, not color codes)
- Ball stud positions need translation (use the geometry effect, not the spacer count)
When translating setups between platforms, explain WHAT the setting achieves, not just the number. "His TLR is running the equivalent of high roll center — on your B7, that means raising your outer ball stud 1mm."

${KNOWLEDGE_ENGINE}

DATA TAGS (include in response when you learn info, user wont see them):
[PROFILE:key=value] keys: name, car, track, experience, goals, racingClass, setupSource
[SETUP:key=value] keys use underscores: front_springs, diff_fluid, etc
[SETUP:key=unknown] mark unknown
[LOG:note text]
Always include tags when conversation reveals new info.`;
}

async function ask(msgs, sys) {
  const r = await fetch("/api/chat", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system: sys,
      messages: msgs.map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }))
    })
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error);
  return d.content?.map(c => c.text || "").join("\n") || "Something went wrong.";
}

function parse(text) {
  const pu={},su={},logs=[];let c=text;
  for(const m of text.matchAll(/\[PROFILE:(\w+)=(.+?)\]/g)){pu[m[1]]=m[2];c=c.replace(m[0],"");}
  for(const m of text.matchAll(/\[SETUP:([\w_]+)=(.+?)\]/g)){su[m[1]]=m[2];c=c.replace(m[0],"");}
  for(const m of text.matchAll(/\[LOG:(.+?)\]/g)){logs.push(m[1]);c=c.replace(m[0],"");}
  return{c:c.trim(),pu,su,logs};
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
  const end=useRef(null);

  useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"});},[msgs,busy]);
  useEffect(()=>{go([{role:"user",text:"I just opened the Race Mode app for the first time. Start the onboarding."}],true);},[]);

  const go=async(h,init=false)=>{
    setBusy(true);
    try{
      const raw=await ask(h,buildSys(prof,setup,sessions));
      const{c,pu,su,logs}=parse(raw);
      if(Object.keys(pu).length)setProf(p=>({...(p||{}),...pu}));
      if(Object.keys(su).length)setSetup(p=>({...(p||{...B7_KIT}),...su}));
      if(logs.length)setSessions(p=>[...p,...logs.map(l=>({date:new Date().toLocaleDateString(),notes:l}))]);
      if(init)setMsgs([{role:"bot",text:c}]);else setMsgs(p=>[...p,{role:"bot",text:c}]);
    }catch(e){
      const err="Connection issue. Check internet and try again.";
      if(init)setMsgs([{role:"bot",text:err}]);else setMsgs(p=>[...p,{role:"bot",text:err}]);
    }
    setBusy(false);
  };

  const send=()=>{if(!input.trim()||busy)return;const t=input.trim();setInput("");const nm=[...msgs,{role:"user",text:t}];setMsgs(nm);go(nm);};

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
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey)send();}} placeholder={busy?"Thinking...":"Message your pit crew chief..."} disabled={busy} style={{flex:1,padding:"11px 16px",background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:24,color:C.text,fontSize:14,fontFamily:"inherit",outline:"none",opacity:busy?.5:1}} onFocus={e=>{e.target.style.borderColor=C.accent;}} onBlur={e=>{e.target.style.borderColor=C.inputBorder;}}/>
            <button onClick={send} disabled={!input.trim()||busy} style={{width:40,height:40,borderRadius:"50%",background:input.trim()&&!busy?C.accent:C.inputBg,border:`1px solid ${input.trim()&&!busy?C.accent:C.inputBorder}`,color:C.white,fontSize:17,cursor:input.trim()&&!busy?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>↑</button>
          </div>
        </div>
      </div>):tab==="setup"?(<div style={{flex:1,overflowY:"auto",padding:14}}>
        <div style={{fontSize:14,fontWeight:600,color:C.white,marginBottom:10}}>{prof?.name?`${prof.name}'s`:"My"} Setup</div>
        {setup?<SetupView setup={setup}/>:<div style={{textAlign:"center",padding:40,color:C.textMuted,fontSize:13}}>No setup yet. Chat with the coach to get started.</div>}
      </div>):tab==="log"?(<div style={{flex:1,overflowY:"auto",padding:14}}>
        <div style={{fontSize:14,fontWeight:600,color:C.white,marginBottom:10}}>Session Log</div>
        {sessions.length?sessions.map((s,i)=>(<div key={i} style={{padding:12,background:C.botBubble,border:`1px solid ${C.botBorder}`,borderRadius:10,marginBottom:6}}><div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>{s.date}</div><div style={{fontSize:13,color:C.text}}>{s.notes}</div></div>)):<div style={{textAlign:"center",padding:40,color:C.textMuted,fontSize:13}}>No sessions yet.</div>}
      </div>):(<div style={{flex:1,overflowY:"auto",padding:14}}>
        <div style={{fontSize:14,fontWeight:600,color:C.white,marginBottom:10}}>Driver Profile</div>
        {prof?<div style={{display:"flex",flexDirection:"column",gap:6}}>{[["Name",prof.name],["Car",prof.car],["Track",prof.track],["Experience",prof.experience],["Class",prof.racingClass],["Goals",prof.goals]].filter(([,v])=>v).map(([l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:C.botBubble,border:`1px solid ${C.botBorder}`,borderRadius:8}}><span style={{fontSize:12,color:C.textMuted}}>{l}</span><span style={{fontSize:12,color:C.white,fontWeight:500}}>{v}</span></div>))}</div>:<div style={{textAlign:"center",padding:40,color:C.textMuted,fontSize:13}}>Chat with the coach to build your profile.</div>}
      </div>)}

      <div style={{display:"flex",borderTop:`1px solid ${C.navBorder}`,background:C.navBg,flexShrink:0}}>
        {[{id:"chat",label:"Coach",d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"},{id:"setup",label:"Setup",d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"},{id:"log",label:"Log",d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"},{id:"profile",label:"Profile",d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"}].map(n=>(<button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 0 6px",background:"transparent",border:"none",cursor:"pointer",color:tab===n.id?C.navActive:C.textMuted,fontSize:10,fontFamily:"inherit"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={n.d}/></svg>{n.label}</button>))}
      </div>
    </div>
  );
}
