"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * A distorted, slowly-rotating crystal that subtly tilts toward the cursor.
 * Wrapped in <Float> for an idle drift. Pure decoration — aria-hidden.
 */
function Crystal() {
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.15;
    mesh.current.rotation.x = t * 0.08;
    // ease toward pointer for a "reacts to mouse" feel
    const px = (state.pointer.x * viewport.width) / 14;
    const py = (state.pointer.y * viewport.height) / 14;
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, px, 0.05);
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, py, 0.05);
  });

  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.4}>
      <Icosahedron ref={mesh} args={[1.4, 12]}>
        <MeshDistortMaterial
          color="#f5b042"
          emissive="#ff6b4a"
          emissiveIntensity={0.35}
          roughness={0.28}
          metalness={0.55}
          distort={0.42}
          speed={1.8}
        />
      </Icosahedron>
    </Float>
  );
}

function Rig() {
  // gentle camera parallax
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.6,
      0.04,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 0.6,
      0.04,
    );
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
        {/* Self-contained lighting — no remote HDR/env map, so the scene
            never depends on a network fetch at runtime. */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} intensity={1.6} color="#ffd27a" />
        <pointLight position={[-4, -2, -2]} intensity={2.4} color="#ff6b4a" />
        <pointLight position={[4, -3, 2]} intensity={1.6} color="#f5b042" />
        <spotLight position={[0, 5, 4]} intensity={1.2} angle={0.6} penumbra={1} color="#ffffff" />
        <Crystal />
        <Rig />
      </Suspense>
    </Canvas>
  );
}
