(()=>{"use strict";(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72664,e=>{var t=e.i(43476),a=e.i(71645);let i=`
                attribute vec2 position;
                void main() { gl_Position = vec4(position, 0.0, 1.0); }
            `,r=`
                precision highp float;
                uniform vec2 u_resolution;
                uniform float u_time;
                uniform vec2 u_mouse;
                uniform float u_strike;

                #define PI 3.14159265359

                float hash(vec2 p) { return fract(sin(dot(p, vec2(23.71, 91.37))) * 41537.1234); }

                // damped-cosine stand-in for the Bessel envelope of a circular mode
                float bess(float x) { return cos(x - 0.785398) / sqrt(1.0 + abs(x)); }

                void main() {
                    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                    vec2 p = uv * 2.0 - 1.0;
                    p.x *= u_resolution.x / u_resolution.y;
                    p.y += 0.08;

                    vec2 m = u_mouse / u_resolution.xy * 2.0 - 1.0;
                    m.y = -m.y;
                    m.x *= u_resolution.x / u_resolution.y;
                    p -= m * 0.11;

                    float t = u_time * 0.09;
                    float r = length(p);
                    float a = atan(p.y, p.x);

                    // the bell drifts between partials the way a struck bell does
                    float ang = 3.0 + 1.6 * sin(t * 0.37) + sin(t * 0.19 + 1.7);
                    float k   = 3.1 + 1.0 * sin(t * 0.23 + 0.6);

                    float amp = 1.0 + (1.0 - u_strike) * 0.55;
                    float f1 = bess(r * k * PI - t * 2.2) * cos(ang * a + t * 0.5);
                    float f2 = bess(r * k * 1.6 * PI + t * 1.4) * cos((ang * 2.0 + 1.0) * a - t * 0.31);
                    float f = (f1 + f2 * 0.30) * amp;

                    // nodal lines — where the metal stands still
                    float node = 1.0 - smoothstep(0.0, 0.075 + 0.075 * r, abs(f));
                    // antinodes — where it moves, and glows hot
                    float anti = smoothstep(0.40, 0.95, abs(f));

                    // the crown stays quiet — clears a reading zone under the type
                    float open = smoothstep(0.14, 0.92, r);
                    node *= open;
                    anti *= open;

                    vec3 deep   = vec3(0.031, 0.055, 0.051);
                    vec3 patina = vec3(0.306, 0.608, 0.541);
                    vec3 bronze = vec3(0.847, 0.608, 0.247);
                    vec3 ash    = vec3(0.937, 0.914, 0.863);

                    vec3 col = deep;
                    col = mix(col, patina, node * 0.50);
                    col = mix(col, bronze, anti * 0.22);
                    col += ash * pow(node, 3.0) * 0.13;

                    // shock ring travelling out from the strike
                    float ring = smoothstep(0.06, 0.0, abs(r - u_strike * 2.3)) * (1.0 - u_strike);
                    col += mix(bronze, ash, 0.4) * ring * 0.7;

                    col *= mix(0.10, 1.0, smoothstep(2.0, 0.28, r));
                    col += (hash(gl_FragCoord.xy) - 0.5) * 0.022;

                    gl_FragColor = vec4(col, 1.0);
                }
            `,o={speed:1,pointerAmount:1,strikeDuration:2400,emberAmount:1,brightness:1,opacity:1,hue:0,saturation:1};function n(e,t,a){let i=e.createShader(t);if(!i)throw Error("Unable to create Bell Field shader");if(e.shaderSource(i,a),e.compileShader(i),!e.getShaderParameter(i,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(i)??"Bell Field shader compilation failed");return i}e.s(["BELL_FIELD_DEFAULTS",0,o,"BellFieldBackground",0,function({className:e="",...s}){let l=(0,a.useRef)(null),c=(0,a.useRef)(null),d=(0,a.useRef)(null),h=(0,a.useRef)({...o,...s});h.current={...o,...s},(0,a.useEffect)(()=>{let e=l.current,t=c.current,a=d.current;if(!e||!t||!a)return;let o=t.getContext("webgl"),s=a.getContext("2d");if(!o||!s)return;let u=n(o,o.VERTEX_SHADER,i),f=n(o,o.FRAGMENT_SHADER,r),p=o.createProgram();if(!p)return;if(o.attachShader(p,u),o.attachShader(p,f),o.linkProgram(p),!o.getProgramParameter(p,o.LINK_STATUS))throw Error(o.getProgramInfoLog(p)??"Bell Field program link failed");o.useProgram(p);let m=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,m),o.bufferData(o.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]),o.STATIC_DRAW);let g=o.getAttribLocation(p,"position");o.enableVertexAttribArray(g),o.vertexAttribPointer(g,2,o.FLOAT,!1,0,0);let v=o.getUniformLocation(p,"u_resolution"),x=o.getUniformLocation(p,"u_time"),b=o.getUniformLocation(p,"u_mouse"),w=o.getUniformLocation(p,"u_strike"),y=1,E=1,S=1,A=.5,T=.5,M=.5,_=.5,R=0,P=!0,F=!1,k=-1e9,D=performance.now(),C=Array.from({length:58},()=>({x:Math.random(),y:Math.random(),r:.4+1.4*Math.random(),vy:-(.1+.26*Math.random()),vx:(Math.random()-.5)*.08,ph:Math.random()*Math.PI*2,sp:.5+1.4*Math.random(),hot:.36>Math.random()})),L=()=>{let i=e.getBoundingClientRect();y=Math.max(1,i.width),E=Math.max(1,i.height),S=Math.min(window.devicePixelRatio||1,2),t.width=Math.max(1,Math.round(y*S)),t.height=Math.max(1,Math.round(E*S)),a.width=t.width,a.height=t.height,s.setTransform(S,0,0,S,0,0),o.viewport(0,0,t.width,t.height),o.uniform2f(v,t.width,t.height),F||(A=M=.5*y,T=_=.5*E,F=!0),C.forEach(e=>{e.x<=1&&(e.x*=y),e.y<=1&&(e.y*=E)})},U=t=>{let a=e.getBoundingClientRect(),i=h.current.pointerAmount;M=.5*y+(t.clientX-a.left-.5*y)*i,_=.5*E+(t.clientY-a.top-.5*E)*i},I=()=>{k=performance.now()},z=window.setTimeout(I,1700),O=window.setInterval(I,8200),N=e=>{let t=h.current,a=.001*e*t.speed;A+=(M-A)*.04,T+=(_-T)*.04,o.uniform1f(x,(e-D)*.001*t.speed),o.uniform1f(w,Math.min(1,Math.max(0,(e-k)/t.strikeDuration))),o.uniform2f(b,A*S,T*S),o.drawArrays(o.TRIANGLES,0,6),s.clearRect(0,0,y,E);let i=Math.max(0,Math.min(58,Math.round(58*t.emberAmount)));for(let e=0;e<i;e+=1){let i=C[e];i.y+=i.vy*t.speed,i.x+=(i.vx+.13*Math.sin(a*i.sp*.5+i.ph))*t.speed,i.y<-4&&(i.y=E+4,i.x=Math.random()*y),i.x<-4&&(i.x=y+4),i.x>y+4&&(i.x=-4);let r=.5+.5*Math.sin(a*i.sp+i.ph);s.beginPath(),s.arc(i.x,i.y,i.r,0,2*Math.PI),s.fillStyle=i.hot?`rgba(231, 193, 101, ${.06+.34*r})`:`rgba(143, 203, 185, ${.04+.24*r})`,s.fill()}R=P&&!document.hidden?requestAnimationFrame(N):0},B=new ResizeObserver(L),G=new IntersectionObserver(([e])=>{(P=e?.isIntersecting??!0)&&!R&&(R=requestAnimationFrame(N)),!P&&R&&(cancelAnimationFrame(R),R=0)});return B.observe(e),G.observe(e),e.addEventListener("pointermove",U,{passive:!0}),e.addEventListener("pointerdown",I),L(),R=requestAnimationFrame(N),()=>{R&&cancelAnimationFrame(R),window.clearTimeout(z),window.clearInterval(O),B.disconnect(),G.disconnect(),e.removeEventListener("pointermove",U),e.removeEventListener("pointerdown",I),o.deleteBuffer(m),o.deleteShader(u),o.deleteShader(f),o.deleteProgram(p)}},[]);let u=h.current;return(0,t.jsxs)("div",{ref:l,className:`threeui-background bell-field${e?` ${e}`:""}`,style:{background:"#08100f",opacity:u.opacity,filter:`hue-rotate(${u.hue}deg) saturate(${u.saturation}) brightness(${u.brightness})`},children:[(0,t.jsx)("canvas",{ref:c,style:{zIndex:0}}),(0,t.jsx)("canvas",{ref:d,style:{zIndex:1,pointerEvents:"none"}})]})}],72664)},55996,e=>{var t=e.i(43476),a=e.i(71645);let i={speed:1,dropAmount:1,opacity:1};e.s(["CondensationBackground",0,function({className:e="",...r}){let o=(0,a.useRef)(null),n=(0,a.useRef)(null),s=(0,a.useRef)({...i,...r});return s.current={...i,...r},(0,a.useEffect)(()=>{let e=o.current,t=n.current;if(!e||!t)return;let a=function(e,t){let a=e.getContext("2d");if(!a)throw Error("Condensation requires Canvas 2D");let i=1,r=1,o=1,n=1,s=120,l=120,c=0,d=0,h=0,u=[],f=[],p=new Map,m=(e=0)=>{let t=8*o,a=Math.max(1,i-2*t),r=Math.max(1,n-2*t);u.push({x:t+Math.random()*a,y:t+Math.random()*r,r:(.5+.7*e)*o,rMax:(2.1+2.3*Math.random())*o,grow:(.0022+.0032*Math.random())*o,running:!1,vy:0})};return{resize:(a,c)=>{i=e.width=Math.max(1,Math.floor(a*(o=Math.min(window.devicePixelRatio||1,2)))),r=e.height=Math.max(1,Math.floor(c*o)),e.style.width=`${a}px`,e.style.height=`${c}px`,n=Math.max(1,r-2*o),l=Math.round((s=Math.max(80,Math.min(240,Math.round(i*r/(o*o)/5200))))*t().dropAmount),u=[],f=[],p.clear();let d=Math.round(.62*l);for(let e=0;e<d;e+=1)m(3*Math.random())},render(e){var g;let v=t();l=Math.round(s*v.dropAmount);let x=h?Math.min(50,e-h):16.67;h=e,((e,t=1)=>{u.length<l&&Math.random()<.34*t&&m(),e-c>6400&&(c=e,u.filter(e=>!e.running).sort((e,t)=>t.r-e.r).slice(0,3).forEach(e=>{e.running=!0,e.vy=.35*o}));for(let a=u.length-1;a>=0;a-=1){let i=u[a];if(!i.running){i.r+=i.grow*t,i.r>=i.rMax&&(i.running=!0,i.vy=.3*o);continue}i.vy=Math.min(i.vy+.075*o*t,5.4*o),i.y+=i.vy*t;for(let e=u.length-1;e>=0;e-=1){let t=u[e];if(t===i||t.running)continue;let r=Math.abs(t.x-i.x)<i.r+t.r+1.5*o,n=t.y>i.y-i.r&&t.y<i.y+i.vy+i.r;r&&n&&(i.r=Math.sqrt(i.r*i.r+t.r*t.r),u.splice(e,1),e<a&&(a-=1))}i.y>=n&&(f.push({x:i.x,y:n,r0:i.r,born:e}),u.splice(a,1))}f=f.filter(t=>e-t.born<760)})(d+=x*v.speed,v.speed),g=d,a.clearRect(0,0,i,r),u.forEach(e=>{let t=(e=>{let t=Math.max(.5,Math.round(2*e)/2),a=p.get(t);if(a)return a;let i=Math.ceil(2*t+2*Math.ceil(2*o)),r=document.createElement("canvas");r.width=i,r.height=i;let n=r.getContext("2d");if(!n)throw Error("Condensation bubble sprite unavailable");let s=i/2,l=t/(4.4*o);return n.fillStyle=`rgba(96,139,196,${.18+.22*l})`,n.beginPath(),n.arc(s,s,t,0,2*Math.PI),n.fill(),n.strokeStyle=`rgba(70,98,148,${.35+.35*l})`,n.lineWidth=.9*o,n.stroke(),n.fillStyle=`rgba(255,255,255,${.32+.3*l})`,n.beginPath(),n.arc(s-.32*t,s-.36*t,Math.max(.45*o,.24*t),0,2*Math.PI),n.fill(),p.set(t,r),r})(e.r);a.drawImage(t,e.x-t.width/2,e.y-t.height/2)}),f.forEach(e=>{let t=(g-e.born)/760;if(t<0||t>1)return;let i=e.r0+16*t*o;a.strokeStyle=`rgba(75,108,158,${(1-t)*.52})`,a.lineWidth=1.1*o,a.beginPath(),a.ellipse(e.x,e.y,i,.34*i,0,0,2*Math.PI),a.stroke()})},dispose(){u=[],f=[],p.clear()}}}(t,()=>s.current),i=0,r=!0,l=()=>{let t=e.getBoundingClientRect();a.resize(t.width,t.height),a.render(performance.now())},c=e=>{a.render(e),i=r&&!document.hidden?requestAnimationFrame(c):0},d=new ResizeObserver(l),h=new IntersectionObserver(([e])=>{(r=e?.isIntersecting??!0)&&!i&&(i=requestAnimationFrame(c)),!r&&i&&(cancelAnimationFrame(i),i=0)});return d.observe(e),h.observe(e),l(),i=requestAnimationFrame(c),()=>{i&&cancelAnimationFrame(i),d.disconnect(),h.disconnect(),a.dispose()}},[]),(0,t.jsx)("div",{ref:o,className:`threeui-background condensation${e?` ${e}`:""}`,style:{opacity:s.current.opacity},children:(0,t.jsx)("canvas",{ref:n})})}],55996)},63727,e=>{var t=e.i(43476),a=e.i(71645),i=e.i(81487);let r=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`,o=`
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uGridScale;
uniform float uMouseAmount;
uniform float uPulseSpeed;
uniform float uRadius;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.x / uResolution.y;
  uv.x *= aspect;
  uv += uMouse * uMouseAmount;
  vec2 grid = fract(uv * uGridScale);
  vec2 id = floor(uv * uGridScale);
  float dist = length(grid - vec2(0.5));
  float pulse = sin(uTime * uPulseSpeed + id.x * 0.05 + id.y * 0.05) * 0.5 + 0.5;
  float radius = 0.08 + pulse * uRadius;
  float alpha = smoothstep(radius, radius - 0.05, dist);
  vec2 center = vec2(0.5 * aspect, 0.5);
  float depthFade = smoothstep(1.2, 0.1, length(uv - center));
  vec3 color = vec3(0.0, 0.9, 1.0) * pulse;
  gl_FragColor = vec4(color, alpha * depthFade * uOpacity);
}
`,n={speed:1,gridScale:60,mouseAmount:.04,pulseSpeed:.4,radius:.15,opacity:.35,hue:0};e.s(["DOT_MATRIX_DEFAULTS",0,n,"DotMatrixBackground",0,function({className:e="",...s}){let l=(0,a.useRef)(null),c=(0,a.useRef)(null),d=(0,a.useRef)({...n,...s});return d.current={...n,...s},(0,a.useEffect)(()=>{let e=l.current,t=c.current;if(!e||!t)return;let a=new i.a({canvas:t,antialias:!0,alpha:!0});a.setPixelRatio(Math.min(window.devicePixelRatio,2));let n=new i.V,s=new i.W(-1,1,1,-1,.1,10);s.position.z=1;let h={uTime:{value:0},uResolution:{value:new i.Y},uMouse:{value:new i.Y},uGridScale:{value:60},uMouseAmount:{value:.04},uPulseSpeed:{value:.4},uRadius:{value:.15},uOpacity:{value:.35}},u=new i.N(2,2),f=new i.v({uniforms:h,vertexShader:r,fragmentShader:o,transparent:!0,depthWrite:!1});n.add(new i.U(u,f));let p=new i.Y,m=new i.Y,g=0,v=!0,x=performance.now(),b=e=>{let a=t.getBoundingClientRect();m.x=(e.clientX-a.left)/Math.max(1,a.width)*2-1,m.y=-((e.clientY-a.top)/Math.max(1,a.height)*2-1)},w=()=>{let t=e.getBoundingClientRect();a.setSize(t.width,t.height,!1),h.uResolution.value.set(t.width,t.height)},y=e=>{let t=d.current;p.lerp(m,.05),h.uTime.value=(e-x)*.001*t.speed,h.uMouse.value=p,h.uGridScale.value=t.gridScale,h.uMouseAmount.value=t.mouseAmount,h.uPulseSpeed.value=t.pulseSpeed,h.uRadius.value=t.radius,h.uOpacity.value=t.opacity,a.render(n,s),g=v&&!document.hidden?requestAnimationFrame(y):0},E=new ResizeObserver(w),S=new IntersectionObserver(([e])=>{(v=e?.isIntersecting??!0)&&!g&&(g=requestAnimationFrame(y)),!v&&g&&(cancelAnimationFrame(g),g=0)});return E.observe(e),S.observe(e),t.addEventListener("pointermove",b,{passive:!0}),w(),g=requestAnimationFrame(y),()=>{g&&cancelAnimationFrame(g),E.disconnect(),S.disconnect(),t.removeEventListener("pointermove",b),u.dispose(),f.dispose(),a.dispose()}},[]),(0,t.jsx)("div",{ref:l,className:`threeui-background dot-matrix${e?` ${e}`:""}`,children:(0,t.jsx)("canvas",{ref:c,style:{filter:`hue-rotate(${d.current.hue}deg)`}})})}],63727)},34173,e=>{var t=e.i(43476),a=e.i(71645);let i=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Elemental Marks — 水・雷・炎</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #060708;
    --line: rgba(255,255,255,.07);
    --ink: #e8e4dc;
    --dim: rgba(232,228,220,.42);
    --faint: rgba(232,228,220,.22);
    --water: #6cd3ff;
    --bolt: #aab4ff;
    --fire: #ff9d6b;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    background: var(--bg);
    color: var(--ink);
    font-family: "JetBrains Mono", monospace;
    overflow: hidden;
  }
  header {
    position: fixed; inset: 0 0 auto 0; z-index: 10;
    display: flex; justify-content: space-between; align-items: baseline;
    padding: 18px 22px;
    pointer-events: none;
    mix-blend-mode: screen;
  }
  header .brand {
    font-family: "Inter", "Hiragino Sans", sans-serif; font-weight: 500;
    font-size: 15px; letter-spacing: normal; text-transform: uppercase;
  }
  header .brand em { font-style: normal; color: var(--dim); margin-left: .8em; letter-spacing: normal; }

  main { display: flex; height: 100dvh; }
  .panel {
    position: relative; flex: 1 1 0; min-width: 0;
    transition: flex .7s cubic-bezier(.22,1,.36,1);
    border-left: 1px solid var(--line);
    opacity: 0; transform: translateY(14px);
    animation: reveal 1.1s cubic-bezier(.22,1,.36,1) forwards;
  }
  .panel:first-child { border-left: 0; }
  .panel:nth-child(1) { animation-delay: .05s; }
  .panel:nth-child(2) { animation-delay: .18s; }
  .panel:nth-child(3) { animation-delay: .31s; }
  @keyframes reveal { to { opacity: 1; transform: none; } }
  @media (hover:hover) and (min-width: 761px) {
    .panel:hover { flex: 1.4 1 0; }
  }
  .panel canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

  .info {
    position: absolute; left: 22px; bottom: 20px; z-index: 5;
    pointer-events: none;
  }
  .info .romaji {
    font-size: 10px; letter-spacing: normal; color: var(--faint);
    margin-bottom: 10px; text-transform: uppercase;
  }
  .info h2 {
    font-family: "Inter", "Hiragino Sans", sans-serif; font-weight: 500;
    font-size: clamp(20px, 2.2vw, 30px); letter-spacing: normal;
    color: var(--ink);
  }
  .info .tech {
    margin-top: 8px; font-size: 10px; letter-spacing: normal;
    color: var(--dim); max-width: 30ch; line-height: 1.7;
  }
  .kanji {
    position: absolute; top: 46px; right: 18px; z-index: 5;
    font-family: "Inter", "Hiragino Sans", "Yu Gothic", sans-serif; font-weight: 800;
    font-size: clamp(64px, 8vw, 120px); line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px var(--accent, rgba(255,255,255,.25));
    opacity: .55; pointer-events: none;
    transition: opacity .5s, color .5s;
  }
  .panel:hover .kanji { opacity: .95; color: var(--accent); -webkit-text-stroke: 0; text-shadow: 0 0 34px var(--accent); }
  .panel[data-fx="water"]     { --accent: var(--water); }
  .panel[data-fx="lightning"] { --accent: var(--bolt); }
  .panel[data-fx="fire"]      { --accent: var(--fire); }

  .hint {
    position: fixed; bottom: 18px; right: 22px;
    z-index: 10; font-size: 9px; letter-spacing: normal; color: var(--faint);
    text-transform: uppercase; pointer-events: none; white-space: nowrap;
    animation: pulse 4s ease-in-out infinite;
  }
  @keyframes pulse { 50% { opacity: .35; } }

  .fail {
    position: absolute; inset: 0; display: none; place-items: center;
    font-size: 11px; letter-spacing: normal; color: var(--dim); text-align: center;
  }

  @media (max-width: 760px) {
    body { overflow-y: auto; }
    main { flex-direction: column; height: auto; }
    .panel { height: 72dvh; border-left: 0; border-top: 1px solid var(--line); }
    .hint { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .panel { animation-duration: .01s; }
    .hint { animation: none; }
  }
</style>
</head>
<body>

<header>
  <div class="brand">Elemental Marks<em>水 雷 炎</em></div>
</header>

<main>
  <section class="panel" data-fx="water">
    <canvas></canvas>
    <div class="kanji">水</div>
    <div class="info">
      <div class="romaji">Sui — Water</div>
      <h2>OpenAI</h2>
      <p class="tech">ping-pong wave equation \xb7 gradient refraction of the mark</p>
    </div>
    <div class="fail">WEBGL2 FLOAT BUFFERS UNAVAILABLE</div>
  </section>

  <section class="panel" data-fx="lightning">
    <canvas></canvas>
    <div class="kanji">雷</div>
    <div class="info">
      <div class="romaji">Rai — Lightning</div>
      <h2>Anthropic</h2>
      <p class="tech">contour distance field \xb7 fBm zigzag arcs crawling the outline</p>
    </div>
    <div class="fail">WEBGL2 UNAVAILABLE</div>
  </section>

  <section class="panel" data-fx="fire">
    <canvas></canvas>
    <div class="kanji">炎</div>
    <div class="info">
      <div class="romaji">En — Flame</div>
      <h2>Claude</h2>
      <p class="tech">noise ribbons licking upward from the edge \xb7 rising embers</p>
    </div>
    <div class="fail">WEBGL2 UNAVAILABLE</div>
  </section>
</main>

<div class="hint">move — 触れてみて — press</div>

<script>
'use strict';

/* ---------------- logo paths (simple-icons, viewBox 0 0 24 24) ---------------- */
const LOGO_PATHS = {
  openai: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  anthropic: "M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z",
  claude: "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"
};

/* ---------------- rasterize -> SDF (chamfer) + edge point extraction ---------------- */
const SDF_SIZE = 512;
const SDF_SPREAD = 128;          // px each side of the edge
const D_RANGE = SDF_SPREAD * 2 / SDF_SIZE; // decoded sdf span in mask-uv units

function rasterizeLogo(pathStr) {
  const c = document.createElement('canvas');
  c.width = c.height = SDF_SIZE;
  const ctx = c.getContext('2d');
  const box = SDF_SIZE * 0.60;
  const s = box / 24;
  const off = (SDF_SIZE - box) / 2;
  ctx.setTransform(s, 0, 0, s, off, off);
  ctx.fillStyle = '#fff';
  ctx.fill(new Path2D(pathStr));
  return ctx.getImageData(0, 0, SDF_SIZE, SDF_SIZE);
}

function chamfer(d, w, h) {
  const D1 = 1, D2 = Math.SQRT2;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x; let v = d[i];
    if (x > 0) v = Math.min(v, d[i - 1] + D1);
    if (y > 0) {
      v = Math.min(v, d[i - w] + D1);
      if (x > 0) v = Math.min(v, d[i - w - 1] + D2);
      if (x < w - 1) v = Math.min(v, d[i - w + 1] + D2);
    }
    d[i] = v;
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const i = y * w + x; let v = d[i];
    if (x < w - 1) v = Math.min(v, d[i + 1] + D1);
    if (y < h - 1) {
      v = Math.min(v, d[i + w] + D1);
      if (x < w - 1) v = Math.min(v, d[i + w + 1] + D2);
      if (x > 0) v = Math.min(v, d[i + w - 1] + D2);
    }
    d[i] = v;
  }
}

function buildSDF(img) {
  const n = SDF_SIZE * SDF_SIZE;
  const dOut = new Float32Array(n), dIn = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const inside = img.data[i * 4 + 3] > 127;
    dOut[i] = inside ? 0 : 1e9;
    dIn[i]  = inside ? 1e9 : 0;
  }
  chamfer(dOut, SDF_SIZE, SDF_SIZE);
  chamfer(dIn, SDF_SIZE, SDF_SIZE);
  const enc = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const d = dOut[i] - dIn[i]; // + outside, - inside
    enc[i] = Math.max(0, Math.min(255, Math.round((0.5 + 0.5 * d / SDF_SPREAD) * 255)));
  }
  return enc;
}

/* contour pixels + outward normals, in y-up mask uv */
function edgePoints(img) {
  const S = SDF_SIZE, pts = [];
  const a = (x, y) => img.data[(y * S + x) * 4 + 3] > 127;
  for (let y = 1; y < S - 1; y++) {
    for (let x = 1; x < S - 1; x++) {
      if (!a(x, y)) continue;
      const l = a(x - 1, y), r = a(x + 1, y), u = a(x, y - 1), dn = a(x, y + 1);
      if (l && r && u && dn) continue;
      const gx = (r ? 1 : 0) - (l ? 1 : 0);
      const gy = (dn ? 1 : 0) - (u ? 1 : 0);
      let nx = -gx, ny = gy;                 // outward, y flipped to y-up
      const len = Math.hypot(nx, ny);
      if (!len) { nx = 0; ny = 1; } else { nx /= len; ny /= len; }
      pts.push((x + 0.5) / S, 1 - (y + 0.5) / S, nx, ny);
    }
  }
  return pts;
}

function makeParticleData(pts, count) {
  const data = new Float32Array(count * 5);
  const nPts = pts.length / 4;
  for (let i = 0; i < count; i++) {
    const j = (Math.random() * nPts) | 0;
    data[i * 5]     = pts[j * 4];
    data[i * 5 + 1] = pts[j * 4 + 1];
    data[i * 5 + 2] = pts[j * 4 + 2];
    data[i * 5 + 3] = pts[j * 4 + 3];
    data[i * 5 + 4] = Math.random() * 100 + i * 0.618;
  }
  return data;
}

/* ---------------- shaders ---------------- */
const VERT = \`#version 300 es
out vec2 vUv;
void main(){
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}\`;

const GLSL_COMMON = \`
precision highp float;
uniform sampler2D uSDF;
uniform float uTime;
uniform float uAspect;
uniform vec2  uScale;
uniform vec2  uShift;
uniform vec3  uPointer; // uv.xy, active
in vec2 vUv;
out vec4 frag;

float hash21(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i), b = hash21(i + vec2(1,0));
  float c = hash21(i + vec2(0,1)), d = hash21(i + vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++){ v += a * vnoise(p); p = r * p * 2.03; a *= 0.5; }
  return v;
}
/* signed distance in mask-uv units; extended analytically past the texture
   border so out-of-range samples keep growing instead of clamping (kills
   the rectangular clamp artifacts) */
float sdf(vec2 uv){
  vec2 m = 0.5 + (uv - 0.5 - uShift) * uScale;
  vec2 mc = clamp(m, 0.0, 1.0);
  float d = (texture(uSDF, vec2(mc.x, 1.0 - mc.y)).r - 0.5) * $\{D_RANGE.toFixed(4)};
  return d + length(m - mc);
}
float edgeFade(vec2 uv){
  return smoothstep(0.0, 0.05, uv.x) * smoothstep(1.0, 0.95, uv.x)
       * smoothstep(0.0, 0.05, uv.y) * smoothstep(1.0, 0.95, uv.y);
}
\`;

/* water simulation step (ping-pong, r = h, g = h_prev) */
const FRAG_SIM = \`#version 300 es
precision highp float;
uniform sampler2D uState;
uniform vec2 uTexel;
uniform vec3 uDrop; // sim-uv.xy, strength
in vec2 vUv;
out vec4 frag;
void main(){
  vec2 s = texture(uState, vUv).rg;
  float l = texture(uState, vUv - vec2(uTexel.x, 0.0)).r;
  float r = texture(uState, vUv + vec2(uTexel.x, 0.0)).r;
  float u = texture(uState, vUv + vec2(0.0, uTexel.y)).r;
  float d = texture(uState, vUv - vec2(0.0, uTexel.y)).r;
  float next = (l + r + u + d) * 0.5 - s.g;
  next *= 0.984;
  if (uDrop.z != 0.0){
    float dd = distance(vUv, uDrop.xy);
    next += uDrop.z * exp(-dd * dd * 3800.0);
  }
  frag = vec4(next, s.r, 0.0, 1.0);
}\`;

const FRAG_WATER = \`#version 300 es
$\{GLSL_COMMON}
uniform sampler2D uState;
uniform vec2 uSimTexel;
/* cover-map panel uv into the square sim so rings stay circular on screen */
vec2 simUV(vec2 uv){
  return 0.5 + (uv - 0.5) * vec2(uAspect, 1.0) / max(uAspect, 1.0);
}
void main(){
  vec2 suv = simUV(vUv);
  float h  = texture(uState, suv).r;
  float hx = texture(uState, suv + vec2(uSimTexel.x, 0.0)).r - texture(uState, suv - vec2(uSimTexel.x, 0.0)).r;
  float hy = texture(uState, suv + vec2(0.0, uSimTexel.y)).r - texture(uState, suv - vec2(0.0, uSimTexel.y)).r;
  vec2 grad = vec2(hx, hy);
  vec3 nrm = normalize(vec3(-grad * 30.0, 1.0));

  vec2 ruv = vUv + grad * 0.22;          // refracted lookup
  float d  = sdf(ruv);

  // deep water base
  vec3 col = mix(vec3(0.006, 0.030, 0.055), vec3(0.012, 0.078, 0.125), vUv.y * 0.8 + h * 0.25);
  col += vec3(0.02, 0.10, 0.13) * fbm(vUv * vec2(uAspect, 1.0) * 3.0 + uTime * 0.05) * 0.3;

  // the mark, seen through the surface
  float logo = smoothstep(0.005, -0.005, d);
  float glow = exp(-max(d, 0.0) / 0.09) * 0.26;
  vec3 markCol = mix(vec3(0.55, 0.92, 1.0), vec3(0.95, 1.0, 1.0), logo * 0.6);
  col += markCol * (logo * 0.92 + glow);

  // ripple shading: crests bright, troughs barely darker
  col += vec3(0.09, 0.30, 0.40) * clamp(h * 1.8, -0.06, 1.0);
  col += vec3(0.25, 0.55, 0.65) * pow(clamp(h * 2.6, 0.0, 1.0), 2.0) * 0.5;

  // specular glint
  vec3 L = normalize(vec3(-0.35, 0.55, 0.75));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(nrm, H), 0.0), 150.0);
  col += spec * vec3(0.65, 0.9, 1.0) * 0.9;

  col *= 0.35 + 0.65 * edgeFade(vUv);
  col += (hash21(vUv * 617.0 + uTime) - 0.5) / 128.0;
  frag = vec4(col, 1.0);
}\`;

const FRAG_LIGHTNING = \`#version 300 es
$\{GLSL_COMMON}
void main(){
  float t = uTime;
  float d = sdf(vUv);
  vec2 pp = vUv * vec2(uAspect, 1.0);

  // storm backdrop
  vec3 col = vec3(0.010, 0.011, 0.024);
  col += vec3(0.035, 0.04, 0.075) * fbm(pp * 2.2 + vec2(t * 0.04, t * 0.01));

  // occasional sheet flash
  float slot = floor(t * 0.45);
  float ph   = fract(t * 0.45);
  float big  = step(0.68, hash21(vec2(slot, 3.7))) * exp(-ph * 16.0);

  // the mark: dark slate body, lit by flashes
  float inside = smoothstep(0.005, -0.005, d);
  vec3 body = vec3(0.055, 0.06, 0.10) + big * vec3(0.55, 0.58, 0.85);
  col = mix(col, body, inside);
  float rim = exp(-abs(d) / 0.012) * 0.5;
  col += rim * vec3(0.35, 0.4, 0.8);

  // pointer draws the storm closer
  vec2 dp = (vUv - uPointer.xy) * vec2(uAspect, 1.0);
  float pb = 1.0 + 2.4 * uPointer.z * exp(-dot(dp, dp) * 34.0);

  // fBm zigzag arcs crawling the contour
  float fade = edgeFade(vUv);
  for (int i = 0; i < 3; i++){
    float fi = float(i);
    float n  = fbm(pp * mix(3.0, 8.0, fi / 2.0) + vec2(t * (1.2 + fi * 0.9), fi * 19.3)) - 0.5;
    float e  = abs(d + n * 0.11);
    float fl = hash21(vec2(floor(t * (6.0 + fi * 3.0)), fi));
    fl = mix(0.15, 1.0, smoothstep(0.25, 0.95, fl));
    float bolt = pow(0.0042 * pb / (e + 0.0022), 1.35) * fl;
    bolt = min(bolt, 6.0);
    col += bolt * mix(vec3(0.38, 0.42, 1.0), vec3(0.92, 0.9, 1.0), fi / 2.0) * fade;
  }
  // tight white core arc
  float n0 = fbm(pp * 5.0 + vec2(t * 2.4, 7.7)) - 0.5;
  float e0 = abs(d + n0 * 0.10);
  float corefl = mix(0.25, 1.15, hash21(vec2(floor(t * 9.0), 11.0)));
  col += min(pow(0.0026 * pb / (e0 + 0.0016), 1.6), 8.0) * corefl * vec3(1.0) * fade;

  col += big * vec3(0.30, 0.32, 0.55) * (0.25 + 0.75 * inside);
  col = col / (1.0 + col * 0.18);
  col *= 0.4 + 0.6 * edgeFade(vUv);
  col += (hash21(vUv * 431.0 + uTime) - 0.5) / 128.0;
  frag = vec4(col, 1.0);
}\`;

const FRAG_FIRE = \`#version 300 es
$\{GLSL_COMMON}
uniform float uWind;

vec3 fireRamp(float x){
  x = clamp(x, 0.0, 1.0);
  vec3 c = mix(vec3(0.0), vec3(0.45, 0.06, 0.02), smoothstep(0.02, 0.30, x));
  c = mix(c, vec3(0.95, 0.34, 0.08), smoothstep(0.28, 0.55, x));
  c = mix(c, vec3(1.0, 0.68, 0.22), smoothstep(0.52, 0.78, x));
  c = mix(c, vec3(1.0, 0.97, 0.88), smoothstep(0.78, 0.97, x));
  return c;
}

void main(){
  float t = uTime;
  float d0 = sdf(vUv);
  vec2 pp = vUv * vec2(uAspect, 1.0);

  // which way is "up and away" from the mark (wide epsilon: the gradient
  // creases on the medial axis between rays and narrow sampling bands there)
  float e = 0.012;
  vec2 g = vec2(sdf(vUv + vec2(e, 0.0)) - sdf(vUv - vec2(e, 0.0)),
                sdf(vUv + vec2(0.0, e)) - sdf(vUv - vec2(0.0, e)));
  float upw = smoothstep(-0.2, 0.9, normalize(g + 1e-5).y);

  // pointer stokes the flame
  vec2 dp = (vUv - uPointer.xy) * vec2(uAspect, 1.0);
  float stoke = uPointer.z * exp(-dot(dp, dp) * 26.0);

  // thin tongues: x-squashed scrolling fBm, advected progressively with
  // height so flames stay attached at the edge and lick upward
  float n1 = fbm(vec2(pp.x * 12.0,        pp.y * 3.0  - t * 2.1));
  float n2 = fbm(vec2(pp.x * 6.0 + 41.3,  pp.y * 1.7  - t * 1.25));
  float d0f = d0 + (hash21(vUv * 771.0 + t * 1.3) - 0.5) * 0.004;
  float rise = max(0.0, n1 * 1.15 + n2 * 0.65 - 0.5) * 1.3;  // many columns ~0, few run hot
  float adv  = smoothstep(-0.03, 0.22, d0f);     // 0 at the edge, grows above
  float lick = 0.30 * (1.0 + stoke * 0.8);
  vec2 offs = vec2((n2 - 0.5) * 0.05 + uWind * 0.05, -rise * lick * adv);
  float df = sdf(vUv + offs);
  df += (hash21(vUv * 997.0 + uTime) - 0.5) * 0.004;  // dither the 8-bit field

  float heat = clamp(1.0 - df / 0.07, 0.0, 1.0);
  heat *= mix(0.1, 1.0, upw);
  heat *= 1.0 - 0.45 * smoothstep(0.08, 0.26, d0f);  // gentle thinning with height
  float tongue = smoothstep(0.25, 0.70, heat);   // sharp separated licks
  float body   = pow(heat, 2.2) * 0.45;          // faint haze beneath them
  float f = max(tongue, body) * (0.95 + 0.25 * stoke);

  vec3 col = vec3(0.012, 0.006, 0.004);
  col += fireRamp(f * (1.05 - 0.4 * smoothstep(0.02, 0.25, d0)));  // white base, orange tips

  // white-hot mark with a warm halo, like paper mid-combustion
  float inside = smoothstep(0.004, -0.004, d0);
  float core   = smoothstep(0.0, -0.02, d0);
  vec3 markCol = mix(vec3(1.0, 0.92, 0.78), vec3(1.0, 1.0, 0.98), core);
  col = mix(col, markCol, inside);
  col += exp(-max(d0, 0.0) / 0.035) * vec3(1.0, 0.55, 0.22) * 0.35 * (1.0 - inside * 0.9);
  col += exp(-max(d0, 0.0) / 0.12)  * vec3(0.55, 0.14, 0.03) * 0.35 * (0.6 + 0.4 * n2);

  col = col / (1.0 + col * 0.12);
  col *= 0.35 + 0.65 * edgeFade(vUv);
  col += (hash21(vUv * 523.0 + uTime) - 0.5) / 128.0;
  frag = vec4(col, 1.0);
}\`;

/* ---------------- particles: stateless GPU point sprites off the contour ---------------- */
const PART_VERT = \`#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;    // spawn point, y-up mask uv
layout(location=1) in vec2 aNorm;   // outward contour normal
layout(location=2) in float aSeed;
uniform float uTime;
uniform vec2  uScale;
uniform vec2  uShift;
uniform float uDpr;
uniform float uWind;
uniform vec4  uCfgA;  // travel, lifeMin, lifeMax, alongNormal
uniform vec4  uCfgB;  // wiggle, sizeMin, sizeMax, sparse
out float vFade;
out float vMixC;
float h1(float n){ return fract(sin(n) * 43758.5453); }
void main(){
  float hs   = h1(aSeed * 1.31);
  float life = mix(uCfgA.y, uCfgA.z, hs);
  float tt   = uTime / life + aSeed * 13.7;
  float ph   = fract(tt);
  float cyc  = floor(tt);
  float r1 = h1(aSeed + cyc * 0.317);
  float r2 = h1(aSeed * 2.13 + cyc * 0.771);
  float on = step(uCfgB.w, r2);

  vec2 dir = normalize(mix(vec2(0.0, 1.0), aNorm, uCfgA.w) + (vec2(r1, h1(r1 * 7.0)) - 0.5) * 0.8);
  float trav = uCfgA.x * (0.45 + 0.9 * r1);
  vec2 p = aPos + aNorm * 0.004 + dir * trav * ph;
  p.x += sin(ph * 10.0 + r1 * 40.0 + uTime * 0.5) * uCfgB.x * ph;
  p.x += uWind * 0.08 * ph;

  vec2 uv = 0.5 + uShift + (p - 0.5) / uScale;
  vFade = on * smoothstep(0.0, 0.12, ph) * smoothstep(1.0, 0.5, ph) * mix(0.35, 1.0, r2);
  vMixC = h1(aSeed * 3.7 + cyc);
  gl_Position = vec4(uv * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = mix(uCfgB.y, uCfgB.z, h1(aSeed * 5.11 + cyc)) * uDpr * (1.0 - 0.45 * ph);
}\`;

const PART_FRAG = \`#version 300 es
precision highp float;
uniform vec3 uColA;
uniform vec3 uColB;
in float vFade;
in float vMixC;
out vec4 frag;
void main(){
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(q, q);
  if (r2 > 1.0) discard;
  float a = exp(-r2 * 3.5) * (1.0 - r2);
  frag = vec4(mix(uColA, uColB, vMixC) * a * vFade, 1.0);
}\`;

/* ---------------- GL helpers ---------------- */
function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh), src);
    return null;
  }
  return sh;
}
function program(gl, vertSrc, fragSrc) {
  const p = gl.createProgram();
  const vs = compile(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return null;
  gl.attachShader(p, vs); gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}

const DPR = Math.min(window.devicePixelRatio || 1, 1.75);
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SIM_RES = 512;

class Panel {
  constructor(el, fragSrc, logo, opts) {
    this.el = el;
    this.canvas = el.querySelector('canvas');
    this.opts = opts;
    this.pointer = { x: 0.5, y: 0.5, active: 0 };
    this.wind = 0;
    this.windTarget = 0;
    this.dropQueue = [];
    this.nextAutoDrop = 0.6;
    this.needsResize = false;
    this.ok = false;

    const gl = this.canvas.getContext('webgl2', { alpha: false, antialias: false });
    if (!gl) return this.fail();
    this.gl = gl;

    this.prog = program(gl, VERT, fragSrc);
    if (!this.prog) return this.fail();
    this.uni = {};
    for (const n of ['uSDF','uTime','uAspect','uScale','uShift','uPointer','uState','uSimTexel','uWind'])
      this.uni[n] = gl.getUniformLocation(this.prog, n);

    // sdf texture
    this.sdfTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.sdfTex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, SDF_SIZE, SDF_SIZE, 0, gl.RED, gl.UNSIGNED_BYTE, logo.sdf);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    if (opts.sim) {
      if (!gl.getExtension('EXT_color_buffer_float')) return this.fail();
      this.simProg = program(gl, VERT, FRAG_SIM);
      if (!this.simProg) return this.fail();
      this.simUni = {
        uState: gl.getUniformLocation(this.simProg, 'uState'),
        uTexel: gl.getUniformLocation(this.simProg, 'uTexel'),
        uDrop:  gl.getUniformLocation(this.simProg, 'uDrop'),
      };
      this.simTex = []; this.simFbo = [];
      for (let i = 0; i < 2; i++) {
        const t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, SIM_RES, SIM_RES, 0, gl.RG, gl.HALF_FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const f = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, f);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
        this.simTex.push(t); this.simFbo.push(f);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      this.simSrc = 0;
    }

    // particle system
    const P = opts.particles;
    if (P) {
      this.partProg = program(gl, PART_VERT, PART_FRAG);
      if (!this.partProg) return this.fail();
      this.partUni = {};
      for (const n of ['uTime','uScale','uShift','uDpr','uWind','uCfgA','uCfgB','uColA','uColB'])
        this.partUni[n] = gl.getUniformLocation(this.partProg, n);
      const data = makeParticleData(logo.edges, P.count);
      this.partVao = gl.createVertexArray();
      gl.bindVertexArray(this.partVao);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 20, 0);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 8);
      gl.enableVertexAttribArray(2);
      gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 20, 16);
      gl.bindVertexArray(null);
    }

    this.resize();
    // resize inside the rAF (before drawing), never in the RO callback —
    // RO fires after rAF, so resizing there clears the canvas post-draw
    // and every hover transition frame paints black
    new ResizeObserver(() => {
      if (REDUCED) this.resize(); else this.needsResize = true;
    }).observe(el);
    this.bindPointer();
    this.ok = true;
  }

  fail() {
    this.el.querySelector('.fail').style.display = 'grid';
    this.canvas.style.display = 'none';
  }

  resize() {
    const r = this.el.getBoundingClientRect();
    const w = Math.max(2, Math.round(r.width * DPR));
    const h = Math.max(2, Math.round(r.height * DPR));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w; this.canvas.height = h;
    }
    this.aspect = w / h;
    if (REDUCED && this.ok) this.draw(0.001);
  }

  bindPointer() {
    const uv = e => {
      const r = this.el.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
    };
    let last = null, lastT = 0;
    this.el.addEventListener('pointermove', e => {
      const p = uv(e), now = performance.now();
      this.pointer.x = p.x; this.pointer.y = p.y; this.pointer.active = 1;
      if (last) {
        const dt = Math.max(8, now - lastT);
        const dx = p.x - last.x, dy = p.y - last.y;
        const speed = Math.hypot(dx, dy) / (dt / 1000);
        if (this.opts.sim && speed > 0.05 && this.dropQueue.length < 6)
          this.dropQueue.push({ x: p.x, y: p.y, s: Math.min(speed * 0.14, 0.55) });
        this.windTarget = Math.max(-1, Math.min(1, dx / (dt / 1000) * 0.55));
      }
      last = p; lastT = now;
    });
    this.el.addEventListener('pointerdown', e => {
      const p = uv(e);
      if (this.opts.sim) this.dropQueue.push({ x: p.x, y: p.y, s: 0.9 });
      this.pointer.x = p.x; this.pointer.y = p.y; this.pointer.active = 1.6;
    });
    this.el.addEventListener('pointerup', () => { this.pointer.active = 1; });
    this.el.addEventListener('pointerleave', () => { this.pointer.active = 0; last = null; this.windTarget = 0; });
  }

  /* panel uv -> square sim uv (must match simUV() in the water shader) */
  toSimUV(x, y) {
    const a = this.aspect, m = Math.max(a, 1);
    return { x: 0.5 + (x - 0.5) * a / m, y: 0.5 + (y - 0.5) / m };
  }

  stepSim(t) {
    const gl = this.gl;
    if (t > this.nextAutoDrop) {
      this.dropQueue.push({ x: 0.12 + Math.random() * 0.76, y: 0.12 + Math.random() * 0.76, s: 0.12 + Math.random() * 0.3 });
      this.nextAutoDrop = t + 0.5 + Math.random() * 1.4;
    }
    gl.useProgram(this.simProg);
    gl.viewport(0, 0, SIM_RES, SIM_RES);
    gl.uniform2f(this.simUni.uTexel, 1 / SIM_RES, 1 / SIM_RES);
    for (let i = 0; i < 2; i++) {
      const drop = this.dropQueue.shift();
      if (drop) {
        const s = this.toSimUV(drop.x, drop.y);
        gl.uniform3f(this.simUni.uDrop, s.x, s.y, drop.s);
      } else {
        gl.uniform3f(this.simUni.uDrop, 0, 0, 0);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.simFbo[1 - this.simSrc]);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.simTex[this.simSrc]);
      gl.uniform1i(this.simUni.uState, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      this.simSrc = 1 - this.simSrc;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  scaleVec() {
    const zoom = this.opts.zoom, a = this.aspect;
    const fit = Math.min(a, 1);
    return [(a / fit) * zoom, (1 / fit) * zoom];
  }

  draw(t) {
    const gl = this.gl;
    if (this.needsResize) { this.needsResize = false; this.resize(); }
    if (this.opts.sim) this.stepSim(t);

    this.wind += (this.windTarget - this.wind) * 0.04;
    this.windTarget *= 0.97;

    gl.useProgram(this.prog);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    const sc = this.scaleVec();
    gl.uniform1f(this.uni.uTime, t);
    gl.uniform1f(this.uni.uAspect, this.aspect);
    gl.uniform2f(this.uni.uScale, sc[0], sc[1]);
    gl.uniform2f(this.uni.uShift, this.opts.shift[0], this.opts.shift[1]);
    gl.uniform3f(this.uni.uPointer, this.pointer.x, this.pointer.y, this.pointer.active);
    if (this.uni.uWind) gl.uniform1f(this.uni.uWind, this.wind);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sdfTex);
    gl.uniform1i(this.uni.uSDF, 0);
    if (this.opts.sim) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.simTex[this.simSrc]);
      gl.uniform1i(this.uni.uState, 1);
      gl.uniform2f(this.uni.uSimTexel, 1 / SIM_RES, 1 / SIM_RES);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const P = this.opts.particles;
    if (P) {
      gl.useProgram(this.partProg);
      gl.uniform1f(this.partUni.uTime, t);
      gl.uniform2f(this.partUni.uScale, sc[0], sc[1]);
      gl.uniform2f(this.partUni.uShift, this.opts.shift[0], this.opts.shift[1]);
      gl.uniform1f(this.partUni.uDpr, DPR);
      gl.uniform1f(this.partUni.uWind, this.wind);
      gl.uniform4f(this.partUni.uCfgA, P.travel, P.lifeMin, P.lifeMax, P.alongNormal);
      gl.uniform4f(this.partUni.uCfgB, P.wiggle, P.sizeMin, P.sizeMax, P.sparse);
      gl.uniform3f(this.partUni.uColA, P.colA[0], P.colA[1], P.colA[2]);
      gl.uniform3f(this.partUni.uColB, P.colB[0], P.colB[1], P.colB[2]);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.bindVertexArray(this.partVao);
      gl.drawArrays(gl.POINTS, 0, P.count);
      gl.bindVertexArray(null);
      gl.disable(gl.BLEND);
    }
  }
}

/* ---------------- boot ---------------- */
function buildLogo(path) {
  const img = rasterizeLogo(path);
  return { sdf: buildSDF(img), edges: edgePoints(img) };
}
const logos = {
  openai: buildLogo(LOGO_PATHS.openai),
  anthropic: buildLogo(LOGO_PATHS.anthropic),
  claude: buildLogo(LOGO_PATHS.claude),
};

const panels = [
  new Panel(document.querySelector('[data-fx="water"]'), FRAG_WATER, logos.openai, {
    sim: true, zoom: 1.06, shift: [0, 0],
    particles: {
      count: 160, travel: 0.10, lifeMin: 4.0, lifeMax: 8.0, alongNormal: 0.15,
      wiggle: 0.02, sizeMin: 1.5, sizeMax: 3.5, sparse: 0.5,
      colA: [0.10, 0.24, 0.30], colB: [0.22, 0.40, 0.48],
    },
  }),
  new Panel(document.querySelector('[data-fx="lightning"]'), FRAG_LIGHTNING, logos.anthropic, {
    sim: false, zoom: 1.10, shift: [0, 0],
    particles: {
      count: 240, travel: 0.055, lifeMin: 0.3, lifeMax: 0.9, alongNormal: 1.0,
      wiggle: 0.015, sizeMin: 1.2, sizeMax: 2.6, sparse: 0.8,
      colA: [0.45, 0.50, 1.0], colB: [0.95, 0.95, 1.0],
    },
  }),
  new Panel(document.querySelector('[data-fx="fire"]'), FRAG_FIRE, logos.claude, {
    sim: false, zoom: 1.16, shift: [0, -0.04],
    particles: {
      count: 420, travel: 0.30, lifeMin: 1.4, lifeMax: 3.0, alongNormal: 0.35,
      wiggle: 0.035, sizeMin: 1.6, sizeMax: 4.5, sparse: 0.55,
      colA: [1.0, 0.62, 0.28], colB: [1.0, 0.30, 0.10],
    },
  }),
].filter(p => p.ok);

const t0 = performance.now();
function loop() {
  const t = (performance.now() - t0) / 1000;
  for (const p of panels) p.draw(t);
  requestAnimationFrame(loop);
}
if (!REDUCED) requestAnimationFrame(loop);
else for (const p of panels) p.draw(0.001);
</script>
</body>
</html>
`,r=["water","lightning","fire"],o={variant:"water",speed:1,size:1,particleAmount:1,opacity:1,hue:0,saturation:1,brightness:1},n={water:"Water",lightning:"Lightning",fire:"Fire"},s={water:1.56,lightning:1.66,fire:1.82},l={water:"1.06",lightning:"1.10",fire:"1.16"},c={water:160,lightning:360,fire:560},d={water:160,lightning:240,fire:420},h=[[`const SDF_SIZE = 512;
const SDF_SPREAD = 128;`,`const SDF_SIZE = 768;
const SDF_SPREAD = 192;`],["const DPR = Math.min(window.devicePixelRatio || 1, 1.75);","const DPR = Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2.25);"],["sim: false, zoom: 1.16, shift: [0, -0.04],","sim: false, zoom: 1.16, shift: [0, -0.11],"],[`  float inside = smoothstep(0.005, -0.005, d);
  vec3 body = vec3(0.055, 0.06, 0.10) + big * vec3(0.55, 0.58, 0.85);
  col = mix(col, body, inside);
  float rim = exp(-abs(d) / 0.012) * 0.5;`,`  float inside = smoothstep(0.0025, -0.0025, d);
  vec3 body = vec3(0.055, 0.06, 0.10) + big * vec3(0.55, 0.58, 0.85);
  col = mix(col, body, inside);
  float rim = exp(-abs(d) / 0.0075) * 0.56;`],[`  // fBm zigzag arcs crawling the contour
  float fade = edgeFade(vUv);
  for (int i = 0; i < 3; i++){
    float fi = float(i);
    float n  = fbm(pp * mix(3.0, 8.0, fi / 2.0) + vec2(t * (1.2 + fi * 0.9), fi * 19.3)) - 0.5;
    float e  = abs(d + n * 0.11);
    float fl = hash21(vec2(floor(t * (6.0 + fi * 3.0)), fi));
    fl = mix(0.15, 1.0, smoothstep(0.25, 0.95, fl));
    float bolt = pow(0.0042 * pb / (e + 0.0022), 1.35) * fl;
    bolt = min(bolt, 6.0);
    col += bolt * mix(vec3(0.38, 0.42, 1.0), vec3(0.92, 0.9, 1.0), fi / 2.0) * fade;
  }
  // tight white core arc
  float n0 = fbm(pp * 5.0 + vec2(t * 2.4, 7.7)) - 0.5;
  float e0 = abs(d + n0 * 0.10);
  float corefl = mix(0.25, 1.15, hash21(vec2(floor(t * 9.0), 11.0)));
  col += min(pow(0.0026 * pb / (e0 + 0.0016), 1.6), 8.0) * corefl * vec3(1.0) * fade;`,`  // Layered contour arcs: broad current, hairline filaments, and short-lived forks.
  float fade = edgeFade(vUv);
  for (int i = 0; i < 5; i++){
    float fi = float(i);
    float layer = fi / 4.0;
    float coarse = fbm(pp * mix(4.0, 13.0, layer) + vec2(t * (1.3 + fi * 0.78), fi * 17.7)) - 0.5;
    float detail = fbm(pp * mix(17.0, 31.0, layer) + vec2(-t * (2.9 + fi * 0.55), fi * 31.7)) - 0.5;
    float n = coarse * mix(0.82, 0.58, layer) + detail * mix(0.18, 0.42, layer);
    float e = abs(d + n * mix(0.09, 0.038, layer));
    float fl = hash21(vec2(floor(t * (7.0 + fi * 3.4)), fi));
    fl = mix(0.12, 1.0, smoothstep(0.22, 0.94, fl));
    float width = mix(0.0034, 0.0012, layer);
    float bolt = pow(width * pb / (e + mix(0.0018, 0.0008, layer)), mix(1.42, 1.78, layer)) * fl;
    bolt = min(bolt, 7.0);
    col += bolt * mix(vec3(0.34, 0.39, 1.0), vec3(0.96, 0.94, 1.0), pow(layer, 0.75)) * fade;
  }

  // A white primary channel with a displaced secondary fork.
  float n0 = fbm(pp * 6.5 + vec2(t * 2.8, 7.7)) - 0.5;
  n0 += (fbm(pp * 23.0 + vec2(-t * 4.1, 18.2)) - 0.5) * 0.22;
  float e0 = abs(d + n0 * 0.075);
  float corefl = mix(0.22, 1.2, hash21(vec2(floor(t * 10.0), 11.0)));
  col += min(pow(0.00175 * pb / (e0 + 0.0009), 1.78), 9.0) * corefl * vec3(1.0) * fade;

  float branchNoise = fbm(pp * 16.0 + vec2(t * 3.7, -13.4)) - 0.5;
  float branchEdge = abs(d + n0 * 0.052 + branchNoise * 0.026);
  float branchLife = smoothstep(0.35, 0.92, hash21(vec2(floor(t * 13.0), 23.0)));
  col += min(pow(0.0011 * pb / (branchEdge + 0.00075), 1.72), 5.0)
       * branchLife * vec3(0.64, 0.70, 1.0) * fade;`],[`  // thin tongues: x-squashed scrolling fBm, advected progressively with
  // height so flames stay attached at the edge and lick upward
  float n1 = fbm(vec2(pp.x * 12.0,        pp.y * 3.0  - t * 2.1));
  float n2 = fbm(vec2(pp.x * 6.0 + 41.3,  pp.y * 1.7  - t * 1.25));
  float d0f = d0 + (hash21(vUv * 771.0 + t * 1.3) - 0.5) * 0.004;
  float rise = max(0.0, n1 * 1.15 + n2 * 0.65 - 0.5) * 1.3;  // many columns ~0, few run hot
  float adv  = smoothstep(-0.03, 0.22, d0f);     // 0 at the edge, grows above
  float lick = 0.30 * (1.0 + stoke * 0.8);
  vec2 offs = vec2((n2 - 0.5) * 0.05 + uWind * 0.05, -rise * lick * adv);
  float df = sdf(vUv + offs);
  df += (hash21(vUv * 997.0 + uTime) - 0.5) * 0.004;  // dither the 8-bit field

  float heat = clamp(1.0 - df / 0.07, 0.0, 1.0);
  heat *= mix(0.1, 1.0, upw);
  heat *= 1.0 - 0.45 * smoothstep(0.08, 0.26, d0f);  // gentle thinning with height
  float tongue = smoothstep(0.25, 0.70, heat);   // sharp separated licks
  float body   = pow(heat, 2.2) * 0.45;          // faint haze beneath them
  float f = max(tongue, body) * (0.95 + 0.25 * stoke);`,`  // Three frequency bands split the fire into attached tongues, fine wisps, and hot veins.
  float n1 = fbm(vec2(pp.x * 11.0,        pp.y * 3.2 - t * 2.2));
  float n2 = fbm(vec2(pp.x * 6.5 + 41.3,  pp.y * 1.8 - t * 1.3));
  float n3 = fbm(vec2(pp.x * 27.0 - t * 0.7, pp.y * 7.5 - t * 4.0));
  float d0f = d0 + (hash21(vUv * 771.0 + t * 1.3) - 0.5) * 0.0025;
  float rise = max(0.0, n1 * 0.98 + n2 * 0.54 + n3 * 0.38 - 0.58) * 1.48;
  float adv  = smoothstep(-0.025, 0.24, d0f);
  float lick = 0.31 * (1.0 + stoke * 0.82);
  vec2 offs = vec2((n2 - 0.5) * 0.042 + (n3 - 0.5) * 0.018 + uWind * 0.05, -rise * lick * adv);
  float df = sdf(vUv + offs);
  float micro = fbm(pp * vec2(34.0, 9.0) + vec2(t * 1.1, -t * 5.2));
  df += (micro - 0.5) * 0.011 * adv;
  df += (hash21(vUv * 997.0 + uTime) - 0.5) * 0.0025;

  float heat = clamp(1.0 - df / 0.064, 0.0, 1.0);
  heat *= mix(0.08, 1.0, upw);
  heat *= 1.0 - 0.52 * smoothstep(0.07, 0.27, d0f);
  heat *= 0.84 + n3 * 0.24;
  float tongue = smoothstep(0.29, 0.69, heat);
  float filament = smoothstep(0.58, 0.91, heat + (n3 - 0.5) * 0.20);
  float split = smoothstep(0.38, 0.82, n3) * smoothstep(0.015, 0.23, d0f);
  float body = pow(heat, 2.35) * 0.36;
  float f = max(max(tongue * (0.72 + 0.28 * n3), filament * split * 0.88), body)
          * (0.95 + 0.25 * stoke);`],[`  col += fireRamp(f * (1.05 - 0.4 * smoothstep(0.02, 0.25, d0)));  // white base, orange tips

  // white-hot mark with a warm halo, like paper mid-combustion
  float inside = smoothstep(0.004, -0.004, d0);
  float core   = smoothstep(0.0, -0.02, d0);`,`  col += fireRamp(f * (1.05 - 0.4 * smoothstep(0.02, 0.25, d0)));
  float vein = pow(clamp(1.0 - abs(df) / 0.026, 0.0, 1.0), 3.2)
             * smoothstep(0.55, 0.9, n3) * upw * (0.35 + 0.65 * adv);
  col += fireRamp(0.82) * vein * 0.34;

  // A crisp white-hot mark with a restrained warm halo.
  float inside = smoothstep(0.0025, -0.0025, d0);
  float core   = smoothstep(0.0, -0.016, d0);`],[`  col += exp(-max(d0, 0.0) / 0.035) * vec3(1.0, 0.55, 0.22) * 0.35 * (1.0 - inside * 0.9);
  col += exp(-max(d0, 0.0) / 0.12)  * vec3(0.55, 0.14, 0.03) * 0.35 * (0.6 + 0.4 * n2);`,`  col += exp(-max(d0, 0.0) / 0.026) * vec3(1.0, 0.55, 0.22) * 0.30 * (1.0 - inside * 0.92);
  col += exp(-max(d0, 0.0) / 0.09)  * vec3(0.55, 0.14, 0.03) * 0.28 * (0.55 + 0.45 * n2);`],[`count: 240, travel: 0.055, lifeMin: 0.3, lifeMax: 0.9, alongNormal: 1.0,
      wiggle: 0.015, sizeMin: 1.2, sizeMax: 2.6, sparse: 0.8,`,`count: 240, travel: 0.075, lifeMin: 0.28, lifeMax: 0.82, alongNormal: 0.92,
      wiggle: 0.022, sizeMin: 0.8, sizeMax: 2.0, sparse: 0.72,`],[`count: 420, travel: 0.30, lifeMin: 1.4, lifeMax: 3.0, alongNormal: 0.35,
      wiggle: 0.035, sizeMin: 1.6, sizeMax: 4.5, sparse: 0.55,`,`count: 420, travel: 0.34, lifeMin: 1.1, lifeMax: 2.7, alongNormal: 0.30,
      wiggle: 0.046, sizeMin: 0.9, sizeMax: 3.6, sparse: 0.42,`]];function u(e,t,a){return Math.min(a,Math.max(t,e))}e.s(["ELEMENTS_DEFAULTS",0,o,"ELEMENT_VARIANTS",0,r,"ElementsBackground",0,function({variant:e=o.variant,speed:f=o.speed,size:p=o.size,particleAmount:m=o.particleAmount,opacity:g=o.opacity,hue:v=o.hue,saturation:x=o.saturation,brightness:b=o.brightness,className:w="",style:y}){let E=(0,a.useRef)(null),[S,A]=(0,a.useState)(!0),[T,M]=(0,a.useState)(()=>typeof document>"u"||!document.hidden),_=r.includes(e)?e:o.variant,R=u(f,0,3),P=!S||!T,F=(0,a.useMemo)(()=>{let e,t,a;return e=s[_]/u(p,.65,1.5),t=Math.max(0,Math.round(c[_]*u(m,0,2))),a=`<style data-elements-focus>
html, body, main { width: 100%; height: 100%; margin: 0; overflow: hidden; background: #060708; }
header, .hint, .info, .kanji { display: none !important; }
main { display: block; }
.panel { display: none; }
.panel[data-fx="${_}"] {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  opacity: 1;
  transform: none;
  animation: none;
}
.panel[data-fx="${_}"] canvas { width: 100%; height: 100%; }
</style>`,h.reduce((e,[t,a])=>e.replace(t,a),i).replace(/<link[^>]+fonts\.googleapis\.com[^>]*>/gi,"").replace(/<link[^>]+fonts\.gstatic\.com[^>]*>/gi,"").replace("</head>",`${a}<script data-elements-controls>
(function () {
  var nativeNow = performance.now.bind(performance);
  var last = nativeNow();
  var virtual = last;
  var state = { speed: 1, paused: false };
  window.__ELEMENTS_PAUSED = false;
  performance.now = function () {
    var real = nativeNow();
    if (!state.paused) virtual += (real - last) * state.speed;
    last = real;
    return virtual;
  };
  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'elements-controls') return;
    var next = event.data.controls || {};
    if (Number.isFinite(next.speed)) state.speed = Math.max(0, Math.min(3, next.speed));
    state.paused = Boolean(next.paused);
    window.__ELEMENTS_PAUSED = state.paused;
  });
})();
</script></head>`).replace(RegExp(`count: ${d[_]}`),`count: ${t}`).replace(`zoom: ${l[_]}`,`zoom: ${e.toFixed(4)}`).replace("for (const p of panels) p.draw(t);","if (!window.__ELEMENTS_PAUSED) for (const p of panels) p.draw(t);")},[m,_,p]),k=(0,a.useCallback)(()=>{E.current?.contentWindow?.postMessage({type:"elements-controls",controls:{speed:R,paused:P}},"*")},[P,R]);return(0,a.useEffect)(()=>{let e=E.current;if(!e||typeof IntersectionObserver>"u")return;let t=new IntersectionObserver(([e])=>A(e?.isIntersecting??!0));return t.observe(e),()=>t.disconnect()},[]),(0,a.useEffect)(()=>{if(typeof document>"u")return;let e=()=>M(!document.hidden);return document.addEventListener("visibilitychange",e),()=>document.removeEventListener("visibilitychange",e)},[]),(0,a.useEffect)(()=>{k()},[k,F]),(0,t.jsx)("div",{className:`threeui-background elements${w?` ${w}`:""}`,"data-element":_,style:{background:"#060708",pointerEvents:"auto",...y},children:(0,t.jsx)("iframe",{ref:E,title:`${n[_]} element background`,srcDoc:F,sandbox:"allow-scripts",onLoad:k,"aria-hidden":"true",tabIndex:-1,style:{position:"absolute",inset:0,display:"block",width:"100%",height:"100%",border:0,background:"#060708",opacity:u(g,.05,1),filter:`hue-rotate(${u(v,-180,180)}deg) saturate(${u(x,0,2)}) brightness(${u(b,.35,1.8)})`}})})}],34173)},96369,e=>{var t=e.i(43476),a=e.i(71645);let i=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Generative Branching Tree</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: #0a0a0a; }
  canvas { display: block; width: 100vw; height: 100vh; }
  .label {
    position: fixed;
    top: 20px;
    left: 24px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(200, 149, 108, 0.5);
    z-index: 10;
    pointer-events: none;
    user-select: none;
  }
</style>
</head>
<body>
<div class="label">04 / Generative Tree</div>
<canvas id="canvas"></canvas>
<script>
(function() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  // --- Utilities ---
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rand(lo, hi) { return Math.random() * (hi - lo) + lo; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function smoothstep(a, b, t) {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  // --- Configuration ---
  let MAX_DEPTH = 10;
  let GROWTH_SPEED_BASE = 0.006;
  const HOLD_DURATION = 400;
  const FADE_DURATION = 180;
  const WAIT_DURATION = 80;

  // --- Pre-rendered particle sprite (soft dot) ---
  let particleSprite;
  function initParticleSprite() {
    particleSprite = document.createElement('canvas');
    particleSprite.width = 32;
    particleSprite.height = 32;
    const pctx = particleSprite.getContext('2d');
    const g = pctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(230, 200, 155, 1)');
    g.addColorStop(0.3, 'rgba(215, 175, 130, 0.5)');
    g.addColorStop(1, 'rgba(200, 150, 100, 0)');
    pctx.fillStyle = g;
    pctx.fillRect(0, 0, 32, 32);
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticleSprite();
  }
  window.addEventListener('resize', resize);
  resize();

  // --- Particle system ---
  const PARTICLE_COUNT = 50;
  let particles = [];

  function createParticle(fullRandom) {
    return {
      x: rand(W * 0.15, W * 0.85),
      y: fullRandom ? rand(H * 0.1, H * 0.9) : rand(H * 0.5, H),
      vx: rand(-0.12, 0.12),
      vy: rand(-0.35, -0.06),
      size: rand(0.6, 2.2),
      alpha: rand(0.04, 0.2),
      phase: rand(0, Math.PI * 2),
      freq: rand(0.0004, 0.0015),
      life: fullRandom ? rand(0, 1) : 0,
      lifeSpeed: rand(0.0006, 0.0025),
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(true));
    }
  }

  function updateParticles(time) {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx + Math.sin(time * p.freq + p.phase) * 0.25;
      p.y += p.vy;
      p.life += p.lifeSpeed;
      if (p.life > 1 || p.y < -10 || p.x < -10 || p.x > W + 10) {
        particles[i] = createParticle(false);
      }
    }
  }

  function drawParticles(drawCtx, globalAlpha) {
    for (const p of particles) {
      const lifeFade = p.life < 0.15 ? p.life / 0.15
                     : p.life > 0.8 ? (1 - p.life) / 0.2
                     : 1;
      const a = p.alpha * lifeFade * globalAlpha;
      if (a < 0.004) continue;
      const s = p.size * 3;
      drawCtx.globalAlpha = a;
      drawCtx.drawImage(particleSprite, p.x - s, p.y - s, s * 2, s * 2);
    }
    drawCtx.globalAlpha = 1;
  }

  // --- Color palette (warm sienna → amber → golden at tips) ---
  const PALETTE = [
    { r: 78, g: 45, b: 14 },    // deep sienna
    { r: 125, g: 76, b: 28 },   // warm bark
    { r: 172, g: 118, b: 50 },  // rich amber
    { r: 205, g: 158, b: 82 },  // warm gold
    { r: 218, g: 182, b: 108 }, // golden
    { r: 215, g: 195, b: 135 }, // warm golden-cream at tips
  ];

  function colorForDepth(depth, hueShift) {
    const t = depth / MAX_DEPTH;
    const idx = t * (PALETTE.length - 1);
    const i0 = Math.floor(idx);
    const i1 = Math.min(PALETTE.length - 1, i0 + 1);
    const f = idx - i0;
    let r = lerp(PALETTE[i0].r, PALETTE[i1].r, f);
    let g = lerp(PALETTE[i0].g, PALETTE[i1].g, f);
    let b = lerp(PALETTE[i0].b, PALETTE[i1].b, f);

    // Per-branch hue variation (stronger at outer depths)
    // hueShift -1..1: negative = olive/green shift, positive = warm rose shift
    if (hueShift !== undefined) {
      const strength = t * t * 22;
      r += hueShift * strength * 1.0;   // positive = rosier
      g += hueShift * strength * -0.5;  // positive = less green
      b += hueShift * strength * -0.15; // keep blue minimal
    }

    return { r, g, b };
  }

  // --- Branch data ---
  let allBranches = [];
  let treeAlpha = 1;
  let treeState = 'growing';
  let holdTimer = 0, fadeTimer = 0, waitTimer = 0;
  const _pad = parseFloat(new URLSearchParams(location.search).get('p')) || 1;

  function createTree() {
    allBranches = [];

    const trunkLen = H * rand(0.23, 0.28) / _pad;
    const trunkThick = Math.max(8, W * 0.015) / _pad;
    const trunkAngle = -Math.PI / 2 + rand(-0.05, 0.05);

    const approxTreeH = trunkLen * 3.5;
    const baseY = _pad > 1 ? (H + approxTreeH) / 2 : H + trunkThick * 0.5;

    allBranches.push({
      x0: W / 2 + rand(-W * 0.03, W * 0.03),
      y0: baseY,
      angle: trunkAngle,
      length: trunkLen,
      thickness: trunkThick,
      depth: 0,
      growthProgress: 0,
      growthSpeed: GROWTH_SPEED_BASE * rand(0.9, 1.1),
      children: [],
      spawned: false,
      swayPhase: rand(0, Math.PI * 2),
      swayAmp: 0.0008,
      curvature: rand(-0.015, 0.015),
      colorShift: rand(-8, 8),
      hueShift: 0,
      parent: null,
      // Pre-computed stroke variation for painterly rendering
      strokeSeeds: [rand(-1,1), rand(-1,1), rand(-1,1), rand(-1,1), rand(-1,1)],
      tipDots: [],
    });

    treeState = 'growing';
    holdTimer = fadeTimer = waitTimer = 0;
    treeAlpha = 1;
    initParticles();
  }

  function spawnChildren(parent) {
    if (parent.depth >= MAX_DEPTH) return;

    let numChildren;
    if (parent.depth < 1) numChildren = 2 + (Math.random() < 0.35 ? 1 : 0);
    else if (parent.depth < 3) numChildren = 2 + (Math.random() < 0.4 ? 1 : 0);
    else numChildren = Math.random() < 0.25 ? 3 : 2;

    // Progressive pruning: more aggressive at outer depths for airy canopy
    const pruneChance = parent.depth <= 3 ? 0 : parent.depth <= 5 ? 0.1 : parent.depth <= 7 ? 0.22 : 0.35;
    if (Math.random() < pruneChance) numChildren = Math.max(1, numChildren - 1);

    const spread = parent.depth < 2 ? rand(0.32, 0.48) : rand(0.38, 0.6);

    for (let i = 0; i < numChildren; i++) {
      let angleOffset;
      if (numChildren === 1) {
        angleOffset = rand(-0.25, 0.25);
      } else if (numChildren === 2) {
        angleOffset = (i === 0 ? -1 : 1) * rand(0.18, spread);
      } else {
        angleOffset = (i - 1) * spread + rand(-0.1, 0.1);
      }

      const childAngle = parent.angle + angleOffset;
      const lengthFactor = rand(0.58, 0.76);
      const thickFactor = rand(0.48, 0.67);

      const ep = getBranchEnd(parent, 1, 0);

      // Pre-compute tip dots for terminal branches only
      const tipDots = [];
      const childDepth = parent.depth + 1;
      if (childDepth >= MAX_DEPTH) {
        const count = Math.random() < 0.4 ? 2 : 1;
        for (let d = 0; d < count; d++) {
          tipDots.push({
            ox: rand(-2, 2),
            oy: rand(-2, 2),
            size: rand(0.8, 1.6),
            alpha: rand(0.08, 0.2),
          });
        }
      }

      const child = {
        x0: ep.x,
        y0: ep.y,
        angle: childAngle,
        length: parent.length * lengthFactor,
        thickness: Math.max(0.4, parent.thickness * thickFactor),
        depth: childDepth,
        growthProgress: 0,
        growthSpeed: GROWTH_SPEED_BASE * rand(1.0, 1.5) * (1 + parent.depth * 0.1),
        children: [],
        spawned: false,
        swayPhase: rand(0, Math.PI * 2),
        swayAmp: 0.0018 * (parent.depth + 1) * rand(0.7, 1.3),
        curvature: rand(-0.04, 0.04) * (1 + parent.depth * 0.12),
        colorShift: rand(-12, 12),
        hueShift: Math.max(-1, Math.min(1, parent.hueShift + rand(-0.35, 0.35))),
        parent: parent,
        strokeSeeds: [rand(-1,1), rand(-1,1), rand(-1,1), rand(-1,1), rand(-1,1)],
        tipDots: tipDots,
      };

      parent.children.push(child);
      allBranches.push(child);
    }
  }

  // --- Sway (multi-frequency wind + mouse wind + shake) ---
  function getSwayAngle(branch, time) {
    let total = 0;
    let b = branch;
    let depth = 0;
    while (b) {
      const a = b.swayAmp;
      total += Math.sin(time * 0.0005 + b.swayPhase) * a;
      total += Math.sin(time * 0.0003 + b.swayPhase * 1.7) * a * 0.6;
      total += Math.sin(time * 0.00012 + b.swayPhase * 0.4) * a * 0.35;
      depth++;
      b = b.parent;
    }
    // Mouse wind: deeper branches bend more
    if (mouseActive) {
      total += windForce * 0.04 * depth;
    }
    // Shake: rapid oscillation that decays
    if (shakeAmount > 0.01) {
      total += Math.sin(time * 0.015 + branch.swayPhase * 3) * shakeAmount * 0.06 * depth;
    }
    return total;
  }

  function getBranchEnd(branch, progress, time) {
    const sway = getSwayAngle(branch, time);
    const angle = branch.angle + sway;
    const len = branch.length * progress;
    const perpX = -Math.sin(angle);
    const perpY = Math.cos(angle);
    const curveOff = branch.curvature * len;
    return {
      x: branch.x0 + Math.cos(angle) * len + perpX * curveOff,
      y: branch.y0 + Math.sin(angle) * len + perpY * curveOff,
    };
  }

  function recalcPositions(time) {
    for (const b of allBranches) {
      if (b.parent) {
        const pe = getBranchEnd(b.parent, 1, time);
        b.x0 = pe.x;
        b.y0 = pe.y;
      }
    }
  }

  function updateBranches(time) {
    let allDone = true;
    for (const b of allBranches) {
      if (b.growthProgress < 1) {
        b.growthProgress = Math.min(1, b.growthProgress + b.growthSpeed);
        allDone = false;
      }
      // Overlapping growth: spawn children at 65%
      if (b.growthProgress >= 0.65 && !b.spawned) {
        b.spawned = true;
        spawnChildren(b);
      }
    }
    return allDone;
  }

  // --- Branch drawing (multi-stroke painterly) ---
  function drawBranch(drawCtx, b, time) {
    if (b.growthProgress <= 0) return;

    const sway = getSwayAngle(b, time);
    const angle = b.angle + sway;
    const progress = easeOutCubic(b.growthProgress);
    const len = b.length * progress;

    const x1 = b.x0;
    const y1 = b.y0;

    // Perpendicular direction
    const perpX = -Math.sin(angle);
    const perpY = Math.cos(angle);

    // Cubic bezier control points with natural curvature
    const curveOff = b.curvature * len * 1.4;
    const cpx1 = x1 + Math.cos(angle) * len * 0.33 + perpX * curveOff * 0.4;
    const cpy1 = y1 + Math.sin(angle) * len * 0.33 + perpY * curveOff * 0.4;
    const cpx2 = x1 + Math.cos(angle) * len * 0.66 + perpX * curveOff * 0.85;
    const cpy2 = y1 + Math.sin(angle) * len * 0.66 + perpY * curveOff * 0.85;
    const x2 = x1 + Math.cos(angle) * len + perpX * curveOff * 0.7;
    const y2 = y1 + Math.sin(angle) * len + perpY * curveOff * 0.7;

    const col = colorForDepth(b.depth, b.hueShift);
    // Alpha falloff at outer depths for graceful canopy edge
    const depthT = b.depth / MAX_DEPTH;
    const baseAlpha = b.depth <= 1 ? 0.95
                    : b.depth <= 5 ? lerp(0.92, 0.7, depthT)
                    : lerp(0.7, 0.35, (depthT - 0.5) * 2);

    // Determine stroke count by depth for performance
    const strokeCount = b.depth < 3 ? 5 : (b.depth < 6 ? 3 : 2);
    const thickBase = b.thickness;
    const thickTaper = lerp(thickBase, thickBase * 0.3, progress);

    for (let s = 0; s < strokeCount; s++) {
      // Deterministic offset from pre-computed seeds
      const seed = b.strokeSeeds[s] || 0;
      const normalizedS = strokeCount > 1 ? (s / (strokeCount - 1) - 0.5) : 0;

      // Perpendicular offset for multi-stroke spread
      const offsetAmt = normalizedS * thickBase * 0.35 + seed * thickBase * 0.08;
      const ox = perpX * offsetAmt;
      const oy = perpY * offsetAmt;

      // Color variation per stroke (darker on one side, lighter on other)
      const shift = normalizedS * 22 + b.colorShift * 0.3;
      const r = Math.max(0, Math.min(255, col.r + shift));
      const g = Math.max(0, Math.min(255, col.g + shift * 0.65));
      const bb = Math.max(0, Math.min(255, col.b + shift * 0.4));

      // Core stroke is full opacity, flanking strokes are softer
      const isCore = s === Math.floor(strokeCount / 2);
      const alpha = baseAlpha * (isCore ? 1.0 : 0.5);
      const thick = thickTaper * (isCore ? 1.0 : lerp(0.65, 0.45, Math.abs(normalizedS)));

      drawCtx.beginPath();
      drawCtx.moveTo(x1 + ox, y1 + oy);
      drawCtx.bezierCurveTo(
        cpx1 + ox, cpy1 + oy,
        cpx2 + ox, cpy2 + oy,
        x2 + ox, y2 + oy
      );
      drawCtx.strokeStyle = \`rgba($\{r | 0}, $\{g | 0}, $\{bb | 0}, $\{alpha})\`;
      drawCtx.lineWidth = thick;
      drawCtx.lineCap = 'round';
      drawCtx.stroke();
    }

    // Soft ambient glow on mid-to-deep branches
    if (b.depth >= 4 && b.depth < MAX_DEPTH - 1 && b.growthProgress > 0.8) {
      const glowAlpha = smoothstep(0.8, 1.0, b.growthProgress) * 0.06 * (b.depth / MAX_DEPTH);
      const glowR = Math.max(4, thickBase * 2);
      const grd = drawCtx.createRadialGradient(x2, y2, 0, x2, y2, glowR);
      grd.addColorStop(0, \`rgba($\{Math.min(255,col.r+30)|0}, $\{Math.min(255,col.g+20)|0}, $\{Math.min(255,col.b+15)|0}, $\{glowAlpha})\`);
      grd.addColorStop(0.5, \`rgba($\{col.r|0}, $\{col.g|0}, $\{col.b|0}, $\{glowAlpha * 0.25})\`);
      grd.addColorStop(1, \`rgba($\{col.r|0}, $\{col.g|0}, $\{col.b|0}, 0)\`);
      drawCtx.fillStyle = grd;
      drawCtx.beginPath();
      drawCtx.arc(x2, y2, glowR, 0, Math.PI * 2);
      drawCtx.fill();
    }

    // Delicate luminous tips (inherit branch color)
    if (b.tipDots.length > 0 && b.growthProgress > 0.92) {
      const tipFade = smoothstep(0.92, 1.0, b.growthProgress);
      // Brighten the branch color for the tip glow
      const tr = Math.min(255, col.r * 1.3 + 30);
      const tg2 = Math.min(255, col.g * 1.3 + 25);
      const tb = Math.min(255, col.b * 1.2 + 20);
      for (const dot of b.tipDots) {
        const dx = x2 + dot.ox;
        const dy = y2 + dot.oy;
        const da = tipFade * dot.alpha;
        const ds = dot.size;

        const tg = drawCtx.createRadialGradient(dx, dy, 0, dx, dy, ds * 2);
        tg.addColorStop(0, \`rgba($\{tr|0}, $\{tg2|0}, $\{tb|0}, $\{da * 0.6})\`);
        tg.addColorStop(0.5, \`rgba($\{col.r|0}, $\{col.g|0}, $\{col.b|0}, $\{da * 0.15})\`);
        tg.addColorStop(1, \`rgba($\{col.r|0}, $\{col.g|0}, $\{col.b|0}, 0)\`);
        drawCtx.fillStyle = tg;
        drawCtx.beginPath();
        drawCtx.arc(dx, dy, ds * 2, 0, Math.PI * 2);
        drawCtx.fill();
      }
    }
  }

  // --- Scene ---
  function drawScene(time) {
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);

    // Ambient canopy glow (warm halo behind tree crown)
    if (treeAlpha > 0.05) {
      const cx = W / 2, cy = H * 0.38;
      const canopyGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, H * 0.42);
      canopyGlow.addColorStop(0, \`rgba(60, 36, 12, $\{0.2 * treeAlpha})\`);
      canopyGlow.addColorStop(0.5, \`rgba(35, 20, 8, $\{0.08 * treeAlpha})\`);
      canopyGlow.addColorStop(1, 'rgba(10, 10, 10, 0)');
      ctx.fillStyle = canopyGlow;
      ctx.fillRect(0, 0, W, H);
    }

    // Ground glow
    if (treeAlpha > 0.05) {
      const groundGrad = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, H * 0.3);
      groundGrad.addColorStop(0, \`rgba(70, 42, 12, $\{0.1 * treeAlpha})\`);
      groundGrad.addColorStop(1, 'rgba(10, 10, 10, 0)');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, H * 0.55, W, H * 0.45);
    }

    recalcPositions(time);

    // Draw branches
    ctx.save();
    ctx.globalAlpha = treeAlpha;
    for (const b of allBranches) {
      drawBranch(ctx, b, time);
    }
    ctx.restore();

    // Particles
    updateParticles(time);
    ctx.save();
    drawParticles(ctx, treeAlpha);
    ctx.restore();

    // Vignette
    const vigGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.78);
    vigGrad.addColorStop(0, 'rgba(10, 10, 10, 0)');
    vigGrad.addColorStop(1, 'rgba(4, 4, 4, 0.3)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, W, H);
  }

  // --- State machine ---
  function frame(time) {
    // Decay shake
    if (shakeAmount > 0.01) shakeAmount *= 0.95;
    else shakeAmount = 0;

    switch (treeState) {
      case 'growing': {
        const done = updateBranches(time);
        drawScene(time);
        if (done) {
          treeState = 'holding';
          holdTimer = 0;
        }
        break;
      }
      case 'holding': {
        drawScene(time);
        holdTimer++;
        if (holdTimer >= HOLD_DURATION) {
          treeState = 'fading';
          fadeTimer = 0;
        }
        break;
      }
      case 'fading': {
        fadeTimer++;
        treeAlpha = Math.max(0, 1 - fadeTimer / FADE_DURATION);
        drawScene(time);
        if (fadeTimer >= FADE_DURATION) {
          treeState = 'waiting';
          waitTimer = 0;
        }
        break;
      }
      case 'waiting': {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, W, H);
        waitTimer++;
        if (waitTimer >= WAIT_DURATION) {
          createTree();
        }
        break;
      }
    }
    if (running) requestAnimationFrame(frame);
  }

  // --- Visibility pause ---
  let running = true;
  function startLoop() {
    if (!running) { running = true; requestAnimationFrame(frame); }
  }

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) { running = false; }
    else startLoop();
  });

  // Mouse: move to push the tree with wind, click to shake it
  var mouseX = W / 2, mouseY = H / 2, mouseActive = false;
  var windForce = 0; // -1 to 1, based on mouse x relative to tree
  var shakeAmount = 0;

  canvas.addEventListener('mousemove', function(e) {
    mouseX = e.clientX; mouseY = e.clientY; mouseActive = true;
    windForce = (mouseX - W / 2) / (W / 2); // -1 left, +1 right
  });
  canvas.addEventListener('mouseleave', function() { mouseActive = false; windForce = 0; });
  canvas.addEventListener('click', function() { shakeAmount = 1.0; });
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault(); mouseActive = true;
    mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY;
    windForce = (mouseX - W / 2) / (W / 2);
    shakeAmount = 1.0;
  }, { passive: false });
  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault(); mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY;
    windForce = (mouseX - W / 2) / (W / 2);
  }, { passive: false });
  canvas.addEventListener('touchend', function() { mouseActive = false; windForce = 0; });

  createTree();
  requestAnimationFrame(frame);

  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'param') {
      switch (e.data.name) {
        case 'GROWTH_SPEED_BASE': GROWTH_SPEED_BASE = e.data.value; break;
        case 'MAX_DEPTH': MAX_DEPTH = Math.round(e.data.value); break;
      }
    }
  });
})();
</script>
<script defer src="https://static.cloudflareinsights.com/beacon.min.js/v8c78df7c7c0f484497ecbca7046644da1771523124516" integrity="sha512-8DS7rgIrAmghBFwoOTujcf6D9rXvH8xm8JQ1Ja01h9QX8EzXldiszufYa4IFfKdLUKTTrnSFXLDkUEOTrZQ8Qg==" data-cf-beacon='{"version":"2024.11.0","token":"216c03e5eb1b42998a91f716785010f9","r":1,"server_timing":{"name":{"cfCacheStatus":true,"cfEdge":true,"cfExtPri":true,"cfL4":true,"cfOrigin":true,"cfSpeedBrain":true},"location_startswith":null}}' crossorigin="anonymous"></script>
</body>
</html>
`,r={speed:1,size:1,particleAmount:1,opacity:1,hue:0,saturation:1,brightness:1};function o(e,t,a){return Math.min(a,Math.max(t,e))}e.s(["GENERATIVE_TREE_DEFAULTS",0,r,"GenerativeTree",0,function({speed:e=r.speed,size:n=r.size,particleAmount:s=r.particleAmount,opacity:l=r.opacity,hue:c=r.hue,saturation:d=r.saturation,brightness:h=r.brightness,className:u="",style:f}){let p=(0,a.useRef)(null),[m,g]=(0,a.useState)(!0),[v,x]=(0,a.useState)(()=>typeof document>"u"||!document.hidden),b=o(e,0,3),w=!m||!v||0===b,y=(0,a.useMemo)(()=>{let e,t;return e=Math.max(0,Math.round(50*o(s,0,2))),t=1/o(n,.65,1.5),i.replace(/<script[^>]+cloudflareinsights\.com[^>]*><\/script>/gi,"").replace("</head>",`<style data-generative-tree-focus>
html, body, canvas { width: 100%; height: 100%; margin: 0; overflow: hidden; background: #0a0a0a; }
.label { display: none !important; }
</style><script data-generative-tree-controls>
(function () {
  var nativeFrame = window.requestAnimationFrame.bind(window);
  var clock = { last: null, time: null };
  window.__GENERATIVE_TREE_CONTROLS = { speed: 1, paused: false };
  window.requestAnimationFrame = function (callback) {
    return nativeFrame(function (realTime) {
      var state = window.__GENERATIVE_TREE_CONTROLS;
      if (clock.last === null) {
        clock.last = realTime;
        clock.time = realTime;
      } else {
        if (!state.paused) clock.time += (realTime - clock.last) * state.speed;
        clock.last = realTime;
      }
      callback(clock.time);
    });
  };
  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'generative-tree-controls') return;
    var next = event.data.controls || {};
    if (Number.isFinite(next.speed)) {
      window.__GENERATIVE_TREE_CONTROLS.speed = Math.max(0, Math.min(3, next.speed));
    }
    window.__GENERATIVE_TREE_CONTROLS.paused = Boolean(next.paused);
  });
})();
</script></head>`).replace("const PARTICLE_COUNT = 50;",`const PARTICLE_COUNT = ${e};`).replace("const _pad = parseFloat(new URLSearchParams(location.search).get('p')) || 1;",`const _pad = ${t.toFixed(4)};`).replace(`function frame(time) {
    // Decay shake`,`function frame(time) {
    if (window.__GENERATIVE_TREE_CONTROLS.paused) { requestAnimationFrame(frame); return; }

    // Decay shake`).replace("b.growthProgress = Math.min(1, b.growthProgress + b.growthSpeed);","b.growthProgress = Math.min(1, b.growthProgress + b.growthSpeed * window.__GENERATIVE_TREE_CONTROLS.speed);").replace("holdTimer++;","holdTimer += window.__GENERATIVE_TREE_CONTROLS.speed;").replace("fadeTimer++;","fadeTimer += window.__GENERATIVE_TREE_CONTROLS.speed;").replace("waitTimer++;","waitTimer += window.__GENERATIVE_TREE_CONTROLS.speed;").replace(`  createTree();
  requestAnimationFrame(frame);`,`  function startTreeWhenSized() {
    resize();
    if (W <= 0 || H <= 0) {
      requestAnimationFrame(startTreeWhenSized);
      return;
    }
    createTree();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(startTreeWhenSized);`)},[s,n]),E=(0,a.useCallback)(()=>{p.current?.contentWindow?.postMessage({type:"generative-tree-controls",controls:{speed:b,paused:w}},"*")},[w,b]);return(0,a.useEffect)(()=>{let e=p.current;if(!e||typeof IntersectionObserver>"u")return;let t=new IntersectionObserver(([e])=>g(e?.isIntersecting??!0));return t.observe(e),()=>t.disconnect()},[]),(0,a.useEffect)(()=>{if(typeof document>"u")return;let e=()=>x(!document.hidden);return document.addEventListener("visibilitychange",e),()=>document.removeEventListener("visibilitychange",e)},[]),(0,a.useEffect)(()=>{E()},[E,y]),(0,t.jsx)("div",{className:`threeui-background generative-tree${u?` ${u}`:""}`,style:{background:"#0a0a0a",pointerEvents:"auto",...f},children:(0,t.jsx)("iframe",{ref:p,title:"Generative Tree background",srcDoc:y,sandbox:"allow-scripts",onLoad:E,"aria-hidden":"true",tabIndex:-1,style:{position:"absolute",inset:0,display:"block",width:"100%",height:"100%",border:0,background:"#0a0a0a",opacity:o(l,.05,1),filter:`hue-rotate(${o(c,-180,180)}deg) saturate(${o(d,0,2)}) brightness(${o(h,.35,1.8)})`}})})}],96369)},70851,e=>{var t=e.i(43476),a=e.i(71645),i=e.i(81487);let r=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`,o=`
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_wave_scale;
uniform float u_variation;
uniform float u_glow;
uniform float u_vignette;
varying vec2 vUv;
float hash(float n) { return fract(sin(n) * 1e4); }
float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hash(i), hash(i + 1.0), u);
}
void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float yPos = st.y;
  float wave1 = sin(st.x * 3.0 + u_time * 0.5) * 0.1 * u_wave_scale;
  float wave2 = sin(st.x * 5.0 - u_time * 0.3) * 0.05 * u_wave_scale;
  float combinedWave = wave1 + wave2;
  float intensity = smoothstep(0.4, -0.1, yPos + combinedWave);
  float variation = noise(st.x * 2.0 + u_time * 0.1) * 0.5 + 0.5;
  intensity *= variation * 1.5 * u_variation;
  vec3 color = vec3(0.0, 0.02, 0.0);
  vec3 glowColor1 = vec3(0.05, 0.8, 0.2);
  vec3 glowColor2 = vec3(0.0, 1.0, 0.5);
  vec3 finalGlow = mix(glowColor1, glowColor2, st.x + sin(u_time*0.2)*0.5);
  color += finalGlow * pow(intensity, 1.5) * 1.2 * u_glow;
  float vignette = mix(1.0, smoothstep(1.2, 0.5, length(st - vec2(0.5, 0.0))), u_vignette);
  color *= vignette;
  gl_FragColor = vec4(color, 1.0);
}
`,n={speed:1,waveScale:1,variation:1,glow:1,vignette:1,hue:0};e.s(["EMERALD_HORIZON_DEFAULTS",0,n,"EmeraldHorizonBackground",0,function({className:e="",...s}){let l=(0,a.useRef)(null),c=(0,a.useRef)(null),d=(0,a.useRef)({...n,...s});return d.current={...n,...s},(0,a.useEffect)(()=>{let e=l.current,t=c.current;if(!e||!t)return;let a=new i.V,n=new i.W(-1,1,1,-1,0,1),s=new i.a({canvas:t,alpha:!0,antialias:!0});s.setPixelRatio(Math.min(window.devicePixelRatio,2));let h={u_time:{value:0},u_resolution:{value:new i.Y(1,1)},u_wave_scale:{value:1},u_variation:{value:1},u_glow:{value:1},u_vignette:{value:1}},u=new i.v({vertexShader:r,fragmentShader:o,uniforms:h,depthWrite:!1,depthTest:!1}),f=new i.N(2,2);a.add(new i.U(f,u));let p=0,m=!0,g=performance.now(),v=()=>{let t=e.getBoundingClientRect();s.setSize(t.width,t.height,!1),h.u_resolution.value.set(t.width,t.height)},x=e=>{let t=d.current;h.u_time.value=(e-g)*.001*t.speed,h.u_wave_scale.value=t.waveScale,h.u_variation.value=t.variation,h.u_glow.value=t.glow,h.u_vignette.value=t.vignette,s.render(a,n),p=m&&!document.hidden?requestAnimationFrame(x):0},b=new ResizeObserver(v),w=new IntersectionObserver(([e])=>{(m=e?.isIntersecting??!0)&&!p&&(p=requestAnimationFrame(x)),!m&&p&&(cancelAnimationFrame(p),p=0)});return b.observe(e),w.observe(e),v(),p=requestAnimationFrame(x),()=>{p&&cancelAnimationFrame(p),b.disconnect(),w.disconnect(),f.dispose(),u.dispose(),s.dispose()}},[]),(0,t.jsx)("div",{ref:l,className:`threeui-background emerald-horizon${e?` ${e}`:""}`,children:(0,t.jsx)("canvas",{ref:c,style:{filter:`hue-rotate(${d.current.hue}deg)`}})})}],70851)},80608,e=>{var t=e.i(43476);let a={variant:"primary",mode:"dark",label:"Get your card",ring:!0,hue:0,saturation:1,brightness:1};function i(e,t,a){return Math.min(a,Math.max(t,e))}e.s(["LUMEN_CTA_DEFAULTS",0,a,"LumenCta",0,function({variant:e=a.variant,mode:r=a.mode,label:o=a.label,ring:n=a.ring,hue:s=a.hue,saturation:l=a.saturation,brightness:c=a.brightness,disabled:d=!1,type:h="button",onClick:u,className:f="",style:p}){let m="ghost"===e?"ghost":"primary";return(0,t.jsx)("div",{className:`lumen-cta lumen-cta--${"light"===r?"light":"dark"}${f?` ${f}`:""}`,"data-variant":m,style:{"--lumen-cta-hue":`${i(s,-180,180)}deg`,"--lumen-cta-saturation":i(l,0,2),"--lumen-cta-brightness":i(c,.35,1.65),...p},children:(0,t.jsxs)("button",{className:`lumen-cta__button${"ghost"===m?" lumen-cta__button--ghost":""}`,type:h,disabled:d,onClick:u,children:[o,n?(0,t.jsx)("i",{className:"lumen-cta__ring","aria-hidden":"true"}):null]})})}])},16667,e=>{var t=e.i(43476),a=e.i(71645),i=e.i(81487);let r={speed:1,particleSize:.015,particleOpacity:.8,orbitOpacity:.25,scale:1,haloOpacity:.2,hue:0};e.s(["OrbitalSphereBackground",0,function({className:e="",...o}){let n=(0,a.useRef)(null),s=(0,a.useRef)(null),l=(0,a.useRef)({...r,...o});return l.current={...r,...o},(0,a.useEffect)(()=>{let e=n.current,t=s.current;if(!e||!t)return;let a=function(e,t){let a=new i.V,r=new i.m(45,1,.1,1e3),o=new i.a({canvas:e,alpha:!0,antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio,2));let n=new i.x;a.add(n);let s=new Float32Array(45e3),l=new Float32Array(45e3),c=new i.G(0xa78bfa),d=new i.G(7346805),h=0;for(let e=0;e<15e3;e+=1){let t=Math.acos(-1+2*e/15e3),a=Math.sqrt(15e3*Math.PI)*t,i=2.2*Math.cos(a)*Math.sin(t),r=2.2*Math.sin(a)*Math.sin(t),o=2.2*Math.cos(t),n=Math.sin(3.5*i)*Math.cos(3.5*r)*Math.sin(3.5*o)+.4*Math.cos(6*i);if(n<=-.1)continue;let u=1+.1*n;s[3*h]=i*u,s[3*h+1]=r*u,s[3*h+2]=o*u;let f=d.clone().lerp(c,n>.5?1:.3);l[3*h]=f.r,l[3*h+1]=f.g,l[3*h+2]=f.b,h+=1}let u=new i.z;u.setAttribute("position",new i.L(s.slice(0,3*h),3)),u.setAttribute("color",new i.L(l.slice(0,3*h),3));let f=new i.h({size:.015,vertexColors:!0,transparent:!0,opacity:.8,blending:i.k,depthWrite:!1});n.add(new i.j(u,f));let p=new i.T({color:9133302,transparent:!0,opacity:.25,blending:i.k}),m=[],g=[],v=[],x=[],b=1;for(let e=0;e<6;e+=1){let t=new i.z,a=[],r=2.2*(1.08+.2*Math.random());for(let e=0;e<=90;e+=1){let t=e/90*Math.PI*2;a.push(Math.cos(t)*r,Math.sin(t)*r,.1*Math.sin(4*t))}t.setAttribute("position",new i.u(a,3)),m.push(t);let o=new i.R(t,p);if(o.rotation.x=Math.random()*Math.PI*2,o.rotation.y=Math.random()*Math.PI*2,n.add(o),e%2!=0){let e=new i.c(.025,16,16),t=new i._({color:0xd946ef}),a=new i.U(e,t),n=Math.random()*Math.PI*2;a.position.set(Math.cos(n)*r,Math.sin(n)*r,0),o.add(a);let s=new i.c(.08,16,16),l=new i._({color:0xc084fc,transparent:!0,opacity:.2,blending:i.k}),c=new i.U(s,l);a.add(c),g.push(e,s),v.push(t,l),x.push(l)}}return{resize(e,a){r.aspect=e/Math.max(1,a),r.updateProjectionMatrix(),o.setSize(e,a,!1);let i=t();e>=1024?(n.position.set(2.5,0,-2),b=1.15,r.position.z=5.5):(n.position.set(0,-1,-3),b=1,r.position.z=6.5),n.scale.setScalar(b*i.scale)},render(){let e=t();f.size=e.particleSize,f.opacity=e.particleOpacity,p.opacity=e.orbitOpacity,x.forEach(t=>t.opacity=e.haloOpacity),n.scale.setScalar(b*e.scale),n.rotation.y+=8e-4*e.speed,n.rotation.x+=3e-4*e.speed,n.children.forEach((t,a)=>{"Line"===t.type&&(t.rotation.z+=4e-4*e.speed*(a%2==0?1:-1))}),o.render(a,r)},dispose(){u.dispose(),f.dispose(),p.dispose(),m.forEach(e=>e.dispose()),g.forEach(e=>e.dispose()),v.forEach(e=>e.dispose()),o.dispose()}}}(t,()=>l.current),r=0,o=!0,c=()=>{let t=e.getBoundingClientRect();a.resize(t.width,t.height),a.render()},d=()=>{a.render(),r=o&&!document.hidden?requestAnimationFrame(d):0},h=new ResizeObserver(c),u=new IntersectionObserver(([e])=>{(o=e?.isIntersecting??!0)&&!r&&(r=requestAnimationFrame(d)),!o&&r&&(cancelAnimationFrame(r),r=0)});return h.observe(e),u.observe(e),c(),r=requestAnimationFrame(d),()=>{r&&cancelAnimationFrame(r),h.disconnect(),u.disconnect(),a.dispose()}},[]),(0,t.jsx)("div",{ref:n,className:`threeui-background orbital-sphere${e?` ${e}`:""}`,children:(0,t.jsx)("canvas",{ref:s,style:{filter:`hue-rotate(${l.current.hue}deg)`}})})}],16667)},49056,e=>{var t=e.i(43476),a=e.i(71645);let i=`
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `,r=`
        precision highp float;
        uniform vec2 resolution;
        uniform float time;
        uniform vec2 pointer;

        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float ribbon(vec2 uv, float offset, float width, float phase) {
          float y = 0.55 + 0.20 * sin((uv.x * 2.15) + phase) + 0.045 * sin((uv.x * 7.0) - phase * 0.7);
          float d = abs(uv.y - y - offset);
          return exp(-(d * d) / width);
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / resolution.xy;
          vec2 p = uv;
          p.x *= resolution.x / resolution.y;

          float t = time * 0.22;
          float drift = (pointer.x - 0.5) * 0.06;

          float rightFade = smoothstep(0.28, 0.72, uv.x);
          float centerDark = 1.0 - smoothstep(0.0, 0.88, distance(uv, vec2(0.18, 0.48)));

          float r1 = ribbon(vec2(uv.x + drift, uv.y), 0.03, 0.0065, t + 0.9);
          float r2 = ribbon(vec2(uv.x - drift * 0.7, uv.y), -0.23, 0.0085, t + 3.25);
          float r3 = ribbon(vec2(uv.x + drift * 0.4, uv.y), 0.25, 0.014, t + 1.85);

          float glow = r1 * 1.14 + r2 * 1.05 + r3 * 0.48;

          vec3 teal = vec3(0.17, 0.83, 0.75);
          vec3 cyan = vec3(0.22, 0.82, 0.96);
          vec3 indigo = vec3(0.39, 0.38, 0.92);
          vec3 purple = vec3(0.66, 0.33, 0.98);
          vec3 blue = vec3(0.23, 0.51, 0.96);

          vec3 col = vec3(0.0);
          col += cyan * r1 * 0.92;
          col += teal * r1 * 0.62;
          col += indigo * r3 * 0.42;
          col += blue * r2 * 0.66;
          col += purple * (r2 + r3) * 0.30;

          float bloom = exp(-pow(distance(uv, vec2(0.76, 0.40 + 0.035 * sin(t))), 2.0) / 0.050);
          bloom += exp(-pow(distance(uv, vec2(0.71, 0.75 + 0.025 * cos(t))), 2.0) / 0.030);
          col += vec3(0.42, 0.85, 1.0) * bloom * 0.34;

          vec2 grid = fract(gl_FragCoord.xy / 7.0) - 0.5;
          float dotShape = smoothstep(0.29, 0.11, length(grid));
          float noise = hash(floor(gl_FragCoord.xy / 7.0));
          float scan = 0.72 + 0.28 * sin((uv.x + uv.y) * 38.0 + time * 1.3);
          float dots = dotShape * (0.48 + 0.52 * noise) * scan;

          float micro = hash(gl_FragCoord.xy + time) * 0.035;
          float alpha = clamp((glow * 1.55 + bloom * 0.50) * dots * rightFade, 0.0, 1.0);
          alpha *= 1.0 - centerDark * 0.56;

          vec3 base = vec3(0.005, 0.005, 0.005);
          vec3 finalColor = mix(base, col, clamp(alpha * 1.55, 0.0, 1.0));
          finalColor += micro * rightFade;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,o={speed:1,pointerAmount:1,smoothing:.035,brightness:1,opacity:1,hue:0,saturation:1};function n(e,t,a){let i=e.createShader(t);if(!i)throw Error("Unable to create Axiom shader");if(e.shaderSource(i,a),e.compileShader(i),!e.getShaderParameter(i,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(i)??"Axiom shader compilation failed");return i}e.s(["RIBBON_FIELD_DEFAULTS",0,o,"RibbonFieldBackground",0,function({className:e="",...s}){let l=(0,a.useRef)(null),c=(0,a.useRef)(null),d=(0,a.useRef)({...o,...s});d.current={...o,...s},(0,a.useEffect)(()=>{let e=l.current,t=c.current;if(!e||!t)return;let a=t.getContext("webgl",{alpha:!0,antialias:!1,premultipliedAlpha:!1});if(!a)return;let o=n(a,a.VERTEX_SHADER,i),s=n(a,a.FRAGMENT_SHADER,r),h=a.createProgram();if(!h)return;if(a.attachShader(h,o),a.attachShader(h,s),a.linkProgram(h),!a.getProgramParameter(h,a.LINK_STATUS))throw Error(a.getProgramInfoLog(h)??"Axiom program link failed");a.useProgram(h);let u=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,u),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),a.STATIC_DRAW);let f=a.getAttribLocation(h,"position");a.enableVertexAttribArray(f),a.vertexAttribPointer(f,2,a.FLOAT,!1,0,0);let p=a.getUniformLocation(h,"resolution"),m=a.getUniformLocation(h,"time"),g=a.getUniformLocation(h,"pointer"),v=.72,x=.42,b=.72,w=.42,y=0,E=!0,S=performance.now(),A=t=>{let a=e.getBoundingClientRect();b=.72+((t.clientX-a.left)/Math.max(a.width,1)-.72)*d.current.pointerAmount,w=.42+(1-(t.clientY-a.top)/Math.max(a.height,1)-.42)*d.current.pointerAmount},T=()=>{let i=e.getBoundingClientRect(),r=Math.min(window.devicePixelRatio||1,2);t.width=Math.max(1,Math.floor(i.width*r)),t.height=Math.max(1,Math.floor(i.height*r)),a.viewport(0,0,t.width,t.height),a.uniform2f(p,t.width,t.height)},M=e=>{let t=d.current;v+=(b-v)*t.smoothing,x+=(w-x)*t.smoothing,a.uniform1f(m,(e-S)*.001*t.speed),a.uniform2f(g,v,x),a.drawArrays(a.TRIANGLES,0,6),y=E&&!document.hidden?requestAnimationFrame(M):0},_=new ResizeObserver(T),R=new IntersectionObserver(([e])=>{(E=e?.isIntersecting??!0)&&!y&&(y=requestAnimationFrame(M)),!E&&y&&(cancelAnimationFrame(y),y=0)});return _.observe(e),R.observe(e),e.addEventListener("pointermove",A,{passive:!0}),T(),y=requestAnimationFrame(M),()=>{y&&cancelAnimationFrame(y),_.disconnect(),R.disconnect(),e.removeEventListener("pointermove",A),a.deleteBuffer(u),a.deleteShader(o),a.deleteShader(s),a.deleteProgram(h)}},[]);let h=d.current;return(0,t.jsx)("div",{ref:l,className:`threeui-background ribbon-field${e?` ${e}`:""}`,children:(0,t.jsx)("canvas",{ref:c,style:{opacity:h.opacity,filter:`hue-rotate(${h.hue}deg) saturate(${h.saturation}) brightness(${h.brightness})`}})})}],49056)},46072,e=>{var t=e.i(43476),a=e.i(71645);let i=`
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,r=`
                uniform float u_time;
                uniform vec2 u_resolution;
                uniform float u_interactive_fidelity;
                varying vec2 vUv;

                mat2 rotate2d(float _angle){
                    return mat2(cos(_angle),-sin(_angle),
                                sin(_angle),cos(_angle));
                }

                void main() {
                    vec2 p = vUv * 2.0 - 1.0;
                    p.x *= u_resolution.x / u_resolution.y;
                    p = rotate2d(0.55) * p;

                    vec3 color = vec3(0.0);
                    float spread = 0.06 * (0.3 + u_interactive_fidelity * 0.7);

                    for(int i = 0; i < 3; i++) {
                        float offset = float(1 - i) * spread;
                        float y = p.y + offset + (sin(p.x * 2.5 - u_time * 1.5) * 0.12);
                        float wave = smoothstep(0.85, 0.99, sin(y * 6.0 + u_time * 2.0) * 0.5 + 0.5);
                        
                        // Modulating color mixing logic for the violet-indigo theme
                        if(i == 0) color.r += wave * 1.2; 
                        if(i == 1) color.g += wave * 0.5; 
                        if(i == 2) color.b += wave * 1.8; 
                    }

                    float vignette = exp(-length(vUv * 2.0 - 1.0) * 0.8);
                    color *= vignette;

                    gl_FragColor = vec4(color, 1.0);
                }
            `,o={speed:1,fidelity:.5,scale:1,brightness:1,opacity:1,hue:0,saturation:1};function n(e,t,a){let i=e.createShader(t);if(!i)throw Error("Unable to create Stream Convergence shader");if(e.shaderSource(i,a),e.compileShader(i),!e.getShaderParameter(i,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(i)??"Stream Convergence shader compilation failed");return i}e.s(["STREAM_CONVERGENCE_DEFAULTS",0,o,"StreamConvergenceBackground",0,function({className:e="",...s}){let l=(0,a.useRef)(null),c=(0,a.useRef)(null),d=(0,a.useRef)({...o,...s});d.current={...o,...s},(0,a.useEffect)(()=>{let e=l.current,t=c.current;if(!e||!t)return;let a=t.getContext("webgl",{alpha:!0,antialias:!1});if(!a)return;let o=n(a,a.VERTEX_SHADER,i),s=n(a,a.FRAGMENT_SHADER,`precision highp float;
${r}`),h=a.createProgram();if(!h)return;if(a.attachShader(h,o),a.attachShader(h,s),a.linkProgram(h),!a.getProgramParameter(h,a.LINK_STATUS))throw Error(a.getProgramInfoLog(h)??"Stream Convergence program link failed");a.useProgram(h);let u=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,u),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),a.STATIC_DRAW);let f=a.getAttribLocation(h,"position");a.enableVertexAttribArray(f),a.vertexAttribPointer(f,2,a.FLOAT,!1,0,0);let p=a.getUniformLocation(h,"u_time"),m=a.getUniformLocation(h,"u_resolution"),g=a.getUniformLocation(h,"u_interactive_fidelity"),v=0,x=!0,b=()=>{let i=e.getBoundingClientRect(),r=Math.min(window.devicePixelRatio||1,2);t.width=Math.max(1,Math.round(i.width*r)),t.height=Math.max(1,Math.round(i.height*r)),a.viewport(0,0,t.width,t.height),a.uniform2f(m,t.width,t.height)},w=e=>{let t=d.current;a.uniform1f(p,3e-4*e*t.speed),a.uniform1f(g,t.fidelity),a.drawArrays(a.TRIANGLES,0,6),v=x&&!document.hidden?requestAnimationFrame(w):0},y=new ResizeObserver(b),E=new IntersectionObserver(([e])=>{(x=e?.isIntersecting??!0)&&!v&&(v=requestAnimationFrame(w)),!x&&v&&(cancelAnimationFrame(v),v=0)});return y.observe(e),E.observe(e),b(),v=requestAnimationFrame(w),()=>{v&&cancelAnimationFrame(v),y.disconnect(),E.disconnect(),a.deleteBuffer(u),a.deleteShader(o),a.deleteShader(s),a.deleteProgram(h)}},[]);let h=d.current;return(0,t.jsx)("div",{ref:l,className:`threeui-background stream-convergence${e?` ${e}`:""}`,children:(0,t.jsx)("canvas",{ref:c,style:{opacity:h.opacity,filter:`hue-rotate(${h.hue}deg) saturate(${h.saturation}) brightness(${h.brightness})`,transform:`scale(${h.scale})`}})})}],46072)}])})();