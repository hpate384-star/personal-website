import React from 'react'
import { WindowCtx, getInitialPos, TrafficLights } from '../Window'
import DraggableItem from '../DraggableItem'
import { supabase, getOrCreateSessionId } from '../../lib/supabase'

import folderImg from '../../assets/finder.png'
import profileImg from '../../assets/me.jpg'
import gmailIcon from '../../assets/gmail.png'
import callIcon from '../../assets/call.png'
import locationIcon from '../../assets/google-maps.png'
import zipImg from '../../assets/zip.png'
import linkedinIcon from '../../assets/linkedin.svg'
import researchgateIcon from '../../assets/ResearchGate.png'
import instagramIcon from '../../assets/instagram.svg'
import githubIcon from '../../assets/github.svg'

export function AboutMeContent({ view, setView, folders, setFolders, itemPositions, setItemPositions, savePositionsBatch }) {
  const [selected, setSelected] = React.useState([])
  const [expanding, setExpanding] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [openedFolderId, setOpenedFolderId] = React.useState(null)
  const containerRef = React.useRef(null)

  async function saveFolder(currentCount) {
    const sessionId = getOrCreateSessionId()

    if (!supabase) {
      setFolders(prev => [
        ...prev,
        { id: Date.now(), folder_name: 'about_me', folder_type: 'about_me' },
        { id: Date.now() + 1, folder_name: 'Contact', folder_type: 'contact' }
      ])
      return
    }

    try {
      const foldersToCreate = [
        { session_id: sessionId, folder_name: 'about_me', folder_type: 'about_me' },
        { session_id: sessionId, folder_name: 'Contact', folder_type: 'contact' }
      ]

      const { data, error } = await supabase
        .from('extracted_folders')
        .insert(foldersToCreate)
        .select()

      if (error) {
        console.error('[Supabase] Failed to save folders:', error)
        setFolders(prev => [
          ...prev,
          { id: Date.now(), folder_name: 'about_me', folder_type: 'about_me' },
          { id: Date.now() + 1, folder_name: 'Contact', folder_type: 'contact' }
        ])
        return
      }

      setFolders(prev => [...prev, ...data])
    } catch (err) {
      console.error('[Supabase] Unexpected error saving folders:', err)
      setFolders(prev => [
        ...prev,
        { id: Date.now(), folder_name: 'about_me', folder_type: 'about_me' },
        { id: Date.now() + 1, folder_name: 'Contact', folder_type: 'contact' }
      ])
    }
  }

  const icons = [
    { id: 'zip', label: 'about_me.zip', img: zipImg.src, type: 'zip' },
    ...folders.map((f, i) => ({
      id: `folder-${f.id ?? i}`,
      label: f.folder_name ?? 'about_me',
      img: folderImg.src,
      type: f.folder_type ?? 'about_me',
      folderId: f.id ?? i,
    })),
  ]

  function handleItemClick(id, e) {
    e.stopPropagation()
    const isMultiSelectKey = e.metaKey || e.ctrlKey

    if (isMultiSelectKey) {
      setSelected(prev =>
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      )
    } else {
      setSelected([id])
    }
  }

  function handleItemDoubleClick(id, e) {
    e.stopPropagation()

    if (id === 'zip') {
      handleZipDoubleClick()
    } else if (id.startsWith('folder')) {
      const folderIndex = icons.findIndex(icon => icon.id === id)

      if (folderIndex !== -1) {
        const folder = icons[folderIndex]

        if (folder.type === 'contact') {
          setOpenedFolderId(folder.folderId)
          setView('contact')
        } else {
          setView('content')
        }
      }
    } else if (id.startsWith(contactNs)) {
      const item = contactItems.find(item => item.id === id)
      if (item && item.href) {
        window.open(item.href, '_blank', 'noopener,noreferrer')
      }
    }
  }

  function handleItemDragEnd(id, x, y) {
    setItemPositions(prev => ({ ...prev, [id]: { x, y } }))
    if (typeof window !== 'undefined' && window.savePosition) {
       window.savePosition(id, x, y) 
    }
  }

  function handleBatchDragEnd(deltaX, deltaY) {
    setItemPositions(prev => {
      const newPositions = { ...prev }
      const batchUpdates = []
      selected.forEach(itemId => {
        if (newPositions[itemId]) {
          const newX = newPositions[itemId].x + deltaX
          const newY = newPositions[itemId].y + deltaY
          newPositions[itemId] = { x: newX, y: newY }
          batchUpdates.push({ itemId, x: newX, y: newY })
        }
      })
      if (batchUpdates.length > 0 && typeof window !== 'undefined' && window.savePositionsBatch) {
        window.savePositionsBatch(batchUpdates)
      } else if (batchUpdates.length > 0 && typeof savePositionsBatch === 'function') {
        savePositionsBatch(batchUpdates)
      }
      return newPositions
    })
  }

  function handleZipDoubleClick() {
    if (expanding) return  
    setExpanding(true)
    setProgress(0)
    const start = performance.now()
    const duration = 1800
    const countAtStart = folders.length  
    function tick(now) {
      const p = Math.min((now - start) / duration, 1)
      setProgress(p)
      if (p < 1) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setExpanding(false)
          setProgress(0)
          saveFolder(countAtStart)  
        }, 150)
      }
    }
    requestAnimationFrame(tick)
  }

  const LinkBadge = ({ href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        bottom: '-2px',
        right: '-2px',
        background: '#fff',
        borderRadius: '50%',
        width: '18px',
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        border: '1px solid #e0e0e0',
        zIndex: 10,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </a>
  )

  const contactNs = openedFolderId != null ? `contact-${openedFolderId}` : 'contact'
  const contactItems = [
    { id: `${contactNs}-linkedin`,     label: 'LinkedIn',     src: linkedinIcon.src     || linkedinIcon,     href: 'https://www.linkedin.com/in/hetp04/' },
    { id: `${contactNs}-github`,       label: 'GitHub',       src: githubIcon.src       || githubIcon,       href: 'https://github.com/Hetp04' },
    { id: `${contactNs}-researchgate`, label: 'ResearchGate', src: researchgateIcon.src || researchgateIcon, href: 'https://www.researchgate.net/profile/Het-Patel-56' },
    { id: `${contactNs}-instagram`,    label: 'Instagram',    src: instagramIcon.src    || instagramIcon,    href: 'https://www.instagram.com/hetp04/' },
  ]

  if (view === 'contact') {
    return (
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          background: '#fff',
          position: 'relative',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          userSelect: 'none',
        }}
        onClick={() => setSelected([])}
      >
        {contactItems.map((item, index) => {
          const defaultPos = { x: 28 + index * 110, y: 40 }
          const position = itemPositions[item.id] || defaultPos
          return (
            <DraggableItem
              key={item.id}
              id={item.id}
              x={position.x}
              y={position.y}
              label={item.label}
              selected={selected.includes(item.id)}
              onClick={handleItemClick}
              onDoubleClick={handleItemDoubleClick}
              onDragEnd={(id, x, y) => {
                setItemPositions(prev => ({ ...prev, [id]: { x, y } }))
                if (window.savePosition) window.savePosition(id, x, y)
                else if (typeof savePosition === 'function') savePosition(id, x, y)
              }}
              onBatchDragEnd={(deltaX, deltaY) => {
                setItemPositions(prev => {
                  const newPositions = { ...prev }
                  const batchUpdates = []
                  selected.forEach(itemId => {
                    if (newPositions[itemId]) {
                      const newX = newPositions[itemId].x + deltaX
                      const newY = newPositions[itemId].y + deltaY
                      newPositions[itemId] = { x: newX, y: newY }
                      batchUpdates.push({ itemId, x: newX, y: newY })
                    }
                  })
                  if (batchUpdates.length > 0 && typeof window !== 'undefined' && window.savePositionsBatch) {
                    window.savePositionsBatch(batchUpdates)
                  } else if (batchUpdates.length > 0 && typeof savePositionsBatch === 'function') {
                    savePositionsBatch(batchUpdates)
                  }
                  return newPositions
                })
              }}
              containerRef={containerRef}
              iconWidth={64}
              iconHeight={64}
              itemWidth={90}
              enableMultiSelect={true}
            >
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={item.src}
                  alt={item.label}
                  draggable={false}
                  style={{ width: 64, height: 64, borderRadius: '8px', display: 'block', pointerEvents: 'none' }}
                />
                <LinkBadge href={item.href} />
              </div>
            </DraggableItem>
          )
        })}
      </div>
    )
  }

  if (view === 'zip') {
    return (
      <div
        ref={containerRef}
        style={{
          width: '100%', height: '100%',
          background: '#fff',
          position: 'relative',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          userSelect: 'none',
        }}
        onClick={() => setSelected([])}
      >
        {icons.map(item => {
          const index = icons.findIndex(i => i.id === item.id)
          const position = itemPositions[item.id] || {
            x: 28 + (index % 4) * 110,
            y: 24 + Math.floor(index / 4) * 100
          }

          return (
            <DraggableItem
              key={item.id}
              id={item.id}
              x={position.x}
              y={position.y}
              label={item.label}
              img={item.img}
              selected={selected.includes(item.id)}
              onClick={handleItemClick}
              onDoubleClick={handleItemDoubleClick}
              onDragEnd={(id, x, y) => {
                setItemPositions(prev => ({ ...prev, [id]: { x, y } }))
                if (window.savePosition) window.savePosition(id, x, y)
                else if (typeof savePosition === 'function') savePosition(id, x, y)
              }}
              onBatchDragEnd={(deltaX, deltaY) => {
                setItemPositions(prev => {
                  const newPositions = { ...prev }
                  const batchUpdates = []
                  selected.forEach(itemId => {
                    if (newPositions[itemId]) {
                      const newX = newPositions[itemId].x + deltaX
                      const newY = newPositions[itemId].y + deltaY
                      newPositions[itemId] = { x: newX, y: newY }
                      batchUpdates.push({ itemId, x: newX, y: newY })
                    }
                  })
                  if (batchUpdates.length > 0 && typeof window !== 'undefined' && window.savePositionsBatch) {
                    window.savePositionsBatch(batchUpdates)
                  } else if (batchUpdates.length > 0 && typeof savePositionsBatch === 'function') {
                    savePositionsBatch(batchUpdates)
                  }
                  return newPositions
                })
              }}
              containerRef={containerRef}
              gridSize={110}
              enableMultiSelect={true}
            />
          )
        })}

        {expanding && (
          <div style={{
            position: 'absolute',
            bottom: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 300,
            background: '#ffffff',
            borderRadius: 10,
            boxShadow: '0 6px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.10)',
            border: '1px solid rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 100,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 28,
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              position: 'relative',
              flexShrink: 0,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
              }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#c8c8cc', boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)' }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1c1c1e', textAlign: 'center' }}>Archive Utility</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '11px 12px 11px 0' }}>
              <div style={{ width: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={zipImg.src} alt="zip" style={{ width: 32, height: 38, objectFit: 'contain' }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1c1c1e', marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Expanding "about_me.zip"...
                </div>

                <div style={{ height: 6, background: '#e5e5ea', borderRadius: 999, overflow: 'hidden', marginBottom: 5 }}>
                  <div style={{ height: '100%', width: `${progress * 100}%`, background: '#007aff', borderRadius: 999, transition: 'none' }} />
                </div>

                <div style={{ fontSize: 11, color: '#6e6e73', fontWeight: 400 }}>
                  {progress < 0.12 ? 'Calculating…' : progress < 1 ? `${(progress * 2.4).toFixed(1)} MB of 2.4 MB – About ${Math.ceil((1 - progress) * 3)} seconds` : 'Done'}
                </div>
              </div>

              <div
                onClick={e => { e.stopPropagation(); setExpanding(false); setProgress(0) }}
                style={{
                  width: 18, height: 18, borderRadius: '50%', background: '#aeaeb2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'default', flexShrink: 0, marginLeft: 10,
                }}
              >
                <svg width="7" height="7" viewBox="0 0 9 9" fill="none">
                  <line x1="1.5" y1="1.5" x2="7.5" y2="7.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="7.5" y1="1.5" x2="1.5" y2="7.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', height: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', overflow: 'hidden',
    }}>
      <div className="no-scrollbar" style={{ width: 190, flexShrink: 0, borderRight: '1px solid rgba(0,0,0,0.07)', background: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', gap: 12, overflowY: 'auto' }}>
        <img src={profileImg.src} alt="Het Patel" style={{ width: 80, height: 80, borderRadius: 20, objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1c1c1e', letterSpacing: '-0.2px' }}>Het Patel</div>
          <div style={{ fontSize: 11.5, color: '#86868b', marginTop: 3, lineHeight: 1.4 }}>Software Developer<br />@ Manulife</div>
        </div>

        <div style={{ width: '100%', height: 1, background: 'rgba(0,0,0,0.07)' }} />

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[
            { icon: gmailIcon.src, label: 'hetpate384@gmail.com' },
            { icon: callIcon.src, label: '+1 647 291 6312' },
            { icon: locationIcon.src, label: 'London, ON' },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={icon} alt="" width="14" height="14" style={{ flexShrink: 0, objectFit: 'contain' }} />
              <span style={{ fontSize: 11.5, color: '#3a3a3c', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ width: '100%', height: 1, background: 'rgba(0,0,0,0.07)' }} />

        <div style={{ width: '100%' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#8a8a8e', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 7 }}>Stack</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {['Python', 'React', 'TypeScript', 'MongoDB', 'SQL', 'AWS'].map(s => (
              <span key={s} style={{ padding: '2px 8px', background: '#ebebf0', borderRadius: 20, fontSize: 11, color: '#3a3a3c', fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: '#8a8a8e', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>About</div>
          <p style={{ margin: 0, fontSize: 12.5, color: '#3a3a3c', lineHeight: 1.65 }}>
            Third-year Computer Science Honours student at Western University. Interested in full-stack development and software design.
          </p>
        </div>

        <div style={{ height: 1, background: 'rgba(0,0,0,0.07)' }} />

        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: '#8a8a8e', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Publications</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { title: 'Evaluating the Efficacy of LLMs in Identifying Phishing Attempts', venue: 'HSI24 International Conference' },
              { title: 'The Evolution of Speech Synthesis', venue: 'ACM CUI 2025 · Upcoming' },
            ].map((pub, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: '#f5f5f7', borderRadius: 8, alignItems: 'flex-start' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1c1c1e', lineHeight: 1.4 }}>{pub.title}</div>
                  <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>{pub.venue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(0,0,0,0.07)' }} />

        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: '#8a8a8e', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Hackathon Wins</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { name: 'TrackStack', desc: 'Expense tracking with interactive charts & analytics.', award: 'Best Overall · Duck Hacks 2024' },
              { name: 'Piano Improvisation', desc: 'Note suggestions, backing tracks, & music theory tools.', award: 'Winner · United Hacks 2024' },
            ].map((proj, i) => (
              <div key={i} style={{ padding: '10px 12px', background: '#f5f5f7', borderRadius: 8 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1c1c1e', marginBottom: 4 }}>{proj.name}</div>
                <div style={{ fontSize: 11.5, color: '#555', lineHeight: 1.5, marginBottom: 6 }}>{proj.desc}</div>
                <div style={{ fontSize: 10.5, color: '#007aff', fontWeight: 600 }}>🏆 {proj.award}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
