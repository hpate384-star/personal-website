'use client'

import { useEffect } from 'react'

export function RightClickBlocker() {
  useEffect(() => {
    const handleContext = (e) => e.preventDefault()
    const handleKeydown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J' || e.key === 'U')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault()
      }
    }
    document.addEventListener('contextmenu', handleContext)
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('contextmenu', handleContext)
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [])
  return null
}
