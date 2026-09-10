# Rule 03: WebGL, Three.js & 3D Interactive Graphics

## 1. Scope & Applicable Skills
This rule enforces high-performance 3D rendering standards for **Skills 031–040** within `apps/frontend-nextjs/src/components/3d/`.

- **Skill 031:** Isolated React Three Fiber Canvas with dynamic SSR bypass (`ssr: false`).
- **Skill 032:** Damped camera rigs and orbit controls via `@react-three/drei`.
- **Skill 033:** Draco and Meshopt compressed GLTF/GLB asset loading pipelines.
- **Skill 034:** Custom GLSL shaders simulating blistered and charred crust (*cornicione*).
- **Skill 035:** GPU particle system simulating realistic rising steam.
- **Skill 036:** Strict WebGL resource disposal (geometries, textures, materials) on unmount.
- **Skill 037:** Studio-grade HDR environment map lighting and contact shadows.
- **Skill 038:** 3D Raycasting topping selector for ingredient inspection.
- **Skill 039:** GSAP ScrollTrigger timeline orchestrating exploded pizza view.
- **Skill 040:** Dynamic DPR clamping `[1, 2]` with mobile battery/performance fallbacks.

---

## 2. 3D Component Architecture

```text
apps/frontend-nextjs/src/
├── components/3d/
│   ├── PizzaCanvas.tsx            # Dynamic entry point with Suspense & Fallback
│   ├── PizzaModel.tsx             # Main 3D model with GLSL charred crust shader
│   ├── CameraRig.tsx              # Drei presentation controls & smooth dampening
│   ├── SteamParticles.tsx         # Instanced GPU steam particle emitter
│   ├── ToppingSelector.tsx        # Raycast click handler on individual ingredients
│   ├── LightingEnvironment.tsx    # HDRI warm kitchen setup & ContactShadows
│   └── ScrollStage.tsx            # GSAP ScrollTrigger timeline controller
├── hooks/
│   ├── useWebGLCleanup.ts         # Recursively disposes geometries/materials/textures
│   └── useDevicePerformance.ts    # Detects GPU tier and clamps DPR / LOD
└── shaders/
    ├── cornicione.vert.glsl       # Vertex displacement for blistered crust
    └── cornicione.frag.glsl       # Fragment shader for procedural charred spots
```

---

## 3. Core Technical Standards

### A. Dynamic Canvas Import (No SSR WebGL Crashes)
The 3D Canvas must always be exported via a dynamic client wrapper:

```typescript
'use client';

import dynamic from 'next/dynamic';
import { SkeletonPizza } from '@/components/ui/SkeletonPizza';

export const DynamicPizzaCanvas = dynamic(
  () => import('@/components/3d/PizzaCanvas').then((mod) => mod.PizzaCanvas),
  {
    ssr: false,
    loading: () => <SkeletonPizza />,
  }
);
```

### B. Procedural *Cornicione* GLSL Shader
To represent true Neapolitan pizza, the outer crust (*cornicione*) must use a procedural shader that blends high-frequency noise with vertex normals to generate realistic leopard spots:

```glsl
// cornicione.frag.glsl
precision highp float;

uniform sampler2D uBaseDough;
uniform sampler2D uNoiseMap;
uniform float uBakeIntensity; // 0.0 to 1.0
uniform vec3 uCharColor;      // rgb(25, 20, 18)

varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vec4 baseColor = texture2D(uBaseDough, vUv);
    vec4 noise = texture2D(uNoiseMap, vUv * 6.0);
    
    // Rim detection for cornicione edge
    float rim = smoothstep(0.45, 0.95, length(vUv - vec2(0.5)));
    
    // Char spot calculation
    float charSpots = smoothstep(0.68 - (uBakeIntensity * 0.12), 0.76, noise.r * rim);
    
    vec3 finalColor = mix(baseColor.rgb, uCharColor, charSpots * 0.9);
    gl_FragColor = vec4(finalColor, 1.0);
}
```

### C. WebGL Resource Disposal Sweep
Every 3D mesh unmounted during navigation must clear GPU VRAM:

```typescript
// useWebGLCleanup.ts
import { useEffect } from 'react';
import * as THREE from 'three';

export function useWebGLCleanup(sceneRef: React.RefObject<THREE.Group | null>) {
  useEffect(() => {
    return () => {
      if (!sceneRef.current) return;
      sceneRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => mat.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
    };
  }, [sceneRef]);
}
```
