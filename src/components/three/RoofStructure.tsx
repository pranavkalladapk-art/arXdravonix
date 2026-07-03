"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RoofStructureProps {
  progressRef: React.MutableRefObject<number>;
}

// Stage 1 (0.00–0.33): bare steel skeleton — columns, rafters, purlins, ridge beam.
// Stage 2 (0.33–0.66): corrugated panels install sheet by sheet over the frame.
// Stage 3 (0.66–1.00): ridge cap, fascia, gutters, downpipes, and cyan seal glow finish the roof.

const STEEL = "#3a3d43";
const STEEL_DARK = "#25272b";
const PANEL = "#1c1e21";
const PANEL_RIB = "#141516";
const TRIM = "#202226";
const CYAN = "#00d5ff";

const DEPTH = 3.6;
const GROUND_Y = -2.15;

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
const SLOPES = [LEFT_SLOPE, RIGHT_SLOPE];
const COLUMN_Z = [-1.8, -0.9, 0, 0.9, 1.8];

function pointOnSlope(slope: Slope, t: number) {
  return new THREE.Vector3().lerpVectors(slope.low, slope.high, t);
}

function slopeAngle(slope: Slope) {
  return Math.atan2(slope.high.y - slope.low.y, slope.high.x - slope.low.x);
}

function slopeOutwardNormal(slope: Slope) {
  const dx = slope.high.x - slope.low.x;
  const dy = slope.high.y - slope.low.y;
  const n = slope.side === 1 ? new THREE.Vector2(dy, -dx) : new THREE.Vector2(-dy, dx);
  return n.normalize();
}

function stageLocal(progress: number, start: number, end: number) {
  return THREE.MathUtils.clamp((progress - start) / (end - start), 0, 1);
}

function staggered(local: number, index: number, count: number, window = 0.2) {
  const start = (index / count) * (1 - window);
  return THREE.MathUtils.clamp((local - start) / window, 0, 1);
}

// Fades + scales a group in/out based on a per-frame reveal target (0–1), driven
// by the shared scroll progress. Deterministic and monotonic — no scatter, no
// randomness, just a clean grow/fade toward the part's fixed installed position.
function RevealGroup({
  position,
  rotation,
  getReveal,
  children,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  getReveal: () => number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = Math.max(getReveal(), 0.0001);
    const next = THREE.MathUtils.lerp(ref.current.scale.x, target, Math.min(delta * 5, 1));
    ref.current.scale.setScalar(next);
    ref.current.visible = next > 0.01;
    ref.current.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.transparent = true;
        mat.opacity = next;
      }
    });
  });

  return (
    <group ref={ref} position={position} rotation={rotation ?? [0, 0, 0]}>
      {children}
    </group>
  );
}

function Column({
  slope,
  z,
  progressRef,
}: {
  slope: Slope;
  z: number;
  progressRef: React.MutableRefObject<number>;
}) {
  const height = slope.low.y - GROUND_Y;
  const midY = (slope.low.y + GROUND_Y) / 2;

  return (
    <RevealGroup
      position={[slope.low.x, midY, z]}
      getReveal={() => stageLocal(progressRef.current, 0, 0.1)}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.16, height, 0.16]} />
        <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.4} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.02, 0]} castShadow>
        <boxGeometry args={[0.34, 0.04, 0.34]} />
        <meshStandardMaterial color={STEEL_DARK} metalness={0.8} roughness={0.4} />
      </mesh>
    </RevealGroup>
  );
}

function Rafter({
  slope,
  z,
  progressRef,
}: {
  slope: Slope;
  z: number;
  progressRef: React.MutableRefObject<number>;
}) {
  const angle = slopeAngle(slope);
  const length = slope.low.distanceTo(slope.high);
  const mid = pointOnSlope(slope, 0.5);

  return (
    <RevealGroup
      position={[mid.x, mid.y, z]}
      rotation={[0, 0, angle]}
      getReveal={() => stageLocal(progressRef.current, 0, 0.12)}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[length, 0.26, 0.16]} />
        <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.35} />
      </mesh>
    </RevealGroup>
  );
}

function Purlin({
  slope,
  t,
  progressRef,
}: {
  slope: Slope;
  t: number;
  progressRef: React.MutableRefObject<number>;
}) {
  const p = pointOnSlope(slope, t);

  return (
    <RevealGroup
      position={[p.x, p.y, 0]}
      rotation={[Math.PI / 2, 0, 0]}
      getReveal={() => stageLocal(progressRef.current, 0.04, 0.18)}
    >
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.07, DEPTH + 0.1, 12]} />
        <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.35} />
      </mesh>
    </RevealGroup>
  );
}

function RidgeBeam({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <RevealGroup
      position={[RIDGE.x, RIDGE.y - 0.1, 0]}
      getReveal={() => stageLocal(progressRef.current, 0, 0.12)}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.22, DEPTH + 0.15]} />
        <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.35} />
      </mesh>
    </RevealGroup>
  );
}

function RoofPanel({
  slope,
  segmentIndex,
  orderIndex,
  progressRef,
}: {
  slope: Slope;
  segmentIndex: number;
  orderIndex: number;
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
  const base: [number, number, number] = [
    mid.x + normal.x * normalOffset,
    mid.y + normal.y * normalOffset,
    0,
  ];
  const rot: [number, number, number] = [0, 0, angle];

  const ribCount = 11;
  const ribs = Array.from({ length: ribCount }, (_, i) => -1.6 + i * (3.2 / (ribCount - 1)));
  const fastenerZ = [-1.1, 0, 1.1];

  return (
    <>
      <RevealGroup
        position={base}
        rotation={rot}
        getReveal={() => staggered(stageLocal(progressRef.current, 0.33, 0.66), orderIndex, 8)}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[segLength - 0.01, 0.05, DEPTH]} />
          <meshStandardMaterial color={PANEL} metalness={0.55} roughness={0.55} />
        </mesh>
        {ribs.map((rz, i) => (
          <mesh key={i} position={[0, 0.045, rz]} castShadow>
            <boxGeometry args={[segLength - 0.02, 0.028, 0.045]} />
            <meshStandardMaterial color={PANEL_RIB} metalness={0.5} roughness={0.6} />
          </mesh>
        ))}
        {fastenerZ.map((fz, i) => (
          <mesh key={i} position={[segLength / 2 - 0.12, 0.06, fz]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.03, 8]} />
            <meshStandardMaterial color={STEEL_DARK} metalness={0.7} roughness={0.4} />
          </mesh>
        ))}
      </RevealGroup>

      <RevealGroup
        position={base}
        rotation={rot}
        getReveal={() => stageLocal(progressRef.current, 0.68, 0.85)}
      >
        <mesh position={[segLength / 2 - 0.01, 0.06, 0]}>
          <boxGeometry args={[0.015, 0.02, DEPTH]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
      </RevealGroup>
    </>
  );
}

function RidgeCap({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const getReveal = () => stageLocal(progressRef.current, 0.66, 0.82);

  return (
    <>
      {SLOPES.map((slope) => {
        const angle = slopeAngle(slope);
        const normal = slopeOutwardNormal(slope);
        const flapLength = 0.55;
        const anchor = pointOnSlope(slope, 0.93);
        return (
          <RevealGroup
            key={slope.side}
            position={[anchor.x + normal.x * 0.05, anchor.y + normal.y * 0.05, 0]}
            rotation={[0, 0, angle]}
            getReveal={getReveal}
          >
            <mesh castShadow>
              <boxGeometry args={[flapLength, 0.04, DEPTH + 0.2]} />
              <meshStandardMaterial color={TRIM} metalness={0.7} roughness={0.4} />
            </mesh>
          </RevealGroup>
        );
      })}
      <RevealGroup position={[RIDGE.x, RIDGE.y + 0.13, 0]} rotation={[Math.PI / 2, 0, 0]} getReveal={getReveal}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, DEPTH + 0.25, 16]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      </RevealGroup>
    </>
  );
}

function EaveFinish({ slope, progressRef }: { slope: Slope; progressRef: React.MutableRefObject<number> }) {
  const normal = slopeOutwardNormal(slope);
  const gutterY = slope.low.y - 0.3;
  const getReveal = () => stageLocal(progressRef.current, 0.7, 0.88);

  return (
    <>
      {/* fascia trim + glowing seal edge */}
      <RevealGroup position={[slope.low.x, slope.low.y - 0.18, 0]} getReveal={getReveal}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.3, 0.08, DEPTH + 0.1]} />
          <meshStandardMaterial color={TRIM} metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0.13, 0.042, 0]}>
          <boxGeometry args={[0.025, 0.02, DEPTH + 0.1]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      </RevealGroup>

      {/* gutter trough */}
      <RevealGroup
        position={[slope.low.x + normal.x * 0.05, gutterY, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        getReveal={getReveal}
      >
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.09, 0.09, DEPTH + 0.15, 12, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={TRIM} metalness={0.6} roughness={0.45} side={THREE.DoubleSide} />
        </mesh>
      </RevealGroup>

      {/* downpipe */}
      <RevealGroup
        position={[slope.low.x + normal.x * 0.16, (gutterY + GROUND_Y) / 2, 1.7]}
        getReveal={getReveal}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.045, gutterY - GROUND_Y, 10]} />
          <meshStandardMaterial color={TRIM} metalness={0.6} roughness={0.4} />
        </mesh>
      </RevealGroup>
    </>
  );
}

function RoofSide({ slope, progressRef }: { slope: Slope; progressRef: React.MutableRefObject<number> }) {
  return (
    <>
      {COLUMN_Z.map((z) => (
        <Column key={z} slope={slope} z={z} progressRef={progressRef} />
      ))}
      <Rafter slope={slope} z={-1.8} progressRef={progressRef} />
      <Rafter slope={slope} z={1.8} progressRef={progressRef} />
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <Purlin key={t} slope={slope} t={t} progressRef={progressRef} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <RoofPanel
          key={i}
          slope={slope}
          segmentIndex={i}
          orderIndex={i * 2 + (slope.side === -1 ? 0 : 1)}
          progressRef={progressRef}
        />
      ))}
      <EaveFinish slope={slope} progressRef={progressRef} />
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
      <RidgeBeam progressRef={progressRef} />
      <RoofSide slope={LEFT_SLOPE} progressRef={progressRef} />
      <RoofSide slope={RIGHT_SLOPE} progressRef={progressRef} />
      <RidgeCap progressRef={progressRef} />
    </group>
  );
}
