(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,42968,e=>{"use strict";var o=e.i(81487);let t=`precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;

vec3 bloom(vec2 uv, vec2 centre, float radius, vec3 tint){
  float aspect = uRes.x / max(uRes.y, 1.0);
  float d = length((uv - centre) * vec2(aspect, 1.0));
  float falloff = smoothstep(radius, 0.0, d);
  return tint * falloff * falloff;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float t = uTime * 0.17;
  /* the base tone matters more than the blooms: refraction samples the whole
     frame, so a backdrop with black regions makes beads read as dark holes */
  vec3 col = vec3(0.085, 0.095, 0.125);
  col += mix(vec3(0.0), vec3(0.05, 0.06, 0.10), uv.y);
  col += bloom(uv, vec2(0.23 + 0.055 * sin(t * 0.9), 0.76 + 0.045 * cos(t * 0.7)), 0.86, vec3(0.24, 0.42, 0.96)) * 0.92;
  col += bloom(uv, vec2(0.82 + 0.05 * cos(t * 0.8), 0.34 + 0.055 * sin(t * 1.1)), 0.80, vec3(0.66, 0.30, 0.88)) * 0.80;
  col += bloom(uv, vec2(0.50 + 0.07 * sin(t * 0.6 + 1.7), 0.10 + 0.04 * cos(t * 0.9)), 0.74, vec3(0.14, 0.68, 0.70)) * 0.60;
  col += bloom(uv, vec2(0.10 + 0.04 * cos(t * 1.2), 0.16 + 0.05 * sin(t * 0.8)), 0.58, vec3(0.98, 0.60, 0.40)) * 0.34;
  col += bloom(uv, vec2(0.5 + uPointer.x * 0.20, 0.56 + uPointer.y * 0.16), 0.46, vec3(0.74, 0.78, 0.96)) * 0.30;
  float vignette = smoothstep(1.34, 0.30, length((uv - 0.5) * vec2(1.05, 1.0)));
  col *= mix(0.62, 1.0, vignette);
  gl_FragColor = vec4(col, 1.0);
}`,i=`varying vec3 vNormalView;
varying vec3 vViewPos;
varying vec4 vScreen;

void main(){
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormalView = normalize(normalMatrix * normal);
  vViewPos = mvPosition.xyz;
  vScreen = projectionMatrix * mvPosition;
  gl_Position = vScreen;
}`,a=`precision highp float;
uniform sampler2D uBackdrop;
uniform float uThickness;
uniform float uDispersion;
uniform float uSpecular;
uniform float uRim;
uniform vec3 uTint;
uniform vec3 uLight;
varying vec3 vNormalView;
varying vec3 vViewPos;
varying vec4 vScreen;

void main(){
  vec2 screenUV = (vScreen.xy / vScreen.w) * 0.5 + 0.5;
  vec3 N = normalize(vNormalView);
  vec3 V = normalize(-vViewPos);
  vec3 I = -V;
  float fresnel = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.4);

  vec2 offsetR = refract(I, N, 1.0 / (1.44 - uDispersion)).xy * uThickness;
  vec2 offsetG = refract(I, N, 1.0 / 1.44).xy * uThickness;
  vec2 offsetB = refract(I, N, 1.0 / (1.44 + uDispersion)).xy * uThickness;

  vec3 col;
  col.r = texture2D(uBackdrop, clamp(screenUV + offsetR, 0.002, 0.998)).r;
  col.g = texture2D(uBackdrop, clamp(screenUV + offsetG, 0.002, 0.998)).g;
  col.b = texture2D(uBackdrop, clamp(screenUV + offsetB, 0.002, 0.998)).b;
  col *= uTint;

  vec3 L = normalize(uLight);
  vec3 H = normalize(L + V);
  float ndoth = max(dot(N, H), 0.0);
  col += pow(ndoth, 150.0) * uSpecular;
  col += pow(ndoth, 16.0) * uSpecular * 0.11;
  /* a second, dimmer key from below keeps the underside of every bead alive */
  vec3 H2 = normalize(normalize(vec3(0.55, -0.7, 0.45)) + V);
  col += pow(max(dot(N, H2), 0.0), 44.0) * uSpecular * 0.22;
  col += fresnel * uRim * vec3(0.86, 0.90, 1.0);

  /* aerial perspective: the small far beads dissolve into the plate they float
     over instead of reading as hard specks */
  float haze = smoothstep(7.4, 11.4, -vViewPos.z);
  col = mix(col, texture2D(uBackdrop, screenUV).rgb, haze * 0.7);
  gl_FragColor = vec4(col, 1.0);
}`;e.s(["createGlassParticleField",0,function(e,r){let n,s=new o.a({canvas:e,antialias:!0,alpha:!1});s.setPixelRatio(Math.min(window.devicePixelRatio,2)),s.setClearColor(658191,1);let l=new o.V,c=new o.W(-1,1,1,-1,0,1),u={uRes:{value:new o.Y(1,1)},uTime:{value:0},uPointer:{value:new o.Y}},v=new o.v({uniforms:u,vertexShader:"void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:t,depthTest:!1,depthWrite:!1}),m=new o.N(2,2);l.add(new o.U(m,v));let f=new o.d(2,2,{minFilter:o.t,magFilter:o.t,format:o.Z}),d=new o.V,p=new o.m(42,1,.1,100);p.position.set(0,0,7.4);let h=new o.x;d.add(h);let w=[new o.c(1,44,30),new o.y(1,1),new o.$(.78,.3,22,56)],x=[new o.G(1.04,1,1.02),new o.G(.97,1,1.06),new o.G(1.05,.99,.97)],g=(n=0x13527da,()=>(n=(1664525*n+0x3c6ef35f)%0x100000000)/0x100000000),y=[];for(let e=0;e<34;e+=1){let t=e<8,r=t?.4+.34*g():.09+.18*g(),n=w[t?3===e?1:2*(6===e):0],s=new o.v({uniforms:{uBackdrop:{value:f.texture},uThickness:{value:.1},uDispersion:{value:.05},uSpecular:{value:.85},uRim:{value:.5},uTint:{value:x[e%x.length]},uLight:{value:new o.A(-.45,.86,.62)}},vertexShader:i,fragmentShader:a}),l=new o.U(n,s);l.scale.setScalar(r);let c=new o.A;for(let e=0;e<48&&(c.set((g()-.5)*8.4,(g()-.5)*5-.25,t?-1.4+2.6*g():-3.6+2.4*g()),!(!t||y.every(e=>Math.hypot(e.origin.x-c.x,e.origin.y-c.y)>(e.radius+r)*1.25+.3)));e+=1);l.position.copy(c),l.rotation.set(6.28*g(),6.28*g(),6.28*g()),h.add(l),y.push({mesh:l,material:s,origin:c,radius:r,bob:.14+.34*g(),phase:6.28*g(),spin:new o.A((g()-.5)*.28,(g()-.5)*.34,(g()-.5)*.2)})}let b=new o.Y,P=new o.Y,V=1,k=1,M=0,S=performance.now();return{resize:(e,o)=>{let t=Math.max(1,Math.round(e)),i=Math.max(1,Math.round(o));if(t===V&&i===k)return;V=t,k=i;let a=Math.min(window.devicePixelRatio,2);for(let e of(s.setSize(V,k,!1),f.setSize(Math.round(V*a),Math.round(k*a)),u.uRes.value.set(V*a,k*a),p.aspect=V/k,p.fov=p.aspect>1?42:42/Math.max(.62,p.aspect),p.updateProjectionMatrix(),y))e.material.uniforms.uBackdrop.value=f.texture},render:(e=performance.now())=>{let o=r();M+=.001*Math.min(96,e-S),S=e,b.lerp(P,.045);let t=Math.max(4,Math.min(34,Math.round(o.count)));for(let e=0;e<y.length;e+=1){let i=y[e];if(i.mesh.visible=e<t,!i.mesh.visible)continue;let a=i.material.uniforms;a.uThickness.value=o.thickness*(.55+.9*i.radius),a.uDispersion.value=o.dispersion,a.uSpecular.value=o.specular,a.uRim.value=o.rim;let r=M*o.drift;i.mesh.position.set(i.origin.x+Math.sin(.21*r+i.phase)*i.bob*.9,i.origin.y+Math.cos(.27*r+1.3*i.phase)*i.bob,i.origin.z+Math.sin(.17*r+.7*i.phase)*i.bob*.5),i.mesh.rotation.x+=.0075*i.spin.x*o.drift,i.mesh.rotation.y+=.0075*i.spin.y*o.drift,i.mesh.rotation.z+=.0075*i.spin.z*o.drift}h.rotation.y=.14*b.x,h.rotation.x=-(.1*b.y),h.position.x=.28*b.x,h.position.y=.2*b.y,u.uTime.value=M,u.uPointer.value.set(b.x,b.y),s.setRenderTarget(f),s.render(l,c),s.setRenderTarget(null),s.render(l,c),s.autoClear=!1,s.render(d,p),s.autoClear=!0},setPointer:(e,o)=>P.set(e,o),dispose:()=>{for(let e of y)e.material.dispose();for(let e of w)e.dispose();m.dispose(),v.dispose(),f.dispose(),s.dispose()}}}])}]);