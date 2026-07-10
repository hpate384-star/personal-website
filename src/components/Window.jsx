"use client";

import React, { useState, useRef, useCallback, createContext } from 'react'
import GenieWrapper from './GenieWrapper'

const btnStyle = {
  width: 12, height: 12, borderRadius: '50%',
  border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)', outline: 'none',
}

export function TrafficLights({ onClose, onMinimize }) {
  const stopProp = (e) => e.stopPropagation()
  return (
    <div
      className="traffic-lights-group"
      style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
    >
      <button onMouseDown={stopProp} onClick={(e) => { stopProp(e); onClose() }} style={{ ...btnStyle, background: '#ff5f57' }}>
        <span className="traffic-light-glyph" style={{ color: '#820005', fontSize: 8, fontWeight: 900, lineHeight: 1 }}>✕</span>
      </button>
      <button onMouseDown={stopProp} onClick={(e) => { stopProp(e); onMinimize() }} style={{ ...btnStyle, background: '#febc2e' }}>
        <span className="traffic-light-glyph" style={{ color: '#7d5000', fontSize: 9, fontWeight: 900, lineHeight: 1 }}>−</span>
      </button>
      <button onMouseDown={stopProp} style={{ ...btnStyle, background: '#28c840' }}>
        <span className="traffic-light-glyph" style={{ color: '#006511', fontSize: 8, fontWeight: 900, lineHeight: 1 }}>⤢</span>
      </button>
    </div>
  )
}

export const WindowCtx = createContext(null)

function useDrag(initial, id, onDragStop) {
  const [pos, setPos] = useState(initial)
  const offset = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    e.preventDefault()
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }

    const onMove = (e) => setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y })
    const onUp = (e) => {
      onDragStop(id, e.clientX - offset.current.x, e.clientY - offset.current.y)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [pos, id, onDragStop])

  return { pos, onMouseDown }
}

function useResize(initial) {
  const [size, setSize] = useState(initial)
  const start = useRef({ mouseX: 0, mouseY: 0, w: 0, h: 0 })

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    e.preventDefault(); e.stopPropagation()
    start.current = { mouseX: e.clientX, mouseY: e.clientY, w: size.w, h: size.h }

    const onMove = (e) => setSize({
      w: Math.max(400, start.current.w + e.clientX - start.current.mouseX),
      h: Math.max(300, start.current.h + e.clientY - start.current.mouseY),
    })
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [size])

  return { size, onMouseDown }
}

export default function Window({
  id, app, title, x, y, width, height,
  zIndex, minimized, isClosing,
  onClose, onFullyClosed, onMinimize, onFocus, onDragStop, onOpenWindow,
  traySlotX, traySlotY,
  
  domRef,
  children
}) {
  const { pos, onMouseDown: onTitleBarMouseDown } = useDrag({ x, y }, id, onDragStop)
  const { size, onMouseDown: onResizeMouseDown } = useResize({ w: width, h: height })

  const isCustomTitleBar = app === 'Finder' || app === 'iMessage' || app.startsWith('Notes') || app.startsWith('Preview')

  return (
    <GenieWrapper
      id={id}
      isOpen={!minimized && !isClosing}
      isClosing={isClosing}
      traySlotX={traySlotX}
      traySlotY={traySlotY}
      pos={pos}
      size={size}
      zIndex={zIndex}
      onFocus={onFocus}
      onFullyClosed={onFullyClosed}
      domRef={domRef}
    >
      {!isCustomTitleBar && (
        <div
          className="title-bar no-select"
          onMouseDown={onTitleBarMouseDown}
          style={{
            height: 38, background: '#e8e8ed',
            borderRadius: '10px 10px 0 0',
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, cursor: 'grab',
          }}
        >
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
            <TrafficLights onClose={() => onClose(id)} onMinimize={() => onMinimize(id)} />
          </div>
          <span style={{
            fontSize: 13, fontWeight: 600, color: '#4a4a4a',
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            pointerEvents: 'none', whiteSpace: 'nowrap',
            maxWidth: 'calc(100% - 120px)', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {title || app}
          </span>
        </div>
      )}

      <div
        className="window-scroll"
        style={{
          flex: 1,
          background: isCustomTitleBar ? 'transparent' : '#fff',
          borderRadius: isCustomTitleBar ? '10px 10px 10px 10px' : '0 0 10px 10px',
          overflow: isCustomTitleBar ? 'hidden' : 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <WindowCtx.Provider value={{
          onTitleBarMouseDown,
          onClose: () => onClose(id),
          onMinimize: () => onMinimize(id),
          openWindow: onOpenWindow,
          isFinder: isCustomTitleBar,
        }}>
          {children}
        </WindowCtx.Provider>
      </div>

      <div
        className="resize-handle"
        onMouseDown={onResizeMouseDown}
        style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, cursor: 'se-resize', zIndex: 10 }}
      />
    </GenieWrapper>
  )
}
