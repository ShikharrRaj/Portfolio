"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const COUNT = 2600;
const RADIUS = 1.7;

// Amber → coral palette for per-point vertex colors.
const C1 = new THREE.Color("#f5b042");
const C2 = new THREE.Color("#ff6b4a");
const C3 = new THREE.Color("#ffd27a");

/**
 * A rotating sphere built from thousands of glowing points distributed via a
 * Fibonacci spiral (even coverage). Colors blend across the palette and the
 * whole constellation tilts toward the cursor.
 */
function ParticleSphere() {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const golden = Math.PI * (3 - Math.sqrt(5)); // golden angle
    const tmp = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2; // 1 → -1
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      // slight radius jitter so it reads as a soft shell, not a hard surface
      const rad = RADIUS * (0.92 + Math.random() * 0.12);
      positions[i * 3] = Math.cos(theta) * r * rad;
      positions[i * 3 + 1] = y * rad;
      positions[i * 3 + 2] = Math.sin(theta) * r * rad;

      // blend C1→C2 by latitude, sprinkle C3 highlights
      const t = (y + 1) / 2;
      tmp.copy(C1).lerp(C2, t);
      if (Math.random() > 0.88) tmp.copy(C3);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = t * 0.12;
    group.current.rotation.z = Math.sin(t * 0.1) * 0.05;
    // ease toward pointer
    const px = (state.pointer.x * viewport.width) / 26;
    const py = (state.pointer.y * viewport.height) / 26;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, py, 0.04);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, px, 0.05);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.9}>
      <group ref={group}>
        {/* the points */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
              count={COUNT}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[colors, 3]}
              count={COUNT}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.035}
            sizeAttenuation
            vertexColors
            transparent
            opacity={0.95}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* faint inner wireframe core for depth */}
        <mesh>
          <icosahedronGeometry args={[RADIUS * 0.55, 1]} />
          <meshBasicMaterial
            color="#ff6b4a"
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Rig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.5, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.5, 0.04);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <ParticleSphere />
        <Rig />
      </Suspense>
    </Canvas>
  );
}
