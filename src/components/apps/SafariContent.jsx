import React from 'react'
import { PlaceholderSection } from '../WindowContent'

export function SafariContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {}
      <div style={{
        padding: '8px 16px',
        borderBottom: '1px solid #e5e5ea',
        background: '#f5f5f7',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      }}>
        <div style={{
          flex: 1,
          height: '28px',
          background: '#fff',
          borderRadius: '6px',
          border: '1px solid #d1d1d6',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          fontSize: '13px',
          color: '#86868b',
        }}>
          hetpatel.dev
        </div>
      </div>
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        <PlaceholderSection label="PLACEHOLDER: Portfolio hero / about section" height={120} />
        <PlaceholderSection label="PLACEHOLDER: Projects grid" height={180} />
        <PlaceholderSection label="PLACEHOLDER: Contact / footer" height={80} />
      </div>
    </div>
  )
}
