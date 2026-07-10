import React from 'react'

export function VSCodeContent() {
  return (
    <div style={{ display: 'flex', height: '100%', background: '#1e1e1e' }}>
      {}
      <div style={{
        width: '48px',
        background: '#333333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px 0',
        gap: '8px',
        flexShrink: 0,
      }}>
        {['📁', '🔍', '⑂', '🐞', '🧩'].map((icon, i) => (
          <div key={i} style={{
            width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '6px',
            cursor: 'default',
            fontSize: '16px',
            opacity: 0.7,
          }}>{icon}</div>
        ))}
      </div>
      {}
      <div style={{
        width: '180px',
        background: '#252526',
        borderRight: '1px solid #3c3c3c',
        padding: '12px 0',
        flexShrink: 0,
      }}>
        <div style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Explorer</div>
        {['portfolio/', '  src/', '    App.jsx', '    index.css', '  public/', 'package.json'].map((f, i) => (
          <div key={i} style={{
            padding: '3px 16px',
            fontSize: '13px',
            color: '#cccccc',
            cursor: 'default',
            whiteSpace: 'nowrap',
          }}>
            {f}
          </div>
        ))}
      </div>
      {}
      <div style={{ flex: 1, background: '#1e1e1e', padding: '20px', overflow: 'auto' }}>
        <div style={{ fontSize: '13px', fontFamily: '"SF Mono", "Fira Code", monospace', color: '#9cdcfe', lineHeight: '1.7' }}>
          <div style={{ color: '#608b4e' }}>{'// PLACEHOLDER: Portfolio source code'}</div>
          <div><span style={{ color: '#c586c0' }}>import</span> <span style={{ color: '#9cdcfe' }}>React</span> <span style={{ color: '#c586c0' }}>from</span> <span style={{ color: '#ce9178' }}>'react'</span></div>
          <br />
          <div><span style={{ color: '#569cd6' }}>export default function</span> <span style={{ color: '#dcdcaa' }}>Portfolio</span><span style={{ color: '#fff' }}>() {'{'}</span></div>
          <div style={{ paddingLeft: '16px' }}><span style={{ color: '#c586c0' }}>return</span> <span style={{ color: '#fff' }}>{'('}</span></div>
          <div style={{ paddingLeft: '32px', color: '#4ec9b0' }}>&lt;div className=<span style={{ color: '#ce9178' }}>"portfolio"</span>&gt;</div>
          <div style={{ paddingLeft: '48px', color: '#86868b' }}>{'/* Real content coming in Prompt 2 */'}</div>
          <div style={{ paddingLeft: '32px', color: '#4ec9b0' }}>&lt;/div&gt;</div>
          <div style={{ paddingLeft: '16px', color: '#fff' }}>{')'}</div>
          <div style={{ color: '#fff' }}>{'}'}</div>
        </div>
      </div>
    </div>
  )
}
