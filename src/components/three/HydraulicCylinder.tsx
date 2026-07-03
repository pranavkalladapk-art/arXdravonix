"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HydraulicCylinderProps {
  scrollRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}

const METAL_BARREL = "#9aa0aa";
const METAL_DARK = "#4a4e56";
const CHROME = "#eef3f6";
const CYAN = "#00d5ff";

function HexBolts({ radius, count, y }: { radius: number; count: number; y: number }) {
  const positions = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const a = (i / count) * Math.PI * 2;
      return [Math.cos(a) * radius, y, Math.sin(a) * radius] as [number, number, number];
    });
  }, [radius, count, y]);

  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.12, 6]} />
          <meshStandardMaterial color={METAL_DARK} metalness={0.95} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export default function HydraulicCylinder({ scrollRef, pointerRef }: HydraulicCylinderProps) {
  const group = useRef<THREE.Group>(null);
  const rodGroup = useRef<THREE.Group>(null);
  const ringMat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    if (!group.current) return;

    const idleRotation = state.clock.elapsedTime * 0.12;
    const scrollRotation = scrollRef.current * Math.PI * 1.4;
    const targetY = idleRotation + scrollRotation + pointerRef.current.x * 0.35;
    const targetX = pointerRef.current.y * 0.18 - scrollRef.current * 0.25;

    group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(delta * 3, 1);
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(delta * 3, 1);

    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08 - scrollRef.current * 0.6;

    if (rodGroup.current) {
      const extend = 0.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.12 + scrollRef.current * 0.5;
      rodGroup.current.position.y = extend;
    }

    if (ringMat.current) {
      ringMat.current.emissiveIntensity = 1.6 + Math.sin(state.clock.elapsedTime * 1.5) * 0.6;
    }
  });

  return (
    <group ref={group} rotation={[0.1, 0.6, 0]}>
      {/* Base mounting flange */}
      <mesh position={[0, -2.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.35, 0.3, 32]} />
        <meshStandardMaterial color={METAL_DARK} metalness={0.9} roughness={0.4} />
      </mesh>
      <HexBolts radius={1.1} count={8} y={-2.4} />

      {/* Main barrel */}
      <mesh position={[0, -0.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 3.2, 64]} />
        <meshStandardMaterial color={METAL_BARREL} metalness={0.92} roughness={0.28} />
      </mesh>

      {/* Barrel ridge rings */}
      {[-2.0, -1.3, -0.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.01, 0.03, 8, 48]} />
          <meshStandardMaterial color={METAL_DARK} metalness={0.85} roughness={0.4} />
        </mesh>
      ))}

      {/* Hydraulic ports */}
      {[-1.7, -0.4].map((y, i) => (
        <group key={i} position={[1, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.5, 16]} />
            <meshStandardMaterial color={METAL_DARK} metalness={0.9} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial
              color={CYAN}
              emissive={CYAN}
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* Gland / cap */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 1, 0.55, 64]} />
        <meshStandardMaterial color={METAL_BARREL} metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Cyan accent ring */}
      <mesh position={[0, 1.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.025, 8, 64]} />
        <meshStandardMaterial
          ref={ringMat}
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>

      {/* Rod assembly (extends/retracts subtly) */}
      <group ref={rodGroup} position={[0, 0.4, 0]}>
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 2.2, 48]} />
          <meshStandardMaterial color={CHROME} metalness={1} roughness={0.06} />
        </mesh>
        {/* Rod eye */}
        <group position={[0, 2.15, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.4, 0.14, 16, 48]} />
            <meshStandardMaterial color={METAL_BARREL} metalness={0.9} roughness={0.25} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
