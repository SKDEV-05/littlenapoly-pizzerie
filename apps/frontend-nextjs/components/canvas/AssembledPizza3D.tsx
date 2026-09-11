'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BasilLeaf3D } from './BasilLeaf3D';
import { TomatoTopping3D } from './TomatoTopping3D';
import { ChampignonTopping3D } from './ChampignonTopping3D';

interface AssembledPizza3DProps {
  sauceType?: 'red' | 'yellow';
  bakeIntensity?: number; // 0 to 1
  toppings?: {
    basil?: boolean;
    cherryTomatoes?: boolean;
    mushrooms?: boolean;
  };
}

export function AssembledPizza3D({
  sauceType = 'red',
  bakeIntensity = 0.8,
  toppings = { basil: true, cherryTomatoes: true, mushrooms: true },
}: AssembledPizza3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Gentle idle floating rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const sauceColor = sauceType === 'yellow' ? '#F4A900' : '#C8232C';

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* 1. Neapolitan Cornicione (Raised Outer Dough Rim) */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <torusGeometry args={[1.5, 0.28, 24, 48]} />
        <meshStandardMaterial
          color="#D4B088"
          roughness={0.75}
          metalness={0.05}
        />
      </mesh>

      {/* Procedural charred spot blister decals on outer cornicione */}
      <mesh position={[1.2, 0.26, 0.6]} rotation={[0.4, 0.8, 0.2]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#1E140F" roughness={0.9} />
      </mesh>
      <mesh position={[-1.3, 0.25, 0.4]} rotation={[-0.2, 0.5, 0.1]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#1E140F" roughness={0.9} />
      </mesh>
      <mesh position={[0.2, 0.28, -1.4]} rotation={[0.1, -0.4, 0.3]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#1E140F" roughness={0.9} />
      </mesh>
      <mesh position={[-0.7, 0.27, -1.1]} rotation={[-0.3, 0.2, -0.2]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#1E140F" roughness={0.9} />
      </mesh>

      {/* 2. Pizza Base Dough Center */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[1.45, 1.48, 0.06, 32]} />
        <meshStandardMaterial color="#E8D1B5" roughness={0.8} />
      </mesh>

      {/* 3. San Marzano D.O.P. or Yellow Datterino Sauce Layer */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[1.32, 1.32, 0.03, 32]} />
        <meshStandardMaterial
          color={sauceColor}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* 4. Sorrento Fior di Latte / Buffalo Mozzarella Melted Islands */}
      <group position={[0, 0.08, 0]}>
        <mesh position={[0.3, 0, 0.2]} rotation={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.32, 0.36, 0.025, 16]} />
          <meshStandardMaterial color="#FCFBF7" roughness={0.4} />
        </mesh>
        <mesh position={[-0.4, 0, 0.3]} rotation={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.28, 0.34, 0.025, 16]} />
          <meshStandardMaterial color="#FCFBF7" roughness={0.4} />
        </mesh>
        <mesh position={[0.1, 0, -0.45]} rotation={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.35, 0.38, 0.025, 16]} />
          <meshStandardMaterial color="#FCFBF7" roughness={0.4} />
        </mesh>
        <mesh position={[-0.5, 0, -0.25]} rotation={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.26, 0.3, 0.025, 16]} />
          <meshStandardMaterial color="#FCFBF7" roughness={0.4} />
        </mesh>
        <mesh position={[0.6, 0, -0.2]} rotation={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.24, 0.28, 0.025, 16]} />
          <meshStandardMaterial color="#FCFBF7" roughness={0.4} />
        </mesh>
      </group>

      {/* 5. Interactive Toppings */}
      {toppings.cherryTomatoes && (
        <group>
          <TomatoTopping3D position={[0.45, 0.11, 0.4]} rotation={[0.2, 0.4, 0.1]} />
          <TomatoTopping3D position={[-0.35, 0.11, -0.55]} rotation={[-0.1, 0.8, -0.2]} />
          <TomatoTopping3D position={[-0.65, 0.11, 0.35]} rotation={[0.1, -0.3, 0.2]} />
          <TomatoTopping3D position={[0.2, 0.11, -0.7]} rotation={[0.3, 0.2, 0]} />
        </group>
      )}

      {toppings.mushrooms && (
        <group>
          <ChampignonTopping3D position={[0.55, 0.1, -0.35]} rotation={[0, 0.8, 0.1]} />
          <ChampignonTopping3D position={[-0.2, 0.1, 0.55]} rotation={[0, -0.5, -0.1]} />
          <ChampignonTopping3D position={[-0.45, 0.1, -0.2]} rotation={[0, 1.2, 0.05]} />
        </group>
      )}

      {toppings.basil && (
        <group>
          <BasilLeaf3D position={[0.0, 0.13, 0.0]} rotation={[0.2, 0.6, -0.1]} scale={1.1} />
          <BasilLeaf3D position={[0.4, 0.12, -0.2]} rotation={[-0.1, -0.8, 0.2]} scale={0.9} />
          <BasilLeaf3D position={[-0.3, 0.12, 0.2]} rotation={[0.1, 1.4, -0.2]} scale={0.95} />
        </group>
      )}
    </group>
  );
}
