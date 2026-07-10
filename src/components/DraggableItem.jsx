
import React, { useState, useRef, useCallback } from 'react'
import { useZIndex } from '../hooks/useZIndex'


export default function DraggableItem({
  id,
  x,
  y,
  label,
  img,
  children,
  selected = false,
  onClick,
  onDoubleClick,
  onDragEnd,
  onBatchDragEnd,
  containerRef,
  textColor = '#1c1c1e',
  selectedBg = 'rgba(0, 100, 255, 0.15)',
  selectedTextColor = '#fff',
  selectedTextBg = '#0064ff',
  iconWidth = 52,
  iconHeight = 52,
  itemWidth = 80,
  textShadow = false,
  gridSize = 0,
  enableMultiSelect = false,
  style = {},
}) {
  const [position, setPosition] = useState({ x, y })
  const [isDragging, setIsDragging] = useState(false)
  const [zIndex, bringToFront] = useZIndex(1)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const offset = useRef({ x: 0, y: 0 })
  const initialPos = useRef({ x, y })

  
  React.useEffect(() => {
    setPosition({ x, y })
  }, [x, y])

  
  const snapToGrid = useCallback((value) => {
    if (gridSize <= 0) return value
    return Math.round(value / gridSize) * gridSize
  }, [gridSize])

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    e.stopPropagation()

    bringToFront()

    const isMultiSelectKey = e.metaKey || e.ctrlKey

    
    if (onClick && !isMultiSelectKey && !selected) {
      onClick(id, e)
    }

    dragStartPos.current = { x: e.clientX, y: e.clientY }
    initialPos.current = { x: position.x, y: position.y }
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }

    const handleMouseMove = (moveEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - dragStartPos.current.x)
      const deltaY = Math.abs(moveEvent.clientY - dragStartPos.current.y)

      if (deltaX > 15 || deltaY > 15) {
        setIsDragging(true)
      }

      if (isDragging || deltaX > 15 || deltaY > 15) {
        let newX = moveEvent.clientX - offset.current.x
        let newY = moveEvent.clientY - offset.current.y

        if (containerRef?.current) {
          const container = containerRef.current.getBoundingClientRect()
          const itemRect = { width: itemWidth, height: iconHeight + 30 }

          newX = Math.max(0, Math.min(newX, container.width - itemRect.width))
          newY = Math.max(0, Math.min(newY, container.height - itemRect.height))
        }

        setPosition({ x: newX, y: newY })
      }
    }

    const handleMouseUp = (upEvent) => {
      const deltaX = Math.abs(upEvent.clientX - dragStartPos.current.x)
      const deltaY = Math.abs(upEvent.clientY - dragStartPos.current.y)

      if (deltaX <= 15 && deltaY <= 15) {
        if (onClick) {
          onClick(id, upEvent)
        }
      } else {
        let finalX = upEvent.clientX - offset.current.x
        let finalY = upEvent.clientY - offset.current.y

        if (containerRef?.current) {
          const container = containerRef.current.getBoundingClientRect()
          const itemRect = { width: itemWidth, height: iconHeight + 30 }
          finalX = Math.max(0, Math.min(finalX, container.width - itemRect.width))
          finalY = Math.max(0, Math.min(finalY, container.height - itemRect.height))
        }

        setPosition({ x: finalX, y: finalY })

        if (enableMultiSelect && selected && onBatchDragEnd) {
          const moveDeltaX = finalX - initialPos.current.x
          const moveDeltaY = finalY - initialPos.current.y
          onBatchDragEnd(moveDeltaX, moveDeltaY)
        } else if (onDragEnd) {
          onDragEnd(id, finalX, finalY)
        }
      }

      setIsDragging(false)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [position, isDragging, id, onClick, onDragEnd, onBatchDragEnd, containerRef, itemWidth, iconHeight, gridSize, snapToGrid, selected, enableMultiSelect, bringToFront])

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation()
    if (onDoubleClick) {
      onDoubleClick(id, e)
    }
  }, [id, onDoubleClick])

  const labelStyle = {
    fontSize: 11,
    color: selected ? '#fff' : textColor,
    textAlign: 'center',
    lineHeight: 1.3,
    maxWidth: itemWidth - 8,
    wordBreak: 'break-word',
    background: selected ? '#007aff' : 'transparent',
    borderRadius: 4,
    padding: '1px 4px',
    display: 'inline-block',
    ...(textShadow && !selected && { textShadow: '0 1px 2px rgba(0,0,0,0.6)' }),
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        e.stopPropagation()
        if (!isDragging && onClick) {
          onClick(id, e)
        }
      }}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: itemWidth,
        gap: 3,
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none',
        zIndex: isDragging ? zIndex + 100 : zIndex,
        ...style,
      }}
    >
      <div style={{
        padding: '6px',
        borderRadius: 8,
        background: selected ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none', 
      }}>
        {children ? children : (
          <img
            src={img}
            alt={label}
            draggable={false}
            style={{
              width: iconWidth,
              height: iconHeight,
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      <span style={labelStyle}>{label}</span>
    </div>
  )
}
