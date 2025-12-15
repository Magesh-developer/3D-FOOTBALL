import React from 'react'

export default function Field() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 50]} />
        <meshStandardMaterial color={'#2a8f2a'} />
      </mesh>

      {/* center line */}
      <mesh position={[0, 0.01, 0]}> 
        <boxGeometry args={[0.2, 0.02, 50]} />
        <meshStandardMaterial color={'#ffffff'} />
      </mesh>

      {/* sidelines */}
      <mesh position={[15, 0.01, 0]}> 
        <boxGeometry args={[0.2, 0.02, 50]} />
        <meshStandardMaterial color={'#ffffff'} />
      </mesh>
      <mesh position={[-15, 0.01, 0]}> 
        <boxGeometry args={[0.2, 0.02, 50]} />
        <meshStandardMaterial color={'#ffffff'} />
      </mesh>

      {/* goals */}
      <mesh position={[0, 1, -24]}>
        <boxGeometry args={[6, 2, 0.5]} />
        <meshStandardMaterial color={'#cccccc'} />
      </mesh>
      <mesh position={[0, 1, 24]}>
        <boxGeometry args={[6, 2, 0.5]} />
        <meshStandardMaterial color={'#cccccc'} />
      </mesh>
    </group>
  )
}
