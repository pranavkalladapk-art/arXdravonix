"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ExplodedCylinderProps {
  progressRef: React.MutableRefObject<number>;
}

const METAL_BARREL = "#9aa0aa";
const METAL_DARK = "#4a4e56";
const CHROME = "#eef3f6";
const CYAN = "#00d5ff";

interface Part {
  base: [number, number, number];
  explode: [number, number, number];
}

function useExplode(base: Part["base"], explode: Part["explode"], progressRef: React.MutableRefObject<number>) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = progressRef.current;
    const target = new THREE.Vector3(
      base[0] + explode[0] * p,
      base[1] + explode[1] * p,
      base[2] + explode[2] * p
    );
    ref.current.position.lerp(target, Math.min(delta * 6, 1));
    ref.current.rotation.y += delta * 0.15;
  });
  return ref;
}

export default function ExplodedCylinder({ progressRef }: ExplodedCylinderProps) {
  const outerGroup = useRef<THREE.Group>(null);

  const base = useExplode([0, -2.55, 0], [0, -2.6, 0], progressRef);
  const barrel = useExplode([0, -0.9, 0], [0, -0.4, 0], progressRef);
  const gland = useExplode([0, 0.75, 0], [0, 1.6, 0], progressRef);
  const ring = useExplode([0, 1.02, 0], [0, 2.5, 0], progressRef);
  const rod = useExplode([0, 1.5, 0], [0, 3.6, 0], progressRef);
  const eye = useExplode([0, 3.25, 0], [0, 5.4, 0], progressRef);
  const portA = useExplode([1, -1.7, 0], [2.4, -1.7, 0], progressRef);
  const portB = useExplode([1, -0.4, 0], [2.6, -0.4, 0], progressRef);

  useFrame((state, delta) => {
    if (!outerGroup.current) return;
    outerGroup.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={outerGroup} rotation={[0.05, 0.5, 0]}>
      <group ref={base}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.35, 1.35, 0.3, 32]} />
          <meshStandardMaterial color={METAL_DARK} metalness={0.9} roughness={0.4} />
        </mesh>
      </group>

      <group ref={barrel}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1, 1, 3.2, 64]} />
          <meshStandardMaterial color={METAL_BARREL} metalness={0.92} roughness={0.28} />
        </mesh>
      </group>

      <group ref={gland}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 1, 0.55, 64]} />
          <meshStandardMaterial color={METAL_BARREL} metalness={0.95} roughness={0.2} />
        </mesh>
      </group>

      <group ref={ring}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.82, 0.03, 8, 64]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>

      <group ref={rod}>
        <mesh castShadow>
          <cylinderGeometry args={[0.34, 0.34, 2.2, 48]} />
          <meshStandardMaterial color={CHROME} metalness={1} roughness={0.06} />
        </mesh>
      </group>

      <group ref={eye}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.4, 0.14, 16, 48]} />
          <meshStandardMaterial color={METAL_BARREL} metalness={0.9} roughness={0.25} />
        </mesh>
      </group>

      <group ref={portA} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.5, 16]} />
          <meshStandardMaterial color={METAL_DARK} metalness={0.9} roughness={0.35} />
        </mesh>
      </group>
      <group ref={portB} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.5, 16]} />
          <meshStandardMaterial color={METAL_DARK} metalness={0.9} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}
