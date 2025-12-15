import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stats, PerspectiveCamera } from '@react-three/drei'
import Field from './Field'
import Ball from './Ball'
import Player from './Player'
import HUD from './HUD'

export default function GameScene() {
  const ballRef = useRef(null)
  const playerARef = useRef(null)
  const [score, setScore] = useState({ A: 0, B: 0 })
  const [goalMsg, setGoalMsg] = useState('')
  // keyboard controls (no changes)
  useEffect(() => {
    function onKey(e) {
      const step = 0.8
      const a = playerARef.current

      // player A (WASD + K)
      if (a) {
        if (e.key === 'w') a.position.z -= step
        if (e.key === 's') a.position.z += step
        if (e.key === 'a') a.position.x -= step
        if (e.key === 'd') a.position.x += step
        if (e.key === 'k') kick(a, 'A')
      }
    }

    function kick(player, team) {
      const ball = ballRef.current
      if (!ball) return
      const dx = ball.position.x - player.position.x
      const dz = ball.position.z - player.position.z
      const dist = Math.sqrt(dx * dx + dz * dz)
      if (dist < 2.5) {
        if (!ball.userData.velocity) ball.userData.velocity = [0, 0, 0]
        ball.userData.velocity[0] = dx * 4
        ball.userData.velocity[2] = dz * 4
        ball.userData.velocity[1] = 6
        ball.userData.lastTouched = team
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // reset helper used by the in-Canvas controller
  function resetPositions(ball) {
    setTimeout(() => setGoalMsg(''), 2000)
    if (ball && ball.reset) ball.reset([0, 0.5, 4])
    if (playerARef.current) playerARef.current.position.set(0, 0.5, 8)
  }

  // In React-Three-Fiber, `useFrame` must run in a component that is
  // rendered inside the <Canvas>. Create a tiny controller component
  // that will be placed inside the Canvas so it has R3F context.
  function GameController() {
    useFrame(() => {
      const ball = ballRef.current
      if (!ball) return
      const z = ball.position.z
      const x = ball.position.x
      const goalZ = 24
      const goalXHalf = 3

      if (z >= goalZ && Math.abs(x) <= goalXHalf) {
        const team = ball.userData.lastTouched || 'A'
        setScore((s) => ({ ...s, A: s.A + 1 }))
        setGoalMsg(`GOAL! Team ${team}`)
        resetPositions(ball)
      } else if (z <= -goalZ && Math.abs(x) <= goalXHalf) {
        const team = ball.userData.lastTouched || 'B'
        setScore((s) => ({ ...s, B: s.B + 1 }))
        setGoalMsg(`GOAL! Team ${team}`)
        resetPositions(ball)
      }
    })

    return null
  }

  // --- On-screen button controls (mobile / mouse) ---
  // Keep the same logic as keyboard so behavior is identical.
  const movePlayer = (dx, dz) => {
    const a = playerARef.current
    if (!a) return
    a.position.x += dx
    a.position.z += dz
  }

  const doKick = () => {
    const player = playerARef.current
    const ball = ballRef.current
    if (!player || !ball) return
    const dx = ball.position.x - player.position.x
    const dz = ball.position.z - player.position.z
    const dist = Math.sqrt(dx * dx + dz * dz)
    if (dist < 2.5) {
      if (!ball.userData.velocity) ball.userData.velocity = [0, 0, 0]
      ball.userData.velocity[0] = dx * 4
      ball.userData.velocity[2] = dz * 4
      ball.userData.velocity[1] = 6
      ball.userData.lastTouched = 'A'
    }
  }

  return (
    <>
      <HUD score={score} message={goalMsg} />
      {/* On-screen controls (positioned above canvas) */}
      <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 20, pointerEvents: 'auto' }}>
        <div style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
          <button aria-label="Up" onPointerDown={() => movePlayer(0, -0.8)} style={{ padding: 8 }}>↑</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button aria-label="Left" onPointerDown={() => movePlayer(-0.8, 0)} style={{ padding: 8 }}>←</button>
            <button aria-label="Kick" onPointerDown={doKick} style={{ padding: 8, background: '#ff0055', color: '#fff' }}>Kick</button>
            <button aria-label="Right" onPointerDown={() => movePlayer(0.8, 0)} style={{ padding: 8 }}>→</button>
          </div>
          <button aria-label="Down" onPointerDown={() => movePlayer(0, 0.8)} style={{ padding: 8 }}>↓</button>
        </div>
      </div>
      <Canvas 
        shadows 
        camera={{ position: [0, 14, 26], fov: 50 }}
      >
        <color attach="background" args={['#87ceeb']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
        <pointLight position={[-10, 20, -10]} intensity={0.5} />

        <Field />
        <Player ref={playerARef} position={[0, 0.5, 8]} color="#ff0055" name="Player" />
        <Ball ref={ballRef} position={[0, 0.5, 4]} />

        <OrbitControls maxPolarAngle={Math.PI / 2.2} />
        <GameController />
      </Canvas>
    </>
  )
}
