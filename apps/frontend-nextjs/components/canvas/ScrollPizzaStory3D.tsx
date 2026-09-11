'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge';
import { Wheat, Flame, Sparkles, HeartHandshake, ChevronRight, RotateCcw } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STAGES = [
  {
    index: 0,
    title: '1. Der Teig (48h Fermentation)',
    subtitle: 'Caputo 00 Mehl & Kühle Teigruhe',
    icon: Wheat,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10 border-amber-500/30',
    description:
      'Reinstes neapolitanisches Caputo 00 Mehl, Quellwasser, Meersalz und minimale Hefe. Nach 48 Stunden schonender Reifung entsteht der unvergleichlich bekömmliche, samtige Teigrohling.',
  },
  {
    index: 1,
    title: '2. Die Zutaten (Frisch Belegt)',
    subtitle: 'San Marzano D.O.P. & Fior di Latte',
    icon: Sparkles,
    color: 'text-napoli-red',
    bgColor: 'bg-napoli-red/10 border-napoli-red/30',
    description:
      'Fruchtige San Marzano D.O.P. Tomatensauce vom Vesuv wird spiralförmig aufgetragen. Darauf schmelzen frischer Fior di Latte aus Sorrento, süße Datteltomaten und handgezupftes Basilikum.',
  },
  {
    index: 2,
    title: '3. Der 485°C Holzofen (Das Backen)',
    subtitle: '60–90 Sekunden Gluthitze & Flammen',
    icon: Flame,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10 border-orange-500/30',
    description:
      'Im Herzen des Holzofens bei 485°C explodiert das Cornicione! Die Kruste bildet die charakteristische Leoparden-Musterung (Maculatura) — außen zart knusprig, innen federleicht.',
  },
  {
    index: 3,
    title: '4. Serviert für den Gast',
    subtitle: 'Buon Appetito in Himberg bei Wien!',
    icon: HeartHandshake,
    color: 'text-napoli-green',
    bgColor: 'bg-napoli-green/10 border-napoli-green/30',
    description:
      'Auf der Holzschaufel dampfend frisch entnommen, verfeinert mit einem Schuss nativem Olivenöl extra. Direkt serviert an Ihren Tisch oder zur Abholung bereit.',
  },
];

export function ScrollPizzaStory3D() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [progressVal, setProgressVal] = useState<number>(0);

  // Three.js object references for smooth animation updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pizzaGroupRef = useRef<THREE.Group | null>(null);
  const peelMeshRef = useRef<THREE.Mesh | null>(null);
  const cornicioneMeshRef = useRef<THREE.Mesh | null>(null);
  const doughBaseMeshRef = useRef<THREE.Mesh | null>(null);
  const sauceMeshRef = useRef<THREE.Mesh | null>(null);
  const cheeseGroupRef = useRef<THREE.Group | null>(null);
  const tomatoGroupRef = useRef<THREE.Group | null>(null);
  const basilGroupRef = useRef<THREE.Group | null>(null);
  const spotsGroupRef = useRef<THREE.Group | null>(null);
  const ovenLightRef = useRef<THREE.PointLight | null>(null);
  const ovenGlowMeshRef = useRef<THREE.Mesh | null>(null);
  const steamParticlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 3.2, 3.8);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 2.2;
    controls.maxDistance = 5.5;
    controls.minPolarAngle = Math.PI / 8;
    controls.maxPolarAngle = Math.PI / 2.2;

    // 4. Lighting Environment
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfffaee, 2.2);
    mainLight.position.set(4, 7, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xffe6c2, 1.0);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // Roaring 485°C Oven Fire Point Light (activated in stage 3)
    const ovenFireLight = new THREE.PointLight(0xff4500, 0, 10);
    ovenFireLight.position.set(-2.5, 1.2, -1.8);
    scene.add(ovenFireLight);
    ovenLightRef.current = ovenFireLight;

    // Oven Glow Dome Backdrop (subtle curved mesh behind pizza in stage 3)
    const ovenGlowGeom = new THREE.SphereGeometry(4.5, 24, 24, 0, Math.PI, 0, Math.PI * 0.5);
    const ovenGlowMat = new THREE.MeshBasicMaterial({
      color: 0xff3300,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0,
    });
    const ovenGlowMesh = new THREE.Mesh(ovenGlowGeom, ovenGlowMat);
    ovenGlowMesh.position.set(0, -0.5, -2.5);
    ovenGlowMesh.rotation.x = Math.PI / 2;
    scene.add(ovenGlowMesh);
    ovenGlowMeshRef.current = ovenGlowMesh;

    // 5. Build 3D Pizza Hierarchy
    const pizzaGroup = new THREE.Group();
    pizzaGroupRef.current = pizzaGroup;
    pizzaGroup.position.set(0, -0.15, 0);

    // A. Wooden Pizza Peel (moves into frame in Stage 4)
    const peelGroup = new THREE.Group();
    const peelGeom = new THREE.CylinderGeometry(1.65, 1.65, 0.04, 32);
    const peelMat = new THREE.MeshStandardMaterial({
      color: 0xc49b71,
      roughness: 0.7,
      metalness: 0.05,
    });
    const peelHead = new THREE.Mesh(peelGeom, peelMat);
    peelHead.position.set(0, -0.06, 0);
    peelHead.receiveShadow = true;
    peelGroup.add(peelHead);

    const handleGeom = new THREE.BoxGeometry(0.2, 0.035, 2.5);
    const handleMesh = new THREE.Mesh(handleGeom, peelMat);
    handleMesh.position.set(0, -0.06, 2.7);
    peelGroup.add(handleMesh);

    peelGroup.position.set(0, -0.05, 0);
    pizzaGroup.add(peelGroup);
    peelMeshRef.current = peelHead;

    // B. Base Dough Disc (starts pale, unbaked, cooks to golden)
    const baseGeom = new THREE.CylinderGeometry(1.42, 1.45, 0.05, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xf5ebd9, // raw dough pale
      roughness: 0.85,
    });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.set(0, 0.0, 0);
    baseMesh.receiveShadow = true;
    pizzaGroup.add(baseMesh);
    doughBaseMeshRef.current = baseMesh;

    // C. Cornicione (Raised Rim: starts unbaked raw, puffs and chars in oven)
    const rimGeom = new THREE.TorusGeometry(1.44, 0.26, 24, 48);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xf3e6d1, // raw dough rim
      roughness: 0.8,
    });
    const rimMesh = new THREE.Mesh(rimGeom, rimMat);
    rimMesh.position.set(0, 0.06, 0);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.castShadow = true;
    rimMesh.receiveShadow = true;
    pizzaGroup.add(rimMesh);
    cornicioneMeshRef.current = rimMesh;

    // D. Leopard Charred Spots (Maculatura - hidden initially, emerges in Stage 3)
    const spotsGroup = new THREE.Group();
    spotsGroupRef.current = spotsGroup;
    const charMat = new THREE.MeshStandardMaterial({
      color: 0x1a0f0a,
      roughness: 0.95,
      transparent: true,
      opacity: 0,
    });
    const spotCoords = [
      [1.15, 0.24, 0.6, 0.08],
      [-1.25, 0.23, 0.45, 0.085],
      [0.2, 0.26, -1.32, 0.095],
      [-0.75, 0.25, -1.05, 0.075],
      [0.92, 0.24, -0.85, 0.08],
      [-0.3, 0.24, 1.35, 0.07],
      [1.3, 0.22, -0.2, 0.09],
    ];
    spotCoords.forEach(([x, y, z, s]) => {
      const spotGeom = new THREE.SphereGeometry(s, 10, 10);
      const spotMesh = new THREE.Mesh(spotGeom, charMat);
      spotMesh.position.set(x, y, z);
      spotsGroup.add(spotMesh);
    });
    pizzaGroup.add(spotsGroup);

    // E. Tomato Sauce Layer (expands/scales in Stage 2)
    const sauceGeom = new THREE.CylinderGeometry(1.3, 1.3, 0.025, 32);
    const sauceMat = new THREE.MeshStandardMaterial({
      color: 0xc8232c,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0,
    });
    const sauceMesh = new THREE.Mesh(sauceGeom, sauceMat);
    sauceMesh.position.set(0, 0.04, 0);
    sauceMesh.scale.set(0.01, 1, 0.01);
    pizzaGroup.add(sauceMesh);
    sauceMeshRef.current = sauceMesh;

    // F. Sorrento Fior di Latte (drops down in Stage 2)
    const cheeseGroup = new THREE.Group();
    cheeseGroupRef.current = cheeseGroup;
    const cheeseMat = new THREE.MeshStandardMaterial({
      color: 0xfdfbf7,
      roughness: 0.4,
      transparent: true,
      opacity: 0,
    });
    const cheesePatches = [
      [0.3, 0.065, 0.2, 0.32],
      [-0.4, 0.065, 0.3, 0.28],
      [0.1, 0.065, -0.45, 0.34],
      [-0.5, 0.065, -0.25, 0.26],
      [0.55, 0.065, -0.2, 0.25],
    ];
    cheesePatches.forEach(([x, y, z, r]) => {
      const cheeseGeom = new THREE.CylinderGeometry(r, r * 1.05, 0.02, 16);
      const patch = new THREE.Mesh(cheeseGeom, cheeseMat);
      patch.position.set(x, y + 0.8, z); // start high in the air
      cheeseGroup.add(patch);
    });
    pizzaGroup.add(cheeseGroup);

    // G. Cherry Tomatoes (drops down in Stage 2)
    const tomatoGroup = new THREE.Group();
    tomatoGroupRef.current = tomatoGroup;
    const tomatoMat = new THREE.MeshStandardMaterial({
      color: 0xb71c1c,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0,
    });
    const tomatoCoords = [
      [0.45, 0.09, 0.4],
      [-0.35, 0.09, -0.55],
      [-0.65, 0.09, 0.35],
      [0.2, 0.09, -0.7],
    ];
    tomatoCoords.forEach(([x, y, z]) => {
      const tomGeom = new THREE.SphereGeometry(0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const tomMesh = new THREE.Mesh(tomGeom, tomatoMat);
      tomMesh.position.set(x, y + 1.2, z); // start high in the air
      tomMesh.castShadow = true;
      tomatoGroup.add(tomMesh);
    });
    pizzaGroup.add(tomatoGroup);

    // H. Fresh Basil Leaves (drops down in Stage 2)
    const basilGroup = new THREE.Group();
    basilGroupRef.current = basilGroup;
    const basilMat = new THREE.MeshStandardMaterial({
      color: 0x008c45,
      roughness: 0.3,
      metalness: 0.05,
      transparent: true,
      opacity: 0,
    });
    const basilCoords = [
      [0.0, 0.1, 0.0, 0.3],
      [0.4, 0.1, -0.2, -0.8],
      [-0.3, 0.1, 0.2, 1.2],
    ];
    basilCoords.forEach(([x, y, z, rot]) => {
      const leafGeom = new THREE.CylinderGeometry(0.08, 0.2, 0.02, 12);
      const leafMesh = new THREE.Mesh(leafGeom, basilMat);
      leafMesh.position.set(x, y + 1.5, z); // start high
      leafMesh.rotation.y = rot;
      leafMesh.castShadow = true;
      basilGroup.add(leafMesh);
    });
    pizzaGroup.add(basilGroup);

    // I. Steam Particles (activated in Stage 4)
    const steamCount = 60;
    const steamGeom = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount * 3; i += 3) {
      steamPos[i] = (Math.random() - 0.5) * 1.8;
      steamPos[i + 1] = 0.2 + Math.random() * 1.5;
      steamPos[i + 2] = (Math.random() - 0.5) * 1.8;
    }
    steamGeom.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0,
    });
    const steam = new THREE.Points(steamGeom, steamMat);
    pizzaGroup.add(steam);
    steamParticlesRef.current = steam;

    scene.add(pizzaGroup);

    // 6. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating spin
      pizzaGroup.rotation.y += 0.002;

      // Animate steam particles in Stage 4
      if (steamParticlesRef.current && steamParticlesRef.current.material) {
        const positions = steamParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += 0.006;
          if (positions[i] > 1.8) positions[i] = 0.2;
        }
        steamParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Oven flicker in stage 3
      if (ovenFireLight.intensity > 0) {
        ovenFireLight.intensity = 3.5 + Math.sin(elapsedTime * 12) * 1.2 + Math.cos(elapsedTime * 20) * 0.8;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 7. GSAP ScrollTrigger Integration
    let scrollTriggerInstance: ScrollTrigger | null = null;

    if (triggerRef.current) {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: '+=2600',
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress; // 0.0 to 1.0
          setProgressVal(p);

          // Update active stage indicator (0, 1, 2, 3)
          if (p < 0.26) {
            setActiveStage(0);
          } else if (p < 0.52) {
            setActiveStage(1);
          } else if (p < 0.78) {
            setActiveStage(2);
          } else {
            setActiveStage(3);
          }

          // === STAGE 1 -> STAGE 2: INGREDIENTS ASSEMBLY (p: 0.15 to 0.45) ===
          const sauceP = THREE.MathUtils.clamp((p - 0.15) / 0.18, 0, 1);
          if (sauceMeshRef.current) {
            sauceMeshRef.current.scale.set(
              Math.max(0.01, sauceP * 1.0),
              1,
              Math.max(0.01, sauceP * 1.0)
            );
            (sauceMeshRef.current.material as THREE.MeshStandardMaterial).opacity = sauceP;
          }

          const cheeseP = THREE.MathUtils.clamp((p - 0.22) / 0.16, 0, 1);
          if (cheeseGroupRef.current) {
            cheeseGroupRef.current.children.forEach((child, i) => {
              const targetY = 0.065;
              const startY = 1.0 + i * 0.1;
              child.position.y = THREE.MathUtils.lerp(startY, targetY, cheeseP);
              (child as THREE.Mesh).scale.setScalar(cheeseP);
              ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = cheeseP;
            });
          }

          const tomP = THREE.MathUtils.clamp((p - 0.3) / 0.15, 0, 1);
          if (tomatoGroupRef.current) {
            tomatoGroupRef.current.children.forEach((child, i) => {
              const targetY = 0.09;
              const startY = 1.2 + i * 0.15;
              child.position.y = THREE.MathUtils.lerp(startY, targetY, tomP);
              ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = tomP;
            });
          }

          const basilP = THREE.MathUtils.clamp((p - 0.36) / 0.14, 0, 1);
          if (basilGroupRef.current) {
            basilGroupRef.current.children.forEach((child, i) => {
              const targetY = 0.1;
              const startY = 1.5 + i * 0.15;
              child.position.y = THREE.MathUtils.lerp(startY, targetY, basilP);
              ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = basilP;
            });
          }

          // === STAGE 2 -> STAGE 3: 485°C WOOD-FIRED OVEN BAKING (p: 0.48 to 0.76) ===
          const ovenP = THREE.MathUtils.clamp((p - 0.48) / 0.26, 0, 1);

          // Oven lighting and background glow
          if (ovenLightRef.current) {
            ovenLightRef.current.intensity = Math.sin(ovenP * Math.PI) * 4.5;
          }
          if (ovenGlowMeshRef.current) {
            (ovenGlowMeshRef.current.material as THREE.MeshBasicMaterial).opacity =
              Math.sin(ovenP * Math.PI) * 0.55;
          }

          // Crust color transitions from pale dough (0xf3e6d1) to baked Neapolitan crust (0xd4b088)
          const rawColor = new THREE.Color(0xf3e6d1);
          const bakedColor = new THREE.Color(0xd4b088);
          const currentColor = rawColor.clone().lerp(bakedColor, ovenP);

          if (cornicioneMeshRef.current) {
            (cornicioneMeshRef.current.material as THREE.MeshStandardMaterial).color.copy(currentColor);
            // Cornicione puffs up in the heat
            const puffScale = 1.0 + ovenP * 0.18;
            cornicioneMeshRef.current.scale.set(puffScale, puffScale, 1.0 + ovenP * 0.22);
          }

          if (doughBaseMeshRef.current) {
            const rawBase = new THREE.Color(0xf5ebd9);
            const bakedBase = new THREE.Color(0xe8d1b5);
            (doughBaseMeshRef.current.material as THREE.MeshStandardMaterial).color.copy(
              rawBase.lerp(bakedBase, ovenP)
            );
          }

          // Maculatura (leopard charred spots) appear during baking
          if (spotsGroupRef.current) {
            spotsGroupRef.current.children.forEach((spot) => {
              ((spot as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = ovenP;
            });
          }

          // === STAGE 3 -> STAGE 4: SERVING ON PEEL TO CUSTOMER (p: 0.74 to 1.0) ===
          const serveP = THREE.MathUtils.clamp((p - 0.74) / 0.26, 0, 1);

          // Steam appears as the pizza is served piping hot
          if (steamParticlesRef.current) {
            (steamParticlesRef.current.material as THREE.PointsMaterial).opacity = serveP * 0.55;
          }

          // Camera glide to intimate dining presentation angle
          if (cameraRef.current) {
            cameraRef.current.position.y = THREE.MathUtils.lerp(3.2, 2.5, serveP);
            cameraRef.current.position.z = THREE.MathUtils.lerp(3.8, 3.2, serveP);
          }
        },
      });
    }

    // 8. Responsive Resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !renderer) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  const jumpToStage = (idx: number) => {
    if (!triggerRef.current) return;
    const progressTargets = [0.05, 0.38, 0.65, 0.95];
    const targetScroll =
      triggerRef.current.offsetTop + progressTargets[idx] * 2600;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const currentStage = STAGES[activeStage];
  const IconComponent = currentStage.icon;

  return (
    <section
      id="pizza-journey"
      ref={triggerRef}
      className="relative w-full h-screen min-h-[700px] max-h-[1080px] bg-gradient-to-b from-background via-napoli-cream/30 to-background overflow-hidden flex flex-col justify-between"
    >
      {/* Top Bar Header & Stage Track */}
      <div className="relative z-20 pt-6 px-4 md:px-8 container max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="napoli" className="text-xs">
                GSAP Scroll-Erlebnis
              </Badge>
              <Badge variant="outline" className="bg-white/80 text-xs">
                Drehen & Zoomen möglich
              </Badge>
            </div>
            <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-napoli-char">
              Die Entstehung der Autentica Pizza Napoletana
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Scrollen Sie nach unten, um die 4 Schritte der Zubereitung hautnah zu erleben.
            </p>
          </div>

          {/* Interactive Stage Selectors */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-border shadow-sm">
            {STAGES.map((stg) => (
              <button
                key={stg.index}
                type="button"
                onClick={() => jumpToStage(stg.index)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeStage === stg.index
                    ? 'bg-napoli-red text-white shadow-sm scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span>{stg.index + 1}</span>
                <span className="hidden md:inline">{stg.title.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Global Scroll Progress Bar */}
        <div className="w-full h-1 bg-stone-200 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-napoli-red to-napoli-green transition-all duration-100 ease-out"
            style={{ width: `${Math.round(progressVal * 100)}%` }}
          />
        </div>
      </div>

      {/* 3D WebGL Canvas Layer */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
        <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      </div>

      {/* Bottom Floating Narrative HUD Card */}
      <div className="relative z-20 pb-8 px-4 md:px-8 container max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md border border-border/80 rounded-3xl p-6 shadow-2xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${currentStage.bgColor}`}
              >
                <IconComponent className={`w-6 h-6 ${currentStage.color}`} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Schritt {currentStage.index + 1} von 4
                  </span>
                  <span className="text-xs text-stone-300">•</span>
                  <span className="text-xs font-medium text-napoli-red">
                    {currentStage.subtitle}
                  </span>
                </div>
                <h3 className="font-poppins text-xl font-bold text-napoli-char">
                  {currentStage.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 max-w-2xl">
                  {currentStage.description}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
              <span className="text-[11px] font-mono text-muted-foreground">
                Scroll: {Math.round(progressVal * 100)}%
              </span>
              {activeStage < 3 ? (
                <button
                  type="button"
                  onClick={() => jumpToStage(activeStage + 1)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-napoli-red hover:underline"
                >
                  Nächster Schritt
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => jumpToStage(0)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-napoli-green hover:underline"
                >
                  Nochmal erleben
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
