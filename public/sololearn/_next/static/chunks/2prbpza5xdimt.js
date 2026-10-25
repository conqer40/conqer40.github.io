(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,93025,e=>{"use strict";let t=`attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`,r=`precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uNoise;
uniform float uLevels;

float hash(vec2 p){ p = fract(p * vec2(127.1, 311.7)); p += dot(p, p + 34.23); return fract(p.x * p.y); }

float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p){
  float sum = 0.0, amp = 0.5;
  for (int i = 0; i < 5; i++){ sum += amp * vnoise(p); p = p * 2.03 + 11.7; amp *= 0.5; }
  return sum;
}

/* the classic recursive Bayer construction: each level halves the cell and adds a
   quarter of the coarser threshold, which is cheaper than indexing a matrix and
   avoids the dynamic array access GLSL ES 1.0 will not guarantee */
float bayer2(vec2 a){ a = floor(a); return fract(a.x * 0.5 + a.y * a.y * 0.75); }
float bayer4(vec2 a){ return bayer2(a * 0.5) * 0.25 + bayer2(a); }
float bayer8(vec2 a){ return bayer4(a * 0.5) * 0.25 + bayer2(a); }

vec3 stop(float index){
  if (index < 0.5) return vec3(0.043, 0.035, 0.109);
  if (index < 1.5) return vec3(0.106, 0.063, 0.220);
  if (index < 2.5) return vec3(0.212, 0.090, 0.325);
  if (index < 3.5) return vec3(0.396, 0.129, 0.376);
  if (index < 4.5) return vec3(0.612, 0.180, 0.376);
  if (index < 5.5) return vec3(0.827, 0.298, 0.325);
  if (index < 6.5) return vec3(0.945, 0.502, 0.286);
  return vec3(0.988, 0.784, 0.494);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float t = uTime;

  /* two counter-drifting noise sheets read as slow weather rather than as a
     single scrolling texture */
  vec2 cloud = vec2(uv.x * 3.4, uv.y * 2.1);
  float weather = fbm(cloud + vec2(t * 0.055, t * -0.021));
  weather = mix(weather, fbm(cloud * 1.9 + vec2(-t * 0.032, t * 0.044)), 0.42);

  /* the composition is three bands: a deep sky that warms downward, a hot
     horizon at y=0.30, and a dark ground the readout chrome can sit on. The
     falloffs are deliberately wide — a steep ramp stacks the palette steps into
     thin horizontal bars the ordered dither is too small to break up */
  float sky = smoothstep(0.98, 0.20, uv.y) * 0.36;
  float heat = smoothstep(0.60, 0.16, uv.y) * 0.32;
  float ground = smoothstep(0.26, 0.08, uv.y);
  float sun = smoothstep(0.38, 0.0, length((uv - vec2(0.5, 0.29)) * vec2(0.70, 1.5))) * 0.20;
  /* the three terms sum to just under 1.0 at the horizon: pushing past it clips
     the whole band to the last palette stop and the dither texture disappears */
  float field = 0.11 + sky + heat + sun - ground * 0.80 + (weather - 0.5) * 0.82 * uNoise;

  /* static lives before quantisation so it moves the pixel across a palette step
     instead of tinting it */
  float grain = hash(floor(gl_FragCoord.xy) + floor(t * 12.0)) - 0.5;
  field += grain * 0.055 * uNoise;
  field *= 1.0 - 0.34 * smoothstep(0.45, 1.05, length((uv - vec2(0.5, 0.46)) * vec2(1.06, 1.0)));

  float levels = max(uLevels, 2.0);
  float dither = bayer8(gl_FragCoord.xy) - 0.5;
  float quantised = clamp(field + dither / levels, 0.0, 0.9999);
  /* no scanline here: one drawing-buffer row is pixelSize screen rows tall,
     so darkening alternate rows draws chunky bars rather than a raster. The CRT
     line structure is a screen-resolution CSS overlay instead. */
  gl_FragColor = vec4(stop(floor(quantised * levels) * (7.0 / (levels - 1.0))), 1.0);
}`;function a(e,t,r){let a=e.createShader(t);return a?(e.shaderSource(a,r),e.compileShader(a),e.getShaderParameter(a,e.COMPILE_STATUS)?a:(console.warn("Retro pixel field shader failed to compile.",e.getShaderInfoLog(a)),e.deleteShader(a),null)):null}let o={resize:()=>{},render:()=>{},dispose:()=>{}};e.s(["createRetroPixelField",0,function(e,i){let n=e.getContext("webgl",{antialias:!1,alpha:!1,depth:!1,preserveDrawingBuffer:!1});if(!n)return o;let s=n.createProgram(),l=a(n,n.VERTEX_SHADER,t),f=a(n,n.FRAGMENT_SHADER,r);if(!s||!l||!f)return o;if(n.attachShader(s,l),n.attachShader(s,f),n.linkProgram(s),!n.getProgramParameter(s,n.LINK_STATUS))return console.warn("Retro pixel field program failed to link.",n.getProgramInfoLog(s)),o;n.useProgram(s);let h=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,h),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW);let u=n.getAttribLocation(s,"aPos"),d=n.getUniformLocation(s,"uRes"),c=n.getUniformLocation(s,"uTime"),m=n.getUniformLocation(s,"uNoise"),p=n.getUniformLocation(s,"uLevels"),v=1,g=1,x=performance.now(),b=0,y=x;return{resize:(t,r)=>{let a=i();v=Math.max(2,Math.round(t/Math.max(1,a.pixelSize))),g=Math.max(2,Math.round(r/Math.max(1,a.pixelSize))),(e.width!==v||e.height!==g)&&(e.width=v,e.height=g,n.viewport(0,0,v,g))},render:(e=performance.now())=>{let t=i();b+=.001*Math.min(96,e-y)*t.speed,y=e,n.useProgram(s),n.bindBuffer(n.ARRAY_BUFFER,h),n.enableVertexAttribArray(u),n.vertexAttribPointer(u,2,n.FLOAT,!1,0,0),n.uniform2f(d,v,g),n.uniform1f(c,b),n.uniform1f(m,t.noise),n.uniform1f(p,t.levels),n.drawArrays(n.TRIANGLES,0,3)},dispose:()=>{n.deleteBuffer(h),n.deleteProgram(s),n.deleteShader(l),n.deleteShader(f)}}}])}]);