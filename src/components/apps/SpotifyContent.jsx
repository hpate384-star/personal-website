import React from 'react'
import SpotifyWidget from '../SpotifyWidget'

export function SpotifyContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#000' }}>
      <SpotifyWidget />
    </div>
  )
}
