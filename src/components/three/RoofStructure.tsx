"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RoofStructureProps {
  progressRef: React.MutableRefObject<number>;
}

const METAL_DARK = "#33363c";
const METAL_BARREL = "#4b4f57";
const METAL_TRIM = "#2a2d32";
const CYAN = "#00d5ff";
const DEPTH = 3.6;

const RIDGE = new THREE.Vector3(0, 1.5, 0);
const LEFT_EAVE = new THREE.Vector3(-3.2, -1.1, 0);
const RIGHT_EAVE = new THREE.Vector3(3.2, -1.1, 0);

interface Slope {
  low: THREE.Vector3;
  high: THREE.Vector3;
  side: -1 | 1;
}

const LEFT_SLOPE: Slope = { low: LEFT_EAVE, high: RIDGE, side: -1 };
const RIGHT_SLOPE: Slope = { low: RIGHT_EAVE, high: RIDGE, side: 1 };

function pointOnSlope(slope: Slope, t: number) {
  return new THREE.Vector3().lerpVectors(slope.low, slope.high, t);
}

function slopeAngle(slope: Slope) {
  return Math.atan2(slope.high.y - slope.low.y, slope.high.x - slope.low.x);
}

function slopeOutwardNormal(slope: Slope) {
  const dx = slope.high.x - slope.low.x;
  const dy = slope.high.y - slope.low.y;
  const n =
    slope.side === 1
      ? new THREE.Vector2(dy, -dx)
      : new THREE.Vector2(-dy, dx);
  return n.normalize();
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

// Note: for parts rotated purely about Z (baseRot=[0,0,angle]), local Z is
// invariant under that rotation, so any dimension that must span the roof's
// depth (world Z, between the two rafters) is placed in the box's Z slot —
// only the slope-aligned length (X) and thickness (Y) rotate with the pitch.
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

function Rafter({ slope, z, progressRef }: { slope: Slope; z: number; progressRef: React.MutableRefObject<number> }) {
  const angle = slopeAngle(slope);
  const length = slope.low.distanceTo(slope.high);
  const mid = pointOnSlope(slope, 0.5);
  const seedBase = slope.side * 5 + z;
  const ref = usePart(
    {
      base: [mid.x, mid.y, z],
      baseRot: [0, 0, angle],
      scatter: [slope.side * 2.2, 2.4 + seededRandom(seedBase + 1) * 1.2, Math.sign(z || 1) * 1.8],
      scatterRot: [slope.side * 1.4, slope.side * 2.1, 1.6],
    },
    progressRef
  );

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[length, 0.26, 0.16]} />
        <meshStandardMaterial color={METAL_DARK} metalness={0.9} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Purlin({ slope, t, progressRef }: { slope: Slope; t: number; progressRef: React.MutableRefObject<number> }) {
  const p = pointOnSlope(slope, t);
  const seedBase = slope.side * 20 + t * 7.1;
  const r1 = seededRandom(seedBase + 1);
  const r2 = seededRandom(seedBase + 2);
  const r3 = seededRandom(seedBase + 3);
  const r4 = seededRandom(seedBase + 4);
  const r5 = seededRandom(seedBase + 5);
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
        <cylinderGeometry args={[0.07, 0.07, 3.7, 12]} />
        <meshStandardMaterial color={METAL_DARK} metalness={0.9} roughness={0.35} />
      </mesh>
    </group>
  );
}

function RoofPanel({
  slope,
  segmentIndex,
  progressRef,
}: {
  slope: Slope;
  segmentIndex: number;
  progressRef: React.MutableRefObject<number>;
}) {
  const t0 = segmentIndex * 0.25;
  const t1 = t0 + 0.25;
  const start = pointOnSlope(slope, t0);
  const end = pointOnSlope(slope, t1);
  const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
  const segLength = start.distanceTo(end);
  const angle = slopeAngle(slope);
  const normal = slopeOutwardNormal(slope);
  const normalOffset = 0.14;
  const seedBase = slope.side * 33 + segmentIndex * 3.3;
  const s1 = seededRandom(seedBase + 11);
  const s2 = seededRandom(seedBase + 12);
  const s3 = seededRandom(seedBase + 13);
  const s4 = seededRandom(seedBase + 14);
  const s5 = seededRandom(seedBase + 15);

  const ref = usePart(
    {
      base: [mid.x + normal.x * normalOffset, mid.y + normal.y * normalOffset, 0],
      baseRot: [0, 0, angle],
      scatter: [
        (s1 - 0.5) * 3.5,
        3 + s2 * 2,
        (segmentIndex % 2 === 0 ? -1 : 1) * (2.5 + s3 * 1.5),
      ],
      scatterRot: [s4 * 3, s5 * 3, s1 * 2.5],
    },
    progressRef
  );

  const ribCount = 13;
  const ribs = useMemo(
    () => Array.from({ length: ribCount }, (_, i) => -1.68 + i * (3.36 / (ribCount - 1))),
    []
  );

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[segLength - 0.01, 0.05, DEPTH]} />
        <meshStandardMaterial color={METAL_BARREL} metalness={0.6} roughness={0.55} />
      </mesh>
      {ribs.map((rz, i) => (
        <mesh key={i} position={[0, 0.045, rz]} castShadow>
          <boxGeometry args={[segLength - 0.02, 0.028, 0.05]} />
          <meshStandardMaterial color={METAL_DARK} metalness={0.55} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[segLength / 2 - 0.01, 0.03, 0]}>
        <boxGeometry args={[0.015, 0.02, DEPTH]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
    </group>
  );
}

function RidgeCapFlap({ side, progressRef }: { side: -1 | 1; progressRef: React.MutableRefObject<number> }) {
  const slope = side === -1 ? LEFT_SLOPE : RIGHT_SLOPE;
  const angle = slopeAngle(slope);
  const normal = slopeOutwardNormal(slope);
  const flapLength = 0.55;
  const anchor = pointOnSlope(slope, 0.93);

  const ref = usePart(
    {
      base: [anchor.x + normal.x * 0.05, anchor.y + normal.y * 0.05, 0],
      baseRot: [0, 0, angle],
      scatter: [side * 1.5, 3.2, side * 2],
      scatterRot: [side * 1.8, side * 2.6, 1.2],
    },
    progressRef
  );

  return (
    <group ref={ref}>
      <mesh castShadow>
        <boxGeometry args={[flapLength, 0.04, DEPTH + 0.15]} />
        <meshStandardMaterial color={METAL_TRIM} metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

function RidgeSeam({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const ref = usePart(
    {
      base: [RIDGE.x, RIDGE.y + 0.13, 0],
      baseRot: [Math.PI / 2, 0, 0],
      scatter: [0, 3.5, 0],
      scatterRot: [1.8, 2.4, 0],
    },
    progressRef
  );

  return (
    <group ref={ref}>
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.05, DEPTH + 0.2, 16]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

function EaveFascia({ slope, progressRef }: { slope: Slope; progressRef: React.MutableRefObject<number> }) {
  const normal = slopeOutwardNormal(slope);

  const ref = usePart(
    {
      base: [slope.low.x, slope.low.y - 0.18, 0],
      baseRot: [0, 0, 0],
      scatter: [normal.x * 2.2, -1.6 + normal.y * 1.4, slope.side * 2.4],
      scatterRot: [slope.side * 1.6, slope.side * 2.2, 1.4],
    },
    progressRef
  );

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.08, DEPTH + 0.1]} />
        <meshStandardMaterial color={METAL_TRIM} metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0.13, 0.042, 0]}>
        <boxGeometry args={[0.025, 0.02, DEPTH + 0.1]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

function RoofSide({ slope, progressRef }: { slope: Slope; progressRef: React.MutableRefObject<number> }) {
  return (
    <>
      <Rafter slope={slope} z={-1.8} progressRef={progressRef} />
      <Rafter slope={slope} z={1.8} progressRef={progressRef} />
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <Purlin key={t} slope={slope} t={t} progressRef={progressRef} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <RoofPanel key={i} slope={slope} segmentIndex={i} progressRef={progressRef} />
      ))}
      <RidgeCapFlap side={slope.side} progressRef={progressRef} />
      <EaveFascia slope={slope} progressRef={progressRef} />
    </>
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
    <group ref={outer} rotation={[0.05, -0.35, 0]}>
      <RoofSide slope={LEFT_SLOPE} progressRef={progressRef} />
      <RoofSide slope={RIGHT_SLOPE} progressRef={progressRef} />
      <RidgeSeam progressRef={progressRef} />
    </group>
  );
}
