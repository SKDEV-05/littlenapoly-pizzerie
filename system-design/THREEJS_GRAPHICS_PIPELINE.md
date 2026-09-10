# Little Napoli: 3D Graphics & WebGL Rendering Pipeline

This document defines the 3D graphics architecture, shaders, memory lifecycle, and performance constraints across Skills 11–20 and 86/90.

---

## 1. 3D Engine Stack

- **Core Library:** Three.js (r160+)
- **React Bindings:** `@react-three/fiber` (R3F v8+)
- **Helpers:** `@react-three/drei` (Canvas controls, ContactShadows, Float, Environment)
- **Asset Pipeline:** Draco compressed `.glb` binary models (target size < 1.2 MB per model)
- **Animation Sync:** GSAP + ScrollTrigger via `@gsap/react`

---

## 2. GLSL Shader Architecture for Neapolitan *Cornicione*

Authentic Neapolitan pizza crust features blistered, charred spots known as leopard spotting (*maculatura*). We achieve this via custom procedural vertex and fragment shaders combined with a normal map.

### Crust Fragment Shader (`shaders/cornicione.frag.glsl`)
```glsl
uniform sampler2D uDoughTexture;
uniform sampler2D uNoiseTexture;
uniform float uCharIntensity;
uniform vec3 uCharColor; // Dark espresso/carbon black

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec4 baseColor = texture2D(uDoughTexture, vUv);
    vec4 noise = texture2D(uNoiseTexture, vUv * 8.0);
    
    // Calculate curvature / rim factor for the high outer crust (cornicione)
    float rimFactor = smoothstep(0.4, 0.9, length(vUv - vec2(0.5)));
    
    // Procedural leopard spotting threshold
    float spots = smoothstep(0.65 - (uCharIntensity * 0.1), 0.75, noise.r * rimFactor);
    
    vec3 finalColor = mix(baseColor.rgb, uCharColor, spots * 0.85);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
```

---

## 3. WebGL Resource Management & Memory Disposal (Skill 16 & 90)

To prevent memory leaks during client-side navigation:
```typescript
export function disposeWebGLHierarchy(object: THREE.Object3D) {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((mat) => disposeMaterial(mat));
      } else if (mesh.material) {
        disposeMaterial(mesh.material);
      }
    }
  });
}

function disposeMaterial(mat: THREE.Material) {
  Object.keys(mat).forEach((prop) => {
    const value = (mat as any)[prop];
    if (value && typeof value.dispose === 'function') {
      value.dispose();
    }
  });
  mat.dispose();
}
```

---

## 4. Mobile Performance Guardrails

- **DPR Clamping:** Clamped dynamically to `Math.min(window.devicePixelRatio, 2)` to avoid extreme GPU fill-rates on high-res Retina displays.
- **Power Preference:** Canvas initialized with `gl={{ powerPreference: 'high-performance', antialias: true, alpha: true }}`.
- **Context Loss Recovery:** Listeners attached to `webglcontextlost` and `webglcontextrestored` to gracefully rehydrate canvas without page crash.
