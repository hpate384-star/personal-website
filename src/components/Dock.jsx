"use client";
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { getWindowContent } from './WindowContent'
import { PROJECTS_DATA } from './apps/ProjectsContent'
import { saveLastOpened } from '../lib/supabase'

import finderImg from '../assets/Finder__Golden_Gate__QBpqXA0Dmz-e345c75b9d.png'
import safariImg from '../assets/icnsFile_6d51b050d5decc5c7f98b8d851bbd565_Safari.png'
import imessageImg from '../assets/icnsFile_20d359ab058eb0cf883b6b1690fc8edd_iMessage.png'
import vscodeImg from '../assets/Virtual_Studio_Code_Kvamz0nMPA-80381af2c3.png'
import photosImg from '../assets/icnsFile_9169c54cad74198883d2831f20d5a6de_Photos.png'
import spotifyImg from '../assets/spotify.png'
import notesImg from '../assets/notes.png'
import previewImg from '../assets/preview.png'

const BASE_SIZE = 60
const MAX_SIZE = 78
const ZONE = 140

export const DOCK_ICONS = [
  { id: 'Finder', label: 'Finder', src: finderImg.src, fallbackColor: 'linear-gradient(145deg, #1c88ff 0%, #0055e5 100%)' },
  { id: 'Safari', label: 'Safari', src: safariImg.src, fallbackColor: 'linear-gradient(145deg, #4cd964 0%, #1e88e5 100%)' },
  { id: 'iMessage', label: 'Messages', src: imessageImg.src, fallbackColor: 'linear-gradient(145deg, #34c759 0%, #119f35 100%)' },
  { id: 'VS Code', label: 'VS Code', src: vscodeImg.src, fallbackColor: 'linear-gradient(145deg, #0078d7 0%, #1a1a2e 100%)' },
  { id: 'Photos', label: 'Photos', src: photosImg.src, fallbackColor: 'linear-gradient(145deg, #ff6b9d 0%, #ff9a44 100%)' },
  { id: 'Preview', label: 'Preview', src: previewImg.src, fallbackColor: 'linear-gradient(145deg, #a1c4fd 0%, #c2e9fb 100%)' },
  { id: 'Spotify', label: 'Spotify', src: spotifyImg.src, fallbackColor: 'linear-gradient(145deg, #1db954 0%, #1aa34a 100%)' },
  { id: 'Notes', label: 'Notes', src: notesImg.src, fallbackColor: 'linear-gradient(145deg, #fced82 0%, #fced82 100%)' },
]

// Build a flat list of all images across all projects for the context menu
function getAllFinderImages() {
  const items = []
  Object.values(PROJECTS_DATA).forEach(proj => {
    proj.images.forEach(img => {
      items.push({
        appId: `Preview_${proj.folderName}_${img.id}`,
        label: img.label,
        src: img.src,
        project: proj.folderName,
      })
    })
  })
  return items
}

function FinderContextMenu({ onOpenImage, onClose }) {
  const items = getAllFinderImages()
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('[data-dock-icon="Finder"]')) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      transition={{ duration: 0.14, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 14px)',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(242, 242, 247, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '10px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10), inset 0 0.5px 0 rgba(255,255,255,0.6)',
        minWidth: '220px',
        maxWidth: '280px',
        overflow: 'hidden',
        zIndex: 9999,
        border: '0.5px solid rgba(0,0,0,0.1)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '6px 12px 4px',
        fontSize: '11px',
        fontWeight: 600,
        color: '#8e8e93',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        borderBottom: '0.5px solid rgba(0,0,0,0.08)',
      }}>
        Project Images
      </div>

      {/* Image list */}
      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
        {items.map((item, i) => (
          <div
            key={item.appId}
            onClick={() => { saveLastOpened('finder_preview', item.appId); onOpenImage(item.appId); onClose() }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              cursor: 'default',
              borderBottom: i < items.length - 1 ? '0.5px solid rgba(0,0,0,0.05)' : 'none',
              transition: 'background 0.08s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {/* Thumbnail */}
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 4,
              overflow: 'hidden',
              flexShrink: 0,
              background: '#ddd',
              border: '0.5px solid rgba(0,0,0,0.08)',
            }}>
              <img
                src={item.src}
                alt={item.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '12.5px',
                fontWeight: 500,
                color: '#1c1c1e',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>{item.label}</div>
              <div style={{
                fontSize: '10.5px',
                color: '#8e8e93',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}>{item.project}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}



function useDockIconSize(mouseX, index, total) {
  const size = useMotionValue(BASE_SIZE)

  useEffect(() => {
    return mouseX.on('change', (mx) => {
      if (mx === Infinity) { size.set(BASE_SIZE); return }
      const gap = 10
      const totalRestingWidth = (total * BASE_SIZE) + ((total - 1) * gap)
      const dockRestingLeft = (window.innerWidth / 2) - (totalRestingWidth / 2)
      const cx = dockRestingLeft + index * (BASE_SIZE + gap) + (BASE_SIZE / 2)
      const dist = Math.abs(mx - cx)
      const pct = Math.max(0, 1 - dist / ZONE)
      const eased = pct * pct * (3 - 2 * pct)
      size.set(BASE_SIZE + (MAX_SIZE - BASE_SIZE) * eased)
    })
  }, [mouseX, index, total, size])

  const springSize = useSpring(size, { stiffness: 400, damping: 24, mass: 0.6 })
  const lift = useTransform(springSize, [BASE_SIZE, MAX_SIZE], [0, -(MAX_SIZE - BASE_SIZE) * 0.5])
  return { springSize, lift }
}




function DockIcon({ icon, mouseX, openApps, onOpen, index, total, onContextMenu }) {
  const [bouncing, setBouncing] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [hovering, setHovering] = useState(false)
  const { springSize, lift } = useDockIconSize(mouseX, index, total)

  function handleClick() {
    if (bouncing) return
    setBouncing(true)
    setTimeout(() => { setBouncing(false); onOpen(icon.id) }, 1500)
  }

  function handleContextMenu(e) {
    e.preventDefault()
    if (onContextMenu) onContextMenu(e)
  }

  const isOpen = openApps.includes(icon.id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      {}
      <AnimatePresence>
        {hovering && (
          <motion.div
            key="tip"
            initial={{ opacity: 0, y: 6, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 6, scale: 0.9, x: '-50%' }}
            transition={{ duration: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
              pointerEvents: 'none', zIndex: 200,
            }}
          >
            <div style={{
              position: 'relative', background: 'rgba(236,236,238,0.97)', color: '#1c1c1e',
              fontSize: '13px', fontWeight: 600, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              padding: '5px 13px', borderRadius: '999px', whiteSpace: 'nowrap', letterSpacing: '-0.01em',
            }}>
              {icon.label}
              <div style={{
                position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%)',
                width: 0, height: 0,
                borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
                borderTop: '6px solid rgba(236,236,238,0.97)',
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onHoverStart={() => setHovering(true)}
        onHoverEnd={() => setHovering(false)}
        style={{ width: springSize, height: springSize, y: lift, cursor: 'pointer', originY: 1, originX: 0.5, flexShrink: 0 }}
        whileTap={{ scale: 0.88 }}
        data-dock-icon={icon.id}
      >
        <motion.div
          animate={bouncing ? {
            y: [0, -35, 0, -22, 0, -10, 0],
            transition: { duration: 1.5, ease: ['easeOut', 'easeIn', 'easeOut', 'easeIn', 'easeOut', 'easeIn'] }
          } : { y: 0 }}
          style={{ width: '100%', height: '100%' }}
        >
          {!imgError ? (
            <img
              src={icon.src} alt={icon.label} draggable={false}
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', borderRadius: '22%', objectFit: 'cover', display: 'block', pointerEvents: 'none', imageRendering: '-webkit-optimize-contrast' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%', borderRadius: '22%', background: icon.fallbackColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '30px', color: '#fff', fontWeight: 700, letterSpacing: '-0.02em',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)', userSelect: 'none',
            }}>
              {icon.id === 'VS Code' ? '{}' : icon.label[0]}
            </div>
          )}
        </motion.div>
      </motion.div>

      {}
      <div style={{
        width: '4px', 
        height: '4px', 
        borderRadius: '50%',
        background: isOpen ? 'rgba(0,0,0,0.65)' : 'transparent',
        marginTop: '4px', 
        flexShrink: '0', 
        transition: 'background 0.2s',
      }} />
    </div>
  )
}











const TILE_BASE_H = 52
const TILE_MAX_H = 68   
const TILE_ZONE = 120  

function useTileMagnification(mouseX, tileEl) {
  const scale = useMotionValue(1)

  useEffect(() => {
    return mouseX.on('change', (mx) => {
      if (mx === Infinity || !tileEl) { scale.set(1); return }
      const re2ct = tileEl.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const dist = Math.abs(mx - cx)
      const pct = Math.max(0, 1 - dist / TILE_ZONE)
      const eased = pct * pct * (3 - 2 * pct)
      scale.set(1 + (TILE_MAX_H / TILE_BASE_H - 1) * eased)
    })
  }, [mouseX, tileEl, scale])

  const springScale = useSpring(scale, { stiffness: 400, damping: 24, mass: 0.6 })
  
  const lift = useTransform(springScale, [1, TILE_MAX_H / TILE_BASE_H], [0, -(TILE_MAX_H - TILE_BASE_H) * 0.5])
  return { springScale, lift }
}





function MinimizedTile({ win, onRestore, tileRef }) {
  const [hovering, setHovering] = useState(false)

  const label = win.title || win.app

  const aspectRatio = (win.width && win.height) ? (win.width / win.height) : 1.5
  const tileW = Math.max(40, Math.min(140, TILE_BASE_H * aspectRatio))

  return (
    <div
      ref={(el) => {
        if (typeof tileRef === 'function') tileRef(el)
        else if (tileRef) tileRef.current = el
      }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
    >
      {}
      <AnimatePresence>
        {hovering && (
          <motion.div
            key="tile-tip"
            initial={{ opacity: 0, y: 6, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 6, scale: 0.9, x: '-50%' }}
            transition={{ duration: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
              pointerEvents: 'none', zIndex: 200,
            }}
          >
            <div style={{
              position: 'relative', background: 'rgba(236,236,238,0.97)', color: '#1c1c1e',
              fontSize: '12px', fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              padding: '4px 11px', borderRadius: '999px', whiteSpace: 'nowrap',
              letterSpacing: '-0.01em', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {label}
              <div style={{
                position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%)',
                width: 0, height: 0,
                borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
                borderTop: '6px solid rgba(236,236,238,0.97)',
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <motion.div
        onClick={() => onRestore(win.id)}
        onHoverStart={() => setHovering(true)}
        onHoverEnd={() => setHovering(false)}
        whileTap={{ scale: 0.94 }}
        style={{
          width: tileW,
          height: TILE_BASE_H,
          cursor: 'pointer',
          borderRadius: 8,
          overflow: 'hidden',
          flexShrink: 0,
          transformOrigin: 'bottom center',
          background: '#f0f0f0',
        }}
      >
        <div style={{
          width: win.width || 720,
          height: win.height || 480,
          transform: `scale(${tileW / (win.width || 720)}, ${TILE_BASE_H / (win.height || 480)})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          {getWindowContent(win.app)}
        </div>
      </motion.div>

      <div style={{ height: 12 }} />
    </div>
  )
}






const Dock = forwardRef(function Dock({ openApps, onOpen, minimizedWindows = [], onRestore }, dockRef) {
  const mouseX = useMotionValue(Infinity)
  const [finderMenuOpen, setFinderMenuOpen] = useState(false)

  
  const tileRefs = useRef({})

  
  useImperativeHandle(dockRef, () => ({
    getTraySlotRect(windowId) {
      const el = tileRefs.current[windowId]
      if (!el) return null
      return el.getBoundingClientRect()
    }
  }), [minimizedWindows])

  const hasTray = minimizedWindows.length > 0

  
  const dockSpring = { type: 'spring', stiffness: 340, damping: 30, mass: 0.8 }

  const activeIcons = [...DOCK_ICONS]

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        display: 'flex',
      }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {}
      <motion.div
        layout
        transition={dockSpring}
        style={{
          height: `${BASE_SIZE + 22}px`,
          padding: '0 14px',
          borderRadius: '24px',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 100%)',
          backdropFilter: 'blur(35px) saturate(210%)',
          WebkitBackdropFilter: 'blur(35px) saturate(210%)',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
          paddingBottom: '6px',
          overflow: 'visible',
        }}
      >
        {}
        {activeIcons.map((icon, idx) => (
          <motion.div key={icon.id} layout transition={dockSpring} style={{ flexShrink: 0, position: 'relative' }}>
            <AnimatePresence>
              {icon.id === 'Finder' && finderMenuOpen && (
                <FinderContextMenu
                  onOpenImage={(appId) => onOpen(appId)}
                  onClose={() => setFinderMenuOpen(false)}
                />
              )}
            </AnimatePresence>
            <DockIcon
              index={idx}
              total={activeIcons.length}
              icon={icon}
              mouseX={mouseX}
              openApps={openApps}
              onOpen={onOpen}
              onContextMenu={icon.id === 'Finder' ? () => setFinderMenuOpen(prev => !prev) : undefined}
            />
          </motion.div>
        ))}

        {}
        <AnimatePresence>
          {hasTray && (
            <motion.div
              key="divider"
              layout
              initial={{ opacity: 0, scaleY: 0, width: 0 }}
              animate={{ opacity: 1, scaleY: 1, width: 1 }}
              exit={{ opacity: 0, scaleY: 0, width: 0 }}
              transition={dockSpring}
              style={{
                height: 38,
                background: 'rgba(255,255,255,0.25)',
                borderRadius: 1,
                alignSelf: 'center',
                flexShrink: 0,
                marginBottom: 10,
                overflow: 'hidden',
              }}
            />
          )}
        </AnimatePresence>

        {}
        <AnimatePresence mode="popLayout">
          {minimizedWindows.map((win) => (
            <motion.div
              key={win.id}
              layout
              initial={{ opacity: 0, scale: 0.5, width: 0, flexBasis: 0 }}
              animate={{ opacity: 1, scale: 1, width: 'auto', flexBasis: 'auto' }}
              exit={{ opacity: 0, scale: 0.4, width: 0, flexBasis: 0 }}
              transition={dockSpring}
              style={{ overflow: 'hidden', flexShrink: 0 }}
            >
              <MinimizedTile
                win={win}
                onRestore={onRestore}
                mouseX={mouseX}
                tileRef={(el) => {
                  if (el) tileRefs.current[win.id] = el
                  else delete tileRefs.current[win.id]
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
})

export default Dock
