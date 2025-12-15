import React from 'react'

export default function HUD({ score, message }) {
  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: 20,
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      fontSize: 24,
      zIndex: 10,
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
    }}>
      <div style={{ marginBottom: 10 }}>
        Score: A {score.A} - B {score.B}
      </div>
      {message && (
        <div style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: '#ffff00',
          animation: 'pulse 0.5s'
        }}>
          {message}
        </div>
      )}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
