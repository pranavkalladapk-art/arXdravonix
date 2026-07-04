"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import ExplodedCylinder from "./ExplodedCylinder";
import { useIsMobile } from "@/lib/useIsMobile";

export default function ExplodedScene({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const isMobile = useIsMobile();

  return (
    <Canvas
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      gl={{ antialias: !isMobile, powerPreference: isMobile ? "default" : "high-performance", failIfMajorPerformanceCaveat: false }}
      camera={{ position: [0, 0.5, 11], fov: 32 }}
      shadows={!isMobile}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 12, 22]} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} castShadow={!isMobile} />
      <pointLight position={[-5, -1, -3]} intensity={7} color="#00d5ff" distance={14} />
      <pointLight position={[4, -2, 3]} intensity={4} color="#5be8ff" distance={12} />

      <Suspense fallback={null}>
        <ExplodedCylinder progressRef={progressRef} />
        <Sparkles count={isMobile ? 20 : 50} scale={[8, 10, 6]} size={1.5} speed={0.2} opacity={0.35} color="#5be8ff" />
        <Environment resolution={64}>
          <group>
            <Lightformer intensity={2} color="#ffffff" position={[0, 4, -5]} scale={[10, 2, 1]} form="rect" />
            <Lightformer intensity={4} color="#00d5ff" position={[-6, 0, 2]} scale={[1, 8, 1]} form="rect" />
            <Lightformer intensity={2.5} color="#5be8ff" position={[6, -1, 3]} scale={[1, 6, 1]} form="rect" />
          </group>
        </Environment>
      </Suspense>
    </Canvas>
  );
}
