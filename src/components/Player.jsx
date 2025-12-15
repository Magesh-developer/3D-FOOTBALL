import React, { forwardRef } from 'react'
import { Html } from '@react-three/drei'

const Player = forwardRef(function Player(props, ref) {
  const color = props.color || '#ff0055'
  const pos = props.position ?? [0, 0.5, 0]
  const name = props.name || ''

  return (
    <mesh ref={ref} position={pos} castShadow>
      <boxGeometry args={[0.8, 1.6, 0.8]} />
      <meshStandardMaterial color={color} />
      {name && (
        <Html position={[0, 1.3, 0]} center>
          <div style={{ color: '#fff', padding: '2px 6px', background: 'rgba(0,0,0,0.5)', borderRadius: 4, fontSize: 12 }}>
            {name}
          </div>
        </Html>
      )}
    </mesh>
  )
})

export default Player
