"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RoofStructureProps {
  progressRef: React.MutableRefObject<number>;
}

const METAL_DARK = "#4a4e56";
const METAL_BARREL = "#9aa0aa";
const CYAN = "#00d5ff";

const LOW = new THREE.Vector3(-3, -1.2, 0);
const HIGH = new THREE.Vector3(3, 1.2, 0);
const SLOPE_ANGLE = Math.atan2(HIGH.y - LOW.y, HIGH.x - LOW.x);
const SLOPE_LENGTH = LOW.distanceTo(HIGH);

function pointOnSlope(t: number) {
  return new THREE.Vector3().lerpVectors(LOW, HIGH, t);
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

interface PartConfig {
  base: [number, number, number];
  baseRot: [number, number, number];
  scatter: [number, number, number];
  scatterRot: [number, number, number];
}

function usePart({ base, baseRot, scatter, scatterRot }: PartConfig, progressRef: React.MutableRefObject<number>) {
  const ref = useRef<THREE.Group>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  const targetRot = useMemo(() => new THREE.Euler(), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = progressRef.current;
    const inv = 1 - p;
    target.set(base[0] + scatter[0] * inv, base[1] + scatter[1] * inv, base[2] + scatter[2] * inv);
    targetRot.set(
      baseRot[0] + scatterRot[0] * inv,
      baseRot[1] + scatterRot[1] * inv,
      baseRot[2] + scatterRot[2] * inv
    );
    ref.current.position.lerp(target, Math.min(delta * 5, 1));
    ref.current.rotation.x += (targetRot.x - ref.current.rotation.x) * Math.min(delta * 5, 1);
    ref.current.rotation.y += (targetRot.y - ref.current.rotation.y) * Math.min(delta * 5, 1);
    ref.current.rotation.z += (targetRot.z - ref.current.rotation.z) * Math.min(delta * 5, 1);
  });

  return ref;
}

function Rafter({ z, progressRef }: { z: number; progressRef: React.MutableRefObject<number> }) {
  const mid = pointOnSlope(0.5);
  const seed = z > 0 ? 1 : -1;
  const ref = usePart(
    {
      base: [mid.x, mid.y, z],
      baseRot: [0, 0, SLOPE_ANGLE],
      scatter: [seed * 2.2, 2.4 + seededRandom(z + 1) * 1.2, seed * 1.8],
      scatterRot: [seed * 1.4, seed * 2.1, 1.6],
    },
    progressRef
  );

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[SLOPE_LENGTH, 0.28, 0.18]} />
        <meshStandardMaterial color={METAL_DARK} metalness={0.9} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Purlin({ t, progressRef }: { t: number; progressRef: React.MutableRefObject<number> }) {
  const p = pointOnSlope(t);
  const r1 = seededRandom(t * 7.1 + 1);
  const r2 = seededRandom(t * 7.1 + 2);
  const r3 = seededRandom(t * 7.1 + 3);
  const r4 = seededRandom(t * 7.1 + 4);
  const r5 = seededRandom(t * 7.1 + 5);
  const ref = usePart(
    {
      base: [p.x, p.y, 0],
      baseRot: [Math.PI / 2, 0, 0],
      scatter: [(r1 - 0.5) * 3, 1.8 + r2 * 1.5, (r3 - 0.5) * 4],
      scatterRot: [r4 * 2, r5 * 3, r1 * 2],
    },
    progressRef
  );

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 3.7, 12]} />
        <meshStandardMaterial color={METAL_DARK} metalness={0.9} roughness={0.35} />
      </mesh>
    </group>
  );
}

function RoofPanel({ segmentIndex, progressRef }: { segmentIndex: number; progressRef: React.MutableRefObject<number> }) {
  const t0 = segmentIndex * 0.25;
  const t1 = t0 + 0.25;
  const start = pointOnSlope(t0);
  const end = pointOnSlope(t1);
  const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
  const segLength = start.distanceTo(end);
  const normalOffset = 0.16;
  const s1 = seededRandom(segmentIndex * 3.3 + 11);
  const s2 = seededRandom(segmentIndex * 3.3 + 12);
  const s3 = seededRandom(segmentIndex * 3.3 + 13);
  const s4 = seededRandom(segmentIndex * 3.3 + 14);
  const s5 = seededRandom(segmentIndex * 3.3 + 15);

  const ref = usePart(
    {
      base: [
        mid.x - Math.sin(SLOPE_ANGLE) * normalOffset,
        mid.y + Math.cos(SLOPE_ANGLE) * normalOffset,
        0,
      ],
      baseRot: [0, 0, SLOPE_ANGLE],
      scatter: [
        (s1 - 0.5) * 3.5,
        3 + s2 * 2,
        (segmentIndex % 2 === 0 ? -1 : 1) * (2.5 + s3 * 1.5),
      ],
      scatterRot: [s4 * 3, s5 * 3, s1 * 2.5],
    },
    progressRef
  );

  const ribs = useMemo(() => [-1.1, 0, 1.1], []);

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[segLength - 0.04, 3.6, 0.05]} />
        <meshStandardMaterial color={METAL_BARREL} metalness={0.85} roughness={0.3} />
      </mesh>
      {ribs.map((rz, i) => (
        <mesh key={i} position={[0, rz, 0.035]} castShadow>
          <boxGeometry args={[segLength - 0.06, 0.06, 0.03]} />
          <meshStandardMaterial color={METAL_DARK} metalness={0.8} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[segLength / 2 - 0.02, 0, 0.04]}>
        <boxGeometry args={[0.02, 3.6, 0.03]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function RoofStructure({ progressRef }: RoofStructureProps) {
  const outer = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!outer.current) return;
    outer.current.rotation.y += delta * 0.06;
    outer.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
  });

  return (
    <group ref={outer} rotation={[0.12, -0.5, 0]}>
      <Rafter z={-1.8} progressRef={progressRef} />
      <Rafter z={1.8} progressRef={progressRef} />
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <Purlin key={t} t={t} progressRef={progressRef} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <RoofPanel key={i} segmentIndex={i} progressRef={progressRef} />
      ))}
    </group>
  );
}
