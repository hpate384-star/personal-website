'use client'

import { useState } from 'react'

export default function SpotifySetup() {
  const [token, setToken] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const instruction = `Update REFRESH_TOKEN in src/components/SpotifyNowPlayingWidget.jsx to:\nconst REFRESH_TOKEN = '${token}';`
    navigator.clipboard.writeText(instruction)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px',
      maxWidth: '600px',
      margin: '0 auto',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#1DB954' }}>🎵 Spotify Setup</h1>
      
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Do you have a refresh token?</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          If you have an existing Spotify refresh token, paste it here and I'll tell you what to do with it.
        </p>
        
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your refresh token here..."
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '2px solid #ddd',
            fontFamily: 'monospace',
            fontSize: '12px',
            minHeight: '100px',
            boxSizing: 'border-box',
            marginBottom: '15px'
          }}
        />
        
        {token && (
          <div style={{
            background: '#f0f0f0',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '15px',
            border: '2px solid #1DB954'
          }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Next step:</p>
            <code style={{
              display: 'block',
              background: 'white',
              padding: '12px',
              borderRadius: '4px',
              wordBreak: 'break-all',
              fontSize: '12px',
              marginBottom: '10px'
            }}>
              const REFRESH_TOKEN = '{token}';
            </code>
            <p style={{ margin: '10px 0', fontSize: '14px', color: '#666' }}>
              Update this in: <code>src/components/SpotifyNowPlayingWidget.jsx</code> (around line 11)
            </p>
            <button
              onClick={handleCopy}
              style={{
                background: '#1DB954',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {copied ? '✓ Copied!' : 'Copy Instruction'}
            </button>
          </div>
        )}
      </div>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Don't have a token?</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          You need to get one from Spotify. But the OAuth flow requires a public HTTPS URL, which is tricky locally.
        </p>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          For now, your portfolio shows placeholder Spotify tiles which looks good. You can add real data later when you deploy the site.
        </p>
      </div>
    </div>
  )
}
