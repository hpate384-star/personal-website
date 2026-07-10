"use client";
import React, { useState, useEffect } from 'react'
import DraggableItem from './DraggableItem'
import folderImg from '../assets/finder.png'
import { supabase, getOrCreateSessionId } from '../lib/supabase'

const DESKTOP_ICONS = [
  { id: 'documents',   label: 'Documents' },
  { id: 'screenshots', label: 'Screenshots' },
  { id: 'photos',      label: 'Photos' },
]

const getDefaultPositions = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024
  return {
    documents: { x: width - 110, y: 60 },
    screenshots: { x: width - 110, y: 160 },
    photos: { x: width - 110, y: 260 },
  }
}

export default function DesktopIcons() {
  const [selected, setSelected] = useState([])
  const [iconPositions, setIconPositions] = useState(() => getDefaultPositions())
  const [isLoading, setIsLoading] = useState(true)

  
  useEffect(() => {
    async function loadPositions() {
      if (!supabase) {
        setIsLoading(false)
        return
      }
      try {
        const sessionId = getOrCreateSessionId()
        const { data, error } = await supabase
          .from('desktop_positions')
          .select('item_id, x, y')
          .eq('session_id', sessionId)

        if (error) {
          console.error('[Supabase] Failed to load desktop positions:', error)
          setIsLoading(false)
          return
        }
        if (data && data.length > 0) {
          const positions = { ...getDefaultPositions() }
          data.forEach(item => {
            positions[item.item_id] = { x: item.x, y: item.y }
          })
          setIconPositions(positions)
        }
        setIsLoading(false)
      } catch (err) {
        console.error('[Supabase] Unexpected error loading desktop positions:', err)
        setIsLoading(false)
      }
    }
    loadPositions()
  }, [])

  
  async function savePosition(itemId, x, y) {
    await savePositions([{ item_id: itemId, x, y }])
  }

  async function savePositions(positionUpdates) {
    if (!supabase || positionUpdates.length === 0) return
    try {
      const sessionId = getOrCreateSessionId()
      const rows = positionUpdates.map(({ item_id, x, y }) => ({
        session_id: sessionId,
        item_id,
        x,
        y,
      }))

      const { error } = await supabase
        .from('desktop_positions')
        .upsert(rows, {
          onConflict: 'session_id,item_id',
        })

      if (error) {
        console.error('[Supabase] Failed to save desktop positions:', error)
      }
    } catch (err) {
      console.error('[Supabase] Unexpected error saving desktop positions:', err)
    }
  }

  function handleClick(id, e) {
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

  function handleDoubleClick(id) {
    setSelected([])
    
  }

  function handleDragEnd(id, x, y) {
    setIconPositions(prev => ({
      ...prev,
      [id]: { x, y },
    }))
    savePosition(id, x, y)
  }

  function handleBatchDragEnd(deltaX, deltaY) {
    
    const newPositions = { ...iconPositions }
    const updates = []

    selected.forEach(itemId => {
      if (iconPositions[itemId]) {
        const newX = iconPositions[itemId].x + deltaX
        const newY = iconPositions[itemId].y + deltaY
        newPositions[itemId] = { x: newX, y: newY }
        updates.push({ item_id: itemId, x: newX, y: newY })
      }
    })

    setIconPositions(newPositions)
    savePositions(updates)
  }

  return (
    <>
      {!isLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10,
          }}
          onClick={() => setSelected([])}
        >
          {DESKTOP_ICONS.map(icon => (
            <div
              key={icon.id}
              style={{
                position: 'absolute',
                pointerEvents: 'auto',
              }}
            >
              <DraggableItem
                id={icon.id}
                x={iconPositions[icon.id].x}
                y={iconPositions[icon.id].y}
                label={icon.label}
                img={folderImg.src}
                selected={selected.includes(icon.id)}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                onDragEnd={handleDragEnd}
                onBatchDragEnd={handleBatchDragEnd}
                textColor="#fff"
                selectedBg="rgba(255, 255, 255, 0.2)"
                selectedTextColor="#fff"
                selectedTextBg="rgba(0, 100, 255, 0.7)"
                iconWidth={64}
                iconHeight={54}
                itemWidth={84}
                textShadow={true}
                gridSize={20}
                enableMultiSelect={true}
              />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
