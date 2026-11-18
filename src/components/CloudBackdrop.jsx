import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

/* One soft-clay cloud = a cluster of smooth white spheres */
function Cloud({ position, scale, speed, reducedMotion }) {
  const groupRef = useRef();

  // Stable puff layout (deterministic per cloud via useMemo)
  const puffs = useMemo(
    () => [
      [0, 0, 0, 1],
      [0.85, 0.12, 0.1, 0.72],
      [-0.8, 0.1, -0.08, 0.7],
      [0.35, 0.42, -0.1, 0.58],
      [-0.35, 0.38, 0.12, 0.55],
      [1.5, -0.05, 0, 0.45],
      [-1.45, -0.04, 0.05, 0.44],
    ],
    []
  );

  const baseX = position[0];

  useFrame((state) => {
    if (reducedMotion || !groupRef.current) return;
    const t = state.clock.elapsedTime * speed;
    // Slow horizontal drift + gentle bob — clouds never sit still
    groupRef.current.position.x = baseX + Math.sin(t) * 1.6;
    groupRef.current.position.y = position[1] + Math.sin(t * 1.4) * 0.35;
    groupRef.current.rotation.z = Math.sin(t * 0.6) * 0.04;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 24, 24]} />
          {/* Matte clay: white, high roughness, no plastic shine */}
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.95}
            metalness={0}
            emissive="#EAF6FD"
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

function Clouds({ reducedMotion }) {
  const clouds = useMemo(
    () => [
      { position: [-7, 2.4, -6], scale: 1.15, speed: 0.16 },
      { position: [6.5, 3.2, -8], scale: 1.5, speed: 0.12 },
      { position: [-2, 4.6, -10], scale: 1.8, speed: 0.09 },
      { position: [8, -2.2, -7], scale: 1.25, speed: 0.14 },
      { position: [-9, -3, -9], scale: 1.6, speed: 0.1 },
      { position: [2, -4.4, -6], scale: 1.0, speed: 0.18 },
    ],
    []
  );

  return (
    <>
      {/* Soft ambient sky light */}
      <ambientLight intensity={1.15} color="#F8FCFF" />
      {/* Gentle top light so the clay puffs read as 3D */}
      <directionalLight position={[4, 8, 6]} intensity={1.1} color="#FFFFFF" />
      {/* Cool fill from below to blend with the sky gradient */}
      <directionalLight position={[-5, -4, 3]} intensity={0.5} color="#B8E4F5" />
      {clouds.map((c, i) => (
        <Cloud key={i} {...c} reducedMotion={reducedMotion} />
      ))}
    </>
  );
}

export default function CloudBackdrop() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Respect reduced motion: render the frame once, then stop the loop
  const frameloop = reducedMotion ? 'demand' : 'always';

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 12], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearAlpha(0);
          // If WebGL context is lost, drop the canvas gracefully
          gl.domElement.addEventListener('webglcontextlost', () =>
            setVisible(false)
          );
        }}
      >
        <Clouds reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
