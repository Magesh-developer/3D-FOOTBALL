import React, { forwardRef, useRef, useImperativeHandle } from 'react'
import { useFrame } from '@react-three/fiber'

const Ball = forwardRef(function Ball(props, ref) {
  const mesh = useRef(null)

  useImperativeHandle(ref, () => mesh.current)

  useFrame((state, delta) => {
    if (!mesh.current) return
    const m = mesh.current
    if (!m.userData.velocity) m.userData.velocity = [0, 0, 0]
    const v = m.userData.velocity

    // simple integration
    v[1] -= 9.81 * delta
    m.position.x += v[0] * delta
    m.position.y += v[1] * delta
    m.position.z += v[2] * delta

    // ground collision
    const radius = 0.5
    if (m.position.y <= radius) {
      m.position.y = radius
      if (Math.abs(v[1]) > 0.5) v[1] = -v[1] * 0.4
      else v[1] = 0
      v[0] *= 0.98
      v[2] *= 0.98
      if (Math.abs(v[0]) < 0.01) v[0] = 0
      if (Math.abs(v[2]) < 0.01) v[2] = 0
    }

    // attach reset helper
    if (m && !m.reset) {
      m.reset = (pos = [0, 0.5, 4]) => {
        m.position.set(pos[0], pos[1], pos[2])
        m.userData.velocity = [0, 0, 0]
        m.userData.lastTouched = null
      }
    }
  })

  return (
    <mesh ref={mesh} castShadow position={props.position ?? [0, 0.5, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={'#ffffff'} metalness={0.3} roughness={0.6} />
    </mesh>
  )
})

export default Ball