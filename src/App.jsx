"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react'
import MenuBar from './components/MenuBar'
import Dock from './components/Dock'
import Window from './components/Window'
import DesktopIcons from './components/DesktopIcons'
import DesktopWidget from './components/DesktopWidget'
import ContactWidget from './components/ContactWidget'
import SpotifyNowPlayingWidget from './components/SpotifyNowPlayingWidget'
import { getWindowContent } from './components/WindowContent'
import { captureSnapshot } from './lib/captureSnapshot'
import { getNextZIndex } from './lib/zIndex'
import { getLastOpened } from './lib/supabase'

const BASE_WINDOW_X = 120
const BASE_WINDOW_Y = 48
const CASCADE_STEP = 24
const MAX_CASCADE = 5

const getInitialPosition = (i) => ({
  x: BASE_WINDOW_X + (i % MAX_CASCADE) * CASCADE_STEP,
  y: BASE_WINDOW_Y + (i % MAX_CASCADE) * CASCADE_STEP,
})

const WINDOW_TITLES = {
  Safari: 'Safari — Portfolio',
  'VS Code': 'portfolio — Visual Studio Code',
  iMessage: 'Messages',
}

const WINDOW_SIZES = {
  iMessage: { width: 840, height: 560 },
  Notes: { width: 840, height: 520 },
  Preview: { width: 1000, height: 750 },
  Photos: { width: 1050, height: 700, minWidth: 912, minHeight: 600 },
}

export default function App() {
  const [windows, setWindows] = useState([])
  const [activeApp, setActiveApp] = useState('Finder')
  const [selectionBox, setSelectionBox] = useState(null)
  const [showSpotifyWidget, setShowSpotifyWidget] = useState(false)

  const openCountRef = useRef(0)

  
  const dockRef = useRef(null)

  
  
  const windowDomRefs = useRef({})

  
  const selectionRef = useRef(null)
  useEffect(() => {
    const onMove = (e) => {
      if (!selectionRef.current) return
      setSelectionBox(prev => prev ? { ...prev, endX: e.clientX, endY: e.clientY } : null)
    }
    const onUp = () => {
      if (!selectionRef.current) return
      selectionRef.current = null
      setSelectionBox(null)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  const handleDesktopMouseDown = (e) => {
    if (e.button !== 0 || e.target !== e.currentTarget) return
    selectionRef.current = true
    setSelectionBox({ startX: e.clientX, startY: e.clientY, endX: e.clientX, endY: e.clientY })
    setActiveApp('Finder')
  }

  
  const updateWindow = useCallback((id, patch) =>
    setWindows(prev => prev.map(w => w.id === id ? { ...w, ...patch } : w))
    , [])

  const openWindow = useCallback((app) => {
    
    if (app === 'Spotify') {
      setShowSpotifyWidget(prev => !prev)
      setActiveApp('Spotify')
      return
    }

    // For the Preview dock icon, open the last viewed image from Supabase
    if (app === 'Preview') {
      getLastOpened('finder_preview').then(lastId => {
        doOpenWindow(lastId || 'Preview')
      })
      return
    }

    doOpenWindow(app)

    function doOpenWindow(targetApp) {
      const matchesApp = (w, t) => {
        if (t === 'Notes' || t.startsWith('Notes_')) return w.app === 'Notes' || w.app.startsWith('Notes_')
        if (t === 'Preview' || t.startsWith('Preview_')) return w.app === 'Preview' || w.app.startsWith('Preview_')
        return w.app === t
      }

      setWindows(prev => {
        const openMatches = prev.filter(w => matchesApp(w, targetApp) && !w.minimized && !w.isClosing)
        if (openMatches.length > 0) {
          const topMatch = openMatches.sort((a, b) => b.zIndex - a.zIndex)[0]
          return prev.map(w => w.id === topMatch.id ? { ...w, app: targetApp.startsWith('Notes_') || targetApp.startsWith('Preview_') ? targetApp : w.app, zIndex: getNextZIndex() } : w)
        }

        const minimizedMatches = prev.filter(w => matchesApp(w, targetApp) && (w.minimized || w.isClosing))
        if (minimizedMatches.length > 0) {
          const topMin = minimizedMatches.sort((a, b) => b.zIndex - a.zIndex)[0]
          return prev.map(w => w.id === topMin.id ? { ...w, app: targetApp.startsWith('Notes_') || targetApp.startsWith('Preview_') ? targetApp : w.app, minimized: false, isClosing: false, zIndex: getNextZIndex() } : w)
        }

        const pos = getInitialPosition(openCountRef.current++)
        const baseApp = targetApp.startsWith('Notes_') ? 'Notes' : targetApp.startsWith('Preview_') ? 'Preview' : targetApp
        const appSize = WINDOW_SIZES[baseApp] || { width: 720, height: 480 }

        let title = WINDOW_TITLES[targetApp] || targetApp
        if (targetApp.startsWith('Notes_')) {
          title = `${targetApp.split('_')[1]}.txt`
        } else if (targetApp.startsWith('Preview_')) {
          title = 'Preview'
        }

        return [...prev, {
          id: `${targetApp}-${Date.now()}`, app: targetApp,
          title,
          ...pos, ...appSize,
          zIndex: getNextZIndex(), minimized: false, isClosing: false,
          snapshot: null, traySlotX: null, traySlotY: null,
        }]
      })
      setActiveApp(targetApp)

      setTimeout(() => {
        setWindows(prev => {
          const openMatches = prev.filter(w => matchesApp(w, targetApp) && !w.minimized && !w.isClosing)
          if (openMatches.length > 0) {
            const topMatch = openMatches.sort((a, b) => b.zIndex - a.zIndex)[0]
            return prev.map(w => w.id === topMatch.id ? { ...w, zIndex: getNextZIndex() } : w)
          }
          return prev
        })
      }, 50)
    }
  }, [])

  const closeWindow = useCallback((id) => updateWindow(id, { isClosing: true }), [updateWindow])
  const fullyRemoveWindow = useCallback((id) => setWindows(prev => prev.filter(w => w.id !== id)), [])

  
  const minimizeWindow = useCallback(async (id) => {
    
    
    
    
    
    const dockEl = dockRef.current
    let traySlotX = null
    let traySlotY = null

    
    if (dockEl) {
      const rect = dockEl.getTraySlotRect?.(id)
      if (rect) {
        traySlotX = rect.left + rect.width / 2
        traySlotY = rect.top + rect.height / 2
      }
    }

    
    
    if (traySlotX === null) {
      const DOCK_ICONS_COUNT = 5
      const TILE_W = 80
      const TILE_GAP = 10
      const DIVIDER_W = 1 + 8 
      const PADDING = 14
      const ICON_SIZE = 60
      const ICON_GAP = 10
      const numMinimized = windows.filter(w => w.minimized).length

      const iconsWidth = DOCK_ICONS_COUNT * ICON_SIZE + (DOCK_ICONS_COUNT - 1) * ICON_GAP
      const dockTotalWidth = iconsWidth + DIVIDER_W + PADDING * 2

      
      const dockLeftEdge = (window.innerWidth - dockTotalWidth) / 2
      const trayStart = dockLeftEdge + PADDING + iconsWidth + DIVIDER_W
      const slotCenterX = trayStart + numMinimized * (TILE_W + TILE_GAP) + TILE_W / 2
      traySlotX = slotCenterX
      traySlotY = window.innerHeight - 10 - (60 + 22) / 2  
    }

    const win = windows.find(w => w.id === id)

    
    updateWindow(id, { minimized: true, traySlotX, traySlotY })
  }, [updateWindow, windows])

  
  const restoreWindow = useCallback((id) => {
    const dockEl = dockRef.current
    let traySlotX = null
    let traySlotY = null
    if (dockEl) {
      const rect = dockEl.getTraySlotRect?.(id)
      if (rect) {
        traySlotX = rect.left + rect.width / 2
        traySlotY = rect.top + rect.height / 2
      }
    }
    updateWindow(id, {
      minimized: false,
      isClosing: false,
      zIndex: getNextZIndex(),
      traySlotX,
      traySlotY,
      snapshot: null,   
    })
    setActiveApp(prev => {
      const win = windows.find(w => w.id === id)
      return win ? win.app : prev
    })
  }, [updateWindow, windows])

  const focusWindow = useCallback((id, app) => { updateWindow(id, { zIndex: getNextZIndex() }); setActiveApp(app) }, [updateWindow])
  const updateWindowPos = useCallback((id, x, y) => updateWindow(id, { x, y }), [updateWindow])

  const openApps = [...new Set(windows.map(w => {
    if (w.app.startsWith('Notes_')) return 'Notes'
    if (w.app.startsWith('Preview_')) return 'Preview'
    return w.app
  }))]
  
  if (showSpotifyWidget && !openApps.includes('Spotify')) {
    openApps.push('Spotify')
  }
  const minimizedWindows = windows.filter(w => w.minimized)

  const selBox = selectionBox
  const selW = selBox && Math.abs(selBox.endX - selBox.startX)
  const selH = selBox && Math.abs(selBox.endY - selBox.startY)

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      minWidth: '1280px',
      minHeight: '800px',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>
      {}
      <div
        onMouseDown={handleDesktopMouseDown}
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          backgroundImage: 'url(/wallpaper.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}
      />

      {}
      {selBox && selW > 2 && (
        <div style={{
          position: 'fixed',
          left: Math.min(selBox.startX, selBox.endX),
          top: Math.min(selBox.startY, selBox.endY),
          width: selW, height: selH,
          background: 'rgba(0,122,255,0.2)',
          border: '1px solid rgba(0,122,255,0.5)',
          zIndex: 15, pointerEvents: 'none',
        }} />
      )}

      <DesktopIcons />
      <DesktopWidget />
      <ContactWidget />
      {showSpotifyWidget && <SpotifyNowPlayingWidget />}

      {windows.map(win => (
        <Window
          key={win.id}
          {...win}
          width={win.width}
          height={win.height}
          minWidth={WINDOW_SIZES[win.app]?.minWidth}
          minHeight={WINDOW_SIZES[win.app]?.minHeight}
          onClose={closeWindow}
          onFullyClosed={fullyRemoveWindow}
          onMinimize={minimizeWindow}
          onFocus={() => focusWindow(win.id, win.app)}
          onDragStop={updateWindowPos}
          onOpenWindow={openWindow}
          traySlotX={win.traySlotX}
          traySlotY={win.traySlotY}
          domRef={(el) => {
            if (el) windowDomRefs.current[win.id] = el
            else delete windowDomRefs.current[win.id]
          }}
        >
          {getWindowContent(win.app)}
        </Window>
      ))}

      <MenuBar activeApp={activeApp} />

      <Dock
        ref={dockRef}
        openApps={openApps}
        onOpen={openWindow}
        minimizedWindows={minimizedWindows}
        onRestore={restoreWindow}
      />
    </div>
  )
}
