import { useState, useCallback } from 'react'
import { getNextZIndex } from '../lib/zIndex'

export function useZIndex(initialZ = 1) {
  const [zIndex, setZIndex] = useState(initialZ)
  
  const bringToFront = useCallback(() => {
    setZIndex(getNextZIndex())
  }, [])
  
  return [zIndex, bringToFront]
}
