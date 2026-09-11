'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';

export function PizzaCanvasContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [sauce, setSauce] = useState<'red' | 'yellow'>('red');
  const [toppings, setToppings] = useState({
    basil: true,
    cherryTomatoes: true,
    mushrooms: true,
  });

  const sauceMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const basilGroupRef = useRef<THREE.Group | null>(null);
  const tomatoGroupRef = useRef<THREE.Group | null>(null);
  const mushroomGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 2.3, 3.2);

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
    controls.minDistance = 2.0;
    controls.maxDistance = 5.0;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 2.2;

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff8ee, 2.0);
    mainLight.position.set(5, 8, 4);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffe0b2, 0.8);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // 5. Build 3D Neapolitan Pizza Hierarchy
    const pizzaGroup = new THREE.Group();
    pizzaGroup.position.set(0, -0.15, 0);

    // A. Cornicione (Raised Outer Dough Rim)
    const rimGeom = new THREE.TorusGeometry(1.45, 0.28, 24, 48);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd4b088,
      roughness: 0.75,
      metalness: 0.05,
    });
    const rimMesh = new THREE.Mesh(rimGeom, rimMat);
    rimMesh.position.set(0, 0.08, 0);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.castShadow = true;
    rimMesh.receiveShadow = true;
    pizzaGroup.add(rimMesh);

    // Charred spots decals on outer cornicione
    const charMat = new THREE.MeshStandardMaterial({ color: 0x1e140f, roughness: 0.9 });
    const spotCoords = [
      [1.1, 0.26, 0.6, 0.09],
      [-1.2, 0.25, 0.4, 0.08],
      [0.2, 0.28, -1.3, 0.1],
      [-0.7, 0.27, -1.0, 0.07],
      [0.9, 0.25, -0.8, 0.08],
    ];
    spotCoords.forEach(([x, y, z, s]) => {
      const spotGeom = new THREE.SphereGeometry(s, 8, 8);
      const spotMesh = new THREE.Mesh(spotGeom, charMat);
      spotMesh.position.set(x, y, z);
      pizzaGroup.add(spotMesh);
    });

    // B. Base Dough Floor
    const baseGeom = new THREE.CylinderGeometry(1.42, 1.45, 0.06, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xe8d1b5, roughness: 0.8 });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.set(0, 0.02, 0);
    baseMesh.receiveShadow = true;
    pizzaGroup.add(baseMesh);

    // C. Tomato Sauce (San Marzano Red or Yellow Datterino)
    const sauceGeom = new THREE.CylinderGeometry(1.3, 1.3, 0.03, 32);
    const sauceMat = new THREE.MeshStandardMaterial({
      color: sauce === 'yellow' ? 0xf4a900 : 0xc8232c,
      roughness: 0.25,
      metalness: 0.1,
    });
    sauceMaterialRef.current = sauceMat;
    const sauceMesh = new THREE.Mesh(sauceGeom, sauceMat);
    sauceMesh.position.set(0, 0.06, 0);
    sauceMesh.receiveShadow = true;
    pizzaGroup.add(sauceMesh);

    // D. Sorrento Fior di Latte / Buffalo Mozzarella Melted Patches
    const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xfcfbf7, roughness: 0.4 });
    const cheesePatches = [
      [0.3, 0.08, 0.2, 0.32],
      [-0.4, 0.08, 0.3, 0.28],
      [0.1, 0.08, -0.45, 0.35],
      [-0.5, 0.08, -0.25, 0.26],
      [0.55, 0.08, -0.2, 0.24],
    ];
    cheesePatches.forEach(([x, y, z, r]) => {
      const cheeseGeom = new THREE.CylinderGeometry(r, r * 1.1, 0.025, 16);
      const patch = new THREE.Mesh(cheeseGeom, cheeseMat);
      patch.position.set(x, y, z);
      pizzaGroup.add(patch);
    });

    // E. Cherry Tomatoes Group
    const tomatoGroup = new THREE.Group();
    tomatoGroupRef.current = tomatoGroup;
    const tomatoMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.15, metalness: 0.1 });
    const tomatoPositions = [
      [0.45, 0.11, 0.4],
      [-0.35, 0.11, -0.55],
      [-0.65, 0.11, 0.35],
      [0.2, 0.11, -0.7],
    ];
    tomatoPositions.forEach(([x, y, z]) => {
      const tomGeom = new THREE.SphereGeometry(0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const tomMesh = new THREE.Mesh(tomGeom, tomatoMat);
      tomMesh.position.set(x, y, z);
      tomMesh.castShadow = true;
      tomatoGroup.add(tomMesh);
    });
    pizzaGroup.add(tomatoGroup);

    // F. Mushrooms Group
    const mushroomGroup = new THREE.Group();
    mushroomGroupRef.current = mushroomGroup;
    const shroomMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.7 });
    const shroomPositions = [
      [0.55, 0.1, -0.35],
      [-0.2, 0.1, 0.55],
      [-0.45, 0.1, -0.2],
    ];
    shroomPositions.forEach(([x, y, z]) => {
      const shroomGeom = new THREE.CylinderGeometry(0.14, 0.16, 0.03, 16);
      const shroomMesh = new THREE.Mesh(shroomGeom, shroomMat);
      shroomMesh.position.set(x, y, z);
      shroomMesh.castShadow = true;
      mushroomGroup.add(shroomMesh);
    });
    pizzaGroup.add(mushroomGroup);

    // G. Fresh Basil Leaves Group
    const basilGroup = new THREE.Group();
    basilGroupRef.current = basilGroup;
    const basilMat = new THREE.MeshStandardMaterial({ color: 0x008c45, roughness: 0.3, metalness: 0.05 });
    const basilPositions = [
      [0.0, 0.13, 0.0, 0.2],
      [0.4, 0.12, -0.2, -0.8],
      [-0.3, 0.12, 0.2, 1.2],
    ];
    basilPositions.forEach(([x, y, z, rot]) => {
      const leafGeom = new THREE.CylinderGeometry(0.08, 0.2, 0.02, 12);
      const leafMesh = new THREE.Mesh(leafGeom, basilMat);
      leafMesh.position.set(x, y, z);
      leafMesh.rotation.y = rot;
      leafMesh.castShadow = true;
      basilGroup.add(leafMesh);
    });
    pizzaGroup.add(basilGroup);

    // H. Soft Contact Shadow Plate below
    const shadowGeom = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.15,
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.position.set(0, -0.16, 0);
    shadowMesh.rotation.x = -Math.PI / 2;
    pizzaGroup.add(shadowMesh);

    scene.add(pizzaGroup);

    // 6. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Slow gentle floating rotation
      pizzaGroup.rotation.y += 0.003;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 7. Responsive Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 8. Cleanup on Unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Update sauce color dynamically
  useEffect(() => {
    if (sauceMaterialRef.current) {
      sauceMaterialRef.current.color.setHex(sauce === 'yellow' ? 0xf4a900 : 0xc8232c);
    }
  }, [sauce]);

  // Update topping visibility dynamically
  useEffect(() => {
    if (basilGroupRef.current) basilGroupRef.current.visible = toppings.basil;
    if (tomatoGroupRef.current) tomatoGroupRef.current.visible = toppings.cherryTomatoes;
    if (mushroomGroupRef.current) mushroomGroupRef.current.visible = toppings.mushrooms;
  }, [toppings]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] rounded-3xl overflow-hidden bg-gradient-to-b from-napoli-cream to-white border border-border/60 shadow-xl flex flex-col justify-between p-6"
    >
      {/* Top HUD Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="dop" className="gap-1.5 py-1 px-3">
            <Flame className="w-3.5 h-3.5 text-napoli-red" />
            485°C Holzofen Fermentiert (48h)
          </Badge>
          <Badge variant="outline" className="hidden sm:inline-flex text-xs bg-white/80">
            360° Drehbar & Interaktiv
          </Badge>
        </div>

        {/* Sauce Switcher */}
        <div className="flex items-center bg-white/90 backdrop-blur rounded-lg p-1 border border-border/80 shadow-sm gap-1">
          <button
            type="button"
            onClick={() => setSauce('red')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              sauce === 'red'
                ? 'bg-napoli-red text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            San Marzano D.O.P.
          </button>
          <button
            type="button"
            onClick={() => setSauce('yellow')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              sauce === 'yellow'
                ? 'bg-napoli-yellow text-napoli-char shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Datterino Giallo
          </button>
        </div>
      </div>

      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
      />

      {/* Bottom HUD Topping Toggles */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/40 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          Zutaten einblenden:
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={toppings.basil ? 'default' : 'outline'}
            className={toppings.basil ? 'bg-napoli-green hover:bg-napoli-greenDark h-8 text-xs text-white' : 'h-8 text-xs'}
            onClick={() => setToppings((t) => ({ ...t, basil: !t.basil }))}
          >
            Basilikum
          </Button>
          <Button
            size="sm"
            variant={toppings.cherryTomatoes ? 'default' : 'outline'}
            className={toppings.cherryTomatoes ? 'bg-napoli-red hover:bg-napoli-redDark h-8 text-xs text-white' : 'h-8 text-xs'}
            onClick={() => setToppings((t) => ({ ...t, cherryTomatoes: !t.cherryTomatoes }))}
          >
            Kirschtomaten
          </Button>
          <Button
            size="sm"
            variant={toppings.mushrooms ? 'default' : 'outline'}
            className={toppings.mushrooms ? 'bg-stone-700 hover:bg-stone-800 h-8 text-xs text-white' : 'h-8 text-xs'}
            onClick={() => setToppings((t) => ({ ...t, mushrooms: !t.mushrooms }))}
          >
            Champignons
          </Button>
        </div>
      </div>
    </div>
  );
}
