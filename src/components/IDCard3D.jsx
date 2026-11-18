import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCcw, Hand } from 'lucide-react';
import userProfileImg from '../assets/images/IMG_20250208_204606.jpg';

/* ─── Check WebGL Support ─── */
function checkWebGLSupport() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

/* ─── Hanging Navy Lanyard Strap ─── */
function DynamicLanyardRibbon({ cardGroupRef, portalTarget }) {
  const lanyardRef = useRef(null);
  const caseBackRef = useRef(null);
  const caseSidesRef = useRef(null);
  const caseFrontRef = useRef(null);
  const caseSlotsRef = useRef(null);
  const claspRingRef = useRef(null);
  const claspHookRef = useRef(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    const target = portalTarget.current;
    if (!target) return undefined;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.overflow = 'visible';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '1';
    const makePath = (fill, stroke, strokeWidth) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill', fill);
      path.setAttribute('stroke', stroke);
      path.setAttribute('stroke-width', strokeWidth);
      path.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(path);
      return path;
    };
    caseBackRef.current = makePath(
      'rgba(160, 168, 176, 0.12)',
      'rgba(110, 120, 130, 0.72)',
      '3'
    );
    caseSidesRef.current = makePath(
      'rgba(160, 168, 176, 0.32)',
      'rgba(105, 115, 125, 0.85)',
      '3'
    );
    caseFrontRef.current = makePath(
      'rgba(190, 196, 202, 0.18)',
      'rgba(120, 130, 140, 0.9)',
      '3'
    );
    caseSlotsRef.current = makePath(
      'rgba(110, 120, 130, 0.75)',
      'rgba(85, 95, 105, 0.9)',
      '1.5'
    );
    const lanyard = makePath('none', 'var(--theme-primary)', '14');
    lanyard.setAttribute('stroke-linecap', 'round');
    const claspRing = makePath('none', '#b8bec5', '7');
    claspRing.setAttribute('stroke-linecap', 'round');
    const claspHook = makePath('none', '#aeb4bb', '6');
    claspHook.setAttribute('stroke-linecap', 'round');
    target.appendChild(svg);
    lanyardRef.current = lanyard;
    claspRingRef.current = claspRing;
    claspHookRef.current = claspHook;

    return () => {
      target.removeChild(svg);
      lanyardRef.current = null;
      claspRingRef.current = null;
      claspHookRef.current = null;
      caseBackRef.current = null;
      caseSidesRef.current = null;
      caseFrontRef.current = null;
      caseSlotsRef.current = null;
    };
  }, [portalTarget]);

  useFrame(() => {
    const path = lanyardRef.current;
    const target = portalTarget.current;
    const cardGroup = cardGroupRef.current;
    if (
      !path ||
      !caseBackRef.current ||
      !caseSidesRef.current ||
      !caseFrontRef.current ||
      !caseSlotsRef.current ||
      !claspRingRef.current ||
      !claspHookRef.current ||
      !target ||
      !cardGroup
    ) {
      return;
    }

    const canvasRect = gl.domElement.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    if (!canvasRect.width || !canvasRect.height) return;

    cardGroup.updateMatrixWorld(true);
    const topAnchor = new THREE.Vector3(0, 3.5, 0);
    const bottomAttach = cardGroup.localToWorld(new THREE.Vector3(0, 2.67, 0));
    const midPoint = new THREE.Vector3(
      (topAnchor.x + bottomAttach.x) / 2,
      (topAnchor.y + bottomAttach.y) / 2 - 0.12,
      (topAnchor.z + bottomAttach.z) / 2
    );
    const toTarget = (point) => {
      const projected = point.clone().project(camera);
      return {
        x: ((projected.x + 1) / 2) * canvasRect.width + canvasRect.left - targetRect.left,
        y: ((1 - projected.y) / 2) * canvasRect.height + canvasRect.top - targetRect.top,
      };
    };
    const caseCorners = (z) =>
      [
        [-1.75, 2.5, z],
        [1.75, 2.5, z],
        [1.75, -2.5, z],
        [-1.75, -2.5, z],
      ].map(([x, y, depth]) =>
        toTarget(cardGroup.localToWorld(new THREE.Vector3(x, y, depth)))
      );
    const frontCorners = caseCorners(0.045);
    const backCorners = caseCorners(-0.075);
    const polygonPath = (corners) =>
      `M ${corners.map((corner) => `${corner.x} ${corner.y}`).join(' L ')} Z`;
    const sidesPath = frontCorners
      .map((corner, index) => {
        const next = (index + 1) % frontCorners.length;
        return `M ${corner.x} ${corner.y} L ${backCorners[index].x} ${backCorners[index].y} L ${backCorners[next].x} ${backCorners[next].y} L ${frontCorners[next].x} ${frontCorners[next].y} Z`;
      })
      .join(' ');

    caseBackRef.current.setAttribute('d', polygonPath(backCorners));
    caseSidesRef.current.setAttribute('d', sidesPath);
    caseFrontRef.current.setAttribute('d', polygonPath(frontCorners));
    const slotPath = (centerX, width) => {
      const slotCorners = [
        [centerX - width / 2, 2.3, 0.075],
        [centerX + width / 2, 2.3, 0.075],
        [centerX + width / 2, 2.44, 0.075],
        [centerX - width / 2, 2.44, 0.075],
      ].map(([x, y, z]) =>
        toTarget(cardGroup.localToWorld(new THREE.Vector3(x, y, z)))
      );
      return polygonPath(slotCorners);
    };
    caseSlotsRef.current.setAttribute(
      'd',
      `${slotPath(0, 0.85)} ${slotPath(-1.1, 0.48)} ${slotPath(1.1, 0.48)}`
    );
    const ringPoints = Array.from({ length: 49 }, (_, index) => {
      const angle = (index / 48) * Math.PI * 2;
      const ringPoint = cardGroup.localToWorld(
        new THREE.Vector3(
          Math.cos(angle) * 0.2,
          2.67 + Math.sin(angle) * 0.2,
          0
        )
      );
      return toTarget(ringPoint);
    });
    claspRingRef.current.setAttribute(
      'd',
      `M ${ringPoints.map((point) => `${point.x} ${point.y}`).join(' L ')} Z`
    );
    const hookPoints = Array.from({ length: 25 }, (_, index) => {
      const angle = (index / 24) * Math.PI * 1.5;
      const hookPoint = cardGroup.localToWorld(
        new THREE.Vector3(
          Math.cos(angle) * 0.15,
          2.29 + Math.sin(angle) * 0.15,
          0
        )
      );
      return toTarget(hookPoint);
    });
    claspHookRef.current.setAttribute(
      'd',
      `M ${hookPoints.map((point) => `${point.x} ${point.y}`).join(' L ')}`
    );

    const start = toTarget(topAnchor);
    const middle = toTarget(midPoint);
    const end = toTarget(bottomAttach);

    path.setAttribute(
      'd',
      `M ${start.x} ${start.y} Q ${middle.x} ${middle.y} ${end.x} ${end.y}`
    );
    const viewHeight =
      2 * Math.abs(camera.position.z) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    path.setAttribute(
      'stroke-width',
      String(Math.max(8, (0.18 * canvasRect.height) / viewHeight))
    );
    claspRingRef.current.setAttribute(
      'stroke-width',
      String(Math.max(3, (0.09 * canvasRect.height) / viewHeight))
    );
    claspHookRef.current.setAttribute(
      'stroke-width',
      String(Math.max(3, (0.076 * canvasRect.height) / viewHeight))
    );
  });

  return null;
}

/* ─── 3D Badge with Playable Spring Physics ─── */
function PlayablePhysicsBadge({
  isFlipped,
  setIsFlipped,
  onDragStateChange,
  portalTarget,
  profileImage,
  displayName,
  role,
  idCard,
}) {
  const cardGroupRef = useRef();
  const { camera, raycaster, gl } = useThree();
  const [hovered, setHovered] = useState(false);

  // Subtle parallax tilt that follows the pointer while idle
  const mouseTilt = useRef({ x: 0, y: 0 });

  // Resting equilibrium position
  const restPos = new THREE.Vector3(0, -0.05, 0);
  const pos = useRef(new THREE.Vector3(0, -0.05, 0));
  const vel = useRef(new THREE.Vector3(0, 0, 0));
  const rot = useRef(new THREE.Euler(0, 0, 0));
  const rotVel = useRef(new THREE.Vector3(0, 0, 0));

  const isDragging = useRef(false);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const planeIntersect = useRef(new THREE.Vector3());
  const dragOffset = useRef(new THREE.Vector3());
  const lastDragPosition = useRef(new THREE.Vector2());
  const lastDragTime = useRef(0);
  const pointerStart = useRef({ x: 0, y: 0 });

  // Spring & damping constants
  const springK = 40;
  const damping = 4.4;
  const angularSpringK = 45;
  const angularDamping = 5.2;

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera({ x, y }, camera);
      if (raycaster.ray.intersectPlane(dragPlane.current, planeIntersect.current)) {
        const targetX = planeIntersect.current.x + dragOffset.current.x;
        const targetY = planeIntersect.current.y + dragOffset.current.y;

        const elapsed = THREE.MathUtils.clamp(
          (e.timeStamp - lastDragTime.current) / 1000,
          1 / 120,
          0.05
        );
        vel.current.x = THREE.MathUtils.clamp(
          ((targetX - lastDragPosition.current.x) / elapsed) * 0.25,
          -8,
          8
        );
        vel.current.y = THREE.MathUtils.clamp(
          ((targetY - lastDragPosition.current.y) / elapsed) * 0.25,
          -8,
          8
        );
        lastDragPosition.current.set(targetX, targetY);
        lastDragTime.current = e.timeStamp;
        pos.current.x = targetX;
        pos.current.y = targetY;
      }
    };

    const handlePointerUp = (e) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (onDragStateChange) onDragStateChange(false);

      const movedDist = Math.hypot(
        e.clientX - pointerStart.current.x,
        e.clientY - pointerStart.current.y
      );
      if (movedDist < 8) {
        setIsFlipped((prev) => !prev);
      } else {
        setIsFlipped(true);
      }
    };

    const handlePointerCancel = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      vel.current.set(0, 0, 0);
      if (onDragStateChange) onDragStateChange(false);
    };

    // Pointer parallax: tilt the badge toward the cursor while it is idle
    const handleHoverMove = (e) => {
      if (isDragging.current) return;
      const rect = gl.domElement.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      const inside = nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1;
      mouseTilt.current.x = inside ? nx : 0;
      mouseTilt.current.y = inside ? ny : 0;
    };

    const resetTilt = (e) => {
      if (e && e.relatedTarget) return;
      mouseTilt.current.x = 0;
      mouseTilt.current.y = 0;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointermove', handleHoverMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);
    window.addEventListener('pointerout', resetTilt);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointermove', handleHoverMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      window.removeEventListener('pointerout', resetTilt);
    };
  }, [camera, raycaster, gl, setIsFlipped, onDragStateChange]);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    isDragging.current = true;
    if (onDragStateChange) onDragStateChange(true);
    pointerStart.current = { x: e.clientX, y: e.clientY };

    const rect = gl.domElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera({ x, y }, camera);
    if (raycaster.ray.intersectPlane(dragPlane.current, planeIntersect.current)) {
      dragOffset.current.set(
        pos.current.x - planeIntersect.current.x,
        pos.current.y - planeIntersect.current.y,
        0
      );
    } else {
      dragOffset.current.set(0, 0, 0);
    }

    vel.current.set(0, 0, 0);
    lastDragPosition.current.set(pos.current.x, pos.current.y);
    lastDragTime.current = e.timeStamp;
  };

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (!isDragging.current) {
      // Spring forces returning to equilibrium restPos
      const dx = pos.current.x - restPos.x;
      const dy = pos.current.y - restPos.y;

      const ax = -springK * dx - damping * vel.current.x;
      const ay = -springK * dy - damping * vel.current.y;

      vel.current.x += ax * dt;
      vel.current.y += ay * dt;

      pos.current.x += vel.current.x * dt;
      pos.current.y += vel.current.y * dt;
    }

    // Pendulum tilting based on displacement, velocity and pointer parallax
    // Keep the badge readable as it swings: a small clay-like pendulum tilt
    // gives it life without rotating the ID away from the viewer.
    const targetTiltZ = THREE.MathUtils.clamp(
      -(pos.current.x - restPos.x) * 0.055 - vel.current.x * 0.008 - mouseTilt.current.x * 0.06,
      -0.22,
      0.22
    );
    const targetPitchX = THREE.MathUtils.clamp(
      -vel.current.y * 0.006 + mouseTilt.current.y * 0.045,
      -0.12,
      0.12
    );

    // Flip rotation on Y axis (0 = Front, Math.PI = Back)
    const targetRotY = isFlipped ? Math.PI : 0;

    // Angular spring damper
    const az = -angularSpringK * (rot.current.z - targetTiltZ) - angularDamping * rotVel.current.z;
    const ax = -angularSpringK * (rot.current.x - targetPitchX) - angularDamping * rotVel.current.x;

    rotVel.current.z += az * dt;
    rotVel.current.x += ax * dt;

    rot.current.z += rotVel.current.z * dt;
    rot.current.x += rotVel.current.x * dt;

    // Smooth lerp on Y flip
    rot.current.y = THREE.MathUtils.damp(rot.current.y, targetRotY, 9, dt);

    if (cardGroupRef.current) {
      cardGroupRef.current.position.set(pos.current.x, pos.current.y, 0);
      cardGroupRef.current.rotation.set(rot.current.x, rot.current.y, rot.current.z);
    }
  });

  return (
    <>
      {/* Hanging Navy Ribbon */}
      <DynamicLanyardRibbon
        cardGroupRef={cardGroupRef}
        portalTarget={portalTarget}
      />

      {/* Main Physics Card Group */}
      <group
        ref={cardGroupRef}
        onPointerDown={handlePointerDown}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Soft sky hover-glow light */}
        <pointLight
          position={[0, 0, 3.5]}
          intensity={hovered ? 2.4 : 0.5}
          color="#87CEEB"
          distance={9}
        />

        {/* ─── 1. SILVER CHROME METALLIC CLASP HOOK ─── */}
        <group position={[0, 2.52, 0]}>
          {/* Swivel Loop Ring */}
          <mesh position={[0, 0.15, 0]}>
            <torusGeometry args={[0.2, 0.045, 16, 32]} />
            <meshStandardMaterial color="#e0e4eb" metalness={0.95} roughness={0.12} />
          </mesh>
          {/* Lobster Body */}
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 0.26, 16]} />
            <meshStandardMaterial color="#c8ccd4" metalness={0.92} roughness={0.16} />
          </mesh>
          {/* Spring Gate Lever */}
          <mesh position={[0.06, -0.01, 0]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.04, 0.18, 0.04]} />
            <meshStandardMaterial color="#9aa0a6" metalness={0.88} roughness={0.2} />
          </mesh>
          {/* Hook Claw that loops through acrylic punch-slot */}
          <mesh position={[0, -0.23, 0]}>
            <torusGeometry args={[0.15, 0.038, 16, 24, Math.PI * 1.5]} />
            <meshStandardMaterial color="#e8ecf2" metalness={0.96} roughness={0.1} />
          </mesh>
        </group>

        {/* ─── 2. FRONT FACE: EXACT REPLICA OF DROPPED IMAGE ─── */}
        <group position={[0, -0.15, 0.052]}>
          <Html
            transform
            distanceFactor={4.025}
            portal={portalTarget}
            wrapperClass="id-card-portal"
            style={{
              width: '315px',
              height: '445px',
              userSelect: 'none',
              pointerEvents: isFlipped ? 'none' : 'auto',
              opacity: isFlipped ? 0 : 1,
              transition: 'opacity 0.2s ease',
            }}
          >
            <div
              onPointerDown={handlePointerDown}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '14px',
                backgroundColor: 'var(--theme-surface)',
                outline: '4px solid rgba(var(--theme-accent-rgb), 0.45)',
                outlineOffset: '8px',
                boxShadow:
                  '0 8px 30px rgba(0, 0, 0, 0.25), 0 0 0 13px rgba(var(--theme-soft-rgb), 0.35)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                color: 'var(--theme-primary)',
                fontFamily: "'Inter', sans-serif",
                cursor: 'grab',
                pointerEvents: 'auto',
              }}
            >
              {/* ─── Multi-layered Geometric Blue Chevrons (Left Side) ─── */}
              {/* Layer 1: Dark Navy Top */}
              <div
                style={{
                  position: 'absolute',
                  top: '50px',
                  left: 0,
                  width: '42px',
                  height: '120px',
                  backgroundColor: 'var(--theme-primary)',
                  clipPath: 'polygon(0 0, 100% 30%, 100% 70%, 0 100%)',
                  zIndex: 2,
                }}
              />
              {/* Layer 2: Cobalt Blue Mid */}
              <div
                style={{
                  position: 'absolute',
                  top: '110px',
                  left: 0,
                  width: '40px',
                  height: '130px',
                  backgroundColor: 'var(--theme-primary)',
                  clipPath: 'polygon(0 0, 100% 30%, 100% 70%, 0 100%)',
                  zIndex: 1,
                }}
              />
              {/* Layer 3: Cyan Accent Lower */}
              <div
                style={{
                  position: 'absolute',
                  top: '180px',
                  left: 0,
                  width: '38px',
                  height: '110px',
                  backgroundColor: 'var(--theme-accent)',
                  clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)',
                  zIndex: 0,
                }}
              />

              {/* ─── Multi-layered Geometric Blue Chevrons (Right Side) ─── */}
              {/* Layer 1: Dark Navy Top */}
              <div
                style={{
                  position: 'absolute',
                  top: '50px',
                  right: 0,
                  width: '42px',
                  height: '120px',
                  backgroundColor: 'var(--theme-primary)',
                  clipPath: 'polygon(100% 0, 0 30%, 0 70%, 100% 100%)',
                  zIndex: 2,
                }}
              />
              {/* Layer 2: Cobalt Blue Mid */}
              <div
                style={{
                  position: 'absolute',
                  top: '110px',
                  right: 0,
                  width: '40px',
                  height: '130px',
                  backgroundColor: 'var(--theme-primary)',
                  clipPath: 'polygon(100% 0, 0 30%, 0 70%, 100% 100%)',
                  zIndex: 1,
                }}
              />
              {/* Layer 3: Cyan Accent Lower */}
              <div
                style={{
                  position: 'absolute',
                  top: '180px',
                  right: 0,
                  width: '38px',
                  height: '110px',
                  backgroundColor: 'var(--theme-accent)',
                  clipPath: 'polygon(100% 0, 0 25%, 0 75%, 100% 100%)',
                  zIndex: 0,
                }}
              />

              {/* Top Header: Cube Icon + COMPANY NAME / TAGLINE */}
              <div
                style={{
                  paddingTop: '16px',
                  paddingBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  position: 'relative',
                  zIndex: 5,
                }}
              >
                {/* Hexagon 3D Cube Wireframe Icon */}
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary)" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      color: 'var(--theme-primary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {idCard.organization}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.55rem',
                      color: 'var(--theme-muted)',
                      letterSpacing: '0.12em',
                      display: 'block',
                      textTransform: 'uppercase',
                    }}
                  >
                    {idCard.tagline}
                  </span>
                </div>
              </div>

              {/* Photo Frame (Square with rounded corners + Cyan/Blue Border) */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '8px 0',
                  position: 'relative',
                  zIndex: 5,
                }}
              >
                <div
                  style={{
                    width: '108px',
                    height: '108px',
                    borderRadius: '16px',
                    border: '3px solid var(--theme-primary)',
                    boxShadow: '0 4px 14px rgba(42, 117, 211, 0.25)',
                    backgroundColor: 'var(--theme-soft)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <img
                    src={idCard.profileImage || profileImage}
                    alt={displayName}
                    onError={(e) => {
                      if (!e.target.dataset.triedFallback) {
                        e.target.dataset.triedFallback = 'true';
                        e.target.src = userProfileImg;
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 15%',
                      display: 'block',
                      transform: 'scale(1.45)',
                      transformOrigin: 'center',
                    }}
                  />
                </div>
              </div>

              {/* Name & Role */}
              <div style={{ textAlign: 'center', marginBottom: '8px', position: 'relative', zIndex: 5 }}>
                <h2
                  style={{
                    margin: '0 0 2px 0',
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    color: 'var(--theme-primary)',
                    textTransform: 'uppercase',
                  }}
                >
                  {displayName.toUpperCase()}
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--theme-primary)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  {role}
                </p>
              </div>

              {/* Details List (Aligned with colons - exactly like reference) */}
              <div
                style={{
                  margin: '0 auto',
                  width: '68%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  fontSize: '0.68rem',
                  fontFamily: "'Inter', sans-serif",
                  color: 'var(--theme-muted)',
                  marginBottom: '8px',
                  position: 'relative',
                  zIndex: 5,
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '50px 8px 1fr' }}>
                  <span style={{ color: 'var(--theme-muted)', fontWeight: 600 }}>ID No</span>
                  <span>:</span>
                  <span style={{ fontWeight: 700, color: 'var(--theme-primary)' }}>{idCard.idNumber}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '50px 8px 1fr' }}>
                  <span style={{ color: 'var(--theme-muted)', fontWeight: 600 }}>Blood</span>
                  <span>:</span>
                  <span style={{ fontWeight: 700, color: 'var(--theme-primary)' }}>{idCard.bloodType}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '50px 8px 1fr' }}>
                  <span style={{ color: 'var(--theme-muted)', fontWeight: 600 }}>Email</span>
                  <span>:</span>
                  <span style={{ fontWeight: 700, color: 'var(--theme-primary)' }}>{idCard.email}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '50px 8px 1fr' }}>
                  <span style={{ color: 'var(--theme-muted)', fontWeight: 600 }}>Phone</span>
                  <span>:</span>
                  <span style={{ fontWeight: 700, color: 'var(--theme-primary)' }}>{idCard.phone}</span>
                </div>
              </div>

              {/* QR Code */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', position: 'relative', zIndex: 5 }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    padding: '2px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                  }}
                >
                  <img
                    src="/images/qr-code.svg"
                    alt="QR Code"
                    style={{ width: '100%', height: '100%', display: 'block' }}
                  />
                </div>
              </div>

              {/* Bottom Website Bar with Rivet Screw Icons (Matching Reference) */}
              <div
                style={{
                  marginTop: 'auto',
                  backgroundColor: 'var(--theme-soft)',
                  color: 'var(--theme-ink)',
                  padding: '7px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.62rem',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  position: 'relative',
                  zIndex: 5,
                }}
              >
                {/* Left Rivet Dot */}
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--theme-accent)' }} />
                <span>{idCard.website}</span>
                {/* Right Rivet Dot */}
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--theme-accent)' }} />
              </div>
            </div>
          </Html>
        </group>

        {/* ─── 3. BACK FACE: EXACT REPLICA OF DROPPED IMAGE BACK ─── */}
        <group position={[0, -0.15, -0.052]} rotation={[0, Math.PI, 0]}>
          <Html
            transform
            distanceFactor={4.025}
            portal={portalTarget}
            wrapperClass="id-card-portal"
            style={{
              width: '315px',
              height: '445px',
              userSelect: 'none',
              pointerEvents: !isFlipped ? 'none' : 'auto',
              opacity: !isFlipped ? 0 : 1,
              transition: 'opacity 0.2s ease',
            }}
          >
            <div
              onPointerDown={handlePointerDown}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '14px',
                backgroundColor: 'var(--theme-surface)',
                outline: '4px solid rgba(var(--theme-accent-rgb), 0.45)',
                outlineOffset: '8px',
                boxShadow:
                  '0 8px 30px rgba(0, 0, 0, 0.25), 0 0 0 13px rgba(var(--theme-soft-rgb), 0.35)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                color: 'var(--theme-primary)',
                fontFamily: "'Inter', sans-serif",
                cursor: 'grab',
                pointerEvents: 'auto',
              }}
            >
              {/* Chevron Accents on Back */}
              <div
                style={{
                  position: 'absolute',
                  top: '50px',
                  left: 0,
                  width: '36px',
                  height: '180px',
                  backgroundColor: 'var(--theme-primary)',
                  clipPath: 'polygon(0 0, 100% 30%, 100% 70%, 0 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50px',
                  right: 0,
                  width: '36px',
                  height: '180px',
                  backgroundColor: 'var(--theme-primary)',
                  clipPath: 'polygon(100% 0, 0 30%, 0 70%, 100% 100%)',
                }}
              />

              {/* Back Header */}
              <div
                style={{
                  paddingTop: '16px',
                  paddingBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary)" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
                <h4 style={{ margin: 0, fontSize: '0.84rem', fontWeight: 800, color: 'var(--theme-primary)', letterSpacing: '0.08em' }}>
                  {idCard.organization}
                </h4>
              </div>

              {/* Large Centered QR Code on Back (Matches dropped image) */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    padding: '3px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid var(--theme-primary)',
                    borderRadius: '8px',
                  }}
                >
                  <img src="/images/qr-code.svg" alt="QR Code" style={{ width: '100%', height: '100%' }} />
                </div>
              </div>

              {/* Name & Title on Back */}
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <h3
                  style={{
                    margin: '0 0 2px 0',
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    color: 'var(--theme-primary)',
                    textTransform: 'uppercase',
                  }}
                >
                  {displayName.toUpperCase()}
                </h3>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--theme-primary)', letterSpacing: '0.1em' }}>
                  {role}
                </span>
              </div>

              {/* Dates & Status Grid (Matching reference image) */}
              <div
                style={{
                  width: '74%',
                  margin: '0 auto 8px auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  fontSize: '0.64rem',
                  fontFamily: "'Inter', sans-serif",
                  color: 'var(--theme-muted)',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '70px 8px 1fr' }}>
                  <span style={{ color: 'var(--theme-muted)', fontWeight: 600 }}>Joined Date</span>
                  <span>:</span>
                  <span style={{ fontWeight: 700, color: 'var(--theme-primary)' }}>{idCard.joinedDate}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '70px 8px 1fr' }}>
                  <span style={{ color: 'var(--theme-muted)', fontWeight: 600 }}>Expire Date</span>
                  <span>:</span>
                  <span style={{ fontWeight: 700, color: 'var(--theme-primary)' }}>{idCard.expireDate}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '70px 8px 1fr' }}>
                  <span style={{ color: 'var(--theme-muted)', fontWeight: 600 }}>Emp ID</span>
                  <span>:</span>
                  <span style={{ fontWeight: 700, color: 'var(--theme-primary)' }}>{idCard.employeeId}</span>
                </div>
              </div>

              {/* Dividing Line */}
              <div style={{ width: '74%', height: '1px', backgroundColor: 'var(--theme-soft)', margin: '4px auto 8px auto' }} />

              {/* Bullet Points (Matching dropped reference image) */}
              <div
                style={{
                  width: '74%',
                  margin: '0 auto',
                  fontSize: '0.58rem',
                  lineHeight: '1.4',
                  color: 'var(--theme-muted)',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {idCard.backNotes
                  .split(/\n\s*\n/)
                  .filter((note) => note.trim())
                  .map((note, index) => (
                    <p key={index} style={{ margin: index === 0 ? '0 0 4px 0' : 0 }}>
                      • {note}
                    </p>
                  ))}
              </div>

              {/* Bottom Strip (Matching dropped image back face) */}
              <div
                style={{
                  marginTop: 'auto',
                  backgroundColor: 'var(--theme-soft)',
                  color: 'var(--theme-ink)',
                  padding: '7px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--theme-accent)' }} />
                <span>LOREM IPSUM DOLOR SIT AMET</span>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--theme-accent)' }} />
              </div>
            </div>
          </Html>
        </group>
      </group>
    </>
  );
}

/* ─── Main Exported Component ─── */
export default function IDCard3D({ profileImage, displayName, role, idCard }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasWebGL] = useState(checkWebGLSupport);
  const htmlPortalRef = useRef(null);

  return (
    <div
      ref={htmlPortalRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        height: '560px',
        margin: '0 auto',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      {hasWebGL ? (
        <Canvas
          camera={{ position: [0, 0, 7.8], fov: 46 }}
          style={{
            width: '100%',
            height: '100%',
            overflow: 'visible',
            touchAction: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[4, 6, 6]} intensity={1.5} color="#FFFFFF" />
          <directionalLight position={[-4, 3, 4]} intensity={0.8} color="#a8dadc" />
          <pointLight position={[0, -1, 3]} intensity={1.0} color="#2b7cd3" distance={8} />

          <PlayablePhysicsBadge
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
            onDragStateChange={setIsDragging}
            portalTarget={htmlPortalRef}
            profileImage={profileImage}
            displayName={displayName}
            role={role}
            idCard={idCard}
          />
        </Canvas>
      ) : (
        <CSSFallbackCard
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
          profileImage={profileImage}
          displayName={displayName}
          role={role}
          idCard={idCard}
        />
      )}

      {/* Manual Controls Below Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '10px',
          position: 'relative',
          zIndex: 40,
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            background: 'linear-gradient(160deg, var(--theme-surface) 0%, var(--theme-soft) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
            borderRadius: '999px',
            color: 'var(--theme-ink)',
            padding: '8px 20px',
            fontSize: '0.8rem',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow:
              '0 14px 26px -14px rgba(var(--theme-primary-rgb), 0.5), inset 0 3px 6px rgba(var(--theme-surface-rgb),1), inset 0 -4px 8px rgba(var(--theme-primary-rgb),0.1)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(160deg, var(--theme-light) 0%, var(--theme-accent) 100%)';
            e.currentTarget.style.boxShadow =
              '0 18px 34px -14px rgba(var(--theme-primary-rgb), 0.6), inset 0 3px 6px rgba(var(--theme-surface-rgb),0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(160deg, var(--theme-surface) 0%, var(--theme-soft) 100%)';
            e.currentTarget.style.boxShadow =
              '0 14px 26px -14px rgba(var(--theme-primary-rgb), 0.5), inset 0 3px 6px rgba(var(--theme-surface-rgb),1), inset 0 -4px 8px rgba(var(--theme-primary-rgb),0.1)';
          }}
        >
          <RotateCcw size={14} color="var(--theme-primary)" />
          <span>{isFlipped ? 'Show Front of ID' : 'Flip to View Back'}</span>
        </button>

        <div
          style={{
            background: isDragging
              ? 'linear-gradient(160deg, var(--theme-accent) 0%, var(--theme-light) 100%)'
              : 'rgba(var(--theme-surface-rgb), 0.9)',
            border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
            borderRadius: '999px',
            color: 'var(--theme-ink)',
            padding: '8px 18px',
            fontSize: '0.78rem',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            userSelect: 'none',
            boxShadow:
              '0 12px 24px -14px rgba(var(--theme-primary-rgb), 0.45), inset 0 3px 6px rgba(var(--theme-surface-rgb),1)',
            transition: 'all 0.2s ease',
          }}
        >
          <Hand size={14} color="var(--theme-primary)" />
          <span>{isDragging ? 'Pulling Card Freely!' : 'Touch & Pull ID Anywhere'}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── CSS Fallback Card ─── */
function CSSFallbackCard({
  isFlipped,
  setIsFlipped,
  profileImage,
  displayName,
  role,
  idCard,
}) {
  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      style={{
        width: '345px',
        height: '487px',
        perspective: '1000px',
        cursor: 'pointer',
        margin: '0 auto',
        transform: 'scale(1.15)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            borderRadius: '20px',
            backgroundColor: 'var(--theme-surface)',
            border: '5px solid rgba(var(--theme-accent-rgb), 0.6)',
            boxShadow:
              '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 0 2px rgba(var(--theme-surface-rgb), 0.9)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'var(--theme-primary)',
          }}
        >
          <img
            src={idCard.profileImage || profileImage}
            alt={`${displayName} profile`}
            onError={(event) => {
              if (!event.currentTarget.dataset.triedFallback) {
                event.currentTarget.dataset.triedFallback = 'true';
                event.currentTarget.src = userProfileImg;
              }
            }}
            style={{ width: '108px', height: '108px', borderRadius: '14px', objectFit: 'cover', marginBottom: '12px', border: '3px solid var(--theme-primary)' }}
          />
          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '0 0 2px 0' }}>{displayName.toUpperCase()}</h2>
          <p style={{ color: 'var(--theme-primary)', fontSize: '0.72rem', fontWeight: 700 }}>{role}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.68rem', marginTop: '8px' }}>
            {idCard.organization} · {idCard.idNumber}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.68rem' }}>{idCard.email}</p>
        </div>
      </div>
    </div>
  );
}
