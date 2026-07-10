import React from 'react'
import { PlaceholderSection } from '../WindowContent'

export function PhotosContent() {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['Recents', 'Favorites', 'People & Pets', 'Places'].map(album => (
          <div key={album} style={{
            padding: '6px 14px',
            background: '#f5f5f7',
            borderRadius: '100px',
            fontSize: '13px',
            color: '#1d1d1f',
            cursor: 'default',
            border: '1px solid #e5e5ea',
          }}>{album}</div>
        ))}
      </div>
      <PlaceholderSection label="PLACEHOLDER: Photo library grid" height={100} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <PlaceholderSection key={i} label={`Photo ${i + 1}`} height={80} color='#f0f0f5' />
        ))}
      </div>
    </div>
  )
}
