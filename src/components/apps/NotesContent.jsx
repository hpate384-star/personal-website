import React from 'react'
import { WindowCtx, TrafficLights } from '../Window'
import { EXPERIENCES_DATA } from './ExperienceContent'
import { PROJECTS_DATA } from './ProjectsContent'

export function NotesContent({ expId }) {
  const ctx = React.useContext(WindowCtx)
  const [activeNote, setActiveNote] = React.useState(expId || 'RBC')

  React.useEffect(() => {
    if (expId) setActiveNote(expId)
  }, [expId])

  const notesList = [
    ...Object.keys(EXPERIENCES_DATA).map(key => ({
      id: key, title: EXPERIENCES_DATA[key].folderName, preview: EXPERIENCES_DATA[key].title, section: 'Experience'
    })),
    ...Object.keys(PROJECTS_DATA).map(key => ({
      id: key, title: PROJECTS_DATA[key].folderName, preview: PROJECTS_DATA[key].title, section: 'Projects'
    }))
  ]

  const exp = EXPERIENCES_DATA[activeNote] || PROJECTS_DATA[activeNote]

  const [copied, setCopied] = React.useState(false)
  const handleCopy = () => {
    if (exp) {
      const textToCopy = `${exp.title}\n\n${exp.content}`
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
      })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', flex: 1, background: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
      
      {}
      <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e0e0e0', paddingRight: 16, flexShrink: 0, position: 'relative' }} className="title-bar no-select" onMouseDown={ctx?.onTitleBarMouseDown}>
        
        {}
        <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
          {ctx && <TrafficLights onClose={ctx.onClose} onMinimize={ctx.onMinimize} />}
        </div>

        <div style={{ width: 260, paddingLeft: 80, display: 'flex', gap: 16, color: '#6e6e73' }}>
        </div>

        {}
        <div style={{ flex: 1, display: 'flex', paddingLeft: 16, justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 20, color: '#6e6e73', alignItems: 'center' }}>
            <div title="Copy" onClick={handleCopy} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: copied ? '#34c759' : '#6e6e73', transition: 'color 0.2s ease' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </div>
            <div title="Share" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', background: 'transparent', border: '1px solid rgba(0, 0, 0, 0.15)',
              borderRadius: '8px', padding: '4px 10px', height: 28, width: 140, boxSizing: 'border-box', marginLeft: 8
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2" style={{ flexShrink: 0, marginRight: 6 }}>
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search"
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#1c1c1e', width: '100%', padding: 0, fontFamily: 'inherit' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: 260, flexShrink: 0, background: '#ffffff', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
            {notesList.map((note, index) => {
              const showSectionHeader = index === 0 || notesList[index - 1].section !== note.section;
              const isAdjacentToActive = !showSectionHeader && index > 0 && (activeNote === notesList[index - 1].id || activeNote === notesList[index].id)
              
              return (
                <React.Fragment key={note.id}>
                  {showSectionHeader && (
                    <div style={{ 
                      padding: '16px 16px 6px 18px', 
                      fontSize: 13, 
                      fontWeight: 700, 
                      color: '#86868b',
                    }}>
                      {note.section}
                    </div>
                  )}
                  {!showSectionHeader && index > 0 && (
                    <div style={{ height: 1, background: isAdjacentToActive ? 'transparent' : '#e5e5ea', margin: '0 12px 0 28px' }} />
                  )}
                  <div
                    onClick={() => setActiveNote(note.id)}
                    style={{
                      margin: '2px 12px', padding: '10px 16px',
                      background: activeNote === note.id ? '#fce895' : 'transparent',
                      borderRadius: '8px', cursor: 'default', transition: 'background-color 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1c1c1e', marginBottom: 2 }}>{note.title}</div>
                    <div style={{ fontSize: 12, color: '#6e6e73', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{note.preview}</div>
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1, padding: '24px 60px', overflowY: 'auto' }}>
          {exp ? (
            <>
              <div style={{ textAlign: 'center', fontSize: 12, color: '#86868b', marginBottom: 20 }}>
                July 8, 2026 at 5:02 PM
              </div>
              <h1 style={{ margin: '0 0 12px 0', fontSize: 28, fontWeight: 700, color: '#1c1c1e' }}>{exp.folderName}</h1>
              <h2 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 600, color: '#1c1c1e' }}>{exp.title}</h2>
              <div style={{ fontSize: 15, color: '#333', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {exp.content}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', fontSize: 12, color: '#86868b', marginTop: 100 }}>
              No Note Selected
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
