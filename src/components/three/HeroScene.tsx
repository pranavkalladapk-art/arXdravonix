"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles, Float } from "@react-three/drei";
import HydraulicCylinder from "./HydraulicCylinder";
import { useIsMobile } from "@/lib/useIsMobile";

export default function HeroScene({
  scrollRef,
  pointerRef,
}: {
  scrollRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const isMobile = useIsMobile();

  return (
    <Canvas
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      gl={{ antialias: !isMobile, powerPreference: isMobile ? "default" : "high-performance", failIfMajorPerformanceCaveat: false }}
      camera={{ position: [2.2, 0.2, 12.5], fov: 30 }}
      shadows={!isMobile}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 11, 20]} />

      <ambientLight intensity={0.25} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.8}
        castShadow={!isMobile}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, -2, -3]} intensity={8} color="#00d5ff" distance={12} />
      <pointLight position={[3, -3, 2]} intensity={4} color="#5be8ff" distance={10} />

      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0} floatIntensity={0.6}>
          <group position={[1.6, -0.2, 0]} scale={0.85}>
            <HydraulicCylinder scrollRef={scrollRef} pointerRef={pointerRef} />
          </group>
        </Float>

        <Sparkles
          count={isMobile ? 30 : 80}
          scale={[10, 8, 6]}
          size={2}
          speed={0.25}
          opacity={0.5}
          color="#5be8ff"
        />
        {!isMobile && (
          <Sparkles count={40} scale={[14, 10, 8]} size={1} speed={0.15} opacity={0.25} color="#ffffff" />
        )}

        <Environment resolution={64}>
          <group>
            <Lightformer
              intensity={2.5}
              color="#ffffff"
              position={[0, 4, -5]}
              scale={[10, 2, 1]}
              form="rect"
            />
            <Lightformer
              intensity={4}
              color="#00d5ff"
              position={[-6, 0, 2]}
              scale={[1, 8, 1]}
              form="rect"
            />
            <Lightformer
              intensity={3}
              color="#5be8ff"
              position={[6, -1, 3]}
              scale={[1, 6, 1]}
              form="rect"
            />
            <Lightformer
              intensity={1.5}
              color="#ffffff"
              position={[0, -5, 4]}
              scale={[8, 1, 1]}
              form="rect"
            />
          </group>
        </Environment>
      </Suspense>
    </Canvas>
  );
}
