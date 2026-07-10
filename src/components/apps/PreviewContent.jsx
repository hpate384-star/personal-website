import React, { useState, useRef, useEffect, useContext } from 'react'
import { PROJECTS_DATA } from './ProjectsContent'
import { WindowCtx, TrafficLights } from '../Window'

const IconButton = ({ children, onClick, title, disabled, opacity = 0.8, active }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    style={{
      background: active ? 'rgba(0,0,0,0.08)' : 'transparent',
      border: 'none',
      color: '#4a4a4a', 
      opacity: disabled ? 0.3 : opacity,
      cursor: disabled ? 'default' : 'pointer',
      padding: '4px 6px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 'none',
      transition: 'background 0.1s, opacity 0.1s',
    }}
    onMouseEnter={(e) => {
      if (!disabled && !active) {
        e.currentTarget.style.background = 'rgba(0,0,0,0.06)'
        e.currentTarget.style.opacity = '1'
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled && !active) {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.opacity = opacity
      }
    }}
  >
    {children}
  </button>
)

const Divider = () => (
  <div style={{ width: 1, height: 16, backgroundColor: 'rgba(0,0,0,0.1)', margin: '0 4px' }} />
)

export function PreviewContent({ appId }) {
  const windowCtx = useContext(WindowCtx)
  const { onTitleBarMouseDown, onClose, onMinimize } = windowCtx || {}

  const parts = appId.split('_')
  const projectName = parts[1]
  const imageId = parts.slice(2).join('_')

  let imageSrc = null
  let imageLabel = 'Image'

  if (appId.startsWith('Preview_custom_')) {
    imageSrc = sessionStorage.getItem(appId)
    imageLabel = 'Preview'
  } else if (projectName && imageId && PROJECTS_DATA[projectName]) {
    const project = PROJECTS_DATA[projectName]
    const img = project.images.find(img => img.id === imageId)
    if (img) {
      imageSrc = img.src
      imageLabel = img.label || projectName
    }
  }

  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const containerRef = useRef(null)

  useEffect(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [appId])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus()
    }
  }, [])

  const clampPosition = (newX, newY, currentScale) => {
    if (!containerRef.current || currentScale <= 1) {
      return { x: 0, y: 0 }
    }
    const rect = containerRef.current.getBoundingClientRect()
    const maxX = (rect.width * (currentScale - 1)) / 2
    const maxY = (rect.height * (currentScale - 1)) / 2
    
    return {
      x: Math.min(Math.max(newX, -maxX), maxX),
      y: Math.min(Math.max(newY, -maxY), maxY)
    }
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e) => {
      e.preventDefault()
      const zoomFactor = e.ctrlKey ? 0.02 : 0.05
      const direction = e.deltaY < 0 ? 1 : -1
      
      setScale(prev => {
        const nextScale = Math.max(1, Math.min(prev + direction * zoomFactor * prev, 6))
        setPosition(pos => clampPosition(pos.x, pos.y, nextScale))
        return nextScale
      })
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  const handleZoomIn = () => {
    setScale(prev => {
      const nextScale = Math.min(prev * 1.5, 6)
      setPosition(pos => clampPosition(pos.x, pos.y, nextScale))
      return nextScale
    })
  }

  const handleZoomOut = () => {
    setScale(prev => {
      const nextScale = Math.max(prev / 1.5, 1)
      setPosition(pos => clampPosition(pos.x, pos.y, nextScale))
      return nextScale
    })
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleDoubleClick = () => {
    if (scale > 1) {
      handleReset()
    } else {
      setScale(2.5)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === '=' || e.key === '+') {
      e.preventDefault()
      handleZoomIn()
    } else if (e.key === '-') {
      e.preventDefault()
      handleZoomOut()
    } else if (e.key === '0') {
      e.preventDefault()
      handleReset()
    }
  }

  const handleMouseDown = (e) => {
    if (e.button !== 0 || scale <= 1) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return
    const newX = e.clientX - dragStart.current.x
    const newY = e.clientY - dragStart.current.y
    setPosition(clampPosition(newX, newY, scale))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#e2e2e2' }}>
      
      {}
      <div
        onMouseDown={onTitleBarMouseDown}
        style={{
          height: 52,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          backgroundColor: '#efefef', 
          borderBottom: '1px solid #d0d0d0',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 64 }}>
          {onClose && <TrafficLights onClose={onClose} onMinimize={onMinimize} />}
        </div>
        
        {}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: 8 }}>
          <IconButton title="Sidebar">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="9" y1="4" x2="9" y2="20" />
            </svg>
          </IconButton>
          <div style={{ marginLeft: -4, marginTop: 2, color: '#4a4a4a', opacity: 0.7 }}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 16 }}>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#4a4a4a', opacity: 0.9 }}>
              {imageLabel}
            </span>
          </div>
        </div>

        {}
        <div style={{ flex: 1 }} />

        {}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <IconButton title="Info">
            <svg viewBox="0 0 51.25 50.918" width="18" height="18">
              <g>
               <rect height="50.918" opacity="0" width="51.25" x="0" y="0"/>
               <path d="M25.4297 50.8789C39.4727 50.8789 50.8789 39.4922 50.8789 25.4492C50.8789 11.4062 39.4727 0 25.4297 0C11.3867 0 0 11.4062 0 25.4492C0 39.4922 11.3867 50.8789 25.4297 50.8789ZM25.4297 47.2461C13.3789 47.2461 3.63281 37.5 3.63281 25.4492C3.63281 13.3984 13.3789 3.65234 25.4297 3.65234C37.4805 3.65234 47.2266 13.3984 47.2266 25.4492C47.2266 37.5 37.4805 47.2461 25.4297 47.2461Z" fill="currentColor" />
               <path d="M20.957 39.4336L31.25 39.4336C32.1484 39.4336 32.8516 38.7695 32.8516 37.8906C32.8516 37.0312 32.1484 36.3477 31.25 36.3477L27.8125 36.3477L27.8125 22.6953C27.8125 21.5625 27.2266 20.7812 26.1328 20.7812L21.3281 20.7812C20.4297 20.7812 19.7266 21.4453 19.7266 22.3047C19.7266 23.1836 20.4297 23.8477 21.3281 23.8477L24.3945 23.8477L24.3945 36.3477L20.957 36.3477C20.0586 36.3477 19.375 37.0312 19.375 37.8906C19.375 38.7695 20.0586 39.4336 20.957 39.4336ZM25.2539 16.3281C26.9141 16.3281 28.2031 15 28.2031 13.3789C28.2031 11.7188 26.9141 10.3906 25.2539 10.3906C23.6133 10.3906 22.3047 11.7188 22.3047 13.3789C22.3047 15 23.6133 16.3281 25.2539 16.3281Z" fill="currentColor" />
              </g>
            </svg>
          </IconButton>

          <div style={{ width: 8 }} />

          <IconButton onClick={handleZoomOut} disabled={scale <= 1} title="Zoom Out (-)">
            <svg viewBox="0 0 49.1797 49.2773" width="18" height="18">
              <g>
               <rect height="49.2773" opacity="0" width="49.1797" x="0" y="0"/>
               <path d="M0 19.7656C0 30.6445 8.86719 39.5117 19.7656 39.5117C24.1602 39.5117 28.2031 38.0664 31.4844 35.625L44.3555 48.5156C44.8438 49.0234 45.5273 49.2773 46.2305 49.2773C47.7734 49.2773 48.8086 48.1055 48.8086 46.6406C48.8086 45.918 48.5547 45.293 48.0859 44.8047L35.2734 31.9336C37.9297 28.5938 39.5312 24.3555 39.5312 19.7656C39.5312 8.86719 30.6641 0 19.7656 0C8.86719 0 0 8.86719 0 19.7656ZM3.65234 19.7656C3.65234 10.8789 10.8789 3.65234 19.7656 3.65234C28.6523 3.65234 35.8594 10.8789 35.8594 19.7656C35.8594 28.6328 28.6523 35.8594 19.7656 35.8594C10.8789 35.8594 3.65234 28.6328 3.65234 19.7656Z" fill="currentColor" />
               <path d="M13.1836 21.3477L26.3086 21.3477C27.1875 21.3477 27.9102 20.625 27.9102 19.7656C27.9102 18.8867 27.1875 18.1641 26.3086 18.1641L13.1836 18.1641C12.3242 18.1641 11.6016 18.8867 11.6016 19.7656C11.6016 20.625 12.3242 21.3477 13.1836 21.3477Z" fill="currentColor" />
              </g>
            </svg>
          </IconButton>
          
          <IconButton onClick={handleZoomIn} disabled={scale >= 6} title="Zoom In (+)">
            <svg viewBox="0 0 49.1797 49.2773" width="18" height="18">
              <g>
               <rect height="49.2773" opacity="0" width="49.1797" x="0" y="0"/>
               <path d="M0 19.7656C0 30.6445 8.86719 39.5117 19.7656 39.5117C24.1602 39.5117 28.2031 38.0664 31.4844 35.625L44.3555 48.5156C44.8438 49.0234 45.5273 49.2773 46.2305 49.2773C47.7734 49.2773 48.8086 48.1055 48.8086 46.6406C48.8086 45.918 48.5547 45.293 48.0859 44.8047L35.2734 31.9336C37.9297 28.5938 39.5312 24.3555 39.5312 19.7656C39.5312 8.86719 30.6641 0 19.7656 0C8.86719 0 0 8.86719 0 19.7656ZM3.65234 19.7656C3.65234 10.8789 10.8789 3.65234 19.7656 3.65234C28.6523 3.65234 35.8594 10.8789 35.8594 19.7656C35.8594 28.6328 28.6523 35.8594 19.7656 35.8594C10.8789 35.8594 3.65234 28.6328 3.65234 19.7656Z" fill="currentColor" />
               <path d="M13.2031 21.3477L26.3086 21.3477C27.1875 21.3477 27.8906 20.6445 27.8906 19.7656C27.8906 18.8672 27.1875 18.1641 26.3086 18.1641L13.2031 18.1641C12.3047 18.1641 11.6016 18.8672 11.6016 19.7656C11.6016 20.6445 12.3047 21.3477 13.2031 21.3477ZM21.3477 26.3086L21.3477 13.2031C21.3477 12.3047 20.6445 11.6016 19.7656 11.6016C18.8672 11.6016 18.1641 12.3047 18.1641 13.2031L18.1641 26.3086C18.1641 27.207 18.8672 27.8906 19.7656 27.8906C20.6445 27.8906 21.3477 27.1875 21.3477 26.3086Z" fill="currentColor" />
              </g>
            </svg>
          </IconButton>

          <div style={{ width: 8 }} />

          <IconButton title="Share">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 44.5508 68.3398" width="22" height="22">
              <g>
                <rect height="68.3398" opacity="0" width="44.5508" x="0" y="0"/>
                <path d="M44.1797 30.1953L44.1797 49.4727C44.1797 56.1523 40.4688 59.8828 33.7695 59.8828L10.4102 59.8828C3.71094 59.8828 0 56.1523 0 49.4727L0 30.1953C0 23.5156 3.71094 19.8047 10.4102 19.8047L15.9766 19.8047L15.9766 23.2617L10.3906 23.2617C5.95703 23.2617 3.45703 25.7617 3.45703 30.1953L3.45703 49.4922C3.45703 53.9258 5.95703 56.4258 10.3906 56.4258L33.7695 56.4258C38.2227 56.4258 40.7227 53.9258 40.7227 49.4922L40.7227 30.1953C40.7227 25.7617 38.2227 23.2617 33.7695 23.2617L28.2031 23.2617L28.2031 19.8047L33.7695 19.8047C40.4688 19.8047 44.1797 23.5156 44.1797 30.1953Z" fill="currentColor" />
                <path d="M13.5156 15.3711C13.9258 15.3711 14.3945 15.1953 14.707 14.8438L18.9648 10.3906L22.0898 7.10938L25.2148 10.3906L29.4531 14.8438C29.7656 15.1953 30.2148 15.3711 30.625 15.3711C31.5234 15.3711 32.207 14.7266 32.207 13.8477C32.207 13.3984 32.0117 13.0469 31.6992 12.7148L23.3398 4.58984C22.9102 4.16016 22.5195 4.02344 22.0898 4.02344C21.6602 4.02344 21.2695 4.16016 20.8398 4.58984L12.4805 12.7148C12.1484 13.0469 11.9727 13.3984 11.9727 13.8477C11.9727 14.7266 12.6172 15.3711 13.5156 15.3711ZM22.0898 40.3711C23.0078 40.3711 23.8086 39.6094 23.8086 38.7109L23.8086 12.5L23.5547 6.25C23.5156 5.44922 22.8906 4.78516 22.0898 4.78516C21.2891 4.78516 20.6641 5.44922 20.625 6.25L20.3711 12.5L20.3711 38.7109C20.3711 39.6094 21.1719 40.3711 22.0898 40.3711Z" fill="currentColor" />
              </g>
            </svg>
          </IconButton>
        </div>
      </div>

      {}
      <div 
        ref={containerRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        style={{ 
          flex: 1, 
          backgroundColor: '#e2e2e2', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          overflow: 'hidden',
          position: 'relative',
          userSelect: 'none',
          touchAction: 'none',
          outline: 'none', 
        }}
      >
        {imageSrc ? (
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)',
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <img 
              src={imageSrc} 
              alt={imageLabel} 
              draggable={false}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain', 
                boxShadow: scale > 1 ? '0 12px 32px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.2)',
                borderRadius: '4px',
                pointerEvents: 'none',
                transition: 'box-shadow 0.2s',
              }} 
            />
          </div>
        ) : (
          <div style={{ color: '#888' }}>Image not found</div>
        )}
      </div>
    </div>
  )
}
