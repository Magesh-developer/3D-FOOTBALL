import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import Field from './Field'
import Ball from './Ball'
import Player from './Player'
import HUD from './HUD'

export default function Scene() {
  const ballRef = useRef()
  const playerARef = useRef()
  const playerBRef = useRef()
  const [score, setScore] = useState({ A: 0, B: 0 })
  const [goalMsg, setGoalMsg] = useState('')

  // controls: WASD + K for player A, arrows + Space for player B
  useEffect(() => {
    function onKey(e) {
      const step = 0.8
      // Player A controls (WASD)
      const a = playerARef.current
      if (a) {
        if (e.key === 'w') a.position.z -= step
        if (e.key === 's') a.position.z += step
        if (e.key === 'a') a.position.x -= step
        if (e.key === 'd') a.position.x += step
        if (e.key === 'k') {
          kick(a, 'A')
        }
      }

      // Player B controls (arrows)
      const b = playerBRef.current
      if (b) {
        if (e.key === 'ArrowUp') b.position.z -= step
        if (e.key === 'ArrowDown') b.position.z += step
        if (e.key === 'ArrowLeft') b.position.x -= step
        if (e.key === 'ArrowRight') b.position.x += step
        if (e.key === ' ') {
          kick(b, 'B')
        }
      }
    }

    function kick(playerMesh, team) {
      const ball = ballRef.current
      if (!ball || !playerMesh) return
      const dx = ball.position.x - playerMesh.position.x
      const dz = ball.position.z - playerMesh.position.z
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

  // goal detection and reset must run inside the <Canvas> render loop.
  // Move the frame-based logic into an in-Canvas controller component.
  function resetAfterGoal(ball) {
    setTimeout(() => setGoalMsg(''), 2000)
    if (ball) {
      ball.position.set(0, 0.5, 4)
      ball.userData.velocity = [0, 0, 0]
      ball.userData.lastTouched = null
    }
    if (playerARef.current) playerARef.current.position.set(0, 0.5, 8)
    if (playerBRef.current) playerBRef.current.position.set(0, 0.5, -8)
  }

  function SceneController() {
    useFrame(() => {
      const ball = ballRef.current
      if (!ball) return
      const z = ball.position.z
      const x = ball.position.x
      const goalZ = 24
      const goalXHalf = 3

      if (z >= goalZ && Math.abs(x) <= goalXHalf) {
        const scorer = ball.userData.lastTouched || 'A'
        setScore((s) => ({ ...s, A: s.A + 1 }))
        setGoalMsg(`GOAL! Team ${scorer}`)
        resetAfterGoal(ball)
      } else if (z <= -goalZ && Math.abs(x) <= goalXHalf) {
        const scorer = ball.userData.lastTouched || 'B'
        setScore((s) => ({ ...s, B: s.B + 1 }))
        setGoalMsg(`GOAL! Team ${scorer}`)
        resetAfterGoal(ball)
      }
    })

    return null
  }

  return (
    <>
      <HUD score={score} message={goalMsg} />
      <Canvas shadows camera={{ position: [0, 14, 26], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.3} />

        <Field />
        <Player ref={playerARef} position={[0, 0.5, 8]} color={'#ff0055'} />
        <Player ref={playerBRef} position={[0, 0.5, -8]} color={'#0055ff'} />
        <Ball ref={ballRef} position={[0, 0.5, 4]} />

        <OrbitControls maxPolarAngle={Math.PI / 2.2} />
        <Stats />
        <SceneController />
      </Canvas>
    </>
  )
}
