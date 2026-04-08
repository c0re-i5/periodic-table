// ═══════════════════════════════════════════════════════════════════════════════
// GPU Electron Cloud Renderer — WebGL2 Volumetric Raymarching (v2)
// ═══════════════════════════════════════════════════════════════════════════════
// Two-pass architecture: render at adaptive resolution to FBO, bilinear upscale
// to display. Supports fullscreen with adaptive render scaling for 60fps.
// ═══════════════════════════════════════════════════════════════════════════════

'use strict';

var GPURenderer = (function () {

  // ── Vertex shader: fullscreen quad (shared by both passes) ──
  const VERT_SRC = `#version 300 es
precision highp float;
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

  // ── Pass 1: Volumetric raymarching at render resolution ──
  const FRAG_CLOUD = `#version 300 es
precision highp float;

uniform vec2  u_resolution;
uniform float u_zoom;
uniform float u_camTheta;
uniform float u_camPhi;
uniform float u_fov;

// Orbital parameters — up to 32 orbitals
uniform int   u_numOrbitals;
uniform int   u_n[32];
uniform int   u_l[32];
uniform int   u_m[32];
uniform float u_Zeff[32];
uniform float u_peakInv[32];
uniform float u_orbRadius[32];
uniform int   u_lobeType[32];
uniform int   u_merged[32];  // 0=normal, 1=merged subshell (spherical, skip angular)
uniform float u_orbPeak[32]; // peak point density for per-orbital iso normalization
uniform float u_isoThresh[32]; // per-orbital 90% enclosure threshold (peak-normalized)

uniform int   u_singleIdx;

uniform vec3  u_lobePos[4];
uniform vec3  u_lobeNeg[4];

uniform float u_density;
uniform int   u_steps;
uniform float u_rCut;
uniform float u_boundR;

// Render modes
uniform int   u_clipAxis;   // -1=off, 0=X, 1=Y, 2=Z
uniform float u_clipPos;    // clip plane position along axis
uniform int   u_mode;       // 0=cloud, 1=isosurface
uniform float u_isoLevel;   // isosurface threshold multiplier (1.0 = 90% enclosure)
uniform int   u_phaseMode;  // 0=lobe colors, 1=diverging blue-white-red

out vec4 fragColor;

// ── Diverging colormap: blue (–) → white (0) → red (+) ──
vec3 phaseColor(float signedY, int lt) {
  if (u_phaseMode == 0) {
    return signedY > 0.0 ? u_lobePos[lt] : u_lobeNeg[lt];
  }
  float t = clamp(signedY, -1.0, 1.0);
  if (t > 0.0) return mix(vec3(1.0), vec3(0.85, 0.15, 0.1), t);
  else          return mix(vec3(1.0), vec3(0.1, 0.3, 0.9), -t);
}

// ── Associated Laguerre polynomial L^α_n(x) ──
float assocLaguerre(int nn, int alpha, float x) {
  if (nn == 0) return 1.0;
  float a = float(alpha);
  float prev2 = 1.0;
  float prev1 = 1.0 + a - x;
  if (nn == 1) return prev1;
  for (int k = 2; k <= 25; k++) {
    if (k > nn) break;
    float fk = float(k);
    float curr = ((2.0 * fk - 1.0 + a - x) * prev1 - (fk - 1.0 + a) * prev2) / fk;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}

// ── Radial wavefunction R squared (unnormalized) ──
float radialSq(int n, int l, float Zeff, float r) {
  float rho = 2.0 * Zeff * r / float(n);
  float L = assocLaguerre(n - l - 1, 2 * l + 1, rho);
  float R = pow(rho, float(l)) * exp(-rho * 0.5) * L;
  return R * R;
}

// ── Real spherical harmonic Y_lm — returns vec2(Y², sign(Y)) ──
vec2 angularY2(int l, int m, float cosT, float sinT, float phi) {
  float Y;
  if (l == 0) { Y = 1.0; }
  else if (l == 1) {
    if      (m ==  0) Y = cosT;
    else if (m ==  1) Y = sinT * cos(phi);
    else              Y = sinT * sin(phi);
  }
  else if (l == 2) {
    float st2 = sinT * sinT;
    if      (m ==  0) Y = 3.0 * cosT * cosT - 1.0;
    else if (m ==  1) Y = sinT * cosT * cos(phi);
    else if (m == -1) Y = sinT * cosT * sin(phi);
    else if (m ==  2) Y = st2 * cos(2.0 * phi);
    else              Y = st2 * sin(2.0 * phi);
  }
  else { // l == 3
    float st2 = sinT * sinT, st3 = st2 * sinT, ct2 = cosT * cosT;
    if      (m ==  0) Y = cosT * (5.0 * ct2 - 3.0);
    else if (m ==  1) Y = sinT * (5.0 * ct2 - 1.0) * cos(phi);
    else if (m == -1) Y = sinT * (5.0 * ct2 - 1.0) * sin(phi);
    else if (m ==  2) Y = st2 * cosT * cos(2.0 * phi);
    else if (m == -2) Y = st2 * cosT * sin(2.0 * phi);
    else if (m ==  3) Y = st3 * cos(3.0 * phi);
    else              Y = st3 * sin(3.0 * phi);
  }
  return vec2(Y * Y, Y >= 0.0 ? 1.0 : -1.0);
}

// ── Camera ──
void getCameraRay(vec2 uv, float rCut, out vec3 ro, out vec3 rd) {
  float camDist = rCut * 3.0 / u_zoom;
  float ct = cos(u_camPhi), st = sin(u_camPhi);
  float cp = cos(u_camTheta), sp = sin(u_camTheta);
  ro = vec3(camDist * ct * sp, camDist * st, camDist * ct * cp);

  vec3 forward = normalize(-ro);
  vec3 worldUp = abs(dot(forward, vec3(0,1,0))) > 0.99 ? vec3(0,0,1) : vec3(0,1,0);
  vec3 right = normalize(cross(forward, worldUp));
  vec3 up = cross(right, forward);

  float fovRad = radians(u_fov);
  float aspect = u_resolution.x / u_resolution.y;
  vec2 screen = (uv * 2.0 - 1.0) * vec2(aspect, 1.0) * tan(fovRad * 0.5);
  rd = normalize(forward + screen.x * right + screen.y * up);
}

// ── Ray-sphere intersection ──
vec2 raySphere(vec3 ro, vec3 rd, float radius) {
  float b = dot(ro, rd);
  float c = dot(ro, ro) - radius * radius;
  float disc = b * b - c;
  if (disc < 0.0) return vec2(-1.0);
  float sq = sqrt(disc);
  return vec2(-b - sq, -b + sq);
}

// ── Evaluate isosurface field at a world-space point ──
// Returns max over orbitals of density/(orbPeak×isoThresh).
// Surface is where this value >= u_isoLevel (default 1.0 = 90% enclosure).
float evalDensity(vec3 p, int si, int ei) {
  float r = length(p);
  if (r < 1e-4) return 0.0;
  float ct = p.z / r;
  float st = sqrt(max(0.0, 1.0 - ct * ct));
  float ph = atan(p.y, p.x);
  float maxRatio = 0.0;
  for (int j = 0; j < 32; j++) {
    if (j >= ei) break;
    if (j < si) continue;
    if (r > u_orbRadius[j]) continue;
    float R2 = radialSq(u_n[j], u_l[j], u_Zeff[j], r);
    float nR2 = R2 * u_peakInv[j];
    if (nR2 < 1e-6) continue;
    float density;
    if (u_merged[j] == 1) {
      density = nR2;
    } else {
      vec2 Y2s = angularY2(u_l[j], u_m[j], ct, st, ph);
      density = R2 * Y2s.x * u_peakInv[j];
      if (density < 1e-8) continue;
    }
    float ratio = density / max(u_orbPeak[j] * u_isoThresh[j], 1e-10);
    maxRatio = max(maxRatio, ratio);
  }
  return maxRatio;
}

// ── Radial-only isosurface field (for spherically symmetric orbitals only) ──
// Skips all angular computation. ~3× fewer ops than evalDensity.
float evalDensityR(float r, int si, int ei) {
  if (r < 1e-4) return 0.0;
  float maxRatio = 0.0;
  for (int j = 0; j < 32; j++) {
    if (j >= ei) break;
    if (j < si) continue;
    if (r > u_orbRadius[j]) continue;
    float R2 = radialSq(u_n[j], u_l[j], u_Zeff[j], r);
    float density = R2 * u_peakInv[j];
    if (density < 1e-6) continue;
    float ratio = density / max(u_orbPeak[j] * u_isoThresh[j], 1e-10);
    maxRatio = max(maxRatio, ratio);
  }
  return maxRatio;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec3 ro, rd;
  getCameraRay(uv, u_rCut, ro, rd);

  // Bounding sphere intersection — covers full atom extent
  float boundR = u_boundR;
  vec2 t = raySphere(ro, rd, boundR);
  if (t.y < 0.0) { fragColor = vec4(0.0); return; }

  float tNear = max(t.x, 0.0);
  float tFar  = t.y;

  // Cap on maximum step size
  float maxStep = (tFar - tNear) / max(float(u_steps), 30.0);

  // Determine active orbital range
  int startIdx = 0, endIdx = u_numOrbitals;
  if (u_singleIdx >= 0) { startIdx = u_singleIdx; endIdx = u_singleIdx + 1; }

  // Detect if all active orbitals are spherically symmetric (l=0 or merged).
  // Enables radial-only fast path: no angular math, analytical sphere normals.
  bool allSpherical = true;
  for (int j = 0; j < 32; j++) {
    if (j >= endIdx) break;
    if (j < startIdx) continue;
    if (u_l[j] != 0 && u_merged[j] != 1) { allSpherical = false; break; }
  }

  // ── Shared: evaluate density + color at a point ──
  // (defined as a macro-like block used by both cloud and isosurface)

  vec3  accumColor = vec3(0.0);
  float accumAlpha = 0.0;
  float tCurr = tNear;

  // Density compression: for multi-orbital views, compress dynamic range
  // so inner core and outer valence shells are both visible.
  // Single orbital → comprPow=1.0 (no change). Many orbitals → comprPow→0.55.
  float comprPow = mix(1.0, 0.55, clamp(float(u_numOrbitals - 1) / 15.0, 0.0, 1.0));

  // ── Isosurface mode ──
  if (u_mode == 1) {
    float prevDensity = 0.0;
    vec3  hitPos = vec3(0.0);
    bool  found = false;
    bool  armed = true;  // false after a hit; re-arms when density drops well below threshold
    float nextRearmT = 0.0; // minimum t before re-arming (skips radial nodes within same lobe)

    // Base coarse step guarantees full sphere traversal in ~u_steps iterations.
    // Density-adaptive scaling refines near surfaces without wasting budget on empty space.
    float coarseStep = (tFar - tNear) / max(float(u_steps), 30.0);

    for (int i = 0; i < 400; i++) {
      if (tCurr >= tFar || accumAlpha > 0.95) break;

      vec3 pos = ro + rd * tCurr;
      float r = length(pos);

      // Density-adaptive step size:
      // • Far from surface: full coarse step (covers sphere quickly)
      // • Approaching: reduced step (improves bracket resolution)
      // • Close: fine step (precise zero-crossing detection)
      // Coarse step is sized so u_steps iterations cover the full sphere.
      float ds;
      if (prevDensity < u_isoLevel * 0.05) {
        ds = coarseStep;
      } else if (prevDensity < u_isoLevel * 0.4) {
        ds = coarseStep * 0.35;
      } else {
        ds = coarseStep * 0.12;
      }
      ds = max(ds, 0.01);

      // Cross-section clipping
      if (u_clipAxis >= 0) {
        float cv = (u_clipAxis == 0) ? pos.x : (u_clipAxis == 1) ? pos.y : pos.z;
        if (cv > u_clipPos) { tCurr += ds; prevDensity = 0.0; continue; }
      }

      if (r < 1e-4) { tCurr += ds; continue; }

      float totalDensity = 0.0;
      float totalWeight  = 0.0;
      float isoNormTotal = 0.0;
      vec3  wColor = vec3(0.0);

      if (allSpherical) {
        // ── Radial-only fast path: no angular math needed ──
        for (int j = 0; j < 32; j++) {
          if (j >= endIdx) break;
          if (j < startIdx) continue;
          if (r > u_orbRadius[j]) continue;
          float R2 = radialSq(u_n[j], u_l[j], u_Zeff[j], r);
          float density = R2 * u_peakInv[j];
          if (density < 1e-6) continue;
          float cw = pow(density, comprPow);
          wColor += u_lobePos[u_lobeType[j]] * cw;
          totalWeight += cw;
          totalDensity += density;
          float ratio = density / max(u_orbPeak[j] * u_isoThresh[j], 1e-10);
          isoNormTotal = max(isoNormTotal, ratio);
        }
      } else {
        // ── Full angular path ──
        float cosT = pos.z / r;
        float sinT = sqrt(max(0.0, 1.0 - cosT * cosT));
        float phi  = atan(pos.y, pos.x);

        for (int j = 0; j < 32; j++) {
          if (j >= endIdx) break;
          if (j < startIdx) continue;
          if (r > u_orbRadius[j]) continue;
          float R2 = radialSq(u_n[j], u_l[j], u_Zeff[j], r);
          float normR2 = R2 * u_peakInv[j];
          if (normR2 < 1e-6) continue;
          float density;
          vec3 col;
          int lt = u_lobeType[j];
          if (u_merged[j] == 1) {
            density = normR2;
            col = u_lobePos[lt];
          } else {
            vec2 Y2s = angularY2(u_l[j], u_m[j], cosT, sinT, phi);
            density = R2 * Y2s.x * u_peakInv[j];
            if (density < 1e-8) continue;
            col = phaseColor(Y2s.y, lt);
          }
          float cw = pow(max(density, 0.0), comprPow);
          wColor += col * cw;
          totalWeight += cw;
          totalDensity += density;
          // Per-orbital threshold ratio: ≥1.0 means inside this orbital's 90% surface
          float ratio = density / max(u_orbPeak[j] * u_isoThresh[j], 1e-10);
          isoNormTotal = max(isoNormTotal, ratio);
        }
      }

      // Re-arm after exiting a surface: require both minimum travel distance
      // AND density well below threshold. The distance gate prevents false
      // re-triggers at radial nodes within the same angular lobe (e.g. 5d has
      // 2 radial nodes → 3 shells per lobe, density genuinely hits zero at nodes).
      if (!armed && tCurr > nextRearmT && isoNormTotal < u_isoLevel * 0.1) {
        armed = true;
      }

      // Check zero-crossing using peak-normalized density
      if (armed && isoNormTotal >= u_isoLevel && prevDensity < u_isoLevel && i > 0) {
        // ── Bisection refinement: 8 iterations → 256× precision ──
        float tLo = tCurr - ds, tHi = tCurr;
        for (int bi = 0; bi < 8; bi++) {
          float tMid = (tLo + tHi) * 0.5;
          vec3 pMid = ro + rd * tMid;
          float dMid = allSpherical
            ? evalDensityR(length(pMid), startIdx, endIdx)
            : evalDensity(pMid, startIdx, endIdx);
          if (dMid >= u_isoLevel) tHi = tMid;
          else tLo = tMid;
        }
        float tHit = (tLo + tHi) * 0.5;
        hitPos = ro + rd * tHit;
        found = true;

        // ── Surface normal ──
        float eps = max(0.003, u_rCut * 0.002);
        vec3 norm;
        if (allSpherical) {
          // Spherical orbitals: normal is trivially radial
          norm = normalize(hitPos);
        } else {
          // Tetrahedral gradient: 4 samples instead of 6
          vec3 k0 = vec3( 1, 1,-1);
          vec3 k1 = vec3( 1,-1, 1);
          vec3 k2 = vec3(-1, 1, 1);
          vec3 k3 = vec3(-1,-1,-1);
          norm = k0 * evalDensity(hitPos + eps * k0, startIdx, endIdx)
                    + k1 * evalDensity(hitPos + eps * k1, startIdx, endIdx)
                    + k2 * evalDensity(hitPos + eps * k2, startIdx, endIdx)
                    + k3 * evalDensity(hitPos + eps * k3, startIdx, endIdx);
          norm = normalize(norm);
        }

        // ── Three-point lighting: key + fill + rim ──
        vec3 baseColor = totalWeight > 0.0 ? wColor / totalWeight : vec3(0.5);
        vec3 viewDir = normalize(ro - hitPos);
        float NdotV = max(dot(norm, viewDir), 0.0);

        vec3 worldUp = abs(viewDir.y) > 0.99 ? vec3(0,0,1) : vec3(0,1,0);
        vec3 right = normalize(cross(viewDir, worldUp));
        vec3 up = cross(right, viewDir);

        // Key light: upper-right, warm
        vec3 keyDir = normalize(viewDir + right * 0.5 + up * 0.7);
        float NdotK = max(dot(norm, keyDir), 0.0);
        vec3 keyH = normalize(keyDir + viewDir);
        float keySpec = pow(max(dot(norm, keyH), 0.0), 64.0);

        // Fill light: lower-left, cool
        vec3 fillDir = normalize(viewDir - right * 0.4 - up * 0.3);
        float NdotF = max(dot(norm, fillDir), 0.0);

        vec3 ambient = baseColor * 0.18;
        vec3 keyDiff = baseColor * NdotK * 0.55 * vec3(1.0, 0.97, 0.92);
        vec3 fillDiff = baseColor * NdotF * 0.22 * vec3(0.85, 0.9, 1.0);
        vec3 specular = vec3(keySpec * 0.45);

        float fresnel = pow(1.0 - NdotV, 4.0);
        vec3 rimColor = mix(baseColor, vec3(1.0), 0.5) * fresnel * 0.35;

        vec3 surfColor = ambient + keyDiff + fillDiff + specular + rimColor;

        // Cross-section face coloring
        if (u_clipAxis >= 0) {
          float cv = (u_clipAxis == 0) ? hitPos.x : (u_clipAxis == 1) ? hitPos.y : hitPos.z;
          if (abs(cv - u_clipPos) < eps * 2.0) {
            surfColor = baseColor * 0.7;
          }
        }

        // ── Translucent front-to-back compositing ──
        // Fresnel-modulated opacity: glancing angles more opaque (glassy look)
        float surfAlpha = mix(0.45, 0.85, fresnel);
        float w = (1.0 - accumAlpha) * surfAlpha;
        accumColor += w * surfColor;
        accumAlpha += w;
        if (accumAlpha > 0.95) break;

        // Skip past this surface and disarm until we're well outside.
        // nextRearmT prevents re-triggering at radial nodes within the same lobe.
        armed = false;
        nextRearmT = tCurr + coarseStep * 5.0;
        tCurr += coarseStep * 1.5;
        prevDensity = u_isoLevel;
        continue;
      }

      prevDensity = isoNormTotal;
      tCurr += ds;
    }

  } else {
    // ── Cloud mode (volumetric) ──
    for (int i = 0; i < 300; i++) {
      if (tCurr >= tFar || accumAlpha > 0.95) break;

      vec3 pos = ro + rd * tCurr;
      float r = length(pos);
      float ds = clamp(r * 0.15, 0.02, maxStep);

      // Cross-section clipping
      if (u_clipAxis >= 0) {
        float cv = (u_clipAxis == 0) ? pos.x : (u_clipAxis == 1) ? pos.y : pos.z;
        if (cv > u_clipPos) { tCurr += ds; continue; }
      }

      if (r < 1e-4) { tCurr += ds; continue; }

      float cosT = pos.z / r;
      float sinT = sqrt(max(0.0, 1.0 - cosT * cosT));
      float phi  = atan(pos.y, pos.x);

      float totalDensity = 0.0;
      float totalWeight  = 0.0;
      vec3  weightedColor = vec3(0.0);

      for (int j = 0; j < 32; j++) {
        if (j >= endIdx) break;
        if (j < startIdx) continue;
        if (r > u_orbRadius[j]) continue;
        float R2 = radialSq(u_n[j], u_l[j], u_Zeff[j], r);
        float normR2 = R2 * u_peakInv[j];
        if (normR2 < 1e-6) continue;
        float density;
        vec3 col;
        int lt = u_lobeType[j];
        if (u_merged[j] == 1) {
          density = normR2;
          col = u_lobePos[lt];
        } else {
          vec2 Y2s = angularY2(u_l[j], u_m[j], cosT, sinT, phi);
          density = R2 * Y2s.x * u_peakInv[j];
          if (density < 1e-8) continue;
          col = phaseColor(Y2s.y, lt);
        }
        float cw = pow(max(density, 0.0), comprPow);
        weightedColor += col * cw;
        totalWeight += cw;
        totalDensity += density;
      }

      if (totalDensity < 1e-8) { tCurr += ds; continue; }

      vec3 color = totalWeight > 1e-8 ? weightedColor / totalWeight : vec3(0.5);
      // Auto-scale density: inversesqrt keeps single-orbital bright while
      // preventing saturation with many overlapping orbitals in "all" view.
      float effDensity = u_density * inversesqrt(float(u_numOrbitals));
      float compDens = pow(max(totalDensity, 0.0), comprPow);
      float opacity = 1.0 - exp(-compDens * effDensity * ds);

      // Volumetric self-shadowing: light attenuated by cloud in front
      float shadow = 1.0 - accumAlpha * 0.55;
      color *= 0.35 + 0.65 * shadow;
      // Subtle ambient boost in low-density regions (diffuse outer shell glow)
      color += color * 0.12 * exp(-totalDensity * 4.0);

      float w = (1.0 - accumAlpha) * opacity;
      accumColor += w * color;
      accumAlpha += w;

      tCurr += ds;
    }
  }

  // ── Nucleus (tiny dot + soft halo) ──
  float closeDist = length(ro + rd * max(0.0, -dot(ro, rd)));
  float nucDot = exp(-closeDist * closeDist * 300.0) * 0.6;
  float halo = exp(-closeDist * closeDist * 30.0) * 0.2;
  float nw = (1.0 - accumAlpha) * nucDot;
  accumColor += nw * vec3(0.85, 0.9, 1.0);
  accumAlpha += nw;
  float hw = (1.0 - accumAlpha) * halo;
  accumColor += hw * vec3(0.65, 0.75, 1.0);
  accumAlpha += hw;

  // ── 3D Grid + Axes ──
  // Three half-plane grids (XZ, XY, YZ) on the negative side, plus axis lines with ticks.
  float axisLen = u_rCut * 0.85;
  float axisThick = u_rCut * 0.014;
  float gridThick = u_rCut * 0.007;
  // Grid spacing: pick a nice interval based on rCut
  float gridStep = axisLen > 8.0 ? (axisLen > 20.0 ? 5.0 : 2.0) : 1.0;
  if (axisLen / gridStep > 12.0) gridStep *= 2.0;
  int gridN = int(ceil(axisLen / gridStep));

  vec3 axisColors[3];
  axisColors[0] = vec3(0.9, 0.25, 0.25); // X red
  axisColors[1] = vec3(0.25, 0.8, 0.3);  // Y green
  axisColors[2] = vec3(0.3, 0.45, 0.95); // Z blue
  vec3 axisDirs[3];
  axisDirs[0] = vec3(1,0,0);
  axisDirs[1] = vec3(0,1,0);
  axisDirs[2] = vec3(0,0,1);

  // Helper: closest approach of ray to a finite line segment from p0 to p1
  // Returns (tRay, dist) — dist is distance between closest points.
  // We inline this logic below.

  // -- Grid lines on three planes --
  // XZ plane (y=0): grid lines parallel to X (vary z) and parallel to Z (vary x)
  // XY plane (z=0): grid lines parallel to X (vary y) and parallel to Y (vary x)
  // YZ plane (x=0): grid lines parallel to Y (vary z) and parallel to Z (vary y)
  // Only draw on negative-axis side so grid doesn't occlude the cloud much.

  vec3 gridColor = vec3(0.35, 0.42, 0.52);

  // Each plane has two sets of parallel lines.
  // Plane 0 (XZ, y=0): lines along X at z offsets, lines along Z at x offsets
  // Plane 1 (XY, z=0): lines along X at y offsets, lines along Y at x offsets
  // Plane 2 (YZ, x=0): lines along Y at z offsets, lines along Z at y offsets
  for (int plane = 0; plane < 3; plane++) {
    // perpAxis is the normal to the plane
    // ax1, ax2 are the two in-plane directions
    int perpAxis = plane; // 0=Y-normal(XZ), 1=Z-normal(XY), 2=X-normal(YZ)
    // Remap: plane 0 → Y normal, plane 1 → Z normal, plane 2 → X normal
    vec3 perpDir = (plane == 0) ? vec3(0,1,0) : (plane == 1) ? vec3(0,0,1) : vec3(1,0,0);
    vec3 dir1    = (plane == 0) ? vec3(1,0,0) : (plane == 1) ? vec3(1,0,0) : vec3(0,1,0);
    vec3 dir2    = (plane == 0) ? vec3(0,0,1) : (plane == 1) ? vec3(0,1,0) : vec3(0,0,1);

    // Draw lines parallel to dir1 at various dir2-offsets, and vice versa
    for (int setIdx = 0; setIdx < 2; setIdx++) {
      vec3 lineDir  = (setIdx == 0) ? dir1 : dir2;
      vec3 offsetDir = (setIdx == 0) ? dir2 : dir1;

      for (int gi = -16; gi <= 16; gi++) {
        if (gi == 0) continue; // skip origin line (covered by axis)
        if (abs(gi) > gridN) continue;
        float off = float(gi) * gridStep;
        if (abs(off) > axisLen) continue;
        // Line from -axisLen * lineDir + off * offsetDir  to  +axisLen * lineDir + off * offsetDir
        // (all at perp = 0)
        vec3 lineOrig = off * offsetDir;
        // Closest approach of ray to infinite line: ro + t*rd vs lineOrig + s*lineDir
        float rdDotL = dot(rd, lineDir);
        float denom = 1.0 - rdDotL * rdDotL;
        if (denom < 1e-6) continue;
        vec3 delta = ro - lineOrig;
        float tLine = -(dot(delta, rd) - rdDotL * dot(delta, lineDir)) / denom;
        float sLine = (dot(delta, lineDir) - rdDotL * dot(delta, rd)) / (-denom);
        sLine = clamp(sLine, -axisLen, axisLen);
        vec3 ptLine = lineOrig + sLine * lineDir;
        tLine = max(dot(ptLine - ro, rd), 0.0);
        vec3 ptRay = ro + rd * tLine;
        float dist = length(ptRay - ptLine);

        // Anti-aliased thin line
        float lAlpha = smoothstep(gridThick, gridThick * 0.3, dist);
        // Fade gently with distance from origin
        float fromCenter = length(ptLine) / axisLen;
        bool isMajor = mod(abs(float(gi)), 5.0) < 0.5;
        float baseAlpha = isMajor ? 0.50 : 0.30;
        lAlpha *= baseAlpha * (1.0 - fromCenter * fromCenter * 0.7);
        // Fade at tips
        lAlpha *= 1.0 - smoothstep(axisLen * 0.8, axisLen, abs(sLine));

        if (lAlpha > 0.001) {
          float w = (1.0 - accumAlpha) * lAlpha;
          accumColor += w * gridColor;
          accumAlpha += w;
        }
      }
    }
  }

  // -- Main axis lines with tick marks --
  for (int a = 0; a < 3; a++) {
    vec3 d = axisDirs[a];
    float rdDotD = dot(rd, d);
    float denom = 1.0 - rdDotD * rdDotD;
    if (denom < 1e-6) continue;
    float roD = dot(ro, d);
    float roRd = dot(ro, rd);
    float tAxis = (rdDotD * roD - roRd) / denom;
    float sAxis = (roD - rdDotD * roRd) / (-denom);
    sAxis = clamp(sAxis, -axisLen, axisLen);
    vec3 ptAxis = sAxis * d;
    float tClose = max(dot(ptAxis - ro, rd), 0.0);
    vec3 ptRay = ro + rd * tClose;
    float dist = length(ptRay - ptAxis);

    // Main axis line
    float lineAlpha = smoothstep(axisThick, axisThick * 0.3, dist) * 0.75;
    lineAlpha *= smoothstep(0.0, axisLen * 0.05, abs(sAxis));
    lineAlpha *= 1.0 - smoothstep(axisLen * 0.85, axisLen, abs(sAxis));

    // Tick marks: thicken at grid intervals
    float tickPos = mod(abs(sAxis) + gridStep * 0.5, gridStep) - gridStep * 0.5;
    float tickPulse = smoothstep(gridStep * 0.06, 0.0, abs(tickPos));
    float tickAlpha = smoothstep(axisThick * 3.0, axisThick * 0.6, dist) * tickPulse * 0.6;
    tickAlpha *= smoothstep(0.0, axisLen * 0.05, abs(sAxis));
    tickAlpha *= 1.0 - smoothstep(axisLen * 0.85, axisLen, abs(sAxis));

    float totalAlpha = max(lineAlpha, tickAlpha);
    if (totalAlpha > 0.001) {
      float w = (1.0 - accumAlpha) * totalAlpha;
      accumColor += w * axisColors[a];
      accumAlpha += w;
    }
  }

  // Output PREMULTIPLIED RGBA to FBO.
  // accumColor is already premultiplied from front-to-back compositing.
  // Premultiplied is required for correct bilinear filtering during upscale.
  fragColor = vec4(accumColor, accumAlpha);
}
`;

  // ── Pass 2: Post-processing (background, bloom, vignette) ──
  const FRAG_BLIT = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_tex;
uniform vec2 u_blitRes;
uniform vec2 u_fboRes;
uniform int  u_renderMode;  // 0=cloud, 1=isosurface
out vec4 fragColor;

void main() {
  vec2 texel = 1.0 / u_blitRes;

  // ── Sample cloud (premultiplied RGBA from FBO) ──
  vec4 cloud = texture(u_tex, v_uv);

  // ── Isosurface sharpening when FBO is upscaled ──
  // CAS-style (contrast-adaptive sharpening) to recover edges lost to bilinear upscale
  if (u_renderMode == 1 && u_fboRes.x < u_blitRes.x * 0.95) {
    vec2 fboTexel = 1.0 / u_fboRes;
    vec4 n  = texture(u_tex, v_uv + vec2(0.0,  fboTexel.y));
    vec4 s  = texture(u_tex, v_uv + vec2(0.0, -fboTexel.y));
    vec4 e  = texture(u_tex, v_uv + vec2( fboTexel.x, 0.0));
    vec4 w  = texture(u_tex, v_uv + vec2(-fboTexel.x, 0.0));
    vec4 avg = (n + s + e + w) * 0.25;
    // Sharpen: boost the difference between center and neighborhood
    cloud = cloud + (cloud - avg) * 0.6;
    cloud = max(cloud, vec4(0.0));
  }

  // ── Dark environment gradient ──
  vec2 ctr = v_uv - 0.5;
  float dist = length(ctr);
  vec3 bg = mix(
    vec3(0.035, 0.04, 0.06),
    vec3(0.012, 0.015, 0.028),
    smoothstep(0.0, 0.7, dist)
  );

  // ── Bloom: neutral luminance glow (no colored fringes) ──
  float bloomA = 0.0;
  for (int ring = 1; ring <= 3; ring++) {
    float r = float(ring) * 8.0;
    float w = 1.0 / float(ring * ring);
    for (int i = 0; i < 6; i++) {
      float angle = float(i) * 1.0472; // 60° increments
      vec2 off = r * vec2(cos(angle), sin(angle)) * texel;
      bloomA += texture(u_tex, clamp(v_uv + off, vec2(0.001), vec2(0.999))).a * w;
    }
  }
  bloomA /= 11.0; // normalize (sum of weights ≈ 1 + 0.25 + 0.111... per tap)

  // ── Composite: premultiplied cloud over background ──
  vec3 result = cloud.rgb + bg * (1.0 - cloud.a);

  // ── Add neutral bloom halo (white-ish glow, not orbital-colored) ──
  result += vec3(0.5, 0.6, 0.75) * bloomA * 0.15 * (1.0 - cloud.a);

  // ── Vignette ──
  result *= 1.0 - dot(ctr, ctr) * 0.55;

  fragColor = vec4(result, 1.0);
}
`;

  // ══════════════════════════════════════════════════════════════════
  // WebGL2 helpers
  // ══════════════════════════════════════════════════════════════════

  function compileShader(gl, type, src) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error('Shader compile error: ' + log);
    }
    return shader;
  }

  function createProgram(gl, vertSrc, fragSrc) {
    var vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
    var fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      var log = gl.getProgramInfoLog(prog);
      gl.deleteProgram(prog);
      throw new Error('Program link error: ' + log);
    }
    return prog;
  }

  // ══════════════════════════════════════════════════════════════════
  // State
  // ══════════════════════════════════════════════════════════════════

  var state = {
    gl: null,
    cloudProgram: null,
    blitProgram: null,
    vao: null,
    canvas: null,
    uniforms: {},
    blitUniforms: {},
    animId: null,
    initialized: false,

    // FBO for render-to-texture
    fbo: null,
    fboTexture: null,
    fboW: 0,
    fboH: 0,

    // Display vs render resolution
    displayW: 0,
    displayH: 0,
    renderScale: 0.5,
    minRenderScale: 0.25,
    maxRenderScale: 1.0,

    // Adaptive frame timing
    frameTimes: [],
    frameIdx: 0,
    lastFrameTime: 0,
    targetFps: 55,

    // Camera
    camTheta: 0.4,
    camPhi: 0.3,
    zoom: 1.0,
    autoRotate: true,
    dragging: false,
    lastMouse: { x: 0, y: 0 },
    speed: 1,
    time: 0,

    // Orbital data
    numOrbitals: 0,
    orbData: [],
    activeFilter: 'all',
    singleIdx: -1,
    rCut: 10.0,
    boundR: 12.0,

    // Quality (defaults match 'high' preset)
    density: 1.8,
    baseSteps: 128,
    fov: 45.0,

    // Render modes
    clipAxis: -1,    // -1=off, 0=X, 1=Y, 2=Z
    clipPos: 0.0,    // clip plane position
    renderMode: 0,   // 0=cloud, 1=isosurface
    isoLevel: 1.0,  // isosurface threshold multiplier (1.0 = 90% enclosure)
    phaseMode: 0,    // 0=lobe colors, 1=diverging blue-white-red

    // Fullscreen
    isFullscreen: false,
    savedSize: null,
    fullscreenWrapper: null,

    // Callback
    onFrame: null,

    // Element
    element: null,
  };

  // Lobe colors (normalized 0-1)
  var LOBE_POS = [
    [80/255, 160/255, 255/255],
    [255/255, 100/255, 80/255],
    [255/255, 200/255, 50/255],
    [50/255, 210/255, 120/255],
  ];
  var LOBE_NEG = [
    [80/255, 160/255, 255/255],
    [80/255, 140/255, 255/255],
    [100/255, 60/255, 220/255],
    [220/255, 60/255, 160/255],
  ];

  // ══════════════════════════════════════════════════════════════════
  // WebGL2 support check
  // ══════════════════════════════════════════════════════════════════

  function isSupported() {
    try {
      var c = document.createElement('canvas');
      var gl = c.getContext('webgl2');
      return !!gl;
    } catch (e) {
      return false;
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // FBO management
  // ══════════════════════════════════════════════════════════════════

  function setupFBO(gl, w, h) {
    if (state.fbo) {
      gl.deleteFramebuffer(state.fbo);
      gl.deleteTexture(state.fboTexture);
    }

    state.fboW = w;
    state.fboH = h;

    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    state.fbo = fbo;
    state.fboTexture = tex;
  }

  // ══════════════════════════════════════════════════════════════════
  // Initialize
  // ══════════════════════════════════════════════════════════════════

  function init(canvas) {
    var gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return false;

    state.gl = gl;
    state.canvas = canvas;

    try {
      state.cloudProgram = createProgram(gl, VERT_SRC, FRAG_CLOUD);
      state.blitProgram  = createProgram(gl, VERT_SRC, FRAG_BLIT);
    } catch (e) {
      console.error('[GPURenderer]', e.message);
      return false;
    }

    // Cache cloud program uniforms
    gl.useProgram(state.cloudProgram);
    var scalarNames = [
      'u_resolution', 'u_zoom', 'u_camTheta', 'u_camPhi', 'u_fov',
      'u_numOrbitals', 'u_singleIdx', 'u_density', 'u_steps', 'u_rCut', 'u_boundR',
      'u_clipAxis', 'u_clipPos', 'u_mode', 'u_isoLevel', 'u_phaseMode',
    ];
    for (var i = 0; i < scalarNames.length; i++) {
      state.uniforms[scalarNames[i]] = gl.getUniformLocation(state.cloudProgram, scalarNames[i]);
    }
    for (var i = 0; i < 32; i++) {
      var s = '[' + i + ']';
      state.uniforms['u_n_' + i]         = gl.getUniformLocation(state.cloudProgram, 'u_n' + s);
      state.uniforms['u_l_' + i]         = gl.getUniformLocation(state.cloudProgram, 'u_l' + s);
      state.uniforms['u_m_' + i]         = gl.getUniformLocation(state.cloudProgram, 'u_m' + s);
      state.uniforms['u_Zeff_' + i]      = gl.getUniformLocation(state.cloudProgram, 'u_Zeff' + s);
      state.uniforms['u_peakInv_' + i]   = gl.getUniformLocation(state.cloudProgram, 'u_peakInv' + s);
      state.uniforms['u_orbRadius_' + i] = gl.getUniformLocation(state.cloudProgram, 'u_orbRadius' + s);
      state.uniforms['u_lobeType_' + i]  = gl.getUniformLocation(state.cloudProgram, 'u_lobeType' + s);
      state.uniforms['u_merged_' + i]    = gl.getUniformLocation(state.cloudProgram, 'u_merged' + s);
      state.uniforms['u_orbPeak_' + i]    = gl.getUniformLocation(state.cloudProgram, 'u_orbPeak' + s);
      state.uniforms['u_isoThresh_' + i]   = gl.getUniformLocation(state.cloudProgram, 'u_isoThresh' + s);
    }
    for (var i = 0; i < 4; i++) {
      var s = '[' + i + ']';
      state.uniforms['u_lobePos_' + i] = gl.getUniformLocation(state.cloudProgram, 'u_lobePos' + s);
      state.uniforms['u_lobeNeg_' + i] = gl.getUniformLocation(state.cloudProgram, 'u_lobeNeg' + s);
    }

    // Cache blit program uniforms
    gl.useProgram(state.blitProgram);
    state.blitUniforms['u_tex'] = gl.getUniformLocation(state.blitProgram, 'u_tex');
    state.blitUniforms['u_blitRes'] = gl.getUniformLocation(state.blitProgram, 'u_blitRes');
    state.blitUniforms['u_fboRes'] = gl.getUniformLocation(state.blitProgram, 'u_fboRes');
    state.blitUniforms['u_renderMode'] = gl.getUniformLocation(state.blitProgram, 'u_renderMode');

    // Shared fullscreen quad VAO
    state.vao = gl.createVertexArray();
    gl.bindVertexArray(state.vao);
    state.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, state.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1,  1,  1, -1,   1, 1,
    ]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(state.cloudProgram, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    // Initial sizes
    state.displayW = canvas.width;
    state.displayH = canvas.height;

    var rw = Math.max(1, Math.round(state.displayW * state.renderScale));
    var rh = Math.max(1, Math.round(state.displayH * state.renderScale));
    setupFBO(gl, rw, rh);

    // Init frame timing ring buffer
    state.frameTimes = new Array(30).fill(16);
    state.frameIdx = 0;
    state.lastFrameTime = performance.now();

    state.initialized = true;
    return true;
  }

  // ══════════════════════════════════════════════════════════════════
  // Peak |ψ|² computation (CPU, once per element)
  // ══════════════════════════════════════════════════════════════════

  function laguerreJS(nn, alpha, x) {
    if (nn === 0) return 1;
    if (nn === 1) return 1 + alpha - x;
    var p2 = 1, p1 = 1 + alpha - x;
    for (var k = 2; k <= nn; k++) {
      var c = ((2*k - 1 + alpha - x) * p1 - (k - 1 + alpha) * p2) / k;
      p2 = p1; p1 = c;
    }
    return p1;
  }

  function angularYJS(l, m, cosT, phi) {
    var st = Math.sqrt(Math.max(0, 1 - cosT * cosT));
    if (l === 0) return 1;
    if (l === 1) {
      if (m === 0) return cosT;
      if (m === 1) return st * Math.cos(phi);
      if (m === -1) return st * Math.sin(phi);
    }
    if (l === 2) {
      var st2 = st * st;
      if (m === 0) return 3 * cosT * cosT - 1;
      if (m === 1) return st * cosT * Math.cos(phi);
      if (m === -1) return st * cosT * Math.sin(phi);
      if (m === 2) return st2 * Math.cos(2 * phi);
      if (m === -2) return st2 * Math.sin(2 * phi);
    }
    if (l === 3) {
      var st2 = st * st, st3 = st2 * st, ct2 = cosT * cosT;
      if (m === 0) return cosT * (5 * ct2 - 3);
      if (m === 1) return st * (5 * ct2 - 1) * Math.cos(phi);
      if (m === -1) return st * (5 * ct2 - 1) * Math.sin(phi);
      if (m === 2) return st2 * cosT * Math.cos(2 * phi);
      if (m === -2) return st2 * cosT * Math.sin(2 * phi);
      if (m === 3) return st3 * Math.cos(3 * phi);
      if (m === -3) return st3 * Math.sin(3 * phi);
    }
    return 1;
  }

  // -- Line-integral normalization (CPU, once per element) --
  // For each orbital, integrate R²(r) × Y²_max along a diameter
  // through the origin. Dividing by this integral in the shader ensures
  // that ∫ density dr ≈ 1.0 along the optimal center ray for EVERY
  // orbital, regardless of n/l/Zeff. Then u_density directly controls
  // the final opacity:  α = 1 − exp(−u_density).

  function computeLineIntegral(n, l, m, Zeff) {
    var rCut = Math.max(4.0, (5 * n * n) / Zeff);

    // Find peak angular value Y²_max
    var maxAng = 0;
    for (var i = 0; i <= 60; i++) {
      var ct = -1 + 2 * i / 60;
      for (var j = 0; j <= 60; j++) {
        var phi = 2 * Math.PI * j / 60;
        var Y = angularYJS(l, m, ct, phi);
        if (Y * Y > maxAng) maxAng = Y * Y;
      }
    }
    if (maxAng < 1e-10) maxAng = 1;

    // Integrate R²(r) along the full diameter (2 × integral from 0 to rCut)
    var nSteps = 500;
    var dr = rCut / nSteps;
    var integral = 0;
    for (var i = 0; i < nSteps; i++) {
      var r = (i + 0.5) * dr;
      var rho = 2 * Zeff * r / n;
      var L = laguerreJS(n - l - 1, 2 * l + 1, rho);
      var Rv = Math.pow(rho, l) * Math.exp(-rho / 2) * L;
      integral += Rv * Rv * dr;
    }
    // Multiply by 2 (diameter) and by Y²_max (best-case viewing angle)
    integral *= 2 * maxAng;

    return integral > 1e-20 ? integral : 1;
  }

  // ── Peak point density for isosurface normalization ──
  // Returns the maximum value of density = R²(r) × Y²max × peakInv
  // that a given orbital can produce in the shader.
  // For merged orbitals, Y² part = 1 (spherical).
  function computePeakPointDensity(n, l, m, Zeff, peakInv, isMerged) {
    var rCut = Math.max(4.0, (5 * n * n) / Zeff);
    // Find peak R²(r)
    var peakR2 = 0;
    var nSteps = 500;
    for (var i = 1; i <= nSteps; i++) {
      var r = rCut * i / nSteps;
      var rho = 2 * Zeff * r / n;
      var L = laguerreJS(n - l - 1, 2 * l + 1, rho);
      var R = Math.pow(rho, l) * Math.exp(-rho / 2) * L;
      peakR2 = Math.max(peakR2, R * R);
    }
    // Find Y²_max by scanning theta (phi dependence has max = 1)
    var y2max = 1.0;
    if (!isMerged && l > 0) {
      y2max = 0;
      for (var i = 0; i <= 200; i++) {
        var ct = -1 + 2 * i / 200;
        var Y = angularYJS(l, m, ct, 0);  // phi=0 gives cos(m*phi)=1
        var Y2 = Y * Y;
        // Also check phi=pi/(2|m|) for sin terms
        if (m !== 0) {
          var phiAlt = Math.PI / (2 * Math.abs(m));
          var Ya = angularYJS(l, m, ct, phiAlt);
          Y2 = Math.max(Y2, Ya * Ya);
        }
        y2max = Math.max(y2max, Y2);
      }
    }
    return Math.max(peakR2 * y2max * peakInv, 1e-10);
  }

  // ── 90% probability enclosure threshold for isosurface ──
  // For each orbital, finds the peak-normalized density threshold ρ₀ such that
  // the region where density/orbPeak > ρ₀ encloses `target` (90%) of |ψ|².
  // This is the standard chemistry convention for orbital boundary surfaces.
  function computeIsoThreshold(n, l, m, Zeff, peakInv, orbPeak, isMerged, target) {
    target = target || 0.9;
    var rCut = Math.max(4.0, (5 * n * n) / Zeff) * 1.05;

    // Histogram approach: bin normalized densities, scan from top to find
    // the threshold enclosing `target` of total probability. O(n) vs O(n log n) sort.
    var nBins = 256;
    var histProb = new Float64Array(nBins);  // probability in each density bin
    var totalProb = 0;

    var Nr = 150, Nt = 60, Nphi = 1;
    var needPhi = (!isMerged && l > 0 && m !== 0);
    if (needPhi) Nphi = 24;

    for (var ir = 1; ir <= Nr; ir++) {
      var r = rCut * ir / Nr;
      var dr = rCut / Nr;
      var rho = 2 * Zeff * r / n;
      var L = laguerreJS(n - l - 1, 2 * l + 1, rho);
      var Rv = Math.pow(rho, l) * Math.exp(-rho / 2) * L;
      var R2 = Rv * Rv;

      if (isMerged || l === 0) {
        var density = R2 * peakInv;
        var normDens = density / orbPeak;
        var vol = r * r * dr * 4 * Math.PI;
        var prob = density * vol;
        if (normDens > 1e-12) {
          var bin = Math.min(Math.floor(normDens * nBins), nBins - 1);
          histProb[bin] += prob;
          totalProb += prob;
        }
      } else {
        for (var it = 0; it < Nt; it++) {
          var theta = Math.PI * (it + 0.5) / Nt;
          var cosT = Math.cos(theta);
          var sinT = Math.sin(theta);
          var dtheta = Math.PI / Nt;

          if (needPhi) {
            var dphi = 2 * Math.PI / Nphi;
            for (var ip = 0; ip < Nphi; ip++) {
              var phi = dphi * (ip + 0.5);
              var Y = angularYJS(l, m, cosT, phi);
              var Y2 = Y * Y;
              var density = R2 * Y2 * peakInv;
              var normDens = density / orbPeak;
              var vol = r * r * dr * sinT * dtheta * dphi;
              var prob = density * vol;
              if (normDens > 1e-12) {
                var bin = Math.min(Math.floor(normDens * nBins), nBins - 1);
                histProb[bin] += prob;
                totalProb += prob;
              }
            }
          } else {
            var Y = angularYJS(l, m, cosT, 0);
            var Y2 = Y * Y;
            var density = R2 * Y2 * peakInv;
            var normDens = density / orbPeak;
            var vol = r * r * dr * sinT * dtheta * 2 * Math.PI;
            var prob = density * vol;
            if (normDens > 1e-12) {
              var bin = Math.min(Math.floor(normDens * nBins), nBins - 1);
              histProb[bin] += prob;
              totalProb += prob;
            }
          }
        }
      }
    }

    // Scan bins from highest density down, accumulate until we enclose target
    if (totalProb < 1e-20) return 0.001;
    var cumProb = 0;
    for (var b = nBins - 1; b >= 0; b--) {
      cumProb += histProb[b];
      if (cumProb >= target * totalProb) {
        return Math.max(b / nBins, 1e-6);
      }
    }
    return 1e-3;
  }

  function prepareOrbitalData(orbDataArr) {
    for (var i = 0; i < orbDataArr.length; i++) {
      var o = orbDataArr[i];
      if (o._boundR === undefined) {
        o._boundR = Math.max(4.0, (5 * o.n * o.n) / o.Zeff) * 1.05;
      }
      if (o._peakInv === undefined) {
        o._peakInv = 1.0 / computeLineIntegral(o.n, o.l, o.m, o.Zeff);
      }
      if (o._orbPeak === undefined) {
        o._orbPeak = computePeakPointDensity(o.n, o.l, o.m, o.Zeff, o._peakInv, !!o._merged);
      }
      // _isoThresh computed separately in prepareIsoThresholds() on display orbitals only
    }
  }

  // Compute iso thresholds only for final display orbitals (post-merge).
  // This avoids expensive φ-sampling for individual m≠0 orbitals that get merged away.
  function prepareIsoThresholds(orbDataArr) {
    for (var i = 0; i < orbDataArr.length; i++) {
      var o = orbDataArr[i];
      if (o._isoThresh === undefined) {
        o._isoThresh = computeIsoThreshold(o.n, o.l, o.m, o.Zeff, o._peakInv, o._orbPeak, !!o._merged);
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // Subshell merging for "All" view (reduces orbital count)
  // ══════════════════════════════════════════════════════════════════
  // Closed subshells (all m filled) are spherically symmetric:
  //   Σ_m |Y_lm(θ,φ)|² = (2l+1)/(4π) = const
  // So we replace (2l+1) individual orbitals with one merged entry
  // that keeps real n,l (for correct radial function) but sets u_merged=1
  // so the shader skips angular Y² and uses R²×peakInv directly.

  var SUBSHELL_MAX = { s: 2, p: 6, d: 10, f: 14 };

  function mergeSubshells(orbData) {
    // Group orbitals by subshell key (e.g. "3d")
    var groups = {};
    for (var i = 0; i < orbData.length; i++) {
      var o = orbData[i];
      var k = o.key;
      if (!groups[k]) groups[k] = [];
      groups[k].push(o);
    }

    var merged = [];
    for (var k in groups) {
      var orbs = groups[k];
      var sample = orbs[0];
      var maxElec = SUBSHELL_MAX[sample.lChar] || 2;
      var totalElec = 0;
      for (var i = 0; i < orbs.length; i++) totalElec += orbs[i].elec;

      // Merge if subshell is full (or nearly full — all m slots occupied)
      if (orbs.length === (maxElec / 2) && sample.l > 0) {
        // Create a spherically-symmetric merged entry.
        // Keep real n, l for correct radialSq() in shader.
        // u_merged=1 tells shader to skip angular Y², use R²×peakInv directly.
        var m = {
          n: sample.n, l: sample.l, m: 0,
          Zeff: sample.Zeff, rExt: sample.rExt,
          key: sample.key, lChar: sample.lChar,
          elec: totalElec,
          _merged: true,
          _mergeCount: orbs.length,
        };
        // For the merged entry, shader computes R²(n,l,Zeff,r) × peakInv.
        // We normalize so the line-integral through the merged orbital ≈ 1,
        // matching the visual weight of one individual orbital.
        // This prevents d/f subshells (5/7 orbitals) from dominating the
        // density-weighted color average and turning everything yellow/green.
        var rCut = Math.max(4.0, (5 * sample.n * sample.n) / sample.Zeff);
        var nSteps = 500;
        var dr = rCut / nSteps;
        var integral = 0;
        for (var i = 0; i < nSteps; i++) {
          var rv = (i + 0.5) * dr;
          var rho = 2 * sample.Zeff * rv / sample.n;
          var L = laguerreJS(sample.n - sample.l - 1, 2 * sample.l + 1, rho);
          var Rv = Math.pow(rho, sample.l) * Math.exp(-rho / 2) * L;
          integral += Rv * Rv * dr;
        }
        integral *= 2;  // diameter
        if (integral < 1e-20) integral = 1;
        // Unit visual weight — same as one individual orbital.
        // The merge is purely structural (reduce uniform count), not a density boost.
        m._peakInv = 1.0 / integral;
        m._boundR = sample._boundR || Math.max(4.0, m.rExt) * 1.05;
        m._orbPeak = computePeakPointDensity(m.n, m.l, m.m, m.Zeff, m._peakInv, true);
        // _isoThresh computed later in prepareIsoThresholds() on final display set
        merged.push(m);
      } else {
        // Keep individual orbitals
        for (var i = 0; i < orbs.length; i++) merged.push(orbs[i]);
      }
    }
    return merged;
  }

  // ══════════════════════════════════════════════════════════════════
  // Visual rCut: electron-weighted percentile to avoid outlier orbitals
  // dominating the camera zoom for heavy elements.
  // ══════════════════════════════════════════════════════════════════
  function computeVisualRCut(orbData) {
    // Find the outermost occupied shell number
    var maxN = 0;
    for (var i = 0; i < orbData.length; i++) {
      if (orbData[i].n > maxN) maxN = orbData[i].n;
    }
    // Always include the full extent of the outermost shell (valence)
    var valenceR = 0;
    for (var i = 0; i < orbData.length; i++) {
      if (orbData[i].n >= maxN - 1 && orbData[i].rExt > valenceR) {
        valenceR = orbData[i].rExt;
      }
    }
    // Pad to show the diffuse tail
    return Math.max(4.0, valenceR * 1.25);
  }

  // ══════════════════════════════════════════════════════════════════
  // Adaptive step count based on orbital count
  // ══════════════════════════════════════════════════════════════════

  function computeSteps() {
    var n = state.numOrbitals;
    var base;
    if (n <= 1) base = state.baseSteps * 2.0;
    else if (n <= 4) base = state.baseSteps * 1.2;
    else if (n <= 10) base = state.baseSteps * 0.9;
    else if (n <= 20) base = state.baseSteps * 0.65;
    else base = state.baseSteps * 0.5;
    // When bounding sphere is much larger than the framing region,
    // boost steps so step size stays reasonable across the full volume.
    var sizeRatio = state.boundR / Math.max(state.rCut, 1.0);
    if (sizeRatio > 1.2) base *= Math.min(sizeRatio * 0.75, 2.0);
    return Math.round(base);
  }

  // ══════════════════════════════════════════════════════════════════
  // Set orbital data
  // ══════════════════════════════════════════════════════════════════

  function setOrbitals(orbData, maxR) {
    // Clear any stale cached normalization from previous formula
    for (var i = 0; i < orbData.length; i++) {
      delete orbData[i]._peakInv;
      delete orbData[i]._boundR;
      delete orbData[i]._orbPeak;
      delete orbData[i]._isoThresh;
    }
    prepareOrbitalData(orbData);
    // Merge closed subshells if too many orbitals for GPU uniform limit
    var displayOrbs = orbData.length > 32 ? mergeSubshells(orbData) : orbData;
    prepareIsoThresholds(displayOrbs);
    state.fullOrbData = orbData;  // keep unmerged copy for per-orbital filtering
    state.orbData = displayOrbs;
    state.numOrbitals = Math.min(displayOrbs.length, 32);
    // Bounding sphere always covers full atom
    var fullR = Math.max(4.0, maxR * 1.15);
    // Camera framing: use valence shell extent for many-orbital atoms
    state.rCut = orbData.length > 10 ? computeVisualRCut(orbData) : fullR;
    state.boundR = Math.max(fullR, state.rCut);
    state.activeFilter = 'all';
    state.singleIdx = -1;
  }

  function setFilter(filter, orbData) {
    prepareOrbitalData(orbData);
    state.activeFilter = filter;
    state.fullOrbData = orbData;  // keep unmerged copy
    if (filter === 'all') {
      var displayOrbs = orbData.length > 32 ? mergeSubshells(orbData) : orbData;
      prepareIsoThresholds(displayOrbs);
      state.orbData = displayOrbs;
      state.numOrbitals = Math.min(displayOrbs.length, 32);
      state.singleIdx = -1;
      var maxR = 0;
      for (var i = 0; i < orbData.length; i++) {
        if (orbData[i].rExt > maxR) maxR = orbData[i].rExt;
      }
      state.boundR = Math.max(4.0, maxR * 1.15);
      state.rCut = orbData.length > 10 ? computeVisualRCut(orbData) : state.boundR;
      if (state.boundR < state.rCut) state.boundR = state.rCut;
    } else if (typeof filter === 'string' && filter.startsWith('__sub_')) {
      var subKey = filter.slice(6);
      state.singleIdx = -1;
      var filtered = [];
      for (var i = 0; i < orbData.length; i++) {
        if (orbData[i].key === subKey) filtered.push(orbData[i]);
      }
      if (filtered.length > 0) {
        prepareIsoThresholds(filtered);
        state.orbData = filtered;
        state.numOrbitals = filtered.length;
        var maxR = 0;
        for (var i = 0; i < filtered.length; i++) {
          if (filtered[i].rExt > maxR) maxR = filtered[i].rExt;
        }
        state.boundR = Math.max(4.0, maxR * 1.15);
        state.rCut = state.boundR;
      }
    } else {
      for (var i = 0; i < orbData.length; i++) {
        var o = orbData[i];
        if ((o.n + '' + o.lChar + o.m) === filter) {
          state.orbData = [o];
          prepareIsoThresholds(state.orbData);
          state.numOrbitals = 1;
          state.singleIdx = 0;
          state.boundR = Math.max(4.0, o.rExt * 1.15);
          state.rCut = state.boundR;
          return;
        }
      }
      state.singleIdx = -1;
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // Adaptive render scale
  // ══════════════════════════════════════════════════════════════════

  function updateAdaptiveScale() {
    var now = performance.now();
    var dt = now - state.lastFrameTime;
    state.lastFrameTime = now;

    state.frameTimes[state.frameIdx % state.frameTimes.length] = dt;
    state.frameIdx++;

    if (state.frameIdx < 10) return;

    var sum = 0, count = Math.min(state.frameIdx, state.frameTimes.length);
    for (var i = 0; i < count; i++) sum += state.frameTimes[i];
    var avgMs = sum / count;
    var targetMs = 1000.0 / state.targetFps;

    // Scale by sqrt of budget ratio (pixel count ~ resolution²)
    var newScale = state.renderScale * Math.sqrt(targetMs / Math.max(avgMs, 1));
    // Smooth heavily to avoid flickering
    newScale = state.renderScale * 0.85 + newScale * 0.15;
    state.renderScale = Math.max(state.minRenderScale, Math.min(state.maxRenderScale, newScale));
  }

  // ══════════════════════════════════════════════════════════════════
  // Draw one frame (two-pass: FBO render + blit upscale)
  // ══════════════════════════════════════════════════════════════════

  function drawFrame() {
    var gl = state.gl;
    if (!gl || !state.initialized) return;

    state.displayW = state.canvas.width;
    state.displayH = state.canvas.height;

    // Compute render resolution from adaptive scale
    var rw = Math.max(1, Math.round(state.displayW * state.renderScale));
    var rh = Math.max(1, Math.round(state.displayH * state.renderScale));

    // Resize FBO if needed
    if (rw !== state.fboW || rh !== state.fboH) {
      setupFBO(gl, rw, rh);
    }

    var steps = computeSteps();
    // Isosurface: modest boost; adaptive stepping in shader handles the rest
    if (state.renderMode === 1) steps = Math.round(steps * 1.3);

    // ── Pass 1: Render cloud to FBO at render resolution ──
    gl.bindFramebuffer(gl.FRAMEBUFFER, state.fbo);
    gl.viewport(0, 0, rw, rh);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.BLEND);

    gl.useProgram(state.cloudProgram);

    gl.uniform2f(state.uniforms['u_resolution'], rw, rh);
    gl.uniform1f(state.uniforms['u_zoom'], state.zoom);
    gl.uniform1f(state.uniforms['u_camTheta'], state.camTheta);
    gl.uniform1f(state.uniforms['u_camPhi'], state.camPhi);
    gl.uniform1f(state.uniforms['u_fov'], state.fov);
    gl.uniform1i(state.uniforms['u_numOrbitals'], state.numOrbitals);
    gl.uniform1i(state.uniforms['u_singleIdx'], state.singleIdx);
    gl.uniform1f(state.uniforms['u_density'], state.density);
    gl.uniform1i(state.uniforms['u_steps'], steps);
    gl.uniform1f(state.uniforms['u_rCut'], state.rCut);
    gl.uniform1f(state.uniforms['u_boundR'], state.boundR);
    gl.uniform1i(state.uniforms['u_clipAxis'], state.clipAxis);
    gl.uniform1f(state.uniforms['u_clipPos'], state.clipPos);
    gl.uniform1i(state.uniforms['u_mode'], state.renderMode);
    gl.uniform1f(state.uniforms['u_isoLevel'], state.isoLevel);
    gl.uniform1i(state.uniforms['u_phaseMode'], state.phaseMode);

    for (var i = 0; i < state.numOrbitals; i++) {
      var orb = state.orbData[i];
      gl.uniform1i(state.uniforms['u_n_' + i], orb.n);
      gl.uniform1i(state.uniforms['u_l_' + i], orb.l);
      gl.uniform1i(state.uniforms['u_m_' + i], orb.m);
      gl.uniform1f(state.uniforms['u_Zeff_' + i], orb.Zeff);
      gl.uniform1f(state.uniforms['u_peakInv_' + i], orb._peakInv || 1.0);
      gl.uniform1f(state.uniforms['u_orbRadius_' + i], orb._boundR || state.rCut);
      gl.uniform1i(state.uniforms['u_lobeType_' + i], 'spdf'.indexOf(orb.lChar));
      gl.uniform1i(state.uniforms['u_merged_' + i], orb._merged ? 1 : 0);
      gl.uniform1f(state.uniforms['u_orbPeak_' + i], orb._orbPeak || 1.0);
      gl.uniform1f(state.uniforms['u_isoThresh_' + i], orb._isoThresh || 0.01);
    }

    for (var i = 0; i < 4; i++) {
      gl.uniform3f(state.uniforms['u_lobePos_' + i], LOBE_POS[i][0], LOBE_POS[i][1], LOBE_POS[i][2]);
      gl.uniform3f(state.uniforms['u_lobeNeg_' + i], LOBE_NEG[i][0], LOBE_NEG[i][1], LOBE_NEG[i][2]);
    }

    gl.bindVertexArray(state.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // ── Pass 2: Blit FBO to display with bilinear upscale ──
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, state.displayW, state.displayH);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(state.blitProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, state.fboTexture);
    gl.uniform1i(state.blitUniforms['u_tex'], 0);
    gl.uniform2f(state.blitUniforms['u_blitRes'], state.displayW, state.displayH);
    gl.uniform2f(state.blitUniforms['u_fboRes'], rw, rh);
    gl.uniform1i(state.blitUniforms['u_renderMode'], state.renderMode);

    // No blending — post-processing outputs opaque RGBA.
    gl.disable(gl.BLEND);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);

    updateAdaptiveScale();
  }

  // ══════════════════════════════════════════════════════════════════
  // Animation loop
  // ══════════════════════════════════════════════════════════════════

  function startAnimation() {
    stopAnimation();
    state.lastFrameTime = performance.now();
    state.frameIdx = 0;
    function frame() {
      if (state.autoRotate) {
        state.camTheta += 0.005 * state.speed;
      }
      state.time += 0.016;
      drawFrame();
      if (state.onFrame) state.onFrame();
      state.animId = requestAnimationFrame(frame);
    }
    state.animId = requestAnimationFrame(frame);
  }

  function stopAnimation() {
    if (state.animId) {
      cancelAnimationFrame(state.animId);
      state.animId = null;
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // Fullscreen
  // ══════════════════════════════════════════════════════════════════

  function enterFullscreen(wrapperEl) {
    if (!wrapperEl || state.isFullscreen) return;
    state.fullscreenWrapper = wrapperEl;
    state.savedSize = {
      cssW: state.canvas.style.width,
      cssH: state.canvas.style.height,
      canvasW: state.canvas.width,
      canvasH: state.canvas.height,
    };
    var el = wrapperEl;
    var rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
    if (rfs) rfs.call(el);
  }

  function exitFullscreen() {
    if (!state.isFullscreen) return;
    var eFS = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen;
    if (eFS) eFS.call(document);
  }

  function toggleFullscreen(wrapperEl) {
    if (state.isFullscreen) exitFullscreen();
    else enterFullscreen(wrapperEl);
  }

  function onFullscreenChange() {
    var fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
    state.isFullscreen = !!fsEl && fsEl === state.fullscreenWrapper;

    if (state.isFullscreen) {
      var dpr = window.devicePixelRatio || 1;
      var sw = screen.width * dpr;
      var sh = screen.height * dpr;
      state.canvas.width = sw;
      state.canvas.height = sh;
      state.canvas.style.width = '100vw';
      state.canvas.style.height = '100vh';
      // Start low for fullscreen, adapt upward
      state.renderScale = 0.35;
      state.frameIdx = 0;
    } else if (state.savedSize) {
      state.canvas.width = state.savedSize.canvasW;
      state.canvas.height = state.savedSize.canvasH;
      state.canvas.style.width = state.savedSize.cssW;
      state.canvas.style.height = state.savedSize.cssH;
      state.renderScale = 0.5;
      state.frameIdx = 0;
      state.fullscreenWrapper = null;
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
  }

  // ══════════════════════════════════════════════════════════════════
  // Input handlers
  // ══════════════════════════════════════════════════════════════════

  function onPointerDown(e) {
    state.dragging = true;
    state.autoRotate = false;
    state.lastMouse = { x: e.clientX, y: e.clientY };
    state.canvas.style.cursor = 'grabbing';
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!state.dragging) return;
    var dx = e.clientX - state.lastMouse.x;
    var dy = e.clientY - state.lastMouse.y;
    state.camTheta += dx * 0.008;
    state.camPhi = Math.max(-1.4, Math.min(1.4, state.camPhi + dy * 0.008));
    state.lastMouse = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }

  function onPointerUp() {
    state.dragging = false;
    if (state.canvas) state.canvas.style.cursor = 'grab';
  }

  function onWheel(e) {
    var factor = state.zoom < 1 ? 0.001 : 0.003;
    state.zoom = Math.max(0.15, Math.min(12.0, state.zoom + e.deltaY * -factor));
    e.preventDefault();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape' && state.isFullscreen) {
      exitFullscreen();
      e.preventDefault();
    }
  }

  function bindEvents(canvas) {
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('keydown', onKeyDown);
  }

  function unbindEvents(canvas) {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointerleave', onPointerUp);
    canvas.removeEventListener('wheel', onWheel);
    document.removeEventListener('keydown', onKeyDown);
  }

  // ══════════════════════════════════════════════════════════════════
  // Reset / Quality
  // ══════════════════════════════════════════════════════════════════

  function resetCamera() {
    state.camTheta = 0.4;
    state.camPhi = 0.3;
    state.zoom = 1.0;
    state.autoRotate = true;
  }

  function setQuality(level) {
    switch (level) {
      case 'low':    state.baseSteps = 48;  state.density = 1.0;  state.maxRenderScale = 0.5;  break;
      case 'medium': state.baseSteps = 80;  state.density = 1.4;  state.maxRenderScale = 0.75; break;
      case 'high':   state.baseSteps = 128; state.density = 1.8;  state.maxRenderScale = 1.0;  break;
      case 'ultra':  state.baseSteps = 192; state.density = 2.5;  state.maxRenderScale = 1.0;  break;
      default:       state.baseSteps = 80;  state.density = 1.4;  state.maxRenderScale = 0.75;
    }
  }

  function toggleClip() {
    // Cycle: off → X → Y → Z → off
    state.clipAxis = (state.clipAxis + 2) % 4 - 1; // -1,0,1,2,-1,...
    state.clipPos = 0.0;
    return state.clipAxis;
  }

  function setClip(axis, pos) {
    state.clipAxis = axis;
    state.clipPos = pos !== undefined ? pos : 0.0;
  }

  function toggleMode() {
    state.renderMode = state.renderMode === 0 ? 1 : 0;
    // Isosurface has hard edges that need higher render resolution;
    // bump the floor so the adaptive scaler doesn't start too low.
    if (state.renderMode === 1) {
      state.minRenderScale = 0.5;
      if (state.renderScale < 0.65) state.renderScale = 0.65;
    } else {
      state.minRenderScale = 0.25;
    }
    return state.renderMode;
  }

  function setIsoLevel(level) {
    // 1.0 = 90% probability enclosure (default)
    // <1.0 = larger surface (more enclosure), >1.0 = smaller surface (less)
    state.isoLevel = Math.max(0.1, Math.min(3.0, level));
  }

  function togglePhaseMode() {
    state.phaseMode = state.phaseMode === 0 ? 1 : 0;
    return state.phaseMode;
  }

  // ══════════════════════════════════════════════════════════════════
  // 3D → 2D axis label projection
  // ══════════════════════════════════════════════════════════════════

  function projectAxes() {
    var rCut = state.rCut;
    var axisLen = rCut * 0.85;
    var camDist = rCut * 3.0 / state.zoom;
    var ct = Math.cos(state.camPhi), st = Math.sin(state.camPhi);
    var cp = Math.cos(state.camTheta), sp = Math.sin(state.camTheta);
    var eye = [camDist * ct * sp, camDist * st, camDist * ct * cp];

    var fwd = [-eye[0], -eye[1], -eye[2]];
    var fLen = Math.sqrt(fwd[0]*fwd[0] + fwd[1]*fwd[1] + fwd[2]*fwd[2]);
    fwd[0] /= fLen; fwd[1] /= fLen; fwd[2] /= fLen;

    var up = [0, 1, 0];
    if (Math.abs(fwd[0]*up[0] + fwd[1]*up[1] + fwd[2]*up[2]) > 0.99) up = [0, 0, 1];
    var right = [
      fwd[1]*up[2] - fwd[2]*up[1],
      fwd[2]*up[0] - fwd[0]*up[2],
      fwd[0]*up[1] - fwd[1]*up[0]
    ];
    var rLen = Math.sqrt(right[0]*right[0] + right[1]*right[1] + right[2]*right[2]);
    right[0] /= rLen; right[1] /= rLen; right[2] /= rLen;
    up = [
      right[1]*fwd[2] - right[2]*fwd[1],
      right[2]*fwd[0] - right[0]*fwd[2],
      right[0]*fwd[1] - right[1]*fwd[0]
    ];

    var fovRad = state.fov * Math.PI / 180;
    var tanHalf = Math.tan(fovRad * 0.5);

    var axes = [
      { label: 'x', pos: [axisLen, 0, 0], color: '#e64040' },
      { label: 'y', pos: [0, axisLen, 0], color: '#40cc4d' },
      { label: 'z', pos: [0, 0, axisLen], color: '#4d73f2' },
    ];
    var result = [];
    for (var i = 0; i < 3; i++) {
      var p = axes[i].pos;
      var rel = [p[0] - eye[0], p[1] - eye[1], p[2] - eye[2]];
      var z = rel[0]*fwd[0] + rel[1]*fwd[1] + rel[2]*fwd[2];
      if (z < 0.1) continue; // behind camera
      var x = rel[0]*right[0] + rel[1]*right[1] + rel[2]*right[2];
      var y = rel[0]*up[0] + rel[1]*up[1] + rel[2]*up[2];
      var aspect = (state.displayW || 1) / (state.displayH || 1);
      var sx = 0.5 + (x / (z * tanHalf * aspect)) * 0.5;
      var sy = 0.5 - (y / (z * tanHalf)) * 0.5;
      result.push({ label: axes[i].label, sx: sx, sy: sy, color: axes[i].color });
    }
    return result;
  }

  // ══════════════════════════════════════════════════════════════════
  // Cleanup
  // ══════════════════════════════════════════════════════════════════

  function destroy() {
    stopAnimation();
    if (state.isFullscreen) exitFullscreen();
    if (state.canvas) unbindEvents(state.canvas);
    if (state.gl) {
      if (state.fbo) state.gl.deleteFramebuffer(state.fbo);
      if (state.fboTexture) state.gl.deleteTexture(state.fboTexture);
      if (state.cloudProgram) state.gl.deleteProgram(state.cloudProgram);
      if (state.blitProgram) state.gl.deleteProgram(state.blitProgram);
      if (state.vao) state.gl.deleteVertexArray(state.vao);
      if (state.vbo) state.gl.deleteBuffer(state.vbo);
      state.gl = null;
    }
    state.canvas = null;
    state.initialized = false;
    state.fbo = null;
    state.fboTexture = null;
    state.cloudProgram = null;
    state.blitProgram = null;
    state.vao = null;
    state.vbo = null;
  }

  // ══════════════════════════════════════════════════════════════════
  // Public API
  // ══════════════════════════════════════════════════════════════════

  return {
    isSupported: isSupported,
    init: init,
    setOrbitals: setOrbitals,
    setFilter: setFilter,
    setQuality: setQuality,
    drawFrame: drawFrame,
    startAnimation: startAnimation,
    stopAnimation: stopAnimation,
    bindEvents: bindEvents,
    resetCamera: resetCamera,
    toggleClip: toggleClip,
    setClip: setClip,
    toggleMode: toggleMode,
    setIsoLevel: setIsoLevel,
    togglePhaseMode: togglePhaseMode,
    enterFullscreen: enterFullscreen,
    exitFullscreen: exitFullscreen,
    toggleFullscreen: toggleFullscreen,
    destroy: destroy,
    projectAxes: projectAxes,
    state: state,
  };

})();
